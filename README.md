# 🏠 My Home - Sistema IoT de Controle de Porta e Alimentador automático com ESP32, MQTT e React Native

![React Native](https://img.shields.io/badge/React%20Native-Mobile-blue?logo=react)
![ESP32](https://img.shields.io/badge/ESP32-IoT-red)
![MQTT](https://img.shields.io/badge/MQTT-HiveMQ-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?logo=javascript)
![License](https://img.shields.io/badge/License-MIT-green)


Projeto desenvolvido para demonstrar a integração entre React Native, ESP32, MQTT e Wokwi em aplicações de Internet das Coisas (IoT).

O projeto reúne duas aplicações baseadas na mesma arquitetura de comunicação:

🚪 Controle de Porta IoT — sistema para abertura e fechamento remoto de uma porta.

🐶 Alimentador Automático IoT — sistema para controle remoto da liberação de ração para animais de estimação.

A comunicação entre o aplicativo e o ESP32 é realizada utilizando o protocolo MQTT, através do broker HiveMQ.

O ESP32 recebe os comandos enviados pelo aplicativo, controla os atuadores e, no caso do alimentador automático, também publica informações de estado para o aplicativo.

---


# 📑 Índice

* Sobre o projeto
* Projeto 1 — Controle de Porta
* Projeto 2 — Alimentador Automático
* Funcionalidades
* Tecnologias utilizadas
* Arquitetura do sistema
* Demonstração
* Simulação no Wokwi
* Capturas de tela
* Estrutura do projeto
* Instalação
* Configuração MQTT
* Como executar
* Melhorias futuras
* Autor
* Licença

---

# 📖 Sobre o Projeto

Este projeto reúne duas aplicações de Internet das Coisas (IoT) desenvolvidas utilizando ESP32, MQTT, React Native e Wokwi.

A proposta é demonstrar como uma mesma arquitetura de comunicação pode ser utilizada em diferentes aplicações de automação.

O primeiro projeto foi desenvolvido para controlar uma porta remotamente. A partir dessa arquitetura, foi desenvolvido um segundo projeto com uma aplicação de automação mais completa: um alimentador automático para animais de estimação.

A arquitetura utiliza o seguinte fluxo principal:

📱 React Native
       │
       │ MQTT / WebSocket
       ▼
🌐 HiveMQ MQTT Broker
       │
       │ MQTT
       ▼
🔌 ESP32
       │
       ├──► ⚙️ Servo Motor
       │
       └──► 💡 LEDs


No alimentador automático, o fluxo também permite o retorno de informações do ESP32 para o aplicativo:


📱 React Native
       │
       │ Comando
       ▼
🌐 HiveMQ
       │
       ▼
🔌 ESP32
       │
       │ Estado
       ▼
🌐 HiveMQ
       │
       ▼
📱 React Native


Dessa forma, o sistema pode trabalhar tanto com envio de comandos quanto com feedback de estado em tempo real.


🚪 Projeto 1 — Controle de Porta
O primeiro projeto consiste em um sistema IoT para controle remoto de uma porta.

O usuário utiliza o aplicativo React Native para enviar comandos através do protocolo MQTT.

O broker HiveMQ recebe as mensagens e encaminha os comandos para o ESP32.

O ESP32 interpreta os comandos e controla um servo motor, responsável pela movimentação da porta.

LEDs são utilizados para indicar visualmente o estado atual da porta.

Estados da porta
🟢 OPEN — porta aberta;

🔴 CLOSED — porta fechada.


📱 React Native
       │
       │ comando MQTT
       ▼
🌐 HiveMQ
       │
       │ MQTT
       ▼
🔌 ESP32
       │
       ├──► ⚙️ Servo Motor
       │        │
       │        └──► Abre / Fecha porta
       │
       └──► 💡 LEDs
                ├── 🟢 Porta aberta
                └── 🔴 Porta fechada



🐶 Projeto 2 — Alimentador Automático
O alimentador automático é uma evolução da arquitetura utilizada no projeto de controle de porta.

O sistema permite que o usuário controle remotamente a liberação de ração através de um aplicativo React Native.

Ao pressionar o botão "Alimentar agora", o aplicativo publica o comando feed no broker MQTT.

O ESP32 recebe esse comando e aciona um servo motor responsável pela abertura da comporta do alimentador.

Durante o processo de alimentação, um LED é acionado para indicar que a operação está em andamento.

Após o período configurado:

O servo retorna à posição fechada;

O LED é desligado;

O ESP32 publica o estado ready;

O aplicativo atualiza a interface.

Estados do alimentador
🟢 Pronto (ready) — o alimentador está disponível;

🟡 Alimentando (feeding) — a ração está sendo liberada;

🔴 Desconectado — o aplicativo ou dispositivo não está conectado.

Fluxo
📱 React Native
       │
       │ feed
       ▼
🌐 HiveMQ Broker
       │
       │ esp32/feeder/set
       ▼
🔌 ESP32
       │
       ├──► ⚙️ Servo
       │       │
       │       └──► Abre comporta
       │
       └──► 💡 LED
               │
               └──► Alimentando
                       │
                       ▼
                  🥣 Libera ração
                       │
                       ▼
                  Fecha comporta
                       │
                       ▼
                  Publica ready
                       │
                       ▼
                📱 React Native

🔗 Arquitetura em Comum
Os dois projetos utilizam a mesma base tecnológica:

📱 React Native;

🔌 ESP32;

🌐 HiveMQ MQTT Broker;

📡 MQTT;

⚙️ Servo motor;

💡 LEDs;

🖥️ Wokwi.

A evolução do projeto pode ser representada da seguinte forma:

Projeto 1
🚪 Controle de Porta
       │
       ├── React Native
       ├── MQTT
       ├── ESP32
       ├── Servo Motor
       └── LEDs

              │
              │ Evolução
              ▼

Projeto 2
🐶 Alimentador Automático
       │
       ├── React Native
       ├── MQTT
       ├── ESP32
       ├── Servo Motor
       ├── LED
       ├── Controle de alimentação
       └── Feedback de estado

---

✨ Funcionalidades
🐶 Alimentador Automático IoT
✅ Controle remoto do alimentador através do aplicativo React Native;

✅ Envio do comando feed via MQTT;

✅ Comunicação em tempo real entre aplicativo e ESP32;

✅ Acionamento do servo motor;

✅ Abertura automática da comporta;

✅ Liberação da ração durante o período configurado;

✅ LED indicador durante a alimentação;

✅ Publicação do estado do alimentador pelo ESP32;

✅ Atualização da interface entre Pronto e Alimentando;

✅ Indicador de conexão;

✅ Bloqueio do botão durante a alimentação;

✅ Reconexão do ESP32 ao broker MQTT;

✅ Simulação utilizando Wokwi.

🚪 Controle de Porta IoT
✅ Controle remoto da porta;

✅ Comunicação MQTT em tempo real;

✅ Envio de comandos para o ESP32;

✅ Controle de abertura e fechamento através de servo motor;

✅ LED verde para indicar porta aberta;

✅ LED vermelho para indicar porta fechada;

✅ Interface mobile;

✅ Simulação utilizando Wokwi.


---

# 🛠 Tecnologias Utilizadas

## 📱 Mobile

* React Native
* JavaScript
* MQTT.js

## 🔌 Hardware

* ESP32
* Servo Motor
* LED verde
* LED vermelho

## 📡 Comunicação

* MQTT
* WebSocket
* HiveMQ MQTT Broker

## 🖥 Simulação

* Wokwi

---

# 🏗 Arquitetura do Sistema

🏗 Arquitetura do Sistema
A arquitetura geral do projeto pode ser representada da seguinte maneira:

                         📱 React Native
                               │
                               │ MQTT / WebSocket
                               ▼
                      🌐 HiveMQ Broker
                               │
                               │ MQTT
                               ▼
                            🔌 ESP32
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
              ⚙️ Servo Motor          💡 LED
                    │                     │
             ┌──────┴──────┐              │
             │             │              │
             ▼             ▼              ▼
        🚪 Controle   🐶 Alimentador    Status
          de Porta       Automático
             │             │
             ▼             ▼
        Abre/Fecha     Libera Ração

---

🔄 Fluxo da Aplicação

🚪 Controle de Porta
O funcionamento ocorre da seguinte forma:

O usuário pressiona o botão no aplicativo;

O aplicativo publica um comando MQTT;

O broker HiveMQ recebe a mensagem;

O ESP32 recebe o comando;

O ESP32 aciona o servo motor;

O servo realiza a abertura ou fechamento;

Os LEDs são atualizados conforme o estado da porta.

Usuário
   │
   ▼
📱 React Native
   │
   │ comando MQTT
   ▼
🌐 HiveMQ
   │
   ▼
🔌 ESP32
   │
   ├──► ⚙️ Servo → Porta
   │
   └──► 💡 LEDs → Estado


🐶 Alimentador Automático
O fluxo do alimentador é composto pelas seguintes etapas:

O usuário pressiona "Alimentar agora";

O React Native publica o comando feed;

O comando é enviado para esp32/feeder/set;

O broker HiveMQ encaminha a mensagem para o ESP32;

O ESP32 recebe o comando;

O ESP32 publica o estado feeding;

O aplicativo exibe "Alimentando";

O servo abre a comporta;

O LED é ligado;

A ração é liberada;

O servo retorna à posição fechada;

O LED é desligado;

O ESP32 publica o estado ready;

O aplicativo recebe o novo estado;

A interface retorna para "Pronto".

Usuário
   │
   ▼
"Alimentar agora"
   │
   │ feed
   ▼
📱 React Native
   │
   │ MQTT / WebSocket
   ▼
🌐 HiveMQ
   │
   │ MQTT
   ▼
🔌 ESP32
   │
   ├──► "feeding"
   │
   ├──► Servo abre
   │
   ├──► LED ON
   │
   ├──► Libera ração
   │
   ├──► Servo fecha
   │
   ├──► LED OFF
   │
   └──► "ready"
            │
            ▼
       📱 React Native
            │
            ▼
         "Pronto"

---        

🔁 Comunicação Bidirecional
No alimentador automático, a comunicação ocorre em ambos os sentidos.

O aplicativo envia o comando:

feed

O ESP32 publica os estados:

feeding
ready

Representação:

              📱 React Native
                    │
                    │ "feed"
                    ▼
              🌐 HiveMQ
                    │
                    ▼
                 🔌 ESP32
                    │
                    │ "feeding"
                    │ "ready"
                    ▼
              🌐 HiveMQ
                    │
                    ▼
              📱 React Native

Essa comunicação permite que o aplicativo envie comandos e acompanhe o estado do dispositivo em tempo real.

---

# 🎥 Demonstração

Veja o projeto funcionando:

▶️ https://youtu.be/4aEeqXv4Xjc

O vídeo apresenta:

* 📱 Conexão do aplicativo com o broker MQTT;
* 📡 Comunicação MQTT em tempo real;
* 🚪 Abertura e fechamento da porta;
* 🟢 Acionamento do LED verde quando a porta está aberta;
* 🔴 Acionamento do LED vermelho quando a porta está fechada;
* 🔄 Atualização do status na interface mobile.

---

# 💻 Simulação no Wokwi

A simulação do ESP32 pode ser executada diretamente no navegador:

🔗 https://wokwi.com/projects/461009003984226305

O ambiente permite testar a lógica do ESP32, o servo motor e os LEDs indicadores sem necessidade do hardware físico.

---

📸 Capturas de Tela

🟢 Alimentador — Pronto
<img src="docs/img/feeder.png" width="300">
Estado em que o alimentador está disponível para uma nova alimentação.

🟢 Status: Pronto;

🐶 Indicador do pet;

🍖 Botão "Alimentar agora" disponível;

💡 LED do ESP32 desligado;

⚙️ Servo motor na posição fechada.


🟡 Alimentador — Alimentando
<img src="docs/img/feeder.png" width="300">
Estado apresentado durante a liberação da ração.

🟡 Status: Alimentando;

📝 Mensagem "Liberando a ração...";

🍖 Botão alterado para "Liberando...";

🔒 Botão temporariamente desabilitado;

💡 LED do ESP32 ligado;

⚙️ Servo motor acionando a comporta.

Após o término do processo, o ESP32 fecha a comporta, desliga o LED e publica o estado ready.


🚪 Controle de Porta — Fechada
<img src="docs/img/door-closed.PNG" width="300">
Estado inicial do sistema:

🔴 Status: CLOSED;

🔴 LED vermelho ligado no ESP32;

🚪 Porta fechada;

🔘 Botão disponível para abrir.

🚪 Controle de Porta — Aberta
<img src="docs/img/door-open.PNG" width="300">
Estado após o envio do comando MQTT:

🟢 Status: OPEN;

🟢 LED verde ligado no ESP32;

⚙️ Servo motor movimentado;

🔘 Botão disponível para fechar.


---

# 📁 Estrutura do Projeto


expoAppIOT/
│
├── docs/
│   │
│   ├── images/
│   │   ├── home-screen.png
│   │   ├── feeder-ready.png
│   │   ├── feeder-feeding.png
│   │   ├── door-open.png
│   │   └── door-closed.png
│   │
│   └── wokwi/
│       ├── diagram.json
│       ├── libraries.txt
│       ├── sketch.ino
│       └── wokwi-project.txt
│
├── src/
│   └── index.jsx
│
├── App.js
├── package.json
└── README.md


---

# ⚙️ Instalação

Clone o repositório:

```bash
git clone https://github.com/RonaldoFagundes/expoAppIOT.git 
         
```  

Acesse a pasta:

```bash
cd expoAppIOT
```

Instale as dependências:

```bash
npm install
```

ou:

```bash
yarn
```

---

# 📡 Configuração MQTT

O projeto utiliza o broker público HiveMQ.

Configuração do ESP32:

```text
Broker:
broker.hivemq.com

Porta:
1883

Protocolo:
MQTT TCP

Tópico:
esp32/door
```

Configuração do React Native:

```text
Broker:
broker.hivemq.com

Porta:
8000

Protocolo:
MQTT WebSocket

Tópico:
esp32/door
```

O ESP32 e o aplicativo devem utilizar o mesmo tópico MQTT para comunicação.

---

# ▶️ Executando o Projeto

## Aplicativo React Native

Execute:

```bash
npx react-native run-android
```

ou:

```bash
npx react-native run-ios
```

---

## ESP32

1. Configure a rede Wi-Fi;
2. Grave o código no ESP32;
3. Aguarde a conexão com o broker MQTT;
4. Utilize o aplicativo para enviar os comandos.

---

# 🚀 Melhorias Futuras

* Publicação do estado da porta pelo ESP32 para o aplicativo;
* Histórico de abertura e fechamento;
* Controle de múltiplas portas;
* Sensor físico de porta aberta/fechada (reed switch);
* Notificações Push;
* Dashboard Web;
* Autenticação de usuários;
* Criptografia MQTT.

---

# 👨‍💻 RonaldoFagundes

Projeto desenvolvido como estudo de **Internet das Coisas (IoT)**, utilizando React Native, ESP32 e MQTT para demonstrar comunicação entre software e hardware em tempo real.

---

# 📄 Licença

Este projeto está licenciado sob a licença MIT.

Sinta-se à vontade para estudar, modificar e contribuir com melhorias.
