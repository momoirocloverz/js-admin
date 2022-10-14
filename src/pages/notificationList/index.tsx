import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
import {
  message,
  Tabs,
  Button,
  Input,
  Table,
  Pagination,
  Space,
  Select,
  Switch,
  Popconfirm,
  Modal,
  Form,
  DatePicker,
  Checkbox,
  Radio,
} from 'antd';
import {
  COMPETITIVE_PROCESS,
  FUND_PROCESS,
  INCLUSIVE_PROCESS,
  LAMBS_PROCESS,
  HARMLESS_PROCESS,
  CROPS_PROCESS,
} from '@/pages/application/const';
const { TabPane } = Tabs;
const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;
const HomePage = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [loginStatus, setLoginStatus] = useState(false);
  const [currentKey, setCurrentKey] = useState('1');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectArray, setSelectArray] = useState([]);
  const [listData, setListData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [total, setTotal] = useState(0);
  const [listData2, setListData2] = useState([]);
  const [current2, setCurrent2] = useState(1);
  const [pagesize2, setPagesize2] = useState(10);
  const [total2, setTotal2] = useState(0);
  const [todoCount, setTodoCount] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  const [checkStrictly, setCheckStrictly] = React.useState(false);
  const [frequency, setFrequency] = useState('a');
  const [categoryId1, setCategoryId1] = useState(undefined);
  const [categoryId2, setCategoryId2] = useState(undefined);
  const [reset1Flag, setReset1Flag] = useState(false);
  const [reset2Flag, setReset2Flag] = useState(false);
  const initAction = () => {
    commitGlobalBread([
      {
        title: '待办事项',
      },
    ]);
  };
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };
  useEffect(() => {
    fetchTodo();
  }, [current, pagesize]);
  useEffect(() => {
    fetchAlready();
  }, [current2, pagesize2]);
  useEffect(() => {
    fetchTodo();
  }, [reset1Flag]);
  useEffect(() => {
    fetchAlready();
  }, [reset2Flag]);
  const fetchTodo = () => {
    Apis.projectTodoList({
      solve_type: 0,
      search_policy_category_ids: categoryId1 ? [categoryId1] : '',
      page: current,
      pagesize: pagesize,
    })
      .then((res: any) => {
        if (res && res.code === 0) {
          setTotal(res.data.total);
          setListData(res.data.data);
          setTodoCount(res.data.wait_solve_count);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const fetchAlready = () => {
    Apis.projectTodoList({
      solve_type: 1,
      page: current2,
      pagesize: pagesize2,
      search_policy_category_ids: categoryId2 ? [categoryId2] : '',
    })
      .then((res: any) => {
        if (res && res.code === 0) {
          setTotal2(res.data.total);
          setListData2(res.data.data);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const fetchCategory = () => {
    Apis.fetchPolicyCategoryList({})
      .then((res: any) => {
        if (res && res.code === 0) {
          setCategoryList(res.data);
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
    fetchTodo();
    fetchCategory();
  }, []);
  const commitGlobalTitle = (e: any) => {
    dispatch({
      type: 'baseModel/changeHomeTitle',
      payload: e,
    });
  };
  const callback = (key) => {
    setCurrentKey(key);
    if (key == 1) {
      fetchTodo();
      setCurrent(1);
    } else {
      fetchAlready();
      setCurrent2(1);
    }
  };
  const onPagChange2 = (e: any) => {
    setCurrent2(e);
    console.log('2', e);
  };
  const onSizeChange2 = (current: any, size: any) => {
    setPagesize2(size);
  };
  const onPagChange = (e: any) => {
    setCurrent(e);
    console.log('e', e);
  };
  const onSizeChange = (current: any, size: any) => {
    setPagesize(size);
  };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   'selectedRows: ',
      //   selectedRows,
      // );
    },
    onSelect: (record, selected, selectedRows) => {
      // console.log(record, selected, selectedRows);
      setSelectArray(selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      // console.log(selected, selectedRows, changeRows);
      setSelectArray(selectedRows);
    },
  };
  const handleOk = () => {
    form
      .validateFields()
      .then((res) => {
        let data = {
          id: userId,
          password: res.password,
          password2: res.repeatPassword,
        };
        Apis.adminModifyPassword(data)
          .then((res: any) => {
            if (res && res.code === 0) {
              message.success('修改密码成功，请重新登录');
            } else {
              message.error(res.msg);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const handleCancel = async () => {
    setModalVisible(false);
    await form.resetFields();
  };
  const popSet = () => {
    setModalVisible(true);
  };
  const statusMap = {
    1: '乡镇审核中',
    3: '乡镇审核—不通过',
    9: '乡镇审核不通过',
    10: '材料审核中',
    11: '材料审核—不通过',
    20: '评审中',
    21: '评审—不通过',
    29: '评审—不通过',
    30: '联审中',
    31: '联审—不通过',
    39: '联审—不通过',
    40: '公示中',
    43: '公示不通过',
    45: '文件下达',
    46: '文件下达',
    50: '无变更',
    51: '变更未处理',
    52: '变更审核成功(已处理)',
    59: '变更审核失败(已处理)',
    60: '项目验收未验收',
    61: '项目验收待审核',
    62: '项目验收已验收',
    69: '项目验收不通过',
    70: '资金兑现-负责人待审核',
    71: '资金兑现-分管领导待审核',
    72: '资金兑现-主要领导待审核',
    73: '资金兑现-主要领导审核',
    74: '资金兑现-完成拨款',
    79: '资金兑现-驳回',
  };
  const markAction = (item) => {
    markActionRequest([item.id]);
  };
  const batchAction = () => {
    console.log(selectArray);
    let data = selectArray
      .map((ele) => {
        return ele.id;
      })
      .join(',');
    markActionRequest([data]);
  };
  const markActionRequest = (value: any) => {
    Apis.projectTodomarkSolve({
      ids: value,
    })
      .then((res: any) => {
        if (res && res.code === 0) {
          if (current == 1) {
            fetchTodo();
          } else {
            setCurrent(1);
          }
          setSelectArray([]);
          dispatch({
            type: 'baseModel/changeNotificationFlag',
          });
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const checkDetail = (record: any) => {
    console.log('record', record);
    
    if (record && record.project_info && record.project_info.status) {
      switch (record.project_info.status) {
        case 1:
          history.push({
            pathname: '/project/details',
            query: {
              id: record.project_id,
              stage: '1',
            },
          });
          break;
        case 3:
          history.push({
            pathname: '/project/details',
            query: {
              id: record.project_id,
              stage: '1',
            },
          });
          break;
        case 9:
          history.push({
            pathname: '/project/details',
            query: {
              id: record.project_id,
              stage: '1',
            },
          });
          break;
        case 10:
          history.push({
            pathname: '/project/details',
            query: {
              id: record.project_id,
              stage: '1',
            },
          });
          break;
        case 11:
          history.push({
            pathname: '/project/details',
            query: {
              id: record.project_id,
              stage: '1',
            },
          });
          break;
        case 20:
          history.push({
            pathname: '/project/details',
            query: {
              id: record.project_id,
              stage: '1',
            },
          });
          break;
        case 21:
          history.push({
            pathname: '/project/details',
            query: {
              id: record.project_id,
              stage: '1',
            },
          });
          break;
        case 29:
          history.push({
            pathname: '/project/details',
            query: {
              id: record.project_id,
              stage: '1',
            },
          });
          break;
        case 30:
          history.push({
            pathname: '/project/details',
            query: {
              id: record.project_id,
              stage: '1',
            },
          });
          break;
        case 31:
          history.push({
            pathname: '/project/details',
            query: {
              id: record.project_id,
              stage: '1',
            },
          });
          break;
        case 39:
          history.push({
            pathname: '/project/details',
            query: {
              id: record.project_id,
              stage: '1',
            },
          });
          break;
        case 40:
          history.push({
            pathname: '/project/details',
            query: {
              id: record.project_id,
              stage: '1',
            },
          });
          break;
        case 50:
          history.push({
            pathname: '/project/details',
            query: {
              id: record.project_id,
              stage: '2',
            },
          });
          break;
        case 51:
          history.push({
            pathname: '/project/details',
            query: {
              id: record.project_id,
              stage: '2',
            },
          });
          break;
        case 52:
          history.push({
            pathname: '/project/details',
            query: {
              id: record.project_id,
              stage: '2',
            },
          });
          break;
        case 59:
          history.push({
            pathname: '/project/details',
            query: {
              id: record.project_id,
              stage: '2',
            },
          });
          break;
        case 60:
          history.push({
            pathname: '/project/details',
            query: {
              id: record.project_id,
              stage: '4',
            },
          });
          break;
        case 61:
          history.push({
            pathname: '/project/details',
            query: {
              id: record.project_id,
              stage: '4',
            },
          });
          break;
        case 62:
          history.push({
            pathname: '/project/details',
            query: {
              id: record.project_id,
              stage: '4',
            },
          });
          break;
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 79:
          history.push({
            pathname: '/project/details',
            query: {
              id: record.project_id,
              stage: '4',
            },
          });
          break;
      }
    }
  };

  // 点击通知跳转详情页
  const clickItem = (item: any) => {
    // console.log('item', item);
    const { project_id, todo_type } = item;
    let pathname = '';
    const query: any = {};
    if (todo_type == 0) {
      // 竞争性项目
      pathname = '/project/details';
      query.stage = 1;
    } if (todo_type == 15) {
      // 竞争性项目-资金拨付
      pathname = '/project/details';
      query.stage = 5;
      query.applyId = item.project_amount_apply_id
    } else if (todo_type == 111) {
      // 有机肥/秸秆
      pathname = '/helpFarmer/organicFertilizerAudit/detail';
    } else if (todo_type == 121) {
      // 农机
      pathname = '/helpFarmer/strawAudit/detail';
      query.form_type = '21';
    } else if (todo_type == 122) {
      // 秸秆利用
      pathname = '/helpFarmer/strawAudit/detail';
      query.form_type = '22';
    } else if (todo_type == 123) {
      // 社会化
      pathname = '/helpFarmer/strawAudit/detail';
      query.form_type = '23';
    } else if (todo_type == 2) {
      // 湖羊
      pathname = '/helpFarmer/huLambsAudit/detail';
    } else if (todo_type == 3) {
      // 无害化
      pathname = '/helpFarmer/harmlessAudit/detail';
    } else if (todo_type == 4) {
      // 粮油
      pathname = '/helpFarmer/cropsAudit/detail';
    }
    history.push({
      pathname: pathname,
      query: {
        ...query,
        id: project_id,
      },
    });
  };

  // 根据todo_type project_current_position 判断项目状态
  const generateStatus = ({ todo_type, project_current_position }: any) => {
    if (todo_type == 0) {
      // 竞争性项目
      return COMPETITIVE_PROCESS[project_current_position] || ''
    }else if (todo_type == 15) {
      // 竞争性项目-资金兑现阶段
      return FUND_PROCESS[project_current_position] || ''
    } else if (todo_type == 111) {
      // 有机肥
      return INCLUSIVE_PROCESS[project_current_position] || ''
    } else if ([121, 122, 123].includes(todo_type)) {
      // 秸秆三种补贴
      return INCLUSIVE_PROCESS[project_current_position] || ''
    } else if (todo_type == 2) {
      // 湖羊
      return LAMBS_PROCESS[project_current_position] || ''
    } else if (todo_type == 3) {
      // 无害化
      return HARMLESS_PROCESS[project_current_position] || ''
    } else if (todo_type == 4) {
      // 粮油
      return CROPS_PROCESS[project_current_position] || ''
    }
    return ''
  }

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'title',
      align: 'center',
      render: (text: any, record: any) => (
        <Space size="middle">
          <div className={styles.darker}>
            {record.project_info && record.project_info.project_name}
          </div>
        </Space>
      ),
    },
    {
      title: '项目状态',
      dataIndex: 'created_at',
      align: 'center',
      render: (text: any, record: any) => (
        <Space size="middle">
          <div className={styles.darker}>
            {generateStatus(record)}
            {/* {record.todo_type == 0 &&
              record.project_info &&
              statusMap[record.project_info.status]}
            {record.todo_type == 1 &&
              record.project_info &&
              INCLUSIVE_MAP[record.project_info.status]?.title}
            {record.todo_type == 2 &&
              record.project_info &&
              LAMBS_MAP[record.project_info.status]?.title}
            {record.todo_type == 3 &&
              record.project_info &&
              HARMLESS_MAP[record.project_info.status]?.title}
            {record.todo_type == 4 &&
              record.project_info &&
              CROPS_MAP[record.project_info.status]?.title} */}
          </div>
        </Space>
      ),
    },
    {
      title: '申报主体',
      dataIndex: 'issue_at',
      align: 'center',
      render: (text: any, record: any) => (
        <Space size="middle">
          <div className={styles.darker}>
            {record.project_info && record.project_info.declare_unit}
          </div>
        </Space>
      ),
    },
    {
      title: '政策类型',
      dataIndex: 'issue_at',
      align: 'center',
      render: (text: any, record: any) => (
        <Space size="middle">
          <div className={styles.darker}>
            {record.project_info && record.project_info.policy_category_name}
          </div>
        </Space>
      ),
    },
    {
      title: '最后递交时间',
      dataIndex: 'project_update_at',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (text: any, record: any) => (
        <Space size="middle">
          <a className={styles.darker} onClick={() => clickItem(record)}>
            处理
          </a>
          <Popconfirm
            title="确定标记此条目?"
            onConfirm={() => markAction(record)}
          >
            <a className={styles.darker}>标记为已处理</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const columns2 = [
    {
      title: '项目名称',
      align: 'center',
      render: (text: any, record: any) => (
        <Space size="middle">
          <div className={styles.darker}>
            {record.project_info && record.project_info.project_name}
          </div>
        </Space>
      ),
    },
    {
      title: '项目状态',
      dataIndex: 'created_at',
      align: 'center',
      render: (text: any, record: any) => (
        <Space size="middle">
          <div className={styles.darker}>
            {generateStatus(record)}
            {/* {record.todo_type == 0 &&
              record.project_info &&
              statusMap[record.project_info.status]}
            {record.todo_type == 1 &&
              record.project_info &&
              INCLUSIVE_MAP[record.project_info.status]?.title}
            {record.todo_type == 2 &&
              record.project_info &&
              LAMBS_MAP[record.project_info.status]?.title}
            {record.todo_type == 3 &&
              record.project_info &&
              HARMLESS_MAP[record.project_info.status]?.title}
            {record.todo_type == 4 &&
              record.project_info &&
              CROPS_MAP[record.project_info.status]?.title} */}
          </div>
        </Space>
      ),
    },
    {
      title: '申报主体',
      dataIndex: 'issue_at',
      align: 'center',
      render: (text: any, record: any) => (
        <Space size="middle">
          <div className={styles.darker}>
            {record.project_info && record.project_info.declare_unit}
          </div>
        </Space>
      ),
    },
    {
      title: '政策类型',
      dataIndex: 'issue_at',
      align: 'center',
      render: (text: any, record: any) => (
        <Space size="middle">
          <div className={styles.darker}>
            {record.project_info && record.project_info.policy_category_name}
          </div>
        </Space>
      ),
    },
    {
      title: '最后提交时间',
      dataIndex: 'project_update_at',
      align: 'center',
    },
  ];
  const showTotal = (total: number) => {
    return `共 ${total} 条`;
  };
  const handle1Change = (value: any) => {
    setCategoryId1(value);
  };
  const handle2Change = (value: any) => {
    setCategoryId2(value);
  };
  const run1Search = () => {
    fetchTodo();
    setCurrent(1);
  };
  const run2Search = () => {
    fetchAlready();
    setCurrent2(1);
  };
  const run1Reset = () => {
    setCategoryId1(undefined);
    setCurrent(1);
    setReset1Flag(!reset1Flag);
  };
  const run2Reset = () => {
    setCategoryId2(undefined);
    setCurrent2(1);
    setReset2Flag(!reset2Flag);
  };
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };
  const onChange = () => {
    console.log;
  };
  const onOk = (e) => {
    console.log(e);
  };
  const options = [
    { label: '邮箱', value: 'Apple' },
    { label: '短信', value: 'Pear' },
  ];
  const onCheckBoxChange = (e) => {
    console.log(e);
  };

  return (
    <div className={styles.homePageCon}>
      <Modal
        destroyOnClose
        centered
        maskClosable={false}
        visible={modalVisible}
        confirmLoading={loading}
        title="提醒设置"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form {...layout} form={form} name="nest-messages" labelAlign={'left'}>
          <Form.Item name="password" label="待办提醒" hasFeedback>
            <Switch defaultChecked onChange={onChange} />
          </Form.Item>
          <Form.Item name="frequency" label="提醒频率" hasFeedback>
            <Radio.Group onChange={onChange} value={frequency}>
              <Radio value={1}>A</Radio>
              <Radio value={2}>B</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="repeatPassword"
            label="提醒时间"
            hasFeedback
            rules={[{ required: true, message: '请输入确认密码' }]}
          >
            <DatePicker showTime onChange={onChange} onOk={onOk} />
          </Form.Item>
          <Form.Item
            name="type"
            label="提醒方式"
            hasFeedback
            rules={[{ required: true, message: '请输入确认密码' }]}
          >
            <Checkbox.Group
              options={options}
              defaultValue={['Apple']}
              onChange={onCheckBoxChange}
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* <div className={styles.firstLine}>
        <Button type="primary" onClick={() => popSet()}>
          提醒设置
        </Button>
      </div> */}
      <Tabs defaultActiveKey="1" onChange={callback} activeKey={currentKey}>
        <TabPane tab={`待处理(${todoCount})`} key="1">
          <div>
            <div className={styles.topLine}>
              <div className={styles.topLeft}>
                <Select
                  style={{ width: 200 }}
                  onChange={handle1Change}
                  value={categoryId1}
                  placeholder="政策类型"
                >
                  {/* {categoryList.map((ele) => (
                    <Option value={ele.id} key={ele.id}>
                      {ele.category_name}
                    </Option>
                  ))} */}
                  {categoryList.map((item) =>
                    item.get_parent_do && item.get_parent_do.length ? (
                      <OptGroup label={item.category_name} key={item.id}>
                        {item.get_parent_do &&
                          item.get_parent_do.map((sub) => (
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
              </div>
              <div>
                <Button
                  type="primary"
                  className={`${styles.resetBtnColor} ${styles.resetBtnRadius} ${styles.btnMargin}`}
                  onClick={batchAction}
                  disabled={!selectArray.length}
                >
                  批量标记已处理
                </Button>
                <Button
                  type="primary"
                  className={`${styles.resetBtnColor} ${styles.resetBtnRadius} ${styles.btnMargin}`}
                  onClick={run1Reset}
                >
                  重置
                </Button>
                <Button
                  type="primary"
                  className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
                  onClick={run1Search}
                >
                  搜索
                </Button>
              </div>
            </div>
            <div className={styles.tableCon}>
              <Table
                key="3"
                rowSelection={{ ...rowSelection, checkStrictly }}
                columns={columns}
                rowKey={(item) => item.id}
                dataSource={listData}
                pagination={false}
                loading={loading}
                scroll={{ y: 530 }}
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
            </div>
          </div>
        </TabPane>
        <TabPane tab="已处理" key="2">
          <div>
            <div className={styles.topLine}>
              <div className={styles.topLeft}>
                <Select
                  style={{ width: 200 }}
                  onChange={handle2Change}
                  value={categoryId2}
                  placeholder="政策类型"
                >
                  {/* {categoryList.map((ele) => (
                    <Option value={ele.id} key={ele.id}>
                      {ele.category_name}
                    </Option>
                  ))} */}
                  {categoryList.map((item) =>
                    item.get_parent_do && item.get_parent_do.length ? (
                      <OptGroup label={item.category_name} key={item.id}>
                        {item.get_parent_do &&
                          item.get_parent_do.map((sub) => (
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
              </div>
              <div>
                <Button
                  type="primary"
                  className={`${styles.resetBtnColor} ${styles.resetBtnRadius} ${styles.btnMargin}`}
                  onClick={run2Reset}
                >
                  重置
                </Button>
                <Button
                  type="primary"
                  className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
                  onClick={run2Search}
                >
                  搜索
                </Button>
              </div>
            </div>

            <div className={styles.tableCon}>
              <Table
                key="4"
                columns={columns2}
                rowKey={(item) => item.id}
                dataSource={listData2}
                pagination={false}
                loading={loading}
                scroll={{ y: 530 }}
                bordered
              />
              <Pagination
                className={styles.pagination}
                total={total2}
                current={current2}
                pageSize={pagesize2}
                showTotal={showTotal}
                showSizeChanger={true}
                onChange={onPagChange2}
                onShowSizeChange={onSizeChange2}
              />
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(HomePage);
