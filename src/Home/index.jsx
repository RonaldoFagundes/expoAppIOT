import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import mqtt from 'mqtt';


function Home() {

  const [status, setStatus] = useState('0');
  const client = useRef(null);


  useEffect(() => {

    const mqttClient = mqtt.connect(
      'ws://broker.hivemq.com:8000/mqtt'
    );

    mqttClient.on('connect', () => {
      console.log('MQTT conectado');
    });

    client.current = mqttClient;


    return () => {
      mqttClient.end();
    };

  }, []);



  const sendMessage = (msg) => {

    setStatus(msg);

    if(client.current){

      client.current.publish(
        'esp32/door',
        msg
      );

    }

  };


  const isOpen = status === "1";


  return (

    <View style={styles.container}>

      <Text style={styles.header}>
        My Home
      </Text>


      <View style={styles.card}>

        <Text style={styles.room}>
          Living Room
        </Text>


        <View 
          style={[
            styles.statusCircle,
            {
              backgroundColor:
              isOpen ? '#18e4c2' : '#ee1616'
            }
          ]}
        >
          <Text style={styles.statusText}>
            {isOpen ? "OPEN" : "CLOSED"}
          </Text>
        </View>


      </View>



      <Pressable
        style={[
          styles.button,
          {
            backgroundColor:
            isOpen ? '#ee1616' : '#18e4c2'
          }
        ]}
        onPress={() =>
          sendMessage(isOpen ? "0" : "1")
        }
      >

        <Text style={styles.buttonText}>
          {isOpen ? "Close Door" : "Open Door"}
        </Text>

      </Pressable>


    </View>

  );
}


export default Home;



const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:'#101820',
    padding:25,
    justifyContent:'center',
  },


  header:{
    fontSize:32,
    fontWeight:'bold',
    color:'#18e4c2',
    textAlign:'center',
    marginBottom:40,
  },


  card:{
    backgroundColor:'#1e2d33',
    borderRadius:25,
    padding:30,
    alignItems:'center',

    shadowColor:'#000',
    shadowOpacity:0.4,
    shadowRadius:10,
    elevation:10,
  },


  room:{
    fontSize:22,
    color:'#fff',
    fontWeight:'bold',
    marginBottom:30,
  },


  statusCircle:{
    width:150,
    height:150,
    borderRadius:75,
    justifyContent:'center',
    alignItems:'center',
  },


  statusText:{
    color:'#101820',
    fontSize:22,
    fontWeight:'bold',
  },


  button:{
    marginTop:50,
    paddingVertical:20,
    borderRadius:20,
    alignItems:'center',

    shadowColor:'#000',
    shadowOpacity:0.5,
    shadowRadius:8,
    elevation:8,
  },


  buttonText:{
    color:'#101820',
    fontSize:20,
    fontWeight:'bold',
  },


});


/*
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
*/