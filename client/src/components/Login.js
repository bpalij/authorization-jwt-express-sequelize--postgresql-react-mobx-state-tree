import { observer } from 'mobx-react';
import { useState } from 'react';

const Login = observer(({ store }) => {
  const [ login, setLogin ] = useState('');
  const [ password, setPassword ] = useState('');

  return (
    <div>
      {store.logined ? (
        <div>
          {store.myInnerInfo.login}
          <button type="button" onClick={() => { store.unlogin() }}>Unlogin</button>
        </div>
      ) : (
        <div>
          <label>
            Login:
            <input type="text" value={login} onChange={(e) => { setLogin(e.target.value) }} />
          </label>
          <label>
            Password:
            <input type="text" value={password} onChange={(e) => { setPassword(e.target.value) }} />
          </label>
          <button type="button" onClick={() => { store.login(login, password) }}>Login</button>
          <button type="button" onClick={() => { store.register(login, password) }}>Register</button>
        </div>
      )}
    </div>
  );
});

export default Login;