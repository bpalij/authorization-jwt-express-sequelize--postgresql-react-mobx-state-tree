import { observer } from 'mobx-react';
import { useState } from 'react';
import _ from 'lodash';

const LoginInfo = observer(({ store }) => {
  const [ login, setLogin ] = useState('');

  return (
    <div>
      <div>
        <span>Info about login</span>
        <input type='text' value={login} onChange={(event) => { setLogin(event.target.value) }} />
        <button onClick={(e) => {
          e.preventDefault();
          store.getLoginInfo(login);
        }}>
          Get/update
        </button>
      </div>
      <div>
        {_.get(store, 'loginInfo.login') &&  <p>Login: {store.loginInfo.login}</p>}
        {_.get(store, 'loginInfo.type') &&  <p>Type: {store.loginInfo.type}</p>}
      </div>
    </div>
)})

export default LoginInfo;