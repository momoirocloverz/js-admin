import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import AuthWrapper from '@/components/auth/authWrapper';
import {
  message,
  Button,
  Input,
  Table,
  Pagination,
  Space,
  Select,
  Form,
  Row,
  Col,
} from 'antd';
const { Option } = Select;
import moment from 'moment';
import CommonStyles from '@/pages/application/index.less';
import STATUS from '@/utils/status';
const StrawAuditPage = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [total, setTotal] = useState(0);
  const [keywords, setKeywords] = useState('');
  const [statusArray, setStatusArray] = useState([
    {
      value: '-1',
      label: '全部',
      key: '-1',
    },
    {
      value: '1',
      label: '待审核',
      key: '1',
    },
    {
      value: '2',
      key: '2',
      label: '已审核',
    },
  ]);

  const [typeArray, setTypeArray] = useState([
    // {
    //   value: '-1',
    //   label: '全部',
    //   key: '-1',
    // },
    {
      value: '21',
      label: '农机购置补助',
      key: '21',
    },
    {
      value: '22',
      label: '秸秆利用补助 ',
      key: '22',
    },
    {
      value: '23',
      key: '23',
      label: '社会化服务补助',
    },
  ]);
  const [selectValue, setSelectValue] = useState(undefined);
  const [typeValue, setTypeValue] = useState(undefined);
  const [projectName, setProjectName] = useState('');
  const [townValue, setTownValue] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  const [resetFlag, setResetFlag] = useState(false);
  const initAction = () => {
    commitGlobalBread([
      {
        title: '惠农补贴管理',
      },
      {
        title: '秸秆综合利用审核',
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
      search_username: projectName,
      page: current,
      pagesize: pagesize,
      which_form_type: '2',
    };
    if (selectValue) {
      data.search_status = selectValue;
    }
    if (typeValue) {
      data.search_form_type = typeValue;
    }
    Apis.fetchProjectSubList(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          let bridge = res.data.data.map((ele, index) => {
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
  useEffect(() => {
    initAction();
  }, []);
  useEffect(() => {
    initRequest();
  }, [current, pagesize]);
  const showTotal = (total: number) => {
    return `共 ${total} 条`;
  };
  const toDetail = (item: any) => {
    history.push({
      pathname: '/helpFarmer/strawAudit/detail',
      query: {
        id: item.id,
        form_type: item.form_type,
      },
    });
  };
  const projectTypeObj = {
    21: '农机购置补助',
    22: '秸秆利用补助 ',
    23: '社会化服务补助',
  };
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: '创建人',
      align: 'center',
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
      title: '创建时间',
      align: 'center',
      render: (text: any, record: any) => (
        <>
          <div>{moment(record.created_at).format('YYYY-MM-DD')}</div>
        </>
      ),
    },
    {
      title: '类型',
      dataIndex: 'status',
      align: 'center',
      render: (text: any, record: any) => (
        <>
          <div>{projectTypeObj[record.form_type]}</div>
        </>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (text: any, record: any) => (
        <>
          {record.is_draft == 0 && record.status == 0 && <div>驳回待修改</div>}
          {record.status > 0 && (
            <Space size="middle">
              <div
                className={CommonStyles[STATUS.statusColorMap[record.status]]}
              >
                <div className={CommonStyles.spot}></div>
                <div className={CommonStyles.statusText}>
                  {STATUS.statusLabel[record.status]}
                </div>
              </div>
            </Space>
          )}
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (text: any, record: any) => (
        <Space size="middle">
          <AuthWrapper mark={'helpFarmer-/helpFarmer/strawAudit-audit'}>
            <a className={styles.darker} onClick={() => toDetail(record)}>
              查看
            </a>
          </AuthWrapper>
        </Space>
      ),
    },
  ];
  const onPagChange = (e: any) => {
    setCurrent(e);
  };
  const onSizeChange = (current: any, size: any) => {
    setPagesize(size);
  };
  const runSearch = (value: any) => {
    setCurrent(1);
    initRequest();
  };
  const resetAction = () => {
    setSelectValue(undefined);
    setCurrent(1);
    setTypeValue(undefined);
    setKeywords('');
    setProjectName('');
    handleTownSelectChange([]);
    setResetFlag(!resetFlag);
  };
  useEffect(() => {
    initRequest();
  }, [resetFlag]);
  const handleSelectChange = (e: any) => {
    setSelectValue(e);
  };
  const handleTypeChange = (e: any) => {
    setTypeValue(e);
  };

  const onprojectNameChange = (e: any) => {
    setProjectName(e.target.value);
  };
  const handleTownSelectChange = (e: any) => {
    setTownValue(e);
  };
  const exportAction = () => {
    let data = {
      search_project_name: projectName,
      page: current,
      pagesize: pagesize,
      is_export: 1,
    };
    if (selectValue) {
      data.search_status = selectValue;
    }
    Apis.fetchProjectReserveExport(data)
      .then((res: any) => {
        const content = res;
        const blob = new Blob([content]);
        const fileName = '项目储备' + Date.now() + '.xls';
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
  const exportCurrent = () => {
    let data = {
      id: selectedId,
    };
    Apis.singleProjectReserveExport(data)
      .then((res: any) => {
        const content = res;
        const blob = new Blob([content]);
        const fileName = '项目储备' + Date.now() + '.xls';
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
  return (
    <div className={styles.homePageCon}>
      <div className={styles.topLine}>
        <div className={styles.topLeft}>
          <Form layout="inline">
            <Row gutter={10}>
              <Col span={8}>
                <Form.Item label="创建人">
                  <Input
                    placeholder="请输入创建人姓名"
                    allowClear
                    onChange={(e) => onprojectNameChange(e)}
                    value={projectName}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="类型">
                  <Select
                    onChange={(e) => handleTypeChange(e)}
                    value={typeValue}
                    allowClear
                    placeholder="请选择类型"
                  >
                    {typeArray.map((item) => (
                      <Option key={item.key} value={item.value}>
                        <div className={styles.optionsCon}>
                          <span>{item.label}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="审核状态">
                  <Select
                    onChange={(e) => handleSelectChange(e)}
                    value={selectValue}
                    allowClear
                    placeholder="请选择审核状态"
                  >
                    {statusArray.map((item) => (
                      <Option key={item.key} value={item.value}>
                        <div className={styles.optionsCon}>
                          <span>{item.label}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
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
        {/* <div className={styles.exportCon}>
          <Button
            type="primary"
            className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
            onClick={() => exportAction()}
          >
            导出
          </Button>
        </div> */}
        <Table
          columns={columns}
          rowKey={(item) => item.id}
          dataSource={listData}
          pagination={false}
          loading={loading}
          // scroll={{ y: 530 }}
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
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(StrawAuditPage);
