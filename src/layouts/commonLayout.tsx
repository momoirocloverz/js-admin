import React, { useEffect, useState } from 'react';
import { Helmet, history, connect } from 'umi';
import Apis from '@/utils/apis';
import '../../src/pages/index.less';
// 注册service worker
if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register('/sw.js');
}
const CommonLayout = (props: any) => {
  const {
    location,
    children,
    dispatch,
    accountInfo,
    baseModel,
    loginModel,
  } = props;
  const userInfo = sessionStorage.getItem('userInfo');
  useEffect(() => {
    if (userInfo) {
      const params = {
        id: JSON.parse(userInfo).uid,
      };
      dispatch({
        type: 'account/getAccountInfo',
        payload: { ...params },
      });
    }
  }, [userInfo]);
  return <div>{children}</div>;
};

export default connect(({ baseModel }) => ({
  baseModel,
}))(CommonLayout);
