import { observer } from 'mobx-react';
import _ from 'lodash';

const LoginInfo = observer(({ store }) => (
    <div>
      <div>
        <span>Login list</span>
        <button onClick={(e) => {
          e.preventDefault();
          store.getLoginList();
        }}>
          Get/update
        </button>
      </div>
      <div>
        {_.get(store, 'loginList.map') && store.loginList.map(login => (<p key={login}>{login}</p>))}
      </div>
    </div>
))

export default LoginInfo;