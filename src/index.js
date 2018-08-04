import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import store from './store';
import { Snapshot, Service } from './feathers-rematch-react-bindings';

const Count = props => (
  <div>
    The count is {props.count}
    <button onClick={props.increment}>increment</button>
    <button onClick={props.incrementAsync}>incrementAsync</button>
    {/* <Snapshot
      name="products"
      publication="expensives"
      find={{_id: '5b3eab3d9bcb9a2b412909f9'}}
      renderEach={(data, idx) => (
        <div key={idx}>
          <p>renderEach:</p>
          <pre>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
      render={(data) => (
        <div>
          <p>render:</p>
          <pre>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    /> */}

    <Service
      name="products"
      find={{ query: {price: 2000} }}
      // renderEach={(data, idx) => (
      //   <div key={idx}>
      //     <p>renderEach:</p>
      //     <pre>
      //       {JSON.stringify(data, null, 2)}
      //     </pre>
      //   </div>
      // )}
      render={(data) => (
        <div>
          <p>render:</p>
          <pre>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    />
  </div>
)

const mapState = state => ({
  count: state.count
})

const mapDispatch = ({ count: { increment, incrementAsync } }) => ({
  increment: () => increment(1),
  incrementAsync: () => incrementAsync(1)
})

const CountContainer = connect(mapState, mapDispatch)(Count)

ReactDOM.render(
  <Provider store={store}>
    <CountContainer />
  </Provider>,
  document.getElementById('root')
)