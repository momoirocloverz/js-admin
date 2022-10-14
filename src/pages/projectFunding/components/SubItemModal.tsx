/**
 * 分项管理弹窗
 */
import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Apis from '@/utils/apis';
import Styles from './index.less';
// updateFundSubItem,
// deleteFundSubItem,
// getFundSubItemList,
import { Modal, Button, Space, Table, Form, Input, message } from 'antd';

function SubItemModal(props: any, ref?: any) {
  const { showModal, onCancel, getSubItem } = props;
  const [subItem, setSubItem] = useState<any>([]); // 已有分项
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentId, setCurrentId] = useState(''); // 当前编辑分项id
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useImperativeHandle(ref, () => ({
    getSubItem: () => {
      return subItem;
    },
  }));

  const columns: any = [
    {
      title: '分项名称',
      dataIndex: 'subitem_name',
      align: 'left',
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center',
      width: 100,
      render: (value: any, record: any) => (
        <Space size="large">
          <EditOutlined
            className={Styles.operateIcon}
            onClick={() => openEditModal(record)}
          />
          <DeleteOutlined
            className={Styles.operateIcon}
            onClick={() => deleteSubItem(record.id)}
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getList();
  }, []);

  // 获取分项列表
  const getList = () => {
    Apis.getFundSubItemList({
      page: 1,
      pagesize: 999,
    }).then((res: any) => {
      if (res.code == 0) {
        setSubItem(res.data.list);
        getSubItem();
      } else {
        message.error(res.msg);
      }
    });
  };

  // 打开编辑弹窗
  const openEditModal = (record: any) => {
    editForm.setFieldsValue({ ...record });
    setCurrentId(record.id);
    setShowEditModal(true);
  };

  // 添加分项
  const onFinish = (values: any) => {
    // console.log(values);
    Apis.updateFundSubItem({
      subitem_name: values.subitem_name,
    }).then((res: any) => {
      if (res.code == 0) {
        message.success('添加成功');
        form.resetFields();
        getList();
      } else {
        message.error(res.msg);
      }
    });
  };

  const onEditCancel = () => {
    editForm.resetFields();
    setShowEditModal(false);
  };

  // 保存编辑分项
  const onEditOk = () => {
    editForm.validateFields().then((values) => {
      console.log(values);
      Apis.updateFundSubItem({
        subitem_name: values.subitem_name,
        id: currentId,
      }).then((res: any) => {
        if (res.code == 0) {
          message.success('编辑成功');
          editForm.resetFields();
          getList();
        } else {
          message.error(res.msg);
        }
      });
      setShowEditModal(false);
    });
  };

  // 删除分项
  const deleteSubItem = (id: any) => {
    console.log(id);
    Modal.confirm({
      content: `确认删除该分项？`,
      onOk: async () => {
        try {
          Apis.deleteFundSubItem({ id }).then((res: any) => {
            if (res.code == 0) {
              message.success('删除成功');
              getList();
            } else {
              message.error(res.msg);
            }
          });
        } catch (e) {}
      },
    });
  };

  return (
    <>
      <Modal
        title="分项管理"
        visible={showModal}
        onOk={onCancel}
        onCancel={onCancel}
      >
        <Space direction="vertical">
          <Form
            form={form}
            layout="inline"
            onFinish={onFinish}
            style={{ minHeight: '60px' }}
          >
            <Form.Item
              name="subitem_name"
              style={{ marginBottom: 0 }}
              rules={[{ required: true, message: `请输入分项名称` }]}
            >
              <Input placeholder="请输入分项名称"></Input>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                添加
              </Button>
            </Form.Item>
          </Form>

          <Table
            className="zebraTable"
            size="small"
            showHeader={false}
            columns={columns}
            dataSource={subItem}
            scroll={{ y: 250 }}
            pagination={false}
            rowClassName={(record, index) => {
              let className = 'light-row';
              if (index % 2 === 1) className = 'dark-row';
              return className;
            }}
            rowKey="id"
          />
        </Space>
      </Modal>

      <Modal
        title="编辑分项"
        visible={showEditModal}
        onOk={onEditOk}
        onCancel={onEditCancel}
      >
        <Form form={editForm} onFinish={() => {}} style={{ minHeight: '60px' }}>
          <Form.Item
            label="分项名称"
            name="subitem_name"
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: `请输入分项名称` }]}
          >
            <Input placeholder="请输入分项名称"></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

// @ts-ignore
export default SubItemModal = forwardRef(SubItemModal);
