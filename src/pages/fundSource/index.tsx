import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import AuthWrapper from '@/components/auth/authWrapper';
import {
  message,
  Button,
  Input,
  InputNumber,
  Table,
  Pagination,
  Space,
  Modal,
  Select,
  DatePicker,
  Form,
  Row,
  Col,
  Switch,
} from 'antd';
const { Option } = Select;
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import central_icon from '@/assets/central_icon.png';
import province_icon from '@/assets/province_icon.png';
import city_icon from '@/assets/city_icon.png';
import county_icon from '@/assets/county_icon.png';
const { RangePicker } = DatePicker;
const FundSource = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [total, setTotal] = useState(0);
  const [masterAmount, setMasterAmount] = useState(0);
  const [exportAble, setExportAble] = useState(true);
  const [selectedArray, setSelectedArray] = useState([]);
  const [search_all_amount1, setSearch_all_amount1] = useState('');
  const [search_all_amount2, setSearch_all_amount2] = useState('');
  const [resetFlag, setResetFlag] = useState(false);
  const [yearList, setYearList] = useState([]);
  const [form] = Form.useForm();
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
  const [expandSwitchChecked, setExpandSwitchChecked] = useState<any>(false);
  const initAction = () => {
    commitGlobalBread([
      {
        title: '资金管理',
      },
      {
        title: '资金文件',
      },
    ]);
  };
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };
  const calcFunction = (array: any) => {
    let temp = array.map((ele: any) => {
      if (ele.amount) {
        return ele.amount;
      } else {
        return 0;
      }
    });
    let res = temp.reduce((acc: any, current: any) => {
      return Number(acc) + Number(current);
    }, 0);
    return res;
  };
  const initRequest = () => {
    const values = form.getFieldsValue();
    let data = {
      page: current,
      pagesize: pagesize,
      search_project_name: values.search_project_name,
      search_year: values.search_year,
      search_fund_number: values.search_fund_number,
      search_xd_ats: [],
      search_all_amount: [],
    };
    if (values.search_xd_ats && values.search_xd_ats.length) {
      data.search_xd_ats = [
        moment(values.search_xd_ats[0]).format('YYYY-MM-DD'),
        moment(values.search_xd_ats[1]).format('YYYY-MM-DD'),
      ];
    }
    if (
      search_all_amount1 !== (null || '') &&
      search_all_amount2 !== (null || '')
    ) {
      if (
        (search_all_amount1 && search_all_amount2) ||
        search_all_amount1 == 0 ||
        search_all_amount2 == 0
      ) {
        data.search_all_amount = [+search_all_amount1, +search_all_amount2];
      }
    }
    setLoading(true);
    Apis.projectFundSourceList(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          let after = res.data.data;
          after.forEach((ele) => {
            if (ele.subitem_list && ele.subitem_list.length) {
              ele.subitem_list.forEach((sub) => {
                // sub.project_fund_rel_subitem_list.forEach(third => {
                // } )
                // sub.alreadyAmount = +sub.amount - +sub.remain_amount;
                let h3i = calcFunction(sub.policy_document_rel_subitem_list);
                sub.alreadyAmount = h3i;
                let hi = calcFunction(sub.project_fund_rel_subitem_list);
                sub.sumAmount = hi;
                // console.log(sub);
              });
            }
          });
          setListData(after);
          setExpandedRowKeys(res.data.data.map((v: any) => v.id));
          setTotal(res.data.total);
          setMasterAmount(res.data.all_sum_amount);
          setExpandSwitchChecked(true);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    initAction();
    setArray();
    setInitValue();
  }, []);
  useEffect(() => {
    initRequest();
  }, [current, pagesize, resetFlag]);
  const showTotal = (total: number) => {
    return `共 ${total} 条`;
  };
  const toDetail = (item: any) => {
    return history.push({
      pathname: '/fund/source/detail',
      query: { id: item.id },
    });
  };
  const toEdit = (item: any) => {
    return history.push({
      pathname: '/fund/source/edit',
      query: { id: item.id },
    });
  };
  const projectTypeIcon: any = {
    1: central_icon,
    2: province_icon,
    3: city_icon,
    4: county_icon,
  };
  const columns: any = [
    {
      title: '文件名称',
      dataIndex: 'project_name',
      align: 'center',
    },
    {
      title: '资金文号',
      dataIndex: 'fund_number',
      align: 'center',
      render: (text: any, record: any) => (
        <>
          <Space className={styles.rowFlex}>
            <div>{record.fund_number}</div>
            <img src={projectTypeIcon[record.project_type]} alt="icon" />
          </Space>
        </>
      ),
    },
    {
      title: '资金分项总额（万元）',
      dataIndex: 'all_amount',
      align: 'center',
    },
    {
      title: '年度',
      dataIndex: 'year',
      align: 'center',
    },
    {
      title: '下达时间',
      dataIndex: 'xd_at',
      align: 'center',
      render: (text: any, record: any) => (
        <>
          <div>{record.xd_at || '-'}</div>
        </>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 160,
      render: (text: any, record: any) => (
        <>
          <Space>
            <AuthWrapper mark={'fund-/fund/source-view'}>
              <div
                className={`${styles.darker}`}
                onClick={(e: any) => {
                  e.stopPropagation();
                  toDetail(record);
                }}
              >
                查看
              </div>
            </AuthWrapper>
            <AuthWrapper mark={'fund-/fund/source-edit'}>
              <div
                className={`${styles.darker}`}
                onClick={(e: any) => {
                  e.stopPropagation();
                  toEdit(record);
                }}
              >
                编辑
              </div>
            </AuthWrapper>
            <AuthWrapper mark={'fund-/fund/source-remove'}>
              <div
                className={`${styles.red}`}
                onClick={(e: any) => {
                  e.stopPropagation();
                  deleteItem(record);
                }}
              >
                删除
              </div>
            </AuthWrapper>
          </Space>
        </>
      ),
    },
  ];
  const onPagChange = (e: any) => {
    setCurrent(e);
  };
  const onSizeChange = (current: any, size: any) => {
    setPagesize(size);
  };

  const runSearch = (value?: any) => {
    setCurrent(1);
    initRequest();
  };
  const resetAction = () => {
    form.resetFields();
    setCurrent(1);
    setSearch_all_amount1('');
    setSearch_all_amount2('');
    setResetFlag(!resetFlag);
  };
  const toNew = () => {
    history.push({
      pathname: '/fund/source/new',
    });
  };

  // 删除
  const deleteItem = (record: any) => {
    const { id } = record;
    Modal.confirm({
      content: '删除后不可恢复，确认删除？',
      centered: true,
      onOk: async () => {
        const result: any = await Apis.projectFundSourceRemove({ id });
        if (result.code == 0) {
          message.success('删除成功');
          runSearch();
        } else {
          message.warning(result.msg);
        }
      },
      onCancel: async () => {},
    });
  };
  const setInitValue = () => {
    form.setFieldsValue({
      search_year: undefined,
    });
  };
  const setArray = () => {
    const fullYear = new Date().getFullYear();
    const arrYear = [];
    for (let i = 0; i < 10; i++) {
      arrYear.push({
        name: `${fullYear - i}年`,
        value: fullYear - i,
        label: `${fullYear - i}年`,
      });
    }
    setYearList(arrYear);
  };
  const onAmount1Change = (val: any) => {
    setSearch_all_amount1(val);
  };
  const onAmount2Change = (val: any) => {
    setSearch_all_amount2(val);
  };
  const moneyFormat = (value: any) => {
    if (value || value == 0) {
      if (value) {
        let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
        return fix;
      } else {
        return 0;
      }
    }
  };
  // 展开子表格
  const expandedRowRender = (record: any) => {
    const subColumns: any = [
      {
        title: '序号',
        width: '100px',
        render: (text: any, record: any, index: number) => `${index + 1}`,
      },
      {
        title: '分项名称',
        dataIndex: 'subitem_info',
        width: '280px',
        render: (value: any) => value.subitem_name,
      },
      { title: '分项金额（万元）', dataIndex: 'amount' },
      {
        title: '剩余可分配金额（万元）',
        dataIndex: 'remain_amount',
      },
      // {
      //   title: '已下达资金（万元）',
      //   dataIndex: 'alreadyAmount',
      //   align: 'center',
      //   render: (value: any) =>
      //     value || value == 0 ? moneyFormat(value) : '-',
      // },
      {
        title: '已拨付资金（万元）',
        dataIndex: 'sumAmount',
        align: 'center',
        render: (value: any) =>
          value || value == 0 ? moneyFormat(value) : '-',
      },
      {
        title: '剩余可分配总金额（万元）',
        dataIndex: 'subitem_all_remain_amount',
        onCell: (__: any, index: number) => {
          return {
            children: index > 0 ? '' : record.subitem_all_remain_amount,
            props: { rowSpan: index > 0 ? 0 : record.subitem_list.length },
          };
        },
      },
    ];
    const data = record.subitem_list;
    return (
      <Table
        size="small"
        columns={subColumns}
        dataSource={data}
        pagination={false}
        rowKey="id"
      />
    );
  };

  // 展开状态改变
  const onExpandedRowsChange = (expandedRows: any) => {
    setExpandedRowKeys(expandedRows);
    if (expandedRows.length != listData.length) {
      setExpandSwitchChecked(false);
    } else {
      setExpandSwitchChecked(true);
    }
  };

  // 全部展开、收起
  const onExpandSwitchChange = (expand: any) => {
    setExpandSwitchChecked(expand);
    setExpandedRowKeys(expand ? listData.map((v: any) => v.id) : []);
  };

  return (
    <div className={styles.homePageCon}>
      <div className={styles.topLine}>
        <div className={styles.topLeft}>
          <Form form={form}>
            <Row gutter={20}>
              <Col span={8}>
                <Form.Item label="文件名称" name="search_project_name">
                  <Input placeholder="请输入文件名称" allowClear />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="年度" name="search_year">
                  <Select
                    className={styles.marginRight}
                    placeholder="请选择"
                    allowClear
                  >
                    {yearList.map((ele) => (
                      <Option value={ele.value} key={ele.value}>
                        {ele.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="下达时间"
                  name="search_xd_ats"
                  wrapperCol={{}}
                >
                  <RangePicker
                    className={styles.rangeTen}
                    placeholder={['下达起始时间', '下达结束时间']}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={8}>
                <Form.Item label="资金文号" name="search_fund_number">
                  <Input placeholder="请输入资金文号" allowClear />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="资金分项总额" name="search_all_amount">
                  <div className={styles.rangeCon}>
                    <InputNumber
                      style={{ width: '48%' }}
                      min={0}
                      max={999999999}
                      placeholder="请输入资金总额"
                      value={search_all_amount1}
                      onChange={(e) => onAmount1Change(e)}
                    />
                    <span>-</span>
                    <InputNumber
                      style={{ width: '48%' }}
                      placeholder="请输入资金总额"
                      min={0}
                      max={999999999}
                      value={search_all_amount2}
                      onChange={(e) => onAmount2Change(e)}
                    />
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div className={styles.searchBtns}>
          <Button
            className={`${styles.resetBtnBlockColor} ${styles.resetBtnRadius} ${styles.resetBtnMargin}`}
            onClick={() => resetAction()}
            htmlType="reset"
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
        <div className={styles.exportCon}>
          {/* disabled={exportAble} */}
          <div className={styles.sumText}> 资金总额：{masterAmount}万元 </div>
          {/* className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`} */}
          <AuthWrapper mark={'fund-/fund/source-new'}>
            <Button
              type="primary"
              onClick={() => toNew()}
              icon={<PlusOutlined />}
            >
              新建资金文件
            </Button>
          </AuthWrapper>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.expandSwitch}>
            <Switch
              checkedChildren="展开"
              unCheckedChildren="收起"
              defaultChecked
              checked={expandSwitchChecked}
              onChange={onExpandSwitchChange}
            />
          </div>
          <Table
            className="expandTable"
            key={listData && listData.length ? 'parentTable' : 'emptyTable'}
            columns={columns}
            rowKey={(item) => item.id}
            dataSource={listData}
            onRow={(record) => {
              return {
                className: expandedRowKeys.includes(record.id)
                  ? 'expanded'
                  : '',
              };
            }}
            pagination={false}
            loading={loading}
            scroll={{ y: 530 }}
            expandable={{
              expandedRowRender,
              expandedRowClassName: () => 'expandRow',
              expandRowByClick: true,
              expandedRowKeys,
              onExpandedRowsChange: onExpandedRowsChange,
              columnWidth: '80px',
            }}
            bordered
          />
        </div>
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
  );
};

export default connect()(FundSource);
