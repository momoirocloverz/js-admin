import React, { useRef, useState, useEffect } from 'react';
import { Button, message, Modal, Form, Select } from 'antd';
import {
  getPCProjectAcceptList,
  getWaitNum,
  exportProjectYsCollectList,
} from '@/api/projects';
import { EVALUATION_STATUS } from '@/pages/application/const';
import styles from './index.less';
import AuthWrapper from '@/components/auth/authWrapper';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import useProjectDocuments from '@/components/project/use-project-documents';
import { APPROVAL_STATUS } from '@/pages/application/const';
import {
  generateNodeText,
  generateApprovalStatusText,
  generateApprovalType,
} from '@/utils/project_helpers';
import TableRadio from '@/components/table/TableRadio';
const { Option } = Select;
import { connect, history, useActivate, useUnactivate } from 'umi';
const acceptanceManagement = (props: any) => {
  const { dispatch } = props;
  const tableRef = useRef<ActionType>();
  const searchStatus = useRef('-1');
  const { data: documents } = useProjectDocuments(14);
  const [unreadCount, setUnreadCount] = useState(0);
  const [formRef] = Form.useForm();
  const [showEditModal, setShowEditModal] = useState(false);
  const [yearList, setYearList] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
  const [expandSwitchChecked, setExpandSwitchChecked] = useState<any>(false);
  const [listData, setListData] = useState([]);

  const initAction = () => {
    commitGlobalBread([
      {
        title: '投资项目管理',
      },
      {
        title: '验收管理',
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
      marks: ['xmys'],
    })
      .then((res: any) => {
        if (res && res.code == 0) {
          setUnreadCount(res.data.xmys);
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
    tableRef.current?.reload();
  });
  useUnactivate(() => {});
  useEffect(() => {
    fetchCount();
    initAction();
    setArray();
  }, []);
  const setArray = () => {
    const fullYear = new Date().getFullYear();
    const arrYear = [];
    for (let i = 0; i < 30; i++) {
      arrYear.push({
        name: `${fullYear - i}年`,
        value: fullYear - i,
        label: `${fullYear - i}年`,
      });
    }
    setYearList(arrYear);
  };
  const columns: any = [
    {
      title: '项目类型',
      dataIndex: 'title',
      key: 'search_policy_document_id',
      align: 'center',
      valueType: 'select',
      valueEnum: documents?.reduce(
        (pre: any, { title, id }: any) => ({ ...pre, [id]: title }),
        {},
      ),
      fixed: 'left',
      render: (value: any, record: any) => {
        return value || '-';
      },
    },
    {
      title: '项目数量',
      dataIndex: 'project_list',
      align: 'center',
      hideInSearch: true,
      width: 120,
      render: (value: any) => {
        return value?.length ?? '-';
      },
    },
    // 下面是渲染搜索表单的配置，不在外层表格中展示
    {
      title: '项目名称',
      key: 'search_project_name',
      align: 'center',
      hideInTable: true,
    },
    {
      title: '主体名称',
      key: 'search_declare_main_name',
      align: 'center',
      hideInTable: true,
    },
    {
      title: '审核状态',
      key: 'search_select_status',
      align: 'center',
      valueType: 'select',
      fieldProps: { allowClear: true },
      valueEnum: APPROVAL_STATUS,
      hideInTable: true,
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
      title: '项目名称',
      dataIndex: 'project_name',
      key: 'search_project_name',
      width: 120,
      align: 'center',
      render: (value: any, record: any, index: any) => {
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
          let obj = {
            children: value,
            props: {
              rowSpan: 3,
            },
          };
          return value;
        }
      },
    },
    {
      title: '申报主体',
      dataIndex: 'declare_unit',
      align: 'center',
      width: 120,
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      align: 'center',
      valueType: 'select',
      width: 120,
      renderText: (value: any) => {
        return generateApprovalStatusText(value, 3);
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      align: 'center',
      width: 120,
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      width: 120,
      render: (__: any, record: any) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {/* <AuthWrapper mark={'application-/application/acceptanceMana-view'}> */}
          <Button
            disabled={record.is_check === 2}
            type="primary"
            ghost
            onClick={() => {
              history.push({
                pathname: '/project/details',
                query: {
                  id: record.project_id,
                  stage: '4',
                  breadCrumbs: JSON.stringify([
                    {
                      title: '投资项目管理',
                      triggerOn: true,
                    },
                    {
                      title: '验收管理',
                    },
                  ]),
                },
              });
            }}
          >
            查看
          </Button>
          {/* </AuthWrapper> */}
        </div>
      ),
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

    const result = await getPCProjectAcceptList(params);
    tableRef?.current?.clearSelected?.();
    setListData(result.data.data);
    return {
      data: result?.data?.data,
      total: result?.data?.total,
    };
  };

  const onRadioChange = (value: any) => {
    searchStatus.current = value;
    tableRef?.current?.reload();
  };
  const popExport = () => {
    setShowEditModal(true);
    formRef.setFieldsValue({
      year: new Date().getFullYear(),
    });
  };
  const handleEditOk = () => {
    formRef.validateFields().then((values: any) => {
      exportProjectYsCollectList({ year: values.year })
        .then((res) => {
          if (res) {
            if (res.type == 'application/vnd.ms-excel') {
              const content = res;
              const blob = new Blob([content]);
              const fileName = '已验收项目汇总表' + Date.now() + '.xls';
              if ('download' in document.createElement('a')) {
                const elink = document.createElement('a');
                elink.download = fileName;
                elink.style.display = 'none';
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                document.body.removeChild(elink);
              } else {
                navigator.msSaveBlob(blob, fileName);
              }
            }
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    });
  };
  const handleEditCancel = () => {
    setShowEditModal(false);
    formRef.resetFields();
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
        tableStyle={{ margin: '0 20' }}
        columns={columns}
        search={{
          defaultCollapsed: false,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              popExport();
            }}
          >
            导出已验收项目汇总表
          </Button>,
        ]}
        actionRef={tableRef}
        request={loadData}
        options={false}
        revalidateOnFocus={false}
        pagination={{ pageSize: 10 }}
        rowKey="id"
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
      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showEditModal}
        title={'选择验收年度'}
        width={500}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        footer={[
          <Button key="12" onClick={handleEditCancel}>
            取消
          </Button>,
          <Button key="su2bmit" type="primary" onClick={handleEditOk}>
            确定
          </Button>,
        ]}
      >
        <Form
          className={styles.formModal}
          form={formRef}
          name="nest-messages"
          labelAlign={'left'}
          labelCol={{ span: 7 }}
        >
          <Form.Item
            label="验收年度"
            name="year"
            rules={[{ required: true, message: '请选择验收年度' }]}
          >
            <Select>
              {yearList.map((ele) => (
                <Option value={ele.value} key={ele.name}>
                  {ele.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default connect(({ baseModel }) => ({ baseModel }))(
  acceptanceManagement,
);
