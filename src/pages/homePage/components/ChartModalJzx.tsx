/**
 * 竞争性柱状图点击表格弹窗
 */
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Table, message, Modal } from 'antd';
import moment from 'moment';
import Apis from '@/utils/apis';

export default function ChartModalJzx(props: any) {
  const {
    projectCapitalSourceId: project_capital_source_id,
    visible,
    onCancel,
    name,
  } = props;
  const [current, setCurrent] = useState(1);
  const [pagesize, setPagesize] = useState(5);
  const [listData, setListData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, [current]);

  const columns: any = [
    {
      title: '名称',
      dataIndex: 'project_name',
      align: 'center',
      render: (value: any) => {
        return value || '-';
      },
    },
    {
      title: '下达资金',
      dataIndex: 'order_amount',
      align: 'center',
      render: (value: any) => {
        return value ?? '-';
      },
    },
    {
      title: '已兑现资金（万元）',
      dataIndex: 'real_fund_amount',
      align: 'center',
      render: (value: any) => {
        return value ?? '-';
      },
    },
    {
      title: '申报时间',
      dataIndex: 'start_declare_at',
      align: 'center',
      render: (value: any) => {
        return value ?? '-';
      },
    },
  ];

  const getData = () => {
    let data = {
      page: current,
      pagesize: pagesize,
      project_capital_source_id,
    };
    setLoading(true);
    Apis.getProjectTableData(data)
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
    <Modal
      centered
      destroyOnClose
      visible={visible}
      title={name || '资金情况'}
      width={800}
      onCancel={onCancel}
      footer={false}
    >
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
    </Modal>
  );
}
