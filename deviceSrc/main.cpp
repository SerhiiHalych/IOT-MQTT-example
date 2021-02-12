#include <Arduino.h>
#include <LiquidCrystal_I2C.h>
#include <PubSubClient.h>
#include <WiFi.h>

const char *passwifi = "********";
const char *ssidwifi = "*********";

const char *mqtt_server = "broker.emqx.io";

const int potPin = 34;

int potValue;

LiquidCrystal_I2C lcd(0x27, 16, 2);
WiFiClient espClient;
PubSubClient client(espClient);

void receivedCallback(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Message received: ");
  Serial.println(topic);

  Serial.print("payload: ");

  for (int i = 0; i < length; i++)
  {
    Serial.println((char)payload[i]);
  }

  Serial.println();

  payload[length] = '\0';
  String strPayload = String((char *)payload);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(strPayload);

  Serial.println(strPayload);
}

void mqttconnect()
{
  while (!client.connected())
  {
    Serial.print("MQTT connecting ...");

    String clientId = "ESP32Client";

    if (client.connect(clientId.c_str()))
    {
      Serial.println("connected");

      client.subscribe("iot-mqtt-example/lcd-display");
    }
    else
    {
      Serial.print("failed, status code =");
      Serial.print(client.state());
      Serial.println("try again in 5 seconds");

      delay(5000);
    }
  }
}

void setup()
{
  Serial.begin(115200);

  WiFi.begin(ssidwifi, passwifi);

  while (WiFi.status() != WL_CONNECTED)
  {

    Serial.print(".");

    delay(1000);
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  lcd.init();

  lcd.backlight();

  potValue = analogRead(potPin);

  client.setServer(mqtt_server, 1883);

  client.setCallback(receivedCallback);
}

long lastMsg = millis();

void loop()
{
  if (!client.connected())
  {
    mqttconnect();
  }

  client.loop();

  long now = millis();

  if (now - lastMsg > 1000)
  {
    lastMsg = now;

    int newPotValue = analogRead(potPin);

    potValue = newPotValue;

    char cstr[5];

    itoa(potValue, cstr, 10);

    client.publish("iot-mqtt-example/potentiometer", cstr);
  }
}