import React, { useEffect, useState } from 'react';
import { Form, Input, message, Modal, Select } from 'antd';
import { urlToUploaderValue } from '@/utils/common';
import MediaUploader from '@/components/form/MediaUploader';
import { createUser, modifyUser } from '@/api/system';
import useRole from '@/components/system/useRole';
import { validatePassword } from '@/utils/common';

export default function UserModal({ context, visible, onCancel, onSuccess }) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: [, roleOptions],
  } = useRole();

  useEffect(() => {
    if (visible) {
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
    params.avatar = params.avatar?.[0]?.url;
    if (context.accountId) {
      params.accountId = context.accountId;
    }
    // Modal.confirm({
    //   content: JSON.stringify(params),
    //   onOk: async () => {

    //   },
    //   onCancel: async () => {

    //   },
    // });
    setIsLoading(true);
    try {
      if (context.action === 'create') {
        params.password = 'nyncj@123';
        params.password2 = 'nyncj@123';
        const result = await createUser(params);
        if (result.code === 0) {
          message.success('创建成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
      if (context.action === 'modify') {
        if (!params.avatar) {
          params.avatar = '';
        }
        const result = await modifyUser(params);
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
        initialValues={{
          ...context,
          avatar: urlToUploaderValue(context.avatar),
        }}
        layout="vertical"
        // labelCol={{ span: 10 }}
        // wrapperCol={{ span: 14 }}
      >
        <Form.Item
          label="用户名称"
          name="username"
          rules={[{ required: true, message: '请输入用户名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="用户角色"
          name="role_id"
          rules={[{ required: true, message: '请选择用户角色' }]}
        >
          <Select
            options={roleOptions}
            showSearch
            filterOption={(searched, options) => {
              return options?.label
                ?.toLocaleLowerCase()
                .includes(searched.toLocaleLowerCase());
            }}
          />
        </Form.Item>
        <Form.Item
          label="真实姓名"
          name="real_name"
          rules={[{ required: true, message: '请输入真实姓名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="联系电话"
          name="mobile"
          rules={[{ required: true, message: '请输入联系电话' }]}
        >
          <Input type="tel" />
        </Form.Item>
        {/* {context.action === 'create' ? (
          <Form.Item
            label="密码"
            name="password"
            required
            rules={[
              {
                validator: (r, v) => {
                  return validatePassword(v);
                },
              },
            ]}
          >
            <Input type="password" />
          </Form.Item>
        ) : null} */}
        {/* {context.action === 'create' ? (
          <Form.Item
            label="确认密码"
            name="password2"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('密码必须是一致的!'));
                },
              }),
            ]}
          >
            <Input type="password" />
          </Form.Item>
        ) : null} */}
        <Form.Item label="头像" name="avatar">
          <MediaUploader />
        </Form.Item>
      </Form>
    </Modal>
  );
}
