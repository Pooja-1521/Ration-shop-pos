import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

const WEBSOCKET_URL = 'http://localhost:3000';

class WebSocketService {
  private static instance: WebSocketService;
  private socket: Socket;
  private reconnectInterval: number = 5000;
  private maxReconnectAttempts: number = 5;
  private reconnectAttempts: number = 0;

  private constructor() {
    this.socket = io(WEBSOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectInterval,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      toast.error('Lost connection to dispenser. Attempting to reconnect...');
    });

    this.socket.on('connect_error', () => {
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        toast.error('Failed to connect to dispenser. Please check the connection.');
      }
    });

    this.socket.on('dispense-complete', () => {
      toast.success('Dispensing completed successfully');
    });

    this.socket.on('dispense-error', (error) => {
      toast.error(`Dispensing error: ${error}`);
    });
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public dispenseItem(item: string, quantity: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket.connected) {
        reject(new Error('Not connected to dispenser'));
        return;
      }

      this.socket.emit('dispense', { item, quantity }, (response: any) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error || 'Dispensing failed'));
        }
      });
    });
  }

  public isConnected(): boolean {
    return this.socket.connected;
  }
}

export default WebSocketService;