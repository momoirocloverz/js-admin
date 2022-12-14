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
    1: '???',
    2: '???',
    3: '???',
    4: '??????',
    5: '??????',
    6: '??????',
    7: '??????',
  };
  const initAction = () => {
    commitGlobalBread([
      {
        title: '??????????????????',
        triggerOn: true,
      },
      {
        title: '???????????????????????????????????????',
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
        title: '????????????',
        time: '',
        advice: '',
        files: '',
        type: '',
        operator: '',
      },
      {
        title: '????????????????????????',
        time: '',
        advice: '',
        files: '',
        type: '',
        operator: '',
      },
      {
        title: '??????',
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
          title: '????????????',
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
          title: '????????????',
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
          title: '????????????',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        after[1] = {
          title: '????????????????????????',
          time: shorter.whh_farm_at,
          advice: shorter.whh_farm_reason,
          files: shorter.whh_farm_attachment,
          type: '?????????',
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
          title: '????????????',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        after[1] = {
          title: '????????????????????????',
          time: shorter.whh_farm_at,
          advice: shorter.whh_farm_reason,
          files: shorter.whh_farm_attachment,
          type: '??????',
          operator:
            shorter.admin_info &&
            shorter.admin_info.whh_farm_admin_info &&
            shorter.admin_info.whh_farm_admin_info.real_name,
        };
        after[2] = {
          title: '??????',
          time: shorter.whh_public_at,
          advice: shorter.whh_public_reason,
          files: shorter.whh_public_attachment,
          type: '?????????',
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
          title: '????????????',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        after[1] = {
          title: '????????????????????????',
          time: shorter.whh_farm_at,
          advice: shorter.whh_farm_reason,
          files: shorter.whh_farm_attachment,
          type: '??????',
          operator:
            shorter.admin_info &&
            shorter.admin_info.whh_farm_admin_info &&
            shorter.admin_info.whh_farm_admin_info.real_name,
        };
        after[2] = {
          title: '??????',
          time: shorter.whh_public_at,
          advice: shorter.whh_public_reason,
          files: shorter.whh_public_attachment,
          type: '??????',
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
          title: '????????????',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        after[1] = {
          title: '????????????????????????',
          time: shorter.whh_farm_at,
          advice: shorter.whh_farm_reason,
          files: shorter.whh_farm_attachment,
          type: '??????',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_handle_admin_info &&
            shorter.admin_info.village_handle_admin_info.real_name,
        };
        after[2] = {
          title: '??????',
          time: shorter.whh_public_at,
          advice: shorter.whh_public_reason,
          files: shorter.whh_public_attachment,
          type: '?????????',
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
          title: '????????????',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        after[1] = {
          title: '????????????????????????',
          time: shorter.whh_farm_at,
          advice: shorter.whh_farm_reason,
          files: shorter.whh_farm_attachment,
          type: '??????',
          operator:
            shorter.admin_info &&
            shorter.admin_info.whh_farm_admin_info &&
            shorter.admin_info.whh_farm_admin_info.real_name,
        };
        after[2] = {
          title: '??????',
          time: shorter.whh_public_at,
          advice: shorter.whh_public_reason,
          files: shorter.whh_public_attachment,
          type: '??????',
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
          title: '????????????',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        after[1] = {
          title: '????????????????????????',
          time: shorter.whh_farm_at,
          advice: shorter.whh_farm_reason,
          files: shorter.whh_farm_attachment,
          type: '??????',
          operator:
            shorter.admin_info &&
            shorter.admin_info.whh_farm_admin_info &&
            shorter.admin_info.whh_farm_admin_info.real_name,
        };
        after[2] = {
          title: '??????',
          time: shorter.whh_public_at,
          advice: shorter.whh_public_reason,
          files: shorter.whh_public_attachment,
          type: '??????',
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
        title: '????????????',
        time: '',
        advice: '',
        files: '',
        type: '',
        operator: '',
      },
      {
        title: '????????????????????????',
        time: '',
        advice: '',
        files: '',
        type: '',
        operator: '',
      },
      {
        title: '??????',
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
          title: '????????????',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        after[1] = {
          title: '????????????????????????',
          time: '',
          advice: '',
          files: '',
          type: '?????????',
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
          title: '????????????',
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
          title: '????????????',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        after[1] = {
          title: '????????????????????????',
          time: shorter.whh_sq_farm_at,
          advice: shorter.whh_sq_farm_reason,
          files: shorter.whh_sq_farm_attachment,
          type: '?????????',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_handle_admin_info &&
            shorter.admin_info.village_handle_admin_info.real_name,
        };
        after[2] = {
          title: '??????',
          time: shorter.whh_sq_public_at,
          advice: shorter.whh_sq_public_reason,
          files: shorter.whh_sq_public_attachment,
          type: '?????????',
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
          title: '????????????',
          time: shorter.created_at,
          advice: '',
          files: '',
          type: '',
          operator:
            shorter.submit_userinfo && shorter.submit_userinfo.real_name,
        };
        after[1] = {
          title: '????????????????????????',
          time: shorter.whh_sq_farm_at,
          advice: shorter.whh_sq_farm_reason,
          files: shorter.whh_sq_farm_attachment,
          type: '??????',
          operator:
            shorter.admin_info &&
            shorter.admin_info.village_handle_admin_info &&
            shorter.admin_info.village_handle_admin_info.real_name,
        };
        after[2] = {
          title: '??????',
          time: shorter.whh_sq_public_at,
          advice: shorter.whh_sq_public_reason,
          files: shorter.whh_sq_public_attachment,
          type: shorter.real_fund_amount
            ? '????????????' + shorter.real_fund_amount + '??????'
            : '??????',
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
              is_insurance_text: subInfo.is_insurance == 1 ? '???' : '???',
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
              // ????????????????????? ????????????
              getSubItemList({
                policy_document_id: shorter.policy_document_id,
              });
            }
            setCollect_list(subInfo.collect_list);
            if (shorter.status > 30) {
              // ??????tab???????????????
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
                    setAreaList([{ name: '?????????' }, track1, track2]);
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
          label: `${v.fund_subitem_info.subitem_name}(??????${v.remain_amount}???)`,
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

  // type: 1-?????? 2-??????
  const submitAction = (type) => {
    if (currentStatus == 0) {
      return message.error('??????????????????????????????');
    }
    if (currentStatus >= 30 && activeKey == 1) {
      return message.error('??????????????????????????????????????????');
    }
    if (currentStatus == 30 || currentStatus == 33) {
      return message.error('??????????????????????????????');
    }
    littleForm
      .validateFields()
      .then((res) => {
        if (currentStatus >= 30 && activeKey == 1) {
          return message.error('??????????????????????????????????????????');
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
        // return console.log('???????????????', data);
        Apis.projectSubAction(data)
          .then((res: any) => {
            if (res && res.code === 0) {
              message.success('????????????');
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
      return message.error('??????????????????????????????');
    }
    if (currentStatus >= 30 && activeKey == 1) {
      return message.error('??????????????????????????????????????????');
    }
    if (currentStatus == 30 || currentStatus == 33) {
      return message.error('??????????????????????????????');
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
      // ????????????
      const { amount, rel_subitem_id } = values;
      data.rel_subitem_list = [{ rel_subitem_id, amount }];
    }
    // return console.log('????????????', data);
    Apis.projectSubAction(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          message.success('????????????');
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

  // ??????????????????
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
          <SectionHeader title="????????????" />
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
            <Form.Item name="month" label="??????">
              <Input placeholder="??????" disabled style={{ width: 200 }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="duty_company" label="????????????">
              <Input disabled placeholder="????????????" style={{ width: 200 }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="link_mobile" label="????????????">
              <Input disabled placeholder="????????????" style={{ width: 200 }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="is_insurance_text" label="???????????????">
              <Input disabled placeholder="???????????????" style={{ width: 200 }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="??????">
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
          <Form.Item name="date_range" label="????????????">
            <Input placeholder="????????????" disabled style={{ width: 200 }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="apply_company" label="????????????">
            <Input disabled placeholder="????????????" style={{ width: 200 }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name="js_person" label="?????????">
            <Input disabled placeholder="?????????" style={{ width: 200 }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="js_person_mobile" label="?????????????????????">
            <Input
              disabled
              placeholder="?????????????????????"
              style={{ width: 200 }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name="link_principal" label="?????????">
            <Input disabled placeholder="?????????" style={{ width: 200 }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="link_principal_mobile" label="?????????????????????">
            <Input
              disabled
              placeholder="?????????????????????"
              style={{ width: 200 }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name="check_person" label="?????????">
            <Input disabled placeholder="?????????" style={{ width: 200 }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="check_person_mobile" label="?????????????????????">
            <Input
              disabled
              placeholder="?????????????????????"
              style={{ width: 200 }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label="??????">
            {areaList.map((ele, index) => (
              <span key={index}>{ele.name}</span>
            ))}
          </Form.Item>
        </Col>
      </Row>
    </>
  );

  // ??????????????????
  const columnsDeclare = [
    {
      title: '??????',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '??????',
      dataIndex: 'type',
      key: 'type',
      render: (text, record, index) => {
        return typeMap[text];
      },
    },
    {
      title: '??????',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '??????(kg)',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: '?????????????????????',
      dataIndex: 'number_no_ins',
      key: 'number_no_ins',
    },
    {
      title: '??????',
      dataIndex: 'remark',
      key: 'remark',
    },
  ];

  // ??????????????????
  const columnsApply = [
    {
      title: '??????',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '??????',
      dataIndex: 'type',
      key: 'type',
      render: (text, record, index) => {
        return typeMap[text];
      },
    },
    {
      title: '??????',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '??????(kg)',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: '????????????',
      dataIndex: 'subsidy_standard',
      key: 'subsidy_standard',
    },
    {
      title: '????????????',
      dataIndex: 'subsidy_amount',
      key: 'subsidy_amount',
    },
    {
      title: '?????????70%',
      dataIndex: 'pre_pay',
      key: 'pre_pay',
    },
  ];

  // ??????????????????
  const columns = [
    {
      title: '????????????',
      dataIndex: 'action_type',
      align: 'center',
      render: (text: any, record: any) => <div>{approvalMap[text].title}</div>,
    },
    {
      title: '?????????',
      dataIndex: 'action_username',
      align: 'center',
    },
    {
      title: '????????????',
      dataIndex: 'updated_at',
      align: 'center',
    },
    {
      title: '??????',
      dataIndex: 'action_content',
      align: 'center',
    },
    {
      title: '??????',
      dataIndex: 'attachment',
      align: 'center',
      render: (text: any, record: any) => (
        <div onClick={() => showAttachment(text)}>
          {text && text.length && JSON.stringify(text) != '{}'
            ? '????????????'
            : '-'}
        </div>
      ),
    },
  ];
  const simplePosition = currentStatus > 30 ? positionApply : positionDeclare;
  // ????????????
  const declareComponent = () => {
    return (
      <div className={styles.homePageCon}>
        <div className={styles.leftCon}>
          <div className={styles.leftTopCon}>
            <div className={styles.subTitle}>????????????</div>
            <Form
              {...formItemLayout}
              form={form}
              name="nest-messages"
              labelAlign={'left'}
              className={styles.formCon}
            >
              {formContentDeclare}
            </Form>
            <div className={styles.subTitle}>????????????</div>
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
            <div className={styles.subTitle}>????????????</div>
            {bottomContentVariable}
          </div>

          <div className={styles.leftBottomCon}>
            <div className={styles.subTitle}>????????????</div>
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
                  label="????????????"
                  rules={[{ required: true, message: '????????????????????????' }]}
                >
                  <TextArea
                    rows={4}
                    placeholder="?????????????????????"
                    disabled={operateAble}
                  />
                </Form.Item>
                <Form.Item
                  label="????????????"
                  name="attachment"
                  rules={[{ required: true, message: '????????????????????????' }]}
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
                    ??????
                  </Button>
                  <Button
                    className={styles.marginLeft20}
                    onClick={submitAction}
                    disabled={operateAble || buttonDisable}
                  >
                    ?????????
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
                  {item.operator ? <p>?????????:{item.operator}</p> : ''}
                  {item.type ? <p>??????:{item.type}</p> : ''}
                  {item.files && item.files.length ? (
                    <p>
                      ??????:
                      {item.files != '[]' && item.files.length ? (
                        <span
                          className={styles.blue}
                          onClick={() => popImgPreview(item)}
                        >
                          {item.files == '[]' || !item.files.length
                            ? '???'
                            : '????????????'}
                        </span>
                      ) : (
                        '???'
                      )}
                    </p>
                  ) : (
                    ''
                  )}
                  {item.advice ? <p>????????????:{item.advice}</p> : ''}
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
  // ??????
  const applyComponent = () => {
    return (
      <div className={styles.homePageCon}>
        <div className={styles.leftCon}>
          <div className={styles.leftTopCon}>
            <div className={styles.subTitle}>????????????</div>
            <Form
              {...formItemLayout}
              form={form}
              name="nest-messages"
              labelAlign={'left'}
              className={styles.formCon}
            >
              {formContentApply}
            </Form>
            <div className={styles.subTitle}>????????????</div>
            <Table
              bordered
              size="small"
              columns={columnsApply}
              dataSource={apply_collect_list}
              pagination={false}
              rowKey={(item, index) => index}
            />
            <div className={styles.leftBottomCon}>
              <div className={styles.subTitle}>????????????</div>
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
                      label="??????????????????"
                      name="rel_subitem_id"
                      className={styles.recontrol}
                      rules={[
                        { required: true, message: '???????????????????????????' },
                      ]}
                    >
                      <Select
                        placeholder="???????????????????????????"
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
                      label="??????????????????(??????)"
                      name="amount"
                      rules={[
                        { required: true, message: '????????????????????????????????????' },
                      ]}
                      className={styles.recontrol}
                    >
                      <InputNumber
                        max={9999999999}
                        disabled={operateAble}
                        className={styles.resetInput}
                        precision={2}
                        min={0}
                        placeholder="?????????????????????????????????"
                      />
                    </Form.Item>

                    <div className={styles.btnsFlex}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={operateAble || buttonDisable}
                      >
                        ??????????????????
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Form.Item name="reply_content" label="????????????">
                      <TextArea
                        rows={4}
                        placeholder="?????????????????????"
                        disabled={operateAble}
                      />
                    </Form.Item>
                    <Form.Item label="????????????" name="attachment">
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
                        ??????
                      </Button>
                      <Button
                        className={styles.marginLeft20}
                        onClick={submitAction}
                        disabled={operateAble || buttonDisable}
                      >
                        ?????????
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
                  {item.operator ? <p>?????????:{item.operator}</p> : ''}
                  {item.type ? <p>??????:{item.type}</p> : ''}
                  {item.files && item.files.length ? (
                    <p>
                      ??????:
                      {item.files != '[]' && item.files.length ? (
                        <span
                          className={styles.blue}
                          onClick={() => popImgPreview(item)}
                        >
                          {item.files == '[]' || !item.files.length
                            ? '???'
                            : '????????????'}
                        </span>
                      ) : (
                        '???'
                      )}
                    </p>
                  ) : (
                    ''
                  )}
                  {item.advice ? <p>????????????:{item.advice}</p> : ''}
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

  // ????????????
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
      <Tabs.TabPane tab="????????????" key="1">
        {declareComponent()}
      </Tabs.TabPane>
      <Tabs.TabPane tab="??????" key="2" disabled={currentStatus <= 30}>
        {applyComponent()}
      </Tabs.TabPane>
    </Tabs>
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(PolicyDocumentPage);
