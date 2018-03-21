#include <ESP8266WiFi.h>
#include <Servo.h>

// -------- WIFI -----------

const char *ouiFi = "Pierre_qui_roule";
const char *motSecret = "n amasse pas mousse";

// -------- SERVO -----------

Servo servo;
int servoPin = 2;

// -------- LED -----------

int ledPin = 13; // GPIO13

// -------- SERVER -----------

WiFiServer server(80);

String status;

void setup() {
    Serial.begin(9600);
    delay(10);

    pinMode(ledPin, OUTPUT);
    digitalWrite(ledPin, LOW);

    // Connect to WiFi network
    Serial.print("Connecting to ");
    Serial.println(ouiFi);
    WiFi.begin(ouiFi, motSecret);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("WiFi connected");

    // Start the server
    server.begin();
    Serial.println("Server started");

    // Print the IP address
    Serial.print("Use this URL to connect: ");
    Serial.print("http://");
    Serial.print(WiFi.localIP());
    Serial.println("/");

    // -------------   SERVO SETUP   -------------------
    servo.attach(servoPin);
    servo.write(0);
    delay(2000);

}

void loop() {
    // Check if a client has connected
    WiFiClient client = server.available();
    if (!client) {
        return;
    }

    // Wait until the client sends some data
    Serial.println("New client!");
    while (!client.available()) {
        delay(1);
    }

    // Read the first line of the request
    String request = client.readStringUntil('\r');
    Serial.println(request);
    client.flush();

    // Match the request
    if (request.indexOf("/ORDER=ON") != -1) {
        digitalWrite(ledPin, HIGH);
        status = "ON";
    }
    if (request.indexOf("/ORDER=AUTO") != -1) {
        digitalWrite(ledPin, LOW);
        status = "AUTO";
    }
    if (request.indexOf("/STATUS") != -1) {
        sendStatus(status, client);
    }

    //servo.write(90);
    //delay(1000);
    //servo.write(0);
    //delay(1000);

    delay(2);
    Serial.println("Client disonnected");
    Serial.println("");

}

void sendStatus(String status, WiFiClient client) {
    // Return the response
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: text/json");
    client.println();

    client.println("{");
    client.print("\t\"status\": ");
    client.print(status);
    client.println("}");
}
 
