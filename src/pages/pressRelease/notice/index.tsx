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
  Switch,
  Popconfirm,
  Modal,
  Form,
  Tabs,
} from 'antd';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import _ from 'lodash';
import { getImage } from '@/utils/common';

const { Search } = Input;
const { TabPane } = Tabs;
const UnderstandPaperPage = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [total, setTotal] = useState(0);
  const [keywords, setKeywords] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [tabActive, setTabActive] = useState('1');
  const [curren2t, setCurren2t] = useState(1);
  const [pagesiz2e, setPagesiz2e] = useState(10);
  const [tota2l, setTota2l] = useState(0);
  const [loadin2g, setLoadin2g] = useState(false);
  const [listDat2a, setListDat2a] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const initAction = () => {
    commitGlobalBread([
      {
        title: '发布中心',
      },
      {
        title: '公告栏',
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
    initAction();
  }, []);
  const popPreview = (item: any) => {
    let data = {
      id: item.id,
    };
    Apis.noticeBoardInfo(data)
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
    Apis.noticeBoardDel(data)
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
      title: keywords,
      page: current,
      pagesize: pagesize,
      tab_type: 1,
    };
    Apis.noticeBoardList(data)
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
  const initReques2t = () => {
    let data = {
      title: keywords,
      page: curren2t,
      tab_type: 2,
      pagesize: pagesiz2e,
    };
    Apis.noticeBoardList(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          setListDat2a(res.data.data);
          setTota2l(res.data.total);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  useEffect(() => {
    if (tabActive == '2') {
      console.log('initReques2t');
      initReques2t();
    }
  }, [curren2t, pagesiz2e]);
  const showTotal = (total: number) => {
    return `共 ${total} 条`;
  };
  const showTota2l = (total: number) => {
    return `共 ${total} 条`;
  };
  const onSwitchChange = (checked: any, item: any) => {
    let data = {
      id: item.id,
      status: checked ? 1 : 2,
    };
    Apis.noticeBoardEditStatus(data)
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
    if (tabActive == '1') {
      setCurrent(1);
      initRequest();
    } else {
      setCurren2t(1);
      initReques2t();
    }
  };

  const toDownload = (value: any) => {
    if (downloading) return;
    try {
      const zip = new JSZip();
      let promises: any = [];
      value.forEach((file: any) => {
        const promise = getImage(file.url).then((res: any) => {
          const fileName = file.name;
          zip.file(fileName, res, { binary: true });
        });
        promises.push(promise);
      });
      Promise.all(promises).then(() => {
        zip
          .generateAsync({
            type: 'blob',
            compression: 'DEFLATE', // STORE：默认不压缩 DEFLATE：需要压缩
            compressionOptions: {
              level: 1, // 压缩等级1~9    1压缩速度最快，9最优压缩方式
            },
          })
          .then((res: any) => {
            FileSaver.saveAs(res, '附件.zip'); // 利用file-saver保存文件
            setDownloading(false)
          });
      }).catch(() => {
        setDownloading(false)
      });
    } catch (error) {
      setDownloading(false);
    }
    return () => {};
  };

  const toPreview = (url: any) => {
    window.open(url, '_blank');
  };
  const column2s = [
    {
      title: '公告名称',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      align: 'center',
    },
    {
      title: '附件',
      dataIndex: 'attachment',
      align: 'center',
      width: 400,
      render: (value: any, record: any) =>
        value?.map((v: any) => (
          <div key={v.uid}>
            <a
              className={styles.attachmentName}
              onClick={() => toPreview(v.url)}
            >
              {v.name}
            </a>
          </div>
        )),
    },
    {
      title: '操作',
      dataIndex: 'attachment',
      align: 'center',
      width: 80,
      render: (value: any, record: any) => (
        <a
          className={styles.darker}
          onClick={async () => {
            await setDownloading(true);
            toDownload(value);
          }}
        >
          下载
        </a>
      ),
    },
  ];

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
      // width: 180,
      render: (text: any, record: any) => (
        <Space size="middle" wrap>
          <a className={styles.darker} onClick={() => popPreview(record)}>
            预览 {record.name}
          </a>
          <AuthWrapper mark={'pressRelease-/pressRelease/noticePaper-edit'}>
            <a className={styles.darker} onClick={() => toEdit(record)}>
              编辑
            </a>
          </AuthWrapper>
          <AuthWrapper mark={'pressRelease-/pressRelease/noticePaper-remove'}>
            <Popconfirm
              title="确定删除此条目?"
              onConfirm={() => deleteCurrent(record)}
            >
              <a className={styles.red}>删除</a>
            </Popconfirm>
          </AuthWrapper>
          <AuthWrapper mark={'pressRelease-/pressRelease/noticePaper-online'}>
            <Switch
              checkedChildren="上线"
              unCheckedChildren="下线"
              defaultChecked={record.status == 1 ? true : false}
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
  const on2PagChange = (e: any) => {
    setCurren2t(e);
  };
  const on2SizeChange = (current: any, size: any) => {
    setPagesiz2e(size);
  };
  const toNew = () => {
    if (tabActive == '1') {
      history.push('/pressRelease/noticePaperNew');
    } else {
      console.log;
    }
  };
  const toEdit = (item: any) => {
    history.push({
      pathname: '/pressRelease/noticePaperEdit',
      query: {
        id: item.id,
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
  const onTabChange = (key: string) => {
    setTabActive(key);
    initReques2t();
  };
  return (
    <div className={styles.homePageCon}>
      <Tabs
        defaultActiveKey={tabActive}
        onChange={onTabChange}
        className={styles.tabCon}
      >
        <TabPane tab="发布公告" key="1"></TabPane>
        <TabPane tab="公告附件专区" key="2"></TabPane>
      </Tabs>
      <div className={styles.topLine}>
        <div className={styles.topLeft}>
          <Form layout="inline">
            <Form.Item label="公告名称">
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
          {tabActive == '1' ? (
            <AuthWrapper mark={'pressRelease-/pressRelease/noticePaper-new'}>
              <Button
                type="primary"
                className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
                onClick={() => toNew()}
              >
                新建
              </Button>
            </AuthWrapper>
          ) : (
            ''
          )}
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
      {tabActive == '1' ? (
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
      ) : (
        <div className={styles.tableCon}>
          <Table
            columns={column2s}
            rowKey={(item) => item.id}
            dataSource={listDat2a}
            pagination={false}
            loading={loadin2g}
            // scroll={{ y: 530 }}
            bordered
          />
          <Pagination
            className={styles.pagination}
            total={tota2l}
            current={curren2t}
            pageSize={pagesiz2e}
            showTotal={showTota2l}
            showSizeChanger={true}
            onChange={on2PagChange}
            onShowSizeChange={on2SizeChange}
          />
        </div>
      )}
    </div>
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(UnderstandPaperPage);
