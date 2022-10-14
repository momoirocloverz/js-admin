import styles from './detail.less';
import Apis from '@/utils/apis';
import { connect } from 'umi';
import React, { useEffect, useState } from 'react';
import FileList from '@/components/form/FileList';
import SectionHeader from '@/components/form/SectionHeader';
import {
  message,
  Button,
  Input,
  Form,
  Row,
  Col,
  Table,
  InputNumber,
  Select,
} from 'antd';
import { LAMBS_MAP as approvalMap } from '@/pages/application/const';
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
  const [currentDetail, setCurrentDetail] = useState({});
  const [townList, setTownList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [supportContent, setSupportContent] = useState([]);
  const [stepActive, setStepActive] = useState(0);
  const [stepArray, setStepArray] = useState([]);
  const [position, setPosition] = useState(0);
  const [viewerArray, setViewerArray] = useState([]);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currImg, setCurrImg] = useState(0);
  const [operateAble, setOperateAble] = useState(false);
  const [form] = Form.useForm();
  const [typeForm, setTypeForm] = useState(21);
  const [loading, setLoading] = useState(false);
  const [approvalRecord, setApprovalRecord] = useState([]);
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
        title: '湖羊产业扶持审核详情',
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
        title: '乡镇经办人审核',
        time: '',
        advice: '',
        files: '',
        type: '',
        operator: '',
      },
      {
        title: '市养殖业发展服务中心审核',
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
        title: '公示',
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
        after[1] = {
          title: '乡镇经办人审核',
          time: shorter.hy_village_handle_at,
          advice: shorter.hy_village_handle_reason,
          files: shorter.hy_village_handle_attachment,
          type: '审核中',
          operator:
            shorter.admin_info &&
            shorter.admin_info.hy_village_handle_admin_info &&
            shorter.admin_info.hy_village_handle_admin_info.real_name,
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
          title: '乡镇经办人审核',
          time: shorter.hy_village_handle_at,
          advice: shorter.hy_village_handle_reason,
          files: shorter.hy_village_handle_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.hy_village_handle_admin_info &&
            shorter.admin_info.hy_village_handle_admin_info.real_name,
        };
        after[2] = {
          title: '市养殖业发展服务中心审核',
          time: shorter.hy_farm_at,
          advice: shorter.hy_farm_reason,
          files: shorter.hy_farm_attachment,
          type: '审核中',
          operator:
            shorter.admin_info &&
            shorter.admin_info.hy_farm_admin_info &&
            shorter.admin_info.hy_farm_admin_info.real_name,
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
          time: shorter.hy_village_handle_at,
          advice: shorter.hy_village_handle_reason,
          files: shorter.hy_village_handle_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.hy_village_handle_admin_info &&
            shorter.admin_info.hy_village_handle_admin_info.real_name,
        };
        after[2] = {
          title: '市养殖业发展服务中心审核',
          time: shorter.hy_farm_at,
          advice: shorter.hy_farm_reason,
          files: shorter.hy_farm_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.hy_farm_admin_info &&
            shorter.admin_info.hy_farm_admin_info.real_name,
        };
        after[3] = {
          title: '农业农村局审核',
          time: shorter.hy_unit_at,
          advice: shorter.hy_unit_reason,
          files: shorter.hy_unit_attachment,
          type: '审核中',
          operator:
            shorter.admin_info &&
            shorter.admin_info.hy_unit_admin_info &&
            shorter.admin_info.hy_unit_admin_info.real_name,
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
          time: shorter.hy_village_handle_at,
          advice: shorter.hy_village_handle_reason,
          files: shorter.hy_village_handle_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.hy_village_handle_admin_info &&
            shorter.admin_info.hy_village_handle_admin_info.real_name,
        };
        after[2] = {
          title: '市养殖业发展服务中心审核',
          time: shorter.hy_farm_at,
          advice: shorter.hy_farm_reason,
          files: shorter.hy_farm_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.hy_farm_admin_info &&
            shorter.admin_info.hy_farm_admin_info.real_name,
        };
        after[3] = {
          title: '农业农村局审核',
          time: shorter.hy_unit_at,
          advice: shorter.hy_unit_reason,
          files: shorter.hy_unit_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.hy_unit_admin_info &&
            shorter.admin_info.hy_unit_admin_info.real_name,
        };
        after[4] = {
          title: '公示',
          time: shorter.hy_public_at,
          advice: shorter.hy_public_reason,
          files: shorter.hy_public_attachment,
          type: '审核中',
          operator:
            shorter.admin_info &&
            shorter.admin_info.hy_public_admin_info &&
            shorter.admin_info.hy_public_admin_info.real_name,
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
          time: shorter.hy_village_handle_at,
          advice: shorter.hy_village_handle_reason,
          files: shorter.hy_village_handle_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.hy_village_handle_admin_info &&
            shorter.admin_info.hy_village_handle_admin_info.real_name,
        };
        after[2] = {
          title: '市养殖业发展服务中心审核',
          time: shorter.hy_farm_at,
          advice: shorter.hy_farm_reason,
          files: shorter.hy_farm_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.hy_farm_admin_info &&
            shorter.admin_info.hy_farm_admin_info.real_name,
        };
        after[3] = {
          title: '农业农村局审核',
          time: shorter.hy_unit_at,
          advice: shorter.hy_unit_reason,
          files: shorter.hy_unit_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.hy_unit_admin_info &&
            shorter.admin_info.hy_unit_admin_info.real_name,
        };
        after[4] = {
          title: '公示',
          time: shorter.hy_public_at,
          advice: shorter.hy_public_reason,
          files: shorter.hy_public_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.hy_public_admin_info &&
            shorter.admin_info.hy_public_admin_info.real_name,
        };
        after[5] = {
          title: '资金拨付',
          time: shorter.hy_fund_at,
          advice: shorter.hy_fund_reason,
          files: shorter.hy_fund_attachment,
          type: '审核中',
          operator:
            shorter.admin_info &&
            shorter.admin_info.hy_fund_admin_info &&
            shorter.admin_info.hy_fund_admin_info.real_name,
        };
        setStepArray(after);
        break;
      case 52:
        setPosition(5);
        setStepActive(5);
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
          time: shorter.hy_village_handle_at,
          advice: shorter.hy_village_handle_reason,
          files: shorter.hy_village_handle_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.hy_village_handle_admin_info &&
            shorter.admin_info.hy_village_handle_admin_info.real_name,
        };
        after[2] = {
          title: '市养殖业发展服务中心审核',
          time: shorter.hy_farm_at,
          advice: shorter.hy_farm_reason,
          files: shorter.hy_farm_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.hy_farm_admin_info &&
            shorter.admin_info.hy_farm_admin_info.real_name,
        };
        after[3] = {
          title: '农业农村局审核',
          time: shorter.hy_unit_at,
          advice: shorter.hy_unit_reason,
          files: shorter.hy_unit_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.hy_unit_admin_info &&
            shorter.admin_info.hy_unit_admin_info.real_name,
        };
        after[4] = {
          title: '公示',
          time: shorter.hy_public_at,
          advice: shorter.hy_public_reason,
          files: shorter.hy_public_attachment,
          type: '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.hy_public_admin_info &&
            shorter.admin_info.hy_public_admin_info.real_name,
        };
        after[5] = {
          title: '资金拨付',
          time: shorter.hy_fund_at,
          advice: shorter.hy_fund_reason,
          type: shorter.real_fund_amount
            ? '资金拨付' + shorter.real_fund_amount + '万元'
            : '通过',
          operator:
            shorter.admin_info &&
            shorter.admin_info.hy_fund_admin_info &&
            shorter.admin_info.hy_fund_admin_info.real_name,
        };
        setStepArray(after);
        break;
      case 59:
        setPosition(5);
        setOperateAble(true);
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
                if (res.data.hy_farm_admin_id == userId) {
                  setAuditMatch(true);
                }
                break;
              case 31:
                if (res.data.hy_unit_admin_id == userId) {
                  setAuditMatch(true);
                }
                break;
              case 41:
                if (res.data.hy_public_admin_id == userId) {
                  setAuditMatch(true);
                }
                break;
              case 51:
                if (res.data.hy_fund_admin_id == userId) {
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
              principal: subInfo.principal,
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
              mobile: subInfo.mobile,
              bank: subInfo.bank,
              bank_account: subInfo.bank_account,
              link_person: subInfo.link_person,
              collect_num: subInfo.collect_num,
              dry_num: subInfo.dry_num,
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
            // 扶持内容
            setSupportContent(JSON.parse(subInfo.support_content));
            setTimeout(() => {
              process(shorter);
            }, 100);
            if (shorter?.status == 51) {
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

  // 不通过
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

  // 通过
  const onFinish = (values: any) => {
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
      // real_fund_amount: position == 5 ? values.real_fund_amount : undefined,
    };
    if (position == 5) {
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
      record_type: 9,
    })
      .then((res) => {
        setApprovalRecord(res.data.list);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let bottomContentVariable;
  if (typeForm == 24) {
    bottomContentVariable = (
      <>
        <div>
          <SectionHeader title="1.设施农业用地备案" />
          <FileList
            list={
              currentDetail.materials_list && currentDetail.materials_list[51]
                ? currentDetail.materials_list[51]
                : []
            }
            customFieldNames={fileListCustomFieldNames}
          />
        </div>
        <div>
          <SectionHeader title="2.环评证明" />
          <FileList
            list={
              currentDetail.materials_list && currentDetail.materials_list[52]
                ? currentDetail.materials_list[52]
                : []
            }
            customFieldNames={fileListCustomFieldNames}
          />
        </div>
        <div>
          <SectionHeader title="3.营业执照" />
          <FileList
            list={
              currentDetail.materials_list && currentDetail.materials_list[53]
                ? currentDetail.materials_list[53]
                : []
            }
            customFieldNames={fileListCustomFieldNames}
          />
        </div>
        <div>
          <SectionHeader title="4.引种证明材料（发票、运输证明、系谱）" />
          <FileList
            list={
              currentDetail.materials_list && currentDetail.materials_list[54]
                ? currentDetail.materials_list[54]
                : []
            }
            customFieldNames={fileListCustomFieldNames}
          />
        </div>
        <div>
          <SectionHeader title="5.养殖档案" />
          <FileList
            list={
              currentDetail.materials_list && currentDetail.materials_list[55]
                ? currentDetail.materials_list[55]
                : []
            }
            customFieldNames={fileListCustomFieldNames}
          />
        </div>
        <div>
          <SectionHeader title="6.其他证明材料" />
          <FileList
            list={
              currentDetail.materials_list && currentDetail.materials_list[56]
                ? currentDetail.materials_list[56]
                : []
            }
            customFieldNames={fileListCustomFieldNames}
          />
        </div>
      </>
    );
  }

  let formContentVariable;
  if (typeForm == 24) {
    formContentVariable = (
      <>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="principal" label="负责人">
              <Input placeholder="负责人" disabled style={{ width: 200 }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="mobile" label="电话">
              <Input disabled placeholder="电话" style={{ width: 200 }} />
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
            <Form.Item name="bank" label="申请单位开户银行">
              <Input
                disabled
                placeholder="申请单位开户银行"
                style={{ width: 200 }}
              />
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
            <Form.Item name="bank_account" label="账号">
              <Input disabled placeholder="账号" style={{ width: 200 }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="link_person" label="联系人">
              <Input disabled placeholder="联系人" style={{ width: 200 }} />
            </Form.Item>
          </Col>
        </Row>
      </>
    );
  }

  // 表格表头
  const columnsDeclare = [
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '数量',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '面积（平方米）',
      dataIndex: 'area',
      key: 'area',
    },
    {
      title: '要求补助资金（万元）',
      dataIndex: 'help_price',
      key: 'help_price',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
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
            {formContentVariable}
          </Form>

          <div className={styles.subTitle}>扶持内容</div>
          <Table
            bordered
            size="small"
            columns={columnsDeclare}
            dataSource={supportContent}
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
              layout="vertical"
              onFinish={(values) => onFinish(values)}
            >
              {position == 5 ? (
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
                      max={5}
                      watchUploading={watchUploading}
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
