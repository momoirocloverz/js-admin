import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useRef, useState } from 'react';
import AuditApproval from './components/AuditApproval';
import AuthWrapper from '@/components/auth/authWrapper';
import {
  message,
  Button,
  Input,
  Table,
  Pagination,
  Space,
  Tabs,
  Select,
  DatePicker,
  Form,
  Cascader,
  Drawer,
} from 'antd';
const { TabPane } = Tabs;
import moment from 'moment';
import CommonStyles from '@/pages/application/index.less';
import STATUS from '@/utils/status';
import { CROPS_MAP_PROCESS } from '@/pages/application/const';
import { generateStatus } from './generateStatus';
const { Option } = Select;
const cropsAuditIndex = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [total, setTotal] = useState(0);

  const [selectValue, setSelectValue] = useState(1);
  const [userName, setUserName] = useState('');
  const [townValue, setTownValue] = useState<any>([]);
  const [resetFlag, setResetFlag] = useState(false);
  const [townList, setTownList] = useState<Array<any>>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedId, setSelectedId] = useState<Array<any>>([]);
  const [roleType, setRoleType] = useState(0);
  const [projectPosition, setProjectPosition] = useState(-1);
  const [tableColumns, setTableColumns] = useState<any>([]);
  const [showBatchBtn, setShowBatchBtn] = useState<any>(false);

  const selectValueRef = useRef<any>(null);

  useEffect(() => {
    selectValueRef.current = selectValue;
  }, [selectValue]);

  // 表格选中项改变触发
  const onRowSelectionChange = (slection: any) => {
    // console.log('onRowSelectionChange', slection);
    setSelectedId(slection);
  };
  // 选择框的默认属性配置
  const getCheckboxProps = (record: any) => {
    if (record.status == 82) {
      return { disabled: true };
    } else {
      return null;
    }
  };
  const [rowSelectionOption, setRowSelectionOption] = useState<any>({
    onChange: onRowSelectionChange,
    // getCheckboxProps: getCheckboxProps,
  });

  const tabs = [
    { label: '待审核', value: 1 },
    { label: '已通过', value: 2 },
    { label: '已驳回', value: 9 },
    { label: '全部', value: -1 },
  ];

  const positionOptions = [
    { label: '全部', value: -1 },
    { label: '农业农村局审核人员', value: 5 },
    { label: '公示人（政府网）', value: 7 },
    { label: '资金拨付', value: 8 },
  ];
  const initAction = () => {
    commitGlobalBread([
      {
        title: '惠农补贴管理',
      },
      {
        title: '粮油适度规模经营补贴审核',
      },
    ]);
  };
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };

  const initRequest = () => {
    let data = {
      search_username: userName,
      page: current,
      pagesize: pagesize,
      which_form_type: 5,
      search_form_type: 26,
      search_status: -1,
      project_position: projectPosition,
    };

    if (selectValue) {
      data.search_status = Number(selectValue);
    }

    // console.log('townValue', townValue, townList);

    if (townValue && townValue.length) {
      let town_ids: any = [],
        village_ids: any = [];
      townValue.forEach((v: any) => {
        if (v && v[1] && !town_ids.includes(v[1])) {
          town_ids.push(v[1]);
        }
        if (v && v[2] && !village_ids.includes(v[2])) {
          village_ids.push(v[2]);
        }
        // if (!v[2]) {
        //   // 无village_id 说明选中了所有镇 取到此镇下的所有village_id push进village_ids
        //   village_ids = village_ids.concat(getAllVillageId(v[1]));
        // }
      });
      data.city_ids = [1];
      data.town_ids = town_ids || [];
      data.village_ids = village_ids || [];
    }

    // console.log(JSON.stringify(data));
    Apis.fetchProjectSubList(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          let bridge = res.data.data.map((ele: any, index: number) => {
            return { ...ele, index: index + 1 };
          });
          setListData(bridge);
          setTotal(res.data.total);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  // 获取级联选择乡镇数据
  const fetchTown = () => {
    Apis.fetchAreaList({})
      .then((res: any) => {
        if (res && res.code === 0) {
          const currentUser: any = window.sessionStorage.getItem('currentInfo');
          const currentTownId =
            JSON.parse(currentUser).admin_info?.role_info?.town_id;
          // if (currentTownId) {
          //   // 过滤当前用户对应乡镇的数据
          //   const matchTown = res.data.list[0].children.find(
          //     (v: any) => v.id == currentTownId,
          //   );
          //   setTownList([matchTown]);
          // } else {
          setTownList(res.data.list);
          // }
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
    fetchTown();
    // 获取roleType
    const adminInfo = JSON.parse(
      window.sessionStorage.getItem('currentInfo'),
    )?.admin_info;
    const roleType = adminInfo.role_type;
    setRoleType(roleType);

    if ([26, 27].includes(Number(roleType))) {
      setTableColumns(townColumns);
    } else if ([10, 11].includes(Number(roleType))) {
      setTableColumns(ruralColumns);
    } else {
      setRowSelectionOption(false);
      setTableColumns(villageColumns);
    }
  }, []);

  useEffect(() => {
    if ([10, 11, 26, 27].includes(Number(roleType)) && selectValue == 1) {
      setShowBatchBtn(true);
    } else {
      setShowBatchBtn(false);
    }
  }, [selectValue, roleType]);

  const showTotal = (total: number) => {
    return `共 ${total} 条`;
  };

  // 村级角色类型表格配置
  const villageColumns: any = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      width: 70,
    },
    {
      title: '申请人',
      align: 'center',
      width: 110,
      render: (text: any, record: any) => (
        <>
          <div>
            {record.submit_userinfo && record.submit_userinfo.real_name
              ? record.submit_userinfo.real_name
              : '-'}
          </div>
        </>
      ),
    },
    {
      title: '办公地址',
      align: 'center',
      render: (text: any, record: any) => {
        let sub_form_info = record.sub_form_info;
        if (sub_form_info?.bg_area_info) {
          let bg_area_info = sub_form_info.bg_area_info;
          return (
            <>
              <div>
                {bg_area_info.city_name}
                {bg_area_info.town_name}
                {bg_area_info.village_name}
                {sub_form_info.bg_address}
              </div>
            </>
          );
        } else {
          return <>-</>;
        }
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      align: 'center',
    },
    {
      title: `${selectValueRef.current == -1 ? '当前节点' : '状态'}`,
      dataIndex: 'status',
      align: 'center',
      // width: 110,
      render: (text: any, record: any) => {
        if (record.status >= 0) {
          if (selectValueRef.current == -1) {
            return CROPS_MAP_PROCESS[record.status]?.title;
          } else {
            const statusData: any = generateStatus(
              Number(selectValueRef.current),
              record,
            );
            return (
              <>
                {record.status >= 0 && (
                  <Space size="middle">
                    <div className={CommonStyles[statusData[1]]}>
                      <div className={CommonStyles.spot}></div>
                      <div className={CommonStyles.statusText}>
                        {statusData[0]}
                        {/* {STATUS.statusLabel[record.status]} */}
                      </div>
                    </div>
                  </Space>
                )}
              </>
            );
          }
        }
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 80,
      render: (text: any, record: any) => (
        <Space size="middle">
          <AuthWrapper mark={'helpFarmer-/helpFarmer/cropsAudit-audit'}>
            <a className={styles.darker} onClick={() => toDetail(record)}>
              查看
            </a>
          </AuthWrapper>
        </Space>
      ),
    },
  ];

  // 乡镇角色类型表格配置
  const townColumns: any = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      width: 70,
    },
    {
      title: '经营主体',
      align: 'center',
      width: 110,
      render: (text: any, record: any) => (
        <>
          <div>
            {record.sub_form_info && record.sub_form_info.main_name
              ? record.sub_form_info.main_name
              : '-'}
          </div>
        </>
      ),
    },
    {
      title: '身份证号',
      align: 'center',
      width: 110,
      render: (text: any, record: any) => (
        <>
          <div>
            {record.sub_form_info && record.sub_form_info.idcard
              ? record.sub_form_info.idcard
              : '-'}
          </div>
        </>
      ),
    },
    {
      title: '办公地址',
      align: 'center',
      render: (text: any, record: any) => {
        let sub_form_info = record.sub_form_info;
        if (sub_form_info.bg_area_info) {
          let bg_area_info = sub_form_info.bg_area_info;
          return (
            <>
              <div>
                {bg_area_info.city_name}
                {bg_area_info.town_name}
                {bg_area_info.village_name}
                {sub_form_info.bg_address}
              </div>
            </>
          );
        } else {
          return <>-</>;
        }
      },
    },
    {
      title: '联系电话',
      dataIndex: 'mobile',
      align: 'center',
      render: (text: any, record: any) => {
        let sub_form_info = record.sub_form_info;
        if (sub_form_info.mobile) {
          return sub_form_info.mobile;
        } else {
          return <>-</>;
        }
      },
    },
    {
      title: '申报日期',
      dataIndex: 'created_at',
      align: 'center',
    },
    {
      title: `${selectValueRef.current == -1 ? '当前节点' : '状态'}`,
      dataIndex: 'status',
      align: 'center',
      // width: 110,
      render: (text: any, record: any) => {
        if (record.status >= 0) {
          if (selectValueRef.current == -1) {
            return CROPS_MAP_PROCESS[record.status]?.title;
          } else {
            const statusData: any = generateStatus(
              Number(selectValueRef.current),
              record,
            );
            return (
              <>
                {record.status >= 0 && (
                  <Space size="middle">
                    <div className={CommonStyles[statusData[1]]}>
                      <div className={CommonStyles.spot}></div>
                      <div className={CommonStyles.statusText}>
                        {statusData[0]}
                        {/* {STATUS.statusLabel[record.status]} */}
                      </div>
                    </div>
                  </Space>
                )}
              </>
            );
          }
        }
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 80,
      render: (text: any, record: any) => (
        <Space size="middle">
          <AuthWrapper mark={'helpFarmer-/helpFarmer/cropsAudit-audit'}>
            <a className={styles.darker} onClick={() => toDetail(record)}>
              查看
            </a>
          </AuthWrapper>
        </Space>
      ),
    },
  ];

  // 农业农村局角色类型表格配置
  const ruralColumns: any = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      width: 70,
    },
    {
      title: '乡镇（街道）',
      align: 'center',
      render: (text: any, record: any) => {
        let sub_form_info = record.sub_form_info;
        if (sub_form_info.cb_area_info) {
          let cb_area_info = sub_form_info.cb_area_info;
          return (
            <>
              <div>
                {cb_area_info.city_name}
                {cb_area_info.town_name}
                {cb_area_info.village_name}
              </div>
            </>
          );
        } else {
          return <>-</>;
        }
      },
    },
    {
      title: '申请人',
      align: 'center',
      width: 110,
      render: (text: any, record: any) => (
        <>
          <div>
            {record.submit_userinfo && record.submit_userinfo.real_name
              ? record.submit_userinfo.real_name
              : '-'}
          </div>
        </>
      ),
    },
    {
      title: '经营主体',
      align: 'center',
      width: 110,
      render: (text: any, record: any) => (
        <>
          <div>
            {record.sub_form_info && record.sub_form_info.main_name
              ? record.sub_form_info.main_name
              : '-'}
          </div>
        </>
      ),
    },
    {
      title: '办公地址',
      align: 'center',
      render: (text: any, record: any) => {
        let sub_form_info = record.sub_form_info;
        if (sub_form_info.bg_area_info) {
          let bg_area_info = sub_form_info.bg_area_info;
          return (
            <>
              <div>
                {bg_area_info.city_name}
                {bg_area_info.town_name}
                {bg_area_info.village_name}
                {sub_form_info.bg_address}
              </div>
            </>
          );
        } else {
          return <>-</>;
        }
      },
    },
    {
      title: '申报日期',
      dataIndex: 'created_at',
      align: 'center',
    },
    {
      title: `${selectValueRef.current == -1 ? '当前节点' : '状态'}`,
      dataIndex: 'status',
      align: 'center',
      // width: 110,
      render: (text: any, record: any) => {
        if (record.status >= 0) {
          if (selectValueRef.current == -1) {
            return CROPS_MAP_PROCESS[record.status]?.title;
          } else {
            const statusData: any = generateStatus(
              Number(selectValueRef.current),
              record,
            );
            return (
              <>
                {record.status >= 0 && (
                  <Space size="middle">
                    <div className={CommonStyles[statusData[1]]}>
                      <div className={CommonStyles.spot}></div>
                      <div className={CommonStyles.statusText}>
                        {statusData[0]}
                        {/* {STATUS.statusLabel[record.status]} */}
                      </div>
                    </div>
                  </Space>
                )}
              </>
            );
          }
        }
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 80,
      render: (text: any, record: any) => (
        <Space size="middle">
          <AuthWrapper mark={'helpFarmer-/helpFarmer/cropsAudit-audit'}>
            <a className={styles.darker} onClick={() => toDetail(record)}>
              查看
            </a>
          </AuthWrapper>
        </Space>
      ),
    },
  ];

  const toDetail = (item: any) => {
    history.push({
      pathname: '/helpFarmer/cropsAudit/detail',
      query: {
        id: item.id,
      },
    });
  };

  const onPagChange = (e: any) => {
    setCurrent(e);
    setResetFlag(!resetFlag);
  };

  const onSizeChange = (current: any, size: any) => {
    setPagesize(size);
    setResetFlag(!resetFlag);
  };

  const runSearch = () => {
    setCurrent(1);
    initRequest();
  };

  const resetAction = () => {
    // setSelectValue(1);
    setCurrent(1);
    setUserName('');
    handleTownSelectChange([]);
    setTownValue([]);
    setProjectPosition(-1);
    setResetFlag(!resetFlag);
  };

  useEffect(() => {
    initRequest();
  }, [resetFlag]);

  const handleTownSelectChange = (e: any) => {
    setTownValue(e);
  };

  // 导出
  const exportAction = () => {
    let data = {
      search_username: userName,
      page: current,
      pagesize: pagesize,
      which_form_type: 5,
      search_form_type: 26,
      is_export: 1,
      project_position: projectPosition,
    };

    if (selectedId.length) {
      data.is_export_ids = selectedId.join(',');
    }

    if (selectValue) {
      data.search_status = selectValue;
    }

    if (townValue && townValue.length) {
      let town_ids: any = [],
        village_ids: any = [];
      townValue.forEach((v: any) => {
        if (v && v[1] && !town_ids.includes(v[1])) {
          town_ids.push(v[1]);
        }
        if (v && v[2] && !village_ids.includes(v[2])) {
          village_ids.push(v[2]);
        }
        // if (!v[2]) {
        //   // 无village_id 说明选中了所有镇 取到此镇下的所有village_id push进village_ids
        //   village_ids = village_ids.concat(getAllVillageId(v[1]));
        // }
      });
      data.city_ids = [1];
      data.town_ids = town_ids || [];
      data.village_ids = village_ids || [];
    }

    Apis.exportProjectSubList(data)
      .then((res: any) => {
        const content = res;
        const blob = new Blob([content]);
        const fileName = '粮油适度规模经营补贴申请' + Date.now() + '.xls';
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
  };

  // 切换tab
  const onTabClick = (e: any) => {
    if (e == -1) {
      // 全部 更新列名
      let index = tableColumns.findIndex((v: any) => v.dataIndex == 'status');
      if (index > 0) {
        tableColumns[index].title = '当前节点';
        setTableColumns(tableColumns);
      }
    } else {
      let index = tableColumns.findIndex((v: any) => v.dataIndex == 'status');
      if (index > 0) {
        tableColumns[index].title = '状态';
        setTableColumns(tableColumns);
      }
    }
    setSelectValue(e);
    setResetFlag(!resetFlag);
  };

  // 批量审核
  const batchApproval = () => {
    if (!selectedId.length) {
      return message.warning('请至少选择一条数据');
    }
    try {
      selectedId.forEach((id) => {
        const matchItem = listData.find((item) => item.id == id);
        if (matchItem && matchItem.status == 81) {
          // 资金拨付阶段的数据不可批量审核
          message.warning('所选条目包含资金拨付阶段数据条目，不可批量审核');
          throw new Error();
        }
      });
      setShowDrawer(true);
    } catch {}
  };

  // 关闭审核抽屉
  const onDrawerClose = (e: any) => {
    setShowDrawer(false);
  };

  // 批量审核操作回调
  const approvalCb = () => {
    setShowDrawer(false);
    initRequest();
  };

  const onRoleValueChange = (e: any) => {
    setProjectPosition(e);
  };

  const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
  };

  return (
    <div className={styles.homePageCon}>
      <div className={styles.topLine}>
        <div className={styles.topLeft}>
          <Form
            {...formItemLayout}
            layout="inline"
            initialValues={{
              projectPosition,
            }}
          >
            {roleType == 31 && (
              <>
                <Form.Item label="申请人">
                  <Input
                    placeholder="请输入申请人姓名"
                    className={styles.searchIcon}
                    allowClear
                    onChange={(e) => setUserName(e.target?.value)}
                    value={userName}
                  />
                </Form.Item>
              </>
            )}

            <>
              {[26, 27, 11, 10].includes(Number(roleType)) && (
                <Form.Item className="" label="筛选地区">
                  <Cascader
                    options={townList}
                    multiple
                    style={{
                      width: 180,
                      // marginRight: '30px',
                    }}
                    fieldNames={{
                      label: 'name',
                      value: 'id',
                      children: 'children',
                    }}
                    onChange={handleTownSelectChange}
                    value={townValue}
                    defaultValue={townValue}
                    changeOnSelect={true}
                    placeholder="请选择项目地点"
                  />
                </Form.Item>                
              )}

              {roleType == 10 && (
                <Form.Item label="审核阶段">
                  <Select
                    options={positionOptions}
                    style={{
                      width: 180,
                      // marginRight: '30px',
                    }}
                    value={projectPosition}
                    placeholder="选择审核阶段"
                    onChange={(e) => onRoleValueChange(e)}
                  />
                </Form.Item>
              )}
            </>
          </Form>
        </div>
        <div>
          <Button
            className={`${styles.resetBtnBlockColor} ${styles.resetBtnRadius} ${styles.resetBtnMargin}`}
            onClick={() => resetAction()}
          >
            重置
          </Button>
          <Button
            type="primary"
            className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
            onClick={() => runSearch()}
          >
            查询
          </Button>
        </div>
      </div>
      <div className={styles.tableCon}>
        <Tabs defaultActiveKey="1" onTabClick={onTabClick}>
          {tabs.map((tab) => (
            <TabPane tab={tab.label} key={tab.value}>
              <div className={styles.exportCon}>
                <Space>
                  <Button
                    type="primary"
                    className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
                    onClick={() => exportAction()}
                  >
                    导出
                  </Button>
                  <AuthWrapper mark={'helpFarmer-/helpFarmer/cropsAudit-audit'}>
                    {showBatchBtn && (
                      <Button
                        type="primary"
                        className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
                        onClick={() => batchApproval()}
                      >
                        批量审核
                      </Button>
                    )}
                  </AuthWrapper>
                </Space>
              </div>
              <Table
                columns={tableColumns}
                rowKey={(item: any) => item.id}
                dataSource={listData}
                pagination={false}
                loading={loading}
                // scroll={{ y: 530 }}
                rowSelection={rowSelectionOption}
                bordered
              />
              <Pagination
                className={styles.pagination}
                total={total}
                current={current}
                pageSize={pagesize}
                showTotal={showTotal}
                showSizeChanger={true}
                onChange={onPagChange}
                onShowSizeChange={onSizeChange}
              />
            </TabPane>
          ))}
        </Tabs>
      </div>
      <Drawer
        title="批量审核"
        placement="right"
        onClose={onDrawerClose}
        visible={showDrawer}
      >
        <AuditApproval
          currentDetail={null}
          location={location}
          initRequest={null}
          isBatch={true}
          selectedId={selectedId}
          projectPosition={projectPosition}
          roleType={roleType}
          approvalCb={approvalCb}
        />
      </Drawer>
    </div>
  );
};

export default connect((baseModel) => ({ baseModel }))(cropsAuditIndex);
