import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Button, Tabs, message, Modal, Form, DatePicker, Tooltip } from 'antd';
import AuthWrapper from '@/components/auth/authWrapper';
import {
  getImplementProjects,
  getPCProjectImplementList,
  getWaitNum,
  exportProjectReportList,
} from '@/api/projects';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import styles from './index.less';
import TableRadio from '@/components/table/TableRadio';
import useProjectDocuments from '@/components/project/use-project-documents';
import {
  APPROVAL_STATUS,
  CHANGE_ARROVAL_STATUS,
} from '@/pages/application/const';
import {
  generateNodeText,
  generateApprovalStatusText,
  generateApprovalType,
} from '@/utils/project_helpers';
import moment from 'moment';
const { TabPane } = Tabs;
import { connect, history, useActivate, useUnactivate } from 'umi';
const { RangePicker } = DatePicker;
const ImplementList = (props: any) => {
  const { dispatch } = props;
  const tableRef = useRef<ActionType>();
  const table1Ref = useRef<ActionType>();
  const searchStatus = useRef('-1');
  const { data: documents } = useProjectDocuments(14);
  const [tabActive, setTabActive] = useState('0');
  const [fakedefault1, setFakedefault1] = useState('-1');
  const [fakedefault2, setFakedefault2] = useState('-1');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formRef] = Form.useForm();
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
  const [expandSwitchChecked, setExpandSwitchChecked] = useState<any>(false);
  const [listData, setListData] = useState([]);

  const documentMap = useMemo(() => {
    if (documents?.length) {
      return documents?.reduce(
        (pre: any, { title, id }: any) => ({ ...pre, [id]: title }),
        {},
      );
    }
  }, [documents]);
  const fetchCount = () => {
    getWaitNum({
      marks: ['xmss'],
    })
      .then((res: any) => {
        if (res && res.code == 0) {
          setUnreadCount(res.data.xmss);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err: any) => {
        console.log('err', err);
      });
  };
  const initAction = () => {
    commitGlobalBread([
      {
        title: '??????????????????',
      },
      {
        title: '????????????',
      },
    ]);
  };
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };
  useActivate(() => {
    initAction();
    fetchCount();
    tableRef.current?.reload();
  });
  useUnactivate(() => {});
  useEffect(() => {
    initAction();
    fetchCount();
  }, []);
  const moneyFormat = (value: any) => {
    if (value || value == 0) {
      let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
      return fix;
    }
  };
  const columns: any = [
    {
      title: '????????????',
      dataIndex: 'title',
      align: 'center',
      key: 'search_policy_document_id',
      valueType: 'select',
      valueEnum: documentMap,
      fixed: 'left',
      render: (value: any, record: any) => {
        return value || '';
      },
    },
    {
      title: '???????????????????????????',
      dataIndex: 'out_plan_all_order_amount',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '????????????',
      dataIndex: 'project_list',
      align: 'center',
      hideInSearch: true,
      // width: 84,
      render: (value: any) => {
        return value?.length ?? '-';
      },
    },
    // ??????????????????????????????????????????????????????????????????
    {
      title: '????????????',
      dataIndex: 'project_name',
      key: 'search_project_name',
      width: 200,
      align: 'center',
      hideInTable: true,
      render: (value: any, record: any) => {
        if (record.project_reserve_id) {
          return (
            <>
              <div className={styles.tdWrapper}>
                <div
                  className={styles.projectReserveBtn}
                  onClick={() => jump2Reserve(record.project_reserve_id)}
                >
                  ??????
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
      title: '????????????',
      align: 'center',
      dataIndex: 'search_build_area',
      hideInTable: true,
    },
    {
      title: '????????????',
      dataIndex: 'declare_unit',
      key: 'search_declare_main_name',
      align: 'center',
      hideInTable: true,
    },
    {
      title: '??????',
      dataIndex: 'search_project_report_submit_ats',
      key: 'search_project_report_submit_ats',
      align: 'center',
      hideInTable: true,
      renderFormItem: (_) => {
        return (
          <RangePicker
            key="123"
            allowEmpty={[true, true]}
            format="YYYY-MM-DD HH:mm:ss"
            showTime={{ format: 'HH:mm:ss' }}
            placeholder={['????????????', '????????????']}
          />
        );
      },
    },
  ];

  const expandedColumns: ProColumns[] = [
    {
      title: '??????',
      dataIndex: 'index',
      align: 'center',
      width: 60,
      fixed: 'left',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '????????????',
      dataIndex: 'project_name',
      align: 'center',
      width: 140,
      fixed: 'left',
      render: (value: any) => {
        return value || '-';
      },
    },
    {
      title: '????????????',
      align: 'center',
      width: 120,
      dataIndex: 'declare_unit',
    },
    {
      title: '????????????',
      dataIndex: 'full_area',
      align: 'center',
      width: 200,
    },
    {
      title: '????????????????????????',
      align: 'center',
      dataIndex: 'project_document_name',
      width: 200,
      render: (value: any, record: any) => {
        const content = record?.project_implement_plan_info?.build_main_content;
        if (content) {
          return (
            <Tooltip placement="top" title={content}>
              <div className="longContentTd">{content}</div>
            </Tooltip>
          );
        } else {
          return '-';
        }
      },
    },
    {
      title: '?????????(??????)',
      align: 'center',
      width: 100,
      dataIndex: 'project_document_name',
      hideInSearch: true,
      render: (value: any, record: any) => {
        if (record.project_implement_plan_info) {
          let array1 = record.project_implement_plan_info.part_options.find(
            (ele) => {
              return ele.option_name == '??????????????????';
            },
          );
          let array2 = record.project_implement_plan_info.part_options.find(
            (ele) => {
              return ele.option_name == '????????????';
            },
          );
          let array3 = record.project_implement_plan_info.part_options.find(
            (ele) => {
              return ele.option_name == '??????';
            },
          );
          let arrBridge1 = [];
          let arrBridge2 = [];
          let arrBridge3 = [];
          if (array1 && array1.list && array1.list.length) {
            arrBridge1 = array1.list;
          }
          if (array2 && array2.list && array2.list.length) {
            arrBridge2 = array2.list;
          }
          if (array3 && array3.list && array3.list.length) {
            arrBridge3 = array3.list;
          }
          let temp1 = arrBridge1.map((ele: any) => {
            if (!ele.invest_money) {
              return {
                ...ele,
                invest_money: ele.invest_money ? ele.invest_money : 0,
              };
            } else {
              return {
                ...ele,
              };
            }
          });
          let res1 = temp1.reduce((acc: any, current: any) => {
            return acc + current.invest_money;
          }, 0);

          let temp3 = arrBridge2.map((ele: any) => {
            if (!ele.invest_money) {
              return {
                ...ele,
                invest_money: ele.invest_money ? ele.invest_money : 0,
              };
            } else {
              return {
                ...ele,
              };
            }
          });
          let res3 = temp3.reduce((acc: any, current: any) => {
            return acc + current.invest_money;
          }, 0);
          let temp4 = arrBridge3.map((ele: any) => {
            if (!ele.invest_money) {
              return {
                ...ele,
                invest_money: ele.invest_money ? ele.invest_money : 0,
              };
            } else {
              return {
                ...ele,
              };
            }
          });
          let res4 = temp4.reduce((acc: any, current: any) => {
            return acc + current.invest_money;
          }, 0);

          if (res1 + res3 + res4) {
            return <>{moneyFormat(res1 + res3 + res4)}</>;
          } else {
            return '-';
          }
        }
      },
    },
    {
      title: '????????????(??????)',
      align: 'center',
      dataIndex: 'plan_all_order_amount',
      hideInSearch: true,
      width: 120,
      render: (value: any, record: any) => {
        return <div> {record.plan_all_order_amount ?? '-'} </div>;
      },
    },
    {
      title: '??????????????????(??????)',
      align: 'center',
      width: 100,
      render: (value: any, record: any) => {
        if (record?.get_report?.total_amount) {
          return <>{record.get_report.total_amount}</>;
        } else {
          return '-';
        }
      },
    },
    {
      title: '????????????',
      align: 'center',
      width: 120,
      render: (value: any, record: any) => {
        const content = record?.get_report?.progress_of_works;
        if (content) {
          return (
            <Tooltip placement="top" title={content}>
              <div className="longContentTd">{content}</div>
            </Tooltip>
          );
        } else {
          return '-';
        }
      },
    },
    {
      title: '????????????',
      align: 'center',
      width: 100,
      render: (value: any, record: any) => {
        return <>{record?.report_status == 1 ? '?????????' : '?????????'}</>;
      },
    },
    {
      title: '??????',
      key: 'actions',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (__, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {/* <AuthWrapper mark={'application-/application/ImplementMana-view'}> */}
          <Button
            disabled={record.is_check === 2}
            type="primary"
            ghost
            onClick={() => {
              history.push({
                pathname: '/project/details',
                query: {
                  id: record.project_id,
                  stage: '2',
                  breadCrumbs: JSON.stringify([
                    {
                      title: '??????????????????',
                      triggerOn: true,
                    },
                    {
                      title: '????????????',
                    },
                  ]),
                },
              });
            }}
          >
            ??????
          </Button>
          {/* </AuthWrapper> */}
        </div>
      ),
    },
  ];

  const col2umns: any = [
    {
      title: '????????????',
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
                  ??????
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
      title: '????????????',
      dataIndex: 'get_policy',
      align: 'center',
      key: 'search_policy_document_id',
      valueType: 'select',
      valueEnum: documentMap,
      render: (__: any, record: any) => {
        return record.get_policy?.title || '-';
      },
    },
    // {
    //   title: '????????????',
    //   dataIndex: 'project_document_name',
    //   key: 'search_policy_document_id',
    //   align: 'center',
    //   valueType: 'select',
    //   valueEnum: documents?.reduce(
    //     (pre: any, { title, id }: any) => ({ ...pre, [id]: title }),
    //     {},
    //   ),
    //   render: (__: any, record: any) => {
    //     return record.get_policy?.title || '-';
    //   },
    // },
    {
      title: '????????????',
      dataIndex: 'declare_unit',
      key: 'search_declare_main_name',
      align: 'center',
      formItemProps: { label: '????????????' },
    },
    // {
    //   title: '????????????',
    //   dataIndex: 'report_status',
    //   key: 'search_report_status',
    //   valueType: 'select',
    //   valueEnum: {
    //     1: '?????????????????????',
    //     0: '?????????????????????',
    //   },
    //   align: 'center',
    // },
    {
      title: '????????????',
      key: 'search_select_status',
      align: 'center',
      valueType: 'select',
      valueEnum: CHANGE_ARROVAL_STATUS,
      hideInTable: true,
    },
    {
      title: '????????????',
      dataIndex: 'report_stu',
      align: 'center',
      hideInSearch: true,
      renderText: (value: any, record: any) => {
        const { report_stu } = record.project_change_apply_info || {};
        let color = 'darkgray';
        if (report_stu?.includes('?????????')) {
          color = '#DB2828';
        }
        return <span style={{ color }}>{report_stu ?? '-'}</span>;
      },
    },
    // {
    //   title: '??????????????????',
    //   align: 'center',
    //   hideInSearch: true,
    //   render: (__: any, record: any) => {
    //     return record.get_report?.created_at ?? '-';
    //   },
    // },
    {
      title: '????????????',
      // dataIndex: 'updated_at',
      align: 'center',
      hideInSearch: true,
      render: (__: any, record: any) => {
        return (
          (record.project_change_apply_info &&
            record.project_change_apply_info.created_at) ||
          '-'
        );
      },
    },
    {
      title: '??????',
      key: 'actions',
      align: 'center',
      hideInSearch: true,
      width: 150,
      render: (__, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {/* <AuthWrapper mark={'application-/application/ImplementMana-view'}> */}
          <Button
            disabled={record.is_check === 2}
            type="primary"
            ghost
            onClick={() => {
              history.push({
                pathname: '/project/details',
                query: {
                  id: record.project_id,
                  stage: '3',
                  breadCrumbs: JSON.stringify([
                    {
                      title: '??????????????????',
                      triggerOn: true,
                    },
                    {
                      title: '????????????',
                    },
                  ]),
                },
              });
            }}
          >
            ??????
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

  const load1Data = async (rawParams: any) => {
    const {
      current: page,
      pageSize: pagesize,
      search_report_status,
      search_select_status,
      ...rest
    } = rawParams;
    const params = {
      ...rest,
      page,
      pagesize,
      // search_list_type: 2,
      // current: undefined,
      // search_status: searchStatus.current,
      // search_report_status: +search_report_status,
      search_list_type: -1,
      search_status: +searchStatus.current,
      search_select_status: search_select_status
        ? +search_select_status
        : undefined,
    };
    // console.log('params', params);
    const result = await getImplementProjects(params);
    tableRef?.current?.clearSelected?.();

    return {
      data: result?.data?.data,
      total: result?.data?.total,
    };
  };

  const loadData = async (rawParams: any) => {
    const {
      current: page,
      pageSize: pagesize,
      search_report_status,
      ...rest
    } = rawParams;
    const params = {
      ...rest,
      page,
      pagesize,
      search_list_type: -1,
      search_report_status: +searchStatus.current,
      // current: undefined,
      // search_status: searchStatus.current,
      // search_report_status: +search_report_status,
    };
    if (rawParams.search_project_report_submit_ats) {
      params.search_project_report_submit_ats = [
        rawParams.search_project_report_submit_ats[0]
          ? rawParams.search_project_report_submit_ats[0]
          : '2000-01-01 00:00:01',
        rawParams.search_project_report_submit_ats[1]
          ? rawParams.search_project_report_submit_ats[1]
          : '3000-01-01 00:00:01',
      ];
    }
    // console.log('params', params);

    const result = await getPCProjectImplementList(params);
    tableRef?.current?.clearSelected?.();
    result.data.data.forEach((ele: any, index: any) => {
      ele.index = index + 1;
    });
    setListData(result?.data?.data);
    return {
      data: result.data.data,
      total: result?.data?.total,
    };
  };
  const onRadioChange = (value: any) => {
    searchStatus.current = value;
    setFakedefault1(value);
    tableRef?.current?.reloadAndRest();
  };
  const onRadio1Change = (value: any) => {
    searchStatus.current = value;
    setFakedefault2(value);
    table1Ref?.current?.reloadAndRest();
  };
  const onTabChange = (key: string) => {
    setTabActive(key);
    searchStatus.current = '-1';
    if (key == '1') {
      table1Ref.current?.reload();
    } else {
      tableRef?.current?.reload();
    }
  };

  const popExport = () => {
    setShowEditModal(true);
    formRef.setFieldsValue({
      month: moment(Date.now()),
    });
  };
  const handleEditOk = () => {
    formRef.validateFields().then((values: any) => {
      exportProjectReportList({ month: moment(values.month).format('YYYY-MM') })
        .then((res) => {
          if (res) {
            if (res.type == 'application/vnd.ms-excel') {
              const content = res;
              const blob = new Blob([content]);
              const fileName = '?????????' + Date.now() + '.xls';
              if ('download' in document.createElement('a')) {
                const elink = document.createElement('a');
                elink.download = fileName;
                elink.style.display = 'none';
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href); // ??????URL ??????
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

  // ??????????????????
  const onExpandedRowsChange = (expandedRows: any) => {
    setExpandedRowKeys(expandedRows);
    if (expandedRows.length != listData.length) {
      setExpandSwitchChecked(false);
    } else {
      setExpandSwitchChecked(true);
    }
  };

  // ?????????????????????
  const onExpandSwitchChange = (expand: any) => {
    setExpandSwitchChecked(expand);
    setExpandedRowKeys(expand ? listData.map((v: any) => v.id) : []);
  };

  return (
    <div style={{ minHeight: '100%' }}>
      <Tabs
        defaultActiveKey={tabActive}
        onChange={onTabChange}
        className={styles.tabCon}
      >
        <TabPane tab="????????????" key="0"></TabPane>
        <TabPane tab="????????????" key="1"></TabPane>
      </Tabs>
      {tabActive == '0' ? (
        <ProTable
          key="1"
          tableStyle={{ marginTop: 20, marginBottom: 20 }}
          columns={columns}
          search={{
            defaultCollapsed: false,
          }}
          scroll={{ x: '100%' }}
          actionRef={tableRef}
          request={loadData}
          options={false}
          revalidateOnFocus={false}
          pagination={{
            pageSize: 10,
          }}
          rowKey="id"
          headerTitle={
            <TableRadio
              radioArray={[
                { label: '??????', value: '-1' },
                { label: '?????????', value: '1' },
                { label: '?????????', value: '0' },
              ]}
              defaultValue={fakedefault1}
              onRadioChange={onRadioChange}
            />
          }
          toolBarRender={() => [
            <Button
              type="primary"
              onClick={() => {
                popExport();
              }}
            >
              ???????????????
            </Button>,
          ]}
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
      ) : (
        <ProTable
          key="2"
          tableStyle={{ margin: '0 20' }}
          columns={col2umns}
          search={{
            defaultCollapsed: false,
          }}
          actionRef={table1Ref}
          request={load1Data}
          headerTitle={
            <TableRadio
              radioArray={[
                { label: '??????', value: '-1' },
                { label: '?????????', value: '1' },
              ]}
              spotIndex="1"
              spotCount={unreadCount}
              defaultValue={fakedefault2}
              onRadioChange={onRadio1Change}
            />
          }
          options={false}
          revalidateOnFocus={false}
          pagination={{ pageSize: 10 }}
          rowKey="project_id"
        />
      )}
      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showEditModal}
        title={'??????????????????'}
        width={500}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        footer={[
          <Button key="12" onClick={handleEditCancel}>
            ??????
          </Button>,
          <Button key="su2bmit" type="primary" onClick={handleEditOk}>
            ??????
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
            label="????????????"
            name="month"
            rules={[{ required: true, message: '?????????????????????' }]}
          >
            <DatePicker picker="month" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default connect(({ baseModel }) => ({ baseModel }))(ImplementList);
