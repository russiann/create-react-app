import feathers from '@feathersjs/feathers';
import feathersAuth from '@feathersjs/authentication-client';
import rest from '@feathersjs/rest-client';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';
import axios from 'axios';
import { init, realtime, snapshot } from './lib';

const endpoint = 'http://localhost:3030';

export const socketClient = feathers()
  .configure(socketio(io(endpoint)))
  .configure(feathersAuth({ storage: localStorage }));

export const restClient = feathers()
  .configure(rest(endpoint).axios(axios))
  .configure(feathersAuth({ storage: localStorage }));


const services = [
  {
    name: 'products',
    path: '/products',
    snapshot: {
      publications: {
        expensives: (item) => item.price > 2000,
        cheap: (item) => item.price < 2000,
        rest: (item) => !(item.price < 2000) && !(item.price > 2000),
      }
    }
  }
]

const { models } = init({
  restClient,
  socketClient,
  services
});

/**
|--------------------------------------------------
| plugin
|--------------------------------------------------
*/

const realtimePlugin = realtime();
const snapshotPlugin = snapshot();

export {
  models,
  realtimePlugin as realtime,
  snapshotPlugin as snapshot
};