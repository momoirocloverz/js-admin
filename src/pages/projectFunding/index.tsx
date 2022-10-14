import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useRef, useState } from 'react';
import AuthWrapper from '@/components/auth/authWrapper';
import { message, Button, Space, Modal, Form } from 'antd';
import { getProgramFundSource } from '@/api/fund';
import moment from 'moment';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { ProFormDigitRange } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
const projectType = {
  project: '竞争性财政支农项目',
  project_sub: '惠农补贴项目',
};
const FundSource = (props: any) => {
  const { dispatch } = props;
  const [masterAmount, setMasterAmount] = useState(0);
  const tableRef = useRef<ActionType>();
  const [isAllExpand, setIsAllExpand] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
  const initAction = () => {
    commitGlobalBread([
      {
        title: '资金管理',
      },
      {
        title: '项目资金来源',
      },
    ]);
  };
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };

  useEffect(() => {
    initAction();
  }, []);

  const toDetail = (item: any) => {
    return history.push({
      pathname: '/fund/projectFunding/detail',
      query: { id: item.id },
    });
  };
  const toEdit = (item: any) => {
    return history.push({
      pathname: '/fund/projectFunding/edit',
      query: { id: item.id },
    });
  };
  const projectTypeIcon: any = {
    1: 'https://img.hzanchu.com/acimg/1f4f6b3934298977758651240d062249.png',
    2: 'https://img.hzanchu.com/acimg/0afdb17f54cbfe544331d56ca1002724.png',
    3: 'https://img.hzanchu.com/acimg/28120b2e873fa1e3a692ab30dc4b5639.png',
    4: 'https://img.hzanchu.com/acimg/a3eb533892d9092ef6675560ace7b0c8.png',
  };

  const toNew = () => {
    history.push({
      pathname: '/fund/projectFunding/new',
    });
  };

  // 删除=
  const deleteItem = (record: any) => {
    const { id } = record;
    Modal.confirm({
      content: '删除后不可恢复，确认删除？',
      centered: true,
      onOk: async () => {
        const result: any = await Apis.projectCapitalSourceRemove({ id });
        if (result.code == 0) {
          message.success('删除成功');
          runSearch();
        } else {
          message.warning(result.msg);
        }
      },
      onCancel: async () => {},
    });
  };

  // 展开子表格
  const expandedRowRender = (record: any) => {
    const subColumns: any = [
      {
        title: '序号',
        width: '100px',
        render: (value: any, _: any, index: number) => {
          return <div> {index + 1} </div>;
        },
      },
      {
        title: '资金分项名称',
        width: '280px',
        render: (_: any, record: any) => (
          <div>
            {record.fund_subitem_info && record.fund_subitem_info.subitem_name
              ? record.fund_subitem_info.subitem_name
              : '-'}
          </div>
        ),
      },
      {
        title: '资金金额（万元）',
        dataIndex: 'amount',
        render: (_: any, record: any) => (
          <div>{record.amount ? record.amount : '-'}</div>
        ),
      },
      {
        title: '资金年度',
        dataIndex: 'remain_amount',
        render: (_: any, record: any) => (
          <div>
            {record.project_fund_source_info &&
            record.project_fund_source_info.year
              ? record.project_fund_source_info.year
              : '-'}
          </div>
        ),
      },
      {
        title: '资金名称',
        dataIndex: 'remain_amount',
        render: (_: any, record: any) => (
          <div>
            {record.project_fund_source_info &&
            record.project_fund_source_info.project_name
              ? record.project_fund_source_info.project_name
              : '-'}
          </div>
        ),
      },
      {
        title: '资金文号',
        dataIndex: 'remain_amount',
        render: (_: any, record: any) => (
          <div className={styles.rowFlex}>
            <div>
              {record.project_fund_source_info &&
              record.project_fund_source_info.fund_number
                ? record.project_fund_source_info.fund_number
                : '-'}
            </div>
            {record.project_fund_source_info &&
            record.project_fund_source_info.project_type ? (
              <img
                className={styles.marginLeft8}
                src={
                  projectTypeIcon[record.project_fund_source_info.project_type]
                }
              />
            ) : null}
          </div>
        ),
      },
    ];
    const data = record.project_capital_source_rel_subitem_list;
    return (
      <ProTable
        size="small"
        columns={subColumns}
        dataSource={data}
        search={false}
        pagination={false}
        options={false}
        headerTitle={false}
        rowKey="id"
      />
    );
  };

  // 展开状态改变
  const onExpandedRowsChange = (expandedRows: any) => {
    setExpandedRowKeys(expandedRows);
    if (expandedRows.length == dataSource.length) {
      setIsAllExpand(true);
    } else {
      setIsAllExpand(false);
    }
  };

  // 全部展开、收起
  const onExpandSwitchChange = () => {
    setExpandedRowKeys(isAllExpand ? [] : dataSource.map((v: any) => v.id));
    setIsAllExpand(!isAllExpand);
  };

  const loadData = async (rawParams: any) => {
    const { current: page, pageSize: pagesize, ...rest } = rawParams;
    const params = {
      ...rest,
      page,
      pagesize: 10,
      current: undefined,
    };

    // return console.log('params', params);
    const result = await getProgramFundSource(params);
    setDataSource(result?.data?.data);
    setMasterAmount(result.data.all_amount);
    return {
      data: result?.data?.data,
      total: result?.data?.total,
    };
  };

  const columns: any = [
    {
      title: '项目名称',
      dataIndex: 'project_name',
      key: 'search_project_name',
      align: 'center',
      width: 200,
      order: 4,
    },
    {
      title: '项目类型',
      dataIndex: 'project_type',
      key: 'search_project_type',
      align: 'center',
      valueType: 'select',
      valueEnum: projectType,
      order: 2,
      width: 150,
    },
    {
      title: '资金来源总额（万元）',
      dataIndex: 'all_amount',
      key: 'search_all_amount',
      align: 'center',
      formItemProps: { labelCol: 6 },
      order: 1,
      width: 160,
      renderFormItem: () => {
        return (
          <ProFormDigitRange
            label=""
            name="all_amount"
            separator="-"
            separatorWidth={30}
          />
        );
      },
    },
    {
      title: '剩余金额（万元）',
      dataIndex: 'all_remain_amount',
      align: 'center',
      width: 144,
      hideInSearch: true,
    },
    {
      title: '年度',
      dataIndex: 'year',
      key: 'search_year',
      align: 'center',
      width: 70,
      valueType: 'dateYear',
      order: 3,
      renderText: (text: any) => moment(`${text}`),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      align: 'center',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 160,
      hideInSearch: true,
      fixed: 'right',
      render: (text: any, record: any) => (
        <>
          <Space>
            <AuthWrapper mark={'fund-/fund/projectFunding-view'}>
              <div
                className={`${styles.darker}`}
                onClick={(e: any) => {
                  e.stopPropagation();
                  toDetail(record);
                }}
              >
                查看
              </div>
            </AuthWrapper>
            <AuthWrapper mark={'fund-/fund/projectFunding-edit'}>
              <div
                className={`${styles.darker}`}
                onClick={(e: any) => {
                  e.stopPropagation();
                  toEdit(record);
                }}
              >
                编辑
              </div>
            </AuthWrapper>
            <AuthWrapper mark={'fund-/fund/projectFunding-remove'}>
              <div
                className={`${styles.red}`}
                onClick={(e: any) => {
                  e.stopPropagation();
                  deleteItem(record);
                }}
              >
                删除
              </div>
            </AuthWrapper>
          </Space>
        </>
      ),
    },
  ];

  return (
    <div style={{ minHeight: '100%' }}>
      <ProTable
        className="expandTable"
        actionRef={tableRef}
        request={loadData}
        search={{
          defaultCollapsed: false,
        }}
        revalidateOnFocus={false}
        columns={columns}
        rowKey={(item) => item.id}
        onRow={(record) => {
          return {
            className: expandedRowKeys.includes(record.id) ? 'expanded' : '',
          };
        }}
        options={false}
        scroll={{ x: 'max-content', y: 530 }}
        expandable={{
          expandedRowRender,
          expandedRowClassName: () => 'expandRow',
          expandRowByClick: true,
          expandedRowKeys,
          onExpandedRowsChange: onExpandedRowsChange,
          columnWidth: 70,
        }}
        headerTitle={
          <div className={styles.sumText}>资金总额：{masterAmount}万元 </div>
        }
        toolBarRender={() => [
          <Button type="primary" onClick={() => onExpandSwitchChange()}>
            {`${isAllExpand ? '收起所有' : '展开所有'}`}
          </Button>,
          <AuthWrapper mark={'fund-/fund/projectFunding-new'}>
            <Button
              type="primary"
              onClick={() => toNew()}
              icon={<PlusOutlined />}
            >
              新建项目资金
            </Button>
          </AuthWrapper>,
        ]}
        bordered
      />
    </div>
  );
};

export default connect()(FundSource);
