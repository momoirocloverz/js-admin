import styles from './detail.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
import FileList from '@/components/form/FileList';
import SectionHeader from '@/components/form/SectionHeader';
import {
  message,
  Button,
  Input,
  InputNumber,
  Modal,
  Select,
  DatePicker,
  Table,
  Form,
  Row,
  Col,
  Steps,
} from 'antd';
import ImgsViewer from 'react-images-viewer';
import { getSubItemByDocumentId } from '@/api/fund';
import { INCLUSIVE_MAP as approvalMap } from '@/pages/application/const';
const fileListCustomFieldNames = {
  fileName: 'origin_name',
  extension: 'suffix',
};
const { Step } = Steps;
import MediaUploader from '@/components/form/MediaUploader';
const { Search, TextArea } = Input;
const { Option } = Select;
import moment from 'moment';
import Item from 'antd/lib/list/Item';
const { RangePicker } = DatePicker;
const PolicyDocumentPage = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [projectName, setProjectName] = useState('');
  const [currentDetail, setCurrentDetail] = useState({});
  const [townList, setTownList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [stepActive, setStepActive] = useState(0);
  const [stepArray, setStepArray] = useState([]);
  const [position, setPosition] = useState(0);
  const [viewerArray, setViewerArray] = useState([]);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currImg, setCurrImg] = useState(0);
  const [operateAble, setOperateAble] = useState(false);
  const [use_conditionList, setUse_conditionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [approvalRecord, setApprovalRecord] = useState([]);
  const [form] = Form.useForm();
  const [buttonDisable, setButtonDisable] = useState(false);
  const [auditMatch, setAuditMatch] = useState(false);
  const [subItems, setSubItems] = useState([]);
  const [littleForm] = Form.useForm();
  const initAction = () => {
    commitGlobalBread([
      {
        title: '惠农补贴管理',
        triggerOn: true,
      },
      {
        title: '有机肥补贴审核详情',
      },
    ]);
  };
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };
  const process = (shorter) => {
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
        title: '乡镇经办人审核',
        time: '',
        advice: '',
        files: '',
        type: '',
        operator: '',
      },
      {
        title: '公示（所在村）',
        time: '',
        advice: '',
        files: '',
        type: '',
        operator: '',
      },
      {
        title: '乡镇领导审核',
        time: '',
        advice: '',
        files: '',
        type: '',
        operator: '',
      },
      {
        title: '农业农村局审核',
        time: '',
        advice: '',
        files: '',
        type: '',
        operator: '',
      },
      {
        title: '公示（政府网）',
        time: '',
        advice: '',
        files: '',
        type: '',
        operator: '',
      },
      {
        title: '资金拨付',
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
        setStepActive(0);
        setPosition(1);
        after[0] = {
          title: '材料递交',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        setStepArray(after);
        break;
      case 1:
        setStepActive(0);
        setPosition(1);
        after[0] = {
          title: '材料递交',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        setStepArray(after);
        break;
      case 11:
        setStepActive(1);
        setPosition(1);
        after[0] = {
          title: '材料递交',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        setStepArray(after);
        break;
      case 12:
        setPosition(1);
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
          title: '乡镇经办人审核',
          time: shorter.village_handle_at,
          advice: shorter.village_handle_reason,
          files: shorter.village_handle_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_handle_admin_info &&
            shorter.admin_info.village_handle_admin_info.real_name,
        };
        setStepArray(after);
        break;
      case 19:
        setPosition(1);
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
          title: '乡镇经办人审核',
          time: shorter.village_handle_at,
          advice: shorter.village_handle_reason,
          files: shorter.village_handle_attachment,
          type: '不通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_handle_admin_info &&
            shorter.admin_info.village_handle_admin_info.real_name,
        };
        setStepArray(after);
        break;
      case 21:
        setStepActive(2);
        setPosition(2);
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
          title: '乡镇经办人审核',
          time: shorter.village_handle_at,
          advice: shorter.village_handle_reason,
          files: shorter.village_handle_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_handle_admin_info &&
            shorter.admin_info.village_handle_admin_info.real_name,
        };
        setStepArray(after);
        break;
      case 22:
        setPosition(2);
        setStepArray(after);
        break;
      case 29:
        setPosition(2);
        setStepArray(after);
        break;
      case 31:
        setStepActive(3);
        setPosition(3);
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
          title: '乡镇经办人审核',
          time: shorter.village_handle_at,
          advice: shorter.village_handle_reason,
          files: shorter.village_handle_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_handle_admin_info &&
            shorter.admin_info.village_handle_admin_info.real_name,
        };
        after[2] = {
          title: '公示（所在村）',
          time: shorter.village_publicity_at,
          advice: shorter.village_publicity_reason,
          files: shorter.village_publicity_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_publicity_admin_info &&
            shorter.admin_info.village_publicity_admin_info.real_name,
        };

        setStepArray(after);
        break;
      case 32:
        setPosition(3);
        setStepArray(after);
        break;
      case 39:
        setPosition(3);
        setStepArray(after);
        break;
      case 41:
        setPosition(4);
        setStepActive(4);
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
          title: '乡镇经办人审核',
          time: shorter.village_handle_at,
          advice: shorter.village_handle_reason,
          files: shorter.village_handle_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_handle_admin_info &&
            shorter.admin_info.village_handle_admin_info.real_name,
        };
        after[2] = {
          title: '公示（所在村）',
          time: shorter.village_publicity_at,
          advice: shorter.village_publicity_reason,
          files: shorter.village_publicity_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_publicity_admin_info &&
            shorter.admin_info.village_publicity_admin_info.real_name,
        };
        after[3] = {
          title: '乡镇领导审核',
          time: shorter.village_leader_at,
          advice: shorter.village_leader_reason,
          files: shorter.village_leader_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_leader_admin_info &&
            shorter.admin_info.village_leader_admin_info.real_name,
        };
        setStepArray(after);
        break;
      case 42:
        setPosition(4);
        setStepArray(after);
        break;
      case 49:
        setPosition(4);
        setStepArray(after);
        break;
      case 51:
        setPosition(5);
        setStepActive(5);
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
          title: '乡镇经办人审核',
          time: shorter.village_handle_at,
          advice: shorter.village_handle_reason,
          files: shorter.village_handle_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_handle_admin_info &&
            shorter.admin_info.village_handle_admin_info.real_name,
        };
        after[2] = {
          title: '公示（所在村）',
          time: shorter.village_publicity_at,
          advice: shorter.village_publicity_reason,
          files: shorter.village_publicity_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_publicity_admin_info &&
            shorter.admin_info.village_publicity_admin_info.real_name,
        };
        after[3] = {
          title: '乡镇领导审核',
          time: shorter.village_leader_at,
          advice: shorter.village_leader_reason,
          files: shorter.village_leader_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_leader_admin_info &&
            shorter.admin_info.village_leader_admin_info.real_name,
        };
        after[4] = {
          title: '农业农村局审核',
          time: shorter.rural_at,
          advice: shorter.rural_reason,
          files: shorter.rural_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.rural_admin_info &&
            shorter.admin_info.rural_admin_info.real_name,
        };
        setStepArray(after);
        break;
      case 52:
        setPosition(5);
        setStepArray(after);
        break;
      case 59:
        setPosition(5);
        setStepArray(after);
        break;
      case 61:
        setPosition(6);
        setStepActive(6);
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
          title: '乡镇经办人审核',
          time: shorter.village_handle_at,
          advice: shorter.village_handle_reason,
          files: shorter.village_handle_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_handle_admin_info &&
            shorter.admin_info.village_handle_admin_info.real_name,
        };
        after[2] = {
          title: '公示（所在村）',
          time: shorter.village_publicity_at,
          advice: shorter.village_publicity_reason,
          files: shorter.village_publicity_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_publicity_admin_info &&
            shorter.admin_info.village_publicity_admin_info.real_name,
        };
        after[3] = {
          title: '乡镇领导审核',
          time: shorter.village_leader_at,
          advice: shorter.village_leader_reason,
          files: shorter.village_leader_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_leader_admin_info &&
            shorter.admin_info.village_leader_admin_info.real_name,
        };
        after[4] = {
          title: '农业农村局审核',
          time: shorter.rural_at,
          advice: shorter.rural_reason,
          files: shorter.rural_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.rural_admin_info &&
            shorter.admin_info.rural_admin_info.real_name,
        };
        after[5] = {
          title: '公示（政府网）',
          time: shorter.rural_publicity_at,
          advice: shorter.rural_publicity_reason,
          files: shorter.rural_publicity_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.rural_publicity_admin_info &&
            shorter.admin_info.rural_publicity_admin_info.real_name,
        };
        setStepArray(after);
        break;
      case 62:
        setPosition(6);
        setStepActive(6);
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
          title: '乡镇经办人审核',
          time: shorter.village_handle_at,
          advice: shorter.village_handle_reason,
          files: shorter.village_handle_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_handle_admin_info &&
            shorter.admin_info.village_handle_admin_info.real_name,
        };
        after[2] = {
          title: '公示（所在村）',
          time: shorter.village_publicity_at,
          advice: shorter.village_publicity_reason,
          files: shorter.village_publicity_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_publicity_admin_info &&
            shorter.admin_info.village_publicity_admin_info.real_name,
        };
        after[3] = {
          title: '乡镇领导审核',
          time: shorter.village_leader_at,
          advice: shorter.village_leader_reason,
          files: shorter.village_leader_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_leader_admin_info &&
            shorter.admin_info.village_leader_admin_info.real_name,
        };
        after[4] = {
          title: '农业农村局审核',
          time: shorter.rural_at,
          advice: shorter.rural_reason,
          files: shorter.rural_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.rural_admin_info &&
            shorter.admin_info.rural_admin_info.real_name,
        };
        after[5] = {
          title: '公示（政府网）',
          time: shorter.rural_publicity_at,
          advice: shorter.rural_publicity_reason,
          files: shorter.rural_publicity_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.rural_publicity_admin_info &&
            shorter.admin_info.rural_publicity_admin_info.real_name,
        };
        after[6] = {
          title: '资金拨付',
          time: shorter.amount_leader_at,
          advice: shorter.amount_leader_reason,
          files: shorter.amount_leader_attachment,
          type: shorter.real_fund_amount
            ? '资金拨付' + shorter.real_fund_amount + '万元'
            : '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.amount_leader_admin_info &&
            shorter.admin_info.amount_leader_admin_info.real_name,
        };
        setStepArray(after);
        break;
      case 69:
        setPosition(6);
        setStepActive(6);
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
          title: '乡镇经办人审核',
          time: shorter.village_handle_at,
          advice: shorter.village_handle_reason,
          files: shorter.village_handle_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_handle_admin_info &&
            shorter.admin_info.village_handle_admin_info.real_name,
        };
        after[2] = {
          title: '公示（所在村）',
          time: shorter.village_publicity_at,
          advice: shorter.village_publicity_reason,
          files: shorter.village_publicity_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_publicity_admin_info &&
            shorter.admin_info.village_publicity_admin_info.real_name,
        };
        after[3] = {
          title: '乡镇领导审核',
          time: shorter.village_leader_at,
          advice: shorter.village_leader_reason,
          files: shorter.village_leader_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_leader_admin_info &&
            shorter.admin_info.village_leader_admin_info.real_name,
        };
        after[4] = {
          title: '农业农村局审核',
          time: shorter.rural_at,
          advice: shorter.rural_reason,
          files: shorter.rural_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.rural_admin_info &&
            shorter.admin_info.rural_admin_info.real_name,
        };
        after[5] = {
          title: '公示（政府网）',
          time: shorter.rural_publicity_at,
          advice: shorter.rural_publicity_reason,
          files: shorter.rural_publicity_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.rural_publicity_admin_info &&
            shorter.admin_info.rural_publicity_admin_info.real_name,
        };
        after[6] = {
          title: '资金拨付',
          time: shorter.amount_leader_at,
          advice: shorter.amount_leader_reason,
          files: shorter.amount_leader_attachment,
          type: '不通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.amount_leader_admin_info &&
            shorter.admin_info.amount_leader_admin_info.real_name,
        };
        setStepArray(after);
        break;
    }
  };
  const checkAudit = (val: any) => {
    setAuditMatch(false);
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
                if (roleType == 23) {
                  setAuditMatch(true);
                }
                break;
              case 21:
                if (roleType == 24) {
                  setAuditMatch(true);
                }
                break;
              case 31:
                if (roleType == 25) {
                  setAuditMatch(true);
                }
                break;
              case 41:
                if (res.data.agriculture_leader_id == userId) {
                  setAuditMatch(true);
                }
                break;
              case 51:
                if (res.data.public_government_id == userId) {
                  setAuditMatch(true);
                }
                break;
              case 61:
                if (res.data.amount_leader_id == userId) {
                  setAuditMatch(true);
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
              subject_name: subInfo.subject_name,
              address: subInfo.address,
              apply_name: subInfo.apply_name,
              apply_mobile: subInfo.apply_mobile,
              manure_from: subInfo.manure_from,
              use_num: subInfo.use_num,
              use_crop: subInfo.use_crop,
              use_area: subInfo.use_area,
              subject_promise: subInfo.subject_promise,
              subsidy_amount: subInfo.subsidy_amount,
              purchas_amount: subInfo.purchas_amount,
            });
            subInfo.use_condition.forEach((v: any) => {
              if (!v.hasOwnProperty('batchDate')) {
                v.batchDate = `${v.start_at}-${v.end_at}`;
              }
            });
            setUse_conditionList(subInfo.use_condition);
            setTimeout(() => {
              process(shorter);
            }, 100);
            if (shorter?.status == 61) {
              // 资金拨付审核中 获取分项
              getSubItemList({
                policy_document_id: shorter.policy_document_id,
              });
            }
            littleForm.resetFields();
            Apis.fetchAreaList({})
              .then((res: any) => {
                if (res && res.code === 0) {
                  setTownList(res.data.list);
                  let track1 = res.data.list[0].children.find((ele) => {
                    return ele.id == subInfo.town_id;
                  });
                  if (track1) {
                    let track2 = track1.children.find((ele) => {
                      return ele.id == subInfo.village_id;
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

  const watchUploading = (val: any) => {
    setButtonDisable(val);
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

  const submitAction = () => {
    if (currentDetail && currentDetail.status == 0) {
      return message.error('申报未提交，不可审核');
    }
    littleForm
      .validateFields()
      .then((res) => {
        let data = {
          id: location.query.id,
          project_position: position,
          audit_action_type: 9,
          reply_content: res.reply_content,
          attachment:
            res.attachment && res.attachment.length
              ? res.attachment.map((ele) => {
                  return ele.url;
                })
              : [],
        };
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

  const onFinish = (values) => {
    if (currentDetail && currentDetail.status == 0) {
      return message.error('申报未提交，不可审核');
    }
    let data: any = {
      id: location.query.id,
      project_position: position,
      audit_action_type: 1,
      reply_content: values.reply_content,
      attachment:
        values.attachment && values.attachment.length
          ? values.attachment.map((ele) => {
              return ele.url;
            })
          : [],
      // real_fund_amount: position == 6 ? values.real_fund_amount : undefined,
    };
    if (position == 6) {
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
  const clickThumbnail = (item) => {
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
  const popImgPreview = (item) => {
    let newImgArray = item.files.map((ele) => {
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
      record_type: 5,
    })
      .then((res) => {
        setApprovalRecord(res.data.list);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
    console.log(e);
    littleForm.resetFields(['amount']);
  };

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
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="subject_name" label="申报使用主体名称">
                  <Input
                    placeholder="申报使用主体名称"
                    disabled
                    style={{ width: 200 }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="manure_from" label="肥料来源">
                  <Input
                    disabled
                    placeholder="肥料来源"
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
              <Col span={12}>
                <Form.Item name="use_num" label="使用数量（吨）">
                  <Input
                    disabled
                    placeholder="使用数量（吨）"
                    style={{ width: 200 }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="address" label="详细地址">
                  <Input
                    disabled
                    placeholder="详细地址"
                    style={{ width: 200 }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="use_crop" label="应用作物">
                  <Input
                    disabled
                    placeholder="应用作物"
                    style={{ width: 200 }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="apply_name" label="申报人姓名">
                  <Input
                    disabled
                    placeholder="申报人姓名"
                    style={{ width: 200 }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="use_area" label="应用面积（亩）">
                  <Input
                    disabled
                    placeholder="应用面积（亩）"
                    style={{ width: 200 }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="apply_mobile" label="申报人联系电话">
                  <Input
                    disabled
                    placeholder="申报人联系电话"
                    style={{ width: 200 }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="subject_promise" label="使用主体承诺">
                  <Input
                    disabled
                    placeholder="使用主体承诺"
                    style={{ width: 200 }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <div className={styles.padFormItem1}>使用情况</div>
            <Row gutter={24}>
              {use_conditionList.map((ele, index) => (
                <Col span={24} key={index}>
                  <Form.Item
                    className={styles.resetFormItem}
                    label={'使用日期' + (index + 1)}
                  >
                    <span key={index}>{ele.batchDate}</span>
                  </Form.Item>
                </Col>
              ))}
            </Row>

            <div className={styles.padFormItem1}>补贴信息</div>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="subsidy_amount" label="申请补贴资金（元）">
                  <Input
                    disabled
                    placeholder="申请补贴资金（元）"
                    style={{ width: 200 }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="purchas_amount" label="采购价格（元）">
                  <Input
                    disabled
                    placeholder="采购价格"
                    style={{ width: 200 }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>

        <div className={styles.leftBottomCon}>
          <div className={styles.subTitle}>材料查看</div>
          <div>
            <SectionHeader title="1.采购合同" />
            <FileList
              list={
                currentDetail.materials_list && currentDetail.materials_list[11]
                  ? currentDetail.materials_list[11]
                  : []
              }
              customFieldNames={fileListCustomFieldNames}
            />
          </div>
          <div>
            <SectionHeader title="2.发票" />
            <FileList
              list={
                currentDetail.materials_list && currentDetail.materials_list[12]
                  ? currentDetail.materials_list[12]
                  : []
              }
              customFieldNames={fileListCustomFieldNames}
            />
          </div>
          <div>
            <SectionHeader title="3.采购凭据（销售方的销货票客户联、销货方出库单客户联）" />
            <FileList
              list={
                currentDetail.materials_list && currentDetail.materials_list[13]
                  ? currentDetail.materials_list[13]
                  : []
              }
              customFieldNames={fileListCustomFieldNames}
            />
          </div>
          <div>
            <SectionHeader title="4.货款支付凭证（不得现金支付）" />
            <FileList
              list={
                currentDetail.materials_list && currentDetail.materials_list[14]
                  ? currentDetail.materials_list[14]
                  : []
              }
              customFieldNames={fileListCustomFieldNames}
            />
          </div>
          <div>
            <SectionHeader title="5.土地流转合同" />
            <FileList
              list={
                currentDetail.materials_list && currentDetail.materials_list[15]
                  ? currentDetail.materials_list[15]
                  : []
              }
              customFieldNames={fileListCustomFieldNames}
            />
          </div>
          <div>
            <SectionHeader title="6.有关标有地址时间水印照片（一车一照及不同批次肥料使用过程照片若干张）" />
            <FileList
              list={
                currentDetail.materials_list && currentDetail.materials_list[16]
                  ? currentDetail.materials_list[16]
                  : []
              }
              customFieldNames={fileListCustomFieldNames}
            />
          </div>
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
              layout="vertical"
              onFinish={(values) => onFinish(values)}
            >
              {position == 6 ? (
                <>
                  <Form.Item
                    label="资金来源分项"
                    name="rel_subitem_id"
                    className={styles.recontrol}
                    rules={[{ required: true, message: '请选择资金来源分项' }]}
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
                </>
              )}
            </Form>
          </div>
        ) : null}
        <div className={styles.stepCon}>
          {stepArray.map((item, index) => (
            <div className={styles.stepItem} key={index}>
              <div className={styles.left}>
                {index <= stepActive ? (
                  <div className={styles.circle}></div>
                ) : (
                  <div className={`${styles.circle} ${styles.opacity3} `}></div>
                )}

                {index > stepActive - 1 ? (
                  <div className={`${styles.dashed} ${styles.opacity3} `}></div>
                ) : (
                  <div className={styles.dashed}></div>
                )}
              </div>
              <div className={styles.right}>
                <p>{item.title}</p>
                {item.operator ? <p>操作人:{item.operator}</p> : ''}
                {item.type ? <p>操作:{item.type}</p> : ''}
                {position > index && (
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

export default connect(({ baseModel }) => ({ baseModel }))(PolicyDocumentPage);
