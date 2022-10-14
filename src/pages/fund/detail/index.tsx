import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  message,
  Select,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Space,
} from 'antd';
import { PlusCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons';
import { getFundInfo, editFundInfo } from '@/api/projects';
import moment from 'moment';
import styles from '../index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
const { Option } = Select;
const FUND_TYPE = [
  {
    label: '中央',
    value: '中央',
  },
  {
    label: '浙江省级',
    value: '浙江省级',
  },
  {
    label: '衢州市级',
    value: '衢州市级',
  },
  {
    label: '江山市级',
    value: '江山市级',
  },
];

const defaultFields = [
  {
    type: null,
    amount: '',
    amount_at: '',
  },
];
const FundDetail = (props: any) => {
  const { location, dispatch } = props;
  const [detail, setDetail] = useState({});
  const [fundList, setFundList] = useState<Array<any>>(defaultFields);
  const [editable, setEditable] = useState(false);
  const [form] = Form.useForm();
  const initAction = () => {
    commitGlobalBread([
      {
        title: '资金管理',
      },
      {
        title: '资金使用',
      },
      {
        title: '详情',
      },
    ]);
  };

  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };
  useEffect(() => {
    initAction();
    getDetails();
    getInfo();
    if (location.query.editable == 1) {
      setEditable(true);
    }
  }, []);

  const getDetails = () => {
    Apis.fetchPolicyDocumentInfo({ id: location.query.id })
      .then((res) => {
        setDetail(res.data);
      })
      .catch((e) => {});
  };

  const getInfo = async () => {
    const info = await getFundInfo({ policy_document_id: location.query.id });
    // console.log('info', info);
    if (info.data?.data?.length) {
      const list = info.data?.data;
      list
        .sort((a: any, b: any) => a.batch - b.batch)
        .map((v: any) => {
          v.amount_at = moment(v.amount_at); // 下达时间转Date类型回显
          v.amount = parseFloat(Number(v.amount) / 10000);
          return v;
        });
      setFundList(list);
      form.setFieldsValue({ funds: list });
    }
  };

  const onFinish = (values: any) => {
    console.log(values);
    const { funds } = values;
    let list = [];
    if (funds?.length) {
      list = funds.map((fund: any, index: number) => {
        let item = {
          amount: parseFloat(fund.amount * 10000).toFixed(2),
          amount_at: moment(fund.amount_at).format('YYYY-MM-DD HH:mm:ss'),
          batch: index + 1,
          type: fund.type,
        };

        return item;
      });
    } else {
      message.warning('未获取到资金数据');
    }
    editFundInfo({
      policy_document_id: location.query.id,
      list,
    })
      .then((res: any) => {
        if (res.code != 0) {
          return message.error(res.msg);
        }
        message.success('保存成功');
      })
      .catch(() => {});
  };

  return (
    <div className={styles.pageCon}>
      <div className={styles.headerCon}>
        <div className={styles.title}>政策名称：{detail.title}</div>
        <Button
          type="primary"
          onClick={() => {
            history.push({
              pathname: '/fund/documentDetail',
              query: { id: location.query.id },
            });
          }}
        >
          查看政策
        </Button>
      </div>

      <div className={styles.formContainer}>
        <Form
          form={form}
          name="funds_form"
          initialValues={{
            funds: fundList,
          }}
          onFinish={(values) => onFinish(values)}
        >
          <Form.List name="funds">
            {(fields, { add, remove }) =>
              fields.map((field: any, index: number) => (
                <Space
                  key={index}
                  style={{ marginBottom: 8 }}
                  align="baseline"
                  wrap
                >
                  {/* <div className="itemTitle">{`第${index + 1}批次：`}</div> */}
                  <div className={styles.itemTitle}>{`批次${index + 1}`}</div>
                  <Form.Item
                    label="上级下达资金"
                    name={[field.name, 'type']}
                    rules={[{ required: true, message: '请选择下达资金层级' }]}
                  >
                    <Select
                      options={FUND_TYPE}
                      style={{ width: 130 }}
                      placeholder="请选择"
                      disabled={!editable}
                    ></Select>
                  </Form.Item>
                  <Form.Item
                    label="资金（万元）"
                    name={[field.name, 'amount']}
                    rules={[{ required: true, message: '请填写资金金额' }]}
                  >
                    <InputNumber
                      max={99999}
                      // precision={3}
                      min={0}
                      placeholder="请填写"
                      style={{ width: 100 }}
                      disabled={!editable}
                    />
                  </Form.Item>
                  <Form.Item
                    label="资金下达时间"
                    name={[field.name, 'amount_at']}
                    rules={[{ required: true, message: '请选择下达时间' }]}
                  >
                    <DatePicker
                      placeholder="请选择下达时间"
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      style={{ width: 186 }}
                      disabled={!editable}
                    />
                  </Form.Item>
                  {editable && (
                    <>
                      {index == fields.length - 1 && (
                        <Space
                          className={styles.iconBtn}
                          style={{ cursor: 'pointer' }}
                          onClick={() => add()}
                        >
                          <PlusCircleTwoTone style={{ color: '#1890ff' }} />
                          <span style={{ color: '#1890ff' }}>新增</span>
                        </Space>
                      )}
                      {index > 0 && (
                        <Space
                          className={styles.iconBtn}
                          style={{ cursor: 'pointer' }}
                          onClick={() => remove(index)}
                        >
                          <MinusCircleTwoTone style={{ color: '#1890ff' }} />
                          <span style={{ color: '#1890ff' }}>删除</span>
                        </Space>
                      )}
                    </>
                  )}
                </Space>
              ))
            }
          </Form.List>

          <div className={styles.btnContainer}>
            <Space>
              {editable && (
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              )}
              <Button onClick={() => history.goBack()}>返回</Button>
            </Space>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default connect((baseModel) => ({ baseModel }))(FundDetail);
