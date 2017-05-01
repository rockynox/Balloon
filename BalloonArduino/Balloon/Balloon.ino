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
  
  if(incomingData) {
    Servo.write(55);
  } else {
    Servo.write(139);
  }
}
