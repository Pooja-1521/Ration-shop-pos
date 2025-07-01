import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import mysql from 'mysql2';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Adjust as necessary
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: '', // replace with your MySQL password
  database: 'ration_management', // replace with your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log('✅ Connected to MySQL!');
});

// Setup Serial Port (adjust COM port as needed)
const port = new SerialPort({
  path: 'COM3', // Change this if needed
  baudRate: 9600,
});

// ✅ Log when serial port is open
port.on('open', () => {
  console.log('✅ Serial port opened successfully!');
});

// ❌ Log if it ever closes
port.on('close', () => {
  console.log('❌ Serial port closed.');
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// Handle serial port errors
port.on('error', (err) => {
  console.error('Serial port error:', err);
  io.emit('dispense-error', 'Arduino connection error');
});

// Handle incoming serial data
parser.on('data', (data) => {
  data = data.trim();
  console.log('Arduino:', data);

  if (data === 'READY') {
    console.log('Arduino is ready');
  } else if (data === 'COMPLETE') {
    io.emit('dispense-complete');
  } else if (data.startsWith('ERROR:')) {
    io.emit('dispense-error', data.substring(6));
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle dispense requests from web client
  socket.on('dispense', async (data, callback) => {
    console.log('Dispense request:', data);

    if (!port.isOpen) {
      callback({ success: false, error: 'Arduino not connected' });
      return;
    }

    try {
      // Check inventory before dispensing
      const [inventory] = await db.promise().query('SELECT * FROM inventory WHERE name = ?', [data.item]);
      const item = inventory[0];

      if (!item) {
        callback({ success: false, error: 'Item not found in inventory' });
        return;
      }

      if (item.quantity < data.quantity) {
        callback({ success: false, error: 'Insufficient stock' });
        return;
      }

      // Update inventory in MySQL
      await db.promise().query(
        'UPDATE inventory SET quantity = quantity - ? WHERE name = ?',
        [data.quantity, data.item]
      );

      // Record the transaction in MySQL
      await db.promise().query(
        'INSERT INTO transactions (family_id, item_name, quantity) VALUES (?, ?, ?)',
        [data.family_id, data.item, data.quantity]
      );

      // Send command to Arduino
      const command = `DISPENSE,${data.item},${data.quantity}\n`;
      port.write(command, (err) => {
        if (err) {
          console.error('Write error:', err);
          callback({ success: false, error: 'Failed to send command to Arduino' });
          return;
        }
        callback({ success: true });
      });

    } catch (error) {
      console.error('Dispensing error:', error);
      callback({ success: false, error: 'Dispensing failed' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
