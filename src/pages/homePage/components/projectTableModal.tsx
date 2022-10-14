/**
 * 数据据指标点击弹窗中的项目名称点击的表格弹窗
 */
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Table, message, Modal } from 'antd';
import moment from 'moment';
import Apis from '@/utils/apis';

export default function projectTableModal(props: any) {
  const {
    projectCapitalSourceId: project_capital_source_id,
    visible,
    onCancel,
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
      title: '类型',
      dataIndex: 'policy_document_category_name',
      align: 'center',
      render: (value: any) => {
        return value || '-';
      },
    },
    {
      title: '投资金额（万元）',
      dataIndex: 'all_invest_money',
      align: 'center',
      render: (value: any) => {
        return value ?? '-';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      align: 'center',
      render: (value: any) => {
        return value ? `${moment(value).format('YYYY-MM-DD HH:mm:ss')}` : '-';
      },
    },
    {
      title: '下达金额',
      dataIndex: 'order_amount',
      align: 'center',
      render: (value: any) => {
        return value ?? '-';
      },
    },
    {
      title: '已拨付资金（万元）',
      dataIndex: 'real_fund_amount',
      align: 'center',
      render: (value: any) => {
        return value ?? '-';
      },
    },
    {
      title: '项目阶段',
      dataIndex: 'status',
      align: 'center',
      render: (value: any, record: any) => {
        return getStatusText(record.policy_document_category_name, value);
      },
    },
  ];

  // 根据status和项目类型获取项目阶段
  const getStatusText = (
    policy_document_category_name: string,
    status: any,
  ) => {
    if (policy_document_category_name == '竞争性财政支农项目') {
      if (status == 0) {
        return '未提交';
      }
      if (status <= 46) {
        return '项目申报';
      }
      if (status <= 59) {
        return '项目变更';
      }
      if (status <= 69) {
        return '项目验收';
      }
      if (status <= 79) {
        return '资金兑现';
      }
    }
    return '-'
  };

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
      title="资金来源关联详情"
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
