import createModel from './create-model';
import realtime from './realtime-plugin';
import snapshot from './snapshot-plugin';

const init = ({ restClient, socketClient, services }) => {

  const models = services.reduce((obj, service) => {
    
    const config = {
      modelName: service.name,
      rest: restClient.service(service.path),
      socket: socketClient.service(service.path),
      snapshot: service.snapshot
    };

    const model = createModel(config);

    return {
      ...obj,
      [service.name]: model
    };
  }, {});

  return { models };
};

export { init, realtime, snapshot };