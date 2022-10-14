import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState, useRef, Component } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import PdfUpload from '../pdfUpload';
import {
  message,
  Form,
  Input,
  Select,
  Divider,
  Button,
  DatePicker,
  Checkbox,
  Popconfirm,
  Modal,
  Spin,
} from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import moment from 'moment';
const { RangePicker } = DatePicker;
import useUser from '@/components/system/useUser';
import tinymce from 'tinymce';
import editorConfig from '@/utils/tinymce_config';
import FundSource from '../components/FundSource';
const CheckboxGroup = Checkbox.Group;
const { Option, OptGroup } = Select;
const options = [
  { label: '1、项目申报书', value: '1' },
  { label: '2、项目实施方案简表', value: '2' },
  { label: '3、营业执照复印件', value: '3' },
  { label: '4、土地流转协议等用地手续', value: '4' },
  { label: '5、项目购置设备设施清单（包括型号、预估价）', value: '5' },
  { label: '6、项目有关工程设计及投资情况佐证材料', value: '6' },
  { label: '7、项目建设内容布置示意图及区域现状照片', value: '10' },
  { label: '8、涉及生产设施用房建设的需提供设施用地审批材料', value: '8' },
  { label: '9、项目建设区域内近二年各级财政资金扶持情况', value: '9' },
  { label: '10、根据项目建设需要提供的其他材料', value: '7' },
];
const extraPersonnelFields = [
  // { label: '项目负责人', paramName: 'admin_id' },
  { label: '项目申报材料审核负责人', paramName: 'audit_admin_id' },
  { label: '评审负责人', paramName: 'review_admin_id' },
  { label: '联审负责人', paramName: 'unit_admin_id' },
  { label: '公示负责人', paramName: 'pass_admin_id' },
  { label: '项目变更审批负责人', paramName: 'change_admin_id' },
  { label: '项目实施进度汇报负责人', paramName: 'implement_schedule_admin_id' },
  { label: '项目验收审核人', paramName: 'ys_audit_admin_id' },
  { label: '项目验收负责人', paramName: 'acceptance_check_admin_id' },
  { label: '资金拨付初审负责人', paramName: 'fund_first_admin_id' },
  { label: '资金拨付二审负责人', paramName: 'fund_second_admin_id' },
  { label: '确认资金拨付负责人', paramName: 'fund_confirm_admin_id' },
];
const inclusivePolicyMatch = [
  { label: '项目负责人', paramName: 'admin_id' },
  { label: '农业农村局审核人', paramName: 'agriculture_leader_id' },
  { label: '公示人（政府网）', paramName: 'public_government_id' },
  { label: '资金拨付负责人', paramName: 'amount_leader_id' },
];

const huLambsMatch = [
  { label: '项目负责人', paramName: 'admin_id' },
  { label: '养殖业发展中心', paramName: 'hy_farm_admin_id' },
  { label: '联审', paramName: 'hy_unit_admin_id' },
  { label: '公示（农业农村局）', paramName: 'hy_public_admin_id' },
  { label: '资金拨付负责人', paramName: 'hy_fund_admin_id' },
];

const harmlessMatch = [
  { label: '项目负责人', paramName: 'admin_id' },
  { label: '养殖中心人员', paramName: 'whh_farm_admin_id' },
  { label: '公示（农业农村局）', paramName: 'whh_public_admin_id' },
  { label: '资金拨付负责人', paramName: 'whh_fund_admin_id' },
];

const cropsMatch = [
  { label: '项目负责人', paramName: 'admin_id', roleType: 10 },
  // { label: '公示人（所在村）', paramName: 'ly_cun_public_admin_id' },
  // { label: '村级审核人', paramName: 'ly_cun_audit_admin_id' },
  // { label: '乡镇农技中心', paramName: 'ly_village_njzx_admin_id' },
  // { label: '乡镇审核人员', paramName: 'ly_village_audit_admin_id' },
  {
    label: '农业农村局审核人',
    paramName: 'ly_rural_audit_admin_id',
    roleType: 10,
  },
  // {
  //   label: '第三方公司核查审核人',
  //   paramName: 'ly_three_company_admin_id',
  //   roleType: 11,
  // },
  {
    label: '公示人（政府网）',
    paramName: 'ly_public_govn_admin_id',
    roleType: 10,
  },
  { label: '资金拨付人', paramName: 'ly_fund_admin_id', roleType: null },
];

