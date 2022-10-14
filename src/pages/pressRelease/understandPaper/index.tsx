import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history, useActivate, useUnactivate } from 'umi';
import React, { useEffect, useRef, useState } from 'react';
import AuthWrapper from '@/components/auth/authWrapper';
import {
  message,
  Button,
  Input,
  Table,
  Pagination,
  Space,
  Switch,
  Popconfirm,
  Modal,
  Form,
  Tabs,
} from 'antd';
import ProTable, { ActionType } from '@ant-design/pro-table';
import {
  understandPaperList,
  understandPaperPushDelete,
  understandPaperPushExecute,
} from '@/api/understandPaper';
const { Search } = Input;
const { TabPane } = Tabs;

const UnderstandPaperPage = (props: any) => {
  const { dispatch } = props;
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [total, setTotal] = useState(0);
  const [keywords, setKeywords] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [tabActive, setTabActive] = useState('1');
  const tableRef = useRef<ActionType>();

  const initAction = () => {
    commitGlobalBread([
      {
        title: '发布中心',
      },
      {
        title: '明白纸发布',
      },
    ]);
  };
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };
  useActivate(() => {
    initAction();
    initRequest();
  });
  useUnactivate(() => {
    console.log('useUnactivate');
  });
  useEffect(() => {
    initAction();
    initRequest();
  }, []);
  const popPreview = (item: any) => {
    let data = {
      id: item.id,
    };
    Apis.fetchUnderstandPaperInfo(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          setHtmlContent(res.data.content);
          setShowPreview(true);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log(' err ', err);
      });
  };
  const deleteCurrent = (item: any) => {
    let data = {
      id: item.id,
    };
    Apis.fetchUnderstandPaperDel(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          message.success('删除成功');
          if (current == 1) {
            initRequest();
          } else {
            setCurrent(1);
          }
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log(' err ', err);
      });
  };
  const initRequest = () => {
    let data = {
      keywords: keywords,
      page: current,
      pagesize: pagesize,
    };
    Apis.fetchUnderstandPaperList(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          setListData(res.data.data);
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
    initRequest();
  }, [current, pagesize]);
  const showTotal = (total: number) => {
    return `共 ${total} 条`;
  };
  const onSwitchChange = (checked: any, item: any) => {
    // console.log('checked', checked);
    // console.log(item.id);
    let data = {
      id: item.id,
      is_putaway: checked ? 1 : 2,
    };
    Apis.understandPutaway(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          message.success('切换成功');
          initRequest();
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log(' err ', err);
      });
  };
  const runSearch = () => {
    setCurrent(1);
    initRequest();
  };
  const columns: any = [
    {
      title: '名称',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: '点击量',
      dataIndex: 'pv',
      align: 'center',
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
      render: (text: any, record: any) => (
        <Space size="middle">
          <a className={styles.darker} onClick={() => popPreview(record)}>
            预览 {record.name}
          </a>
          <AuthWrapper mark={'pressRelease-/pressRelease/understandPaper-edit'}>
            <a className={styles.darker} onClick={() => toEdit(record)}>
              编辑
            </a>
          </AuthWrapper>
          {/* <AuthWrapper mark={'pressRelease-/pressRelease/understandPaper-edit'}> */}
          <a className={styles.darker} onClick={() => toPush(record, '0', '1')}>
            推送
          </a>
          {/* </AuthWrapper> */}
          <AuthWrapper
            mark={'pressRelease-/pressRelease/understandPaper-remove'}
          >
            <Popconfirm
              title="确定删除此条目?"
              onConfirm={() => deleteCurrent(record)}
            >
              <a className={styles.red}>删除</a>
            </Popconfirm>
          </AuthWrapper>
          <AuthWrapper
            mark={'pressRelease-/pressRelease/understandPaper-online'}
          >
            <Switch
              checkedChildren="上线"
              unCheckedChildren="下线"
              defaultChecked={record.is_putaway == 1 ? true : false}
              onChange={(e) => onSwitchChange(e, record)}
            />
          </AuthWrapper>
        </Space>
      ),
    },
  ];

  const draftColumns: any = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      hideInSearch: true,
      width: 80,
      render: (__: any, record: any, index: number) => `${index + 1}`,
    },
    {
      title: '推送条件',
      dataIndex: 'rule_content',
      key: 'search_rule_content',
    },
    {
      title: '推送渠道',
      dataIndex: 'push_channel',
      valueEnum: { 1: '浙里办', 2: '短信' },
      hideInSearch: true,
      width: 100,
    },
    {
      title: '建立时间',
      dataIndex: 'created_at',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'is_push',
      key: 'search_is_push',
      valueType: 'select',
      valueEnum: { 0: '未推送', 1: '已推送' },
      width: 80,
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      fixed: 'right',
      hideInSearch: true,
      render: (text: any, record: any) => (
        <Space size="middle">
          {record.is_push == 0 ? (
            <>
              <Popconfirm
                title="确定推送此消息?"
                onConfirm={() => confirmPush(record)}
              >
                <a className={styles.darker}>推送</a>
              </Popconfirm>

              <a
                className={styles.darker}
                onClick={() => toPush(record, '1', '1')}
              >
                修改
              </a>
            </>
          ) : null}

          <a className={styles.darker} onClick={() => toPush(record, '1', '0')}>
            详情
          </a>

          {record.is_push == 0 ? (
            <Popconfirm
              title="确定删除此条目?"
              onConfirm={() => deleteDraft(record)}
            >
              <a className={styles.red}>删除</a>
            </Popconfirm>
          ) : null}
        </Space>
      ),
    },
  ];

  const onKeyWordsChange = (e: any) => {
    setKeywords(e.target.value);
  };
  const onPagChange = (e: any) => {
    setCurrent(e);
  };
  const onSizeChange = (current: any, size: any) => {
    setPagesize(size);
  };
  const toNew = () => {
    history.push('/pressRelease/understandPaperNew');
  };
  const toEdit = (item: any) => {
    history.push({
      pathname: '/pressRelease/understandPaperEdit',
      query: {
        id: item.id,
      },
    });
  };
  const toPush = (item: any, push: string, edit: string) => {
    history.push({
      pathname: '/pressRelease/understandPaperPush',
      query: {
        id: item.id,
        push,
        edit,
      },
    });
  };
  function createMarkup() {
    return { __html: htmlContent };
  }
  const handlePreviewOk = () => {
    setShowPreview(false);
  };
  const handlePreviewCancel = () => {
    setShowPreview(false);
  };

  // 草稿箱-推送
  const confirmPush = async (record: any) => {
    try {
      const result: any = await understandPaperPushExecute({ id: record.id });
      if (result?.code === 0) {
        message.success('推送成功');
        tableRef.current?.reload();
      } else {
        message.error(result.msg);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 草稿箱-删除
  const deleteDraft = async (record: any) => {
    // console.log('删除', record);
    try {
      const result: any = await understandPaperPushDelete({ id: record.id });
      if (result?.code === 0) {
        message.success('删除成功');
        tableRef.current?.reload();
      } else {
        message.error(result.msg);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onTabChange = (key: string) => {
    setTabActive(key);
    // initReques2t();
  };

  const loadData = async (rawParams: any) => {
    const {
      current: page,
      pageSize: pagesize,
      search_is_push,
      ...rest
    } = rawParams;
    const params = {
      ...rest,
      page,
      pagesize: 10,
      search_is_push: +search_is_push,
    };

    const result = await understandPaperList(params);
    setTotal(result?.data?.total);
    return {
      data: result?.data?.data,
      total: result?.data?.total,
    };
  };

  return (
    <div className={styles.homePageCon}>
      <Tabs
        defaultActiveKey={tabActive}
        onChange={onTabChange}
        className={styles.tabCon}
      >
        <TabPane tab="明白纸发布" key="1"></TabPane>
        <TabPane tab="推送草稿箱" key="2"></TabPane>
      </Tabs>
      {tabActive == '1' ? (
        <div>
          <div className={styles.topLine}>
            <div className={styles.topLeft}>
              <Form layout="inline">
                <Form.Item label="明白纸名称">
                  <Search
                    placeholder="请输入你要搜索的内容"
                    onSearch={runSearch}
                    className={styles.searchIcon}
                    onChange={(e) => onKeyWordsChange(e)}
                    value={keywords}
                    enterButton
                  ></Search>
                </Form.Item>
              </Form>
            </div>
            <div>
              <AuthWrapper
                mark={'pressRelease-/pressRelease/understandPaper-new'}
              >
                <Button
                  type="primary"
                  className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
                  onClick={() => toNew()}
                >
                  新建
                </Button>
              </AuthWrapper>
            </div>
          </div>
          <div className={styles.tableCon}>
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
      ) : null}

      {tabActive == '2' ? (
        <ProTable
          tableStyle={{ paddingTop: 20 }}
          columns={draftColumns}
          options={false}
          // revalidateOnFocus={false}
          actionRef={tableRef}
          request={loadData}
          rowKey="id"
        ></ProTable>
      ) : null}

      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showPreview}
        title="预览"
        width={1000}
        onOk={handlePreviewOk}
        onCancel={handlePreviewCancel}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
            onClick={handlePreviewOk}
          >
            确定
          </Button>,
        ]}
      >
        <div className={styles.htmlCon}>
          <div dangerouslySetInnerHTML={createMarkup()} />
        </div>
      </Modal>
    </div>
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(UnderstandPaperPage);
