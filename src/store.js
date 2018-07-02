import { init } from '@rematch/core'
import subscriptionsPlugin from '@rematch/subscriptions'
import models from './models'
import { models as feathersModels, realtime, snapshot } from './feathers';

const subscriptions = subscriptionsPlugin()

const store = init({
  models: {
    ...models,
    ...feathersModels
  },
  plugins: [subscriptions, realtime, snapshot]
});

window.store = store;

export default store;