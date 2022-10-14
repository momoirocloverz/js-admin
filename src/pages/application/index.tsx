/**
 * 菜单-申报管理
 */
import styles from './index.less';
import { connect, history, useActivate, useUnactivate } from 'umi';
import React, { useRef, useState, useEffect } from 'react';
import { Button, message, Space, Tabs, Modal, Form, Select } from 'antd';
import AuthWrapper from '@/components/auth/authWrapper';
import {
  getdeclareProjects,
  getPCProjectDeclareList,
  getWaitNum,
  exportUnitProjectList,
} from '@/api/projects';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import TableRadio from '@/components/table/TableRadio';
import useProjectDocuments from '@/components/project/use-project-documents';
import { APPROVAL_STATUS } from '@/pages/application/const';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import _ from 'lodash';
import {
  generateNodeText,
  generateApprovalStatusText,
  generateApprovalType,
} from '@/utils/project_helpers';
import { getImage } from '@/utils/common';
const { TabPane } = Tabs;
const { Option } = Select;
const ProjectDeclarePage = (props: any) => {
  const { dispatch } = props;
  const tableRef1 = useRef<ActionType>();
  const tableRef2 = useRef<ActionType>();
  const [formRef] = Form.useForm();
  const [tabActive, setTabActive] = useState('0');
  const [downloading, setDownloading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const searchStatus = useRef('-1');
  const [yearList, setYearList] = useState([]);
  const { data: documents } = useProjectDocuments(14);
  const [unreadCount, setUnreadCount] = useState(0);
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
  const [expandSwitchChecked, setExpandSwitchChecked] = useState<any>(false);
  const [listData, setListData] = useState([]);

  const fetchCount = () => {
    getWaitNum({
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
      });
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
    setArray();
  }, []);

  const initAction = () => {
    commitGlobalBread([
      {
        title: '投资项目管理',
      },
      {
        title: '申报管理',
      },
    ]);
  };
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };

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

  const toDownload = (value: any) => {
    if (!value?.length) return;
    if (downloading) return;
    try {
      const zip = new JSZip();
      let promises: any = [];
      value.forEach((file: any) => {
        const promise = getImage(file.url).then((res: any) => {
          const fileName = file.name;
          zip.file(fileName, res, { binary: true });
        });
        promises.push(promise);
      });
      Promise.all(promises)
        .then(() => {
          zip
            .generateAsync({
              type: 'blob',
              compression: 'DEFLATE', // STORE：默认不压缩 DEFLATE：需要压缩
              compressionOptions: {
                level: 1, // 压缩等级1~9    1压缩速度最快，9最优压缩方式
              },
            })
            .then((res: any) => {
              FileSaver.saveAs(res, '附件.zip'); // 利用file-saver保存文件
              setDownloading(false);
            });
        })
        .catch(() => {
          setDownloading(false);
        });
    } catch (error) {
      console.log(error);

      setDownloading(false);
    }
    return () => {};
  };

  const toPreview = (url: any) => {
    window.open(url, '_blank');
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
      title: '申报主体',
      dataIndex: 'declare_unit',
      key: 'search_declare_main_name',
      align: 'center',
      hideInTable: true,
      formItemProps: { label: '主体名称' },
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      key: 'search_select_status',
      align: 'center',
      valueType: 'select',
      fieldProps: { allowClear: true },
      valueEnum: APPROVAL_STATUS,
      hideInTable: true,
      renderText: (value: any) => generateApprovalStatusText(value, 1),
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
      align: 'center',
      width: 140,
      fixed: 'left',
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
      title: '申报主体',
      dataIndex: 'declare_unit',
      align: 'center',
      width: 120,
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      align: 'center',
      width: 120,
      renderText: (value: any) => generateApprovalStatusText(value, 1),
    },
    {
      title: '更新时间',
      dataIndex: 'created_at',
      align: 'center',
      width: 120,
      render: (__: any, record: any) => (
        <div>
          {(record.project_declaration_record_list &&
            record.project_declaration_record_list.length &&
            record.project_declaration_record_list[0].created_at) ||
            '-'}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (text: any, record: any) => (
        <Space size="middle">
          {/* <AuthWrapper mark={'application-/application/projectDeclare-view'}> */}

          <Button
            type="primary"
            ghost
            className={styles.darker}
            onClick={() => toEdit(record)}
          >
            查看
          </Button>

          {/* </AuthWrapper> */}
        </Space>
      ),
    },
  ];

  const fileColumns: any = [
    {
      title: '项目名称',
      dataIndex: 'project_name',
      key: 'search_h5_keyword',
      align: 'center',
      formItemProps: {
        label: '内容搜索',
      },
      fieldProps: {
        placeholder: '请输入项目名称/政策名称',
      },
    },
    {
      title: '政策名称',
      dataIndex: 'get_policy',
      align: 'center',
      hideInSearch: true,
      render: (value: any) => value?.title ?? '-',
    },
    {
      title: '下达金额（万）',
      dataIndex: 'order_amount',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '下达时间',
      dataIndex: 'file_issued_at',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '附件',
      dataIndex: 'file_issued_attachment',
      align: 'center',
      hideInSearch: true,
      render: (value: any, record: any) =>
        value.length
          ? value.map((v: any) => (
              <div key={v.uid}>
                <a
                  className={styles.attachmentName}
                  onClick={() => toPreview(v.url)}
                >
                  {v.name}
                </a>
              </div>
            ))
          : '-',
    },
    {
      title: '操作',
      dataIndex: 'file_issued_attachment',
      align: 'center',
      hideInSearch: true,
      render: (value: any, record: any) => (
        <Space size="middle">
          <Button
            type="primary"
            ghost
            className={styles.darker}
            onClick={async () => {
              await setDownloading(true);
              toDownload(value);
            }}
          >
            下载
          </Button>
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

  const toEdit = (item: any) => {
    history.push({
      pathname: '/application/projectDeclareDetail',
      query: {
        id: item.project_id,
      },
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
      // search_tab_is_order: '0',
    };
    const result = await getPCProjectDeclareList(params);
    tableRef1?.current?.clearSelected?.();
    setListData(result.data?.data);
    return {
      data: result?.data?.data,
      total: result?.data?.total,
    };
  };

  const loadFileData = async (rawParams: any) => {
    const { current: page, pageSize: pagesize, ...rest } = rawParams;
    const params = {
      ...rest,
      page,
      pagesize,
      current: undefined,
      search_status: searchStatus.current,
      // search_tab_is_order: '1',
    };

    const result = await getdeclareProjects(params);
    tableRef2?.current?.clearSelected?.();
    return {
      data: result?.data?.data,
      total: result?.data?.total,
    };
  };

  const onRadioChange = (value: any) => {
    searchStatus.current = value;
    tableRef1?.current?.reload();
  };

  const onTabChange = (key: string) => {
    setTabActive(key);
    tableRef1.current?.reload();
  };
  const popExport = () => {
    setShowEditModal(true);
    formRef.setFieldsValue({
      year: new Date().getFullYear(),
    });
  };
  const handleEditOk = () => {
    formRef.validateFields().then((values: any) => {
      console.log('values', values.year);
      exportUnitProjectList({ year: values.year })
        .then((res) => {
          if (res) {
            if (res.type == 'application/vnd.ms-excel') {
              const content = res;
              const blob = new Blob([content]);
              const fileName = '联审汇总表' + Date.now() + '.xls';
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

  return (
    <div style={{ minHeight: '100%' }}>
      {/* <Tabs
        defaultActiveKey={tabActive}
        onChange={onTabChange}
        className={styles.tabCon}
      >
        <TabPane tab="申报管理" key="0"></TabPane>
        <TabPane tab="文件下达专区" key="1"></TabPane>
      </Tabs> */}

      {tabActive == '0' ? (
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
                popExport();
              }}
            >
              导出联审汇总表
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
      ) : null}

      {tabActive == '1' ? (
        <ProTable
          tableStyle={{ paddingTop: 20 }}
          search={{
            defaultCollapsed: false,
          }}
          columns={fileColumns}
          actionRef={tableRef2}
          request={loadFileData}
          options={false}
          revalidateOnFocus={false}
          pagination={{ pageSize: 10 }}
          rowKey="project_id"
        />
      ) : null}
      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showEditModal}
        title={'选择联审年度'}
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
            label="联审年度"
            name="year"
            rules={[{ required: true, message: '请选择联审年度' }]}
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

export default connect()(ProjectDeclarePage);
