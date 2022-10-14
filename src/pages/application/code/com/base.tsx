import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, Form, Input, Button, Descriptions, message } from 'antd';
import APIs from '@/utils/apis';
import styles from './base.less';
import { connect, history, useLocation } from 'umi';
const Details = (props: any) => {
  const { accountInfo, dispatch, children } = props;
  const location = useLocation();
  const [statusMap, setStatusMap] = useState({
    1: '待审核',
    2: '已通过',
    9: '未通过',
  });
  const [currentInfo, setCurrentInfo] = useState({});
  const [status, setStatus] = useState(1);
  const fetchDetail = () => {
    APIs.projectFmInfo({ id: location.query.id })
      .then((res) => {
        if (res && res.code == 0) {
          if (res.data.info && res.data.info.id) {
            let shorter = res.data.info;
            setCurrentInfo(shorter);
          }
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  useEffect(() => {
    if (location && location.query.id) {
      fetchDetail();
    }
    return () => {};
  }, []);
  return (
    <div className={styles.pageCodeBase}>
      <Descriptions
        title="项目信息"
        column={6}
        bordered
        className={styles.desHead}
      >
        <Descriptions.Item label="项目名称" span={3}>
          {currentInfo.project_name || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="项目类型" span={3}>
          {currentInfo.project_type_txt || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="项目代码" span={3}>
          {currentInfo.project_code || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="建设性质" span={3}>
          {currentInfo.project_nature_txt || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="投资金额(万元)" span={3}>
          {currentInfo.total_money || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="建设地址" span={3}>
          {currentInfo.place_code_detail || '-'}
        </Descriptions.Item>
        {/* <Descriptions.Item label="总用地面积" span={3}>
          {currentInfo.name || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="总建筑面积" span={3}>
          {currentInfo.name || '-'}
        </Descriptions.Item> */}
        <Descriptions.Item label="计划开工日期" span={3}>
          {currentInfo.start_year || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="计划完工日期" span={3}>
          {currentInfo.end_year || '-'}
        </Descriptions.Item>
        {/* <Descriptions.Item label="建设规模及内容" span={3}>
          {currentInfo.scale_content || '-'}
        </Descriptions.Item> */}
      </Descriptions>

      <Descriptions column={6} bordered className={styles.resetSpecial}>
        <Descriptions.Item label="建设规模及内容">
          {currentInfo.scale_content || '-'}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions
        title="项目申请单位"
        column={6}
        bordered
        className={styles.desHead}
      >
        <Descriptions.Item label="项目单位">
          {currentInfo.enterprise_name || '-'}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions
        title="联系人信息"
        column={6}
        bordered
        className={styles.desHead}
      >
        {/* <Descriptions.Item label="项目负责人" span={3}>
          {currentInfo.name || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="负责人电话" span={3}>
          {currentInfo.name || '-'}
        </Descriptions.Item> */}
        <Descriptions.Item label="项目联系人" span={3}>
          {currentInfo.principal_name || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="联系人电话" span={3}>
          {currentInfo.principal_tel || '-'}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(Details);
