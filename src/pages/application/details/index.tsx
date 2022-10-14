import React, { useEffect, useMemo, useState } from 'react';
import { Tabs } from 'antd';
import DeclareHomePage from '@/pages/application/declare';
import ProgressReports from '@/components/project/ProgressReports';
import ContractModification from '@/components/project/ContractModification';
import Payment from '@/components/project/Payment';
import APIs from '@/utils/apis';
import Evaluation from '@/components/project/Evaluation';
import styles from './index.less';
import { connect, history } from 'umi';
// import {useParams} from 'react-router-dom'
const { TabPane } = Tabs;
const Details = ({ location, ...all }) => {
  const { dispatch } = all;
  const projectId = useMemo(() => {
    return new URLSearchParams(location.search).get('id');
  }, [location]);
  const stage = useMemo(() => {
    return new URLSearchParams(location.search).get('stage');
  }, [location]);
  const applyId = useMemo(() => {
    return new URLSearchParams(location.search).get('applyId');
  }, [location]);
  const [tabKey, setTabKey] = useState(
    sessionStorage.getItem('projectTab')
      ? sessionStorage.getItem('projectTab')
      : stage || '1',
  );
  // let { id } = useParams();
  const [userId, setUserId] = useState();
  useMemo(() => {
    // if (location?.query?.stage == 1) {
    //   setTabKey('1');
    // }
  }, [location]);
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };
  const breadCrumbsAction = () => {
    if (location && location.query && location.query.breadCrumbs) {
      commitGlobalBread(JSON.parse(location.query.breadCrumbs));
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    APIs.getAdminInfo({})
      .then((result) => {
        if (result.code === 0) {
          setUserId(result?.data?.admin_info?.id);
        } else {
          throw new Error(result.msg);
        }
      })
      .catch((e) => {
        setUserId(undefined);
        console.warn(e);
      });
    breadCrumbsAction();
    return () => {
      sessionStorage.removeItem('projectTab');
    };
  }, []);

  return (
    <div className={styles.page}>
      <Tabs
        defaultActiveKey="1"
        activeKey={tabKey}
        onChange={(k) => {
          setTabKey(k);
          sessionStorage.setItem('projectTab', k);
        }}
      >
        <TabPane tab="项目申报材料" key="1">
          {tabKey === '1' && (
            <DeclareHomePage location={location} key={projectId} />
          )}
        </TabPane>
        <TabPane tab="进度汇报记录" key="2">
          {tabKey === '2' && <ProgressReports id={projectId} />}
        </TabPane>
        <TabPane tab="变更申请" key="3">
          {tabKey === '3' && (
            <ContractModification id={projectId} userId={userId} />
          )}
        </TabPane>
        <TabPane tab="项目验收材料" key="4">
          {tabKey === '4' && <Evaluation id={projectId} userId={userId} />}
        </TabPane>
        <TabPane tab="资金拨付表" key="5">
          {tabKey === '5' && (
            <Payment id={projectId} userId={userId} applyId={applyId} />
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(Details);
