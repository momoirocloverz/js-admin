import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, Form, Input, Button, message } from 'antd';
import APIs from '@/utils/apis';
import styles from './index.less';
import Base from './com/base';
import Second from './com/second';
import Third from './com/third';
import { connect, history } from 'umi';
const { TabPane } = Tabs;
const Details = ({ location, ...all }) => {
  const { dispatch } = all;
  const [tabKey, setTabKey] = useState('1');
  const [showFirst, setShowFirst] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [showThird, setShowThird] = useState(false);
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };
  const breadCrumbsAction = () => {
    commitGlobalBread([
      {
        title: '基础设置',
      },
      {
        title: '投资管理设置',
      },
    ]);
  };
  const checkTab = () => {
    if (location.query && location.query.tab) {
      setTabKey(location.query.tab);
    }
  };
  const fetchDetail = () => {
    /* APIs.projectFmInfo({ id: location.query.id })
      .then((res) => {
        if (res && res.code == 0) {
          if (res.data.info && res.data.info.id) {
            let shorter = res.data.info;
            setStatus(shorter.status);
            setGlobalData(shorter);
            if (shorter.attachment && shorter.attachment.length) {
              let mixArray = shorter.attachment;
              littleForm.setFieldsValue({
                audit_reason: shorter.audit_reason,
                attachment: mixArray,
              });
              setFiles(mixArray);
            }
          }
        }
      })
      .catch((err) => {
        console.log('err', err);
      }); */
  };
  useEffect(() => {
    breadCrumbsAction();
    checkTab();
    fetchDetail();
    return () => {};
  }, []);
  const shutDown1 = () => {
    setShowFirst(false);
  };
  const shutDown2 = () => {
    setShowSecond(false);
  };
  const shutDown3 = () => {
    setShowThird(false);
  };
  const triggerShow = () => {
    console.log('tabKey', tabKey);
    switch (tabKey) {
      case '1':
        setShowFirst(true);
        break;
      case '2':
        setShowSecond(true);
        break;
      case '3':
        setShowThird(true);
        break;
    }
  };
  return (
    <div className={styles.page}>
      <Tabs
        defaultActiveKey="1"
        activeKey={tabKey}
        onChange={(value) => {
          setTabKey(value);
          history.replace({
            pathname: '/baseSet/investSet',
            query: {
              tab: value,
            },
          });
        }}
      >
        <TabPane tab="标签" key="1">
          {tabKey == '1' && (
            <Base popDialog={showFirst} shutDialog={shutDown1} />
          )}
        </TabPane>
        <TabPane tab="办事要点" key="2">
          {tabKey == '2' && (
            <Second popDialog={showSecond} shutDialog={shutDown2} />
          )}
        </TabPane>
        <TabPane tab="投资类型" key="3">
          {tabKey == '3' && (
            <Third popDialog={showThird} shutDialog={shutDown3} />
          )}
        </TabPane>
      </Tabs>
      <div className={styles.leftStatus}>
        <Button
          type={'primary'}
          onClick={() => {
            triggerShow();
          }}
        >
          新建
        </Button>
      </div>
    </div>
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(Details);
