import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { Fragment, useEffect, useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
import {
  message,
  Popover,
  Table,
  Pagination,
  Modal,
  Button,
  DatePicker,
  Input,
  Empty,
  Form,
  Row,
  Col,
  Space,
  Descriptions,
  InputNumber,
} from 'antd';
import moment from 'moment';
import _ from 'lodash';
import ImgsViewer from 'react-images-viewer';
import { downloadAs, filterAttachment } from '@/utils/common';
import ApprovalForm from './components/ApprovalForm';
import AuditCon from './components/auditCon';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const DeclareHomePage = (props: any) => {
  const { location, dispatch } = props;
  const [currentInfo, setCurrentInfo] = useState<any>({});
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pagesize, setPagesize] = useState(10);
  const [load2ing, setLoad2ing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  const [showHrLine, setShowHrLine] = useState(false);
  const [matchFormData, setMatchFormData] = useState<any>({});
  const [recordArray, setRecordArray] = useState([]);
  const [afterEditArray, setAfterEditArray] = useState([]);
  const [declarationArray, setDeclarationArray] = useState([]);
  const [implementArray, setImplementArray] = useState([]);
  const [businessArray, setBusinessArray] = useState([]);
  const [landArray, setLandArray] = useState([]);
  const [facilityArray, setFacilityArray] = useState([]);
  const [investmentArray, setInvestmentArray] = useState([]);
  const [otherArray, setOtherArray] = useState([]);
  const [farmRef, setFarmRef] = useState([]);
  const [financialSupport, setFinancialSupport] = useState([]);
  const [regionPhoto, setRegionPhoto] = useState([]);
  const [formRef] = Form.useForm();
  const [realArray, setRealArray] = useState([]);
  const [realArraySum1, setRealArraySum1] = useState(0);
  const [realArraySum2, setRealArraySum2] = useState(0);
  const [newArraySum1, setNewArraySum1] = useState(0);
  const [newArraySum2, setNewArraySum2] = useState(0);
  const [real2Array, setReal2Array] = useState([]);
  const [real3Array, setReal3Array] = useState([]);
  const [real2ArraySum1, setReal2ArraySum1] = useState(0);
  const [real2ArraySum2, setReal2ArraySum2] = useState(0);
  const [real3ArraySum1, setReal3ArraySum1] = useState(0);
  const [real3ArraySum2, setReal3ArraySum2] = useState(0);
  const [new2ArraySum1, setNew2ArraySum1] = useState(0);
  const [new2ArraySum2, setNew2ArraySum2] = useState(0);
  const [new3ArraySum1, setNew3ArraySum1] = useState(0);
  const [new3ArraySum2, setNew3ArraySum2] = useState(0);
  const [realReadOnlyArray, setRealReadOnlyArray] = useState([]);
  const [real2ReadOnlyArray, setReal2ReadOnlyArray] = useState([]);
  const [real3ReadOnlyArray, setReal3ReadOnlyArray] = useState([]);
  const [realReadArraySum1, setRealReadArraySum1] = useState(0);
  const [realReadArraySum2, setRealReadArraySum2] = useState(0);
  const [newArrayReadSum1, setNewArrayReadSum1] = useState(0);
  const [newArrayReadSum2, setNewArrayReadSum2] = useState(0);
  const [newArrayReadSum3, setNewArrayReadSum3] = useState(0);
  const [newArray3ReadSum1, setNewArray3ReadSum1] = useState(0);
  const [newArray3ReadSum2, setNewArray3ReadSum2] = useState(0);
  const blueCircle =
    'https://img.hzanchu.com/acimg/6930491d509f6d6ae770865444b07295.png';
  const redCircle =
    'https://img.hzanchu.com/acimg/f3eea8456c0a4770b04d306530d42e7d.png';
  const yellowCircle =
    'https://img.hzanchu.com/acimg/1903e9542bc5a34a2c8bcbd37f7042b9.png';
  const docIcon =
    'https://img.hzanchu.com/acimg/18b4db2f0a34e503869c5ea5e515f24b.png';
  const docxIcon =
    'https://img.hzanchu.com/acimg/baf327802e8e5536d75a619da1e41703.png';
  const rarIcon =
    'https://img.hzanchu.com/acimg/21f96594470ebf4190f90b7a313207f1.png';
  const pdfIcon =
    'https://img.hzanchu.com/acimg/55b8d7dceaca8e5d8526f32dc8c8d603.png';
  const zipIcon =
    'https://img.hzanchu.com/acimg/35fc02369154eb26c99f0dac911c850b.png';
  const xlsxIcon =
    'https://img.hzanchu.com/acimg/2850bd929723576ff53afd3315b5fd40.png';
  const xlsIcon =
    'https://img.hzanchu.com/acimg/2d28f8877e8b0a3194b4f2fcfcbcfac2.png';
  const wpsIcon =
    'https://img.hzanchu.com/acimg/744ca05e5f8b341d2199be5c8aa3896b.png';

  const csvIcon =
    'https://img.hzanchu.com/acimg/8e0f2b1cd0de448ca444d0af1c3b35eb.png';
  const [textValue, setTextValue] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [currImg, setCurrImg] = useState(0);
  const [reCalcRes, setReCalcRes] = useState(0);
  const [modalReCalcRes, setModalReCalcRes] = useState(0);
  const [originCalcRes, setOriginCalcRes] = useState(0);
  const [viewerArray, setViewerArray] = useState([]);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [dynamicTitle, setDynamicTitle] = useState('');
  const [editStatus, setEditStatus] = useState(false);
  const [statusMap, setStatusMap] = useState<any>({
    0: '材料未全部提交',
    1: '审核中',
    // 3: '不通过',
    // 9: '审核不通过',
    3: '已驳回',
    9: '已驳回',
    10: '待处理',
    11: '等待材料重新提交',
    20: '评审中',
    21: '等待材料重新提交',
    // 29: '未通过',
    29: '已驳回',
    30: '联审中',
    31: '等待材料重新提交',
    // 39: '未通过',
    39: '已驳回',
    40: '公示中',
    // 43: '公示不通过',
    43: '已驳回',
    45: '文件下达',
    46: '文件下达',
    50: '文件下达',
    51: '文件下达',
    52: '文件下达',
    59: '文件下达',
    60: '文件下达',
    61: '文件下达',
    62: '文件下达',
    69: '文件下达',
    70: '文件下达',
    71: '文件下达',
    72: '文件下达',
    73: '文件下达',
    74: '文件下达',
    79: '文件下达',
  });
  const [statusColorMap, setStatusColorMap] = useState<any>({
    0: 'greyStatus',
    1: 'yellowStatus',
    3: 'yellowStatus',
    9: 'redStatus',
    10: 'yellowStatus',
    11: 'yellowStatus',
    20: 'greenStatus',
    21: 'yellowStatus',
    29: 'redStatus',
    30: 'greenStatus',
    31: 'yellowStatus',
    39: 'redStatus',
    40: 'blueStatus',
    43: 'redStatus',
    45: 'blueStatus',
    46: 'blueStatus',
    50: 'blueStatus',
    51: 'blueStatus',
    52: 'blueStatus',
    59: 'blueStatus',
    60: 'blueStatus',
    61: 'blueStatus',
    62: 'blueStatus',
    69: 'blueStatus',
    70: 'blueStatus',
    71: 'blueStatus',
    72: 'blueStatus',
    73: 'greenStatus',
    74: 'blueStatus',
    79: 'blueStatus',
  });
  const [actionTypeMap, setActionTypeMap] = useState({
    1: '材料提交',
    2: '已驳回',
    3: '项目通过乡镇评审',
    4: '已驳回',
    5: '通过材料审核',
    59: '已驳回',
    6: '已驳回',
    7: '通过项目评审',
    8: '已驳回',
    9: '通过项目联审',
    10: '公示',
    11: '已驳回',
    12: '文件下达',
  });

  const initAction = () => {
    let info = sessionStorage.getItem('currentInfo')
      ? JSON.parse(sessionStorage.getItem('currentInfo') || '')
      : '';
    if (info) {
      setUserInfo(info.admin_info);
    }
    commitGlobalBread([
      {
        title: '投资项目管理',
        triggerOn: true,
      },
      {
        title: '项目详情',
      },
    ]);
  };
  const clickThumbnail = (item?: any) => {
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
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };
  const fetchRecord = () => {
    let data = {
      project_id: location.query.id,
      page: current,
      pagesize: pagesize,
      record_type: 1,
    };
    Apis.fetchDeclarationRecordList(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          setRecordArray(res.data.list);
          // setTotal(res.data.total);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const columns: any = [
    {
      title: '操作类型',
      dataIndex: 'action_type',
      align: 'center',
      render: (text: any, record: any) => (
        <div>{actionTypeMap[record.action_type]}</div>
      ),
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
      title: '备注',
      dataIndex: 'action_content',
      align: 'center',
      render: (text: any, record: any) => (
        <div>{record.action_content ? record.action_content : '-'}</div>
      ),
    },
    {
      title: '附件',
      dataIndex: 'attachment',
      align: 'center',
      render: (data: any) => {
        let imags =
          filterAttachment(
            ['jpeg', 'jpg', 'png', 'JPEG', 'JPG', 'PNG'],
            data,
          ) || [];
        let docs = filterAttachment([], data) || [];
        return (
          <>
            {imags && imags.length > 0 && (
              <div
                style={{ color: '#1890ff', cursor: 'pointer' }}
                onClick={() => previewImages(imags)}
              >
                查看附件
              </div>
            )}
            {docs &&
              docs.length > 0 &&
              docs.map((item: any, i: number) => (
                <a
                  key={i}
                  href={item.url}
                  target="_blank"
                  className={styles.docLink}
                >{`${item.name}`}</a>
              ))}
          </>
        );
      },
    },
  ];
  const previewImages = (attachment: any = []) => {
    setViewerArray(
      attachment.map((v: any) => {
        return { src: v.url, name: v.name };
      }),
    );
    setViewerIsOpen(true);
  };

  const facilityColumns: any = [
    {
      title: '序号',
      dataIndex: 'mainIndex',
      align: 'center',
    },
    {
      title: '递交时间',
      dataIndex: 'created_at',
      align: 'center',
      render: (text: any, record: any) => (
        <div className={styles.lastTagCon}>
          <div>{record.created_at}</div>
          {record.mainIndex == facilityArray.length ? (
            <div
              className={` ${
                record.mainIndex == facilityArray.length ? styles.lastTag : ''
              }`}
            >
              最新
            </div>
          ) : null}
        </div>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action_type',
      align: 'center',
      render: (text: any, record: any) => (
        <div
          className={`${styles.cursorCheck} ${
            record.mainIndex == facilityArray.length
              ? styles.cursorGreen
              : styles.cursorWhite
          }`}
          onClick={() => toFacilityDetail(record)}
        >
          查看
        </div>
      ),
    },
  ];
  const toFacilityDetail = (item: any) => {
    history.push({
      pathname: '/application/projectFacilityDetail',
      query: {
        id: item.id,
      },
    });
  };
  const toImplementDetail = (item: any) => {
    history.push({
      pathname: '/application/projectImplementDetail',
      query: {
        id: item.id,
      },
    });
  };
  const toDeclarationDetail = (item: any) => {
    history.push({
      pathname: '/application/projectDeclarationDetail',
      query: {
        id: item.id,
      },
    });
  };
  const getNewFirstSum1 = (array: any) => {
    let temp1 = array.map((ele: any) => {
      if (!ele.invest_money) {
        return {
          ...ele,
          invest_money: ele.invest_money ? ele.invest_money : 0,
        };
      } else {
        return {
          ...ele,
        };
      }
    });
    let res1 = temp1.reduce((acc: any, current: any) => {
      return acc + current.invest_money;
    }, 0);
    setNewArraySum1(res1);
  };
  const getNewFirstSum2 = (array: any) => {
    let temp1 = array.map((ele: any) => {
      if (!ele.subsidy_money) {
        return {
          ...ele,
          subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0,
        };
      } else {
        return {
          ...ele,
        };
      }
    });
    let res1 = temp1.reduce((acc: any, current: any) => {
      return acc + current.subsidy_money;
    }, 0);
    setNewArraySum2(res1);
  };
  const getNewSecondSum1 = (array: any) => {
    let temp1 = array.map((ele: any) => {
      if (!ele.invest_money) {
        return {
          ...ele,
          invest_money: ele.invest_money ? ele.invest_money : 0,
        };
      } else {
        return {
          ...ele,
        };
      }
    });
    let res1 = temp1.reduce((acc: any, current: any) => {
      return acc + current.invest_money;
    }, 0);
    setNew2ArraySum1(res1);
  };
  const getNewSecondSum2 = (array: any) => {
    let temp1 = array.map((ele: any) => {
      if (!ele.subsidy_money) {
        return {
          ...ele,
          subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0,
        };
      } else {
        return {
          ...ele,
        };
      }
    });
    let res1 = temp1.reduce((acc: any, current: any) => {
      return acc + current.subsidy_money;
    }, 0);
    setNew2ArraySum2(res1);
  };
  const getNewThirdSum1 = (array: any) => {
    let temp1 = array.map((ele: any) => {
      if (!ele.invest_money) {
        return {
          ...ele,
          invest_money: ele.invest_money ? ele.invest_money : 0,
        };
      } else {
        return {
          ...ele,
        };
      }
    });
    let res1 = temp1.reduce((acc: any, current: any) => {
      return acc + current.invest_money;
    }, 0);
    setNew3ArraySum1(res1);
  };
  const getNewThirdSum2 = (array: any) => {
    let temp1 = array.map((ele: any) => {
      if (!ele.subsidy_money) {
        return {
          ...ele,
          subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0,
        };
      } else {
        return {
          ...ele,
        };
      }
    });
    let res1 = temp1.reduce((acc: any, current: any) => {
      return acc + current.subsidy_money;
    }, 0);
    setNew3ArraySum2(res1);
  };
  const commonTable1Change = () => {
    let temp1 = formRef.getFieldValue('table1');
    getNewFirstSum1(temp1);
  };
  const commonTable1SubsidyChange = () => {
    let temp1 = formRef.getFieldValue('table1');
    getNewFirstSum2(temp1);
  };
  const commonTable2Change = () => {
    let temp1 = formRef.getFieldValue('table2');
    getNewSecondSum1(temp1);
  };
  const commonTable2SubsidyChange = () => {
    let temp1 = formRef.getFieldValue('table2');
    getNewSecondSum2(temp1);
  };

  const commonTable3Change = () => {
    let temp1 = formRef.getFieldValue('table3');
    getNewThirdSum1(temp1);
  };
  const commonTable3SubsidyChange = () => {
    let temp1 = formRef.getFieldValue('table3');
    getNewThirdSum2(temp1);
  };
  const deleteFirst = (record, index) => {
    let temp1 = formRef.getFieldValue('table1');
    console.log('temp1', temp1);
    temp1.splice(index, 1);
    formRef.setFieldsValue({
      table1: temp1,
    });
    commonTable1Change();
    commonTable1SubsidyChange();
  };
  const columnForms: any = [
    {
      title: '分项名称',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
      render: (text: any, record: any, index: any) => (
        <div className={styles.lastTagCon}>
          <Form.Item name={['table1', index, 'name']}>
            <Input placeholder="请输入"></Input>
          </Form.Item>
        </div>
      ),
    },
    // {
    //   title: '建设地点',
    //   dataIndex: 'location',
    //   key: 'location',
    //   align: 'center',
    //   render: (text: any, record: any, index: any) => (
    //     <div className={styles.lastTagCon}>
    //       <Form.Item name={['table1', index, 'location']}>
    //         <Input placeholder="请输入"></Input>
    //       </Form.Item>
    //     </div>
    //   ),
    // },
    // {
    //   title: '建设单位',
    //   dataIndex: 'declare_unit',
    //   key: 'declare_unit',
    //   align: 'center',
    //   render: (text: any, record: any, index: any) => (
    //     <div className={styles.lastTagCon}>
    //       <Form.Item name={['table1', index, 'declare_unit']}>
    //         <Input placeholder="请输入"></Input>
    //       </Form.Item>
    //     </div>
    //   ),
    // },
    {
      title: '规模(数量)',
      dataIndex: 'scale',
      key: 'scale',
      align: 'center',
      render: (text: any, record: any, index: any) => (
        <div className={styles.lastTagCon}>
          <Form.Item name={['table1', index, 'scale']}>
            <Input placeholder="请输入"></Input>
          </Form.Item>
        </div>
      ),
    },
    {
      title: '投资金额(万元)',
      dataIndex: 'invest_money',
      key: 'invest_money',
      align: 'center',
      render: (text: any, record: any, index: any) => (
        <div className={styles.lastTagCon}>
          <Form.Item name={['table1', index, 'invest_money']}>
            <InputNumber
              max={9999999999}
              className={styles.resetInput}
              onChange={() => commonTable1Change()}
              precision={2}
              min={0}
              placeholder="请输入"
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: '其中财政补贴(万元)',
      dataIndex: 'subsidy_money',
      key: 'subsidy_money',
      align: 'center',
      render: (text: any, record: any, index: any) => (
        <div className={styles.lastTagCon}>
          <Form.Item name={['table1', index, 'subsidy_money']}>
            <InputNumber
              max={9999999999}
              className={styles.resetInput}
              onChange={() => commonTable1SubsidyChange()}
              precision={2}
              min={0}
              placeholder="请输入"
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: '操作',
      dataIndex: 'mainIndex',
      key: 'schedule_at',
      align: 'center',
      render: (text: any, record: any, index: any) => (
        <div className={styles.lastTagCon}>
          <Button onClick={() => deleteFirst(record, index)}>删除</Button>
        </div>
      ),
    },

    // {
    //   title: '进度安排',
    //   dataIndex: 'mainIndex',
    //   key: 'schedule_at',
    //   align: 'center',
    //   render: (text: any, record: any, index: any) => (
    //     <div className={styles.lastTagCon}>
    //       <Form.Item name={['table1', index, 'schedule_at']}>
    //         <RangePicker picker="month" />
    //       </Form.Item>
    //     </div>
    //   ),
    // },
  ];
  const columnFormsOld: any = [
    {
      title: '分项名称',
      dataIndex: 'name',
      align: 'center',
    },
    // {
    //   title: '建设地点',
    //   dataIndex: 'location',
    //   align: 'center',
    // },
    // {
    //   title: '建设单位',
    //   dataIndex: 'declare_unit',
    //   align: 'center',
    // },
    {
      title: '规模(数量)',
      dataIndex: 'scale',
      align: 'center',
    },
    {
      title: '投资金额(万元)',
      dataIndex: 'invest_money',
      align: 'center',
    },
    {
      title: '其中财政补贴(万元)',
      dataIndex: 'subsidy_money',
      align: 'center',
    },
    // {
    //   title: '进度安排',
    //   dataIndex: 'mainIndex',
    //   width: 190,
    //   align: 'center',
    //   render: (text: any, record: any) => (
    //     <div className={styles.lastTagCon}>
    //       <span>{moment(record.schedule_start_at).format('YYYY-MM')}</span>至
    //       <span>{moment(record.schedule_end_at).format('YYYY-MM')}</span>
    //     </div>
    //   ),
    // },
  ];
  const column2OldForms: any = [
    {
      title: '分项名称',
      dataIndex: 'name',
      align: 'center',
    },
    // {
    //   title: '建设地点',
    //   dataIndex: 'location',
    //   align: 'center',
    // },
    // {
    //   title: '建设单位',
    //   dataIndex: 'declare_unit',
    //   align: 'center',
    // },
    {
      title: '规模(数量)',
      dataIndex: 'scale',
      align: 'center',
    },
    {
      title: '投资金额(万元)',
      dataIndex: 'invest_money',
      align: 'center',
    },
    {
      title: '其中财政补贴(万元)',
      dataIndex: 'subsidy_money',
      align: 'center',
    },
    // {
    //   title: '进度安排',
    //   dataIndex: 'mainIndex',
    //   width: 190,
    //   align: 'center',
    //   render: (text: any, record: any) => (
    //     <div className={styles.lastTagCon}>
    //       <span>{moment(record.schedule_start_at).format('YYYY-MM')}</span>至
    //       <span>{moment(record.schedule_end_at).format('YYYY-MM')}</span>
    //     </div>
    //   ),
    // },
  ];
  const column3OldForms: any = [
    {
      title: '分项名称',
      dataIndex: 'name',
      align: 'center',
    },
    // {
    //   title: '建设地点',
    //   dataIndex: 'location',
    //   align: 'center',
    // },
    // {
    //   title: '建设单位',
    //   dataIndex: 'declare_unit',
    //   align: 'center',
    // },
    {
      title: '规模(数量)',
      dataIndex: 'scale',
      align: 'center',
    },
    {
      title: '投资金额(万元)',
      dataIndex: 'invest_money',
      align: 'center',
    },
    {
      title: '其中财政补贴(万元)',
      dataIndex: 'subsidy_money',
      align: 'center',
    },
    // {
    //   title: '进度安排',
    //   dataIndex: 'mainIndex',
    //   width: 190,
    //   align: 'center',
    //   render: (text: any, record: any) => (
    //     <div className={styles.lastTagCon}>
    //       <span>{moment(record.schedule_start_at).format('YYYY-MM')}</span>至
    //       <span>{moment(record.schedule_end_at).format('YYYY-MM')}</span>
    //     </div>
    //   ),
    // },
  ];
  const deleteSecond = (record, index) => {
    let temp1 = formRef.getFieldValue('table2');
    console.log('temp2', temp1);
    temp1.splice(index, 1);
    formRef.setFieldsValue({
      table2: temp1,
    });
    commonTable2Change();
    commonTable2SubsidyChange();
  };
  const column2Forms: any = [
    {
      title: '分项名称',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
      render: (text: any, record: any, index: any) => (
        <div className={styles.lastTagCon}>
          <Form.Item name={['table2', index, 'name']}>
            <Input placeholder="请输入"></Input>
          </Form.Item>
        </div>
      ),
    },
    // {
    //   title: '建设地点',
    //   dataIndex: 'location',
    //   key: 'location',
    //   align: 'center',
    //   render: (text: any, record: any, index: any) => (
    //     <div className={styles.lastTagCon}>
    //       <Form.Item name={['table2', index, 'location']}>
    //         <Input placeholder="请输入"></Input>
    //       </Form.Item>
    //     </div>
    //   ),
    // },
    // {
    //   title: '建设单位',
    //   dataIndex: 'declare_unit',
    //   key: 'declare_unit',
    //   align: 'center',
    //   render: (text: any, record: any, index: any) => (
    //     <div className={styles.lastTagCon}>
    //       <Form.Item name={['table2', index, 'declare_unit']}>
    //         <Input placeholder="请输入"></Input>
    //       </Form.Item>
    //     </div>
    //   ),
    // },
    {
      title: '规模(数量)',
      dataIndex: 'scale',
      key: 'scale',
      align: 'center',
      render: (text: any, record: any, index: any) => (
        <div className={styles.lastTagCon}>
          <Form.Item name={['table2', index, 'scale']}>
            <Input placeholder="请输入"></Input>
          </Form.Item>
        </div>
      ),
    },
    {
      title: '投资金额(万元)',
      dataIndex: 'invest_money',
      key: 'invest_money',
      align: 'center',
      render: (text: any, record: any, index: any) => (
        <div className={styles.lastTagCon}>
          <Form.Item name={['table2', index, 'invest_money']}>
            <InputNumber
              max={9999999999}
              className={styles.resetInput}
              onChange={() => commonTable2Change()}
              precision={2}
              min={0}
              placeholder="请输入"
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: '其中财政补贴(万元)',
      dataIndex: 'subsidy_money',
      key: 'subsidy_money',
      align: 'center',
      render: (text: any, record: any, index: any) => (
        <div className={styles.lastTagCon}>
          <Form.Item name={['table2', index, 'subsidy_money']}>
            <InputNumber
              max={9999999999}
              className={styles.resetInput}
              onChange={() => commonTable2SubsidyChange()}
              precision={2}
              min={0}
              placeholder="请输入"
            />
          </Form.Item>
        </div>
      ),
    },
    // {
    //   title: '进度安排',
    //   dataIndex: 'mainIndex',
    //   key: 'schedule_at',
    //   align: 'center',
    //   render: (text: any, record: any, index: any) => (
    //     <div className={styles.lastTagCon}>
    //       <Form.Item name={['table2', index, 'schedule_at']}>
    //         <RangePicker picker="month" />
    //       </Form.Item>
    //     </div>
    //   ),
    // },
    {
      title: '操作',
      dataIndex: 'mainIndex',
      key: 'schedule_at',
      align: 'center',
      render: (text: any, record: any, index: any) => (
        <div className={styles.lastTagCon}>
          <Button onClick={() => deleteSecond(record, index)}>删除</Button>
        </div>
      ),
    },
  ];
  const deleteThird = (record, index) => {
    let temp1 = formRef.getFieldValue('table3');
    console.log('temp3', temp1);
    temp1.splice(index, 1);
    formRef.setFieldsValue({
      table3: temp1,
    });
    commonTable3Change();
    commonTable3SubsidyChange();
  };
  const column3Forms: any = [
    {
      title: '分项名称',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
      render: (text: any, record: any, index: any) => (
        <div className={styles.lastTagCon}>
          <Form.Item name={['table3', index, 'name']}>
            <Input placeholder="请输入"></Input>
          </Form.Item>
        </div>
      ),
    },
    // {
    //   title: '建设地点',
    //   dataIndex: 'location',
    //   key: 'location',
    //   align: 'center',
    //   render: (text: any, record: any, index: any) => (
    //     <div className={styles.lastTagCon}>
    //       <Form.Item name={['table3', index, 'location']}>
    //         <Input placeholder="请输入"></Input>
    //       </Form.Item>
    //     </div>
    //   ),
    // },
    // {
    //   title: '建设单位',
    //   dataIndex: 'declare_unit',
    //   key: 'declare_unit',
    //   align: 'center',
    //   render: (text: any, record: any, index: any) => (
    //     <div className={styles.lastTagCon}>
    //       <Form.Item name={['table3', index, 'declare_unit']}>
    //         <Input placeholder="请输入"></Input>
    //       </Form.Item>
    //     </div>
    //   ),
    // },
    {
      title: '规模(数量)',
      dataIndex: 'scale',
      key: 'scale',
      align: 'center',
      render: (text: any, record: any, index: any) => (
        <div className={styles.lastTagCon}>
          <Form.Item name={['table3', index, 'scale']}>
            <Input placeholder="请输入"></Input>
          </Form.Item>
        </div>
      ),
    },
    {
      title: '投资金额(万元)',
      dataIndex: 'invest_money',
      key: 'invest_money',
      align: 'center',
      render: (text: any, record: any, index: any) => (
        <div className={styles.lastTagCon}>
          <Form.Item name={['table3', index, 'invest_money']}>
            <InputNumber
              max={9999999999}
              className={styles.resetInput}
              onChange={() => commonTable3Change()}
              precision={2}
              min={0}
              placeholder="请输入"
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: '其中财政补贴(万元)',
      dataIndex: 'subsidy_money',
      key: 'subsidy_money',
      align: 'center',
      render: (text: any, record: any, index: any) => (
        <div className={styles.lastTagCon}>
          <Form.Item name={['table3', index, 'subsidy_money']}>
            <InputNumber
              max={9999999999}
              className={styles.resetInput}
              onChange={() => commonTable3SubsidyChange()}
              precision={2}
              min={0}
              placeholder="请输入"
            />
          </Form.Item>
        </div>
      ),
    },
    // {
    //   title: '进度安排',
    //   dataIndex: 'mainIndex',
    //   key: 'schedule_at',
    //   align: 'center',
    //   render: (text: any, record: any, index: any) => (
    //     <div className={styles.lastTagCon}>
    //       <Form.Item name={['table3', index, 'schedule_at']}>
    //         <RangePicker picker="month" />
    //       </Form.Item>
    //     </div>
    //   ),
    // },
    {
      title: '操作',
      dataIndex: 'mainIndex',
      key: 'schedule_at',
      align: 'center',
      render: (text: any, record: any, index: any) => (
        <div className={styles.lastTagCon}>
          <Button onClick={() => deleteThird(record, index)}>删除</Button>
        </div>
      ),
    },
  ];
  const implementColumns: any = [
    {
      title: '序号',
      dataIndex: 'mainIndex',
      align: 'center',
    },
    {
      title: '递交时间',
      dataIndex: 'created_at',
      align: 'center',
      render: (text: any, record: any) => (
        <div className={styles.lastTagCon}>
          <div>{record.created_at}</div>
          {record.mainIndex == implementArray.length ? (
            <div
              className={` ${
                record.mainIndex == implementArray.length ? styles.lastTag : ''
              }`}
            >
              最新
            </div>
          ) : null}
        </div>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action_type',
      align: 'center',
      render: (text: any, record: any) => (
        <div
          className={`${styles.cursorCheck} ${
            record.mainIndex == implementArray.length
              ? styles.cursorGreen
              : styles.cursorWhite
          }`}
          onClick={() => toImplementDetail(record)}
        >
          查看
        </div>
      ),
    },
  ];
  const declarationColumns: any = [
    {
      title: '序号',
      dataIndex: 'mainIndex',
      align: 'center',
    },
    {
      title: '递交时间',
      dataIndex: 'created_at',
      align: 'center',
      render: (text: any, record: any) => (
        <div className={styles.lastTagCon}>
          <div>{record.created_at}</div>
          {record.mainIndex == declarationArray.length ? (
            <div
              className={` ${
                record.mainIndex == declarationArray.length
                  ? styles.lastTag
                  : ''
              }`}
            >
              最新
            </div>
          ) : null}
        </div>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action_type',
      align: 'center',
      render: (text: any, record: any) => (
        <div
          className={`${styles.cursorCheck} ${
            record.mainIndex == declarationArray.length
              ? styles.cursorGreen
              : styles.cursorWhite
          }`}
          onClick={() => toDeclarationDetail(record)}
        >
          查看
        </div>
      ),
    },
  ];
  useEffect(() => {
    calcOriginFunction();
  }, [realArray]);
  const calcOriginFunction = () => {
    let temp1 = realArray?.map((ele: any) => {
      if (!ele.invest_money || !ele.subsidy_money) {
        return {
          ...ele,
          invest_money: ele.invest_money ? ele.invest_money : 0,
        };
      } else {
        return {
          ...ele,
        };
      }
    });
    let res1 = temp1?.reduce((acc: any, current: any) => {
      return acc + current.invest_money;
    }, 0);
    setOriginCalcRes(res1);
  };
  const getFirstSum1 = (array: any) => {
    let temp1 = array.map((ele: any) => {
      if (!ele.invest_money) {
        return {
          ...ele,
          invest_money: ele.invest_money ? ele.invest_money : 0,
        };
      } else {
        return {
          ...ele,
        };
      }
    });
    let res1 = temp1.reduce((acc: any, current: any) => {
      return acc + current.invest_money;
    }, 0);
    setRealArraySum1(res1);
  };
  const getFirstSum2 = (array: any) => {
    let temp1 = array.map((ele: any) => {
      if (!ele.subsidy_money) {
        return {
          ...ele,
          subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0,
        };
      } else {
        return {
          ...ele,
        };
      }
    });
    let res1 = temp1.reduce((acc: any, current: any) => {
      return acc + current.subsidy_money;
    }, 0);
    setRealArraySum2(res1);
  };
  const getSecondSum1 = (array: any) => {
    let temp1 = array.map((ele: any) => {
      if (!ele.invest_money) {
        return {
          ...ele,
          invest_money: ele.invest_money ? ele.invest_money : 0,
        };
      } else {
        return {
          ...ele,
        };
      }
    });
    let res1 = temp1.reduce((acc: any, current: any) => {
      return acc + current.invest_money;
    }, 0);
    setReal2ArraySum1(res1);
  };
  const getSecondSum2 = (array: any) => {
    let temp1 = array.map((ele: any) => {
      if (!ele.subsidy_money) {
        return {
          ...ele,
          subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0,
        };
      } else {
        return {
          ...ele,
        };
      }
    });
    let res1 = temp1.reduce((acc: any, current: any) => {
      return acc + current.subsidy_money;
    }, 0);
    setReal2ArraySum2(res1);
  };
  const getThirdSum1 = (array: any) => {
    let temp1 = array.map((ele: any) => {
      if (!ele.invest_money) {
        return {
          ...ele,
          invest_money: ele.invest_money ? ele.invest_money : 0,
        };
      } else {
        return {
          ...ele,
        };
      }
    });
    let res1 = temp1.reduce((acc: any, current: any) => {
      return acc + current.invest_money;
    }, 0);
    setReal3ArraySum1(res1);
  };
  const getThirdSum2 = (array: any) => {
    let temp1 = array.map((ele: any) => {
      if (!ele.subsidy_money) {
        return {
          ...ele,
          subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0,
        };
      } else {
        return {
          ...ele,
        };
      }
    });
    let res1 = temp1.reduce((acc: any, current: any) => {
      return acc + current.subsidy_money;
    }, 0);
    setReal3ArraySum2(res1);
  };
  const getFirstReadSum1 = (array: any) => {
    let temp1 = array.map((ele: any) => {
      if (!ele.invest_money) {
        return {
          ...ele,
          invest_money: ele.invest_money ? ele.invest_money : 0,
        };
      } else {
        return {
          ...ele,
        };
      }
    });
    let res1 = temp1.reduce((acc: any, current: any) => {
      return acc + current.invest_money;
    }, 0);
    setRealReadArraySum1(res1);
  };
  const getFirstReadSum2 = (array: any) => {
    let temp1 = array.map((ele: any) => {
      if (!ele.subsidy_money) {
        return {
          ...ele,
          subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0,
        };
      } else {
        return {
          ...ele,
        };
      }
    });
    let res1 = temp1.reduce((acc: any, current: any) => {
      return acc + current.subsidy_money;
    }, 0);
    setRealReadArraySum2(res1);
  };
  const getSecondReadSum1 = (array: any) => {
    let temp1 = array.map((ele: any) => {
      if (!ele.invest_money) {
        return {
          ...ele,
          invest_money: ele.invest_money ? ele.invest_money : 0,
        };
      } else {
        return {
          ...ele,
        };
      }
    });
    let res1 = temp1.reduce((acc: any, current: any) => {
      return acc + current.invest_money;
    }, 0);
    setNewArrayReadSum1(res1);
  };
  const getSecondReadSum2 = (array: any) => {
    let temp1 = array.map((ele: any) => {
      if (!ele.subsidy_money) {
        return {
          ...ele,
          subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0,
        };
      } else {
        return {
          ...ele,
        };
      }
    });
    let res1 = temp1.reduce((acc: any, current: any) => {
      return acc + current.subsidy_money;
    }, 0);
    setNewArrayReadSum2(res1);
  };
  const getThirdReadSum1 = (array: any) => {
    let temp1 = array.map((ele: any) => {
      if (!ele.invest_money) {
        return {
          ...ele,
          invest_money: ele.invest_money ? ele.invest_money : 0,
        };
      } else {
        return {
          ...ele,
        };
      }
    });
    let res1 = temp1.reduce((acc: any, current: any) => {
      return acc + current.invest_money;
    }, 0);
    setNewArray3ReadSum1(res1);
  };
  const getThirdReadSum2 = (array: any) => {
    let temp1 = array.map((ele: any) => {
      if (!ele.subsidy_money) {
        return {
          ...ele,
          subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0,
        };
      } else {
        return {
          ...ele,
        };
      }
    });
    let res1 = temp1.reduce((acc: any, current: any) => {
      return acc + current.subsidy_money;
    }, 0);
    setNewArray3ReadSum2(res1);
  };
  const controlEditAble = (data: any) => {
    let currentUser = sessionStorage.getItem('currentInfo')
      ? JSON.parse(sessionStorage.getItem('currentInfo') as string)
      : '';
    let shorterName = currentUser.admin_info.username;
    setShowEditButton(false);
    setShowHrLine(false);
    if (data.status > 0 && data.status < 20) {
      if (data.audit_admin_info.username == shorterName) {
        setShowHrLine(true);
      }
    } else if (data.status >= 20 && data.status < 30) {
      if (data.review_admin_info.username == shorterName) {
        setShowHrLine(true);
      }
    } else if (data.status >= 30 && data.status < 40) {
      if (data.unit_admin_info.username == shorterName) {
        setShowEditButton(true);
        setShowHrLine(true);
      }
    } else if (data.status >= 40 && data.status < 45) {
      if (data.pass_admin_info.username == shorterName) {
        setShowHrLine(true);
      }
    } else if (data.status >= 45) {
      //   setCurrent(5);
    }
    if (
      data &&
      data.project_baseinfo_backup_info &&
      data.project_baseinfo_backup_info.project_id
    ) {
      setEditStatus(true);
      let obj = {
        afterProject_name: data.project_name,
        afterArea_detail: data.area_detail,
        build_at: [
          moment(data.build_start_at).format('YYYY-MM-DD'),
          moment(data.build_end_at).format('YYYY-MM-DD'),
        ],
        afterDeclare_unit: data.declare_unit,
        afterUnit_charge_name: data.unit_charge_name,
        afterUnit_charge_mobile: data.unit_charge_mobile,
        afterBuild_main_content: data.build_main_content,
      };
      setMatchFormData(obj);
      let array1 = data.project_implement_plan_history_list[
        data.project_implement_plan_history_list.length - 1
      ].history_content.part_options.find((ele: any) => {
        return ele.option_name == '基础设施建设';
      });
      let array2 = data.project_implement_plan_history_list[
        data.project_implement_plan_history_list.length - 1
      ].history_content.part_options.find((ele: any) => {
        return ele.option_name == '设施设备';
      });
      let array5 = data.project_implement_plan_history_list[
        data.project_implement_plan_history_list.length - 1
      ].history_content.part_options.find((ele) => {
        return ele.option_name == '其他';
      });
      if (array1 && array1.list && array1.list.length) {
        array1.list.forEach((ele: any) => {
          ele.schedule_at = [
            moment(ele.schedule_start_at),
            moment(ele.schedule_end_at),
          ];
        });
        setRealArray(array1.list);
        getFirstSum1(array1.list);
        getFirstSum2(array1.list);
      } else {
        setRealArray([]);
        getFirstSum1([]);
        getFirstSum2([]);
      }
      if (array2 && array2.list && array2.list.length) {
        array2.list.forEach((ele: any) => {
          ele.schedule_at = [
            moment(ele.schedule_start_at),
            moment(ele.schedule_end_at),
          ];
        });
        setReal2Array(array2.list);
        getSecondSum1(array2.list);
        getSecondSum2(array2.list);
      } else {
        setReal2Array([]);
        getSecondSum1([]);
        getSecondSum2([]);
      }
      if (array5 && array5.list && array5.list.length) {
        array5.list.forEach((ele: any) => {
          ele.schedule_at = [
            moment(ele.schedule_start_at),
            moment(ele.schedule_end_at),
          ];
        });
        setReal3Array(array5.list);
        getThirdSum1(array5.list);
        getThirdSum2(array5.list);
      } else {
        setReal3Array([]);
        getThirdSum1([]);
        getThirdSum2([]);
      }
      let array3 = data.project_baseinfo_backup_info.part_options.find(
        (ele: any) => {
          return ele.option_name == '基础设施建设';
        },
      );
      let array4 = data.project_baseinfo_backup_info.part_options.find(
        (ele: any) => {
          return ele.option_name == '设施设备';
        },
      );
      let array6 = data.project_baseinfo_backup_info.part_options.find(
        (ele: any) => {
          return ele.option_name == '其他';
        },
      );
      if (array3 && array3.list && array3.list.length) {
        setRealReadOnlyArray(array3.list);
        getFirstReadSum1(array3.list);
        getFirstReadSum2(array3.list);
      } else {
        setRealReadOnlyArray([]);
        getFirstReadSum1([]);
        getFirstReadSum2([]);
      }
      if (array4 && array4.list && array4.list.length) {
        setReal2ReadOnlyArray(array4.list);
        getSecondReadSum1(array4.list);
        getSecondReadSum2(array4.list);
      } else {
        setReal2ReadOnlyArray([]);
        getSecondReadSum1([]);
        getSecondReadSum2([]);
      }
      if (array6 && array6.list && array6.list.length) {
        setReal3ReadOnlyArray(array6.list);
        getThirdReadSum1(array6.list);
        getThirdReadSum2(array6.list);
      } else {
        setReal3ReadOnlyArray([]);
        getThirdReadSum1([]);
        getThirdReadSum2([]);
      }
    } else {
      setEditStatus(false);
      let array1 = data.project_implement_plan_history_list[
        data.project_implement_plan_history_list.length - 1
      ].history_content.part_options.find((ele: any) => {
        return ele.option_name == '基础设施建设';
      });
      let array2 = data.project_implement_plan_history_list[
        data.project_implement_plan_history_list.length - 1
      ].history_content.part_options.find((ele: any) => {
        return ele.option_name == '设施设备';
      });
      let array5 = data.project_implement_plan_history_list[
        data.project_implement_plan_history_list.length - 1
      ].history_content.part_options.find((ele: any) => {
        return ele.option_name == '其他';
      });
      if (array1 && array1.list && array1.list.length) {
        array1.list.forEach((ele: any) => {
          ele.schedule_at = [
            moment(ele.schedule_start_at),
            moment(ele.schedule_end_at),
          ];
        });
        setRealArray(array1.list);
        getFirstSum1(array1.list);
        getFirstSum2(array1.list);
      } else {
        setRealArray([]);
        getFirstSum1([]);
        getFirstSum2([]);
      }
      if (array2 && array2.list && array2.list.length) {
        array2.list.forEach((ele: any) => {
          ele.schedule_at = [
            moment(ele.schedule_start_at),
            moment(ele.schedule_end_at),
          ];
        });
        setReal2Array(array2.list);
        getSecondSum1(array2.list);
        getSecondSum2(array2.list);
      } else {
        setReal2Array([]);
        getSecondSum1([]);
        getSecondSum2([]);
      }
      if (array5 && array5.list && array5.list.length) {
        array5.list.forEach((ele: any) => {
          ele.schedule_at = [
            moment(ele.schedule_start_at),
            moment(ele.schedule_end_at),
          ];
        });
        setReal3Array(array5.list);
        getThirdSum1(array5.list);
        getThirdSum2(array5.list);
      } else {
        setReal3Array([]);
        getThirdSum1([]);
        getThirdSum2([]);
      }
    }
    // originCalcRes
    // reCalcRes
    // setRealArray();
  };
  const fetchDetail = () => {
    // setOriginCalcRes
    let info = sessionStorage.getItem('currentInfo')
      ? JSON.parse(sessionStorage.getItem('currentInfo') as string)
      : '';
    let localUserInfo: any = '';
    if (info) {
      localUserInfo = info.admin_info;
    }
    Apis.fetchProjectDetail({
      project_id: location.query.id,
    })
      .then((res: any) => {
        if (res && res.code === 0) {
          controlEditAble(res.data.info);
          setCurrentInfo(res.data.info);
          let simpleInfo = res.data.info;
          if (res.data.info.project_declaration_history_list) {
            let hi = res.data.info.project_declaration_history_list.map(
              (ele, index) => {
                return {
                  ...ele,
                  mainIndex: index + 1,
                };
              },
            );
            setDeclarationArray(hi);
          }
          if (res.data.info.project_implement_plan_history_list) {
            let hi = res.data.info.project_implement_plan_history_list.map(
              (ele, index) => {
                return {
                  ...ele,
                  mainIndex: index + 1,
                };
              },
            );
            setImplementArray(hi);
          }
          if (res.data.info.project_facility_list_history_list) {
            let hi = res.data.info.project_facility_list_history_list.map(
              (ele, index) => {
                return {
                  ...ele,
                  mainIndex: index + 1,
                };
              },
            );
            setFacilityArray(hi);
          }
          if (res.data.info.business_license_list) {
            let hi = res.data.info.business_license_list;
            setBusinessArray(hi);
          }
          if (res.data.info.land_procedure_list) {
            let hi = res.data.info.land_procedure_list;
            setLandArray(hi);
          }
          if (res.data.info.investment_materials_list) {
            let hi = res.data.info.investment_materials_list;
            setInvestmentArray(hi);
          }
          if (res.data.info.other_materials_list) {
            let hi = res.data.info.other_materials_list;
            setOtherArray(hi);
          }
          // 涉及生产设施用房建设的需提供设施用地审批材料
          if (res.data.info.farm_reference_materials_list) {
            let hi = res.data.info.farm_reference_materials_list;
            setFarmRef(hi);
          }

          // 项目建设区域内近二年各级财政资金扶持情况
          if (res.data.info.financial_support_materials_list) {
            let hi = res.data.info.financial_support_materials_list;
            setFinancialSupport(hi);
          }

          // 项目建设内容布置示意图及区域现状照片
          if (res.data.info.regional_photo_materials_list) {
            let hi = res.data.info.regional_photo_materials_list;
            setRegionPhoto(hi);
          }
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  useEffect(() => {
    fetchRecord();
  }, [current, pagesize]);
  useEffect(() => {
    window.scrollTo(0, 0);
    initAction();
    fetchDetail();
  }, []);
  const textChange = (input: any) => {
    setTextValue(input.target.value);
  };
  const handleActionOk = () => {
    let data = {
      project_id: currentInfo.project_id,
    };
    switch (currentInfo.status) {
      case 1:
        data.project_position = 0;
        break;
      case 10:
        data.project_position = 1;
        break;
      case 20:
        data.project_position = 2;
        break;
      case 30:
        data.project_position = 3;
        break;
      case 40:
        data.project_position = 4;
        break;
    }
    if (textValue.trim()) {
      if (dynamicTitle == '回复申请人') {
        data.reply_content = textValue.trim();
        data.audit_action_type = 2;
        Apis.actionProject(data)
          .then((res: any) => {
            if (res && res.code === 0) {
              message.success('操作成功');
              fetchDetail();
              fetchRecord();
            } else {
              message.error(res.msg);
            }
          })
          .catch((err) => {
            console.log('er', err);
          })
          .finally(() => {
            setShowActionModal(false);
          });
      } else {
        data.reply_content = textValue.trim();
        data.audit_action_type = 9;
        Apis.actionProject(data)
          .then((res: any) => {
            if (res && res.code === 0) {
              message.success('操作成功');
              fetchDetail();
              fetchRecord();
            } else {
              message.error(res.msg);
            }
          })
          .catch((err) => {
            console.log('er', err);
          })
          .finally(() => {
            setShowActionModal(false);
          });
      }
    } else {
      message.error('请输入内容 ');
    }
  };
  const handleActionCancel = () => {
    setShowActionModal(false);
  };
  const imgIconFilter = (ele?: any) => {
    let part =
      ele.suffix.toUpperCase() == 'PNG' ||
      ele.suffix.toUpperCase() == 'JPG' ||
      ele.suffix.toUpperCase() == 'JPEG'
        ? ele.src
        : ele.suffix.toUpperCase() == 'ZIP'
        ? zipIcon
        : ele.suffix.toUpperCase() == 'RAR'
        ? rarIcon
        : ele.suffix.toUpperCase() == 'PDF'
        ? pdfIcon
        : ['DOC', 'MSWORD'].includes(ele.suffix.toUpperCase())
        ? docIcon
        : ele.suffix.toUpperCase() == 'DOCX'
        ? docxIcon
        : ['XLSX', 'MS-EXCEL', 'SHEET'].includes(ele.suffix.toUpperCase())
        ? xlsxIcon
        : ele.suffix.toUpperCase() == 'XLS'
        ? xlsIcon
        : ele.suffix.toUpperCase() == 'CSV'
        ? csvIcon
        : ele.suffix.toUpperCase() == 'WPS'
        ? wpsIcon
        : '';
    // let obj = 'url(' + encodeURI(part) + ')';
    let obj = 'url(' + part + ')';
    var reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
    if (reg.test(part)) {
      obj = 'url(' + encodeURI(part) + ')';
    }
    return obj;
  };
  const checkMaterialDetail = (ele?: any, array?: any) => {
    if (['PNG', 'JPG', 'JPEG'].includes(ele.suffix.toUpperCase())) {
      let newArray = array.filter((ele?: any) => {
        return (
          ele.suffix.toUpperCase() == 'PNG' ||
          ele.suffix.toUpperCase() == 'JPG' ||
          ele.suffix.toUpperCase() == 'JPEG'
        );
      });
      let index = newArray.findIndex((sub?: any) => {
        return ele.src == sub.src;
      });
      setCurrImg(index);
      setViewerIsOpen(true);
      setViewerArray(newArray);
    } else {
      // 非图片格式文件
      window.open(ele.src, '_blank');
    }
  };
  const switchToEdit = () => {
    setEditStatus(!editStatus);
  };
  const fetchNoticeSignal = () => {
    switchToEdit();
  };
  const moneyFormat = (value: any) => {
    if (value || value == 0) {
      if (value === 0) {
        return 0;
      } else {
        let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
        return fix;
      }
    }
  };
  const noticeModalTrigger = () => {
    setShowEditModal(true);
    setModalReCalcRes(0);
    formRef.setFieldsValue({
      afterProject_name: currentInfo.project_name,
      afterArea_detail: currentInfo.area_detail,
      afterDeclare_unit: currentInfo.declare_unit,
      afterUnit_charge_name: currentInfo.unit_charge_name,
      afterUnit_charge_mobile: currentInfo.unit_charge_mobile,
      afterBuild_main_content:
        currentInfo.project_implement_plan_history_list &&
        currentInfo.project_implement_plan_history_list[
          currentInfo.project_implement_plan_history_list.length - 1
        ].history_content.build_main_content,
      build_at: [
        currentInfo.build_start_at ? moment(currentInfo.build_start_at) : '',
        currentInfo.build_end_at ? moment(currentInfo.build_end_at) : '',
      ],
    });
    setNewArraySum1(0);
    setNewArraySum2(0);
    setNew2ArraySum1(0);
    setNew2ArraySum2(0);
    setNew3ArraySum1(0);
    setNew3ArraySum2(0);
    // let regenerate1 = realArray.map((ele) => {
    //   return {
    //     declare_unit: '',
    //     invest_money: undefined,
    //     location: '',
    //     name: '',
    //     scale: '',
    //     schedule_end_at: '',
    //     schedule_start_at: '',
    //     subsidy_money: undefined,
    //   };
    // });
    // let regenerate2 = real2Array.map((ele) => {
    //   return {
    //     declare_unit: '',
    //     invest_money: undefined,
    //     location: '',
    //     name: '',
    //     scale: '',
    //     schedule_end_at: '',
    //     schedule_start_at: '',
    //     subsidy_money: undefined,
    //   };
    // });
    // let regenerate3 = real3Array.map((ele) => {
    //   return {
    //     declare_unit: '',
    //     invest_money: undefined,
    //     location: '',
    //     name: '',
    //     scale: '',
    //     schedule_end_at: '',
    //     schedule_start_at: '',
    //     subsidy_money: undefined,
    //   };
    // });
    let regenerate1 = _.cloneDeep(realArray);
    let regenerate2 = _.cloneDeep(real2Array);
    let regenerate3 = _.cloneDeep(real3Array);
    formRef.setFieldsValue({
      table1: regenerate1 || [],
      table2: regenerate2 || [],
      table3: regenerate3 || [],
    });
    commonTable1Change();
    commonTable1SubsidyChange();
    commonTable2Change();
    commonTable2SubsidyChange();
    commonTable3Change();
    commonTable3SubsidyChange();
  };
  const handleEditOk = () => {
    formRef
      .validateFields()
      .then((values: any) => {
        // console.log('values', values);
        let data = {
          project_id: currentInfo.project_id,
          project_name: values.afterProject_name || currentInfo.project_name,
          area_detail: values.afterArea_detail || currentInfo.area_detail,
          declare_unit: values.afterDeclare_unit || currentInfo.declare_unit,
          unit_charge_name:
            values.afterUnit_charge_name || currentInfo.unit_charge_name,
          unit_charge_mobile:
            values.afterUnit_charge_mobile || currentInfo.unit_charge_mobile,
          build_start_at:
            values.build_at && values.build_at[0]
              ? moment(values.build_at[0])
                  .startOf('month')
                  .format('YYYY-MM-DD') + ' 00:00:00'
              : currentInfo.build_start_at,
          build_end_at:
            values.build_at && values.build_at[1]
              ? moment(values.build_at[1]).endOf('month').format('YYYY-MM-DD') +
                ' 23:59:59'
              : currentInfo.build_end_at,
          build_main_content:
            values.afterBuild_main_content ||
            (currentInfo.project_implement_plan_history_list &&
              currentInfo.project_implement_plan_history_list[
                currentInfo.project_implement_plan_history_list.length - 1
              ].history_content.build_main_content),
        };

        /*         (values.table1 || []).forEach((ele: any, index: any) => {
          if (!ele.declare_unit) {
            ele.declare_unit = realArray[index].declare_unit;
          }
          if (!ele.invest_money) {
            ele.invest_money = realArray[index].invest_money;
          }
          if (!ele.location) {
            ele.location = realArray[index].location;
          }
          if (!ele.name) {
            ele.name = realArray[index].name;
          }
          if (!ele.scale) {
            ele.scale = realArray[index].scale;
          }
          if (!ele.schedule_at) {
            ele.schedule_at = realArray[index].schedule_at;
          }
          if (!ele.subsidy_money) {
            ele.subsidy_money = realArray[index].subsidy_money;
          }
        });
        (values.table2 || []).forEach((ele: any, index: any) => {
          if (!ele.declare_unit) {
            ele.declare_unit = real2Array[index].declare_unit;
          }
          if (!ele.invest_money) {
            ele.invest_money = real2Array[index].invest_money;
          }
          if (!ele.location) {
            ele.location = real2Array[index].location;
          }
          if (!ele.name) {
            ele.name = real2Array[index].name;
          }
          if (!ele.scale) {
            ele.scale = real2Array[index].scale;
          }
          if (!ele.schedule_at) {
            ele.schedule_at = real2Array[index].schedule_at;
          }
          if (!ele.subsidy_money) {
            ele.subsidy_money = real2Array[index].subsidy_money;
          }
        });
        (values.table3 || []).forEach((ele: any, index: any) => {
          if (!ele.declare_unit) {
            ele.declare_unit = real3Array[index].declare_unit;
          }
          if (!ele.invest_money) {
            ele.invest_money = real3Array[index].invest_money;
          }
          if (!ele.location) {
            ele.location = real3Array[index].location;
          }
          if (!ele.name) {
            ele.name = real3Array[index].name;
          }
          if (!ele.scale) {
            ele.scale = real3Array[index].scale;
          }
          if (!ele.schedule_at) {
            ele.schedule_at = real3Array[index].schedule_at;
          }
          if (!ele.subsidy_money) {
            ele.subsidy_money = real3Array[index].subsidy_money;
          }
        }); */

        (values.table1 || []).forEach((ele: any, index: any) => {
          ele.schedule_start_at =
            moment(ele.schedule_at[0]).startOf('month').format('YYYY-MM-DD') +
            ' 00:00:00';
          ele.schedule_end_at =
            moment(ele.schedule_at[1]).startOf('month').format('YYYY-MM-DD') +
            ' 00:00:00';
          delete ele.schedule_at;
        });
        (values.table2 || []).forEach((ele: any, index: any) => {
          ele.schedule_start_at =
            moment(ele.schedule_at[0]).startOf('month').format('YYYY-MM-DD') +
            ' 00:00:00';
          ele.schedule_end_at =
            moment(ele.schedule_at[1]).startOf('month').format('YYYY-MM-DD') +
            ' 00:00:00';
          delete ele.schedule_at;
        });
        (values.table3 || []).forEach((ele: any, index: any) => {
          ele.schedule_start_at =
            moment(ele.schedule_at[0]).startOf('month').format('YYYY-MM-DD') +
            ' 00:00:00';
          ele.schedule_end_at =
            moment(ele.schedule_at[1]).startOf('month').format('YYYY-MM-DD') +
            ' 00:00:00';
          delete ele.schedule_at;
        });
        let part_options = [
          {
            option_name: '基础设施建设',
            option_mark: 'infrastructure_construction',
            list: values.table1 || [],
          },
          {
            option_name: '设施设备',
            option_mark: 'mechanical_equipment',
            list: values.table2 || [],
          },
          {
            option_name: '其他',
            option_mark: 'other',
            list: values.table3 || [],
          },
        ];
        // console.log('part_options', part_options);
        data.part_options = part_options;
        console.log('data', data);
        Apis.modifyProjectBaseinfoByUnitAudit(data)
          .then((res: any) => {
            if (res && res.code == 0) {
              message.success('修改成功');
              setShowEditModal(false);
              setEditStatus(true);
              fetchDetail();
            }
          })
          .catch((err) => {
            console.log('err', err);
          });
      })
      .catch((err) => {
        console.log('er', err);
      });
  };
  const handleEditCancel = () => {
    setShowEditModal(false);
    formRef.resetFields();
  };
  return (
    <div className={styles.homePageCon}>
      <div className={styles.infoPart}>
        <div className={styles.infoFirstLine}>
          <div className={styles.infoFirstLineName}>项目基础信息</div>
          <div
            className={`${
              (styles.infoFirstLineGrey, styles.infoFirstLineMargin)
            }`}
          >
            当前状态
          </div>
          {currentInfo.status || currentInfo.status == 0 ? (
            <div className={styles[statusColorMap[currentInfo.status]]}>
              {statusMap[currentInfo.status]}
            </div>
          ) : null}
        </div>
        <div className={styles.infoSecondLine}>
          {editStatus ? (
            <div className={styles.marginTitle}>修改前信息</div>
          ) : null}
          <Descriptions title="" column={6} bordered>
            <Descriptions.Item label="项目名称" span={2}>
              {editStatus
                ? currentInfo.project_baseinfo_backup_info &&
                  currentInfo.project_baseinfo_backup_info.project_name
                : currentInfo.project_name}
            </Descriptions.Item>
            <Descriptions.Item label="建设单位" span={2}>
              {editStatus
                ? currentInfo.project_baseinfo_backup_info &&
                  currentInfo.project_baseinfo_backup_info.declare_unit
                : currentInfo.declare_unit}
            </Descriptions.Item>
            <Descriptions.Item label="负责人" span={2}>
              {editStatus
                ? currentInfo.project_baseinfo_backup_info &&
                  currentInfo.project_baseinfo_backup_info.unit_charge_name
                : currentInfo.unit_charge_name}
            </Descriptions.Item>
            <Descriptions.Item label="联系电话" span={2}>
              {editStatus
                ? currentInfo.project_baseinfo_backup_info &&
                  currentInfo.project_baseinfo_backup_info.unit_charge_mobile
                : currentInfo.unit_charge_mobile}
            </Descriptions.Item>
            <Descriptions.Item label="项目建设地点" span={2}>
              {currentInfo.area_ids && currentInfo.area_ids.join('')}
            </Descriptions.Item>
            <Descriptions.Item label="详细地址" span={2}>
              {editStatus
                ? currentInfo.project_baseinfo_backup_info &&
                  currentInfo.project_baseinfo_backup_info.area_detail
                : currentInfo.area_detail}
            </Descriptions.Item>
            <Descriptions.Item label="建设期限" span={2}>
              {editStatus
                ? currentInfo.project_baseinfo_backup_info &&
                  moment(
                    currentInfo.project_baseinfo_backup_info.build_start_at,
                  ).format('YYYY-MM')
                : currentInfo.build_start_at &&
                  moment(currentInfo.build_start_at).format('YYYY-MM')}
              至
              {editStatus
                ? currentInfo.project_baseinfo_backup_info &&
                  moment(
                    currentInfo.project_baseinfo_backup_info.build_end_at,
                  ).format('YYYY-MM')
                : currentInfo.build_end_at &&
                  moment(currentInfo.build_end_at).format('YYYY-MM')}
            </Descriptions.Item>
            <Descriptions.Item label="主要建设内容" span={4}>
              {editStatus
                ? currentInfo.project_baseinfo_backup_info &&
                  currentInfo.project_baseinfo_backup_info.build_main_content
                : currentInfo.project_implement_plan_history_list &&
                  currentInfo.project_implement_plan_history_list[
                    currentInfo.project_implement_plan_history_list.length - 1
                  ].history_content.build_main_content}
            </Descriptions.Item>
          </Descriptions>
          {editStatus && realReadOnlyArray && realReadOnlyArray.length ? (
            <>
              <Descriptions
                className={styles.marginTop20}
                title="分项一(基础设施建设)"
                column={6}
                bordered
              >
                {realReadOnlyArray?.map((ele, index) => (
                  <React.Fragment key={index}>
                    <Descriptions.Item label={'分项名称'} span={2}>
                      {ele.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="建设地点" span={2}>
                      {ele.location}
                    </Descriptions.Item>
                    <Descriptions.Item label="建设单位" span={2}>
                      {ele.declare_unit}
                    </Descriptions.Item>
                    <Descriptions.Item label={'规模(数量)'} span={2}>
                      {ele.scale}
                    </Descriptions.Item>
                    <Descriptions.Item label="投资金额(万元)" span={2}>
                      {ele.invest_money}
                    </Descriptions.Item>
                    <Descriptions.Item label="其中财政补助(万元)" span={2}>
                      {ele.subsidy_money}
                    </Descriptions.Item>
                    <Descriptions.Item label="进度安排" span={6}>
                      {moment(ele.schedule_start_at).format('YYYY-MM')}至
                      {moment(ele.schedule_end_at).format('YYYY-MM')}
                    </Descriptions.Item>
                  </React.Fragment>
                ))}
              </Descriptions>
            </>
          ) : null}
          {editStatus && real2ReadOnlyArray && real2ReadOnlyArray.length ? (
            <Descriptions
              className={styles.marginTop20}
              title={
                editStatus && realReadOnlyArray && realReadOnlyArray.length
                  ? '分项二(设施设备)'
                  : '分项一(设施设备)'
              }
              column={6}
              bordered
            >
              {real2ReadOnlyArray?.map((ele, index) => (
                <React.Fragment key={index}>
                  <Descriptions.Item label={'分项名称'} span={2}>
                    {ele.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="建设地点" span={2}>
                    {ele.location}
                  </Descriptions.Item>
                  <Descriptions.Item label="建设单位" span={2}>
                    {ele.declare_unit}
                  </Descriptions.Item>
                  <Descriptions.Item label={'规模(数量)'} span={2}>
                    {ele.scale}
                  </Descriptions.Item>
                  <Descriptions.Item label="投资金额(万元)" span={2}>
                    {ele.invest_money}
                  </Descriptions.Item>
                  <Descriptions.Item label="其中财政补助(万元)" span={2}>
                    {ele.subsidy_money}
                  </Descriptions.Item>
                  <Descriptions.Item label="进度安排" span={6}>
                    {moment(ele.schedule_start_at).format('YYYY-MM')}至
                    {moment(ele.schedule_end_at).format('YYYY-MM')}
                  </Descriptions.Item>
                </React.Fragment>
              ))}
            </Descriptions>
          ) : null}
          {editStatus && real3ReadOnlyArray && real3ReadOnlyArray.length ? (
            <Descriptions
              className={styles.marginTop20}
              title={
                editStatus && real2ReadOnlyArray && real2ReadOnlyArray.length
                  ? realReadOnlyArray && realReadOnlyArray.length
                    ? '分项三(其他)'
                    : '分项二(其他)'
                  : realReadOnlyArray && realReadOnlyArray.length
                  ? '分项二(其他)'
                  : '分项一(其他)'
              }
              column={6}
              bordered
            >
              {real3ReadOnlyArray?.map((ele, index) => (
                <React.Fragment key={index}>
                  <Descriptions.Item label={'分项名称'} span={2}>
                    {ele.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="建设地点" span={2}>
                    {ele.location}
                  </Descriptions.Item>
                  <Descriptions.Item label="建设单位" span={2}>
                    {ele.declare_unit}
                  </Descriptions.Item>
                  <Descriptions.Item label={'规模(数量)'} span={2}>
                    {ele.scale}
                  </Descriptions.Item>
                  <Descriptions.Item label="投资金额(万元)" span={2}>
                    {ele.invest_money}
                  </Descriptions.Item>
                  <Descriptions.Item label="其中财政补助(万元)" span={2}>
                    {ele.subsidy_money}
                  </Descriptions.Item>
                  <Descriptions.Item label="进度安排" span={6}>
                    {moment(ele.schedule_start_at).format('YYYY-MM')}至
                    {moment(ele.schedule_end_at).format('YYYY-MM')}
                  </Descriptions.Item>
                </React.Fragment>
              ))}
            </Descriptions>
          ) : null}
          {editStatus &&
          ((realReadOnlyArray && realReadOnlyArray.length) ||
            (real2ReadOnlyArray && real2ReadOnlyArray.length) ||
            (real3ReadOnlyArray && real3ReadOnlyArray.length)) ? (
            <>
              <Descriptions
                className={styles.marginTop20}
                title="合计"
                column={6}
                bordered
              >
                <Descriptions.Item label="计划总投资金额(万元)" span={2}>
                  {moneyFormat(
                    realReadArraySum1 + newArrayReadSum1 + newArray3ReadSum1,
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="计划财政补助总金额(万元)" span={2}>
                  {moneyFormat(
                    realReadArraySum2 + newArrayReadSum2 + newArray3ReadSum2,
                  )}
                </Descriptions.Item>
              </Descriptions>
            </>
          ) : null}
          {editStatus ? (
            <div className={styles.marginTitle}>修改后信息</div>
          ) : null}
          {editStatus ? (
            <Descriptions title="" column={6} bordered>
              <Descriptions.Item label="项目名称" span={2}>
                {currentInfo.project_name}
              </Descriptions.Item>
              <Descriptions.Item label="建设单位" span={2}>
                {currentInfo.declare_unit}
              </Descriptions.Item>
              <Descriptions.Item label="负责人" span={2}>
                {currentInfo.unit_charge_name}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话" span={2}>
                {currentInfo.unit_charge_mobile}
              </Descriptions.Item>
              <Descriptions.Item label="项目建设地点" span={2}>
                {currentInfo.area_ids && currentInfo.area_ids.join('')}
              </Descriptions.Item>
              <Descriptions.Item label="详细地址" span={2}>
                {currentInfo.area_detail}
              </Descriptions.Item>
              <Descriptions.Item label="建设期限" span={2}>
                {currentInfo.build_start_at &&
                  moment(currentInfo.build_start_at).format('YYYY-MM')}
                至
                {currentInfo.build_end_at &&
                  moment(currentInfo.build_end_at).format('YYYY-MM')}
              </Descriptions.Item>
              <Descriptions.Item label="主要建设内容" span={4}>
                {currentInfo.project_implement_plan_history_list &&
                  currentInfo.project_implement_plan_history_list[
                    currentInfo.project_implement_plan_history_list.length - 1
                  ].history_content.build_main_content}
              </Descriptions.Item>
            </Descriptions>
          ) : null}
          {realArray && realArray.length ? (
            <Descriptions
              className={styles.marginTop20}
              title="分项一(基础设施建设)"
              column={6}
              bordered
            >
              {realArray?.map((ele, index) => (
                <React.Fragment key={index}>
                  <Descriptions.Item label={'分项名称'} span={2}>
                    {ele.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="建设地点" span={2}>
                    {ele.location}
                  </Descriptions.Item>
                  <Descriptions.Item label="建设单位" span={2}>
                    {ele.declare_unit}
                  </Descriptions.Item>
                  <Descriptions.Item label={'规模(数量)'} span={2}>
                    {ele.scale}
                  </Descriptions.Item>
                  <Descriptions.Item label="投资金额(万元)" span={2}>
                    {ele.invest_money}
                  </Descriptions.Item>
                  <Descriptions.Item label="其中财政补助(万元)" span={2}>
                    {ele.subsidy_money}
                  </Descriptions.Item>
                  <Descriptions.Item label="进度安排" span={6}>
                    {moment(ele.schedule_start_at).format('YYYY-MM')}至
                    {moment(ele.schedule_end_at).format('YYYY-MM')}
                  </Descriptions.Item>
                </React.Fragment>
              ))}
            </Descriptions>
          ) : null}
          {real2Array && real2Array.length ? (
            <Descriptions
              className={styles.marginTop20}
              title={
                realArray && realArray.length
                  ? '分项二(设施设备)'
                  : '分项一(设施设备)'
              }
              column={6}
              bordered
            >
              {real2Array?.map((ele, index) => (
                <React.Fragment key={index}>
                  <Descriptions.Item label={'分项名称'} span={2}>
                    {ele.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="建设地点" span={2}>
                    {ele.location}
                  </Descriptions.Item>
                  <Descriptions.Item label="建设单位" span={2}>
                    {ele.declare_unit}
                  </Descriptions.Item>
                  <Descriptions.Item label={'规模(数量)'} span={2}>
                    {ele.scale}
                  </Descriptions.Item>
                  <Descriptions.Item label="投资金额(万元)" span={2}>
                    {ele.invest_money}
                  </Descriptions.Item>
                  <Descriptions.Item label="其中财政补助(万元)" span={2}>
                    {ele.subsidy_money}
                  </Descriptions.Item>
                  <Descriptions.Item label="进度安排" span={6}>
                    {moment(ele.schedule_start_at).format('YYYY-MM')}至
                    {moment(ele.schedule_end_at).format('YYYY-MM')}
                  </Descriptions.Item>
                </React.Fragment>
              ))}
            </Descriptions>
          ) : null}
          {real3Array && real3Array.length ? (
            <Descriptions
              className={styles.marginTop20}
              title={
                real2Array && real2Array.length
                  ? realArray && realArray.length
                    ? '分项三(其他)'
                    : '分项二(其他)'
                  : realArray && realArray.length
                  ? '分项二(其他)'
                  : '分项一(其他)'
              }
              column={6}
              bordered
            >
              {real3Array?.map((ele, index) => (
                <React.Fragment key={index}>
                  <Descriptions.Item label={'分项名称'} span={2}>
                    {ele.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="建设地点" span={2}>
                    {ele.location}
                  </Descriptions.Item>
                  <Descriptions.Item label="建设单位" span={2}>
                    {ele.declare_unit}
                  </Descriptions.Item>
                  <Descriptions.Item label={'规模(数量)'} span={2}>
                    {ele.scale}
                  </Descriptions.Item>
                  <Descriptions.Item label="投资金额(万元)" span={2}>
                    {ele.invest_money}
                  </Descriptions.Item>
                  <Descriptions.Item label="其中财政补助(万元)" span={2}>
                    {ele.subsidy_money}
                  </Descriptions.Item>
                  <Descriptions.Item label="进度安排" span={6}>
                    {moment(ele.schedule_start_at).format('YYYY-MM')}至
                    {moment(ele.schedule_end_at).format('YYYY-MM')}
                  </Descriptions.Item>
                </React.Fragment>
              ))}
            </Descriptions>
          ) : null}
          {(realArray && realArray.length) ||
          (real2Array && real2Array.length) ||
          (real3Array && real3Array.length) ? (
            <>
              <Descriptions
                className={styles.marginTop20}
                title="合计"
                column={6}
                bordered
              >
                <Descriptions.Item label="计划总投资金额(万元)" span={2}>
                  {moneyFormat(realArraySum1 + real2ArraySum1 + real3ArraySum1)}
                </Descriptions.Item>
                <Descriptions.Item label="计划财政补助总金额(万元)" span={2}>
                  {moneyFormat(realArraySum2 + real2ArraySum2 + real3ArraySum2)}
                </Descriptions.Item>
              </Descriptions>
            </>
          ) : null}
          {showEditButton ? (
            <div className={`${styles.flexEnd} ${styles.marginTop20}`}>
              <Button type="primary" onClick={() => noticeModalTrigger()}>
                修改项目基础信息
              </Button>
            </div>
          ) : null}
        </div>
        {showHrLine ? <div className={styles.hrLine}></div> : null}
        <div className={styles.halfCon}>
          <AuditCon
            detail={currentInfo}
            fetchDetail={fetchDetail}
            fetchRecord={fetchRecord}
            noticeTrigger={fetchNoticeSignal}
          />
        </div>
      </div>
      <div className={styles.greyGap}></div>
      <div className={styles.betweenCon}>
        <div className={styles.left}>
          <div className={styles.materialPart}>
            <div className={styles.materialTitle}>申报材料</div>
            {currentInfo.project_declaration_history_list ? (
              <div className={styles.declarationMaterial}>
                <div className={styles.materialItemTitleCon}>
                  <div className={styles.materialItemTitle}>项目申报书</div>
                </div>
                <Table
                  className={styles.materialTableCon}
                  columns={declarationColumns}
                  rowKey={(item: any) => item.id}
                  dataSource={declarationArray}
                  pagination={false}
                  bordered
                />
              </div>
            ) : null}
            {currentInfo.project_implement_plan_history_list ? (
              <div className={styles.implementMaterial}>
                <div className={styles.materialItemTitleCon}>
                  <div className={styles.materialItemTitle}>
                    项目实施方案简表
                  </div>
                </div>
                <Table
                  className={styles.materialTableCon}
                  columns={implementColumns}
                  rowKey={(item: any) => item.id}
                  dataSource={implementArray}
                  pagination={false}
                  bordered
                />
              </div>
            ) : null}
            {currentInfo.business_license_list ? (
              <div className={styles.businessMaterial}>
                <div className={styles.materialItemTitleCon}>
                  <div className={styles.materialItemTitle}>营业执照复印件</div>
                </div>
                {businessArray.length ? (
                  <div className={styles.materialItemFlex}>
                    {businessArray.map((ele: any, index) => (
                      <div key={ele.id} className={styles.previewCon}>
                        <div
                          className={styles.previewImg}
                          onClick={() =>
                            checkMaterialDetail(ele, businessArray)
                          }
                          style={{ backgroundImage: imgIconFilter(ele) }}
                        ></div>
                        <a
                          className={styles.previewName}
                          onClick={() => {
                            fetch(ele.src, {})
                              .then((res) => res.blob())
                              .then((blob) => {
                                downloadAs(blob, ele.origin_name, blob.type);
                              });
                          }}
                        >
                          {ele.origin_name}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            ) : null}
            {currentInfo.land_procedure_list ? (
              <div className={styles.landMaterial}>
                <div className={styles.materialItemTitleCon}>
                  <div className={styles.materialItemTitle}>
                    土地流转协议等用地手续
                  </div>
                </div>
                {landArray.length ? (
                  <div className={styles.materialItemFlex}>
                    {landArray.map((ele: any, index) => (
                      <div key={ele.id} className={styles.previewCon}>
                        <div
                          className={styles.previewImg}
                          onClick={() => checkMaterialDetail(ele, landArray)}
                          style={{ backgroundImage: imgIconFilter(ele) }}
                        ></div>
                        <a
                          className={styles.previewName}
                          onClick={() => {
                            fetch(ele.src, {})
                              .then((res) => res.blob())
                              .then((blob) => {
                                downloadAs(blob, ele.origin_name, blob.type);
                              });
                          }}
                        >
                          {ele.origin_name}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            ) : null}
            {currentInfo.project_facility_list ? (
              <div className={styles.facilityMaterial}>
                <div className={styles.materialItemTitleCon}>
                  <div className={styles.materialItemTitle}>
                    项目购置设备设施清单
                  </div>
                </div>
                <Table
                  className={styles.materialTableCon}
                  columns={facilityColumns}
                  rowKey={(item: any) => item.id}
                  dataSource={facilityArray}
                  pagination={false}
                  bordered
                />
              </div>
            ) : null}
            {currentInfo.investment_materials_list ? (
              <div className={styles.investmentMaterial}>
                <div className={styles.materialItemTitleCon}>
                  <div className={styles.materialItemTitle}>
                    项目有关工程设计及投资情况佐证材料
                  </div>
                </div>
                {investmentArray.length ? (
                  <div className={styles.materialItemFlex}>
                    {investmentArray.map((ele: any, index) => (
                      <div key={ele.id} className={styles.previewCon}>
                        <div
                          className={styles.previewImg}
                          onClick={() =>
                            checkMaterialDetail(ele, investmentArray)
                          }
                          style={{ backgroundImage: imgIconFilter(ele) }}
                        ></div>
                        <a
                          className={styles.previewName}
                          onClick={() => {
                            fetch(ele.src, {})
                              .then((res) => res.blob())
                              .then((blob) => {
                                downloadAs(blob, ele.origin_name, blob.type);
                              });
                          }}
                        >
                          {ele.origin_name}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            ) : null}
            {currentInfo.other_materials_list ? (
              <div className={styles.otherMaterial}>
                <div className={styles.materialItemTitleCon}>
                  <div className={styles.materialItemTitle}>
                    根据项目建设需要提供的其他材料
                  </div>
                </div>
                {otherArray.length ? (
                  <div className={styles.materialItemFlex}>
                    {otherArray.map((ele: any, index) => (
                      <div key={ele.id} className={styles.previewCon}>
                        <div
                          className={styles.previewImg}
                          onClick={() => checkMaterialDetail(ele, otherArray)}
                          style={{ backgroundImage: imgIconFilter(ele) }}
                        ></div>
                        <a
                          className={styles.previewName}
                          onClick={() => {
                            fetch(ele.src, {})
                              .then((res) => res.blob())
                              .then((blob) => {
                                downloadAs(blob, ele.origin_name, blob.type);
                              });
                          }}
                        >
                          {ele.origin_name}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            ) : null}
            {currentInfo.farm_reference_materials_list ? (
              <div className={styles.otherMaterial}>
                <div className={styles.materialItemTitleCon}>
                  <div className={styles.materialItemTitle}>
                    涉及生产设施用房建设的需提供设施用地审批材料
                  </div>
                </div>
                {farmRef.length ? (
                  <div className={styles.materialItemFlex}>
                    {farmRef.map((ele: any, index) => (
                      <div key={ele.id} className={styles.previewCon}>
                        <div
                          className={styles.previewImg}
                          onClick={() => checkMaterialDetail(ele, farmRef)}
                          style={{ backgroundImage: imgIconFilter(ele) }}
                        ></div>
                        <a
                          className={styles.previewName}
                          onClick={() => {
                            fetch(ele.src, {})
                              .then((res) => res.blob())
                              .then((blob) => {
                                downloadAs(blob, ele.origin_name, blob.type);
                              });
                          }}
                        >
                          {ele.origin_name}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            ) : null}
            {currentInfo.financial_support_materials_list ? (
              <div className={styles.otherMaterial}>
                <div className={styles.materialItemTitleCon}>
                  <div className={styles.materialItemTitle}>
                    项目建设区域内近二年各级财政资金扶持情况
                  </div>
                </div>
                {financialSupport.length ? (
                  <div className={styles.materialItemFlex}>
                    {financialSupport.map((ele: any, index) => (
                      <div key={ele.id} className={styles.previewCon}>
                        <div
                          className={styles.previewImg}
                          onClick={() =>
                            checkMaterialDetail(ele, financialSupport)
                          }
                          style={{ backgroundImage: imgIconFilter(ele) }}
                        ></div>
                        <a
                          className={styles.previewName}
                          onClick={() => {
                            fetch(ele.src, {})
                              .then((res) => res.blob())
                              .then((blob) => {
                                downloadAs(blob, ele.origin_name, blob.type);
                              });
                          }}
                        >
                          {ele.origin_name}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            ) : null}
            {currentInfo.regional_photo_materials_list ? (
              <div className={styles.otherMaterial}>
                <div className={styles.materialItemTitleCon}>
                  <div className={styles.materialItemTitle}>
                    项目建设内容布置示意图及区域现状照片
                  </div>
                </div>
                {regionPhoto.length ? (
                  <div className={styles.materialItemFlex}>
                    {regionPhoto.map((ele: any, index) => (
                      <div key={ele.id} className={styles.previewCon}>
                        <div
                          className={styles.previewImg}
                          onClick={() => checkMaterialDetail(ele, regionPhoto)}
                          style={{ backgroundImage: imgIconFilter(ele) }}
                        ></div>
                        <a
                          className={styles.previewName}
                          onClick={() => {
                            fetch(ele.src, {})
                              .then((res) => res.blob())
                              .then((blob) => {
                                downloadAs(blob, ele.origin_name, blob.type);
                              });
                          }}
                        >
                          {ele.origin_name}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            ) : null}
          </div>
          <div className={styles.recordPart}>
            <div className={styles.recordTitle}>申报记录</div>
            <div className={styles.tableCon}>
              <Table
                columns={columns}
                rowKey={(item: any) => item.id}
                dataSource={recordArray}
                pagination={false}
                loading={loading}
                scroll={{ y: 550 }}
                bordered
              />
              {/* <Pagination
              className={styles.pagination}
              total={total}
              current={current}
              pageSize={pagesize}
              showTotal={showTotal}
              showSizeChanger={true}
              onChange={onPagChange}
              onShowSizeChange={onSizeChange}
            /> */}
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <ApprovalForm
            detail={currentInfo}
            fetchDetail={fetchDetail}
            fetchRecord={fetchRecord}
            noticeTrigger={fetchNoticeSignal}
          />
        </div>
      </div>
      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showEditModal}
        title={'修改项目基础信息'}
        width={1300}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        footer={[
          <Button
            key="12"
            loading={load2ing}
            className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
            onClick={handleEditCancel}
          >
            取消
          </Button>,
          <Button
            key="su2bmit"
            type="primary"
            loading={loading}
            className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
            onClick={handleEditOk}
          >
            确定
          </Button>,
        ]}
      >
        <Form
          className={styles.formModal}
          form={formRef}
          name="nest-messages"
          labelAlign={'left'}
          labelCol={{ span: 7 }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label={'原项目名称'}>
                <Input value={currentInfo?.project_name} readOnly></Input>
              </Form.Item>
              <Form.Item label={'新项目名称'} name={'afterProject_name'}>
                <Input placeholder="请输入"></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={'原项目详细地点'}>
                <Input readOnly value={currentInfo?.area_detail}></Input>
              </Form.Item>
              <Form.Item label={'新项目详细地点'} name={'afterArea_detail'}>
                <Input placeholder="请输入"></Input>
              </Form.Item>
            </Col>
          </Row>
          {/* <Row gutter={24}>
            <Col span={12}>
              <Form.Item label={'原建设期限'}>
                <RangePicker
                  defaultValue={[
                    moment(currentInfo?.build_start_at),
                    moment(currentInfo?.build_end_at),
                  ]}
                  picker="month"
                  disabled
                />
              </Form.Item>
              <Form.Item label={'新建设期限'} name={'build_at'}>
                <RangePicker picker="month" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={'原申报单位'}>
                <Input readOnly value={currentInfo?.declare_unit}></Input>
              </Form.Item>
              <Form.Item label={'新申报单位'} name={'afterDeclare_unit'}>
                <Input placeholder="请输入"></Input>
              </Form.Item>
            </Col>
          </Row> */}
          <Row gutter={24}>
            {/* <Col span={12}>
              <Form.Item label={'原联系电话'}>
                <Input readOnly value={currentInfo?.unit_charge_mobile}></Input>
              </Form.Item>
              <Form.Item
                label={'新联系电话'}
                name={'afterUnit_charge_mobile'}
                rules={[
                  { pattern: /^1[3-9]\d{9}$/, message: `请填写正确手机号` },
                ]}
              >
                <Input placeholder="请输入" maxLength={11}></Input>
              </Form.Item>
            </Col> */}
            <Col span={12}>
              <Form.Item label={'主要建设内容'}>
                <Input
                  readOnly
                  value={
                    currentInfo.project_implement_plan_history_list &&
                    currentInfo.project_implement_plan_history_list[
                      currentInfo.project_implement_plan_history_list.length - 1
                    ].history_content.build_main_content
                  }
                ></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={'新主要建设内容'}
                name={'afterBuild_main_content'}
              >
                <Input maxLength={200} placeholder="请输入"></Input>
              </Form.Item>
            </Col>
          </Row>
          {/* <Row gutter={24}>
            <Col span={12}>
              <Form.Item label={'主要建设内容'}>
                <Input
                  readOnly
                  value={
                    currentInfo.project_implement_plan_history_list &&
                    currentInfo.project_implement_plan_history_list[
                      currentInfo.project_implement_plan_history_list.length - 1
                    ].history_content.build_main_content
                  }
                ></Input>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={'新主要建设内容'}
                name={'afterBuild_main_content'}
              >
                <Input maxLength={200} placeholder="请输入"></Input>
              </Form.Item>
            </Col>
          </Row> */}
          {realArray && realArray.length ? (
            <>
              <Row gutter={24} className={styles.modalItemTitleStyle}>
                <Col span={12}>分项一：基础设施建设</Col>
              </Row>
              <Row gutter={24}>
                <Table
                  columns={columnFormsOld}
                  rowKey={(item: any, index: any) => index}
                  dataSource={realArray}
                  scroll={{ y: 500 }}
                  pagination={false}
                  bordered
                />
              </Row>
              <Row gutter={24} className={styles.modalItemTitleStyle}>
                <Col span={12}>新分项一：基础设施建设</Col>
              </Row>
              <Row gutter={24}>
                <Form.Item name="table1" valuePropName="dataSource">
                  <Table
                    columns={columnForms}
                    rowKey={(item: any, index: any) => index}
                    pagination={false}
                    scroll={{ y: 500 }}
                    bordered
                  />
                </Form.Item>
              </Row>
            </>
          ) : null}
          {real2Array && real2Array.length ? (
            <>
              <Row gutter={24} className={styles.modalItemTitleStyle}>
                <Col span={12}>
                  {realArray && realArray.length
                    ? '分项二：设施设备'
                    : '分项一：设施设备'}
                </Col>
              </Row>
              <Row gutter={24}>
                <Table
                  columns={column2OldForms}
                  rowKey={(item: any, index: any) => index}
                  dataSource={real2Array}
                  scroll={{ y: 500 }}
                  pagination={false}
                  bordered
                />
              </Row>
              <Row gutter={24} className={styles.modalItemTitleStyle}>
                <Col span={12}>
                  {realArray && realArray.length
                    ? '新分项二：设施设备'
                    : '新分项一：设施设备'}
                </Col>
              </Row>
              <Row gutter={24}>
                <Form.Item name="table2" valuePropName="dataSource">
                  <Table
                    columns={column2Forms}
                    rowKey={(item: any, index: any) => index}
                    pagination={false}
                    scroll={{ y: 500 }}
                    bordered
                  />
                </Form.Item>
              </Row>
            </>
          ) : null}
          {real3Array && real3Array.length ? (
            <>
              <Row gutter={24} className={styles.modalItemTitleStyle}>
                <Col span={12}>
                  {real2Array && real2Array.length
                    ? realArray && realArray.length
                      ? '分项三(其他)'
                      : '分项二(其他)'
                    : realArray && realArray.length
                    ? '分项二(其他)'
                    : '分项一(其他)'}
                </Col>
              </Row>
              <Row gutter={24}>
                <Table
                  columns={column3OldForms}
                  rowKey={(item: any, index: any) => index}
                  dataSource={real3Array}
                  scroll={{ y: 500 }}
                  pagination={false}
                  bordered
                />
              </Row>
              <Row gutter={24} className={styles.modalItemTitleStyle}>
                <Col span={12}>
                  {real2Array && real2Array.length
                    ? realArray && realArray.length
                      ? '新分项三(其他)'
                      : '新分项二(其他)'
                    : realArray && realArray.length
                    ? '新分项二(其他)'
                    : '新分项一(其他)'}
                </Col>
              </Row>
              <Row gutter={24}>
                <Form.Item name="table3" valuePropName="dataSource">
                  <Table
                    columns={column3Forms}
                    rowKey={(item: any, index: any) => index}
                    pagination={false}
                    scroll={{ y: 500 }}
                    bordered
                  />
                </Form.Item>
              </Row>
            </>
          ) : null}
          {(realArray && realArray.length) ||
          (real3Array && real3Array.length) ||
          (real2Array && real2Array.length) ? (
            <>
              <Row gutter={24} className={styles.modalItemTitleStyle}>
                <Col span={12}>
                  <div>
                    计划总投资金额(万元)：
                    {moneyFormat(
                      realArraySum1 + real2ArraySum1 + real3ArraySum1,
                    )}
                  </div>
                  <div>
                    计划财政补助总金额(万元)：
                    {moneyFormat(
                      realArraySum2 + real2ArraySum2 + real3ArraySum2,
                    )}
                  </div>
                </Col>
              </Row>
              <Row gutter={24} className={styles.modalItemTitleStyle}>
                <Col span={12}>
                  <div>
                    新计划总投资金额(万元)：
                    {moneyFormat(newArraySum1 + new2ArraySum1 + new3ArraySum1)}
                  </div>
                  <div>
                    新计划财政补助总金额(万元)：
                    {moneyFormat(newArraySum2 + new2ArraySum2 + new3ArraySum2)}
                  </div>
                </Col>
              </Row>
            </>
          ) : null}
        </Form>
      </Modal>
      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showActionModal}
        title={dynamicTitle}
        width={500}
        onOk={handleActionOk}
        onCancel={handleActionCancel}
        footer={[
          <Button
            key="1"
            loading={loading}
            className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
            onClick={handleActionCancel}
          >
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
            onClick={handleActionOk}
          >
            确定
          </Button>,
        ]}
      >
        <TextArea
          placeholder="请输入"
          rows={4}
          value={textValue}
          onChange={textChange}
        ></TextArea>
      </Modal>
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

export default connect(({ baseModel }) => ({ baseModel }))(DeclareHomePage);
