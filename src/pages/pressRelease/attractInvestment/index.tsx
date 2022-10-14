import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
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
} from 'antd';
const { Search } = Input;
const AttractInvestmentPage = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [total, setTotal] = useState(0);
  const [keywords, setKeywords] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const initAction = () => {
    commitGlobalBread([
      {
        title: '发布中心',
      },
      {
        title: '招商推介发布',
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
      keywords: keywords,
      page: current,
      pagesize: pagesize,
    };
    Apis.fetchAttractInvestmentList(data)
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
    initAction();
    initRequest();
  }, []);
  useEffect(() => {
    initRequest();
  }, [current, pagesize]);
  const showTotal = (total: number) => {
    return `共 ${total} 条`;
  };
  const onSwitchChange = (checked: any, item: any) => {
    let data = {
      id: item.id,
      is_putaway: checked ? 1 : 2,
    };
    Apis.attractPutaway(data)
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
  const deleteCurrent = (item: any) => {
    let data = {
      id: item.id,
    };
    Apis.fetchAttractInvestmentDel(data)
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
  function createMarkup() {
    return { __html: htmlContent };
  }
  const popPreview = (item: any) => {
    let data = {
      id: item.id,
    };
    Apis.fetchAttractInvestmentInfo(data)
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
  const columns = [
    {
      title: '名称',
      dataIndex: 'title',
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
            预览
          </a>
          <AuthWrapper
            mark={'pressRelease-/pressRelease/attractInvestment-edit'}
          >
            <a className={styles.darker} onClick={() => toEdit(record)}>
              编辑
            </a>
          </AuthWrapper>
          <AuthWrapper
            mark={'pressRelease-/pressRelease/attractInvestment-remove'}
          >
            <Popconfirm
              title="确定删除此条目?"
              onConfirm={() => deleteCurrent(record)}
            >
              <a className={styles.red}>删除</a>
            </Popconfirm>
          </AuthWrapper>
          <AuthWrapper
            mark={'pressRelease-/pressRelease/attractInvestment-online'}
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
  // const commitGlobalTitle = (e: any) => {
  //   dispatch({
  //     type: 'baseModel/changeHomeTitle',
  //     payload: e,
  //   });
  // };
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
    history.push('/pressRelease/attractInvestmentNew');
  };
  const toEdit = (item: any) => {
    history.push({
      pathname: '/pressRelease/attractInvestmentEdit',
      query: {
        id: item.id,
      },
    });
  };
  const runSearch = () => {
    setCurrent(1);
    initRequest();
  };
  const handlePreviewOk = () => {
    setShowPreview(false);
  };
  const handlePreviewCancel = () => {
    setShowPreview(false);
  };

  return (
    <div className={styles.homePageCon}>
      <div className={styles.topLine}>
        <div className={styles.topLeft}>
          <Form layout="inline">
            <Form.Item label="招商推介名称">
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
            mark={'pressRelease-/pressRelease/attractInvestment-new'}
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
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(
  AttractInvestmentPage,
);
