import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import mqtt from 'mqtt';



function Home() {


  const [status, setStatus] = useState('0');
  const [client, setClient] = useState(null);


  useEffect(() => {
    // Conectar ao broker MQTT via WebSocket
    const mqttClient = mqtt.connect('ws://broker.hivemq.com:8000/mqtt');

    mqttClient.on('connect', () => {
      console.log('Conectado ao MQTT');
    });
    setClient(mqttClient);

   // Limpeza quando o componente for desmontado   
    return () => {
      mqttClient.end();
    };

  }, []);



  const sendMessage = (msg) => {
    setStatus(msg);
    if (client) {
      client.publish('esp32/door', msg, 
        { 
          retain: false
        });
      console.log('Mensagem publicada:', msg);
    }
  };



  return (
    <View style={styles.containerMain}>

      <View style={styles.containerHeader}>

        <View style={styles.contentHeader}>
          <Text style={styles.title}>My Home</Text>
        </View>

         <View style={styles.contentSection}>
          <Text style={styles.title}>Living Room</Text>
          <Text style={status === "0" ? styles.textClose : styles.textOpen}>
            Status: {status}
          </Text>
        </View>
        
      </View>



      <View style={styles.containerBtn}>       
        {
          status === "0" ?
            <View>
              <Pressable style={styles.btn}
                onPress={() => sendMessage('1')}>
                <Text style={styles.textOpen}>Open door</Text>
              </Pressable>
            </View>
            :
            <View>
              <Pressable style={styles.btn}
                onPress={() => sendMessage('0')}>
                <Text style={styles.textClose}>Close door</Text>
              </Pressable>
            </View>

        }
      </View>
    </View>
  );
}

export default Home;




const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    flexDirection: 'column',
  },

  containerHeader: {
    width: '100%',
    height: '20%',
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#94b3b3'
  },

  contentHeader: {
    width: '90%',
    height: 'auto',
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#1e2d33',
    marginTop:100,
  },  

  contentSection: {
    width: '90%',
    height: 'auto',
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#1e2d33',
    marginTop:40,
  },

  containerBtn: {
    width: '100%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  btn: {
    width: 'auto',
    height: 'auto',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#0d1138',
    marginTop: 20,
    borderWidth: 2,
    borderColor: 'blue'
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3d9c94'
  },

  textOpen: {
    color: '#18e4c2',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  textClose: {
    color: '#ee1616',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  }

});
