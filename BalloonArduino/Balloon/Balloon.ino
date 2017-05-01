 #include <Servo.h> 

int incomingData = 0;  
Servo Servo;
float Angle;

void setup() {
  Serial.begin(115200);
  Servo.attach(3);

}

void loop() {
  if (Serial.available() > 0) {
          // read the incoming byte:
          incomingData = Serial.read();
          Serial.println(incomingData, DEC);
  }
  
  if(incomingData == 0) {
    Servo.write(55);
  } else if (incomingData == 1) {
    Servo.write(139);
  } else {
    Servo.write(100);
  }
}
