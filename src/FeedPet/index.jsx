import { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  Pressable,
  StyleSheet 
} from 'react-native';

import mqtt from 'mqtt';


export default function FeedPet() {

  const [status, setStatus] = useState('ready');

  const [connected, setConnected] = useState(false);

  const client = useRef(null);


  // =====================================
  // MQTT
  // =====================================

  useEffect(() => {

    const mqttClient = mqtt.connect(
      'ws://broker.hivemq.com:8000/mqtt'
    );

    client.current = mqttClient;


    mqttClient.on('connect', () => {

      console.log('MQTT conectado');

      setConnected(true);

      mqttClient.subscribe(
        'esp32/feeder/state'
      );

    });


    mqttClient.on('message', (
      topic,
      message
    ) => {

      const value =
        message.toString();


      if (
        topic === 'esp32/feeder/state'
      ) {

        setStatus(value);

      }

    });


    mqttClient.on('close', () => {

      setConnected(false);

    });


    mqttClient.on('error', (error) => {

      console.log(
        'MQTT Error:',
        error
      );

    });


    return () => {

      mqttClient.end();

    };

  }, []);


  // =====================================
  // ALIMENTAR
  // =====================================

  const feedAnimal = () => {

    if (
      !client.current?.connected
    ) {

      return;
    }


    if (
      status === 'feeding'
    ) {

      return;
    }


    client.current.publish(
      'esp32/feeder/set',
      'feed'
    );

  };


  // =====================================
  // STATUS
  // =====================================

  const isFeeding = status === 'feeding';


  return (

    <View
      style={styles.safeArea}
    >

      <View style={styles.container}>

        {/* ===============================
            HEADER
        ================================ */}

        <View style={styles.header}>

          <View>

            <Text style={styles.title}>
              Alimentador
            </Text>

            <Text style={styles.subtitle}>
              Cuide do seu pet
            </Text>

          </View>


          <View style={styles.connectionIcon}>

            <View
              style={[
                styles.connectionDot,
                {
                  backgroundColor:
                    connected
                      ? '#22C55E'
                      : '#EF4444'
                }
              ]}
            />

          </View>

        </View>


        {/* ===============================
            CARD PRINCIPAL
        ================================ */}

        <View style={styles.mainCard}>

          {/* ÍCONE */}

          <View
            style={[
              styles.petCircle,
              {
                backgroundColor:
                  isFeeding
                    ? '#FEF3C7'
                    : '#ECFDF5'
              }
            ]}
          >

            <Text style={styles.petIcon}>
              🐶
            </Text>

          </View>


          {/* STATUS */}

          <Text style={styles.statusLabel}>
            STATUS
          </Text>


          <Text
            style={[
              styles.status,
              {
                color:
                  isFeeding
                    ? '#F59E0B'
                    : '#16A34A'
              }
            ]}
          >

            {isFeeding
              ? 'Alimentando'
              : 'Pronto'}

          </Text>


          <Text style={styles.description}>

            {isFeeding
              ? 'Liberando a ração...'
              : 'Seu pet está esperando a próxima refeição.'}

          </Text>


          {/* ==========================
              BOTÃO
          =========================== */}

          <Pressable

            style={[
              styles.feedButton,

              {
                backgroundColor:
                  isFeeding
                    ? '#D1D5DB'
                    : '#16A34A'
              }
            ]}

            onPress={feedAnimal}

            disabled={isFeeding}

          >

            <Text style={styles.feedIcon}>
              🍖
            </Text>

            <Text style={styles.feedText}>

              {isFeeding
                ? 'Liberando...'
                : 'Alimentar agora'}

            </Text>

          </Pressable>

        </View>


        {/* ===============================
            PRÓXIMA REFEIÇÃO
        ================================ */}

        <View style={styles.nextCard}>

          <View style={styles.nextIcon}>

            <Text>
              🕐
            </Text>

          </View>


          <View style={styles.nextInfo}>

            <Text style={styles.nextTitle}>
              Próxima refeição
            </Text>

            <Text style={styles.nextDescription}>
              Horário programado
            </Text>

          </View>


          <Text style={styles.nextTime}>
            19:00
          </Text>

        </View>


        {/* ===============================
            CONEXÃO
        ================================ */}

        <View style={styles.connection}>

          <View
            style={[
              styles.connectionStatus,
              {
                backgroundColor:
                  connected
                    ? '#22C55E'
                    : '#EF4444'
              }
            ]}
          />

          <Text style={styles.connectionText}>

            {connected
              ? 'Alimentador conectado'
              : 'Alimentador desconectado'}

          </Text>

        </View>

      </View>

    </View>

  );

}


