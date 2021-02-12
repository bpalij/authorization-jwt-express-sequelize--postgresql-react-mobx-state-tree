// import logo from './logo.svg';
// import './App.css';
import { observer } from 'mobx-react';
// import store from './store';
import Wait from './components/Wait';
import LoadedApp from './containers/LoadedApp';

const App = observer(function App({ store }) {
  return (
    <div className="">
      {store.loading ? <Wait /> : <LoadedApp store={store} />}
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
})

export default App;
