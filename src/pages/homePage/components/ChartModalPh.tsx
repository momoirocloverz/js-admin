/**
 * 竞争性柱状图点击表格弹窗
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './index.less';
import { Table, message, Modal } from 'antd';
import moment from 'moment';
import Apis from '@/utils/apis';
const projectTypeObj: any = {
  21: '农机购置补助',
  22: '秸秆利用补助 ',
  23: '社会化服务补助',
};
export default function ChartModalPh(props: any) {
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
  const [townList, setTownList] = useState<any>([]);

  const declareAtColumn = {
    title: '申报时间',
    dataIndex: 'submit_at',
    align: 'center',
    render: (value: any) => {
      return value ?? '-';
    },
  };
  const realFundColumn = {
    title: '已兑现资金（万元）',
    dataIndex: 'real_fund_amount',
    align: 'center',
    render: (value: any) => {
      return value || '-';
    },
  };

  const policyDocument = {
    title: '所属政策文件',
    align: 'center',
    render: (__: any, record: any) => {
      return record.policy_document_info?.title ?? '-';
    },
  };

  // 有机肥
  const yjfColumns: any = [
    {
      title: '粮食生产经营主体',
      align: 'center',
      render: (__: any, record: any) => {
        return record.sub_info?.subject_name ?? '-';
      },
    },
    { ...policyDocument },
    { ...realFundColumn },
    { ...declareAtColumn },
  ];

  // 秸秆
  const jgColumns: any = [
    {
      title: '主体名称',
      align: 'center',
      render: (__: any, record: any) => {
        return record.sub_info?.subject_name ?? '-';
      },
    },
    { ...policyDocument },
    {
      title: '分类',
      dataIndex: 'form_type',
      align: 'center',
      render: (value: any) => {
        return projectTypeObj[`${value}`] ?? '-';
      },
    },
    { ...realFundColumn },
    { ...declareAtColumn },
  ];

  // 湖羊
  const hyColumns: any = [
    {
      title: '负责人',
      align: 'center',
      render: (__: any, record: any) => {
        return record.sub_info?.principal ?? '-';
      },
    },
    {
      title: '地址',
      align: 'center',
      render: (__: any, record: any) => {
        try {
          const {
            sub_info: { city_id, town_id, village_id },
          } = record;
          if (townList?.length) {
            const townItem = townList[0].children.find(
              (v: any) => v.id == town_id,
            );
            const villageItem = townItem.children.find(
              (v: any) => v.id == village_id,
            );
            return `江山市${townItem.name}${villageItem.name}`;
          }
        } catch (e) {
          console.log('地址解析出错', e);
        }
      },
    },
    { ...policyDocument },
    { ...realFundColumn },
    { ...declareAtColumn },
  ];

  // 无害化
  const whhColumns: any = [
    {
      title: '月份',
      align: 'center',
      render: (__: any, record: any) => {
        return record.sub_info.month || '-';
      },
    },
    {
      title: '责任公司',
      align: 'center',
      render: (__: any, record: any) => {
        return record.sub_info.duty_company || '-';
      },
    },
    {
      title: '联系电话',
      align: 'center',
      render: (__: any, record: any) => {
        return record.sub_info.link_mobile || '-';
      },
    },
    {
      title: '是否有保险',
      align: 'center',
      render: (__: any, record: any) => {
        return record.sub_info.is_insurance == 1 ? '是' : '否';
      },
    },
    { ...policyDocument },
    { ...realFundColumn },
    { ...declareAtColumn },
  ];

  // 粮油
  const lyColumns: any = [
    {
      title: '粮食生产经营主体',
      align: 'center',
      render: (__: any, record: any) => {
        return record.sub_info?.main_name ?? '-';
      },
    },
    { ...policyDocument },
    { ...realFundColumn },
    { ...declareAtColumn },
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

  const getColumns = () => {
    if (name.indexOf('有机肥') > -1) {
      return yjfColumns;
    } else if (name.indexOf('秸秆') > -1) {
      return jgColumns;
    } else if (name.indexOf('湖羊') > -1) {
      return hyColumns;
    } else if (name.indexOf('无害化') > -1) {
      return whhColumns;
    } else if (name.indexOf('粮油') > -1) {
      return lyColumns;
    }
  };

  useMemo(() => {
    getData();
  }, [current]);

  useMemo(() => {
    if (name?.indexOf('湖羊') > -1 && !townList?.length) {
      Apis.fetchAreaList({})
        .then((res: any) => {
          if (res && res.code === 0) {
            setTownList(res.data.list);
          } else {
            message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }, [name]);

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
        columns={getColumns()}
        rowKey={`id`}
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
