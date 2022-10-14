/**
 * 菜单-申报管理
 */
import styles from './index.less';
import { connect, history, useActivate, useUnactivate } from 'umi';
import React, { useRef, useState, useEffect } from 'react';
import { Button, message, Space, Tabs, Modal, Form, Select, Input } from 'antd';
import AuthWrapper from '@/components/auth/authWrapper';
const { confirm } = Modal;
import Apis from '@/utils/apis';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { ProFormDigitRange } from '@ant-design/pro-form';
import TableRadio from '@/components/table/TableRadio';
import _ from 'lodash';
const ProjectDeclarePage = (props: any) => {
  const { dispatch } = props;
  const tableRef1 = useRef<ActionType>();
  const tableRef2 = useRef<ActionType>();
  const [formRef] = Form.useForm();
  const [showEditModal, setShowEditModal] = useState(false);
  const [newDisable, setNewDisable] = useState(false);
  const [timer1, setTimer1] = useState(false);
  const searchStatus = useRef('-1');
  const [unreadCount, setUnreadCount] = useState(0);
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
  const [expandSwitchChecked, setExpandSwitchChecked] = useState<any>(false);
  const [listData, setListData] = useState([]);
  const [globalSearch, setGlobalSearch] = useState({});
  const [modalTitle, setModalTitle] = useState('新建');
  const [currentTarget, setCurrentTarget] = useState({});
  const fetchCount = () => {
    /*     getWaitNum({
      marks: ['xmsb'],
    })
      .then((res: any) => {
        if (res && res.code == 0) {
          setUnreadCount(res.data.xmsb);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err: any) => {
        console.log('err', err);
      }); */
  };
  useActivate(() => {
    initAction();
    fetchCount();
    tableRef1.current?.reload();
  });
  useUnactivate(() => {
    console.log('useUnactivate');
  });
  useEffect(() => {
    initAction();
    fetchCount();
  }, []);
  const initAction = () => {
    commitGlobalBread([
      {
        title: '投资项目管理',
      },
      {
        title: '项目赋码',
      },
    ]);
  };
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };
  const columns: any = [
    {
      title: '项目类型',
      dataIndex: 'project_type',
      key: 'project_type',
      align: 'center',
      valueType: 'select',
      fieldProps: { allowClear: true, mode: 'multiple' },
      valueEnum: {
        A00003: '备案类',
        A00002: '核准类',
        A00001: '审批类',
      },
      fixed: 'left',
      render: (value: any, record: any) => {
        return value || '-';
      },
    },
    {
      title: '总投资额(万元)',
      dataIndex: 'out_all_total_money',
      align: 'center',
      hideInSearch: true,
      render: (value: any) => {
        return value || '-';
      },
    },
    {
      title: '项目数量',
      dataIndex: 'out_project_count',
      align: 'center',
      hideInSearch: true,
      render: (value: any) => {
        return value || '-';
      },
    },
    {
      title: '项目名称',
      dataIndex: 'project_name',
      key: 'search_project_name',
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
      title: '投资金额(万元)',
      hideInTable: true,
      formItemProps: {
        labelCol: { span: 8 },
      },
      renderFormItem: () => {
        return (
          <div className={styles.rangeInput}>
            <ProFormDigitRange
              label=""
              name="search_total_moneys"
              separator="-"
              fieldProps={{ precision: 2, placeholder: '请输入金额' }}
              separatorWidth={30}
            />
          </div>
        );
      },
    },
    {
      title: '赋码时间',
      key: 'search_apply_dates',
      dataIndex: 'search_apply_dates',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '建设性质',
      dataIndex: 'search_project_natures',
      key: 'search_project_natures',
      align: 'center',
      valueType: 'select',
      fieldProps: { allowClear: true, mode: 'multiple' },
      hideInTable: true,
      valueEnum: {
        0: '新建',
        1: '扩建',
        2: '迁建',
        3: '改建',
        4: '其它',
      },
    },
    {
      title: '状态',
      dataIndex: 'search_status',
      key: 'search_status',
      align: 'center',
      valueType: 'select',
      fieldProps: { allowClear: true, mode: 'multiple' },
      hideInTable: true,
      valueEnum: {
        1: '待审核',
        2: '可行',
        9: '不可行',
      },
    },
  ];
  const popDelete = (item) => {
    confirm({
      title: '提示',
      icon: '',
      centered: true,
      content: '确定删除此赋码项目吗？',
      onOk() {
        console.log('OK');
        let data = {
          id: item.id,
        };
        Apis.projectFmRemove(data)
          .then((res) => {
            if (res && res.code == 0) {
              message.success('删除成功');
              tableRef1?.current?.reload();
            } else {
              message.error(res.msg);
            }
          })
          .catch((err) => {
            console.log('err', err);
          });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const popEdit = (value: any) => {
    formRef.setFieldsValue({
      project_code: '',
    });
    setModalTitle('赋码');
    setCurrentTarget(value);
    setShowEditModal(true);
  };
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
      title: '项目代码',
      dataIndex: 'project_code',
      align: 'center',
      width: 120,
      fixed: 'left',
    },
    {
      title: '项目名称',
      dataIndex: 'project_name',
      key: 'search_project_name',
      align: 'center',
      width: 140,
      render: (value: any, record: any) => {
        // console.log('asdga', record);
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
      title: '赋码时间',
      dataIndex: 'apply_date',
      align: 'center',
      width: 120,
      render: (__: any, record: any) => <div>{record.apply_date || '-'}</div>,
    },
    {
      title: '建设地址',
      dataIndex: 'place_code_detail',
      align: 'center',
      width: 120,
    },
    {
      title: '建设性质',
      dataIndex: 'project_nature_txt',
      align: 'center',
      width: 120,
    },
    {
      title: '投资金额(万元)',
      dataIndex: 'total_money',
      align: 'center',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 120,
      valueEnum: {
        1: '待审核',
        2: '可行',
        9: '不可行',
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 150,
      fixed: 'right',
      render: (text: any, record: any) => (
        <Space size="middle">
          {record.project_code ||
          (!record.project_code && record.status != 1) ? null : (
            <div className={`${styles.darker}`} onClick={() => popEdit(record)}>
              赋码
            </div>
          )}
          <div
            className={`${styles.darker}`}
            onClick={() => toEdit(record, false)}
          >
            查看
          </div>
          {record.status != 9 ? (
            <div className={`${styles.red}`} onClick={() => popDelete(record)}>
              删除
            </div>
          ) : null}
          <div
            className={`${styles.darker}`}
            onClick={() => toEdit(record, true)}
          >
            审核
          </div>
        </Space>
      ),
    },
  ];
  const jump2Reserve = (id: any) => {
    history.push({
      pathname: '/application/projectReserveDetail',
      query: { id },
    });
  };

  const toEdit = (item: any, able: any) => {
    history.push({
      pathname: '/invest/code/Detail',
      query: {
        id: item.id,
        able: able ? '1' : '0',
      },
    });
  };
  const load2Data = async (rawParams: any) => {
    const { current: page, pageSize: pagesize, ...rest } = rawParams;
    console.log('projectFmList');

    // projectFmList
    // const params = {
    //   ...rest,
    //   page,
    //   pagesize,
    //   current: undefined,
    //   search_tab_status: searchStatus.current ? searchStatus.current : -1,
    //   // search_tab_is_order: '0',
    // };
    // if (rawParams.project_type) {
    //   params.search_project_types = rawParams.project_type;
    // }
    // console.log('hasg', rawParams);
    // const result = await Apis.projectFmFirstList(params);
    // tableRef1?.current?.clearSelected?.();
    // setListData(result.data?.data);
    // return {
    //   data: result?.data?.data,
    //   total: result?.data?.total,
    // };
  };
  const loadData = async (rawParams: any) => {
    const { current: page, pageSize: pagesize, ...rest } = rawParams;
    const params = {
      ...rest,
      page,
      pagesize,
      current: undefined,
      search_tab_status: searchStatus.current ? searchStatus.current : -1,
      // search_tab_is_order: '0',
    };
    if (rawParams.project_type) {
      params.search_project_types = rawParams.project_type;
    }
    // console.log('hasg', rawParams);
    setGlobalSearch(params);
    const result = await Apis.projectFmFirstList(params);
    tableRef1?.current?.clearSelected?.();
    setListData(result.data?.data);
    return {
      data: result?.data?.data,
      total: result?.data?.total,
    };
  };
  const onRadioChange = (value: any) => {
    searchStatus.current = value;
    tableRef1?.current?.reload();
  };
  const popNew = () => {
    formRef.setFieldsValue({
      project_code: '',
    });
    setModalTitle('新建');
    setShowEditModal(true);
  };
  const handleEditOk = () => {
    formRef.validateFields().then((values: any) => {
      let data = {
        project_code: values.project_code,
      };
      Apis.projectFmInfoByXmdm(data)
        .then((subres) => {
          console.log('subres', subres);
          if (subres && subres.code == 0) {
            setNewDisable(true);
            if (subres.data.info && subres.data.info.project_name) {
              confirm({
                title: '提示',
                icon: '',
                centered: true,
                content: `确定要添加项目名称为“${subres.data.info.project_name}”的项目吗？`,
                onOk() {
                  if (modalTitle == '新建') {
                    Apis.projectFmAdd(data)
                      .then((res) => {
                        if (res && res.code == 0) {
                          message.success('添加成功');
                          setShowEditModal(false);
                          tableRef1?.current?.reload();
                        } else {
                          message.error(res.msg);
                        }
                      })
                      .catch((err) => {
                        console.log('err', err);
                      });
                  } else {
                    data.id = currentTarget.id;
                    Apis.projectReserveExecFm(data)
                      .then((res) => {
                        if (res && res.code == 0) {
                          message.success('添加成功');
                          setShowEditModal(false);
                          tableRef1?.current?.reload();
                        } else {
                          message.error(res.msg);
                        }
                      })
                      .catch((err) => {
                        console.log('err', err);
                      });
                  }
                },
                onCancel() {
                  console.log('Cancel');
                },
              });
            } else {
              message.warning({
                content: `无该项目代码，获取失败`,
                duration: 3,
              });
            }
          } else {
            message.error(subres.msg);
          }
        })
        .catch((suberr) => {
          console.log('suberr', suberr);
        })
        .finally(() => {
          let time = setTimeout(() => {
            setNewDisable(false);
            clearTimeout(time);
            setTimer1(null);
          }, 3000);
          setTimer1(time);
        });
    });
  };
  const handleEditCancel = () => {
    setShowEditModal(false);
    formRef.resetFields();
  };
  const expandedRowRender = (record: any) => {
    const { project_list = [] } = record;
    // console.log('asgd', record);
    // let project_list = [];
    // console.log('globalSearch', globalSearch);
    let data = {
      ...globalSearch,
      project_type: record.project_type,
    };
    // const result = await Apis.projectFmList(data);
    // console.log('result', result);
    // Apis.projectFmList(data)
    //   .then((res) => {
    //     console.log('res', res);
    //     if (res && res.code == 0) {
    //       // project_list = res.data.data;
    //       console.log(res.data.data  )
    //       console.log('project_list', project_list);
    //       /*           return (
    //         <div className="innerTable">
    //           <ProTable
    //             headerTitle={false}
    //             actionRef={tableRef2}
    //             search={false}
    //             options={false}
    //             columns={expandedColumns}
    //             scroll={{ x: 1000 }}
    //             dataSource={project_list}
    //             pagination={{ pageSize: 10 }}
    //             rowKey="id"
    //           />
    //         </div>
    //       ); */
    //     }
    //   })
    //   .catch((err) => {
    //     console.log('err', err);
    //   });
    return (
      <div className="innerTable">
        {/* request={load2Data} */}
        <ProTable
          headerTitle={false}
          actionRef={tableRef2}
          search={false}
          options={false}
          columns={expandedColumns}
          scroll={{ x: 1000 }}
          dataSource={project_list}
          pagination={{ pageSize: 10 }}
          rowKey="id"
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
        scroll={{ x: true }}
        actionRef={tableRef1}
        request={loadData}
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
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              popNew();
            }}
          >
            新建
          </Button>,
        ]}
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
      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showEditModal}
        title={modalTitle}
        width={500}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        footer={[
          <Button key="12" onClick={handleEditCancel}>
            取消
          </Button>,
          <Button
            key="su2bmit"
            type="primary"
            onClick={handleEditOk}
            disabled={newDisable}
          >
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
            label="请输入项目代码"
            name="project_code"
            rules={[{ required: true, message: '请输入项目代码' }]}
          >
            <Input placeholder="请输入项目代码" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect()(ProjectDeclarePage);
