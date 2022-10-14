import { Row } from 'antd';
import { Col } from 'antd';
import { Button, Form, Input } from 'antd';
import React, { useMemo, useState } from 'react';
import Styles from './index.less';

type Props = {
  columns: any[];
  labelCol?: Object;
  wrapperCol?: Object;
  onSubmit: (data: Record<string, any>) => unknown;
};

function SearchForm({ columns, labelCol, wrapperCol, onSubmit }: Props) {
  const [expand, setExpand] = useState(false);
  const [form] = Form.useForm();

  const fields = useMemo(() => {
    const children: any[] = [];
    columns.forEach((column) => {
      if (!column.hideInSearch) {
        const key = column.key || column.dataIndex;
        children.push(
          <Col span={6} key={key}>
            <Form.Item name={key} label={column.title}>
              {column.renderFormItem ? (
                column.renderFormItem()
              ) : (
                <Input placeholder="请输入" />
              )}
            </Form.Item>
          </Col>,
        );
      }
    });
    return children;
  }, [columns]);

  const submit = (values: any) => {
    onSubmit(values);
  };

  return (
    fields.length > 0 && (
      <Form
        form={form}
        name="advanced_search"
        className={Styles.searchForm}
        onFinish={submit}
        onReset={() => submit({})}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        <Row gutter={16}>{fields}</Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              htmlType="submit"
              className={Styles.submitBtn}
            >
              搜索
            </Button>
            <Button
              style={{ marginLeft: '10px' }}
              onClick={() => {
                form.resetFields();
              }}
              htmlType="reset"
              className={Styles.resetBtn}
            >
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    )
  );
}
SearchForm.defaultProps = {
  labelCol: { span: 7 },
  wrapperCol: undefined,
};

export default React.memo(SearchForm);
