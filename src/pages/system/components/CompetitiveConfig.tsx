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
} from 'antd';
import MediaUploader from '@/components/form/MediaUploader';
import { bannerJzxList, bannerJzxUpdate, bannerJzxDelete } from '@/api/system';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useProjectDocuments from '@/components/project/use-project-documents';
// import { SketchPicker } from 'react-color';
const { Option } = Select;

export default function CompetitiveConfig() {
  const [form] = Form.useForm();
  const tableRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [record, setRecord] = useState<any>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [total, setTotal] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { data: documents } = useProjectDocuments(14);

  const columns: ProColumns<Record<string, any>, 'text'>[] | undefined = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '标题颜色',
      dataIndex: 'color',
      hideInSearch: true,
      render: (value: any) => {
        if (value) {
          return (
            <div className={styles.colorBlock}>
              <div>{value}</div>
              <div className={styles.inner} style={{ background: value }}></div>
            </div>
          );
        }
      },
    },
    {
      title: '背景图',
      dataIndex: 'cover',
      render: (value: any) => <Image width={200} src={value} />,
    },
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
    form.setFields([{ name: 'color', value: record?.color || '#ffffff' }]);
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

    const result = await bannerJzxList(params);
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
    const { cover, policy_document_id, sorts, title, color } = values;
    console.log('values', values);

    const params = {
      cover: cover?.[0]?.url,
      id: record?.id,
      title,
      sorts,
      policy_document_id,
      color,
    };
    // return console.log(params);
    setConfirmLoading(true);
    try {
      const result: any = await bannerJzxUpdate(params);
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
          const result: any = await bannerJzxDelete({ id });
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

  // const handleChangeComplete = (color: any) => {
  //   console.log('color', color);
  //   setColor(color.hex);
  // };

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
            disabled={total >= 2}
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
            label="跳转的政策文件"
            name="policy_document_id"
            rules={[{ required: true, message: '请选择' }]}
          >
            <Select placeholder="请选择跳转的政策文件">
              {documents.map((v: any) => (
                <Option value={v.id} key={v.id}>
                  {v.title}
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
          <Form.Item
            label="标题颜色"
            name="color"
            rules={[{ required: true, message: '请选择标题颜色' }]}
          >
            <Input
              type="color"
              style={{ width: '100px', padding: '0 3px' }}
            ></Input>
            {/* <div
              className={styles.swatch}
              onClick={() => setShowColorPicker(true)}
            >
              <div className={styles.color} style={{ background: color }} />
            </div>
            {showColorPicker ? (
              <div className={styles.popover}>
                <div
                  className={styles.cover}
                  onClick={() => setShowColorPicker(false)}
                />
                <SketchPicker color={color} onChange={handleChangeComplete} />
              </div>
            ) : null} */}
          </Form.Item>
          <Form.Item
            label="背景图"
            name="cover"
            extra="大小不超过10M，格式：jpg/jpeg/png"
            rules={[{ required: true, message: '请上传背景图' }]}
          >
            <MediaUploader
              accept='image/*'
              cropperConfig={{ aspectRatio: 622 / 155, title: '编辑图片' }}
            />
          </Form.Item>
          <Form.Item
            label="排序"
            name="sorts"
            rules={[{ required: true, message: '请选择排序' }]}
          >
            <Select placeholder="请选择排序">
              <Option value={1}>1</Option>
              <Option value={2}>2</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
