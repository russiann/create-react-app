import Realtime from 'feathers-offline-realtime';

export default () => {
  return {
    onModel(model) {

      if (!model.snapshot) return;

      const serviceRealtime = new Realtime(model.services.socket, model.snapshot);

      serviceRealtime.on('events', (records, last) => {
        let publications = {};

        if (model.snapshot.publications) {
          publications = Object
            .keys(model.snapshot.publications)
            .reduce((state, publicationName) => ({
              ...state,
              [publicationName]: records.filter(model.snapshot.publications[publicationName])
            }), {})
        }

        this.dispatch[model.name].store({
          connected: serviceRealtime.connected,
          last, 
          records,
          publications
        });
      });

      serviceRealtime
        .connect()
        .then(() => {
          console.log('%c' + `[${model.name}] snapshot syncronized.`.toUpperCase(), 'color: #2196F3');
        });

    }
  }
}