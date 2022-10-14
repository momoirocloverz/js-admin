import { useState, useEffect, useRef, useMemo } from 'react';
import styles from './index.less';
import {
  Button,
  Form,
  Space,
  Image,
  Modal,
  message,
  Select,
  Input,
  InputNumber,
} from 'antd';
// import MediaUploader from '@/components/form/MediaUploader';
import { bannerPhList, bannerPhUpdate, bannerPhDelete } from '@/api/system';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useProjectCategory from '@/components/project/useProjectCategory';

const { Option } = Select;

export default function InclusiveConfig() {
  const [form] = Form.useForm();
  const tableRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [record, setRecord] = useState<any>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [total, setTotal] = useState(0);
  const { data: category } = useProjectCategory(2);

  const columns: ProColumns<Record<string, any>, 'text'>[] | undefined = [
    {
      title: '类别',
      dataIndex: 'policy_category_info',
      render: (value: any) => value?.category_name || '-',
    },
    // {
    //   title: '背景图',
    //   dataIndex: 'cover',
    //   render: (value: any) => <Image width={200} src={value} />,
    // },
    {
      title: '当前排序',
      dataIndex: 'sorts',
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
    },
    {
      title: '操作',
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

    const result = await bannerPhList(params);
    setTotal(result?.data?.total);
    return {
      data: result?.data?.data,
      total: result?.data?.total,
    };
  };

  const onSubmit = () => {
    form?.submit();
  };

  const onFinish = async (values: any) => {
    const { cover, policy_category_id, sorts, title } = values;
    const params = {
      cover: cover?.[0]?.url,
      id: record?.id,
      title,
      sorts,
      policy_category_id,
    };
    // return console.log(params);
    setConfirmLoading(true);
    try {
      const result: any = await bannerPhUpdate(params);
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
          const result: any = await bannerPhDelete({ id });
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
            disabled={total >= 5}
          >
            新建
          </Button>,
        ]}
        rowKey="id"
      ></ProTable>
      <Modal
        title={isEdit ? '编辑' : '新建'}
        visible={visible}
        confirmLoading={confirmLoading}
        cancelText="取消"
        okText="保存"
        onOk={onSubmit}
        onCancel={() => setVisible(false)}
        width={600}
      >
        <Form
          form={form}
          onFinish={(values) => onFinish(values)}
          labelCol={{
            xs: { span: 12 },
            sm: { span: 6 },
          }}
        >
          <Form.Item
            label="惠农补贴类别"
            name="policy_category_id"
            rules={[{ required: true, message: '请选择跳转的惠农补贴类别' }]}
          >
            <Select placeholder="请选择跳转的惠农补贴类别">
              {category.map((v: any) => (
                <Option value={v.value} key={v.value}>
                  {v.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请填写标题' }]}
          >
            <Input placeholder="请输入标题，不超过20字" maxLength={20} />
          </Form.Item>
          {/* <Form.Item
            label="背景图"
            name="cover"
            extra="大小不超过10M，格式：jpg/jpeg/png"
            rules={[{ required: true, message: '请上传背景图' }]}
          >
            <MediaUploader
              cropperConfig={{ aspectRatio: 303 / 180, title: '编辑图片' }}
            />
          </Form.Item> */}
          <Form.Item
            label="排序"
            name="sorts"
            rules={[{ required: true, message: '请输入排序' }]}
          >
            <InputNumber
              min={0}
              max={5}
              style={{ width: 180 }}
              placeholder="请输入排序(最多5个)"
              precision={0}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
