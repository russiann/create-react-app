import feathers from '@feathersjs/feathers';
import feathersAuth from '@feathersjs/authentication-client';
import rest from '@feathersjs/rest-client';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';
import axios from 'axios';
import { init, realtime, snapshot, auth } from 'feathers-rematch';

const endpoint = 'http://localhost:3030';

const socket = io(endpoint);

export const socketClient = feathers()
  .configure(socketio(socket))
  .configure(feathersAuth({ storage: localStorage }));

export const restClient = feathers()
  .configure(rest(endpoint).axios(axios))
  .configure(feathersAuth({ storage: localStorage }));

const services = [
  {
    name: 'products',
    path: '/products',
    snapshot: {
      authenticated: true,
      verifier: (authData) => true,
      publications: {
        expensives: (item) => item.price > 2000,
        cheap: (item) => item.price < 2000,
        rest: (item) => !(item.price < 2000) && !(item.price > 2000),
      }
    }
  },
  {
    name: 'users',
    path: '/users',
    snapshot: {
      authenticated: true,
      verifier: (authData) => true
    }
  }
];

const authentication = {
  transport: 'rest'
};

const { models } = init({
  transport: 'rest',
  restClient,
  socketClient,
  socket,
  services,
  authentication,
  authOnInit: true
});

/**
|--------------------------------------------------
| plugin
|--------------------------------------------------
*/

const realtimePlugin = realtime();
const snapshotPlugin = snapshot();
const authPlugin     = auth({socket});

export {
  models,
  realtimePlugin as realtime,
  snapshotPlugin as snapshot,
  authPlugin as auth
};