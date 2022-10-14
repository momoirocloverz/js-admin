import React, { useEffect, useState, useMemo } from 'react';
import { Form, Input, message, Modal, InputNumber, List } from 'antd';
import { batchAddBtn } from '@/api/system';
const { TextArea } = Input;

export default function NavModal({ context, visible, onCancel, onSuccess }) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
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
    params.pid = context.pid;
    setIsLoading(true);
    try {
      if (context.action === 'create') {
        console.log('asd', params);
        const result = await batchAddBtn(params);
        if (result.code === 0) {
          message.success('创建成功!');
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
      <Form form={form} initialValues={context} layout="vertical">
        <Form.Item
          label="内容"
          name="btn_list"
          rules={[{ required: true, message: '请输入' }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <div>
          示例:
          <br />
          <span style={{ color: '#999', fontSize: '12px' }}>
            查看:view:policy_document/info
          </span>
          <br />
          <span style={{ color: '#999', fontSize: '12px' }}>添加:add:policy_document/add</span>
        </div>
        <div>
          提示:
          <br />
          <span style={{ color: '#999', fontSize: '12px' }}>多个按钮需换行添加</span>
        </div>
      </Form>
    </Modal>
  );
}
