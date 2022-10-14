/**
 * 菜单-全部项目
 */
import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history, KeepAlive, useActivate, useUnactivate } from 'umi';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import AuthWrapper from '@/components/auth/authWrapper';
import { Space } from 'antd';
import { ProFormDigitRange } from '@ant-design/pro-form';
import useProjectDocuments from '@/components/project/use-project-documents';
import { getPCAllProjects, getDocumentList } from '@/api/projects';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { ConsoleSqlOutlined } from '@ant-design/icons';

const AllProjects = (props: any) => {
  const { dispatch } = props;
  const tableRef = useRef<ActionType>();
  const { data: documents } = useProjectDocuments(14);
  const [temp1data, setTemp1data] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
  const [expandSwitchChecked, setExpandSwitchChecked] = useState<any>(false);
  const [listData, setListData] = useState([]);

  useActivate(() => {
    initAction();
    tableRef.current?.reload();
  });
  useUnactivate(() => {});

  useEffect(() => {
    initAction();
  }, []);

  const calcFunction = (array: any) => {
    let temp = array.map((ele: any) => {
      if (ele.amount) {
        return ele.amount;
      } else {
        return 0;
      }
    });
    let res = temp.reduce((acc: any, current: any) => {
      return Number(acc) + Number(current);
    }, 0);
    return res;
  };

  const initAction = () => {
    commitGlobalBread([
      {
        title: '投资项目管理',
      },
      {
        title: '全部项目',
      },
    ]);
  };

  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };

  const documentMap = useMemo(() => {
    if (documents?.length) {
      return documents?.reduce(
        (pre: any, { title, id }: any) => ({ ...pre, [id]: title }),
        {},
      );
    }
  }, [documents]);

  /*   const stageMap: any = {
    0: '材料未全部提交',
    1: '乡镇审核',
    3: '乡镇审核',
    9: '乡镇审核',
    10: '项目申报',
    11: '项目申报',
    20: '项目申报',
    21: '项目申报',
    30: '项目申报',
    31: '项目申报',
    29: '项目申报',
    39: '项目申报',
    40: '项目申报',
    43: '项目申报',
    45: '项目申报',
    46: '项目申报',
    50: '项目实施',
    51: '项目实施',
    52: '项目实施',
    59: '项目实施',
    61: '项目验收',
    60: '项目验收',
    69: '项目验收',
    62: '项目验收',
    70: '资金兑现',
    71: '资金兑现',
    72: '资金兑现',
    73: '资金兑现',
    74: '资金兑现',
    79: '资金兑现',
  }; */
  const stageMap: any = {
    0: '申报管理',
    1: '乡镇审核',
    3: '乡镇审核',
    9: '乡镇审核',
    10: '申报管理',
    11: '申报管理',
    20: '申报管理',
    21: '申报管理',
    30: '申报管理',
    31: '申报管理',
    29: '申报管理',
    39: '申报管理',
    40: '申报管理',
    43: '申报管理',
    45: '申报管理',
    46: '申报管理',
    50: '实施管理',
    51: '实施管理',
    52: '实施管理',
    59: '实施管理',
    61: '验收管理',
    60: '验收管理',
    69: '验收管理',
    62: '验收管理',
    70: '资金拨付',
    71: '资金拨付',
    72: '资金拨付',
    73: '资金拨付',
    74: '资金拨付',
    79: '资金拨付',
  };
  /*   const statusMap = {
    0: '材料未全部提交',
    1: '乡镇审核中',
    3: '乡镇审核—不通过',
    9: '乡镇审核不通过',
    10: '材料审核中',
    11: '材料审核—不通过',
    20: '评审中',
    21: '评审—不通过',
    29: '评审—不通过',
    30: '联审中',
    31: '联审—不通过',
    39: '联审—不通过',
    40: '公示中',
    43: '公示不通过',
    45: '文件下达',
    46: '文件下达',
    50: '无变更',
    51: '变更未处理',
    52: '变更审核成功(已处理)',
    59: '变更审核失败(已处理)',
    60: '项目验收未验收',
    61: '项目验收待审核',
    62: '项目验收已验收',
    69: '项目验收不通过',
    70: '待审核',
    71: '审核通过',
    72: '完成拨款',
    73: '主要领导审核',
    74: '完成拨款',
    79: '驳回',
  }; */
  const statusMap = {
    0: '已驳回',
    1: '乡镇审核中',
    3: '已驳回',
    9: '已驳回',
    10: '材料审核中',
    11: '已驳回',
    20: '评审中',
    21: '已驳回',
    29: '已驳回',
    30: '联审中',
    31: '已驳回',
    39: '已驳回',
    40: '公示中',
    43: '已驳回',
    45: '文件下达',
    46: '文件下达',
    50: '无变更',
    51: '变更未处理',
    52: '变更审核成功(已处理)',
    59: '变更审核失败(已处理)',
    60: '项目验收未验收',
    61: '项目验收待审核',
    62: '项目验收已验收',
    69: '已驳回',
    70: '待审核',
    71: '审核通过',
    72: '完成拨款',
    73: '主要领导审核',
    74: '完成拨款',
    79: '驳回',
  };
  const processor = (record: any) => {
    switch (record.status) {
      case 0:
        return '-';
      case 1:
        return (
          <div>
            {record.village_admin_info && record.village_admin_info.role_name}-
            {record.village_admin_info && record.village_admin_info.username}
          </div>
        );
        break;
      case 3:
        return (
          <div>
            {record.village_admin_info && record.village_admin_info.role_name}-
            {record.village_admin_info && record.village_admin_info.username}
          </div>
        );
        break;
      case 9:
        return (
          <div>
            {record.village_admin_info && record.village_admin_info.role_name}-
            {record.village_admin_info && record.village_admin_info.username}
          </div>
        );
        break;

      case 10:
        return (
          <div>
            {record.audit_admin_info && record.audit_admin_info.role_name}-
            {record.audit_admin_info && record.audit_admin_info.username}
          </div>
        );
        break;
      case 11:
        return (
          <div>
            {record.audit_admin_info && record.audit_admin_info.role_name}-
            {record.audit_admin_info && record.audit_admin_info.username}
          </div>
        );
        break;
      case 20:
        return (
          <div>
            {record.review_admin_info && record.review_admin_info.role_name}-
            {record.review_admin_info && record.review_admin_info.username}
          </div>
        );
        break;
      case 21:
        return (
          <div>
            {record.review_admin_info && record.review_admin_info.role_name}-
            {record.review_admin_info && record.review_admin_info.username}
          </div>
        );
        break;
      case 29:
        return (
          <div>
            {record.review_admin_info && record.review_admin_info.role_name}-
            {record.review_admin_info && record.review_admin_info.username}
          </div>
        );
        break;

      case 30:
        return (
          <div>
            {record.unit_admin_info && record.unit_admin_info.role_name}-
            {record.unit_admin_info && record.unit_admin_info.username}
          </div>
        );
        break;
      case 31:
        return (
          <div>
            {record.unit_admin_info && record.unit_admin_info.role_name}-
            {record.unit_admin_info && record.unit_admin_info.username}
          </div>
        );
        break;
      case 39:
        return (
          <div>
            {record.unit_admin_info && record.unit_admin_info.role_name}-
            {record.unit_admin_info && record.unit_admin_info.username}
          </div>
        );
        break;
      case 40:
        return (
          <div>
            {record.pass_admin_info && record.pass_admin_info.role_name}-
            {record.pass_admin_info && record.pass_admin_info.username}
          </div>
        );
        break;
      case 43:
        return (
          <div>
            {record.pass_admin_info && record.pass_admin_info.role_name}-
            {record.pass_admin_info && record.pass_admin_info.username}
          </div>
        );
        break;
      case 45:
        return (
          <div>
            -
            {/* {record.unit_admin_info && record.unit_admin_info.role_name}-
              {record.unit_admin_info && record.unit_admin_info.username} */}
          </div>
        );
        break;
      case 50:
        return (
          <div>
            {record.implement_schedule_admin_info &&
              record.implement_schedule_admin_info.role_name}
            -
            {record.implement_schedule_admin_info &&
              record.implement_schedule_admin_info.username}
          </div>
        );
        break;
      case 51:
        return (
          <div>
            {record.implement_schedule_admin_info?.role_name}-
            {record.implement_schedule_admin_info?.username}
          </div>
        );
        break;
      case 52:
        return (
          <div>
            {record.implement_schedule_admin_info &&
              record.implement_schedule_admin_info.role_name}
            -
            {record.implement_schedule_admin_info &&
              record.implement_schedule_admin_info.username}
          </div>
        );
        break;
      case 59:
        return (
          <div>
            {record.implement_schedule_admin_info &&
              record.implement_schedule_admin_info.role_name}
            -
            {record.implement_schedule_admin_info &&
              record.implement_schedule_admin_info.username}
          </div>
        );
        break;
      case 60:
        return (
          <div>
            {record.acceptance_check_admin_info &&
              record.acceptance_check_admin_info.role_name}
            -
            {record.acceptance_check_admin_info &&
              record.acceptance_check_admin_info.username}
          </div>
        );
        break;
      case 61:
        return (
          <div>
            {record.acceptance_check_admin_info &&
              record.acceptance_check_admin_info.role_name}
            -
            {record.acceptance_check_admin_info &&
              record.acceptance_check_admin_info.username}
          </div>
        );
        break;
      case 62:
        return (
          <div>
            {record.acceptance_check_admin_info &&
              record.acceptance_check_admin_info.role_name}
            -
            {record.acceptance_check_admin_info &&
              record.acceptance_check_admin_info.username}
          </div>
        );
        break;
      case 69:
      case 70:
      case 71:
      case 72:
      case 73:
      case 74:
      case 79:
        return (
          <div>
            {record.acceptance_check_admin_info &&
              record.acceptance_check_admin_info.role_name}
            -
            {record.acceptance_check_admin_info &&
              record.acceptance_check_admin_info.username}
          </div>
        );
        break;
    }
  };

  const columns: ProColumns[] = [
    {
      title: '项目类型',
      dataIndex: 'title',
      key: 'search_policy_document_id',
      align: 'center',
      valueType: 'select',
      valueEnum: documentMap ?? {},
      fixed: 'left',
      // width: 200,
      render: (value: any) => {
        return value || '-';
      },
    },
    {
      title: '总投资金额（万元）',
      dataIndex: 'out_all_invest_money',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '总下达金额（万元）',
      dataIndex: 'out_order_amount',
      align: 'center',
      hideInSearch: true,
      // width: 130,
      render: (value: any) => {
        return value || '-';
      },
    },
    {
      title: '总已拨付资金（万元）',
      dataIndex: 'out_real_fund_amount',
      align: 'center',
      hideInSearch: true,
      // width: 150,
      render: (__: any, record: any) => {
        const { project_fund_rel_subitem_list } = record;
        if (project_fund_rel_subitem_list?.length) {
          return calcFunction(record.project_fund_rel_subitem_list);
        } else {
          return '-';
        }
      },
    },
    {
      title: '项目数量',
      dataIndex: 'project_list',
      align: 'center',
      hideInSearch: true,
      // width: 84,
      render: (value: any) => {
        return value?.length ?? '-';
      },
    },
    // 下面是渲染搜索表单的配置，不在外层表格中展示
    {
      title: '项目名称',
      key: 'search_project_name',
      hideInTable: true,
    },
    {
      title: '主体名称',
      key: 'search_declare_main_name',
      hideInTable: true,
    },
    {
      title: '投资金额',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <div className={styles.rangeInput}>
            <ProFormDigitRange
              label=""
              name="invest_money"
              separator="-"
              separatorWidth={30}
            />
          </div>
        );
      },
    },
    {
      title: '申报时间',
      hideInTable: true,
      valueType: 'dateTimeRange',
    },
  ];

  const expandedColumns: ProColumns[] = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      width: 84,
      fixed: 'left',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '名称',
      dataIndex: 'project_name',
      key: 'search_project_name',
      align: 'center',
      formItemProps: { label: '项目名称' },
      width: 140,
      fixed: 'left',
      render: (value: any) => {
        return value || '-';
      },
    },
    {
      title: '主体名称',
      dataIndex: 'declare_unit',
      key: 'search_declare_main_name',
      align: 'center',
      hideInTable: true,
      width: 120,
    },
    {
      title: '投资金额（万元）',
      dataIndex: 'all_invest_money',
      align: 'center',
      width: 130,
    },
    {
      title: '下达金额（万元）',
      dataIndex: 'order_amount',
      align: 'center',
      hideInSearch: true,
      width: 130,
      render: (value: any) => {
        return value || '-';
      },
    },
    {
      title: '已拨付资金（万元）',
      dataIndex: 'project_fund_rel_subitem_list',
      align: 'center',
      hideInSearch: true,
      width: 150,
      render: (__: any, record: any) => {
        const { project_fund_rel_subitem_list } = record;
        if (project_fund_rel_subitem_list?.length) {
          return calcFunction(record.project_fund_rel_subitem_list);
        } else {
          return '-';
        }
      },
    },
    {
      title: '项目阶段',
      dataIndex: 'status',
      align: 'center',
      hideInSearch: true,
      width: 84,
      render: (text: any, record: any) => (
        <Space size="middle">{stageMap[record.status]}</Space>
      ),
    },
    {
      title: '项目状态',
      dataIndex: 'status',
      align: 'center',
      hideInSearch: true,
      width: 84,
      render: (text: any, record: any) => (
        <Space size="middle">{statusMap[record.status]}</Space>
      ),
    },
    {
      title: '当前责任部门',
      align: 'center',
      hideInSearch: true,
      width: 120,
      render: (text: any, record: any) => (
        <Space size="middle">
          {/* {record[roleMap[record.status] ].username} */}
          {processor(record)}
          <div>
            <div>
              {/* {record.village_admin_info && record.village_admin_info.username}  role_name */}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '申报时间',
      dataIndex: 'start_declare_at',
      align: 'center',
      valueType: 'dateTimeRange',
      width: 120,
      render: (__: any, record: any) => (
        <div>{record.start_declare_at || '-'}</div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      align: 'center',
      hideInSearch: true,
      fixed: 'right',
      render: (text: any, record: any) => (
        <Space size="middle">
          {/* <AuthWrapper mark={'application-/application/project-view'}> */}
          <a className={styles.darker} onClick={() => toEdit(record)}>
            查看
          </a>
          {/* </AuthWrapper> */}
        </Space>
      ),
    },
  ];

  const loadData = async (rawParams: any) => {
    const {
      current: page,
      pageSize: pagesize,
      invest_money,
      start_declare_at,
      ...rest
    } = rawParams;
    const params = {
      ...rest,
      page,
      pagesize,
      current: undefined,
    };

    if (invest_money?.length) {
      params.search_min_invest_money = invest_money?.[0];
      params.search_max_invest_money = invest_money?.[1];
    }
    if (start_declare_at?.length) {
      params.search_start_declare_at_min_at = start_declare_at?.[0];
      params.search_start_declare_at_max_at = start_declare_at?.[1];
    }
    // return console.log('params', params);
    const result = await getPCAllProjects(params);
    tableRef?.current?.clearSelected?.();
    setTemp1data(result.data.data);
    setListData(result.data.data);
    return {
      data: result?.data?.data,
      total: result?.data?.total,
    };
  };

  const toEdit = (item: any) => {
    history.push({
      pathname: '/project/details',
      query: {
        id: item.project_id,
        stage: '1',
      },
    });
  };

  const expandedRowRender = (record: any) => {
    const { project_list = [] } = record;
    return (
      <div className="innerTable">
        <ProTable
          columns={expandedColumns}
          scroll={{ x: 1000 }}
          headerTitle={false}
          search={false}
          options={false}
          dataSource={project_list}
          pagination={false}
          rowKey="project_id"
        />
      </div>
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
    setExpandedRowKeys(expand ? listData.map((v: any) => v.id) : []);
  };

  return (
    <div style={{ minHeight: '100%' }}>
      <ProTable
        tableStyle={{ marginTop: 20, marginBottom: 20 }}
        columns={columns}
        search={{
          defaultCollapsed: false,
        }}
        scroll={{ x: true }}
        actionRef={tableRef}
        request={loadData}
        options={false}
        revalidateOnFocus={false}
        pagination={{ pageSize: 10 }}
        rowKey="id"
        rowClassName={(record, index) => {
          return expandedRowKeys.includes(record.id) ? 'expanded' : '';
        }}
        expandable={{
          expandedRowRender,
          expandedRowClassName: () => 'expandRow',
          expandRowByClick: true,
          expandedRowKeys,
          onExpandedRowsChange: onExpandedRowsChange,
          columnWidth: '30px',
        }}
        onReset={() => setExpandedRowKeys([])}
      />
    </div>
  );
};

export default connect()(AllProjects);
