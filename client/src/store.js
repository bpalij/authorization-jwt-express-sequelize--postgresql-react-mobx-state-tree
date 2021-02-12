import { types, flow, onSnapshot, applySnapshot, getSnapshot } from 'mobx-state-tree';
import { values } from 'mobx';
import _ from 'lodash';
import axios from 'axios';

const defaultSnapshot = {
  token: '',
  myInnerInfo: {},
  myDisplayInfo: {},
  loginInfo: {},
  loginList: [],
  loading: false,
  logined: false,
}

const User = types
  .model({
    login: '',
    type: '',
  }).actions(self => ({
    setUserInfo({ login, type }) {
      self.login = login;
      self.type = type;
    }
  }))

const RootStore = types
  .model({
    token: '',
    myInnerInfo: types.optional(User, {}), // User and types.compose(User) also did not help
    myDisplayInfo: types.optional(User, {}), // User and types.compose(User) also did not help
    loginInfo: types.optional(User, {}), // User and types.compose(User) also did not help
    loginList: types.array(types.string),
    loading: false,
    logined: false,
  }).views(self => ({
    get loginListLength() {
      return values(self.loginList).length;
    },
  })).actions(self => ({
    // setToken (token) {
    //   self.token = token;
    // },
    // setMyInnerInfo (userInfo) {
    //   self.myInnerInfo.setUserInfo(userInfo);
    // },
    // setMyDisplayInfo (userInfo) {
    //   self.myDisplayInfo.setUserInfo(userInfo);
    // },
    // setLoginInfo (userInfo) {
    //   self.loginInfo.setUserInfo(userInfo);
    // },
    // setLoginList (loginList) {
    //   self.loginList = loginList;
    // },
    // setLoading (loading) {
    //   self.loading = loading;
    // },
    // setLogined (logined) {
    //   self.logined = logined;
    // },
    // reset() {
    //   self.token = '';
    //   self.myInnerInfo = User.create({});
    //   self.myDisplayInfo = User.create({});
    //   self.loginInfo = User.create({});
    //   self.loginList = [];
    //   self.loading = false;
    //   self.logined = false;
    // },
    register: flow(function* register(login, password) {
      self.loading = true;
      try {
        const res = yield axios({
          method: 'POST',
          url: `${process.env.REACT_APP_HOST}/users/register`,
          data: { login, password },
        });
        alert('Registered');
        self.loading=false;
      } catch (e) {
        console.error(e);
        alert(`Error registering! Please retry!`);
        resetStore();
      }
    }),
    login: flow(function* login(login, password) {
      self.loading = true;
      try {
        const res = yield axios({
          method: 'POST',
          url: `${process.env.REACT_APP_HOST}/users/login`,
          data: { login, password },
        });
        self.token = res.data.token;
        self.myInnerInfo.setUserInfo(res.data.user);
        self.myDisplayInfo.setUserInfo({ login: '', type: '' });
        self.loginInfo.setUserInfo({ login: '', type: '' });
        self.loginList = [];
        alert('Logined');
        self.logined = true;
        self.loading=false;
      } catch (e) {
        console.error(e);
        alert(`Error logining! Please retry!`);
        resetStore();
      }
    }),
    unlogin() {
      self.loading = true;
      self.logined = false;
      self.token = '';
      self.myInnerInfo.setUserInfo({ login: '', type: '' });
      self.myDisplayInfo.setUserInfo({ login: '', type: '' });
      self.loginInfo.setUserInfo({ login: '', type: '' });
      self.loginList = [];
      alert('Unlogined');
      self.loading=false;
    },
    getMyInfo: flow(function* getMyInfo() {
      self.loading = true;
      try {
        const res = yield axios({
          method: 'GET',
          url: `${process.env.REACT_APP_HOST}/users/my-info`,
          headers: {'Authorization': self.token ? `Bearer ${self.token}` : ''},
        });
        // self.token = res.data.token;
        // self.myInnerInfo.setUserInfo(res.data.user);
        self.myDisplayInfo.setUserInfo(res.data);
        // self.loginInfo.setUserInfo({});
        // self.loginList = [];
        alert('Loaded information');
        // self.logined = true;
        self.loading=false;
      } catch (e) {
        console.error(e);
        alert(`Error loading information! Please retry!`);
        resetStore();
      }
    }),
    getLoginList: flow(function* getLoginList() {
      self.loading = true;
      try {
        const res = yield axios({
          method: 'GET',
          url: `${process.env.REACT_APP_HOST}/users/list-logins`,
          headers: {'Authorization': self.token ? `Bearer ${self.token}` : ''},
        });
        // self.token = res.data.token;
        // self.myInnerInfo.setUserInfo(res.data.user);
        // self.myDisplayInfo.setUserInfo(res.data);
        // self.loginInfo.setUserInfo({});
        self.loginList = res.data;
        alert('Loaded list');
        // self.logined = true;
        self.loading=false;
      } catch (e) {
        console.error(e);
        alert(`Error loading list! Please retry!`);
        resetStore();
      }
    }),
    getLoginInfo: flow(function* getLoginInfo(login) {
      self.loading = true;
      try {
        const res = yield axios({
          method: 'GET',
          url: `${process.env.REACT_APP_HOST}/users/user-info/${login}`,
          headers: {'Authorization': self.token ? `Bearer ${self.token}` : ''},
        });
        // self.token = res.data.token;
        // self.myInnerInfo.setUserInfo(res.data.user);
        // self.myDisplayInfo.setUserInfo(res.data);
        self.loginInfo.setUserInfo(res.data);
        // self.loginList = [];
        alert('Loaded information');
        // self.logined = true;
        self.loading=false;
      } catch (e) {
        console.error(e);
        // console.log(e.response);
        if (_.get(e, 'response.status') === 404) {
          alert('Error! Seems login not found! Try again!');
          self.loginInfo.setUserInfo({ login: '', type: '' });
          self.loading=false;
        } else {
          alert(`Error loading information! Please retry!`);
          resetStore();
        }
      }
    }),
  }));

const store = RootStore.create();

if(!(localStorage[process.env.REACT_APP_LOCALSTORAGE_KEY] && JSON.parse(localStorage[process.env.REACT_APP_LOCALSTORAGE_KEY]))) {
  localStorage[process.env.REACT_APP_LOCALSTORAGE_KEY] = JSON.stringify(defaultSnapshot);
}
applySnapshot(store, JSON.parse( localStorage[process.env.REACT_APP_LOCALSTORAGE_KEY] /* defaultSnapshot */));

console.log(getSnapshot(store));

onSnapshot(store, snapshot => {
  localStorage[process.env.REACT_APP_LOCALSTORAGE_KEY] = JSON.stringify(snapshot);
  console.info(snapshot);
});

export default store;
export function resetStore() {
  localStorage[process.env.REACT_APP_LOCALSTORAGE_KEY] = JSON.stringify(defaultSnapshot);
  applySnapshot(store, JSON.parse(localStorage[process.env.REACT_APP_LOCALSTORAGE_KEY]));
}