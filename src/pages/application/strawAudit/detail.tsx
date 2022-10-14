import styles from './detail.less';
import Apis from '@/utils/apis';
import { connect } from 'umi';
import React, { useEffect, useState } from 'react';
import FileList from '@/components/form/FileList';
import SectionHeader from '@/components/form/SectionHeader';
import {
  message,
  Button,
  InputNumber,
  Input,
  Select,
  DatePicker,
  Table,
  Form,
  Row,
  Col,
  Steps,
} from 'antd';
import { INCLUSIVE_MAP as approvalMap } from '@/pages/application/const';
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
  const [form] = Form.useForm();
  const [approvalRecord, setApprovalRecord] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typeForm, setTypeForm] = useState(21);
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
        title: '秸秆综合利用审核详情',
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
              principal: subInfo.principal,
              mobile: subInfo.mobile,
              apply_straw_amount: subInfo.apply_straw_amount,
              straw_type: subInfo.straw_type,
              straw_way: subInfo.straw_way,
              collect_num: subInfo.collect_num,
              dry_num: subInfo.dry_num,
              buy_machine_name: subInfo.buy_machine_name,
              model: subInfo.model,
              number: subInfo.number,
              price: subInfo.price,
              subsidy_finance: subInfo.subsidy_finance,
              subsidy_condition: subInfo.subsidy_condition,
              serve_address: subInfo.serve_address,
              apply_price: subInfo.apply_price,
              serve_area: subInfo.serve_area,
              serve_at: subInfo.serve_at,
              agricultural_type: subInfo.agricultural_type,
              serve_way: subInfo.serve_way,
            });
            setTimeout(() => {
              process(shorter);
            }, 100);
            if (shorter?.status == 61) {
              // 资金拨付审核中 获取分项
              getSubItemList({
                policy_document_id: shorter.policy_document_id,
              });
            }
            setTypeForm(shorter.form_type);
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

  // 获取审核记录
  const getApprovalRecord = () => {
    const formTypeMapRecordType = {
      21: 6,
      22: 7,
      23: 8,
    };
    Apis.fetchDeclarationRecordList({
      project_id: location.query.id,
      record_type: formTypeMapRecordType[location.query.form_type],
    })
      .then((res) => {
        setApprovalRecord(res.data.list);
      })
      .catch((err) => {
        console.log(err);
      });
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

  let bottomContentVariable;
  if (typeForm == 21) {
    bottomContentVariable = (
      <>
        <div>
          <SectionHeader title="1.购机发票" />
          <FileList
            list={
              currentDetail.materials_list && currentDetail.materials_list[21]
                ? currentDetail.materials_list[21]
                : []
            }
            customFieldNames={fileListCustomFieldNames}
          />
        </div>
        <div>
          <SectionHeader title="2.合格证" />
          <FileList
            list={
              currentDetail.materials_list && currentDetail.materials_list[22]
                ? currentDetail.materials_list[22]
                : []
            }
            customFieldNames={fileListCustomFieldNames}
          />
        </div>
      </>
    );
  } else if (typeForm == 22) {
    bottomContentVariable = (
      <>
        <div>
          <SectionHeader title="1.秸秆收购明细表" />
          <FileList
            list={
              currentDetail.materials_list && currentDetail.materials_list[31]
                ? currentDetail.materials_list[31]
                : []
            }
            customFieldNames={fileListCustomFieldNames}
          />
        </div>
        <div>
          <SectionHeader title="2.入库单" />
          <FileList
            list={
              currentDetail.materials_list && currentDetail.materials_list[32]
                ? currentDetail.materials_list[32]
                : []
            }
            customFieldNames={fileListCustomFieldNames}
          />
        </div>
        <div>
          <SectionHeader title="3.过磅单" />
          <FileList
            list={
              currentDetail.materials_list && currentDetail.materials_list[33]
                ? currentDetail.materials_list[33]
                : []
            }
            customFieldNames={fileListCustomFieldNames}
          />
        </div>
        <div>
          <SectionHeader title="4.水印照片（秸秆综合利用补助）" />
          <FileList
            list={
              currentDetail.materials_list && currentDetail.materials_list[34]
                ? currentDetail.materials_list[34]
                : []
            }
            customFieldNames={fileListCustomFieldNames}
          />
        </div>
      </>
    );
  } else {
    bottomContentVariable = (
      <>
        <div>
          <SectionHeader title="1.作业服务清单" />
          <FileList
            list={
              currentDetail.materials_list && currentDetail.materials_list[41]
                ? currentDetail.materials_list[41]
                : []
            }
            customFieldNames={fileListCustomFieldNames}
          />
        </div>
        <div>
          <SectionHeader title="2.水印照片（社会化服务补助）" />
          <FileList
            list={
              currentDetail.materials_list && currentDetail.materials_list[42]
                ? currentDetail.materials_list[42]
                : []
            }
            customFieldNames={fileListCustomFieldNames}
          />
        </div>
      </>
    );
  }

  let formContentVariable;
  if (typeForm == 21) {
    formContentVariable = (
      <>
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
            <Form.Item name="principal" label="负责人">
              <Input disabled placeholder="负责人" style={{ width: 200 }} />
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
            <Form.Item name="mobile" label="联系电话">
              <Input disabled placeholder="联系电话" style={{ width: 200 }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="address" label="详细地址">
              <Input disabled placeholder="详细地址" style={{ width: 200 }} />
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

        <div className={styles.padFormItem1}>秸秆利用农机购置补助申请</div>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="buy_machine_name" label="购置机械名称">
              <Input
                disabled
                placeholder="购置机械名称"
                style={{ width: 200 }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="model" label="型号">
              <Input disabled placeholder="型号" style={{ width: 200 }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="number" label="数量">
              <Input disabled placeholder="数量" style={{ width: 200 }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="price" label="购置价格(万元）">
              <Input
                disabled
                placeholder="购置价格(万元）"
                style={{ width: 200 }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="subsidy_condition" label="国家农机购置补贴情况">
              <Input
                disabled
                placeholder="申请补助资金（元）"
                style={{ width: 200 }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="subsidy_finance" label="申请补助资金（元）">
              <Input
                disabled
                placeholder="申请补助资金（元）"
                style={{ width: 200 }}
              />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  } else if (typeForm == 22) {
    formContentVariable = (
      <>
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
            <Form.Item name="principal" label="负责人">
              <Input disabled placeholder="负责人" style={{ width: 200 }} />
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
            <Form.Item name="mobile" label="联系电话">
              <Input disabled placeholder="联系电话" style={{ width: 200 }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="address" label="详细地址">
              <Input disabled placeholder="详细地址" style={{ width: 200 }} />
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

        <div className={styles.padFormItem1}>秸秆综合利用补助资金申请</div>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="straw_type" label="秸秆类型">
              <Input disabled placeholder="秸秆类型" style={{ width: 200 }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="straw_way" label="利用方式">
              <Input disabled placeholder="利用方式" style={{ width: 200 }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="collect_num" label="收集数量（吨)">
              <Input
                disabled
                placeholder="收集数量（吨)"
                style={{ width: 200 }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="dry_num" label="折干数量（吨）">
              <Input
                disabled
                placeholder="折干数量（吨）"
                style={{ width: 200 }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="apply_straw_amount" label="申请补助资金（元）">
              <Input
                disabled
                placeholder="申请补助资金（元）"
                style={{ width: 200 }}
              />
            </Form.Item>
          </Col>
          <Col span={12}></Col>
        </Row>
      </>
    );
  } else {
    formContentVariable = (
      <>
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
            <Form.Item name="principal" label="负责人">
              <Input disabled placeholder="负责人" style={{ width: 200 }} />
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
            <Form.Item name="mobile" label="联系电话">
              <Input disabled placeholder="联系电话" style={{ width: 200 }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="address" label="详细地址">
              <Input disabled placeholder="详细地址" style={{ width: 200 }} />
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

        <div className={styles.padFormItem1}>
          秸秆利用农机社会化服务补助资金申请
        </div>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="agricultural_type" label="开展服务农机类型">
              <Input
                disabled
                placeholder="开展服务农机类型"
                style={{ width: 200 }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="serve_way" label="服务方式">
              <Input disabled placeholder="服务方式" style={{ width: 200 }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="serve_area" label="服务面积（亩）">
              <Input
                disabled
                placeholder="服务面积（亩）"
                style={{ width: 200 }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="serve_at" label="服务时间">
              <Input disabled placeholder="服务时间" style={{ width: 200 }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="apply_price" label="申请补助资金（万元）">
              <Input
                disabled
                placeholder="申请补助资金（万元）"
                style={{ width: 200 }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="serve_address" label="服务地点">
              <Input disabled placeholder="服务地点" style={{ width: 200 }} />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  }

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

  const watchUploading = (val: any) => {
    setButtonDisable(val);
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
            {formContentVariable}
            {/* <Row gutter={24}>
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
                <Form.Item name="subject_promise" label="采购价格">
                  <Input
                    disabled
                    placeholder="采购价格"
                    style={{ width: 200 }}
                  />
                </Form.Item>
              </Col>
            </Row> */}
          </Form>
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
              layout="vertical"
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

export default connect(({ baseModel }) => ({ baseModel }))(PolicyDocumentPage);
