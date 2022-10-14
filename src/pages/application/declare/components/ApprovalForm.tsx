import styles from './index.less';
import Apis from '@/utils/apis';
import React, { useEffect, useState, useMemo } from 'react';
import {
  message,
  Steps,
  Space,
  Row,
  Col,
  Button,
  Form,
  Spin,
  Input,
  Modal,
  InputNumber,
} from 'antd';
import moment from 'moment';
import ImgsViewer from 'react-images-viewer';
import MediaUploader from '@/components/form/MediaUploader';
import { filterAttachment } from '@/utils/common';
const { Step } = Steps;
const { TextArea } = Input;

export default function ApprovalForm(props: any) {
  const { detail, fetchDetail, fetchRecord, noticeTrigger } = props;
  const [current, setCurrent] = useState<any>(1);
  const [approvalData, setApprovalData] = useState<any>([]);
  const [viewerArray, setViewerArray] = useState([]);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currImg, setCurrImg] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [formRef] = Form.useForm();
  const [form] = Form.useForm();
  const [auditMatch, setAuditMatch] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);

  // 处理各个节点审核数据
  const handleApprovalData = (data: any) => {
    let approvalData = [];
    approvalData[0] = {
      title: '材料提交',
      time: data.status > 0 ? data.start_declare_at : '',
      operator: '',
      // attachment: filterAttachment(['jpeg', 'jpg', 'png'], data.attachment),
      // attachment_doc: filterAttachment(['doc', 'docx', 'pdf'], data.attachment),
    };
    approvalData[1] = {
      title: '材料审核',
      time: data.status >= 10 ? data.start_review_at : '',
      operator: data?.audit_admin_info?.real_name,
      // replay_content: data?.reply_content,
      action: data?.status == 10 ? '审核中' : data?.status > 10 ? '通过' : '',
      // attachment: filterAttachment(['jpeg', 'jpg', 'png'], data.attachment),
      // attachment_doc: filterAttachment(['doc', 'docx', 'pdf'], data.attachment),
    };
    approvalData[2] = {
      title: '评审',
      time: data.status >= 20 ? data.start_unit_at : '',
      operator: data?.review_admin_info?.real_name,
      // replay_content: data?.reply_content,
      action: data?.status == 20 ? '审核中' : data?.status > 20 ? '通过' : '',
      // attachment: filterAttachment(['jpeg', 'jpg', 'png'], data.attachment),
      // attachment_doc: filterAttachment(['doc', 'docx', 'pdf'], data.attachment),
    };
    approvalData[3] = {
      title: '联审',
      time: data.status >= 30 ? data.pass_at : '',
      operator: data?.unit_admin_info?.real_name,
      // replay_content: data?.reply_content,
      action: data?.status == 30 ? '审核中' : data?.status > 30 ? '通过' : '',
      // attachment: filterAttachment(['jpeg', 'jpg', 'png'], data.attachment),
      // attachment_doc: filterAttachment(['doc', 'docx', 'pdf'], data.attachment),
    };
    approvalData[4] = {
      title: '公示',
      time: data.status >= 40 ? data.file_issued_at : '',
      operator: data?.pass_admin_info?.real_name,
      // replay_content: data?.reply_content,
      action: data?.status == 40 ? '审核中' : data?.status > 40 ? '通过' : '',
      attachment: filterAttachment(
        ['jpeg', 'jpg', 'png'],
        data.file_issued_attachment,
      ),
      attachment_doc: filterAttachment([], data.file_issued_attachment),
      order_amount: detail.order_amount,
    };
    approvalData[5] = {
      title: '文件下达',
      // time: data.status > 45 ? data.file_issued_attachment_at : '',
      // operator: data?.file_issued_attachment_adminer_info?.real_name, // TODO
      // replay_content: data?.reply_content,
    };
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
    setIsLoading(false);
    setApprovalData(approvalData);
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
    // console.log('detail', detail);
    if (detail?.project_id) {
      handleApprovalData(detail);
      checkAuthInfo(detail);
    }
  }, [detail]);

  const previewImages = (attachment: any = []) => {
    setViewerArray(
      attachment.map((v: any) => {
        return { src: v.url, name: v.name };
      }),
    );
    setViewerIsOpen(true);
  };

  const clickThumbnail = (item: any) => {
    setCurrImg(item);
  };

  const gotoPrevious = () => {
    setCurrImg(currImg - 1);
  };

  const gotoNext = () => {
    setCurrImg(currImg + 1);
  };

  // 节点
  const stepInfo = (data?: any) => {
    return (
      <div className={styles.stepInfo}>
        <Space direction="vertical" align="start">
          {data.action && (
            <Row>
              <Col span={6}>操作：</Col>
              <Col span={18}>{data.action}</Col>
            </Row>
          )}
          {data.operator && (
            <Row>
              <Col span={6}>操作人：</Col>
              <Col span={18}>{data.operator}</Col>
            </Row>
          )}
          {data.order_amount && +data.order_amount ? (
            <Row>
              <Col span={6}>下达资金：</Col>
              <Col span={18}>{data.order_amount}万元</Col>
            </Row>
          ) : null}
          {data.attachment?.length > 0 && (
            <Row>
              <Col span={6}>图片附件：</Col>
              <Col span={18}>
                <span
                  style={{ color: '#1890ff', cursor: 'pointer' }}
                  onClick={() => previewImages(data.attachment)}
                >
                  查看附件
                </span>
              </Col>
            </Row>
          )}
          {data.attachment_doc?.length > 0 && (
            <Row>
              <Col span={6}>文件附件：</Col>
              <Col span={18}>
                <div className={styles.flexWrapCon}>
                  {data.attachment_doc.map((item: any, i: number) => (
                    <a
                      key={i}
                      href={item.url}
                      target="_blank"
                      className={styles.docLink}
                    >{`${item.name}`}</a>
                  ))}
                </div>
              </Col>
            </Row>
          )}
          <Row>
            <Col span={24}>{data.time}</Col>
          </Row>
        </Space>
      </div>
    );
  };

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
      if (values.order_amount) {
        submitApproval(params);
      } else {
        message.error('请填写下达金额');
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
      // return console.log('拒绝传参', params);
      submitApproval(params);
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
  return (
    <Spin spinning={isLoading} tip="请稍候...">
      <div className={styles.approvalForm}>
        <Steps progressDot current={current} direction="vertical">
          {approvalData &&
            approvalData.length > 1 &&
            approvalData.map((item: any, i: number) => (
              <Step title={item.title} description={stepInfo(item)} key={i} />
            ))}
        </Steps>
        <ImgsViewer
          imgs={viewerArray}
          onClickThumbnail={clickThumbnail}
          showThumbnails={true}
          currImg={currImg}
          isOpen={viewerIsOpen}
          onClickPrev={gotoPrevious}
          onClickNext={gotoNext}
          onClose={() => setViewerIsOpen(false)}
        />
      </div>
    </Spin>
  );
}
