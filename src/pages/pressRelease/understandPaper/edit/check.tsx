import styles from './index.less';
import { connect, history } from 'umi';
import React, { useEffect } from 'react';
import { Checkbox, Tag } from 'antd';
const UnderstandNewPaperPage = (props: any) => {
  const {
    location,
    accountInfo,
    dispatch,
    children,
    item,
    checkAction,
    defaultValue,
    index,
  } = props;
  const onChange = (item) => {
    checkAction(item, index);
  };
  return (
    <div className={styles.home}>
      <div className={styles.tagItem}>
        <Tag color="#0270c3">{item.name}</Tag>
        <Checkbox.Group
          options={item.children}
          defaultValue={defaultValue}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(
  UnderstandNewPaperPage,
);
