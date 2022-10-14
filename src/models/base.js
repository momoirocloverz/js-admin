import Apis from '@/utils/apis';
import { history } from 'umi';
const BaseModel = {
  namespace: 'baseModel',
  state: {
    homeTitle: sessionStorage.getItem('globalStateHomeTitle')
      ? sessionStorage.getItem('globalStateHomeTitle')
      : '1',
    breadArray: sessionStorage.getItem('globalStateBreadArray')
      ? JSON.parse(sessionStorage.getItem('globalStateBreadArray'))
      : [
          {
            title: '首页',
          },
        ],
    notificationFlag: 1,
  },
  reducers: {
    changeNotificationFlag(state) {
      state.notificationFlag++;
    },
    changeHomeTitle(state, action) {
      state.homeTitle = action.payload;
      sessionStorage.setItem('globalStateHomeTitle', state.homeTitle);
    },
    changeBreadArray(state, action) {
      state.breadArray = action.payload;
      sessionStorage.setItem(
        'globalStateBreadArray',
        JSON.stringify(state.breadArray),
      );
    },
    initBaseState(state, action) {
      sessionStorage.setItem('globalStateHomeTitle', '12');
      sessionStorage.setItem(
        'globalStateBreadArray',
        JSON.stringify([
          {
            title: '首页',
          },
        ]),
      );
      state.homeTitle = '12';
      state.breadArray = [
        {
          title: '首页',
        },
      ];
    },
  },
};

export default BaseModel;
