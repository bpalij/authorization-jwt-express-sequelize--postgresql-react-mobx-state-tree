import { observer } from 'mobx-react';
import _ from 'lodash';

const MyInfo = observer(({ store }) => (
  <div>
    <div>
      <span>Info about me</span>
      <button onClick={(e) => {
        e.preventDefault();
        store.getMyInfo();
      }}>
        Get/update
      </button>
    </div>
    <div>
      {_.get(store, 'myDisplayInfo.login') &&  <p>Login: {store.myDisplayInfo.login}</p>}
      {_.get(store, 'myDisplayInfo.type') &&  <p>Type: {store.myDisplayInfo.type}</p>}
    </div>
  </div>
))

export default MyInfo;