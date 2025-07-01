#include <Servo.h>

// Define servos for each item
Servo riceServo;   // Pin 5
Servo wheatServo;  // Pin 6
Servo sugarServo;  // Pin 9

// Calibration values (adjust these based on your setup)
const float GRAMS_PER_SECOND = 100.0; // How many grams dispensed per second
const int SERVO_OPEN_ANGLE = 90;
const int SERVO_CLOSED_ANGLE = 0;

// Status LED pin
const int STATUS_LED = 13;  // Built-in LED

void setup() {
  // Initialize serial communication
  Serial.begin(9600);
  
  // Setup status LED
  pinMode(STATUS_LED, OUTPUT);
  
  // Attach servos to pins
  riceServo.attach(5);
  wheatServo.attach(6);
  sugarServo.attach(9);
  
  // Initialize servo positions
  initializeServos();
  
  // Send ready message
  Serial.println("READY");
}

void initializeServos() {
  riceServo.write(SERVO_CLOSED_ANGLE);
  wheatServo.write(SERVO_CLOSED_ANGLE);
  sugarServo.write(SERVO_CLOSED_ANGLE);
}

void dispenseItem(Servo& servo, float quantity) {
  // Calculate dispensing time based on quantity (in kg)
  int dispensingTime = (quantity * 1000) / GRAMS_PER_SECOND * 1000; // Convert to milliseconds
  
  digitalWrite(STATUS_LED, HIGH);
  
  // Open valve (servo to dispensing angle)
  servo.write(SERVO_OPEN_ANGLE);
  delay(5000);  // Keep the servo in the open position for 5 seconds
  
  // Close valve (return to closed position)
  servo.write(SERVO_CLOSED_ANGLE);
  delay(500);  // Short delay to ensure the servo fully closes
  
  digitalWrite(STATUS_LED, LOW);
  
  // Send completion message
  Serial.println("COMPLETE");
}

void handleDispenseCommand(const char* item, float quantity) {
  Servo* targetServo = nullptr;
  
  if (strcmp(item, "rice") == 0) targetServo = &riceServo;
  else if (strcmp(item, "wheat") == 0) targetServo = &wheatServo;
  else if (strcmp(item, "sugar") == 0) targetServo = &sugarServo;

  if (targetServo) {
    dispenseItem(*targetServo, quantity);
  } else {
    Serial.println("ERROR: Invalid item");
  }
}

void processSerialCommand() {
  // Format: DISPENSE,item,quantity
  // Example: DISPENSE,rice,5.0
  
  String command = Serial.readStringUntil('\n');
  command.trim();
  
  if (command.startsWith("DISPENSE,")) {
    // Parse command
    int firstComma = command.indexOf(',');
    int secondComma = command.indexOf(',', firstComma + 1);
    
    if (firstComma != -1 && secondComma != -1) {
      String item = command.substring(firstComma + 1, secondComma);
      float quantity = command.substring(secondComma + 1).toFloat();
      
      handleDispenseCommand(item.c_str(), quantity);
    } else {
      Serial.println("ERROR: Invalid command format");
    }
  }
}

void loop() {
  if (Serial.available()) {
    processSerialCommand();
  }
  
  // Blink status LED to show the system is running
  digitalWrite(STATUS_LED, millis() % 1000 > 500);
}
