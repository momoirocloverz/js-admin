import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { message } from 'antd';

const HomePage = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [loginStatus, setLoginStatus] = useState(false);
  const initAction = () => {
    commitGlobalBread([
      {
        title: '权限管理',
      },
    ]);
  };
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };
  useEffect(() => {
    initAction();
  }, []);
  const commitGlobalTitle = (e: any) => {
    dispatch({
      type: 'baseModel/changeHomeTitle',
      payload: e,
    });
  };
  return <div className={styles.homePageCon}>开发中</div>;
};

export default connect(({ baseModel }) => ({ baseModel }))(HomePage);
