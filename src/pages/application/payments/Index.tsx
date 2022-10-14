import React, { useRef, useState, useEffect } from 'react';
import { Button, Switch,message } from 'antd';
import { getPaymentsProjects,getWaitNum } from '@/api/projects';
import { history, useActivate, useUnactivate, connect } from 'umi';
import { PAYMENT_STATUS } from '@/pages/application/const';
import styles from './index.less';
import AuthWrapper from '@/components/auth/authWrapper';
import TableRadio from '@/components/table/TableRadio';
import ProTable, { ActionType } from '@ant-design/pro-table';
import useProjectDocuments from '@/components/project/use-project-documents';
import { APPROVAL_STATUS } from '@/pages/application/const';
import {
  generateNodeText,
  generateApprovalStatusText,
  generateApprovalType,
} from '@/utils/project_helpers';
import { accSubtr } from '@/utils/common';
import moment from 'moment';
const Payments = (props: any) => {
  const { dispatch } = props;
  const tableRef = useRef<ActionType>();
  const searchStatus = useRef('-1');
  const { data: documents } = useProjectDocuments(14);
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
  const [expandSwitchChecked, setExpandSwitchChecked] = useState<any>(false);
  const [listData, setListData] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };
  const initAction = () => {
    commitGlobalBread([
      {
        title: '投资项目管理',
      },
      {
        title: '资金拨付',
      },
    ]);
  };
  const fetchCount = () => {
    getWaitNum({
      marks: ['zjbf'],
    })
      .then((res: any) => {
        if (res && res.code == 0) {
          setUnreadCount(res.data.zjbf);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err: any) => {
        console.log('err', err);
      });
  };
  useEffect(() => {
    initAction();
    fetchCount()
  }, []);
  useActivate(() => {
    initAction();
    fetchCount()
    tableRef.current?.reload();
  });
  useUnactivate(() => {});
  const columns: any = [
    {
      title: '项目名称',
      dataIndex: 'project_name',
      key: 'search_project_name',
      align: 'center',
      render: (value: any, record: any) => {
        if (record.project_reserve_id) {
          return (
            <>
              <div className={styles.tdWrapper}>
                <div
                  className={styles.projectReserveBtn}
                  onClick={() => jump2Reserve(record.project_reserve_id)}
                >
                  储备
                </div>
                <div className={styles.textOverflow2}>{value}</div>
              </div>
            </>
          );
        } else {
          return value;
        }
      },
    },
    {
      title: '项目类型',
      dataIndex: 'project_document_name',
      key: 'search_policy_document_id',
      align: 'center',
      hideInTable:true,
      valueType: 'select',
      valueEnum: documents?.reduce(
        (pre: any, { title, id }: any) => ({ ...pre, [id]: title }),
        {},
      ),
      render: (__: any, record: any) => {
        return record.get_policy?.title || '-';
      },
    },
    {
      title: '项目类型',
      align: 'center',
      dataIndex: 'project_document_name',
      hideInSearch:true,
    },
    {
      title: '申报主体',
      dataIndex: 'declare_unit',
      key: 'search_declare_main_name',
      align: 'center',
      formItemProps: { label: '主体名称' },
    },
    {
      title: '下达金额(万元)',
      dataIndex: 'order_amount',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '已兑现金额(万元)',
      dataIndex: 'real_fund_amount',
      align: 'center',
      hideInSearch: true,
      render: (value: any) => value ?? '-',
    },
    {
      title: '剩余可兑现金额(万元)',
      hideInSearch: true,
      render: (__: any, record: any) => {
        if (record.real_fund_amount != undefined) {
          return accSubtr(record.order_amount, record.real_fund_amount);
        } else {
          return '-';
        }
      },
    },
    {
      title: '项目验收通过时间',
      dataIndex: 'get_project_ys',
      align: 'center',
      hideInSearch: true,
      render: (__: any, record: any) => {
        return record.get_project_ys?.action_at ?? '-';
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      align: 'center',
      hideInSearch: true,
    },
  ];

  const jump2Reserve = (id: any) => {
    history.push({
      pathname: '/application/projectReserveDetail',
      query: { id },
    });
  };

  const loadData = async (rawParams: any) => {
    const { current: page, pageSize: pagesize, ...rest } = rawParams;
    const params = {
      ...rest,
      page,
      pagesize,
      current: undefined,
      search_status: searchStatus.current,
    };

    const result = await getPaymentsProjects(params);
    tableRef?.current?.clearSelected?.();
    setListData(result?.data?.data);
    if (searchStatus.current == '1') {
      // 待审核 全部展开
      setExpandedRowKeys(result?.data?.data?.map((v: any) => v.project_id));
      setExpandSwitchChecked(false);
    } else {
      setExpandSwitchChecked(false);
      setExpandedRowKeys([]);
    }
    return {
      data: result?.data?.data,
      total: result?.data?.total,
    };
  };

  const onRadioChange = (value: any) => {
    searchStatus.current = value;
    tableRef?.current?.reload();
  };

  // 展开子表格
  const expandedRowRender = (record: any) => {
    const expandColumns: any = [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        width: 70,
        render: (__: any, record: any, index: any) => `${index + 1}`,
      },
      {
        title: '拨款申请金额(万元)',
        dataIndex: 'apply_amount',
      },
      {
        title: '拨款申请填报时间',
        dataIndex: 'apply_at',
        render: (value: any) => moment(value)?.format('YYYY-MM-DD') ?? '-',
      },
      {
        title: '审核状态',
        dataIndex: 'is_check',
        render: (value: any) =>
          value == 4 ? '已通过' : value == 3 ? '已驳回' : '审核中',
      },
      {
        title: '操作',
        key: 'actions',
        align: 'center',
        hideInSearch: true,
        width: 150,
        render: (__: any, record: any) => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              disabled={record.is_check === 2}
              type="primary"
              ghost
              onClick={() => {
                history.push({
                  pathname: '/project/details',
                  query: {
                    id: record.project_id,
                    applyId: record.id,
                    stage: '5',
                    breadCrumbs: JSON.stringify([
                      {
                        title: '投资项目管理',
                        triggerOn: true,
                      },
                      {
                        title: '资金拨付',
                      },
                    ]),
                  },
                });
              }}
            >
              查看
            </Button>
          </div>
        ),
      },
    ];

    const data = record.project_amount_apply_list;
    return (
      <ProTable
        columns={expandColumns}
        dataSource={data}
        pagination={false}
        search={false}
        options={false}
        revalidateOnFocus={false}
        rowKey="id"
      />
    );
  };

  // 展开状态改变
  const onExpandedRowsChange = (expandedRows: any) => {
    setExpandedRowKeys(expandedRows);
    if (expandedRows.length != listData.length) {
      setExpandSwitchChecked(false);
    } else {
      setExpandSwitchChecked(true);
    }
  };

  // 全部展开、收起
  const onExpandSwitchChange = (expand: any) => {
    setExpandSwitchChecked(expand);
    setExpandedRowKeys(expand ? listData.map((v: any) => v.project_id) : []);
  };

  return (
    <div style={{ minHeight: '100%' }}>
      <ProTable
        tableStyle={{ margin: '0 20' }}
        columns={columns}
        actionRef={tableRef}
        request={loadData}
        search={{
          defaultCollapsed: false,
        }}
        expandable={{
          expandedRowRender,
          expandedRowClassName: () => 'expandRow',
          expandRowByClick: true,
          expandedRowKeys,
          onExpandedRowsChange: onExpandedRowsChange,
          columnWidth: '80px',
        }}
        onRow={(record) => {
          return {
            className: expandedRowKeys.includes(record.project_id)
              ? 'expanded'
              : '',
          };
        }}
        headerTitle={
          <TableRadio
            radioArray={[
              { label: '全部', value: '-1' },
              { label: '待审核', value: '1' },
            ]}
            spotIndex="1"
            spotCount={unreadCount}
            defaultValue="-1"
            onRadioChange={onRadioChange}
          />
        }
        options={false}
        revalidateOnFocus={false}
        pagination={{ pageSize: 10 }}
        toolBarRender={() => [
          <Switch
            checkedChildren="展开"
            unCheckedChildren="收起"
            defaultChecked
            checked={expandSwitchChecked}
            onChange={onExpandSwitchChange}
          />,
        ]}
        rowKey="project_id"
      />
    </div>
  );
};
export default connect(({ baseModel }) => ({ baseModel }))(Payments);
