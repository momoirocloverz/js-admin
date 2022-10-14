/**
 * 资金分项
 */
import React, {
  useEffect,
  useState,
  useMemo,
  useImperativeHandle,
  forwardRef,
  useRef,
} from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import Apis from '@/utils/apis';
import { Table, Modal, Button, Select, Space, InputNumber } from 'antd';
import SubItemModal from './SubItemModal';
import { accAdd } from '@/utils/common';
import Styles from './index.less';

function FundSubItem(props: any, ref?: any) {
  useImperativeHandle(ref, () => ({
    getSubItemAmount: () => {
      return sumRef.current;
    },
    getDataSource: () => {
      return dataSource;
    },
  }));
  const subItemModalRef: any = useRef();
  const { sumSubItemAmount, originSubItem } = props;
  const sumRef = useRef<any>('');
  const [dataSource, setDataSource] = useState<any>([{ id: -1 }]); // 已选分项
  const [subItem, setSubItem] = useState<any>([]); // 可选分项
  const [showModal, setShowModal] = useState(false);

  // 资金分项改变触发
  const onSubNameChange = (e: any, record: any) => {
    const selectItem = subItem.find((item: any) => item.id === e);
    const newData = [...dataSource];
    const index = newData.findIndex((item) => record.id === item.id);
    const item = newData[index];
    item.id = e;
    item.subitem_name = selectItem.subitem_name;
    newData.splice(index, 1, {
      ...item,
    });
    // 已选的分项ids
    setDataSource(newData);
    updateSubItemOptions(newData);
  };

  // 已选资金分项金额改变触发
  const onAmountChange = (e: any, record: any) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => record.id === item.id);
    const item = newData[index];
    item.amount = e;
    newData.splice(index, 1, {
      ...item,
    });
    setDataSource(newData);
    calculateSubItemTotal(newData);
  };

  // 根据最新数据计算分项总金额
  const calculateSubItemTotal = (newData: any) => {
    sumRef.current = newData.reduce((prev: any, current: any) => {
      if (!current.amount) {
        return 0;
      } else {        
        return accAdd(prev, current.amount);
      }
    }, 0);
  };

  // 删除已选资金分项
  const deleteSubItem = (id: any) => {
    Modal.confirm({
      content: `确认删除该分项？`,
      onOk: async () => {
        try {
          const newData = [...dataSource];
          const index = newData.findIndex((item) => item.id == id);
          newData.splice(index, 1);
          setDataSource(newData);
          calculateSubItemTotal(newData);
          updateSubItemOptions(newData);
        } catch (e) {}
      },
    });
  };

  // 根据已选项，禁用下拉选择项
  const updateSubItemOptions = (newData: any) => {
    const selectedIds = newData.map((v: any) => v.id);
    const options = [...subItem];
    // console.log('selectedIds', JSON.stringify(selectedIds));
    // console.log('options', JSON.stringify(options));
    options.forEach((v: any) => {
      v.disabled = selectedIds.includes(v.id);
    });
    setSubItem(options);
  };

  // 已选资金来源表格配置
  const columns: any = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'left',
      width: 70,
      render: (text: any, record: any, index: number) => `${index + 1}`,
    },
    {
      title: '分项名称',
      dataIndex: 'subitem_name',
      align: 'left',
      render: (value: any, record: any) => (
        <Select
          className={Styles.tableInput}
          options={subItem}
          value={value}
          fieldNames={{
            label: 'subitem_name',
            value: 'id',
          }}
          placeholder="请选择分项"
          onChange={(e: any) => onSubNameChange(e, record)}
          filterOption={(searched: any, options: any) => {
            return options?.subitem_name
              ?.toLocaleLowerCase()
              .includes(searched.toLocaleLowerCase());
          }}
          showSearch
        ></Select>
      ),
    },
    {
      title: '资金金额（万元）',
      dataIndex: 'amount',
      align: 'left',
      render: (value: any, record: any) => (
        <InputNumber
          className={Styles.tableInput}
          max={9999999999}
          precision={2}
          value={value}
          disabled={record.id < 0}
          placeholder="请输入资金金额"
          onChange={(e: any) => onAmountChange(e, record)}
        ></InputNumber>
      ),
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'left',
      width: 100,
      render: (value: any, record: any, index: number) => (
        <>
          {dataSource.length > 0 && (
            <Button type="text" danger onClick={() => deleteSubItem(value)}>
              删除
            </Button>
          )}
        </>
      ),
    },
  ];

  // 从子组件获取可选分项
  const getSubItem = (cb?: any) => {
    const list = subItemModalRef.current.getSubItem();
    setSubItem(list);
  };

  useMemo(() => {
    if (originSubItem?.length) {
      setDataSource(originSubItem);
      updateSubItemOptions(originSubItem);
      calculateSubItemTotal(originSubItem);
    }
  }, [originSubItem]);
  
  useEffect(() => {
    if (subItem?.length) {
      updateSubItemOptions(originSubItem);
    }
  }, [subItem.length]);

  useEffect(() => {
    sumSubItemAmount();
  }, [sumRef.current]);

  return (
    <Space
      direction="vertical"
      style={{ width: '100%', paddingBottom: '20px' }}
    >
      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        onClick={() => setShowModal(true)}
      >
        分项管理
      </Button>

      <Table
        size="small"
        columns={columns}
        dataSource={dataSource}
        scroll={{ y: 250 }}
        pagination={false}
        rowKey="id"
      />

      <Space
        className={Styles.addItem}
        onClick={() =>
          setDataSource(dataSource.concat([{ id: -dataSource.length - 1 }]))
        }
      >
        <PlusCircleOutlined />
        <div>新增分项</div>
      </Space>

      <SubItemModal
        ref={subItemModalRef}
        showModal={showModal}
        getSubItem={getSubItem}
        // onOk={() => setShowModal(false)}
        onCancel={() => setShowModal(false)}
      />
    </Space>
  );
}

// @ts-ignore
export default FundSubItem = forwardRef(FundSubItem);
