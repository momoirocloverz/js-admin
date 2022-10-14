/**
 * 主页底部表格
 */

import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Table, message, Space } from 'antd';
import moment from 'moment';
import Apis from '@/utils/apis';

export default function ListTable(props: any) {
  const [current, setCurrent] = useState(1);
  const [pagesize, setPagesize] = useState(4);
  const [listData, setListData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, [current]);

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'project_name',
      align: 'center',
      render: (value: any) => {
        return value || '-';
      },
    },
    {
      title: '申报单位',
      dataIndex: 'declare_unit',
      align: 'center',
      render: (value: any) => {
        return value || '-';
      },
    },
    {
      title: '项目结束日期',
      dataIndex: 'build_end_at',
      align: 'center',
      render: (value: any) => {
        return value ? moment(value).format('YYYY-MM-DD') : '-';
      },
    },
    {
      title: '距离项目结束时间',
      dataIndex: 'build_end_at',
      align: 'center',
      render: (value: any) => {
        return value ? `${moment(value).diff(moment(), 'days')}天` : '-';
      },
    },
    {
      title: '逾期状态',
      dataIndex: 'overdue_year',
      align: 'center',
      render: (value: any) => {
        if (value == 0) {
          return (
            <Space className={`${styles.statusTag} ${styles.greenStatus}`}>
              <div className={styles.dot}></div>
              <div className={styles.text}>正常</div>
            </Space>
          );
        } else if (value == 0.5) {
          return (
            <Space className={`${styles.statusTag} ${styles.yellowStatus}`}>
              <div className={styles.dot}></div>
              <div className={styles.text}>逾期半年</div>
            </Space>
          );
        } else if (value >= 1) {
          return (
            <Space className={`${styles.statusTag} ${styles.orangeStatus}`}>
              <div className={styles.dot}></div>
              <div className={styles.text}>逾期一年以上</div>
            </Space>
          );
        }
        // else if (value == 2) {
        //   return (
        //     <Space className={`${styles.statusTag} ${styles.redStatus}`}>
        //       <div className={styles.dot}></div>
        //       <div className={styles.text}>逾期两年</div>
        //     </Space>
        //   );
        // }
      },
    },
  ];

  const getData = () => {
    let data = {
      page: current,
      page_size: pagesize,
    };
    setLoading(true);
    Apis.getHomePageJzList(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          setTotal(res.data.total);
          setListData(res.data.data);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onPageChange = (e: any) => {
    setCurrent(e);
  };

  return (
    <>
      <Table
        columns={columns}
        rowKey={(item: any) => item.project_id}
        dataSource={listData}
        pagination={{
          current,
          pageSize: pagesize,
          total,
          size: 'small',
          onChange: onPageChange,
        }}
        loading={loading}
        scroll={{ y: 600 }}
      />
      {/* <Pagination
        className={styles.pagination}
        hideOnSinglePage
        current={current}
        pageSize={pagesize}
        onChange={onPageChange}
      /> */}
    </>
  );
}
