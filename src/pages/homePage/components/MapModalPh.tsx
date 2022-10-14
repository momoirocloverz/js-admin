/**
 * 惠农补贴分布地图-点击弹窗
 */
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Table, message, Modal } from 'antd';
import moment from 'moment';
import Apis from '@/utils/apis';

export default function MapModalPh(props: any) {
  const {
    searchCategoryName: search_policy_category_name,
    visible,
    onCancel,
    name,
    townId: town_id,
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
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (__: any, record: any, index: number) => `${index + 1}`,
    },
    {
      title: '政策文件名',
      dataIndex: 'policy_document_title',
      align: 'center',
      render: (value: any) => {
        return value || '-';
      },
    },
    {
      title: '惠农补贴分类',
      dataIndex: 'category_name',
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
      title: '发布时间',
      dataIndex: 'issue_at',
      align: 'center',
      render: (value: any) => {
        return moment(value).format('YYYY-MM-DD') ?? '-';
      },
    },
  ];

  const getData = () => {
    let data = {
      town_id,
      search_project_type: 'project_sub',
      search_policy_category_name,
    };
    setLoading(true);
    Apis.homePagegetTownProjectList(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          setTotal(res.data.list?.length);
          setListData(res.data.list);
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
      title={name || '惠农补贴资金情况'}
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
