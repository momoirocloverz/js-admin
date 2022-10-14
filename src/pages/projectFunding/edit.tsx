import styles from './edit.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import FormArea from './components/common';
import { message, Spin } from 'antd';
const FundSourceEdit = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [isLoading, setIsLoading] = useState(true);
  const initAction = () => {
    commitGlobalBread([
      {
        title: '资金管理',
        triggerOn: true,
      },
      {
        title: '项目资金来源',
        triggerOn: true,
      },
      {
        title: '项目资金来源编辑',
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
  return (
    <Spin spinning={isLoading} tip="加载中">
      <div className={styles.homePageCon}>
        <div className={styles.leftCon}>
          <div className={styles.leftTopCon}>
            <div className={styles.subTitle}>项目资金来源编辑</div>
            <FormArea id={location.query.id} setIsLoading={setIsLoading} />
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(FundSourceEdit);
