import { useState, useEffect, useRef } from 'react';
import styles from './index.less';
import { Button, Form, Space, Image, Modal, message } from 'antd';
import MediaUploader from '@/components/form/MediaUploader';
import { bannerList, bannerUpdate, bannerDelete } from '@/api/system';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function HomeConfig() {
  const [form] = Form.useForm();
  const tableRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [record, setRecord] = useState<any>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [total, setTotal] = useState(0)

  const columns: ProColumns<Record<string, any>, 'text'>[] | undefined = [
    {
      title: '封面',
      dataIndex: 'cover',
      render: (value: any) => <Image width={200} src={value} />,
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
    },
    {
      title: '操作',
      dataIndex: 'updated_at',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button
            type="primary"
            ghost
            className={styles.darker}
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          <Button
            type="primary"
            ghost
            danger
            className={styles.darker}
            onClick={() => deleteBanner(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const openModal = (record?: Record<string, any>) => {
    if (record) {
      const recordCopy = JSON.parse(JSON.stringify(record));
      // cover需是数组格式，裁剪组件需要
      recordCopy.cover = [{ url: recordCopy.cover }];
      setRecord(recordCopy);
      setIsEdit(true);
      form.setFieldsValue(recordCopy);
    } else {
      form.resetFields();
      setIsEdit(false);
      setRecord(null);
    }
    setVisible(true);
  };

  const loadData = async (rawParams: any) => {
    const { current: page, pageSize: pagesize, ...rest } = rawParams;
    const params = {
      ...rest,
      page,
      pagesize: Number.MAX_SAFE_INTEGER,
      current: undefined,
    };

    const result = await bannerList(params);
    setTotal(result?.data?.total)
    return {
      data: result?.data?.data,
      total: result?.data?.total,
    };
  };

  const onSubmit = () => {
    form?.submit();
  };

  const onFinish = async (values: any) => {
    const { cover } = values;
    const params = {
      cover: cover?.[0]?.url,
      id: record?.id,
    };
    setConfirmLoading(true);
    try {
      const result: any = await bannerUpdate(params);
      if (result.code == 0) {
        setVisible(false);
        tableRef.current?.reload();
      } else {
        message.warning(result.msg);
      }
    } catch (e) {
    } finally {
      setConfirmLoading(false);
    }
  };

  const deleteBanner = async ({ id }: { id: number }) => {
    Modal.confirm({
      content: `确认删除该封面?`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          const result: any = await bannerDelete({ id });
          if (result.code == 0) {
            message.success('删除成功');
            tableRef.current?.reload();
          } else {
            message.warning(result.msg);
          }
        } catch (e) {
        } finally {
          setConfirmLoading(false);
        }
      },
    });
  };

  return (
    <>
      <ProTable
        search={false}
        columns={columns}
        options={false}
        revalidateOnFocus={false}
        actionRef={tableRef}
        request={loadData}
        toolBarRender={() => [
          <Button
            type="primary"
            className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
            onClick={() => openModal()}
            disabled={total >= 1}
          >
            新建
          </Button>,
        ]}
        rowKey="id"
      ></ProTable>
      <Modal
        title={isEdit ? '編輯封面' : '新建封面'}
        visible={visible}
        confirmLoading={confirmLoading}
        cancelText="取消"
        okText="保存"
        onOk={onSubmit}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} onFinish={(values) => onFinish(values)}>
          <Form.Item
            label="封面图"
            name="cover"
            rules={[{ required: true, message: '请上传封面图' }]}
          >
            <MediaUploader
              accept='image/*'
              cropperConfig={{ aspectRatio: 75 / 46, title: '编辑图片' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
