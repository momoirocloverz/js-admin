/**
 * 资金来源组件
 */
import React, {
  useEffect,
  useState,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import Apis from '@/utils/apis';
import {
  Table,
  Modal,
  Button,
  Input,
  Space,
  Form,
  Row,
  Col,
  Switch,
  InputNumber,
  message,
} from 'antd';
import styles from './index.less';
import central_icon from '@/assets/central_icon.png';
import province_icon from '@/assets/province_icon.png';
import city_icon from '@/assets/city_icon.png';
import county_icon from '@/assets/county_icon.png';
const projectTypeIcon: any = {
  1: central_icon,
  2: province_icon,
  3: city_icon,
  4: county_icon,
};
function FundSource(props: any, ref: any) {
  const {
    fundSourceRef,
    getDocumentSubItem,
    projectType,
    originSubItem,
    policy_document_id,
  } = props;
  const [dataSource, setDataSource] = useState<any>(); // 所有分项
  const [docmentSubItem, setDocmentSubItem] = useState<any>([]); // 政策文件已选分项
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); // 弹窗中已选资金分项id
  const [subItemSelectIds, setSubItemSelectIds] = useState([]); // 弹窗确定后页面已选资金分项id
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
  const [expandSwitchChecked, setExpandSwitchChecked] = useState<any>(false);
  const [deleteAble, setDeleteAble] = useState(false);

  // 获取所有分项数据
  const getList = (page?: any) => {
    const values = form.getFieldsValue();
    const params = {
      page,
      pagesize,
      search_keyword: values.search_keyword || '',
      search_project_type: projectType || undefined,
    };
    setLoading(true);
    Apis.projectCapitalSourceList(params)
      .then((res: any) => {
        if (res.code == 0) {
          setDataSource(res.data.data);
          setTotal(res.data.total);
        } else {
          message.error(res.msg);
        }
      })
      .catch((e) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  // 查询
  const onFinish = (values: any) => {
    setPage(1);
    getList(1);
  };

  const reset = () => {
    form.setFieldsValue({ search_keyword: '' });
    setPage(1);
    getList(1);
  };

  // 已选资金分项金额改变触发
  const onAmountChange = async (e: any, record: any) => {
    const newData = [...docmentSubItem];
    const index = newData.findIndex((item) => record.id === item.id);
    const item = newData[index];
    item.actual_amount = e;
    newData.splice(index, 1, {
      ...item,
    });
    setDocmentSubItem(newData);
  };

  // 删除已选资金分项
  const deleteSubItem = (id: any) => {
    const deleteAction = (id) => {
      Modal.confirm({
        content: `确认删除该分项？`,
        onOk: async () => {
          try {
            const newData = [...docmentSubItem];
            const index = newData.findIndex((item) => id === item.id);
            newData.splice(index, 1);
            setDocmentSubItem(newData);
            setSelectedRowKeys(newData.map((v: any) => v.id));
          } catch (e) {}
        },
      });
    };
    if (policy_document_id) {
      let deleteData = {
        project_capital_source_id: id,
        id: policy_document_id,
      };
      Apis.checkCanModifyProjectCapitalSource(deleteData)
        .then((res: any) => {
          if (res.code == 0) {
            if (!res.data.length) {
              deleteAction(id);
            }
          } else {
            message.error(res.msg);
          }
        })
        .catch((e) => {});
    } else {
      deleteAction(id);
    }
  };

  // 已选资金来源表格配置
  const columns: any = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      width: 60,
      render: (text: any, record: any, index: number) => `${index + 1}`,
    },
    {
      title: '项目名称',
      dataIndex: 'fund_source_info',
      align: 'center',
      render: (_: any, record: any) => (
        <div>{record.project_name ? record.project_name : '-'}</div>
      ),
    },
    {
      title: '资金金额（万元）',
      dataIndex: 'actual_amount',
      align: 'center',
      render: (_: any, record: any) => (
        <div>{record.all_amount ? record.all_amount : '-'}</div>
      ),
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center',
      width: 60,
      render: (value: any) => (
        <Button type="text" danger onClick={() => deleteSubItem(value)}>
          删除
        </Button>
      ),
    },
  ];
  // 弹窗资金来源表格配置
  const modalColumns: any = [
    {
      title: '项目名称',
      dataIndex: 'subitem_info',
      align: 'center',
      render: (value: any, record: any) => {
        return <>{record.project_name || '-'}</>;
      },
    },
    {
      title: '资金总额（万元）',
      dataIndex: 'all_amount',
      align: 'center',
    },
    {
      title: '年度',
      dataIndex: 'year',
      align: 'center',
      // render: (value: any) => value.year,
    },
  ];

  // 确认选择资金来源
  const handleOk = () => {
    // console.log('选中的id', selectedRowKeys);
    // 过滤与已选项重复的id
    const oldData = [...docmentSubItem];
    oldData.forEach((oldItem: any) => {
      const idx = selectedRowKeys.findIndex((v: any) => v == oldItem.id);
      if (idx > -1) {
        // 与已选项重复 删除已选id
        selectedRowKeys.splice(idx, 1);
      }
    });
    // console.log('去重后的id', selectedRowKeys);
    // 过滤出选中的数据 在页面回显
    const selectedData: any[] = dataSource.filter((item: any) =>
      selectedRowKeys.includes(item.id as never),
    );
    console.log('选中的数据', selectedData);
    // selectedData.forEach(async (data: any) => {
    //   let remain_amount: any = await getRemainAmount(data.subitem_id);
    //   console.log('remain_amount', remain_amount);
    //   data.actual_remain_amount = 123||remain_amount;
    // });

    // 添加到政策文件已选分项数据中
    // setDocmentSubItem(docmentSubItem.concat(selectedData));
    setDocmentSubItem(selectedData);
    setShowModal(false);
  };

  // 表格选项改变触发
  const onSelectChange = (e: any) => {
    setSelectedRowKeys(e);
  };

  // 选择框的默认属性配置
  const getCheckboxProps = (record: any) => {
    const keys = docmentSubItem.map((v: any) => v.id);
    // console.log('getCheckboxProps', keys, record.id);
    // if (keys.includes(record.id)) {
    //   return { disabled: true };
    // } else {
    //   return null;
    // }
    if (deleteAble) {
      return { disabled: true };
    } else {
      return null;
    }
  };

  const rowSelection: any = {
    type: 'radio',
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: getCheckboxProps,
  };

  useImperativeHandle(ref, () => ({
    getDocumentSubItem: () => {
      return docmentSubItem?.length ? docmentSubItem : null;
    },
    clearDocumentSubItem: () => {
      setDocmentSubItem([]);
      setSelectedRowKeys([]);
      return;
    },
  }));

  const ckeckDeleteAble = () => {
    if (policy_document_id) {
      let id = docmentSubItem[0].id;
      let deleteData = {
        project_capital_source_id: id,
        id: policy_document_id,
      };
      Apis.checkCanModifyProjectCapitalSource(deleteData)
        .then((res: any) => {
          if (res.code == 0) {
            if (!res.data.length) {
              setDeleteAble(false);
            }
          } else {
            setDeleteAble(true);
          }
        })
        .catch((e) => {});
    } else {
    }
  };
  useEffect(() => {
    if (docmentSubItem && docmentSubItem.length) {
      ckeckDeleteAble();
    }
  }, [docmentSubItem]);
  useEffect(() => {
    if (projectType) {
      getList(1);
    }
  }, [projectType]);
  useMemo(() => {
    if (originSubItem?.length) {
      setSelectedRowKeys(originSubItem.map((v: any) => v.id));
      setDocmentSubItem(originSubItem);
    }
  }, [originSubItem]);

  // 获取关联分项的剩余金额
  const getRemainAmount = (rel_subitem_id: any) => {
    return new Promise((resolve, reject) => {
      Apis.getRelSubItemRemainInfo({
        rel_subitem_id,
        policy_document_id,
      }).then((res: any) => {
        if (res.code == 0) {
          resolve(res.data.remain_amount);
        } else {
          message.error(res.msg);
          resolve('');
        }
      });
    });
  };
  const onPageChange = (page: any, pagesize: any) => {
    setSelectedRowKeys(docmentSubItem.map((v: any) => v.id) || []);
    setPage(page);
    getList(page);
  };
  const onExpandSwitchChange = (expand: any) => {
    setExpandSwitchChecked(expand);
    setExpandedRowKeys(expand ? dataSource.map((v: any) => v.id) : []);
  };
  const onExpandedRowsChange = (expandedRows: any) => {
    setExpandedRowKeys(expandedRows);
    if (expandedRows.length != dataSource.length) {
      setExpandSwitchChecked(false);
    } else {
      setExpandSwitchChecked(true);
    }
  };
  const expandedRowRender = (record: any) => {
    const subColumns: any = [
      {
        title: '分项名称',
        dataIndex: 'fund_subitem_info',
        width: '150px',
        render: (_: any, record: any) => (
          <div>
            {record.fund_subitem_info && record.fund_subitem_info.subitem_name
              ? record.fund_subitem_info.subitem_name
              : '-'}
          </div>
        ),
      },
      { title: '分项金额（万元）', width: 150, dataIndex: 'amount' },
      {
        title: '资金年度',
        dataIndex: 'amount',
        width: 100,
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
        dataIndex: 'amount',
        width: 150,
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
        dataIndex: 'amount',
        render: (_: any, record: any) => (
          <div className={styles.rowFlex}>
            <div>
              {record.project_fund_source_info &&
              record.project_fund_source_info.fund_number
                ? record.project_fund_source_info.fund_number
                : '-'}
            </div>
            <img
              className={styles.marginLeft8}
              src={
                projectTypeIcon[record.project_fund_source_info.project_type]
              }
            />
          </div>
        ),
      },
    ];
    const data = record.project_capital_source_rel_subitem_list;
    return (
      <Table
        size="small"
        columns={subColumns}
        dataSource={data}
        pagination={false}
        rowKey="id"
      />
    );
  };
  return (
    <Space direction="vertical">
      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        onClick={() => setShowModal(true)}
      >
        添加项目资金
      </Button>
      <Table
        columns={columns}
        dataSource={docmentSubItem}
        pagination={{
          pageSize: 5,
        }}
        rowKey="id"
      />
      <Modal
        width={900}
        title="资金来源"
        visible={showModal}
        onOk={handleOk}
        // confirmLoading={confirmLoading}
        onCancel={() => setShowModal(false)}
      >
        <Form form={form} onFinish={onFinish}>
          <Row gutter={24}>
            <Col>
              <Form.Item label="关键词" name="search_keyword">
                <Input placeholder="请输入关键词" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Space>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button onClick={() => reset()}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Form>
        <div className={styles.wrapper}>
          <div className={styles.expandSwitch}>
            <Switch
              checkedChildren="展开"
              unCheckedChildren="收起"
              defaultChecked
              checked={expandSwitchChecked}
              onChange={onExpandSwitchChange}
            />
          </div>
          <Table
            columns={modalColumns}
            dataSource={dataSource}
            className="expandTable"
            key={dataSource && dataSource.length ? 'parentTable' : 'emptyTable'}
            onRow={(record) => {
              return {
                className: expandedRowKeys.includes(record.id)
                  ? 'expanded'
                  : '',
              };
            }}
            scroll={{ y: 300 }}
            expandable={{
              expandedRowRender,
              expandedRowClassName: () => 'expandRow',
              expandRowByClick: true,
              expandedRowKeys,
              onExpandedRowsChange: onExpandedRowsChange,
              columnWidth: '80px',
            }}
            rowSelection={rowSelection}
            loading={loading}
            pagination={{
              pageSize: 5,
              total,
              current: page,
              size: 'small',
              onChange: onPageChange,
            }}
            rowKey="id"
          />
        </div>
      </Modal>
    </Space>
  );
}

// @ts-ignore
export default FundSource = forwardRef(FundSource);
