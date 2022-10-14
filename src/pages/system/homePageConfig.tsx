// 首页配置
import { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import styles from './index.less';
import HomeConfig from './components/HomeConfig';
import CompetitiveConfig from './components/CompetitiveConfig';
import InclusiveConfig from './components/InclusiveConfig';
const { TabPane } = Tabs;

export default function HomePageConfig() {
  const onChange = (key: string) => {
    // console.log(key);
  };

  useEffect(() => {});

  return (
    <div className={styles.pageCon}>
      <Tabs defaultActiveKey="1" onChange={onChange}>
        <TabPane tab="首页封面图配置" key="1">
          <HomeConfig />
        </TabPane>
        <TabPane tab="竞争性财政支农项目配置" key="2">
          <CompetitiveConfig />
        </TabPane>
        <TabPane tab="惠农补贴配置" key="3">
          <InclusiveConfig />
        </TabPane>
      </Tabs>
    </div>
  );
}
