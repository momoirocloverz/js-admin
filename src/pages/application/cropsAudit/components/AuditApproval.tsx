import styles from '../detail.less';
import React, { useEffect, useState } from 'react';
import Apis from '@/utils/apis';
import MediaUploader from '@/components/form/MediaUploader';
import { message, Button, Input, Form, InputNumber, Select, Modal } from 'antd';
import { isImage, getExtension } from '@/utils/common';
import moment from 'moment';
import ImgsViewer from 'react-images-viewer';
import { getSubItemByDocumentId } from '@/api/fund';
const { TextArea } = Input;
const { Option } = Select;
const AuditApproval = (props: any) => {
  const {
    location,
    currentDetail,
    initRequest,
    showProcess = false,
    isBatch,
    selectedId,
    projectPosition,
    roleType,
    approvalCb,
  } = props;
  const [stepActive, setStepActive] = useState(0);
  const [stepArray, setStepArray] = useState([]);
  const [position, setPosition] = useState(0);
  const [operateAble, setOperateAble] = useState(false);
  const [viewerArray, setViewerArray] = useState([]);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currImg, setCurrImg] = useState(0);
  const [littleForm] = Form.useForm();
  const [buttonDisable, setButtonDisable] = useState(false);
  const [auditMatch, setAuditMatch] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [subItems, setSubItems] = useState([]);
  const [dynamicTitle, setDynamicTitle] = useState('上传附件');
  const [previewText, setPreviewText] = useState('预览村级审核表');
  const [downLoadText, setDownLoadText] = useState('下载村级审核表');
  const [showTableOperate, setShowTableOperate] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(0);
  const [showVillageTable, setShowVillageTable] = useState(false);
  const [you_caiArea, setYou_caiArea] = useState(0);
  const [da_xiao_maiArea, setDa_xiao_maiArea] = useState(0);
  const [zao_daoArea, setZao_daoArea] = useState(0);
  const [dan_ji_daoArea, setDan_ji_daoArea] = useState(0);
  const [lian_zuo_wan_daoArea, setLian_zuo_wan_daoArea] = useState(0);
  const [villageTotalCount, setVillageTotalCount] = useState(0);

  useEffect(() => {
    if (currentDetail && currentDetail.id) {
      process(currentDetail);
      checkAudit(currentDetail);
      if (currentDetail?.status == 81) {
        // 资金拨付审核中 获取分项
        getSubItemList({
          policy_document_id: currentDetail.policy_document_id,
        });
      }
    }
  }, [currentDetail]);

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

  const filterDocFiles = (array: any) => {
    let documents: any = [];
    if (typeof array == 'string') {
      array = JSON.parse(array);
    }
    if (array && array.length) {
      array = array.filter((v: any) => v);
      array.forEach((file: any) => {
        if (!isImage(getExtension(file))) {
          documents.push(file);
        }
      });
    }
    return documents;
  };

  // 初始化审核流程
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
        title: '公示及村级审核',
        time: '',
        advice: '',
        files: '',
        type: '',
        operator: '',
      },
      {
        title: '乡镇街道审核',
        time: '',
        advice: '',
        files: '',
        type: '',
        ly_village_first_audit_area: '',
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
    console.log( shorter.status  )

    switch (shorter.status) {
      case 0:
        setStepActive(0);
        setPosition(1);
        after[0] = {
          title: '材料递交',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '未提交',
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
        after[1] = {
          title: '公示及村级审核',
          time: shorter.ly_cun_public_at,
          advice: shorter.ly_cun_public_reason,
          files: shorter.ly_cun_public_attachment,
          doc_files: filterDocFiles(shorter.ly_cun_public_attachment),
          type: '审核中',
          operator:
            shorter.admin_info &&
            shorter.admin_info.ly_cun_public_admin_info &&
            shorter.admin_info.ly_cun_public_admin_info.real_name,
        };
        setStepArray(after);
        break;
      case 12:
        setPosition(1);
        setStepArray(after);
        break;
      case 19:
        setPosition(1);
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
          title: '公示及村级审核',
          time: shorter.ly_cun_public_at,
          advice: shorter.ly_cun_public_reason,
          files: shorter.ly_cun_public_attachment,
          doc_files: filterDocFiles(shorter.ly_cun_public_attachment),
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.ly_cun_public_admin_info &&
            shorter.admin_info.ly_cun_public_admin_info.real_name,
        };
        // after[2] = {
        //   title: '村级人员审核',
        //   time: shorter.ly_cun_audit_at,
        //   advice: shorter.ly_cun_audit_reason,
        //   files: shorter.ly_cun_audit_attachment,
        //   doc_files: filterDocFiles(shorter.ly_cun_audit_attachment),
        //   type: '审核中',
        //   operator:
        //     shorter.admin_info &&
        //     shorter.admin_info.ly_cun_audit_admin_info &&
        //     shorter.admin_info.ly_cun_audit_admin_info.real_name,
        // };
        after[2] = {
          title: '乡镇街道审核',
          time: shorter.ly_village_njzx_at,
          advice: shorter.ly_village_njzx_reason,
          files: shorter.ly_village_njzx_attachment,
          doc_files: filterDocFiles(shorter.ly_village_njzx_attachment),
          type: '审核中',
          ly_village_first_audit_area: shorter.ly_village_first_audit_area,
          operator:
            shorter.admin_info &&
            shorter.admin_info.ly_village_njzx_admin_info &&
            shorter.admin_info.ly_village_njzx_admin_info.real_name,
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
          title: '公示及村级审核',
          time: shorter.ly_cun_public_at,
          advice: shorter.ly_cun_public_reason,
          files: shorter.ly_cun_public_attachment,
          doc_files: filterDocFiles(shorter.ly_cun_public_attachment),
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.ly_cun_public_admin_info &&
            shorter.admin_info.ly_cun_public_admin_info.real_name,
        };
        // after[2] = {
        //   title: '村级人员审核',
        //   time: shorter.ly_cun_audit_at,
        //   advice: shorter.ly_cun_audit_reason,
        //   files: shorter.ly_cun_audit_attachment,
        //   doc_files: filterDocFiles(shorter.ly_cun_audit_attachment),
        //   type: '通过',
        //   operator:
        //     shorter.admin_info &&
        //     shorter.admin_info.ly_cun_audit_admin_info &&
        //     shorter.admin_info.ly_cun_audit_admin_info.real_name,
        // };
        after[2] = {
          title: '乡镇街道审核',
          time: shorter.ly_village_njzx_at,
          advice: shorter.ly_village_njzx_reason,
          files: shorter.ly_village_njzx_attachment,
          doc_files: filterDocFiles(shorter.ly_village_njzx_attachment),
          type: '审核中',
          ly_village_first_audit_area: shorter.ly_village_first_audit_area,
          operator:
            shorter.admin_info &&
            shorter.admin_info.ly_village_njzx_admin_info &&
            shorter.admin_info.ly_village_njzx_admin_info.real_name,
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
      // case 41:
      case 51:
        setPosition(5);
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
          title: '公示及村级审核',
          time: shorter.ly_cun_public_at,
          advice: shorter.ly_cun_public_reason,
          files: shorter.ly_cun_public_attachment,
          doc_files: filterDocFiles(shorter.ly_cun_public_attachment),
          type: '审核中',
          operator:
            shorter.admin_info &&
            shorter.admin_info.ly_cun_public_admin_info &&
            shorter.admin_info.ly_cun_public_admin_info.real_name,
        };
        // after[2] = {
        //   title: '村级人员审核',
        //   time: shorter.ly_cun_audit_at,
        //   advice: shorter.ly_cun_audit_reason,
        //   files: shorter.ly_cun_audit_attachment,
        //   doc_files: filterDocFiles(shorter.ly_cun_audit_attachment),
        //   type: '通过',
        //   operator:
        //     shorter.admin_info &&
        //     shorter.admin_info.ly_cun_audit_admin_info &&
        //     shorter.admin_info.ly_cun_audit_admin_info.real_name,
        // };
        after[2] = {
          title: '乡镇街道审核',
          time: shorter.ly_village_njzx_at,
          advice: shorter.ly_village_njzx_reason,
          files: shorter.ly_village_njzx_attachment,
          doc_files: filterDocFiles(shorter.ly_village_njzx_attachment),
          type: '通过',
          ly_village_first_audit_area: shorter.ly_village_first_audit_area,
          operator:
            shorter.admin_info &&
            shorter.admin_info.ly_village_njzx_admin_info &&
            shorter.admin_info.ly_village_njzx_admin_info.real_name,
        };
        after[3] = {
          title: '农业农村局审核',
          time: shorter.ly_rural_audit_at,
          advice: shorter.ly_rural_audit_reason,
          files: shorter.ly_rural_audit_attachment,
          doc_files: filterDocFiles(shorter.ly_rural_audit_attachment),
          type: '审核中',
          operator:
            shorter.admin_info &&
            shorter.admin_info.ly_rural_audit_admin_info &&
            shorter.admin_info.ly_rural_audit_admin_info.real_name,
        };
        setStepArray(after);
        break;
      case 42:
        setPosition(4);
        setStepActive(4);
        setStepArray(after);
        break;
      case 49:
        setPosition(4);
        setStepActive(4);
        setStepArray(after);
        break;
      // case 51:
      case 71:
        setPosition(7);
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
          title: '公示及村级审核',
          time: shorter.ly_cun_public_at,
          advice: shorter.ly_cun_public_reason,
          files: shorter.ly_cun_public_attachment,
          doc_files: filterDocFiles(shorter.ly_cun_public_attachment),
          type: '审核中',
          operator:
            shorter.admin_info &&
            shorter.admin_info.ly_cun_public_admin_info &&
            shorter.admin_info.ly_cun_public_admin_info.real_name,
        };
        // after[2] = {
        //   title: '村级人员审核',
        //   time: shorter.ly_cun_audit_at,
        //   advice: shorter.ly_cun_audit_reason,
        //   files: shorter.ly_cun_audit_attachment,
        //   doc_files: filterDocFiles(shorter.ly_cun_audit_attachment),
        //   type: '通过',
        //   operator:
        //     shorter.admin_info &&
        //     shorter.admin_info.ly_cun_audit_admin_info &&
        //     shorter.admin_info.ly_cun_audit_admin_info.real_name,
        // };
        after[2] = {
          title: '乡镇街道审核',
          time: shorter.ly_village_njzx_at,
          advice: shorter.ly_village_njzx_reason,
          files: shorter.ly_village_njzx_attachment,
          doc_files: filterDocFiles(shorter.ly_village_njzx_attachment),
          type: '通过',
          ly_village_first_audit_area: shorter.ly_village_first_audit_area,
          operator:
            shorter.admin_info &&
            shorter.admin_info.ly_village_njzx_admin_info &&
            shorter.admin_info.ly_village_njzx_admin_info.real_name,
        };
        after[3] = {
          title: '农业农村局审核',
          time: shorter.ly_rural_audit_at,
          advice: shorter.ly_rural_audit_reason,
          files: shorter.ly_rural_audit_attachment,
          doc_files: filterDocFiles(shorter.ly_rural_audit_attachment),
          type: '审核中',
          operator:
            shorter.admin_info &&
            shorter.admin_info.ly_rural_audit_admin_info &&
            shorter.admin_info.ly_rural_audit_admin_info.real_name,
        };
        setStepArray(after);
        break;
      case 52:
        setPosition(5);
        setStepActive(5);
        setStepArray(after);
        break;
      case 59:
        setPosition(5);
        setStepActive(5);
        setStepArray(after);
        break;
      // case 61:
      case 62:
        setPosition(6);
        setStepActive(6);
        setStepArray(after);
        break;
      case 69:
        setPosition(6);
        setStepActive(6);
        setStepArray(after);
        break;
      case 72:
        setPosition(7);
        setStepActive(7);
        setStepArray(after);
        break;
      case 79:
        setPosition(7);
        setStepActive(7);
        setStepArray(after);
        break;
      case 81:
        setPosition(8);
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
          title: '公示及村级审核',
          time: shorter.ly_cun_public_at,
          advice: shorter.ly_cun_public_reason,
          files: shorter.ly_cun_public_attachment,
          doc_files: filterDocFiles(shorter.ly_cun_public_attachment),
          type: '审核中',
          operator:
            shorter.admin_info &&
            shorter.admin_info.ly_cun_public_admin_info &&
            shorter.admin_info.ly_cun_public_admin_info.real_name,
        };
        // after[2] = {
        //   title: '村级人员审核',
        //   time: shorter.ly_cun_audit_at,
        //   advice: shorter.ly_cun_audit_reason,
        //   files: shorter.ly_cun_audit_attachment,
        //   doc_files: filterDocFiles(shorter.ly_cun_audit_attachment),
        //   type: '通过',
        //   operator:
        //     shorter.admin_info &&
        //     shorter.admin_info.ly_cun_audit_admin_info &&
        //     shorter.admin_info.ly_cun_audit_admin_info.real_name,
        // };
        after[2] = {
          title: '乡镇街道审核',
          time: shorter.ly_village_njzx_at,
          advice: shorter.ly_village_njzx_reason,
          files: shorter.ly_village_njzx_attachment,
          doc_files: filterDocFiles(shorter.ly_village_njzx_attachment),
          type: '通过',
          ly_village_first_audit_area: shorter.ly_village_first_audit_area,
          operator:
            shorter.admin_info &&
            shorter.admin_info.ly_village_njzx_admin_info &&
            shorter.admin_info.ly_village_njzx_admin_info.real_name,
        };
        after[3] = {
          title: '农业农村局审核',
          time: shorter.ly_rural_audit_at,
          advice: shorter.ly_rural_audit_reason,
          files: shorter.ly_rural_audit_attachment,
          doc_files: filterDocFiles(shorter.ly_rural_audit_attachment),
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.ly_rural_audit_admin_info &&
            shorter.admin_info.ly_rural_audit_admin_info.real_name,
        };
        after[4] = {
          title: '公示（政府网）',
          time: shorter.ly_public_govn_at,
          advice: shorter.ly_public_govn_reason,
          files: shorter.ly_public_govn_attachment,
          doc_files: filterDocFiles(shorter.ly_public_govn_attachment),
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.ly_public_govn_admin_info &&
            shorter.admin_info.ly_public_govn_admin_info.real_name,
        };
        after[5] = {
          title: '资金拨付',
          time: shorter.ly_fund_at,
          advice: shorter.ly_fund_reason,
          type: '审核中',
          operator:
            shorter.admin_info &&
            shorter.admin_info.ly_fund_admin_info &&
            shorter.admin_info.ly_fund_admin_info.real_name,
        };
        setStepArray(after);
        break;
      case 82:
        setPosition(8);
        setStepActive(8);
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
          title: '公示及村级审核',
          time: shorter.ly_cun_public_at,
          advice: shorter.ly_cun_public_reason,
          files: shorter.ly_cun_public_attachment,
          doc_files: filterDocFiles(shorter.ly_cun_public_attachment),
          type: '审核中',
          operator:
            shorter.admin_info &&
            shorter.admin_info.ly_cun_public_admin_info &&
            shorter.admin_info.ly_cun_public_admin_info.real_name,
        };
        // after[2] = {
        //   title: '村级人员审核',
        //   time: shorter.ly_cun_audit_at,
        //   advice: shorter.ly_cun_audit_reason,
        //   files: shorter.ly_cun_audit_attachment,
        //   doc_files: filterDocFiles(shorter.ly_cun_audit_attachment),
        //   type: '通过',
        //   operator:
        //     shorter.admin_info &&
        //     shorter.admin_info.ly_cun_audit_admin_info &&
        //     shorter.admin_info.ly_cun_audit_admin_info.real_name,
        // };
        after[2] = {
          title: '乡镇街道审核',
          time: shorter.ly_village_njzx_at,
          advice: shorter.ly_village_njzx_reason,
          files: shorter.ly_village_njzx_attachment,
          doc_files: filterDocFiles(shorter.ly_village_njzx_attachment),
          type: '通过',
          ly_village_first_audit_area: shorter.ly_village_first_audit_area,
          operator:
            shorter.admin_info &&
            shorter.admin_info.ly_village_njzx_admin_info &&
            shorter.admin_info.ly_village_njzx_admin_info.real_name,
        };
        after[3] = {
          title: '农业农村局审核',
          time: shorter.ly_rural_audit_at,
          advice: shorter.ly_rural_audit_reason,
          files: shorter.ly_rural_audit_attachment,
          doc_files: filterDocFiles(shorter.ly_rural_audit_attachment),
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.ly_rural_audit_admin_info &&
            shorter.admin_info.ly_rural_audit_admin_info.real_name,
        };
        after[4] = {
          title: '公示（政府网）',
          time: shorter.ly_public_govn_at,
          advice: shorter.ly_public_govn_reason,
          files: shorter.ly_public_govn_attachment,
          doc_files: filterDocFiles(shorter.ly_public_govn_attachment),
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.ly_public_govn_admin_info &&
            shorter.admin_info.ly_public_govn_admin_info.real_name,
        };
        after[5] = {
          title: '资金拨付',
          time: shorter.ly_fund_at,
          advice: shorter.ly_fund_reason,
          type: shorter.real_fund_amount
            ? '资金拨付' + shorter.real_fund_amount + '万元'
            : '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.ly_fund_admin_info &&
            shorter.admin_info.ly_fund_admin_info.real_name,
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
            setShowTableOperate(false);
            setCurrentStatus(val.status);
            switch (val.status) {
              case 11:
                if (roleType == 31) {
                  setAuditMatch(true);
                }
                setDynamicTitle('上传附件(村级审核表、公示现场图、公示文件)');
                setPreviewText('预览村级审核表');
                setDownLoadText('下载村级审核表');
                setShowTableOperate(true);
                break;
              // case 21:
              //   if (roleType == 31) {
              //     setAuditMatch(true);
              //   }
              //   break;
              case 31:
                if (roleType == 26) {
                  setAuditMatch(true);
                }
                setDynamicTitle('上传附件(镇级审核表)');
                setPreviewText('预览镇级审核表');
                setDownLoadText('下载镇级审核表');
                setShowTableOperate(true);
                break;
              // case 41:
              //   break;
              case 51:
                if (res.data.ly_rural_audit_admin_id == userId) {
                  setAuditMatch(true);
                }
                break;
              // case 61:
              // break;
              case 71:
                if (res.data.ly_public_govn_admin_id == userId) {
                  setAuditMatch(true);
                }
                break;
              case 81:
                if (res.data.ly_fund_admin_id == userId) {
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
  const watchUploading = (val: any) => {
    setButtonDisable(val);
  };

  // 不通过
  const submitAction = () => {
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
              ? res.attachment.map((ele: any) => {
                  return ele.url;
                })
              : [],
          ly_village_first_audit_area:
            position == 3 ? res.ly_village_first_audit_area : '',
        };
        if (isBatch) {
          // 批量审核需要根据roleType判断审核阶段
          if (roleType == 26) {
            data.project_position = 3; // 乡镇农技中心审核人员
          } else {
            data.project_position = projectPosition; // 农业农村局
          }

          // else if (roleType == 27) {
          //   data.project_position = 4; // 乡镇农技中心领导
          // } else if (roleType == 11) {
          //   data.project_position = 6; // 第三方审核
          // }

          data.ids = selectedId;
          Apis.projectSubBatchAction(data)
            .then((res: any) => {
              if (res && res.code === 0) {
                message.success('提交成功');
                littleForm.resetFields();
                approvalCb && approvalCb();
              } else {
                message.error(res.msg);
              }
            })
            .catch((err) => {
              console.log('err', err);
            });
          return;
        }
        // return console.log('不通过传参', data)
        Apis.projectSubAction(data)
          .then((res: any) => {
            if (res && res.code === 0) {
              message.success('提交成功');
              littleForm.resetFields();
              initRequest && initRequest();
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

  // 通过
  const onFinish = (values: any) => {
    console.log('values', values);

    let data: any = {
      id: location.query.id,
      project_position: position,
      audit_action_type: 1,
      reply_content: values.reply_content,
      attachment:
        values.attachment && values.attachment.length
          ? values.attachment.map((ele: any) => {
              return ele.url;
            })
          : [],
      // real_fund_amount: position == 8 ? values.real_fund_amount : undefined,
      ly_village_first_audit_area:
        position == 3 ? values.ly_village_first_audit_area : undefined,
    };

    if (position == 8) {
      // 资金拨付
      const { amount, rel_subitem_id } = values;
      data.rel_subitem_list = [{ rel_subitem_id, amount }];
    }

    if (isBatch) {
      // 批量审核 需要根据roleType判断审核阶段
      if (roleType == 26) {
        data.project_position = 3; // 乡镇农技中心审核人员
      } else {
        data.project_position = projectPosition; // 农业农村局
      }
      // else if (roleType == 27) {
      //   data.project_position = 4; // 乡镇农技中心领导
      // } else if (roleType == 11) {
      //   data.project_position = 6; // 第三方审核
      // }
      data.ids = selectedId;
      // console.log('通过传参', JSON.stringify(data));
      Apis.projectSubBatchAction(data)
        .then((res: any) => {
          if (res && res.code === 0) {
            message.success('提交成功');
            littleForm.resetFields();
            approvalCb && approvalCb();
          } else {
            message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
      return;
    }

    // return console.log('通过传参', JSON.stringify(data));
    Apis.projectSubAction(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          message.success('提交成功');
          littleForm.resetFields();
          initRequest && initRequest();
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  const popImgPreview = (item: any) => {
    if (item.files == '[]' || !item.files.length) return;
    if (typeof item.files == 'string') {
      item.files = JSON.parse(item.files);
    }
    let newImgArray = item.files
      .filter((v: any) => v)
      .filter((src: any) => isImage(getExtension(src)))
      .map((ele: Array<Object>) => {
        return {
          src: ele,
        };
      });
    setCurrImg(0);
    setViewerIsOpen(true);
    setViewerArray(newImgArray);
  };

  const openDoc = (src: any) => {
    window.open(src, '_blank');
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

  const onSubItemChange = (e) => {
    console.log(e);
    littleForm.resetFields(['amount']);
  };
  const toPreview = () => {
    let track1 = currentDetail.sub_info.crop_list.find((ele) => {
      return ele.crop_type == 'you_cai';
    });
    let track2 = currentDetail.sub_info.crop_list.find((ele) => {
      return ele.crop_type == 'da_xiao_mai';
    });
    let track3 = currentDetail.sub_info.crop_list.find((ele) => {
      return ele.crop_type == 'zao_dao';
    });
    let track4 = currentDetail.sub_info.crop_list.find((ele) => {
      return ele.crop_type == 'dan_ji_dao';
    });
    let track5 = currentDetail.sub_info.crop_list.find((ele) => {
      return ele.crop_type == 'lian_zuo_wan_dao';
    });
    if (track1) {
      setYou_caiArea(track1.total_area);
    }
    if (track2) {
      setDa_xiao_maiArea(track2.total_area);
    }
    if (track3) {
      setZao_daoArea(track3.total_area);
    }
    if (track4) {
      setDan_ji_daoArea(track4.total_area);
    }
    if (track5) {
      setLian_zuo_wan_daoArea(track5.total_area);
    }
    if (currentStatus == 11) {
      let temp = currentDetail.sub_info.crop_list.map((ele) => {
        return {
          ...ele,
          total_area: ele.total_area ? +ele.total_area : 0,
        };
      });
      let res = temp.reduce((acc, current) => {
        return acc + current.total_area;
      }, 0);
      setVillageTotalCount(res);
      setShowVillageTable(true);
    } else {
      setShowVillageTable(false);
    }
    setShowTable(true);
  };
  const toDownload = () => {
    let content = littleForm.getFieldValue('reply_content');
    if (content) {
      let data = {
        id: location.query.id,
        project_position: position,
        reply_content: content,
      };
      Apis.projectSubDownloadLyAuditTable(data)
        .then((res: any) => {
          const content = res;
          const blob = new Blob([content]);
          const fileName =
            currentStatus == 11
              ? '村级审核表' + Date.now() + '.pdf'
              : '镇级审核表' + Date.now() + '.pdf';
          if ('download' in document.createElement('a')) {
            // 非IE下载
            const elink = document.createElement('a');
            elink.download = fileName;
            elink.style.display = 'none';
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href);
            document.body.removeChild(elink);
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    } else {
      message.info('请先填写审核意见，再点击下载');
    }
  };
  const onTableCancel = () => {
    setShowTable(false);
  };
  const onTableConfirm = () => {
    setShowTable(false);
  };
  return (
    <>
      {auditMatch ? (
        <div className={styles.littleForm}>
          <Form
            form={littleForm}
            name="nest-messages"
            labelAlign={'left'}
            layout="vertical"
            onFinish={(values) => onFinish(values)}
          >
            {position == 8 ? (
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
                <Form.Item
                  label={dynamicTitle}
                  name="attachment"                
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
                    完成资金拨付
                  </Button>
                </div>
              </>
            ) : (
              <>
                {showTableOperate ? (
                  <div className={styles.tableOperateCon}>
                    <Button onClick={() => toPreview()}>{previewText}</Button>
                    <Button
                      type="primary"
                      className={styles.downloadTable}
                      onClick={() => toDownload()}
                    >
                      {downLoadText}
                    </Button>
                  </div>
                ) : null}
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
                {position == 3 ? (
                  <Form.Item
                    name="ly_village_first_audit_area"
                    label="初审面积"
                    rules={[{ required: true, message: '初审面积不能为空' }]}
                  >
                    <Input placeholder="初审面积" />
                  </Form.Item>
                ) : null}
                <Form.Item
                  label={dynamicTitle}
                  name="attachment"
                  rules={  currentDetail.status!=71 ?   [{ required: true, message: '上传附件不能为空' }] :[]}
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
      {showProcess && (
        <div className={styles.stepCon}>
          {stepArray.map((item: any, index) => (
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
                {item.files && item.files.length > 0 ? (
                  <p>
                    附件:
                    {item.files != '[]' &&
                    item.files != '[null]' &&
                    item.files.length ? (
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
                {item.doc_files && item.doc_files.length > 0 && (
                  <p>
                    {item.doc_files.map((v: any, i: number) => (
                      <span
                        className={`${styles.docLink} ${styles.blue}`}
                        onClick={() => openDoc(v)}
                        key={i}
                      >{`文件${i + 1}`}</span>
                    ))}
                  </p>
                )}
                {item.ly_village_first_audit_area ? (
                  <p>初审面积:{item.ly_village_first_audit_area}</p>
                ) : (
                  ''
                )}
                {item.advice ? <p>审核意见:{item.advice}</p> : ''}
                <p>{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
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
      <Modal
        title={'预览'}
        visible={showTable}
        width={800}
        onCancel={onTableCancel}
        onOk={onTableConfirm}
      >
        <div className={styles.tableBox}>
          {showVillageTable ? (
            <>
              <div className={styles.tableTitle}>
                年粮油生产经营主体粮油种植面积申报表
              </div>
              <div className={styles.firstSign}>
                <div>申报主体(盖章):  {currentDetail.sub_info &&
                        currentDetail.sub_info.main_name}</div>
                <div>
                  申报日期:
                  {moment(
                    currentDetail.sub_info && currentDetail.sub_info.updated_at,
                  ).format('YYYY-MM-DD')}
                </div>
              </div>
              <table cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td colSpan={2}>负责人姓名（签字）</td>
                    <td colSpan={1}>
                      {currentDetail.sub_info &&
                        currentDetail.sub_info.principal}
                    </td>
                    <td colSpan={2}>手机号码</td>
                    <td colSpan={2}>
                      {currentDetail.sub_info && currentDetail.sub_info.mobile}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>办公地址</td>
                    <td colSpan={5}>
                      {currentDetail.sub_info &&
                        currentDetail.sub_info.bg_area_info.city_name}
                      {currentDetail.sub_info &&
                        currentDetail.sub_info.bg_area_info.town_name}
                      {currentDetail.sub_info &&
                        currentDetail.sub_info.bg_area_info.village_name}
                      {currentDetail.sub_info &&
                        currentDetail.sub_info.bg_address}
                    </td>
                  </tr>
                  <tr>
                    <td rowSpan={3}>承包面积(亩)</td>
                    <td rowSpan={3}>
                      {currentDetail.sub_info && currentDetail.sub_info.cb_area}
                    </td>
                    <td colSpan={4}>本乡镇</td>
                    <td rowSpan={2}>外乡镇</td>
                  </tr>
                  <tr>
                    <td>村</td>
                    <td>村</td>
                    <td>村</td>
                    <td>村</td>
                  </tr>
                  <tr>
                    <td>
                      {currentDetail.sub_info &&
                        currentDetail.sub_info.cb_area_info.village_name}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td rowSpan={2}>种植面积(亩)</td>
                    <td>油菜</td>
                    <td>大小麦</td>
                    <td>早稻</td>
                    <td>单季稻</td>
                    <td colSpan={2}>连作晚稻</td>
                  </tr>
                  <tr>
                    <td>{you_caiArea ? you_caiArea : null}</td>
                    <td>{da_xiao_maiArea ? da_xiao_maiArea : null}</td>
                    <td>{zao_daoArea ? zao_daoArea : null}</td>
                    <td>{dan_ji_daoArea ? dan_ji_daoArea : null}</td>
                    <td colSpan={2}>
                      {lian_zuo_wan_daoArea ? lian_zuo_wan_daoArea : null}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>农作物种植情况(分布地、面积)</td>
                    <td colSpan={2}>作物类型</td>
                    <td>种植面积(亩)</td>
                    <td colSpan={2}>分布地名称/面积</td>
                  </tr>
                  {currentDetail.sub_info &&
                    currentDetail.sub_info.crop_list.map(
                      (ele: any, index: any) => (
                        <tr key={index}>
                          <td colSpan={2}></td>
                          <td colSpan={2}>{ele.type_text}</td>
                          <td>{ele.total_area}</td>
                          <td colSpan={2}>
                            {ele.list.map((sub: any, subIndex: any) => (
                              <div key={subIndex}>
                                <span>{sub.dist_name}</span>/
                                <span>{sub.area}亩</span>
                              </div>
                            ))}
                          </td>
                        </tr>
                      ),
                    )}
                  <tr>
                    <td colSpan={2}></td>
                    <td colSpan={2}>合计</td>
                    <td>{villageTotalCount}</td>
                    <td colSpan={2}></td>
                  </tr>
                  <tr>
                    <td colSpan={2}>村级审核意见：</td>
                    <td colSpan={5}>
                        <div>{   littleForm.getFieldValue('reply_content') ? littleForm.getFieldValue('reply_content') :null  }</div>
                      <div
                        className={`${styles.alignRight} ${styles.mr50} ${styles.sixteentFont}`}
                      >
                        负责人（签字）：&nbsp;&nbsp;&nbsp;&nbsp;（公章）
                      </div>
                      <br />
                      <div
                        className={`${styles.alignRight}  ${styles.sixteentFont}`}
                      >
                        年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : (
            <>
              <div className={styles.tableTitle}>
                年粮油生产经营主体粮油种植面积审核表
              </div>
              <table cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td colSpan={2}>申请人姓名（签字）</td>
                    <td colSpan={1}>
                      {currentDetail.submit_userinfo &&
                        currentDetail.submit_userinfo.real_name}
                    </td>
                    <td colSpan={2}>申报日期</td>
                    <td colSpan={2}>
                      {moment(
                        currentDetail.sub_info &&
                          currentDetail.sub_info.updated_at,
                      ).format('YYYY-MM-DD')}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>地址</td>
                    <td colSpan={1}>
                      {currentDetail.sub_info &&
                        currentDetail.sub_info.bg_area_info.city_name}
                      {currentDetail.sub_info &&
                        currentDetail.sub_info.bg_area_info.town_name}
                      {currentDetail.sub_info &&
                        currentDetail.sub_info.bg_area_info.village_name}
                      {currentDetail.sub_info &&
                        currentDetail.sub_info.bg_address}
                    </td>
                    <td colSpan={2}>手机号码</td>
                    <td colSpan={2}>
                      {currentDetail.sub_info && currentDetail.sub_info.mobile}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} rowSpan={2}>
                      承包面积(亩)
                    </td>
                    <td>本乡镇</td>
                    <td>外乡镇</td>
                    <td colSpan={2}>合计</td>
                  </tr>
                  <tr>
                    <td>
                      {currentDetail.sub_info && currentDetail.sub_info.cb_area}
                    </td>
                    <td></td>
                    <td colSpan={2}>
                      {currentDetail.sub_info && currentDetail.sub_info.cb_area}
                    </td>
                  </tr>
                  <tr>
                    <td rowSpan={2}>种粮面积(亩)</td>
                    <td>油菜</td>
                    <td>大小麦</td>
                    <td>早稻</td>
                    <td>单季稻</td>
                    <td>连作晚稻</td>
                  </tr>
                  <tr>
                    <td>{you_caiArea ? you_caiArea : null}</td>
                    <td>{da_xiao_maiArea ? da_xiao_maiArea : null}</td>
                    <td>{zao_daoArea ? zao_daoArea : null}</td>
                    <td>{dan_ji_daoArea ? dan_ji_daoArea : null}</td>
                    <td>
                      {lian_zuo_wan_daoArea ? lian_zuo_wan_daoArea : null}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={6}>
                      <div>村级公示结论（时间、地点、结果）：</div>
                      <br />
                        <div>{   currentDetail.ly_cun_public_reason  }</div>
                      
                      <br />
                      <div className={styles.rightText}>签字：</div>
                      <div className={styles.rightText}>
                        {moment(
                          currentDetail.sub_info &&
                            currentDetail.sub_info.updated_at,
                        ).format('YYYY年MM月DD日')}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={6}>
                      <div>
                        乡镇（街道）农技站（农业综合服务中心）初审意见：
                        </div>                      
                        <br />
                        <div>{   littleForm.getFieldValue('reply_content') ? littleForm.getFieldValue('reply_content') :null  }</div>
                      <br />
                      <div className={styles.rightText}>签字：</div>
                      <div className={styles.rightText}>
                        {moment(
                          currentDetail.sub_info &&
                            currentDetail.sub_info.updated_at,
                        ).format('YYYY年MM月DD日')}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={6}>
                        <div>乡镇（街道）审核意见：</div>
                        <br />
                        <div>{   littleForm.getFieldValue('reply_content') ? littleForm.getFieldValue('reply_content') :null  }</div>
                      <br />
                      <div className={styles.rightText}>签字：</div>
                      <div className={styles.rightText}>
                        {moment(
                          currentDetail.sub_info &&
                            currentDetail.sub_info.updated_at,
                        ).format('YYYY年MM月DD日')}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default AuditApproval;