const dateFormat = 'YYYY-MM-DD';
const PolicyEditDocumentPage = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [loginStatus, setLoginStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const currentSelect = useRef(null);
  const [categoryArray, setCategoryArray] = useState([]);
  const [selectValue, setSelectValue] = useState('');
  const [isInclusivePolicy, setIsInclusivePolicy] = useState(true);
  const [isHuLambs, setIsHuLambs] = useState(false);
  const [isHarmless, setIsHarmless] = useState(false);
  const [isCrops, setIsCrops] = useState(false);
  const [is_contend, setIs_contend] = useState(2);
  const [checkedList, setCheckedList] = useState<any>([]);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [adminValue, setAdminValue] = useState(undefined);
  const [currentDetail, setCurrentDetail] = useState<any>({});
  const [underStandOption, setUnderStandOption] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [imgPre, setImgPre] = useState(
    'https://jiangshan-tzyjs-img.zjsszxc.com/',
  );
  const [dateCheck, setDateCheck] = useState<any>('');
  const [editorRef, setEditorRef] = useState<any>(null);
  const [inclusivePolicyItemInfoId, setInclusivePolicyItemInfoId] = useState(
    [],
  );
  const [pdfUrl, setPdfUrl] = useState([]);
  const {
    data: [userDict, userOptions],
  }: any = useUser('');
  const [form] = Form.useForm();
  const [innerForm] = Form.useForm();
  const fundSourceRef: any = useRef();
  const [originSubItem, setOriginSubItem] = useState([]); // 编辑时已有分项数据
  const [projectType, setProjectType] = useState(''); // 当前政策类型
  const [isLoading, setIsloading] = useState(false);

  const initAction = () => {
    commitGlobalBread([
      {
        title: '发布中心',
        triggerOn: true,
      },
      {
        title: '政策文件编辑',
      },
    ]);
  };
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };

  const getPdfData = (arr: any) => {
    setPdfUrl(arr);
    if (arr.length) {
      form.setFieldsValue({
        accessory: arr,
      });
    } else {
      form.setFieldsValue({
        accessory: '',
      });
    }
  };
  const fetchCurrent = () => {
    if (location.query.id) {
      let data = {
        id: location.query.id,
      };
      setIsloading(true);
      Apis.fetchPolicyDocumentInfo(data)
        .then((res: any) => {
          if (res && res.code === 0) {
            setCurrentDetail(res.data);
            form.setFieldsValue({
              title: res.data.title,
              article_type: +res.data.article_type,
              content: res.data.content,
              admin_id: res.data.admin_id ? res.data.admin_id : undefined,
              is_contend: res.data.is_contend,
              project_declaration_name: res.data.project_declaration_name,
              dateCheck: res.data.issue_at,
              audit_admin_id: res.data.audit_admin_id
                ? res.data.audit_admin_id
                : undefined,
              review_admin_id: res.data.review_admin_id
                ? res.data.review_admin_id
                : undefined,
              unit_admin_id: res.data.unit_admin_id
                ? res.data.unit_admin_id
                : undefined,
              pass_admin_id: res.data.pass_admin_id
                ? res.data.pass_admin_id
                : undefined,
              change_admin_id: res.data.change_admin_id
                ? res.data.change_admin_id
                : undefined,
              implement_schedule_admin_id: res.data.implement_schedule_admin_id
                ? res.data.implement_schedule_admin_id
                : undefined,
              ys_audit_admin_id: res.data.ys_audit_admin_id
                ? res.data.ys_audit_admin_id
                : undefined,
              acceptance_check_admin_id: res.data.acceptance_check_admin_id
                ? res.data.acceptance_check_admin_id
                : undefined,
              fund_first_admin_id: res.data.fund_first_admin_id
                ? res.data.fund_first_admin_id
                : undefined,
              fund_second_admin_id: res.data.fund_second_admin_id
                ? res.data.fund_second_admin_id
                : undefined,
              fund_confirm_admin_id: res.data.fund_confirm_admin_id
                ? res.data.fund_confirm_admin_id
                : undefined,
              agriculture_leader_id: res.data.agriculture_leader_id
                ? res.data.agriculture_leader_id
                : undefined,
              public_government_id: res.data.public_government_id
                ? res.data.public_government_id
                : undefined,
              amount_leader_id: res.data.amount_leader_id
                ? res.data.amount_leader_id
                : undefined,
              hy_unit_admin_id: res.data.hy_unit_admin_id
                ? res.data.hy_unit_admin_id
                : undefined,
              hy_farm_admin_id: res.data.hy_farm_admin_id
                ? res.data.hy_farm_admin_id
                : undefined,
              hy_public_admin_id: res.data.hy_public_admin_id
                ? res.data.hy_public_admin_id
                : undefined,
              hy_fund_admin_id: res.data.hy_fund_admin_id
                ? res.data.hy_fund_admin_id
                : undefined,
              whh_farm_admin_id: res.data.whh_farm_admin_id
                ? res.data.whh_farm_admin_id
                : undefined,
              whh_public_admin_id: res.data.whh_public_admin_id
                ? res.data.whh_public_admin_id
                : undefined,
              whh_fund_admin_id: res.data.whh_fund_admin_id
                ? res.data.whh_fund_admin_id
                : undefined,
              ly_rural_audit_admin_id:
                res.data.ly_rural_audit_admin_id || undefined,
              ly_three_company_admin_id:
                res.data.ly_three_company_admin_id || undefined,
              ly_public_govn_admin_id:
                res.data.ly_public_govn_admin_id || undefined,
              ly_fund_admin_id: res.data.ly_fund_admin_id || undefined,
              accessory: res.data.accessory || undefined,
            });
            if (res.data.get_category) {
              const { category_name } = res.data.get_category;
              if (
                ['秸秆综合利用补贴', '有机肥使用补贴'].includes(category_name)
              ) {
                setIsInclusivePolicy(true);
                setProjectType('project_sub');
              } else if (category_name.indexOf('湖羊') > -1) {
                setIsInclusivePolicy(false);
                setIsHuLambs(true);
                setProjectType('project_sub');
              } else if (category_name.indexOf('无害化') > -1) {
                setIsInclusivePolicy(false);
                setIsHarmless(true);
                setProjectType('project_sub');
              } else if (category_name.indexOf('粮油适度') > -1) {
                setIsInclusivePolicy(false);
                setIsCrops(true);
                setProjectType('project_sub');
              } else {
                setIsInclusivePolicy(false);
                setProjectType('project');
              }
            } else {
              setIsInclusivePolicy(false);
            }
            setIs_contend(+res.data.is_contend);
            if (res.data.department) {
              form.setFieldsValue({ department: res.data.department });
            }
            if (res.data.aging) {
              form.setFieldsValue({ aging: res.data.aging });
            }
            if (res.data.understand_paper_id) {
              form.setFieldsValue({
                understand_paper_id: res.data.understand_paper_id,
              });
            }
            if (res.data.issue_at) {
              form.setFieldsValue({
                issue_at: moment(res.data.issue_at, dateFormat),
              });
              setDateCheck(moment(res.data.issue_at, dateFormat));
            }
            if (res.data.declare_start_at) {
              form.setFieldsValue({
                timeRange: [
                  moment(res.data.declare_start_at, dateFormat),
                  moment(res.data.declare_end_at, dateFormat),
                ],
              });
            }
            // console.log(values.timeRange);
            let emptyArray = [];
            if (res.data.is_business_license == 2) {
              emptyArray.push('3');
            }
            if (res.data.is_declaration == 2) {
              emptyArray.push('1');
            }
            if (res.data.is_device_list == 2) {
              emptyArray.push('5');
            }
            if (res.data.is_engineering_design == 2) {
              emptyArray.push('6');
            }
            if (res.data.is_land == 2) {
              emptyArray.push('4');
            }
            if (res.data.is_other_material == 2) {
              emptyArray.push('7');
            }
            if (res.data.is_scheme == 2) {
              emptyArray.push('2');
            }
            if (res.data.is_facility == 2) {
              emptyArray.push('8');
            }
            if (res.data.is_financial_support == 2) {
              emptyArray.push('9');
            }
            if (res.data.is_regional_photo == 2) {
              emptyArray.push('10');
            }
            let source = {
              id: res.data.project_capital_source_id,
            };
            Apis.projectCapitalSourceInfo(source).then((res) => {
              if (res && res.code == 0) {
                if (res.data?.info) {
                  initSubItem([res.data.info]);
                } else {
                  initSubItem([]);
                }
              }
            });
            setCheckedList(emptyArray);
            if (res.data.accessory && res.data.accessory.length) {
              const accessory = res.data.accessory;
              setPdfUrl(
                typeof accessory == 'string'
                  ? JSON.parse(accessory)
                  : accessory,
              );
            } else {
              setPdfUrl([]);
            }
          } else {
            message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(' err ', err);
        })
        .finally(() => {
          setIsloading(false);
        });
    }
  };

  // 编辑时初始化已选分项数据
  const initSubItem = (data: any = []) => {
    const result = data;
    setOriginSubItem(result);
  };

  const fetchUnderStand = () => {
    Apis.fetchUnderstandPaperAllList({})
      .then((res: any) => {
        if (res && res.code === 0) {
          let hi = res.data;
          let newData = hi.map((ele: any) => {
            return {
              label: ele.title,
              value: ele.id,
              key: ele.id,
            };
          });
          setUnderStandOption(newData);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  useEffect(() => {
    initAction();
    fetchCategoryList();
    fetchUnderStand();
    fetchCurrent();
  }, []);

  useEffect(() => {
    if (Object.keys(currentDetail).length && editorRef) {
      tinymce.activeEditor.setContent(currentDetail.content, {
        format: 'html',
      });
    }
  }, [currentDetail, editorRef]);

  const generateRuralOptions = () => {
    let result: any = [];
    Object.keys(userDict).filter((v) => {
      let ele = userDict[v];
      if (ele.role_type == 10) {
        result.push({
          value: ele.id,
          label: `${ele.username}(${ele.real_name})`,
        });
      }
    });
    return result;
  };

  // 根据roleType过滤角色
  const filterRoleByRoleType = (roleType: any) => {
    let result: any = [];
    Object.keys(userDict).filter((v) => {
      let ele = userDict[v];
      if (ele.role_type == roleType) {
        result.push({
          value: ele.id,
          label: `${ele.username}(${ele.real_name})`,
        });
      }
    });
    return result;
  };

  const uploadImageCallBack = async (
    value: any,
    success: Function,
    fail: Function,
  ) => {
    const form = new FormData();
    form.append('file', value.blob());
    const res: any = await Apis.uploadImages(form);
    if (res && res.code === 0) {
      success && success(`${imgPre}${res.data.img_url}`);
    } else {
      message.error(res.msg);
      fail && fail(res);
    }
  };
  const fetchCategoryList = () => {
    Apis.fetchPolicyCategoryList({})
      .then((res: any) => {
        if (res && res.code === 0) {
          setCategoryArray(res.data);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const fetchInclusivePolicyItemInfo = () => {
    let outer: any = categoryArray.find((ele: any) => {
      return ele.category_name == '惠农补贴';
    });
    if (outer) {
      let sec = outer.get_parent_do.filter((sub: any) => {
        return (
          sub.category_name == '秸秆综合利用补贴' ||
          sub.category_name == '有机肥使用补贴'
        );
      });
      let after = sec.map((ele: any) => {
        return ele.id;
      });
      setInclusivePolicyItemInfoId(after);
    }
  };

  const selectChange = (e: any) => {
    let finianceItem: any =
      categoryArray.find(
        (item: any) => item.category_name == '竞争性财政支农项目',
      ) || [];
    if (finianceItem && finianceItem['id'] == e) {
      // 选择了竞争性财政
      setIsHuLambs(false);
      setIsHarmless(false);
      setIsCrops(false);
      setIsInclusivePolicy(false);
      setProjectType('project');
    } else {
      let helpFarmerArray: any =
        categoryArray.find((ele: any) => {
          return ele.category_name == '惠农补贴';
        }) || {};

      let selectedItem = helpFarmerArray.get_parent_do.filter(
        (item: any) => item.id == e,
      );

      if (selectedItem && selectedItem[0]) {
        const selectedName = selectedItem[0].category_name;
        if (['秸秆综合利用补贴', '有机肥使用补贴'].includes(selectedName)) {
          setIsHuLambs(false);
          setIsHarmless(false);
          setIsCrops(false);
          setIsInclusivePolicy(true);
        } else if (selectedName.indexOf('湖羊') > -1) {
          setIsInclusivePolicy(false);
          setIsHarmless(false);
          setIsCrops(false);
          setIsHuLambs(true);
        } else if (selectedName == '病死动物无害化处理补贴') {
          setIsInclusivePolicy(false);
          setIsHuLambs(false);
          setIsCrops(false);
          setIsHarmless(true);
        } else if (selectedName.indexOf('粮油适度') > -1) {
          setIsInclusivePolicy(false);
          setIsHuLambs(false);
          setIsHarmless(false);
          setIsCrops(true);
        }
        setProjectType('project_sub');
      }
    }
    fundSourceRef?.current.clearDocumentSubItem();
  };

  const onCheckBoxChange = (list: any) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < options.length);
    setCheckAll(list.length === options.length);
  };

  const onCheckAllChange = (e: any) => {
    setCheckedList(e.target.checked ? options.map((ele) => ele.value) : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const adminChange = (e: any) => {
    setAdminValue(e);
  };

  let dynamicBottom = null;
  if (isInclusivePolicy) {
    dynamicBottom = (
      <>
        {inclusivePolicyMatch.map((field) => {
          return (
            <Form.Item
              key={field.paramName}
              name={field.paramName}
              rules={[{ required: true, message: `请选择${field.label}` }]}
              label={field.label}
            >
              <Select
                placeholder="请选择"
                style={{ width: 537 }}
                options={userOptions}
                filterOption={(searched: any, options: any) => {
                  return options?.label
                    ?.toLocaleLowerCase()
                    .includes(searched.toLocaleLowerCase());
                }}
                showSearch
              />
            </Form.Item>
          );
        })}
      </>
    );
  } else if (isHuLambs) {
    const ruralOptions = generateRuralOptions();
    dynamicBottom = (
      <>
        {huLambsMatch.map((field) => {
          return (
            <Form.Item
              key={field.paramName}
              name={field.paramName}
              rules={[{ required: true, message: `请选择${field.label}` }]}
              label={field.label}
            >
              <Select
                placeholder="请选择"
                style={{ width: 537 }}
                options={ruralOptions}
                filterOption={(searched: any, options: any) => {
                  return options?.label
                    ?.toLocaleLowerCase()
                    .includes(searched.toLocaleLowerCase());
                }}
                showSearch
              />
            </Form.Item>
          );
        })}
      </>
    );
  } else if (isHarmless) {
    const ruralOptions = generateRuralOptions();
    dynamicBottom = (
      <>
        {harmlessMatch.map((field) => {
          return (
            <Form.Item
              key={field.paramName}
              name={field.paramName}
              rules={[{ required: true, message: `请选择${field.label}` }]}
              label={field.label}
            >
              <Select
                placeholder="请选择"
                style={{ width: 537 }}
                options={ruralOptions}
                filterOption={(searched: any, options: any) => {
                  return options?.label
                    ?.toLocaleLowerCase()
                    .includes(searched.toLocaleLowerCase());
                }}
                showSearch
              />
            </Form.Item>
          );
        })}
      </>
    );
  } else if (isCrops) {
    // const ruralOptions = generateRuralOptions();
    dynamicBottom = (
      <>
        {cropsMatch.map((field) => {
          return (
            <Form.Item
              key={field.paramName}
              name={field.paramName}
              rules={[{ required: true, message: `请选择${field.label}` }]}
              label={field.label}
            >
              <Select
                placeholder="请选择"
                style={{ width: 537 }}
                options={
                  field.roleType
                    ? filterRoleByRoleType(field.roleType)
                    : userOptions
                }
                filterOption={(searched: any, options: any) => {
                  return options?.label
                    ?.toLocaleLowerCase()
                    .includes(searched.toLocaleLowerCase());
                }}
                showSearch
              />
            </Form.Item>
          );
        })}
      </>
    );
  } else {
    dynamicBottom = (
      <>
        {/* <Form.Item name="is_contend" label="是否为竞争性财政支农项目">
          <Radio.Group
            name="is_contend"
            initialValue={2}
            value={is_contend}
            onChange={onRadioChange}
          >
            <Radio value={2}>是</Radio>
            <Radio value={1}>否</Radio>
          </Radio.Group>
        </Form.Item> */}
        <Form.Item
          name="project_declaration_name"
          label="项目申报书名称"
          rules={[{ required: true }]}
        >
          <Input
            placeholder="请输入项目申报书名称"
            className={styles.leftInput}
            style={{ width: 537 }}
          />
        </Form.Item>
        {is_contend === 2 && (
          <>
            <Form.Item name="many" label="请选择项目所需材料">
              <>
                <Checkbox
                  indeterminate={indeterminate}
                  onChange={onCheckAllChange}
                  checked={checkAll}
                >
                  全选
                </Checkbox>
                <Divider />
                <CheckboxGroup
                  options={options}
                  value={checkedList}
                  onChange={onCheckBoxChange}
                />
              </>
            </Form.Item>

            <Form.Item
              name="admin_id"
              rules={[{ required: true }]}
              label="项目负责人"
            >
              <Select
                showSearch
                optionFilterProp="children"
                value={adminValue}
                style={{ width: 537 }}
                placeholder="请选择"
                onChange={adminChange}
                options={filterRoleByRoleType(10) || userOptions}
                filterOption={(input, option: any) => {
                  return (
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
                }}
              />
            </Form.Item>
            {extraPersonnelFields.map((field) => {
              return (
                <Form.Item
                  key={field.paramName}
                  name={field.paramName}
                  rules={[{ required: true, message: `请选择${field.label}` }]}
                  label={field.label}
                >
                  <Select
                    placeholder="请选择"
                    style={{ width: 537 }}
                    options={filterRoleByRoleType(10) || userOptions}
                    filterOption={(searched, options: any) => {
                      return options?.label
                        ?.toLocaleLowerCase()
                        .includes(searched.toLocaleLowerCase());
                    }}
                    showSearch
                  />
                </Form.Item>
              );
            })}
          </>
        )}
        <Form.Item name="understand_paper_id" label="关联明白纸">
          <Select
            allowClear
            placeholder="请选择"
            style={{ width: 537 }}
            options={underStandOption}
            showSearch
          />
        </Form.Item>
      </>
    );
  }

  const onFinish = (values: any) => {
    const content = tinymce.activeEditor.getContent();
    if (content.length <= 8) {
      message.error('文章内容不能为空');
    } else {
      let bridge: any = {
        is_declaration: '1',
        is_business_license: '1',
        is_land: '1',
        is_scheme: '1',
        is_device_list: '1',
        is_other_material: '1',
        is_engineering_design: '1',
        is_facility: '1',
        is_financial_support: '1',
        is_regional_photo: '1',
        title: values.title,
        content: content,
        article_type: values.article_type,
        is_contend: values.article_type == 14 ? 2 : 1,
        admin_id: values.admin_id,
        id: currentDetail.id,
        is_putaway: currentDetail.is_putaway,
        audit_admin_id: values.audit_admin_id,
        project_declaration_name: values.project_declaration_name, // 项目申报书名称
        review_admin_id: values.review_admin_id,
        unit_admin_id: values.unit_admin_id,
        pass_admin_id: values.pass_admin_id,
        change_admin_id: values.change_admin_id,
        implement_schedule_admin_id: values.implement_schedule_admin_id,
        ys_audit_admin_id: values.ys_audit_admin_id,
        acceptance_check_admin_id: values.acceptance_check_admin_id,
        fund_first_admin_id: values.fund_first_admin_id,
        fund_second_admin_id: values.fund_second_admin_id,
        fund_confirm_admin_id: values.fund_confirm_admin_id,
        agriculture_leader_id: values.agriculture_leader_id,
        public_government_id: values.public_government_id,
        amount_leader_id: values.amount_leader_id,
        hy_unit_admin_id: values.hy_unit_admin_id,
        hy_farm_admin_id: values.hy_farm_admin_id,
        hy_public_admin_id: values.hy_public_admin_id,
        hy_fund_admin_id: values.hy_fund_admin_id,
        whh_farm_admin_id: values.whh_farm_admin_id,
        whh_public_admin_id: values.whh_public_admin_id,
        whh_fund_admin_id: values.whh_fund_admin_id,
        ly_cun_public_admin_id: values.ly_cun_public_admin_id,
        ly_cun_audit_admin_id: values.ly_cun_audit_admin_id,
        ly_village_njzx_admin_id: values.ly_village_njzx_admin_id,
        ly_village_audit_admin_id: values.ly_village_audit_admin_id,
        ly_rural_audit_admin_id: values.ly_rural_audit_admin_id,
        ly_three_company_admin_id: values.ly_three_company_admin_id,
        ly_public_govn_admin_id: values.ly_public_govn_admin_id,
        ly_fund_admin_id: values.ly_fund_admin_id,
      };
      if (checkedList && checkedList.length) {
        if (checkedList.includes('1')) {
          bridge.is_declaration = '2';
        }
        if (checkedList.includes('2')) {
          bridge.is_scheme = '2';
        }
        if (checkedList.includes('3')) {
          bridge.is_business_license = '2';
        }
        if (checkedList.includes('4')) {
          bridge.is_land = '2';
        }
        if (checkedList.includes('5')) {
          bridge.is_device_list = '2';
        }
        if (checkedList.includes('6')) {
          bridge.is_engineering_design = '2';
        }
        if (checkedList.includes('7')) {
          bridge.is_other_material = '2';
        }
        if (checkedList.includes('8')) {
          bridge.is_facility = '2';
        }
        if (checkedList.includes('9')) {
          bridge.is_financial_support = '2';
        }
        if (checkedList.includes('10')) {
          bridge.is_regional_photo = '2';
        }
      }
      if (values.department && values.department.trim()) {
        bridge.department = values.department.trim();
      } else {
        bridge.department = '';
      }
      if (values.aging && values.aging.trim()) {
        bridge.aging = values.aging.trim();
      } else {
        bridge.aging = '';
      }
      if (dateCheck) {
        bridge.issue_at = dateCheck.format(dateFormat);
      } else {
        bridge.issue_at = '';
      }
      if (values.understand_paper_id) {
        bridge.understand_paper_id = values.understand_paper_id;
      } else {
        bridge.understand_paper_id = '';
      }
      if (values.accessory) {
        bridge.accessory = JSON.stringify(pdfUrl);
      } else {
        bridge.accessory = '';
      }
      if (values.timeRange && values.timeRange.length) {
        bridge.declare_start_at =
          moment(values.timeRange[0]).format('YYYY-MM-DD') + ` 00:00:00`;
        bridge.declare_end_at =
          moment(values.timeRange[1]).format('YYYY-MM-DD') + ` 23:59:59`;
      }
      // 校验资金来源
      const documentSubItem = getDocumentSubItem();
      if (documentSubItem?.length) {
        bridge.project_capital_source_id = documentSubItem[0].id;
      } else {
        return message.error('请添加资金来源');
      }
      console.log('bridge', bridge);
      editRequest(bridge);
    }
  };
  const editRequest = (bridge: any) => {
    // console.log('来请求了');
    // return console.log('bridge', bridge);
    setIsloading(true);
    Apis.policyDocumentEdit(bridge)
      .then((res: any) => {
        if (res && res.code === 0) {
          message.success('修改成功');
          history.goBack();
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      })
      .finally(() => {
        setIsloading(false);
      });
  };
  const goBack = () => {
    let res = confirm('确定要退出当前编辑吗?');
    if (res) {
      history.goBack();
    }
  };
  const onDateChange = (date: any, dateString: any) => {
    if (dateString) {
      setDateCheck(moment(dateString, dateFormat));
      form.setFieldsValue({ dateCheck: dateString });
    } else {
      setDateCheck('');
      form.setFieldsValue({ dateCheck: '' });
    }
  };

  const popCategory = () => {
    setCategoryName('');
    setShowEdit(true);
    fetchCategoryList();
  };
  const handleNewOk = () => {
    setShowEdit(false);
  };
  const handleNewCancel = () => {
    setShowEdit(false);
  };
  const changeCategoryName = (e: any) => {
    setCategoryName(e.target.value);
  };
  const addCategoryNameAction = () => {
    let value = categoryName.trim();
    if (value) {
      Apis.policyCategoryAdd({
        category_name: value,
        pid: 0,
      })
        .then((res: any) => {
          if (res && res.code === 0) {
            setCategoryName('');
            message.success('添加成功');
            fetchCategoryList();
          } else {
            message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    } else {
      message.error('请输入类目名称');
    }
  };
  const deleteCategory = (ele: any) => {
    Apis.policyCategoryDel({
      id: ele.id,
    })
      .then((res: any) => {
        if (res && res.code === 0) {
          message.success('删除成功');
          fetchCategoryList();
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const deleteSubCategory = (ele: any, sub: any) => {
    Apis.policyCategoryDel({
      id: sub.id,
    })
      .then((res: any) => {
        if (res && res.code === 0) {
          message.success('删除成功');
          fetchCategoryList();
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const okHandle = async () => {
    const fieldsValue = await innerForm.validateFields();
    let trackParent: any = categoryArray.find((ele: any) => {
      return ele.category_name == '惠农补贴';
    });
    if (fieldsValue.title) {
      Apis.policyCategoryAdd({
        category_name: fieldsValue.title,
        pid: trackParent.id,
      })
        .then((res: any) => {
          if (res && res.code === 0) {
            message.success('添加成功');
            innerForm.resetFields();
            setModalVisible(false);
            fetchCategoryList();
          } else {
            message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  };
  const onCancel = () => {
    setModalVisible(false);
    innerForm.resetFields();
  };
  const popModal = () => {
    setModalVisible(true);
  };

  // 获取已选资金来源
  const getDocumentSubItem = () => {
    return fundSourceRef?.current.getDocumentSubItem();
  };

  const handleEditorChange = (e: any) => {
    form.setFieldsValue({
      content: e,
    });
  };
  return (
    <div className={`${styles.homePageCon} ${styles.policyDocPage}`}>
      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showEdit}
        title="类目管理"
        onOk={handleNewOk}
        onCancel={handleNewCancel}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
            onClick={handleNewOk}
          >
            确定
          </Button>,
        ]}
      >
        <div>
          <div className={styles.categoryNameInputCon}>
            <Input
              placeholder="请输入类目名称"
              className={styles.leftInput}
              allowClear
              value={categoryName}
              onChange={(e) => changeCategoryName(e)}
            />
            <Button
              type="primary"
              className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
              onClick={() => addCategoryNameAction()}
            >
              添加
            </Button>
          </div>
          <div className={styles.categoryItemCon}>
            {categoryArray.map((item: any) =>
              item.get_parent_do && item.get_parent_do.length ? (
                <div key={item.id}>
                  <div className={styles.categoryItem}>
                    <div>{item.category_name} </div>
                    <div className={styles.flexEnd}>
                      <Popconfirm
                        title="确定删除此条目?"
                        onConfirm={() => deleteCategory(item)}
                      >
                        {item.category_name != '竞争性财政支农项目' ? (
                          <div className={styles.red}>删除</div>
                        ) : null}
                      </Popconfirm>
                      <PlusCircleOutlined
                        onClick={popModal}
                        className={`${styles.blueColor} ${styles.marginLeft20} `}
                      />
                    </div>
                  </div>
                  {item.get_parent_do &&
                    item.get_parent_do.map((sub: any) => (
                      <div className={styles.categoryItem} key={sub.id}>
                        <div className={styles.tagPadding}>
                          {sub.category_name}
                        </div>
                        <Popconfirm
                          title="确定删除此条目?"
                          onConfirm={() => deleteSubCategory(item, sub)}
                        >
                          {item.category_name != '竞争性财政支农项目' ? (
                            <div className={styles.red}>删除</div>
                          ) : null}
                        </Popconfirm>
                      </div>
                    ))}
                </div>
              ) : (
                <div className={styles.categoryItem} key={item.id}>
                  <div> {item.category_name}</div>
                  <div className={styles.flexEnd}>
                    <Popconfirm
                      title="确定删除此条目?"
                      onConfirm={() => deleteCategory(item)}
                    >
                      {item.category_name != '竞争性财政支农项目' ? (
                        <div className={styles.red}>删除</div>
                      ) : null}
                    </Popconfirm>
                    {item.category_name == '惠农补贴' ? (
                      <PlusCircleOutlined
                        onClick={popModal}
                        className={`${styles.blueColor} ${styles.marginLeft20} `}
                      />
                    ) : null}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </Modal>
      <Spin spinning={isLoading} tip="加载中">
        <Form
          form={form}
          name="nest-messages"
          labelAlign={'left'}
          onFinish={(values) => onFinish(values)}
          className={styles.formCon}
        >
          <Form.Item
            name="title"
            label="文章标题"
            hasFeedback
            rules={[{ required: true }]}
          >
            <Input
              placeholder="请输入文章标题，不超过50个字符"
              maxLength={50}
              style={{ width: 537 }}
            />
          </Form.Item>
          <div className={styles.flexItemCon}>
            <Form.Item
              name="article_type"
              label="类别"
              hasFeedback
              rules={[{ required: true }]}
            >
              <Select
                ref={currentSelect}
                value={selectValue}
                style={{ width: 537 }}
                placeholder="请选择"
                onChange={(e) => selectChange(e)}
                onFocus={fetchInclusivePolicyItemInfo}
              >
                {categoryArray.map((item: any) =>
                  item.get_parent_do && item.get_parent_do.length ? (
                    <OptGroup label={item.category_name} key={item.id}>
                      {item.get_parent_do &&
                        item.get_parent_do.map((sub: any) => (
                          <Option key={sub.id} value={sub.id}>
                            {sub.category_name}
                          </Option>
                        ))}
                    </OptGroup>
                  ) : (
                    <Option key={item.id} value={item.id}>
                      {item.category_name}
                    </Option>
                  ),
                )}
              </Select>
            </Form.Item>
            <Button
              type="primary"
              onClick={() => popCategory()}
              className={`${styles.resetBtnColor} ${styles.resetBtnRadius} ${styles.btnMarginLeft}`}
            >
              分类管理
            </Button>
          </div>
          <Form.Item label="文章内容" rules={[{ required: true }]}>
            <Editor
              apiKey="3n4phtjjc1f71ldjf41wpymq5tg4hpc0vd0k0k8xha6ci89i"
              onInit={(evt, editor) => {
                setEditorRef(editor);
              }}
              onEditorChange={handleEditorChange}
              init={{
                ...editorConfig,
                images_upload_handler: uploadImageCallBack,
              }}
            />
          </Form.Item>
          <Form.Item label="附件" name="accessory">
            <PdfUpload values={pdfUrl} getPdfData={getPdfData} />
          </Form.Item>
          <Form.Item
            label="申报时间"
            name="timeRange"
            rules={[{ required: true }]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item
            name="department"
            label="牵头部门"
            hasFeedback
            className={styles.topMarginItem}
          >
            <Input
              placeholder="请输入牵头部门，不超过15个字符"
              maxLength={15}
              style={{ width: 537 }}
            />
          </Form.Item>
          <Form.Item name="aging" label="时效" hasFeedback>
            <Input
              placeholder="请输入时效，不超过30个字符"
              maxLength={30}
              style={{ width: 537 }}
            />
          </Form.Item>
          <Form.Item name="documentSubItem" label="资金来源" required>
            <FundSource
              ref={fundSourceRef}
              originSubItem={originSubItem}
              policy_document_id={location.query.id}
              getDocumentSubItem={getDocumentSubItem}
              projectType={projectType}
            />
          </Form.Item>
          <Form.Item
            name="dateCheck"
            label="文件发布时间"
            rules={[{ required: true }]}
          >
            <>
              <DatePicker onChange={onDateChange} value={dateCheck} />
            </>
          </Form.Item>
          {dynamicBottom}
          <Form.Item wrapperCol={{ span: 24 }}>
            <div className={styles.btnCon}>
              <Button
                type="primary"
                htmlType="submit"
                className={`${styles.resetBtnColor} ${styles.btnMargin}`}
              >
                提 交
              </Button>
              <Button onClick={() => goBack()}>返 回</Button>
            </div>
          </Form.Item>
        </Form>
      </Spin>
      <Modal
        destroyOnClose
        width={400}
        title="添加子级类目"
        visible={modalVisible}
        maskClosable={false}
        onOk={okHandle}
        onCancel={() => {
          onCancel();
        }}
      >
        <Form form={innerForm}>
          <Form.Item
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="类目名称"
            name="title"
            rules={[
              { required: true, message: '请输入类目名称' },
              { message: '类目名称最大长度为20', max: 20 },
            ]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect()(PolicyEditDocumentPage);
