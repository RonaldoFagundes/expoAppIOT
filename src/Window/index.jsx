//npm install @react-native-community/slider
import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import mqtt from 'mqtt';

export default function Window() {

  const [status, setStatus] = useState(0);


  const client = useRef(null);






useEffect(() => {

    const mqttClient = mqtt.connect('ws://broker.hivemq.com:8000/mqtt');

    mqttClient.on('connect', () => {
        console.log('MQTT conectado');
        mqttClient.subscribe('esp32/window/state');
    });


    mqttClient.on('message', (topic, message) => {
        if (topic === 'esp32/window/state') {
            setStatus(Number(message.toString()));
        }
    });


    mqttClient.on('error', (err) => {
        console.log(err);
    });


    client.current = mqttClient;

    return () => mqttClient.end();

}, []);





function sendMessageControl(value) {

    if (!client.current?.connected) return;

    client.current.publish(
        'esp32/window/set',
        String(value)
    );

}










  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Persiana
      </Text>

      <Text style={styles.value}>
        {status}%
      </Text>

      <Slider
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={status}
        onValueChange={(value)=>setStatus(value)}
        onSlidingComplete={(value)=>sendMessageControl(value)}
      />

    </View>
  );
}



const styles = StyleSheet.create({

  container:{
    flex:1,
    justifyContent:'center',
    padding:20
  },

  title:{
    fontSize:28,
    fontWeight:'bold'
  },

  value:{
    fontSize:22,
    marginVertical:20
  }

});


/*
#include <WiFi.h>
#include <PubSubClient.h>
#include <ESP32Servo.h>

// WiFi do Wokwi
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// Broker MQTT
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;

// Objetos
WiFiClient espClient;
PubSubClient client(espClient);
Servo servo;

// Pinos
const int SERVO_PIN = 18;
const int LED_PIN = 2;

// Estado da persiana
int porcentagem = 0;

//------------------------------------------------

void setupWifi() {

  Serial.print("Conectando ao WiFi");

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi conectado!");
  Serial.println(WiFi.localIP());
}

//------------------------------------------------

void callback(char* topic, byte* payload, unsigned int length) {

  String msg = "";

  for (int i = 0; i < length; i++) {
    msg += (char)payload[i];
  }

  Serial.print("Mensagem recebida: ");
  Serial.println(msg);

  porcentagem = msg.toInt();

  // Limita entre 0 e 100
  porcentagem = constrain(porcentagem, 0, 100);

  // Converte porcentagem para ângulo
  int angulo = map(porcentagem, 0, 100, 0, 180);

  servo.write(angulo);

  // Liga LED quando aberta
  if (porcentagem > 0) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }

  // Envia estado para o aplicativo
  client.publish(
    "esp32/window/state",
    String(porcentagem).c_str()
  );

  Serial.print("Servo: ");
  Serial.print(angulo);
  Serial.println(" graus");
}

//------------------------------------------------

void reconnect() {

  while (!client.connected()) {

    Serial.println("Conectando MQTT...");

    if (client.connect("ESP32_PERSIANA")) {

      Serial.println("MQTT conectado!");

      client.subscribe("esp32/window/set");

    } else {

      Serial.print("Erro: ");
      Serial.println(client.state());

      delay(2000);
    }
  }
}

//------------------------------------------------

void setup() {

  Serial.begin(115200);

  pinMode(LED_PIN, OUTPUT);

  servo.attach(SERVO_PIN);

  setupWifi();

  client.setServer(mqtt_server, mqtt_port);

  client.setCallback(callback);
}

//------------------------------------------------

void loop() {

  if (!client.connected()) {
    reconnect();
  }

  client.loop();
}

*/




/*

#include <WiFi.h>
#include <PubSubClient.h>
#include <ESP32Servo.h>

//========================
// Configuração Wi-Fi
//========================
const char* ssid = "Wokwi-GUEST";
const char* password = "";

//========================
// Configuração MQTT
//========================
const char* mqttServer = "broker.hivemq.com";
const int mqttPort = 1883;
const char* mqttTopic = "esp32/door";

//========================
// Objetos
//========================
WiFiClient espClient;
PubSubClient client(espClient);
Servo servoMotor;

//========================
// Pinos
//========================
const byte SERVO_PIN = 5;
const byte LED_OPEN = 2;
const byte LED_CLOSE = 12;

//==================================================
// Conecta ao Wi-Fi
//==================================================
void setupWiFi() {

  Serial.println("Conectando ao Wi-Fi...");

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("Wi-Fi conectado!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}




//==================================================
// Callback MQTT
//==================================================
void callback(char* topic, byte* payload, unsigned int length) {

  char mensagem[20];

  if (length >= sizeof(mensagem))
    length = sizeof(mensagem) - 1;

  memcpy(mensagem, payload, length);
  mensagem[length] = '\0';

  Serial.println("------------------------");
  Serial.print("Topico: ");
  Serial.println(topic);

  Serial.print("Mensagem: ");
  Serial.println(mensagem);

  int angulo = atoi(mensagem);

  angulo = constrain(angulo, 0, 180);

  Serial.print("Angulo: ");
  Serial.println(angulo);

  servoMotor.write(angulo);

  if (angulo == 20) {

    digitalWrite(LED_OPEN, HIGH);
    digitalWrite(LED_CLOSE, LOW);

    Serial.println("Porta Aberta");
  }
  else if (angulo == 90) {

    digitalWrite(LED_OPEN, LOW);
    digitalWrite(LED_CLOSE, HIGH);

    Serial.println("Porta Fechada");
  }
}

//==================================================
// Reconecta ao MQTT
//==================================================
void reconnectMQTT() {

  while (!client.connected()) {

    Serial.print("Conectando ao MQTT... ");

    String clientId = "ESP32-" + String(random(10000));

    if (client.connect(clientId.c_str())) {

      Serial.println("Conectado!");

      client.subscribe(mqttTopic);

      Serial.print("Inscrito no tópico: ");
      Serial.println(mqttTopic);

    } else {

      Serial.print("Erro: ");
      Serial.print(client.state());
      Serial.println(" - Nova tentativa em 2 segundos.");

      delay(2000);
    }
  }
}

//==================================================
// Setup
//==================================================
void setup() {

  Serial.begin(115200);

  pinMode(LED_OPEN, OUTPUT);
  pinMode(LED_CLOSE, OUTPUT);

  digitalWrite(LED_OPEN, LOW);
  digitalWrite(LED_CLOSE, HIGH);

  servoMotor.attach(SERVO_PIN);
  servoMotor.write(90);

  setupWiFi();

  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
}

//==================================================
// Loop
//==================================================
void loop() {

  if (WiFi.status() != WL_CONNECTED) {

    setupWiFi();
  }

  if (!client.connected()) {

    reconnectMQTT();
  }

  client.loop();
}


*/