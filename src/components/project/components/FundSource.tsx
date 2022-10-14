/**
 * 资金来源组件
 */
import React, {
  useState,
  useMemo,
  useImperativeHandle,
  forwardRef,
  useEffect,
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
  InputNumber,
  message,
} from 'antd';
import styles from '../index.less';
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
  const { originSubItem, freezSubItemIds, paymentData, showInputIndex } = props;
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

  // 获取所有分项数据
  const getList = (page?: any) => {
    const values = form.getFieldsValue();
    const params = {
      page,
      pagesize,
      search_keyword: values.search_keyword || '',
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
  const onAmountChange = (e: any, record: any) => {
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
    Modal.confirm({
      content: `确认删除该分项？`,
      onOk: async () => {
        try {
          const newData = [...docmentSubItem];
          const index = newData.findIndex((item) => id === item.id);
          newData.splice(index, 1);
          setDocmentSubItem(newData);
        } catch (e) {}
      },
    });
  };

  // 已选资金来源表格配置
  let columns: any =
    showInputIndex == 1
      ? [
          {
            title: '序号',
            dataIndex: 'index',
            align: 'center',
            width: 60,
            render: (text: any, record: any, index: number) => `${index + 1}`,
          },
          {
            title: '文件名称',
            dataIndex: 'fund_source_info',
            align: 'center',
            render: (_: any, value: any) => (
              <div>
                {value.project_fund_source_info &&
                value.project_fund_source_info.project_name
                  ? value.project_fund_source_info.project_name
                  : '-'}
              </div>
            ),
          },
          {
            title: '分项名称',
            dataIndex: 'subitem_info',
            align: 'center',
            render: (_: any, value: any) => (
              <div>
                {value.fund_subitem_info && value.fund_subitem_info.subitem_name
                  ? value.fund_subitem_info.subitem_name
                  : '-'}
              </div>
            ),
          },
          {
            title: '补助金额（万元）',
            dataIndex: 'amount',
            align: 'center',
          },
          {
            title: '剩余可兑现金额（万元）',
            dataIndex: 'remain_amount',
            align: 'center',
          },
          {
            title: '本次拨付金额（万元）',
            dataIndex: 'actual_amount',
            align: 'center',
            render: (value: any, record: any) => (
              <>
                <span className={styles.fakeRequired}></span>
                <InputNumber
                  max={record.remain_amount}
                  disabled={showInputIndex != 1}
                  precision={2}
                  style={{ width: '90%' }}
                  value={value}
                  controls={false}
                  placeholder={`剩余金额${record.remain_amount}万`}
                  onChange={(e: any) => onAmountChange(e, record)}
                ></InputNumber>
              </>
            ),
          },
          {
            title: '操作',
            dataIndex: 'id',
            align: 'center',
            width: 60,
            render: (value: any) => {
              // console.log(freezSubItemIds, value);
              return showInputIndex != 1 ||
                freezSubItemIds.includes(value) ? null : (
                <Button type="text" danger onClick={() => deleteSubItem(value)}>
                  删除
                </Button>
              );
            },
          },
        ]
      : [
          {
            title: '序号',
            dataIndex: 'index',
            align: 'center',
            width: 60,
            render: (text: any, record: any, index: number) => `${index + 1}`,
          },
          {
            title: '文件名称',
            dataIndex: 'fund_source_info',
            align: 'center',
            render: (_: any, value: any) => (
              <div>
                {value.project_fund_source_info &&
                value.project_fund_source_info.project_name
                  ? value.project_fund_source_info.project_name
                  : '-'}
              </div>
            ),
          },
          {
            title: '分项名称',
            dataIndex: 'subitem_info',
            align: 'center',
            render: (_: any, value: any) => (
              <div>
                {value.fund_subitem_info && value.fund_subitem_info.subitem_name
                  ? value.fund_subitem_info.subitem_name
                  : '-'}
              </div>
            ),
          },
          {
            title: '本次拨付金额（万元）',
            dataIndex: 'actual_amount',
            align: 'center',
            render: (value: any, record: any) => (
              <InputNumber
                max={9999999999}
                disabled={showInputIndex != 1}
                precision={2}
                style={{ width: '90%' }}
                value={value}
                controls={false}
                placeholder={`剩余金额${record.remain_amount}万`}
                onChange={(e: any) => onAmountChange(e, record)}
              ></InputNumber>
            ),
          },
          {
            title: '操作',
            dataIndex: 'id',
            align: 'center',
            width: 60,
            render: (value: any) => {
              // console.log(freezSubItemIds, value);
              return showInputIndex != 1 ||
                freezSubItemIds.includes(value) ? null : (
                <Button type="text" danger onClick={() => deleteSubItem(value)}>
                  删除
                </Button>
              );
            },
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
    // {
    //   title: '资金文号',
    //   dataIndex: 'fund_source_info',
    //   align: 'center',
    //   render: (value: any) => value.fund_number,
    // },
    // {
    //   title: '资金金额（万元）',
    //   dataIndex: 'fund_source_info',
    //   align: 'center',
    //   render: (value: any) => value.all_amount,
    // },
    {
      title: '下达时间',
      dataIndex: 'fund_source_info',
      align: 'center',
      render: (value: any) => value.xd_at,
    },
  ];

  // 确认选择资金来源
  const handleOk = () => {
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
    // console.log('选中的数据', selectedData);
    // 添加到政策文件已选分项数据中
    let bridge = docmentSubItem.concat(selectedData);
    console.log('bridge', bridge);
    setDocmentSubItem(bridge);
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
    if (keys.includes(record.id)) {
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
  }));

  useEffect(() => {
    getList(1);
  }, []);

  useEffect(() => {
    if (showModal) {
      const selectedIds = docmentSubItem.map((v: any) => v.id);
      setSelectedRowKeys(selectedIds);
    }
  }, [showModal]);

  useMemo(() => {
    if (originSubItem?.length) {
      setSelectedRowKeys(originSubItem.map((v: any) => v.id));
      setDocmentSubItem(originSubItem);
    }
  }, [originSubItem]);

  const onPageChange = (page: any, pagesize: any) => {
    setSelectedRowKeys(docmentSubItem.map((v: any) => v.id) || []);
    setPage(page);
    getList(page);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {/* {showInputIndex != 1 ? (
        <div className={styles.blockTitle}>资金来源</div>
      ) : (
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => setShowModal(true)}
        >
          添加资金来源
        </Button>
      )} */}
      <div className={styles.blockTitle}>资金来源</div>
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
          <Row gutter={20}>
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
    </Space>
  );
}

// @ts-ignore
export default FundSource = forwardRef(FundSource);
