import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history, useActivate, useUnactivate } from 'umi';
import React, { useEffect, useRef, useState } from 'react';
import AuthWrapper from '@/components/auth/authWrapper';
import {
  message,
  Button,
  Space,
  Modal,
  Cascader,
  Tooltip,
  FormInstance,
} from 'antd';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import moment from 'moment';
import TableRadio from '@/components/table/TableRadio';
import { getPCProjectReserveList, getWaitNum } from '@/api/projects';
import { ProFormDigitRange } from '@ant-design/pro-form';
import _ from 'lodash';

const projectReserveList = (props: any) => {
  const { location, dispatch } = props;
  const tableRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const searchStatus = useRef(-1);
  const [townList, setTownList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
  const [expandSwitchChecked, setExpandSwitchChecked] = useState<any>(false);
  const [listData, setListData] = useState([]);

  const initAction = () => {
    commitGlobalBread([
      {
        title: '投资项目管理',
      },
      {
        title: '项目储备',
      },
    ]);
  };
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };
  const fetchCount = () => {
    getWaitNum({
      marks: ['xmcb'],
    })
      .then((res: any) => {
        if (res && res.code == 0) {
          setUnreadCount(res.data.xmcb);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err: any) => {
        console.log('err', err);
      });
  };
  useActivate(() => {
    initAction();
    fetchCount();
  });
  useUnactivate(() => {
    console.log('useUnactivate');
  });
  const fetchTown = () => {
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
  };
  useEffect(() => {
    fetchTown();
    fetchCount();
    initAction();
  }, []);

  const toDetail = (item: any) => {
    if (item.from_source == 1) {
      history.push({
        pathname: '/invest/code/Detail',
        query: { id: item.project_fm_id },
      });
    } else {
      history.push({
        pathname: '/application/projectReserveDetail',
        query: { id: item.id },
      });
    }
  };
  const projectTypeObj: any = {
    1: '种植业',
    2: '养殖业',
    3: '加工业',
    4: '乡村建设',
    9: '其他',
    11: '备案类',
    12: '审批类',
    13: '核准类',
  };
  const columns: any = [
    {
      title: '项目类型',
      dataIndex: 'project_type',
      key: 'search_project_type',
      align: 'center',
      valueType: 'select',
      valueEnum: projectTypeObj,
      order: 1,
      fixed: 'left',
      render: (text: any, record: any) => (
        <>
          <div>{projectTypeObj[record.project_type]}</div>
        </>
      ),
    },
    {
      title: '总投资额(万元）',
      dataIndex: 'out_all_invest_money',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '项目数量',
      dataIndex: 'out_project_count',
      align: 'center',
      hideInSearch: true,
    },
    // 下面是渲染搜索表单的配置，不在外层表格中展示
    {
      title: '项目名称',
      key: 'search_project_name',
      hideInTable: true,
      order: 2,
    },
    {
      title: '建设主体',
      dataIndex: 'search_declare_unit',
      key: 'search_declare_unit',
      align: 'center',
      hideInTable: true,
    },
    {
      title: '项目地点',
      key: 'search_address',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Cascader
            options={townList}
            fieldNames={{
              label: 'name',
              value: 'id',
              children: 'children',
            }}
            changeOnSelect={true}
            placeholder="请选择项目地点"
          />
        );
      },
    },
    {
      title: '申报时间',
      key: 'search_declare_period',
      hideInTable: true,
      valueType: 'dateRange',
    },
    {
      title: '建设期限',
      key: 'search_build_period',
      hideInTable: true,
      valueType: 'dateRange',
    },
    {
      title: '投资金额',
      key: 'search_all_invest_moneys',
      hideInTable: true,
      valueType: 'digit',
      formItemProps: { label: '投资金额' },
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
      width: 140,
      fixed: 'left',
      align: 'center',
    },
    {
      title: '申报单位',
      dataIndex: 'declare_unit',
      align: 'center',
      width: 120,
    },
    {
      title: '项目代码',
      dataIndex: 'project_fm_id',
      align: 'center',
      width: 120,
      render: (text: any, record: any) => (
        <>
          <div>{record.project_fm_id || '-'}</div>
        </>
      ),
    },
    {
      title: '项目地址',
      dataIndex: 'full_area',
      key: 'search_address',
      width: 120,
      align: 'center',
    },
    {
      title: '申报时间',
      dataIndex: 'declare_at',
      align: 'center',
      width: 120,
      render: (text: any, record: any) => (
        <>
          <div>
            {record.declare_at
              ? moment(record.declare_at).format('YYYY-MM-DD')
              : '-'}
          </div>
        </>
      ),
    },
    {
      title: '建设内容',
      dataIndex: 'build_contents',
      align: 'center',
      width: 140,
      render: (text: any, record: any) => {
        let content = '';
        if (record.build_contents && record.build_contents.length) {
          text.forEach((v: any) => {
            content += `${v.content}<br/>`;
          });
        }
        return (
          <Tooltip
            placement="top"
            title={<div dangerouslySetInnerHTML={{ __html: content }}></div>}
            className={styles.limitTd}
          >
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
          </Tooltip>
        );
      },
    },
    {
      title: '建设期限',
      dataIndex: 'created_at',
      align: 'center',
      width: 120,
      render: (text: any, record: any) => (
        <>
          <div>
            {moment(record.build_start_at).format('YYYY-MM-DD')}-
            {moment(record.build_end_at).format('YYYY-MM-DD')}
          </div>
        </>
      ),
    },
    {
      title: '投资额（万元）',
      dataIndex: 'created_at',
      align: 'center',
      width: 120,
      render: (text: any, record: any) => (
        <>
          <div>{record.all_invest_money}</div>
        </>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 120,
      render: (text: any, record: any) => (
        <>
          <div>{text == 1 ? '待审核' : text == 2 ? '已通过' : '已驳回'}</div>
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (text, record, index) => (
        <>
          <Space>
            <div
              className={`${styles.darker}`}
              onClick={() => toDetail(record)}
            >
              查看
            </div>
            <AuthWrapper
              mark={'application-/application/projectReserve-remove'}
            >
              <div
                className={`${styles.red}`}
                onClick={() => deleteItem(record)}
              >
                删除
              </div>
            </AuthWrapper>
          </Space>
        </>
      ),
    },
  ];

  const runSearch = (value?: any) => {
    tableRef?.current?.reload();
  };

  const exportAction = () => {
    const rawParams = formRef?.current?.getFieldsValue();
    console.log('export rawParams', rawParams);
    const {
      current: page,
      pageSize: pagesize,
      start_declare_at,
      search_address,
      search_declare_period,
      search_build_period,
      invest_money,
      ...rest
    } = rawParams;
    const params = {
      ...rest,
      page: 1,
      pagesize: Number.MAX_SAFE_INTEGER,
      current: undefined,
      search_status: searchStatus.current,
      is_export: 1,
    };

    if (search_address?.length) {
      params.search_city_id = search_address[0] || null;
      params.search_town_id = search_address[1] || null;
      params.search_village_id = search_address[2] || null;
    }
    if (search_declare_period?.length) {
      params.search_declare_ats = [
        `${search_declare_period[0].format('YYYY-MM-DD')} 00:00:01`,
        `${search_declare_period[1].format('YYYY-MM-DD')} 23:59:59`,
      ];
    }
    if (search_build_period?.length) {
      params.search_build_start_ats = [
        `${search_build_period[0].format('YYYY-MM-DD')} 00:00:01`,
        `${search_build_period[1].format('YYYY-MM-DD')} 23:59:59`,
      ];
    }

    if (selectedRowKeys?.length) {
      params.search_ids = selectedRowKeys;
    }

    // if (search_all_invest_moneys?.length) {
    //   params.search_min_invest_money = search_all_invest_moneys?.[0];
    //   params.search_max_invest_money = search_all_invest_moneys?.[1];
    // }
    if (start_declare_at?.length) {
      params.search_start_declare_at_min_at = start_declare_at?.[0];
      params.search_start_declare_at_max_at = start_declare_at?.[1];
    }
    // console.log('params',params);
    Apis.fetchProjectReserveExport(params)
      .then((res: any) => {
        const content = res;
        const blob = new Blob([content]);
        const fileName = '项目储备' + Date.now() + '.xls';
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a');
          elink.download = fileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href);
          document.body.removeChild(elink);
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  // 删除项目储备
  const deleteItem = (record: any) => {
    const { id } = record;
    Modal.confirm({
      content: '删除后不可恢复，确认删除？',
      onOk: async () => {
        const result: any = await Apis.deleteProjectReserve({ id });
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

  const loadData = async (rawParams: any) => {
    const {
      current: page,
      pageSize: pagesize,
      start_declare_at,
      search_address,
      search_declare_period,
      search_build_period,
      invest_money: search_all_invest_moneys,
      ...rest
    } = rawParams;
    const params = {
      ...rest,
      page,
      pagesize,
      current: undefined,
      search_all_invest_moneys,
      search_status: searchStatus.current,
    };

    if (search_address?.length) {
      params.search_city_id = search_address[0] || null;
      params.search_town_id = search_address[1] || null;
      params.search_village_id = search_address[2] || null;
    }
    if (search_declare_period?.length) {
      params.search_declare_ats = [
        `${search_declare_period[0]} 00:00:01`,
        `${search_declare_period[1]} 23:59:59`,
      ];
    }
    if (search_build_period?.length) {
      params.search_build_start_ats = [
        `${search_build_period[0]} 00:00:01`,
        `${search_build_period[1]} 23:59:59`,
      ];
    }

    // if (search_all_invest_moneys?.length) {
    //   params.search_min_invest_money = search_all_invest_moneys?.[0];
    //   params.search_max_invest_money = search_all_invest_moneys?.[1];
    // }
    if (start_declare_at?.length) {
      params.search_start_declare_at_min_at = start_declare_at?.[0];
      params.search_start_declare_at_max_at = start_declare_at?.[1];
    }
    // return console.log('params', params);
    const result: any = await getPCProjectReserveList(params);
    if (result.code !== 0) {
      message.error(result.msg);
    }

    tableRef?.current?.clearSelected?.();
    setListData(result.data?.data);
    return {
      data: result?.data?.data,
      total: result?.data?.total,
    };
  };

  const onRadioChange = (value: any) => {
    searchStatus.current = value;
    tableRef?.current?.reload();
  };

  // 选择子表格某项
  const onSelectionChange = (
    record: any,
    selected: boolean,
    selectedRows: any,
    nativeEvent: any,
  ) => {
    let newSelectedRowKeys = JSON.parse(JSON.stringify(selectedRowKeys)) || [];
    if (selected) {
      newSelectedRowKeys.push(record.id);
    } else {
      const index = newSelectedRowKeys.findIndex((v: any) => v == record.id);
      if (index > -1) {
        // 删除此项
        newSelectedRowKeys.splice(index, 1);
      }
    }
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // 选择子表格全选
  const onSelectAllChange = (
    selected: boolean,
    selectedRows: any,
    changeRows: any,
  ) => {
    let newSelectedRowKeys = JSON.parse(JSON.stringify(selectedRowKeys)) || [];
    // 当前选中子表格下所有id
    const currentAllIds = changeRows.map((v: any) => v.id);
    if (selected) {
      // 合并数组
      let unionArray = _.union(newSelectedRowKeys, currentAllIds);
      // 去重
      newSelectedRowKeys = _.uniq(unionArray);
    } else {
      newSelectedRowKeys = _.pullAll(newSelectedRowKeys, currentAllIds);
    }
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const expandedRowRender = (record: any) => {
    const { project_list = [] } = record;
    return (
      <div className="innerTable">
        <ProTable
          columns={expandedColumns}
          scroll={{ x: 1000 }}
          search={false}
          options={false}
          headerTitle={false}
          tableAlertRender={false}
          dataSource={project_list}
          pagination={false}
          rowKey="id"
          rowSelection={{
            // selections: false,
            selectedRowKeys,
            onSelect: onSelectionChange,
            onSelectAll: onSelectAllChange,
          }}
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

  return (
    <div style={{ minHeight: '100%' }}>
      <ProTable
        tableStyle={{ margin: '0 20' }}
        columns={columns}
        search={{
          defaultCollapsed: false,
        }}
        actionRef={tableRef}
        formRef={formRef}
        request={loadData}
        headerTitle={
          <TableRadio
            radioArray={[
              { label: '全部', value: -1 },
              { label: '待审核', value: 1 },
              { label: '已通过', value: 2 },
              { label: '已驳回', value: 9 },
            ]}
            spotIndex="1"
            spotCount={unreadCount}
            defaultValue={-1}
            onRadioChange={onRadioChange}
          />
        }
        toolBarRender={() => [
          <Button
            type="primary"
            className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
            onClick={() => exportAction()}
          >
            导出
          </Button>,
        ]}
        scroll={{ x: true }}
        options={false}
        revalidateOnFocus={false}
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
        onReset={() => {
          setExpandedRowKeys([]);
          setSelectedRowKeys([]);
        }}
      />
    </div>
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(projectReserveList);
