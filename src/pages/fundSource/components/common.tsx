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
import FundSubItem from './FundSubItem';
const { Option } = Select;
import moment from 'moment';
import PdfUpload from './pdfUpload';

const commonForm = (props: any) => {
  const { setIsLoading, id } = props;
  const [yearList, setYearList] = useState<any>([]);
  const [pdfUrl, setPdfUrl] = useState([]);
  const [fund_typeArray, setFund_typeArray] = useState([
    {
      value: '1',
      label: `建设性`,
    },
    {
      value: '2',
      label: `非建设性`,
    },
  ]);
  const [project_typeArray, setProject_typeArray] = useState([
    {
      value: '1',
      label: `中央`,
    },
    {
      value: '2',
      label: `省级`,
    },
    {
      value: '3',
      label: `市级`,
    },
    {
      value: '4',
      label: `县级`,
    },
  ]);
  const [originSubItem, setOriginSubItem] = useState([]); // 编辑时已有分项数据
  const [form] = Form.useForm();
  const fundSubItemRef: any = useRef();

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
      Apis.projectFundSourceInfo({
        id,
      })
        .then((res: any) => {
          if (res && res.code === 0) {
            let shorter = res.data.info;
            form.setFieldsValue({
              xd_at: moment(shorter.xd_at),
              fund_number: shorter.fund_number,
              // fund_type: String(shorter.fund_type),
              year: shorter.year,
              project_name: shorter.project_name,
              project_type: String(shorter.project_type),
              qz_amount: +shorter.qz_amount,
              js_amount: +shorter.js_amount,
              zj_amount: +shorter.zj_amount,
              zy_amount: +shorter.zy_amount,
              attachment: shorter.attachment,
              // all_amount: shorter.all_amount,
            });
            // 已选分项默认值
            initSubItem(res.data?.info?.subitem_list);
            setPdfUrl(shorter.attachment);
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
    setIsLoading(true)
    let data: any = {
      xd_at: values.xd_at ? moment(values.xd_at).format('YYYY-MM-DD') : '',
      fund_number: values.fund_number,
      // fund_type: values.fund_type,
      year: values.year,
      project_name: values.project_name,
      project_type: values.project_type,
      qz_amount: values.qz_amount ? values.qz_amount : 0,
      js_amount: values.js_amount ? values.js_amount : 0,
      zj_amount: values.zj_amount ? values.zj_amount : 0,
      zy_amount: values.zy_amount ? values.zy_amount : 0,
      attachment:
        values.attachment && values.attachment.length
          ? values.attachment.map((ele: any) => {
              return {
                url: ele.url,
                name: ele.name,
              };
            })
          : [],
      // all_amount: values.all_amount,
    };
    if (id) {
      data.id = id;
    }
    let subItems = fundSubItemRef.current.getDataSource() || [];
    data.subitem_list = subItems.map((v: any) => {
      return { subitem_id: v.id, amount: v.amount };
    });
    // return console.log(data);
    
    Apis.projectFundSourceAction(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          setIsLoading(false)
          history.goBack();
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      }).finally(() => {
        setIsLoading(false)
      });
  };
  const getPdfData = (arr: any) => {
    setPdfUrl(arr);
    if (arr.length) {
      form.setFieldsValue({
        attachment: arr,
      });
    } else {
      form.setFieldsValue({
        attachment: '',
      });
    }
  };
  const recalc = () => {
    let item1 = form.getFieldValue('qz_amount');
    let item2 = form.getFieldValue('js_amount');
    let item3 = form.getFieldValue('zj_amount');
    let item4 = form.getFieldValue('zy_amount');
    let step1 = [item1, item2, item3, item4];
    let after = step1.filter((ele) => {
      return ele;
    });
    let final = calcFunction(after);
    let afterFormat = moneyFormat(final);
    // form.setFieldsValue({
    //   all_amount: afterFormat,
    // });
  };
  const calcFunction = (array: any) => {
    let temp = array.map((ele: any) => {
      return ele;
    });
    let res = temp.reduce((acc: any, current: any) => {
      return Number(acc) + Number(current);
    }, 0);
    return res;
  };
  const moneyFormat = (value: any) => {
    if (value || value == 0) {
      let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
      return fix;
    }
  };

  // 更新资金分项金额
  const sumSubItemAmount = () => {
    form.setFields([
      {
        name: 'sub_item_sum',
        value: fundSubItemRef.current.getSubItemAmount() || 0,
      },
    ]);
  };

  // 编辑时初始化已选分项数据
  const initSubItem = (data: any = []) => {
    const result = data.map((v: any) => {
      return {
        amount: v.amount,
        remain_amount: v.remain_amount,
        ...v.subitem_info,
      };
    });
    setOriginSubItem(result);
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
              label="文件名称"
              rules={[{ required: true, message: `请输入文件名称` }]}
            >
              <Input placeholder="请输入文件名称" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="fund_number"
              label="资金文号"
              rules={[{ required: true, message: `请输入资金文号` }]}
            >
              <Input placeholder="请输入资金文号" allowClear />
            </Form.Item>
          </Col>
          {/* <Col span={8}>
            <Form.Item
              name="fund_type"
              label="资金性质"
              rules={[{ required: true, message: `请选择资金性质` }]}
            >
              <Select
                className={styles.marginRight}
                placeholder="请选择"
                allowClear
              >
                {fund_typeArray.map((ele) => (
                  <Option value={ele.value} key={ele.value}>
                    {ele.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col> */}
          <Col span={8}>
            <Form.Item
              name="project_type"
              label="资金性质"
              rules={[{ required: true, message: `请选择资金性质` }]}
            >
              <Select
                className={styles.marginRight}
                placeholder="请选择"
                allowClear
              >
                {project_typeArray.map((ele) => (
                  <Option value={ele.value} key={ele.value}>
                    {ele.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          {/* <Col span={8}>
            <Form.Item
              name="project_type"
              label="资金类型"
              rules={[{ required: true, message: `请选择资金类型` }]}
            >
              <Select
                className={styles.marginRight}
                placeholder="请选择"
                allowClear
              >
                {project_typeArray.map((ele) => (
                  <Option value={ele.value} key={ele.value}>
                    {ele.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col> */}
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
          <Col span={8}>
            <Form.Item name="xd_at" label="下达时间">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        {/* <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="all_amount" label="资金总额(万元)">
              <InputNumber
                max={9999999999}
                min={0}
                style={{ width: '100%' }}
                precision={2}
                placeholder="资金总额"
              ></InputNumber>
            </Form.Item>
          </Col>
        </Row> */}
        <Divider />
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="sub_item_sum" label="分项总金额(万元)">
              <Input
                placeholder="根据分项金额自动计算"
                type="number"
                disabled
              />
            </Form.Item>
          </Col>
        </Row>

        <FundSubItem
          ref={fundSubItemRef}
          originSubItem={originSubItem}
          sumSubItemAmount={sumSubItemAmount}
        />

        <Form.Item
          name="attachment"
          label="政策附件"
          wrapperCol={{ span: 8 }}
          // rules={[{ required: true, message: `请上传政策附件` }]}
        >
          <div>
            <PdfUpload values={pdfUrl} getPdfData={getPdfData} />
          </div>
        </Form.Item>
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
