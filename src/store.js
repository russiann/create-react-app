import { init } from '@rematch/core'
import subscriptionsPlugin from '@rematch/subscriptions'
import models from './models'
import { models as feathersModels, realtime, snapshot, auth } from './feathers';

const subscriptions = subscriptionsPlugin()

const store = init({
  models: {
    ...models,
    ...feathersModels
  },
  plugins: [subscriptions, realtime, snapshot, auth]
});

window.store = store;

export default store;