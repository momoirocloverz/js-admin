import React, { useEffect, useState, useMemo } from 'react';
import { Form, Input, message, Modal, InputNumber, List } from 'antd';
import { createNav, modifyNav, removeNav } from '@/api/system';
import { Button } from 'antd';
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

export default function NavModal({ context, visible, onCancel, onSuccess }) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState();
  const [haveChildren, setHaveChildren] = useState();
  const [level, setLevel] = useState();

  useEffect(() => {
    if (visible) {
      setType(context.type?.toString());
      setHaveChildren(context.haveChildren?.toString());
      setLevel(context.level?.toString());
      form.resetFields();
    }
  }, [visible]);

  const submit = async () => {
    let params;
    try {
      params = await form.validateFields();
    } catch (e) {
      return;
    }
    params.id = context.id;
    params.pid = context.pid;
    params.type = context.type;
    setIsLoading(true);
    try {
      if (context.action === 'create') {
        // console.log('asd', params);
        const result = await createNav(params);
        if (result.code === 0) {
          message.success('创建成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
      if (context.action === 'modify') {
        const result = await modifyNav(params);
        if (result.code === 0) {
          message.success('修改成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
    } catch (e) {
      message.error(`提交失败: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const typeName = useMemo(() => {
    return type === '1' ? '导航' : '权限';
  }, [type]);

  return (
    <Modal
      title={context.action === 'create' ? '新建' : '编辑'}
      visible={visible}
      width={450}
      confirmLoading={isLoading}
      onCancel={onCancel}
      onOk={submit}
    >
      <Form
        form={form}
        initialValues={context}
        layout="vertical"
        // labelCol={{ span: 10 }}
        // wrapperCol={{ span: 14 }}
        onValuesChange={(changes) => {
          // if('type' in changes) {
          //   setType(changes.type.toString())
          // }
        }}
      >
        {type === '1' && (
          <Form.Item label="导航icon" name="icon">
            <Input />
          </Form.Item>
        )}
        <Form.Item
          label={`${typeName}名称`}
          name="name"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={`${typeName}标识`}
          name="mark"
          rules={[{ required: true, message: '请输入标识' }]}
        >
          <Input />
        </Form.Item>
        {/*<Form.Item*/}
        {/*  label="类型"*/}
        {/*  name="type"*/}
        {/*  getValueProps={(v)=>  ({ value: v && v.toString() })}*/}
        {/*  rules={[{ required: true, message: '请选择类型' }]}*/}
        {/*>*/}
        {/*  <Radio.Group options={navItemTypeOptions} />*/}
        {/*</Form.Item>*/}
        <Form.Item
          label="排序"
          name="sort"
          rules={[{ required: true, message: '请输入排序' }]}
        >
          <InputNumber min={0} precision={0} />
        </Form.Item>
        {/* {type === '2' &&
          (level == '3' ||
            level == '2' ||
            (level == '1' && haveChildren == '0')) && (
            <Form.Item label="后端接口" name="api_path">
              <Input />
            </Form.Item>
          )} */}
        {type === '2' && (
          <Form.Item
            label="后端接口"
            name="api_path"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input />
          </Form.Item>
        )}
        {/* {type === '1' && context.action === 'modify' && (
          <Form.Item label="权限">
            <List
              dataSource={context.children}
              renderItem={(item) => (
                <>
                  <List.Item
                    actions={[
                      <Button
                        type="text"
                        size="small"
                        icon={<CloseOutlined style={{ color: 'red' }} />}
                        onClick={() => {
                          Modal.confirm({
                            content: `确认删除"${item.name}"?`,
                            icon: <ExclamationCircleOutlined />,
                            onOk: async () => {
                              try {
                                const result = await removeNav(item.id);
                                if (result.code === 0) {
                                  message.success('删除成功!');
                                  onSuccess(true, true);
                                  context.permissions =
                                    context.permissions.filter(
                                      (p) => p.id !== item.id,
                                    );
                                } else {
                                  throw new Error(result.msg);
                                }
                              } catch (e) {
                                message.error(`删除失败: ${e.message}!`);
                              }
                            },
                          });
                        }}
                      />,
                    ]}
                  >
                    <List.Item.Meta title={item.name} />
                  </List.Item>
                </>
              )}
            />
          </Form.Item>
        )} */}
      </Form>
    </Modal>
  );
}
