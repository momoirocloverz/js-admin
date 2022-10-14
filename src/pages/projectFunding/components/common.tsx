import styles from './common.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState, useRef } from 'react';
import {
  message,
  Button,
  Input,
  Divider,
  InputNumber,
  Select,
  DatePicker,
  Form,
  Row,
  Col,
} from 'antd';
import FundSource from '../components/FundSource';
const { Option } = Select;
import moment from 'moment';
import PdfUpload from './pdfUpload';
const projectType: any = {
  project: '竞争性财政支农项目',
  project_sub: '惠农补贴项目',
};
const commonForm = (props: any) => {
  const { setIsLoading, id } = props;
  const [yearList, setYearList] = useState<any>([]);
  const [originSubItem, setOriginSubItem] = useState([]); // 编辑时已有分项数据
  const [form] = Form.useForm();
  const fundSourceRef: any = useRef();

  const setArray = () => {
    const fullYear = new Date().getFullYear();
    const arrYear = [];
    for (let i = 0; i < 10; i++) {
      arrYear.push({
        name: `${fullYear - i}年`,
        value: fullYear - i,
        label: `${fullYear - i}年`,
      });
    }
    setYearList(arrYear);
  };
  useEffect(() => {
    setArray();
    fetchDetail();
  }, []);
  const fetchDetail = () => {
    if (id) {
      Apis.projectCapitalSourceInfo({
        id,
      })
        .then((res: any) => {
          if (res && res.code === 0) {
            let shorter = res.data.info;
            form.setFieldsValue({
              year: shorter.year,
              project_name: shorter.project_name,
              all_amount: shorter.all_amount,
              project_type: shorter.project_type,
            });
            // 已选分项默认值
            initSubItem(
              res.data?.info?.project_capital_source_rel_subitem_list,
            );
          } else {
            message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log('err', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  };
  const formItemLayout = {
    labelCol: { span: 20 },
    wrapperCol: { span: 24 },
  };
  const cancelAction = () => {
    history.goBack();
  };
  const onFinish = (values: any) => {
    let data: any = {
      year: values.year,
      project_name: values.project_name,
      project_type: values.project_type,
    };
    if (id) {
      data.id = id;
    }
    let subItems = fundSourceRef.current.getDataSource() || [];
    data.subitem_list = subItems.map((v: any) => {
      return { rel_subitem_id: v.id, amount: v.actual_amount };
    });
    if (data.subitem_list && data.subitem_list.length) {
      Apis.projectCapitalSourceAction(data)
        .then((res: any) => {
          if (res && res.code === 0) {
            message.success('操作成功');
            history.goBack();
          } else {
            message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    } else {
      message.error('分项不能为空');
    }
  };
  // 更新资金分项金额
  const sumSubItemAmount = () => {
    form.setFields([
      {
        name: 'all_amount',
        value: fundSourceRef.current.getSubItemAmount() || 0,
      },
    ]);
  };

  // 编辑时初始化已选分项数据
  const initSubItem = (data: any = []) => {
    const result = data.map((v: any) => {
      return {
        ...v,
        actual_amount: v.amount,
        id: v.rel_subitem_id,
        remain_amount:
          v.project_fund_source_rel_subitem_info &&
          v.project_fund_source_rel_subitem_info.remain_amount
            ? v.project_fund_source_rel_subitem_info.remain_amount
            : '0.00',
      };
    });
    console.log('result', result);
    setOriginSubItem(result);
  };

  const getDocumentSubItem = () => {
    return fundSourceRef?.current.getDocumentSubItem();
  };
  return (
    <div className={styles.h1omePageCon}>
      <Form
        {...formItemLayout}
        form={form}
        name="nest-messages"
        labelAlign={'left'}
        onFinish={onFinish}
        className={styles.formCon}
        layout="vertical"
      >
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name="project_name"
              label="项目名称"
              rules={[{ required: true, message: `请输入项目名称` }]}
            >
              <Input placeholder="请输入项目名称" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="year"
              label="年度"
              rules={[{ required: true, message: `请选择年度` }]}
            >
              <Select
                className={styles.marginRight}
                placeholder="请选择"
                allowClear
              >
                {yearList.map((ele) => (
                  <Option value={ele.value} key={ele.value}>
                    {ele.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}></Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="all_amount" label="资金总额(万元)">
              <InputNumber
                disabled
                style={{ width: '100%' }}
                precision={2}
                placeholder="根据分项金额自动计算"
              ></InputNumber>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="project_type" label="项目类型" rules={[{ required: true, message: `请选择项目类型` }]}>
              <Select
                className={styles.marginRight}
                placeholder="请选择"
                allowClear
              >
                {Object.keys(projectType).map((key) => (
                  <Option value={key} key={key}>
                    {projectType[key]}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row gutter={24}>
          <Col span={24}>
            <FundSource
              ref={fundSourceRef}
              originSubItem={originSubItem}
              getDocumentSubItem={getDocumentSubItem}
              sumSubItemAmount={sumSubItemAmount}
            />
          </Col>
        </Row>
        <div className={styles.btnCon}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button
            htmlType="button"
            style={{ marginLeft: '20px' }}
            onClick={() => cancelAction()}
          >
            取消
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default connect()(commonForm);
