import { observer } from 'mobx-react';
import _ from 'lodash';
import Login from '../components/Login';
import MyInfo from '../components/MyInfo';
import LoginList from '../components/LoginList';
import LoginInfo from '../components/LoginInfo';
import { ADMIN } from '../constants';

const LoadedApp = observer(({ store }) => {
  return (
    <div>
      <Login store={store} />
      {_.get(store, 'myInnerInfo.login') && <MyInfo store={store} />}
      {(_.get(store, 'myInnerInfo.login') && _.get(store, 'myInnerInfo.type') === ADMIN) && <LoginList store={store} />}
      {(_.get(store, 'myInnerInfo.login') && _.get(store, 'myInnerInfo.type') === ADMIN) && <LoginInfo store={store} />}
    </div>
  );
});

export default LoadedApp;
