
#include <WiFi.h>
#include <PubSubClient.h>
#include <ESP32Servo.h>


// Configurações do Wi-Fi
#define ssid "Wokwi-GUEST"
#define password ""
//const char* ssid = "Wokwi-GUEST";
//const char* password = "";



// Configurações do Broker MQTT (HiveMQ público)
#define mqttServer "broker.hivemq.com"
//const char* mqttServer = "broker.hivemq.com"; 

//#define mqttServer "test.mosquitto.org"

#define mqttPort 1883
//#define mqttPort 8000



#define mqttTopic "esp32/door"  // Tópico para receber as mensagens
//const char* mqttTopic = "esp32/door";


WiFiClient espClient;
PubSubClient client(espClient);  // Cliente MQTT


Servo servoMotor;

const int servo = 5;


// Configuração do LED
const int ledOpen = 2;  // Pino onde o LED está conectado
const int ledClose = 12;




void setup() {
  // put your setup code here, to run once:

  
  Serial.begin(115200);

  servoMotor.attach(servo);

  pinMode(ledOpen, OUTPUT);  
  pinMode(ledClose, OUTPUT);  
  
  setup_wifi();


  /*
 // Conectar ao Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando ao Wi-Fi...");
  }
  Serial.println("Wi-Fi conectado");
  */

   // Conectar ao broker MQTT
  client.setServer(mqttServer, mqttPort);
  //client.setServer(mqttServer, 1883);
  client.setCallback(callback); 


/*
  while (!client.connected()) {
    if (client.connect("ESP32Client")) {
      Serial.println("Conectado ao MQTT");

      if (client.subscribe(mqttTopic)) {  // Verificar se a assinatura foi bem-sucedida
        Serial.println("Inscrição no tópico realizada com sucesso.");
      } else {
        Serial.println("Erro ao se inscrever no tópico.");
      }

    } else {
      delay(5000);
    }
  }
*/

}


void setup_wifi() {
  Serial.println("Conectando ao Wi-Fi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi conectado");
}






void callback(char* topic, byte* payload, unsigned int length) {
  String msg = "";
  for (unsigned int i = 0; i < length; i++) {
    msg += (char)payload[i];
  }
  Serial.println("Mensagem recebida: " + msg);

  //digitalWrite(led, msg == "1" ? HIGH : LOW);
 
  if (msg == "1") {

    for(int i =0; i <= 180 ; i += 1 ){
      servoMotor.write(i);
      digitalWrite(ledOpen, HIGH);
      digitalWrite(ledClose, LOW);
      delay(15);
    }    

  }else if(msg == "0") {

    for(int i =180; i >= 0 ; i -= 1 ){
      servoMotor.write(i);
      digitalWrite(ledOpen, LOW);
      digitalWrite(ledClose, HIGH);
      delay(15);
    }     
     
  } 



}



void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando MQTT...");
    // Client ID único para evitar desconexão
    String clientId = "ESP32Client-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("Conectado");
      client.subscribe(mqttTopic);
    } else {
      Serial.print("Falhou, rc=");
      Serial.print(client.state());
      Serial.println(" Tentando novamente em 2s");
      delay(2000);
    }
  }
}

/*
void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando MQTT...");
    if (client.connect("ESP32Client")) {
      Serial.println("Conectado");
      client.subscribe("led/control");
    } else {
      Serial.print("Falhou, rc=");
      Serial.print(client.state());
      delay(2000);
    }
  }
}
*/


void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}


/*
void loop() {
  // put your main code here, to run repeatedly:
  client.loop();
}
*/

/*
void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

   Serial.println("Mensagem recebida: " + message); 

 // Ligar ou desligar o LED com base na mensagem recebida
  if (message == "ON") {
    digitalWrite(led, HIGH); 
    Serial.println("Liga o LED"); // Liga o LED
  } else if (message == "OFF") {
    digitalWrite(led, LOW);   // Desliga o LED
    Serial.println("Desliga o LED");
  } else {
    Serial.println("Mensagem desconhecida: " + message);  // Adicionando log para caso de valores inesperados
  }

}
*/



