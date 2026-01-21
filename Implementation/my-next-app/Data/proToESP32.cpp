#include <WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>

// ---------- USER SETTINGS ----------
const char* WIFI_SSID = "Unreliable Wifi";
const char* WIFI_PASS = "Blending838#";

const char* MQTT_HOST = "192.168.1.50";   // IP of Mosquitto server (your PC/RPi/docker host)
const uint16_t MQTT_PORT = 1883;

const char* DEVICE_ID = "tank1";
const char* MQTT_TOPIC = "sensors/water/tank1";

// Telegram
const char* TG_BOT_TOKEN = "123456:ABC..."; // from BotFather
const char* TG_CHAT_ID   = "123456789";     // your chat id

// ADC pins (ADC1 recommended)
static const int PH_PIN  = 34;
static const int ORP_PIN = 35;
//EC and Temp
#define EC_RX_PIN 16
#define EC_TX_PIN 17

HardwareSerial ECSerial(2); //UART2

// If you used a 10k/10k divider, ESP32 sees ~half the module voltage.
// This only affects voltage display; calibration comes later.
static const float ADC_REF_V = 3.3f;

// Alert thresholds (example)
static const float PH_LOW = 6.5;
static const float PH_HIGH = 8.5;
static const float ORP_LOW = 100;
static const float ORP_HIGH = 600;

// ---------- MQTT ----------
WiFiClient wifiClient;
PubSubClient mqtt(wifiClient);

// Send Telegram message (simple + reliable approach: TLS insecure)
// For best security you can pin cert later; this gets you running fast.
bool telegramSend(const String& text) {
  WiFiClientSecure client;
  client.setInsecure(); // quick start

  HTTPClient https;
  String url = "https://api.telegram.org/bot" + String(TG_BOT_TOKEN) + "/sendMessage";

  https.begin(client, url);
  https.addHeader("Content-Type", "application/x-www-form-urlencoded");

  String body = "chat_id=" + String(TG_CHAT_ID) + "&text=" + text;
  int code = https.POST(body);

  https.end();
  return (code > 0 && code < 300);
}

void wifiEnsure() {
  if (WiFi.status() == WL_CONNECTED) return;

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  uint32_t start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 20000) {
    delay(300);
  }
}

void mqttEnsure() {
  while (!mqtt.connected()) {
    String clientId = String("esp32-") + DEVICE_ID;
    mqtt.connect(clientId.c_str()); // add user/pass here if you enable auth
    delay(500);
  }
}

float adcToVolts(int raw) {
  return (raw / 4095.0f) * ADC_REF_V;
}

void setup() {
  Serial.begin(115200);

  analogReadResolution(12);
  analogSetAttenuation(ADC_11db); // better for 0-3.3V range

  wifiEnsure();
  mqtt.setServer(MQTT_HOST, MQTT_PORT);

  if (WiFi.status() == WL_CONNECTED) {
    telegramSend(String("✅ ") + DEVICE_ID + " booted. IP=" + WiFi.localIP().toString());
  }
}

void loop() {
  wifiEnsure();
  if (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    return;
  }

  mqttEnsure();
  mqtt.loop();

  // Read ADC
  int phRaw  = analogRead(PH_PIN);
  int orpRaw = analogRead(ORP_PIN);

  float phV  = adcToVolts(phRaw);
  float orpV = adcToVolts(orpRaw);

  // TODO: Replace these placeholder conversions with your calibration
  // For now we publish voltages so you can verify the pipeline end-to-end.
  float phValue  = phV;   // placeholder: publish volts until calibrated
  float orpValue = orpV;  // placeholder

  // Build JSON
  char payload[180];
  snprintf(payload, sizeof(payload),
    "{\"device\":\"%s\",\"ph\":%.4f,\"orp\":%.4f,\"temp\":%.2f}",
    DEVICE_ID, phValue, orpValue, NAN
  );

  mqtt.publish(MQTT_TOPIC, payload);

  // Simple alert example: will be nonsense until you calibrate phValue/orpValue properly.
  // You can switch this to voltage-based alerts for now if you prefer.
  static uint32_t lastAlertMs = 0;
  if (millis() - lastAlertMs > 60000) {
    bool phBad  = (phValue < PH_LOW || phValue > PH_HIGH);
    bool orpBad = (orpValue < ORP_LOW || orpValue > ORP_HIGH);
    if (phBad || orpBad) {
      String msg = "⚠️ " + String(DEVICE_ID) + " out of range\n"
                 + "ph=" + String(phValue, 4) + "\n"
                 + "orp=" + String(orpValue, 4);
      telegramSend(msg);
      lastAlertMs = millis();
    }
  }

  delay(5000);
}
