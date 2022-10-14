import styles from './index.less';
import Apis from '@/utils/apis';
import React, { useEffect, useState, useMemo } from 'react';
import {
  message,
  Row,
  Col,
  Button,
  Form,
  Spin,
  Input,
  Modal,
  InputNumber,
  Table,
} from 'antd';
import moment from 'moment';
import ImgsViewer from 'react-images-viewer';
import MediaUploader from '@/components/form/MediaUploader';
import { filterAttachment } from '@/utils/common';

const { TextArea } = Input;

export default function ApprovalForm(props: any) {
  const { detail, fetchDetail, fetchRecord, noticeTrigger } = props;
  const [current, setCurrent] = useState<any>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [formRef] = Form.useForm();
  const [form] = Form.useForm();
  const [auditMatch, setAuditMatch] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [docmentSubItem, setDocmentSubItem] = useState<any>([]); // 政策文件已选分项

  const handleApprovalData = (data: any) => {
    if (data.status == 0) {
      setCurrent('');
    } else if (data.status > 0 && data.status < 20) {
      setCurrent(1);
    } else if (data.status >= 20 && data.status < 30) {
      setCurrent(2);
    } else if (data.status >= 30 && data.status < 40) {
      setCurrent(3);
    } else if (data.status >= 40 && data.status < 45) {
      setCurrent(4);
    } else if (data.status >= 45) {
      setCurrent(5);
    }
  };
  const initSubItem = (data: any = [], replaceAmount?: any) => {
    const result = data.map((v: any, index: any) => {
      return {
        ...v,
        id: v.rel_subitem_id,
        index: index + 1,
      };
    });
    setDocmentSubItem(result);
  };
  useEffect(() => {
    setAuditMatch(false);
    let currentUser = sessionStorage.getItem('currentInfo')
      ? JSON.parse(sessionStorage.getItem('currentInfo'))
      : '';
    if (currentUser) {
      let shorterName = currentUser.admin_info.username;
      if (detail.project_id) {
        if (current == 1) {
          if (detail.audit_admin_info.username == shorterName) {
            setAuditMatch(true);
          }
        } else if (current == 2) {
          if (detail.review_admin_info.username == shorterName) {
            setAuditMatch(true);
          }
        } else if (current == 3) {
          if (detail.unit_admin_info.username == shorterName) {
            setAuditMatch(true);
          }
        } else if (current == 4) {
          if (detail.pass_admin_info.username == shorterName) {
            setAuditMatch(true);
            Apis.fetchPolicyDocumentInfo({ id: detail.policy_document_id })
              .then((res: any) => {
                if (res && res.code == 0) {
                  initSubItem(
                    res.data.project_capital_source_rel_subitem_list
                      .project_capital_source_rel_subitem_list,
                  );
                }
              })
              .catch((err) => {
                console.log('err', err);
              });
          }
        } else if (current == 5) {
          // console.log(detail.audit_admin_info);
        }
      }
    }
  }, [current]);

  const checkAuthInfo = (detail) => {
    setAuditMatch(false);
    let currentUser = sessionStorage.getItem('currentInfo')
      ? JSON.parse(sessionStorage.getItem('currentInfo'))
      : '';
    if (currentUser) {
      let shorterName = currentUser.admin_info.username;
      if (current == 1) {
        if (detail.audit_admin_info.username == shorterName) {
          setAuditMatch(true);
        }
      } else if (current == 2) {
        if (detail.review_admin_info.username == shorterName) {
          setAuditMatch(true);
        }
      } else if (current == 3) {
        if (detail.unit_admin_info.username == shorterName) {
          setAuditMatch(true);
        }
      } else if (current == 4) {
        if (detail.pass_admin_info.username == shorterName) {
          setAuditMatch(true);
        }
      } else if (current == 5) {
        // console.log(detail.audit_admin_info);
      }
    }
  };
  useMemo(() => {
    if (detail?.project_id) {
      handleApprovalData(detail);
      checkAuthInfo(detail);
    }
  }, [detail]);
  // 通过操作
  const onFinish = (values: any) => {
    const params = {
      project_id: detail.project_id,
      project_position: detail.status > 0 ? +current : '',
      audit_action_type: 1,
      reply_content: values.reply_content,
      attachment: values.attachment,
      order_amount: values.order_amount,
    };
    if (detail.status == 40) {
      if (docmentSubItem && docmentSubItem.length == 1) {
        let isEmpty = docmentSubItem.filter((ele: any) => {
          return ele.actual_amount == undefined;
        });
        if (isEmpty && isEmpty.length) {
          message.error('请填写下达金额');
        } else {
          let newArray = docmentSubItem.map((ele) => {
            return {
              rel_subitem_id: ele.rel_subitem_id,
              amount: ele.actual_amount,
            };
          });
          // console.log('newArray', newArray);
          params.rel_subitem_list = newArray;
          submitApproval(params);
        }
      } else {
        let newArray = docmentSubItem.map((ele) => {
          return {
            rel_subitem_id: ele.rel_subitem_id,
            amount: ele.actual_amount || 0,
          };
        });
        // console.log('newArray', newArray);
        params.rel_subitem_list = newArray;
        submitApproval(params);
      }
    } else {
      // console.log('params', params);
      submitApproval(params);
    }
  };
  const watchUploading = (val: any) => {
    setButtonDisable(val);
  };
  // 驳回操作
  const reject = () => {
    formRef.validateFields().then((values: any) => {
      const params = {
        project_id: detail.project_id,
        project_position: detail.status > 0 ? +current : '',
        audit_action_type: 9,
        reply_content: values.reply_content,
        attachment: values.attachment,
        order_amount: values.order_amount,
      };
      if (detail.status == 40) {    
        if (docmentSubItem && docmentSubItem.length == 1) {
          let isEmpty = docmentSubItem.filter((ele: any) => {
            return ele.actual_amount == undefined;
          });
          if (isEmpty && isEmpty.length) {
            message.error('请填写下达金额');
          } else {
            let newArray = docmentSubItem.map((ele) => {
              return {
                rel_subitem_id: ele.rel_subitem_id,
                amount: ele.actual_amount,
              };
            });
            // console.log('newArray', newArray);
            params.rel_subitem_list = newArray;
            submitApproval(params);
          }
        } else {
          let newArray = docmentSubItem.map((ele) => {
            return {
              rel_subitem_id: ele.rel_subitem_id,
              amount: ele.actual_amount || 0,
            };
          });
          // console.log('newArray', newArray);
          params.rel_subitem_list = newArray;
          submitApproval(params);
        }
      } else {
        // console.log('params', params);
        submitApproval(params);
      }
      // return console.log('拒绝传参', params);
      // submitApproval(params);
    });
  };

  // 审核操作提交
  const submitApproval = (params: any) => {
    setIsLoading(true);
    // console.log('params', params);
    Apis.actionProject(params)
      .then((res: any) => {
        if (res && res.code === 0) {
          message.success('操作成功');
          fetchDetail();
          fetchRecord();
          formRef.resetFields();
        } else {
          setIsLoading(false);
          message.error(res.msg);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log('er', err);
      });
  };
  const onAmountChange = (e: any, record: any) => {
    const newData = [...docmentSubItem];
    const index = newData.findIndex((item) => record.id === item.id);
    const item = newData[index];
    item.actual_amount = e;
    newData.splice(index, 1, {
      ...item,
    });
    setDocmentSubItem(newData);
  };
  const columns: any = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      width: 60,
      render: (text: any, record: any, index: number) => `${index + 1}`,
    },
    {
      title: '文件名称',
      dataIndex: 'fund_source_info',
      align: 'center',
      render: (_: any, value: any) => (
        <div>
          {value.project_fund_source_info &&
          value.project_fund_source_info.project_name
            ? value.project_fund_source_info.project_name
            : '-'}
        </div>
      ),
    },
    {
      title: '分项名称',
      dataIndex: 'subitem_info',
      align: 'center',
      render: (_: any, value: any) => (
        <div>
          {value.fund_subitem_info && value.fund_subitem_info.subitem_name
            ? value.fund_subitem_info.subitem_name
            : '-'}
        </div>
      ),
    },
    {
      title: '资金金额（万元）',
      dataIndex: 'amount',
      align: 'center',
    },
    {
      title: '剩余可兑现金额（万元）',
      dataIndex: 'remain_amount',
      align: 'center',
    },
    {
      title: '下达金额（万元）',
      dataIndex: 'actual_amount',
      align: 'center',
      render: (value: any, record: any) => (
        <div className={styles.flexHere}>
          {docmentSubItem && docmentSubItem.length == 1 ? (
            <span className={styles.fakeRequired}></span>
          ) : null}
          <InputNumber
            max={+record.remain_amount}
            precision={2}
            style={{ width: '100%' }}
            value={value}
            controls={false}
            placeholder={`剩余金额${record.remain_amount}万`}
            onChange={(e: any) => onAmountChange(e, record)}
          ></InputNumber>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className={styles.approvalForm}>
        {auditMatch && detail?.status > 0 && detail?.status < 45 && (
          <Form
            form={formRef}
            name="nest-messages"
            labelAlign={'left'}
            onFinish={(values) => onFinish(values)}
          >
            <Form.Item
              name="reply_content"
              label="审核意见"
              rules={[{ required: true, message: '请填写审核意见' }]}
            >
              <TextArea rows={4} placeholder="请输入审核意见" />
            </Form.Item>
            {detail?.status == 40 && (
              <div className={styles.tableCon}>
                <Table
                  columns={columns}
                  dataSource={docmentSubItem}
                  pagination={false}
                  rowKey="id"
                />
              </div>
              // <Form.Item label="下达金额(万元)" name="order_amount" required>
              //   <InputNumber
              //     max={9999999999}
              //     style={{
              //       width: '200px',
              //     }}
              //     precision={2}
              //     placeholder="请输入下达金额（万元）"
              //   />
              // </Form.Item>
            )}
            {/* {detail?.status == 40 && (
              <Form.Item label="下达文件" name="attachment">
                <MediaUploader watchUploading={watchUploading} max={5} />
              </Form.Item>
            )} */}
            <Row className={styles.btnsFlex}>
              <Button type="primary" htmlType="submit" disabled={buttonDisable}>
                {detail?.status < 45 ? '通过' : '提交'}
              </Button>
              {detail?.status < 45 && (
                <Button
                  disabled={buttonDisable}
                  className={styles.marginLeft20}
                  onClick={() => reject()}
                >
                  不通过
                </Button>
              )}
            </Row>
          </Form>
        )}
      </div>
    </div>
  );
}
