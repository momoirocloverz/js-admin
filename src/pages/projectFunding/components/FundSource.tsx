/**
 * 资金来源组件
 */
import React, {
  useEffect,
  useState,
  useMemo,
  useImperativeHandle,
  forwardRef,
  useRef,
} from 'react';
import { history } from 'umi';
import { PlusCircleOutlined } from '@ant-design/icons';
import Apis from '@/utils/apis';
import { accAdd } from '@/utils/common';
import {
  Table,
  Modal,
  Button,
  Input,
  Space,
  Select,
  Form,
  Row,
  Col,
  InputNumber,
  message,
} from 'antd';
import styles from './index.less';
const projectTypeIcon: any = {
  1: 'https://img.hzanchu.com/acimg/1f4f6b3934298977758651240d062249.png',
  2: 'https://img.hzanchu.com/acimg/0afdb17f54cbfe544331d56ca1002724.png',
  3: 'https://img.hzanchu.com/acimg/28120b2e873fa1e3a692ab30dc4b5639.png',
  4: 'https://img.hzanchu.com/acimg/a3eb533892d9092ef6675560ace7b0c8.png',
};
function FundSource(props: any, ref: any) {
  const {
    location,
    fundSourceRef,
    getDocumentSubItem,
    originSubItem,
    policy_document_id,
    sumSubItemAmount,
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
  const sumRef = useRef<any>('');
  const [yearList, setYearList] = useState([]);

  // 获取所有分项数据
  const getList = (page?: any) => {
    const values = form.getFieldsValue();
    const params = {
      page,
      pagesize,
      search_keyword: values.search_keyword || '',
      search_year: values.search_year || '',
    };
    setLoading(true);
    Apis.getFundSubItemListBySubItem(params)
      .then((res: any) => {
        if (res.code == 0) {
          res.data.data.forEach((ele) => {
            ele.fund_subitem_info = ele.subitem_info;
            ele.project_fund_source_info = ele.fund_source_info;
          });
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
  useEffect(() => {
    sumSubItemAmount();
  }, [sumRef.current]);
  // 查询
  const onFinish = (values: any) => {
    setPage(1);
    getList(1);
  };

  const reset = () => {
    form.setFieldsValue({ search_keyword: '', search_year: undefined });
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
    calculateSubItemTotal(newData);
  };
  const calculateSubItemTotal = (newData: any) => {
    sumRef.current = newData.reduce((prev: any, current: any) => {
      if (!current.actual_amount) {
        return 0;
      } else {
        return accAdd(prev, current.actual_amount);
      }
    }, 0);
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
            calculateSubItemTotal(newData);
          } catch (e) {}
        },
      });
    };
    if (history.location.query && history.location.query.id) {
      let data = {
        id: history.location.query.id,
        rel_subitem_id: id,
      };
      Apis.projectCapitalSourceRemoveSubitem(data).then((res: any) => {
        if (res.code == 0) {
          if (!res.data.length) {
            deleteAction(id);
          }
        } else {
          message.error(res.msg);
        }
      });
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
      title: '资金文件分项名称',
      align: 'center',
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
      dataIndex: 'actual_amount',
      align: 'center',
      render: (value: any, record: any) => (
        <InputNumber
          max={9999999999}
          precision={2}
          style={{ width: '90%' }}
          value={value}
          controls={false}
          placeholder={`剩余金额${record.remain_amount || '-'}万`}
          onChange={(e: any) => onAmountChange(e, record)}
        ></InputNumber>
      ),
    },
    {
      title: '资金名称',
      align: 'center',
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
      align: 'center',
      render: (_: any, record: any) => (
        <Space>
          <div>{record.project_fund_source_info.fund_number}</div>
          <img
            src={projectTypeIcon[record.project_fund_source_info?.project_type]}
            alt="icon"
          />
        </Space>
      ),
    },
    {
      title: '资金年度',
      align: 'center',
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
      title: '资金分项名称',
      dataIndex: 'subitem_info',
      align: 'center',
      render: (value: any, record: any) => {
        return (
          <>
            <Space>
              <div>{value.subitem_name}</div>
              <img
                src={projectTypeIcon[record.fund_source_info?.project_type]}
                alt="icon"
              />
            </Space>
          </>
        );
      },
    },
    {
      title: '年度',
      dataIndex: 'fund_source_info',
      align: 'center',
      render: (value: any) => value.year,
    },
    {
      title: '分项金额（万元）',
      dataIndex: 'amount',
      align: 'center',
    },
    {
      title: '剩余金额（万元）',
      dataIndex: 'remain_amount',
      align: 'center',
    },
    {
      title: '资金文件',
      dataIndex: 'fund_source_info',
      align: 'center',
      render: (value: any) => value.project_name,
    },
    {
      title: '下达时间',
      dataIndex: 'fund_source_info',
      align: 'center',
      render: (value: any) => value.xd_at,
    },
  ];

  // 确认选择资金来源
  const handleOk = () => {
    console.log('选中的id', selectedRowKeys);
    // 过滤与已选项重复的id
    const oldData = [...docmentSubItem];
    oldData.forEach((oldItem: any) => {
      const idx = selectedRowKeys.findIndex((v: any) => v == oldItem.id);
      if (idx > -1) {
        // 与已选项重复 删除已选id
        selectedRowKeys.splice(idx, 1);
      }
    });
    console.log('去重后的id', selectedRowKeys);
    // 过滤出选中的数据 在页面回显
    const selectedData: any[] = dataSource.filter((item: any) =>
      selectedRowKeys.includes(item.id as never),
    );
    console.log('选中的数据', selectedData);
    let deep = JSON.parse(JSON.stringify(selectedData));
    deep.forEach((ele) => {
      ele.actual_amount = ele.remain_amount;
    });
    // selectedData.forEach(async (data: any) => {
    //   let remain_amount: any = await getRemainAmount(data.subitem_id);
    //   console.log('remain_amount', remain_amount);
    //   data.actual_remain_amount = 123||remain_amount;
    // });
    // 添加到政策文件已选分项数据中
    let hi = docmentSubItem.concat(deep)
    setDocmentSubItem(hi);
    calculateSubItemTotal(hi);
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
    if (keys.includes(record.id) || +record.remain_amount <= 0) {
      return { disabled: true };
    } else {
      return null;
    }
  };

  const rowSelection: any = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: getCheckboxProps,
  };

  useImperativeHandle(ref, () => ({
    getDocumentSubItem: () => {
      return docmentSubItem?.length ? docmentSubItem : null;
    },
    getSubItemAmount: () => {
      return sumRef.current;
    },
    getDataSource: () => {
      return docmentSubItem;
    },
  }));

  useEffect(() => {
    getList(1);
    setArray();
  }, []);

  useMemo(() => {
    if (originSubItem?.length) {
      setSelectedRowKeys(originSubItem.map((v: any) => v.id));
      setDocmentSubItem(originSubItem);
      calculateSubItemTotal(originSubItem);
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
  const setArray = () => {
    const fullYear = new Date().getFullYear();
    const arrYear = [];
    for (let i = 0; i < 10; i++) {
      arrYear.push({
        name: `${fullYear - i}年`,
        value: fullYear - i,
        label: `${fullYear - i}年`,
      });
    }
    setYearList(arrYear);
  };
  return (
    <>
      <Button
        type="primary"
        style={{
          marginBottom: '8px',
        }}
        icon={<PlusCircleOutlined />}
        onClick={() => {
          setShowModal(true);
          form.resetFields();
          setPage(1);
          getList(1);
        }}
      >
        添加分项
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
        destroyOnClose
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
            <Col>
              <Form.Item label="年度" name="search_year">
                <Select
                  style={{
                    width: '190px',
                  }}
                  placeholder="请选择"
                  allowClear
                >
                  {yearList.map((ele) => (
                    <Option value={ele.value} key={ele.value}>
                      {ele.label}
                    </Option>
                  ))}
                </Select>
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
        <Table
          columns={modalColumns}
          dataSource={dataSource}
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
      </Modal>
    </>
  );
}

// @ts-ignore
export default FundSource = forwardRef(FundSource);