// ========================================
// ESTILOS
// ========================================

const styles = StyleSheet.create({

  safeArea: {

    flex: 1,

    backgroundColor: '#F7F8FA',

  },


  container: {

    flex: 1,

    paddingHorizontal: 24,

    paddingTop: 20,

  },


  // ======================================
  // HEADER
  // ======================================

  header: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 30,

  },


  title: {

    fontSize: 28,

    fontWeight: '700',

    color: '#111827',

  },


  subtitle: {

    fontSize: 15,

    color: '#6B7280',

    marginTop: 4,

  },


  connectionIcon: {

    width: 40,

    height: 40,

    borderRadius: 20,

    backgroundColor: '#FFFFFF',

    justifyContent: 'center',

    alignItems: 'center',

    shadowColor: '#000',

    shadowOpacity: 0.05,

    shadowRadius: 8,

    elevation: 2,

  },


  connectionDot: {

    width: 10,

    height: 10,

    borderRadius: 5,

  },


  // ======================================
  // CARD PRINCIPAL
  // ======================================

  mainCard: {

    backgroundColor: '#FFFFFF',

    borderRadius: 28,

    padding: 30,

    alignItems: 'center',

    shadowColor: '#000',

    shadowOpacity: 0.06,

    shadowRadius: 20,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 4,

  },


  petCircle: {

    width: 120,

    height: 120,

    borderRadius: 60,

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 22,

  },


  petIcon: {

    fontSize: 55,

  },


  statusLabel: {

    fontSize: 11,

    fontWeight: '700',

    letterSpacing: 1.5,

    color: '#9CA3AF',

  },


  status: {

    fontSize: 30,

    fontWeight: '700',

    marginTop: 5,

  },


  description: {

    fontSize: 14,

    color: '#6B7280',

    textAlign: 'center',

    lineHeight: 21,

    marginTop: 8,

    marginBottom: 25,

    paddingHorizontal: 20,

  },


  // ======================================
  // BOTÃO
  // ======================================

  feedButton: {

    width: '100%',

    height: 58,

    borderRadius: 18,

    flexDirection: 'row',

    justifyContent: 'center',

    alignItems: 'center',

  },


  feedIcon: {

    fontSize: 20,

    marginRight: 9,

  },


  feedText: {

    color: '#FFFFFF',

    fontSize: 17,

    fontWeight: '700',

  },


  // ======================================
  // PRÓXIMA REFEIÇÃO
  // ======================================

  nextCard: {

    backgroundColor: '#FFFFFF',

    borderRadius: 20,

    padding: 18,

    marginTop: 16,

    flexDirection: 'row',

    alignItems: 'center',

    shadowColor: '#000',

    shadowOpacity: 0.04,

    shadowRadius: 10,

    elevation: 2,

  },


  nextIcon: {

    width: 42,

    height: 42,

    borderRadius: 14,

    backgroundColor: '#F0FDF4',

    justifyContent: 'center',

    alignItems: 'center',

  },


  nextInfo: {

    flex: 1,

    marginLeft: 12,

  },


  nextTitle: {

    fontSize: 15,

    fontWeight: '600',

    color: '#111827',

  },


  nextDescription: {

    fontSize: 12,

    color: '#9CA3AF',

    marginTop: 3,

  },


  nextTime: {

    fontSize: 20,

    fontWeight: '700',

    color: '#16A34A',

  },


  // ======================================
  // CONEXÃO
  // ======================================

  connection: {

    flexDirection: 'row',

    justifyContent: 'center',

    alignItems: 'center',

    marginTop: 22,

  },


  connectionStatus: {

    width: 7,

    height: 7,

    borderRadius: 4,

    marginRight: 7,

  },


  connectionText: {

    fontSize: 12,

    color: '#9CA3AF',

  },

});