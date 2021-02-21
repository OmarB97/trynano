/* eslint-disable no-use-before-define */
import { WS_SERVER } from './constants';

let socketNano;

function sleepSimple(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function callWebsocket(trackedAccounts, emitter) {
  let nanoWebsocketOffline = false;

  const socketMessageListener = (event) => {
    console.log(event);
    if (event === null || event.data === null) {
      return;
    }
    const res = JSON.parse(event.data);
    if (res.topic !== null && res.topic === 'confirmation') {
      emitter.emit('confirmation-received', res);
    }
  };

  const socketOpenListener = () => {
    console.log('NANO socket opened');
    nanoWebsocketOffline = false;
    // Subscribe to block confirmations on both accounts
    const msg = {
      action: 'subscribe',
      topic: 'confirmation',
      options: {
        accounts: trackedAccounts,
      },
    };
    socketNano.send(JSON.stringify(msg));
  };

  const socketErrorListener = () => {
    console.error('Websocket looks offline. Please try again later.');
    nanoWebsocketOffline = true;
  };

  const socketCloseListener = () => {
    if (socketNano) {
      console.error('NANO socket disconnected due to inactivity.');
      // if socket offline, try again in 5min
      if (nanoWebsocketOffline) {
        socketSleep(300000);
      } else {
        // or in one second
        socketSleep(1000);
      }
    } else {
      socketSleep(1000);
    }
  };

  // Start the websocket client
  socketCloseListener();

  // Websocket for NANO with automatic reconnect
  async function socketSleep(sleep = 5000) {
    await sleepSimple(sleep);
    socketNano = new WebSocket(WS_SERVER);
    socketNano.addEventListener('open', socketOpenListener);
    socketNano.addEventListener('error', socketErrorListener);
    socketNano.addEventListener('message', socketMessageListener);
    socketNano.addEventListener('close', socketCloseListener);
  }
}

export default callWebsocket;
