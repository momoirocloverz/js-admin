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
} from 'antd';
const { Option } = Select;
import moment from 'moment';
import CommonStyles from '@/pages/application/index.less';
import { HARMLESS_MAP } from '@/pages/application/const';
const HarmlessAuditPage = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [total, setTotal] = useState(0);
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
  const [selectValue, setSelectValue] = useState(undefined);
  const [projectName, setProjectName] = useState('');
  const [resetFlag, setResetFlag] = useState(false);
  const initAction = () => {
    commitGlobalBread([
      {
        title: '惠农补贴管理',
      },
      {
        title: '病死动物无害化处理审核',
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
      which_form_type: '4',
    };

    if (selectValue) {
      data.search_status = selectValue;
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
      pathname: '/helpFarmer/harmlessAudit/detail',
      query: {
        id: item.id,
      },
    });
  };
  const columns: any = [
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
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (text: any, record: any) => (
        <>
          {record.is_draft == 0 && record.status == 0 && <div>驳回待修改</div>}
          {record.status > 0 && (
            <Space size="middle">
              <div className={CommonStyles[HARMLESS_MAP[record.status].color]}>
                <div className={CommonStyles.spot}></div>
                <div className={CommonStyles.statusText}>
                  {HARMLESS_MAP[record.status].title}
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
          <AuthWrapper mark={'helpFarmer-/helpFarmer/harmlessAudit-audit'}>
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
    setProjectName('');
    setResetFlag(!resetFlag);
  };

  useEffect(() => {
    initRequest();
  }, [resetFlag]);

  const handleSelectChange = (e) => {
    setSelectValue(e);
  };

  const onprojectNameChange = (e) => {
    setProjectName(e.target.value);
  };
  return (
    <div className={styles.homePageCon}>
      <div className={styles.topLine}>
        <div className={styles.topLeft}>
          <Form layout="inline">
            <Form.Item label="创建人">
              <Input
                placeholder="请输入创建人姓名"
                allowClear
                onChange={(e) => onprojectNameChange(e)}
                value={projectName}
              />
            </Form.Item>
            <Form.Item label="创建人">
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
        <div className={styles.exportCon}>
          <Button
            type="primary"
            className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
            onClick={() => exportAction()}
          >
            导出
          </Button>
        </div>
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

export default connect(({ baseModel }) => ({ baseModel }))(HarmlessAuditPage);
