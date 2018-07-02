import Immutable from 'seamless-immutable';
import { isPaginatedResult } from './helpers';
import get from 'lodash/get';

const defaultState = {
  find: {},
  get: {},
  create: {},
  update: {},
  patch: {},
  remove: {},
  publications: {},
  store: [],
  meta: {
    connected: false,
    last: null
  }
};

const createStatusObject = (status) => {
  const translator = {
    'pending': { loading: true, saving: false, finished: false, error: false },
    'saving': { loading: true, saving: true, finished: false, error: false },
    'finished': { loading: false, saving: false, finished: true, error: false },
    'error': { loading: false, saving: false, finished: true, error: true },
  };

  return translator[status];
};

export default ({ modelName, rest, socket, snapshot }) => {

  const model = {
    state: new Immutable(defaultState),
    services: { rest, socket },
    snapshot,
    reducers: {
  
      request(state, { namespace, request, method, status }) {
        const response = {
          [method]: {
            request,
            status: createStatusObject(status)
          }
        };
        return namespace
          ? state.merge({ namespaces: { [namespace]: response } }, { deep: true })
          : state.merge(response, { deep: true });
      },


      response(state, { namespace, result, method }) {
        const response = {
          [method]: {
            result,
            status: createStatusObject('finished')
          }
        };
        return namespace
          ? state.merge({ namespaces: { [namespace]: response } }, { deep: true})
          : state.merge(response, { deep: true });
      },


      error(state, { namespace, error, method }) {
        const response = {
          [method]: {
            error,
            status: createStatusObject('error')
          }
        };
        return namespace
          ? state.merge({ namespaces: { [namespace]: response } }, { deep: true })
          : state.merge(response, { deep: true });
      },


      onCreated(state, payload) {
        const updateResult = (list, item) => {
          const items = Array.isArray(list) ? list : [];
          return [...items, item];
        };

        const updateRootResult = (state) => {
          const result = state.find.result;
          if (!result) return state;
          return isPaginatedResult(result)
            ? state.setIn(
              ['find', 'result', 'data'],
              updateResult(result.data, payload)
            )
            : state.setIn(
              ['find', 'result'],
              updateResult(result, payload)
            );
        };

        const tempState = updateRootResult(state);

        return Object.keys(state.namespaces)
          .reduce((state, namespace) => {
            const result = get(state, `namespaces.${namespace}.find.result`);
            if (!result) return state;
            if (isPaginatedResult(result)) {
              return state.setIn(
                ['namespaces', namespace, 'find', 'result', 'data'],
                updateResult(result.data, payload)
              );
            } else {
              return state.setIn(
                ['namespaces', namespace, 'find', 'result'],
                updateResult(result, payload)
              );
            }
          }, tempState);

      },


      onUpdated(state, payload) {
        console.log('onUpdated reducer fired: TODO', payload);
        return state;
      },


      onPatched(state, payload) {
        console.log('onPatched reducer fired: TODO ', payload);
        return state;
      },


      onRemoved(state, payload) {
        console.log('onRemoved reducer fired: TODO ', payload);
        return state;
      },


      store(state, { records, connected, last, publications }) {
        return state
          .set('store', records)
          .set('publications', publications)
          .setIn(['meta', 'last'], last)
          .setIn(['meta', 'connected'], connected);
      },


      reset(state, payload) {
        return defaultState
      }
    },
    effects: (dispatch) => ({

      async find({ namespace, params } = {}, rootState) {
        const request = { params };
        dispatch[modelName].request({ method: 'find', namespace, request, status: 'pending' });

        try {
          const result = await rest.find(params);
          dispatch[modelName].response({ method: 'find', namespace, result });
          return result;
        } catch (error) {
          dispatch[modelName].error({ method: 'find', namespace, error });
          return error;
        }
      },


      async get({ namespace, id, params }, rootState) {
        const request = { id, params };
        dispatch[modelName].request({ method: 'get', namespace, request, status: 'pending' });

        try {
          const result = await rest.get(id, params);
          dispatch[modelName].response({ method: 'get', namespace, result });
          return result;
        } catch (error) {
          dispatch[modelName].error({ method: 'get', namespace, error });
          return error;
        }
      },


      async create({ namespace, data, params }, rootState) {
        const request = { data };
        dispatch[modelName].request({ method: 'create', namespace, request, status: 'saving' });

        try {
          const result = await rest.create(data, params);
          dispatch[modelName].response({ method: 'create', namespace, result });
          return result;
        } catch (error) {
          dispatch[modelName].error({ method: 'create', namespace, error });
          return error;
        }
      },


      async update({ namespace, id, data, params }, rootState) {
        const request = { id, data, params };
        dispatch[modelName].request({ method: 'update', namespace, request, status: 'saving' });

        try {
          const result = await rest.update(id, data, params);
          dispatch[modelName].response({ method: 'update', namespace, result });
          return result;
        } catch (error) {
          dispatch[modelName].error({ method: 'update', namespace, error });
          return error;
        }
      },


      async patch({ namespace, id, data, params }, rootState) {
        const request = { id, data, params };
        dispatch[modelName].request({ method: 'patch', namespace, request, status: 'saving' });

        try {
          const result = await rest.patch(id, data, params);
          dispatch[modelName].response({ method: 'patch', namespace, result });
          return result;
        } catch (error) {
          dispatch[modelName].error({ method: 'patch', namespace, error });
          return error;
        }
      },


      async remove({ namespace, id, params }, rootState) {
        const request = { id, params };
        dispatch[modelName].request({ method: 'remove', namespace, request, status: 'saving' });

        try {
          const result = await rest.remove(id, params);
          dispatch[modelName].response({ method: 'remove', namespace, result });
          return result;
        } catch (error) {
          dispatch[modelName].error({ method: 'remove', namespace, error });
          return error;
        }
      }


    })
  };

  return model;
}

