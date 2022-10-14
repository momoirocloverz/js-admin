import styles from './detail.less';
import Apis from '@/utils/apis';
import { connect, history, useLocation } from 'umi';
import React, { useEffect, useState } from 'react';
import {
  message,
  Button,
  Input,
  Space,
  Popconfirm,
  Modal,
  Select,
  Descriptions,
  Form,
  Table,
  Tag,
} from 'antd';
import { approvalProjectReserve } from '@/api/projects';
import MediaUploader from '@/components/form/MediaUploader';
const { Option } = Select;
const { TextArea } = Input;
import moment from 'moment';
const projectTypeObj: any = {
  1: '种植业',
  2: '养殖业',
  3: '加工业',
  4: '乡村建设',
  9: '其他',
};
const ProjectReserveDetail = (props: any) => {
  const { accountInfo, dispatch, children, realId } = props;
  const location = useLocation();
  const [currentDetail, setCurrentDetail] = useState<any>({});
  const [operateAble, setOperateAble] = useState(false);
  const [passVisible, setPassVisible] = useState(false);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [rawProjectType, setRawProjectType] = useState(null);
  const [showApprovalBtn, setShowApprovalBtn] = useState(false);
  const [total_money, setTotal_money] = useState(0);
  const [implementArray, setImplementArray] = useState([]);
  const [approvalForm] = Form.useForm();
  const initAction = () => {
    // commitGlobalBread([
    //   {
    //     title: '投资项目管理',
    //     triggerOn: true,
    //   },
    //   {
    //     title: '项目储备详情',
    //   },
    // ]);
  };
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };
  useEffect(() => {
    if (realId) {
      initAction();
      fetchDetail();
    }
  }, [realId]);

  const fetchDetail = () => {
    if (realId) {
      Apis.projectReserveDetail({ id: realId })
        .then((res: any) => {
          if (res && res.code === 0) {
            setCurrentDetail(res.data.info);
            setShowApprovalBtn(!!(res.data.info.status == 1));
            setRawProjectType(res.data?.info.project_type);
            if (res.data.info && res.data.info.part_options) {
              calcFunction(res.data.info.part_options);
            }
            initFormData(res.data.info);
            setImplementArray([
              {
                id: 1,
                index: 1,
                created_at: res.data.info.updated_at,
              },
            ]);
            if (res.data.info.status != 1) {
              setOperateAble(true);
            } else {
              setOperateAble(false);
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

  // 设置审核内容初始值
  const initFormData = (data: any) => {
    approvalForm.setFieldsValue({
      link_mobile: data.link_mobile,
      audit_reason: data.audit_reason,
      audit_attachment:
        data.audit_attachment && data.audit_attachment.length
          ? data.audit_attachment.map((v: any) => {
              return {
                url: v,
                thumbUrl: v,
              };
            })
          : [],
    });
  };

  // 提交项目储备审核
  const handleApproval = (params: any, setFunc: any) => {
    approvalProjectReserve(params)
      .then((res: any) => {
        if (res.code == 0) {
          message.success(`${params.status == 2 ? '通过' : '驳回'}提交成功`);
          fetchDetail();
          approvalForm.resetFields();
          setFunc && setFunc(false);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err: any) => {
        console.log(err);
        message.error(err.msg);
      });
  };

  // 保存项目类型
  const saveProjectType = () => {
    if (
      rawProjectType != null &&
      rawProjectType != currentDetail.project_type
    ) {
      const oldType = projectTypeObj[rawProjectType];
      const newType = projectTypeObj[currentDetail.project_type];
      Modal.confirm({
        title: '提示',
        content: `确定将该项目的项目类型由\n${oldType} 修改为 ${newType} 吗？`,
        onOk: async () => {
          const result: any = await Apis.updateProjectType({
            id: currentDetail.id,
            project_type: currentDetail.project_type,
          });
          if (result.code == 0) {
            message.success('修改成功');
            setRawProjectType(currentDetail.project_type);
            fetchDetail();
          } else {
            message.warning(result.msg);
          }
        },
      });
    } else {
      message.warning('项目类型未改变');
    }
  };

  // 审核确认
  const showPopconfirm = (setFunc: any) => {
    setFunc(true);
  };

  // 审核取消
  const handleCancel = (setFunc: any) => {
    setFunc(false);
  };

  // 审核tag标签
  const approvalTag = () => {
    /*     if (currentDetail.status == 2) {
      return (
        <Tag className={styles.approvalTag} color="green">
          已通过
        </Tag>
      );
    } else if (currentDetail.status == 9) {
      return (
        <Tag className={styles.approvalTag} color="red">
          已驳回
        </Tag>
      );
    } else if (currentDetail.status == 1) {
      return (
        <Tag className={styles.approvalTag} color="#0270c3">
          待审核
        </Tag>
      );
    } */
  };

  // 改变项目类型
  const changeProjectType = (e: any) => {
    // console.log(e);
    currentDetail.project_type = e;
    // console.log('currentDetail', currentDetail);
  };

  const calcFunction = (val: any) => {
    let after = val;
    if (after) {
      let track1 = [];
      let track2 = [];
      let track3 = [];
      let track4 = [];
      if (after) {
        let bridge1 = after.find((ele: any) => {
          return ele.option_name == '基础设施建设';
        });
        track1 = (bridge1 && bridge1.list) || [];
        let bridge2 = after.find((ele) => {
          return ele.option_name == '设施设备';
        });
        track2 = (bridge2 && bridge2.list) || [];
        let bridge3 = after.find((ele) => {
          return ele.option_name == '技术引进推广';
        });
        track3 = (bridge3 && bridge3.list) || [];
        let bridge4 = after.find((ele) => {
          return ele.option_name == '其他';
        });
        track4 = (bridge4 && bridge4.list) || [];

        let temp1 = track1.map((ele) => {
          if (!ele.invest_money || !ele.subsidy_money) {
            return {
              ...ele,
              invest_money: ele.invest_money ? ele.invest_money : 0,
              subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0,
            };
          } else {
            return {
              ...ele,
            };
          }
        });
        let temp2 = track2.map((ele) => {
          if (!ele.invest_money || !ele.subsidy_money) {
            return {
              ...ele,
              invest_money: ele.invest_money ? ele.invest_money : 0,
              subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0,
            };
          } else {
            return {
              ...ele,
            };
          }
        });
        let temp3 = track3.map((ele) => {
          if (!ele.invest_money || !ele.subsidy_money) {
            return {
              ...ele,
              invest_money: ele.invest_money ? ele.invest_money : 0,
              subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0,
            };
          } else {
            return {
              ...ele,
            };
          }
        });

        let temp4 = track4.map((ele) => {
          if (!ele.invest_money || !ele.subsidy_money) {
            return {
              ...ele,
              invest_money: ele.invest_money ? ele.invest_money : 0,
              subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0,
            };
          } else {
            return {
              ...ele,
            };
          }
        });

        let tempMaster = [...temp1, ...temp2, ...temp3, ...temp4];
        let res1 = tempMaster.reduce((acc, current) => {
          return Number(acc) + Number(current.invest_money);
        }, 0);
        let res2 = tempMaster.reduce((acc, current) => {
          return Number(acc) + Number(current.subsidy_money);
        }, 0);
        setTotal_money(res1);
      }
    }
  };
  const moneyFormat = (value: any) => {
    if (value || value == 0) {
      let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
      return fix;
    }
  };

  const toImplementDetail = (item: any) => {
    history.push({
      pathname: '/invest/code/Detail/table',
      query: {
        id: realId,
      },
    });
  };
  const implementColumns: any = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: '递交时间',
      dataIndex: 'created_at',
      align: 'center',
      render: (text: any, record: any) => (
        <div className={styles.lastTagCon}>
          <div>{record.created_at}</div>
          {/* {record.mainIndex == implementArray.length ? (
            <div
              className={` ${
                record.mainIndex == implementArray.length ? styles.lastTag : ''
              }`}
            >
              最新
            </div>
          ) : null} */}
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
  return (
    <div className={styles.homePageCon}>
      <div className={styles.leftCon}>
        <div className={styles.leftTopCon}>
          <Descriptions
            title="项目储备详情"
            column={1}
            labelStyle={{ minWidth: '80px' }}
          >
            <Descriptions.Item label="项目名称">
              {currentDetail.project_name || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="项目类型" className="centerLabel">
              <Space size="middle">
                <Select
                  disabled
                  defaultValue={currentDetail.project_type}
                  key={currentDetail.project_type}
                  style={{ width: 100 }}
                  onChange={changeProjectType}
                >
                  {Object.keys(projectTypeObj).map((key) => (
                    <Option value={parseInt(key)} key={key}>
                      {projectTypeObj[key]}
                    </Option>
                  ))}{' '}
                </Select>

                {/* {currentDetail.status != 2 && (
                  <Button
                    type="primary"
                    style={{ backgroundColor: '#0270c3' }}
                    onClick={saveProjectType}
                  >
                    保存
                  </Button>
                )} */}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="项目地点">
              {currentDetail.full_area || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="建设期限">
              {moment(currentDetail.build_start_at).format('YYYY-MM-DD')}至
              {moment(currentDetail.build_end_at).format('YYYY-MM-DD')}
            </Descriptions.Item>
            <Descriptions.Item label="申报单位">
              {currentDetail.declare_unit || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="负责人">
              {currentDetail.unit_charge_name || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="联系电话">
              {currentDetail.unit_charge_mobile || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="申报时间">
              {currentDetail.declare_at || '-'}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions
            title="项目建设规模及主要建设内容"
            column={2}
            labelStyle={{ minWidth: '80px' }}
          >
            {currentDetail.build_contents &&
              currentDetail.build_contents.map((ele: any, index: number) => (
                <React.Fragment key={index}>
                  <Descriptions.Item label="项目内容" span={2}>
                    {ele.content}
                  </Descriptions.Item>
                  {/* <Descriptions.Item label="投资额">
                  {ele.invest_money}万元
                </Descriptions.Item> */}
                </React.Fragment>
              ))}
            <Descriptions.Item label="投资金额合计">
              {moneyFormat(total_money) || '-'}万元
            </Descriptions.Item>
          </Descriptions>
          {/* <div className={styles.approvalStatus}>{approvalTag()}</div> */}
        </div>
        <div className={styles.leftBottomCon}>
          <div>
            <Descriptions
              title="申报材料"
              column={1}
              labelStyle={{ minWidth: '80px' }}
            ></Descriptions>
            <div className={styles.materialItemTitleCon}>
              <div className={styles.materialItemTitle}>项目申报书</div>
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
        </div>
      </div>
    </div>
  );
};

export default connect((baseModel) => ({ baseModel }))(ProjectReserveDetail);
