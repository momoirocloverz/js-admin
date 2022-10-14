import styles from './detail.less';
import Apis from '@/utils/apis';
import { connect } from 'umi';
import React, { useEffect, useState } from 'react';
import { HARMLESS_MAP as approvalMap } from '@/pages/application/const';
import FileList from '@/components/form/FileList';
import SectionHeader from '@/components/form/SectionHeader';
import {
  message,
  Button,
  Input,
  InputNumber,
  Select,
  Form,
  Row,
  Col,
  Tabs,
  Table,
} from 'antd';
import { getSubItemByDocumentId } from '@/api/fund';
import ImgsViewer from 'react-images-viewer';
const fileListCustomFieldNames = {
  fileName: 'origin_name',
  extension: 'suffix',
};
import MediaUploader from '@/components/form/MediaUploader';
const { TextArea } = Input;
const { Option } = Select;
const PolicyDocumentPage = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [currentStatus, setCurrentStatus] = useState('');
  const [currentDetail, setCurrentDetail] = useState({});
  const [townList, setTownList] = useState([]);
  const [activeKey, setActiveKey] = useState(1);
  const [areaList, setAreaList] = useState([]);
  const [stepActiveDeclare, setStepActiveDeclare] = useState(0);
  const [stepArrayDeclare, setStepArrayDeclare] = useState([]);
  const [positionDeclare, setPositionDeclare] = useState(0);
  const [stepArrayApply, setStepArrayApply] = useState([]);
  const [stepActiveApply, setStepActiveApply] = useState(0);
  const [positionApply, setPositionApply] = useState(0);
  const [viewerArray, setViewerArray] = useState([]);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currImg, setCurrImg] = useState(0);
  const [operateAble, setOperateAble] = useState(false);
  const [collect_list, setCollect_list] = useState([]);
  const [apply_collect_list, setApplyCollectList] = useState([]);
  const [approvalRecord, setApprovalRecord] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [typeForm, setTypeForm] = useState(21);
  const [littleForm] = Form.useForm();
  const [subItems, setSubItems] = useState([]);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [auditMatch, setAuditMatch] = useState(false);
  const [auditSecMatch, setAuditSecMatch] = useState(false);

  const typeMap = {
    1: '猪',
    2: '牛',
    3: '羊',
    4: '家禽',
    5: '死胎',
    6: '胎衣',
    7: '其他',
  };
  const initAction = () => {
    commitGlobalBread([
      {
        title: '惠农补贴管理',
        triggerOn: true,
      },
      {
        title: '病死动物无害化处理审核详情',
      },
    ]);
  };

  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };

  const process = (shorter: any) => {
    var initArray = [
      {
        title: '材料递交',
        time: '',
        advice: '',
        files: '',
        type: '',
        operator: '',
      },
      {
        title: '养殖中心人员审核',
        time: '',
        advice: '',
        files: '',
        type: '',
        operator: '',
      },
      {
        title: '公示',
        time: '',
        advice: '',
        files: '',
        type: '',
        operator: '',
      },
    ];
    setOperateAble(false);
    let after = JSON.parse(JSON.stringify(initArray));

    switch (shorter.status) {
      case 0:
        setStepActiveDeclare(0);
        setPositionDeclare(1);
        after[0] = {
          title: '材料递交',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        setStepArrayDeclare(after);
        break;
      case 1:
        setStepActiveDeclare(0);
        setPositionDeclare(1);
        after[0] = {
          title: '材料递交',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        setStepArrayDeclare(after);
        break;
      case 11:
        setStepActiveDeclare(1);
        setPositionDeclare(1);
        after[0] = {
          title: '材料递交',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        after[1] = {
          title: '养殖中心人员审核',
          time: shorter.whh_farm_at,
          advice: shorter.whh_farm_reason,
          files: shorter.whh_farm_attachment,
          type: '审核中',
          operator:
            shorter.admin_info &&
            shorter.admin_info.whh_farm_admin_info &&
            shorter.admin_info.whh_farm_admin_info.real_name,
        };
        setStepArrayDeclare(after);
        break;
      case 12:
        setPositionDeclare(1);
        setStepArrayDeclare(after);
        break;
      case 19:
        setPositionDeclare(1);
        setStepArrayDeclare(after);
        break;
      case 21:
        setStepActiveDeclare(2);
        setPositionDeclare(2);
        after[0] = {
          title: '材料递交',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        after[1] = {
          title: '养殖中心人员审核',
          time: shorter.whh_farm_at,
          advice: shorter.whh_farm_reason,
          files: shorter.whh_farm_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.whh_farm_admin_info &&
            shorter.admin_info.whh_farm_admin_info.real_name,
        };
        after[2] = {
          title: '公示',
          time: shorter.whh_public_at,
          advice: shorter.whh_public_reason,
          files: shorter.whh_public_attachment,
          type: '公示中',
          operator:
            shorter.admin_info &&
            shorter.admin_info.whh_public_admin_info &&
            shorter.admin_info.whh_public_admin_info.real_name,
        };
        setStepArrayDeclare(after);
        break;
      case 22:
        setPositionDeclare(2);
        after[0] = {
          title: '材料递交',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        after[1] = {
          title: '养殖中心人员审核',
          time: shorter.whh_farm_at,
          advice: shorter.whh_farm_reason,
          files: shorter.whh_farm_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.whh_farm_admin_info &&
            shorter.admin_info.whh_farm_admin_info.real_name,
        };
        after[2] = {
          title: '公示',
          time: shorter.whh_public_at,
          advice: shorter.whh_public_reason,
          files: shorter.whh_public_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.whh_public_admin_info &&
            shorter.admin_info.whh_public_admin_info.real_name,
        };
        setStepArrayDeclare(after);
        break;
      case 29:
        setPositionDeclare(2);
        after[0] = {
          title: '材料递交',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        after[1] = {
          title: '养殖中心人员审核',
          time: shorter.whh_farm_at,
          advice: shorter.whh_farm_reason,
          files: shorter.whh_farm_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_handle_admin_info &&
            shorter.admin_info.village_handle_admin_info.real_name,
        };
        after[2] = {
          title: '公示',
          time: shorter.whh_public_at,
          advice: shorter.whh_public_reason,
          files: shorter.whh_public_attachment,
          type: '不通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_handle_admin_info &&
            shorter.admin_info.village_handle_admin_info.real_name,
        };
        setStepArrayDeclare(after);
        break;
      case 30:
        setStepActiveDeclare(2);
        setPositionDeclare(2);
        after[0] = {
          title: '材料递交',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        after[1] = {
          title: '养殖中心人员审核',
          time: shorter.whh_farm_at,
          advice: shorter.whh_farm_reason,
          files: shorter.whh_farm_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.whh_farm_admin_info &&
            shorter.admin_info.whh_farm_admin_info.real_name,
        };
        after[2] = {
          title: '公示',
          time: shorter.whh_public_at,
          advice: shorter.whh_public_reason,
          files: shorter.whh_public_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.whh_public_admin_info &&
            shorter.admin_info.whh_public_admin_info.real_name,
        };
        setStepArrayDeclare(after);
        break;
      default:
        if (shorter.status == 42) {
          setOperateAble(true);
        }
        if (shorter.status == 49) {
          setOperateAble(true);
        }
        setStepActiveDeclare(2);
        setPositionDeclare(2);
        after[0] = {
          title: '材料递交',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        after[1] = {
          title: '养殖中心人员审核',
          time: shorter.whh_farm_at,
          advice: shorter.whh_farm_reason,
          files: shorter.whh_farm_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.whh_farm_admin_info &&
            shorter.admin_info.whh_farm_admin_info.real_name,
        };
        after[2] = {
          title: '公示',
          time: shorter.whh_public_at,
          advice: shorter.whh_public_reason,
          files: shorter.whh_public_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.whh_public_admin_info &&
            shorter.admin_info.whh_public_admin_info.real_name,
        };
        setStepArrayDeclare(after);
        break;
    }
  };

  const processApply = (shorter: any) => {
    var initArray = [
      {
        title: '材料递交',
        time: '',
        advice: '',
        files: '',
        type: '',
        operator: '',
      },
      {
        title: '养殖中心人员审核',
        time: '',
        advice: '',
        files: '',
        type: '',
        operator: '',
      },
      {
        title: '公示',
        time: '',
        advice: '',
        files: '',
        type: '',
        operator: '',
      },
    ];
    setOperateAble(false);
    let after = JSON.parse(JSON.stringify(initArray));
    switch (shorter.status) {
      case 31:
        setStepActiveApply(1);
        setPositionApply(3);
        after[0] = {
          title: '材料递交',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        after[1] = {
          title: '养殖中心人员审核',
          time: '',
          advice: '',
          files: '',
          type: '审核中',
          operator:
            shorter.admin_info &&
            shorter.admin_info.whh_sq_farm_admin_info &&
            shorter.admin_info.whh_sq_farm_admin_info.real_name,
        };
        setStepArrayApply(after);
        break;
      case 32:
        setPositionApply(3);
        setStepArrayApply(after);
        break;
      case 33:
        setStepActiveApply(0);
        setPositionApply(3);
        after[0] = {
          title: '材料递交',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        setStepArrayApply(after);
        break;
      case 39:
        setPositionApply(3);
        setStepArrayDeclare(after);
        break;
      case 41:
        setStepActiveApply(2);
        setPositionApply(4);
        after[0] = {
          title: '材料递交',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        after[1] = {
          title: '养殖中心人员审核',
          time: shorter.whh_sq_farm_at,
          advice: shorter.whh_sq_farm_reason,
          files: shorter.whh_sq_farm_attachment,
          type: '审核中',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_handle_admin_info &&
            shorter.admin_info.village_handle_admin_info.real_name,
        };
        after[2] = {
          title: '公示',
          time: shorter.whh_sq_public_at,
          advice: shorter.whh_sq_public_reason,
          files: shorter.whh_sq_public_attachment,
          type: '公示中',
          operator:
            shorter.admin_info &&
            shorter.admin_info.whh_sq_public_admin_info &&
            shorter.admin_info.whh_sq_public_admin_info.real_name,
        };
        setStepArrayApply(after);
        break;
      case 42:
        setStepActiveApply(3);
        setPositionApply(4);
        setOperateAble(true);
        after[0] = {
          title: '材料递交',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        after[1] = {
          title: '养殖中心人员审核',
          time: shorter.whh_sq_farm_at,
          advice: shorter.whh_sq_farm_reason,
          files: shorter.whh_sq_farm_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_handle_admin_info &&
            shorter.admin_info.village_handle_admin_info.real_name,
        };
        after[2] = {
          title: '公示',
          time: shorter.whh_sq_public_at,
          advice: shorter.whh_sq_public_reason,
          files: shorter.whh_sq_public_attachment,
          type: shorter.real_fund_amount
            ? '资金拨付' + shorter.real_fund_amount + '万元'
            : '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.whh_sq_public_admin_info &&
            shorter.admin_info.whh_sq_public_admin_info.real_name,
        };
        setStepArrayApply(after);
        break;
      case 49:
        setOperateAble(true);
        setPositionApply(4);
        setStepArrayApply(after);
        break;
    }
  };
  const checkAudit = (val: any) => {
    setAuditMatch(false);
    setAuditSecMatch(false);
    let currentUser = sessionStorage.getItem('currentInfo')
      ? JSON.parse(sessionStorage.getItem('currentInfo'))
      : '';
    if (currentUser) {
      let roleType = currentUser.admin_info.role_type;
      let userId = currentUser.admin_info.id;
      let data = {
        id: val.policy_document_id,
      };
      Apis.fetchPolicyDocumentInfo(data)
        .then((res: any) => {
          if (res && res.code === 0) {
            switch (val.status) {
              case 11:
                if (res.data.whh_farm_admin_id == userId) {
                  setAuditMatch(true);
                }
                break;
              case 21:
                if (res.data.whh_public_admin_id == userId) {
                  setAuditMatch(true);
                }
                break;
              case 31:
                if (res.data.whh_farm_admin_id == userId) {
                  setAuditSecMatch(true);
                }
                break;
              case 41:
                if (res.data.whh_fund_admin_id == userId) {
                  setAuditSecMatch(true);
                }
                break;
            }
          } else {
            message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(' err ', err);
        });
    }
  };
  const watchUploading = (val: any) => {
    setButtonDisable(val);
  };
  const initRequest = () => {
    if (location.query.id) {
      let data = {
        id: location.query.id,
      };
      Apis.fetchProjectSubDetail(data)
        .then((res: any) => {
          if (res && res.code === 0) {
            let shorter = res.data.info;
            let subInfo = shorter.sub_info;
            setCurrentDetail(shorter);
            checkAudit(shorter);
            form.setFieldsValue({
              ...subInfo,
              is_insurance_text: subInfo.is_insurance == 1 ? '是' : '否',
              date_range: `${subInfo.start_section || ''}-${
                subInfo.end_section || ''
              }`,
            });
            setCurrentStatus(shorter.status);
            setTimeout(() => {
              if (shorter.status > 30) {
                processApply(shorter);
              }
              process(shorter);
            }, 100);
            if (shorter?.status == 41) {
              // 资金拨付审核中 获取分项
              getSubItemList({
                policy_document_id: shorter.policy_document_id,
              });
            }
            setCollect_list(subInfo.collect_list);
            if (shorter.status > 30) {
              // 申请tab页表格数据
              setApplyCollectList(subInfo.apply_collect_list);
            }
            setTypeForm(shorter.form_type);
            littleForm.resetFields();
            Apis.fetchAreaList({})
              .then((res: any) => {
                if (res && res.code === 0) {
                  setTownList(res.data.list);
                  let track1 = res.data.list[0].children.find((ele) => {
                    return ele.id == shorter.town_id;
                  });
                  if (track1) {
                    let track2 = track1.children.find((ele) => {
                      return ele.id == shorter.village_id;
                    });
                    setAreaList([{ name: '江山市' }, track1, track2]);
                  }
                } else {
                  message.error(res.msg);
                }
              })
              .catch((err) => {
                console.log('err', err);
              });
          } else {
            message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(' err ', err);
        });
    }
  };

  const getSubItemList = async (params: {
    policy_document_id: string | number;
  }) => {
    const result = await getSubItemByDocumentId(params);
    const list = result.data.list || [];
    setSubItems(
      list.map((v: any) => {
        return {
          value: v.rel_subitem_id,
          label: `${v.fund_subitem_info.subitem_name}(剩余${v.remain_amount}万)`,
        };
      }),
    );
  };

  useEffect(() => {
    initAction();
    initRequest();
    getApprovalRecord();
  }, []);

  const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 8 },
    },
  };

  // type: 1-申报 2-申请
  const submitAction = (type) => {
    if (currentStatus == 0) {
      return message.error('申报未提交，不可审核');
    }
    if (currentStatus >= 30 && activeKey == 1) {
      return message.error('项目申报已通过，请勿重复操作');
    }
    if (currentStatus == 30 || currentStatus == 33) {
      return message.error('申请未提交，不可审核');
    }
    littleForm
      .validateFields()
      .then((res) => {
        if (currentStatus >= 30 && activeKey == 1) {
          return message.error('项目申报已通过，请勿重复操作');
        }
        let data = {
          id: location.query.id,
          project_position:
            currentStatus > 30 ? positionApply : positionDeclare,
          audit_action_type: 9,
          reply_content: res.reply_content,
          attachment:
            res.attachment && res.attachment.length
              ? res.attachment.map((ele) => {
                  return ele.url;
                })
              : [],
        };
        // return console.log('不通过传参', data);
        Apis.projectSubAction(data)
          .then((res: any) => {
            if (res && res.code === 0) {
              message.success('提交成功');
              initRequest();
            } else {
              message.error(res.msg);
            }
          })
          .catch((err) => {
            console.log('err', err);
          });
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  const onFinish = (values: any) => {
    if (currentStatus == 0) {
      return message.error('申报未提交，不可审核');
    }
    if (currentStatus >= 30 && activeKey == 1) {
      return message.error('项目申报已通过，请勿重复操作');
    }
    if (currentStatus == 30 || currentStatus == 33) {
      return message.error('申请未提交，不可审核');
    }
    let simplePosition = currentStatus > 30 ? positionApply : positionDeclare;
    let data: any = {
      id: location.query.id,
      project_position: currentStatus > 30 ? positionApply : positionDeclare,
      audit_action_type: 1,
      reply_content: values.reply_content,
      attachment:
        values.attachment && values.attachment.length
          ? values.attachment.map((ele: any) => {
              return ele.url;
            })
          : [],
      // real_fund_amount:
      //   simplePosition == 4 ? values.real_fund_amount : undefined,
    };
    if (simplePosition == 4) {
      // 资金拨付
      const { amount, rel_subitem_id } = values;
      data.rel_subitem_list = [{ rel_subitem_id, amount }];
    }
    // return console.log('审核传参', data);
    Apis.projectSubAction(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          message.success('提交成功');
          initRequest();
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
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

  const closeViewer = () => {
    setViewerIsOpen(false);
  };

  const popImgPreview = (item: any) => {
    if (item.files == '[]' || !item.files.length) return;
    if (typeof item.files == 'string') {
      item.files = JSON.parse(item.files);
    }
    let newImgArray = item.files.map((ele: any) => {
      return {
        src: ele,
      };
    });
    setCurrImg(0);
    setViewerIsOpen(true);
    setViewerArray(newImgArray);
  };

  // 获取审核记录
  const getApprovalRecord = () => {
    Apis.fetchDeclarationRecordList({
      project_id: location.query.id,
      record_type: 10,
    })
      .then((res) => {
        setApprovalRecord(res.data.list);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let bottomContentVariable;
  if (typeForm == 25) {
    bottomContentVariable = (
      <>
        <div>
          <SectionHeader title="台账明细" />
          <FileList
            list={
              currentDetail.materials_list && currentDetail.materials_list[61]
                ? currentDetail.materials_list[61]
                : []
            }
            customFieldNames={fileListCustomFieldNames}
          />
        </div>
      </>
    );
  }

  let formContentDeclare;
  if (typeForm == 25) {
    formContentDeclare = (
      <>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="month" label="月份">
              <Input placeholder="月份" disabled style={{ width: 200 }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="duty_company" label="责任公司">
              <Input disabled placeholder="责任公司" style={{ width: 200 }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="link_mobile" label="联系电话">
              <Input disabled placeholder="联系电话" style={{ width: 200 }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="is_insurance_text" label="是否有保险">
              <Input disabled placeholder="是否有保险" style={{ width: 200 }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="地址">
              {areaList.map((ele, index) => (
                <span key={index}>{ele.name}</span>
              ))}
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  }
  let formContentApply = (
    <>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name="date_range" label="时间区间">
            <Input placeholder="时间区间" disabled style={{ width: 200 }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="apply_company" label="申请单位">
            <Input disabled placeholder="申请单位" style={{ width: 200 }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name="js_person" label="经手人">
            <Input disabled placeholder="经手人" style={{ width: 200 }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="js_person_mobile" label="经手人联系电话">
            <Input
              disabled
              placeholder="经手人联系电话"
              style={{ width: 200 }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name="link_principal" label="负责人">
            <Input disabled placeholder="负责人" style={{ width: 200 }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="link_principal_mobile" label="负责人联系电话">
            <Input
              disabled
              placeholder="负责人联系电话"
              style={{ width: 200 }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name="check_person" label="审核人">
            <Input disabled placeholder="审核人" style={{ width: 200 }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="check_person_mobile" label="审核人联系电话">
            <Input
              disabled
              placeholder="审核人联系电话"
              style={{ width: 200 }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label="地址">
            {areaList.map((ele, index) => (
              <span key={index}>{ele.name}</span>
            ))}
          </Form.Item>
        </Col>
      </Row>
    </>
  );

  // 申报表格表头
  const columnsDeclare = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text, record, index) => {
        return typeMap[text];
      },
    },
    {
      title: '数量',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '重量(kg)',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: '其中无保险数量',
      dataIndex: 'number_no_ins',
      key: 'number_no_ins',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
  ];

  // 申请表格表头
  const columnsApply = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text, record, index) => {
        return typeMap[text];
      },
    },
    {
      title: '数量',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '重量(kg)',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: '补贴标准',
      dataIndex: 'subsidy_standard',
      key: 'subsidy_standard',
    },
    {
      title: '补贴金额',
      dataIndex: 'subsidy_amount',
      key: 'subsidy_amount',
    },
    {
      title: '预拨付70%',
      dataIndex: 'pre_pay',
      key: 'pre_pay',
    },
  ];

  // 审核记录表头
  const columns = [
    {
      title: '操作类型',
      dataIndex: 'action_type',
      align: 'center',
      render: (text: any, record: any) => <div>{approvalMap[text].title}</div>,
    },
    {
      title: '操作人',
      dataIndex: 'action_username',
      align: 'center',
    },
    {
      title: '操作时间',
      dataIndex: 'updated_at',
      align: 'center',
    },
    {
      title: '意见',
      dataIndex: 'action_content',
      align: 'center',
    },
    {
      title: '附件',
      dataIndex: 'attachment',
      align: 'center',
      render: (text: any, record: any) => (
        <div onClick={() => showAttachment(text)}>
          {text && text.length && JSON.stringify(text) != '{}'
            ? '查看附件'
            : '-'}
        </div>
      ),
    },
  ];
  const simplePosition = currentStatus > 30 ? positionApply : positionDeclare;
  // 项目申报
  const declareComponent = () => {
    return (
      <div className={styles.homePageCon}>
        <div className={styles.leftCon}>
          <div className={styles.leftTopCon}>
            <div className={styles.subTitle}>基本信息</div>
            <Form
              {...formItemLayout}
              form={form}
              name="nest-messages"
              labelAlign={'left'}
              className={styles.formCon}
            >
              {formContentDeclare}
            </Form>
            <div className={styles.subTitle}>汇总清单</div>
            <Table
              bordered
              size="small"
              columns={columnsDeclare}
              dataSource={collect_list}
              pagination={false}
              rowKey={(item, index) => index}
            />
          </div>
          <div className={styles.leftBottomCon}>
            <div className={styles.subTitle}>材料查看</div>
            {bottomContentVariable}
          </div>

          <div className={styles.leftBottomCon}>
            <div className={styles.subTitle}>审核记录</div>
            <Table
              columns={columns}
              rowKey={(item) => item.id}
              dataSource={approvalRecord}
              pagination={false}
              loading={loading}
              scroll={{ y: 550 }}
              bordered
            />
          </div>
        </div>
        <div className={styles.rightCon}>
          {auditMatch ? (
            <div className={styles.littleForm}>
              <Form
                form={littleForm}
                name="nest-messages"
                labelAlign={'left'}
                onFinish={(values) => onFinish(values)}
              >
                <Form.Item
                  name="reply_content"
                  label="审核意见"
                  rules={[{ required: true, message: '审核意见不能为空' }]}
                >
                  <TextArea
                    rows={4}
                    placeholder="请输入审核意见"
                    disabled={operateAble}
                  />
                </Form.Item>
                <Form.Item
                  label="上传附件"
                  name="attachment"
                  rules={[{ required: true, message: '上传附件不能为空' }]}
                >
                  <MediaUploader
                    watchUploading={watchUploading}
                    max={5}
                    disabled={operateAble}
                  />
                </Form.Item>
                <div className={styles.btnsFlex}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={operateAble || buttonDisable}
                  >
                    通过
                  </Button>
                  <Button
                    className={styles.marginLeft20}
                    onClick={submitAction}
                    disabled={operateAble || buttonDisable}
                  >
                    不通过
                  </Button>
                </div>
              </Form>
            </div>
          ) : null}
          <div className={styles.stepCon}>
            {stepArrayDeclare.map((item, index) => (
              <div className={styles.stepItem} key={index}>
                <div className={styles.left}>
                  {index <= stepActiveDeclare ? (
                    <div className={styles.circle}></div>
                  ) : (
                    <div
                      className={`${styles.circle} ${styles.opacity3} `}
                    ></div>
                  )}

                  {index > stepActiveDeclare - 1 ? (
                    <div
                      className={`${styles.dashed} ${styles.opacity3} `}
                    ></div>
                  ) : (
                    <div className={styles.dashed}></div>
                  )}
                </div>
                <div className={styles.right}>
                  <p>{item.title}</p>
                  {item.operator ? <p>操作人:{item.operator}</p> : ''}
                  {item.type ? <p>操作:{item.type}</p> : ''}
                  {item.files && item.files.length ? (
                    <p>
                      附件:
                      {item.files != '[]' && item.files.length ? (
                        <span
                          className={styles.blue}
                          onClick={() => popImgPreview(item)}
                        >
                          {item.files == '[]' || !item.files.length
                            ? '无'
                            : '关联文件'}
                        </span>
                      ) : (
                        '无'
                      )}
                    </p>
                  ) : (
                    ''
                  )}
                  {item.advice ? <p>审核意见:{item.advice}</p> : ''}
                  <p>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ImgsViewer
          imgs={viewerArray}
          onClickThumbnail={clickThumbnail}
          showThumbnails={true}
          currImg={currImg}
          isOpen={viewerIsOpen}
          onClickPrev={gotoPrevious}
          onClickNext={gotoNext}
          onClose={closeViewer}
        />
      </div>
    );
  };
  // 申请
  const applyComponent = () => {
    return (
      <div className={styles.homePageCon}>
        <div className={styles.leftCon}>
          <div className={styles.leftTopCon}>
            <div className={styles.subTitle}>基本信息</div>
            <Form
              {...formItemLayout}
              form={form}
              name="nest-messages"
              labelAlign={'left'}
              className={styles.formCon}
            >
              {formContentApply}
            </Form>
            <div className={styles.subTitle}>汇总清单</div>
            <Table
              bordered
              size="small"
              columns={columnsApply}
              dataSource={apply_collect_list}
              pagination={false}
              rowKey={(item, index) => index}
            />
            <div className={styles.leftBottomCon}>
              <div className={styles.subTitle}>审核记录</div>
              <Table
                columns={columns}
                rowKey={(item) => item.id}
                dataSource={approvalRecord}
                pagination={false}
                loading={loading}
                scroll={{ y: 550 }}
                bordered
              />
            </div>
          </div>
        </div>
        <div className={styles.rightCon}>
          {auditSecMatch ? (
            <div className={styles.littleForm}>
              <Form
                form={littleForm}
                name="nest-messages"
                labelAlign={'left'}
                layout="vertical"
                onFinish={(values) => onFinish(values)}
              >
                {simplePosition == 4 ? (
                  <>
                    <Form.Item
                      label="资金来源分项"
                      name="rel_subitem_id"
                      className={styles.recontrol}
                      rules={[
                        { required: true, message: '请选择资金来源分项' },
                      ]}
                    >
                      <Select
                        placeholder="请选择资金来源分项"
                        onChange={onSubItemChange}
                      >
                        {subItems?.map((item: any) => (
                          <Option value={item.value} key={item.value}>
                            {item.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="实际资金拨付(万元)"
                      name="amount"
                      rules={[
                        { required: true, message: '实际资金拨付金额不能为空' },
                      ]}
                      className={styles.recontrol}
                    >
                      <InputNumber
                        max={9999999999}
                        disabled={operateAble}
                        className={styles.resetInput}
                        precision={2}
                        min={0}
                        placeholder="请输入实际资金拨付金额"
                      />
                    </Form.Item>

                    <div className={styles.btnsFlex}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={operateAble || buttonDisable}
                      >
                        完成资金拨付
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Form.Item name="reply_content" label="审核意见">
                      <TextArea
                        rows={4}
                        placeholder="请输入审核意见"
                        disabled={operateAble}
                      />
                    </Form.Item>
                    <Form.Item label="上传附件" name="attachment">
                      <MediaUploader
                        watchUploading={watchUploading}
                        max={5}
                        disabled={operateAble}
                      />
                    </Form.Item>
                    <div className={styles.btnsFlex}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={operateAble || buttonDisable}
                      >
                        通过
                      </Button>
                      <Button
                        className={styles.marginLeft20}
                        onClick={submitAction}
                        disabled={operateAble || buttonDisable}
                      >
                        不通过
                      </Button>
                    </div>
                  </>
                )}
              </Form>
            </div>
          ) : null}

          <div className={styles.stepCon}>
            {stepArrayApply.map((item, index) => (
              <div className={styles.stepItem} key={index}>
                <div className={styles.left}>
                  {index <= stepActiveApply ? (
                    <div className={styles.circle}></div>
                  ) : (
                    <div
                      className={`${styles.circle} ${styles.opacity3} `}
                    ></div>
                  )}

                  {index > stepActiveApply - 1 ? (
                    <div
                      className={`${styles.dashed} ${styles.opacity3} `}
                    ></div>
                  ) : (
                    <div className={styles.dashed}></div>
                  )}
                </div>
                <div className={styles.right}>
                  <p>{item.title}</p>
                  {item.operator ? <p>操作人:{item.operator}</p> : ''}
                  {item.type ? <p>操作:{item.type}</p> : ''}
                  {item.files && item.files.length ? (
                    <p>
                      附件:
                      {item.files != '[]' && item.files.length ? (
                        <span
                          className={styles.blue}
                          onClick={() => popImgPreview(item)}
                        >
                          {item.files == '[]' || !item.files.length
                            ? '无'
                            : '关联文件'}
                        </span>
                      ) : (
                        '无'
                      )}
                    </p>
                  ) : (
                    ''
                  )}
                  {item.advice ? <p>审核意见:{item.advice}</p> : ''}
                  <p>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ImgsViewer
          imgs={viewerArray}
          onClickThumbnail={clickThumbnail}
          showThumbnails={true}
          currImg={currImg}
          isOpen={viewerIsOpen}
          onClickPrev={gotoPrevious}
          onClickNext={gotoNext}
          onClose={closeViewer}
        />
      </div>
    );
  };

  const tabChange = (e) => {
    setActiveKey(e);
  };

  // 显示附件
  const showAttachment = (attachment) => {
    if (attachment && attachment.length && JSON.stringify(attachment) != '{}') {
      setCurrImg(0);
      setViewerIsOpen(true);
      setViewerArray(
        attachment.map((v: any) => {
          return { src: v };
        }),
      );
    }
  };

  const onSubItemChange = (e: any) => {
    littleForm.resetFields(['amount']);
  };

  return (
    <Tabs type="card" onChange={tabChange}>
      <Tabs.TabPane tab="项目申报" key="1">
        {declareComponent()}
      </Tabs.TabPane>
      <Tabs.TabPane tab="申请" key="2" disabled={currentStatus <= 30}>
        {applyComponent()}
      </Tabs.TabPane>
    </Tabs>
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(PolicyDocumentPage);
