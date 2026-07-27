import { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import mqtt from 'mqtt';




function Home(){

const [client, setClient] = useState(null);
const [message, setMessage] = useState('Nenhuma mensagem');


useEffect(() => {

    // Conectar ao broker MQTT (usando WebSocket)
   // const mqttClient = mqtt.connect('ws://broker.hivemq.com:8000/mqtt');
    const mqttClient = mqtt.connect('wss://mqtt-dashboard.com:8884/mqtt');
    
    // test
    // https://www.hivemq.com/demos/websocket-client/


    mqttClient.on('connect', () => {

      console.log('Conectado ao broker!');

      // Se conectar, inscreve-se no tópico
      //mqttClient.subscribe('expo/teste');

      mqttClient.subscribe('expo/teste', (err) => {
       if (err) {
        console.log('Erro ao inscrever no tópico', err);
       } else {
        console.log('Inscrito no tópico expo/teste');
       }
  });
  // Agora você pode publicar


    });

    mqttClient.on('message', (topic, msg) => {

      // Atualiza o estado com a mensagem recebida
      setMessage(msg.toString());

    });

    // Salva o cliente MQTT
    setClient(mqttClient);

      // Limpeza da conexão quando o componente for desmontado
    return () => mqttClient.end();

  }, []);


  // Função para enviar uma mensagem
  const sendMessage = () => {

    if (client) {
      client.publish('expo/teste', 'Mensagem do Expo 🚀');
      console.log('Mensagem publicada no tópico expo/teste');
    }

  };




      return(

       <View style={{ marginTop: 50, padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Tela Home</Text>
          <Text style={{ fontSize: 20, marginTop: 10 }}>IOT System</Text>

          <View style={{ marginTop: 30 }}>
            <Text>Mensagem recebida:</Text>
            <Text style={{ fontSize: 18, color: 'blue' }}>{message}</Text>
         </View>

          <Button title="Enviar mensagem" onPress={sendMessage} />
       </View>
  );
}

export default Home;