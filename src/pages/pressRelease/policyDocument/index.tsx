import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
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
  Select,
} from 'antd';
const { Search } = Input;
const PolicyDocumentPage = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [total, setTotal] = useState(0);
  const [documentType, setDocumentType] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [form] = Form.useForm();
  const fieldNames = {
    label: 'category_name',
    value: 'id',
    options: 'get_parent_do',
  };

  const initAction = () => {
    commitGlobalBread([
      {
        title: '发布中心',
      },
      {
        title: '政策文件发布',
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
  const calc1Function = (array: any) => {
    let temp = array.map((ele: any) => {
      if (ele.alreadyAmount) {
        return ele.alreadyAmount;
      } else {
        return 0;
      }
    });
    let res = temp.reduce((acc: any, current: any) => {
      return Number(acc) + Number(current);
    }, 0);
    return res;
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
  const initRequest = (params?: any) => {
    let data = {
      keywords: params?.keywords || '',
      article_type: params?.article_type || null,
      page: current,
      pagesize: pagesize,
    };
    Apis.fetchPolicyDocumentList(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          let after = res.data.data;
          after.forEach((ele) => {
            if (
              ele.policy_document_rel_subitem_list &&
              ele.policy_document_rel_subitem_list.length
            ) {
              let hi = calcFunction(ele.policy_document_rel_subitem_list);
              ele.sumAmount = hi;
              ele.policy_document_rel_subitem_list.forEach((sub) => {
                sub.alreadyAmount = +sub.amount - +sub.remain_amount;
              });
              // let hei = calc1Function(ele.policy_document_rel_subitem_list);
              // ele.alreadySumAmount = hei;
            }
          });
          setListData(after);
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
    getDocumentType();
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
    Apis.policyPutaway(data)
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

  // 获取政策文件类型供筛选
  const getDocumentType = () => {
    Apis.fetchPolicyCategoryList().then((res: any) => {
      if (res.data[1] && res.data[1].get_parent_do) {
        res.data[1].get_parent_do.push({
          category_name: '竞争性财政支农项目',
          id: 14,
        });
        setDocumentType(res.data);
      } else {
        message.error(res.msg);
      }
    });
  };
  const popPreview = (item: any) => {
    let data = {
      id: item.id,
    };
    Apis.fetchPolicyDocumentInfo(data)
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
    Apis.fetchPolicyDocumentDel(data)
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

  const columns: any = [
    {
      title: '文件类型',
      dataIndex: 'category_name',
      align: 'center',
    },
    {
      title: '名称',
      dataIndex: 'title',
      align: 'center',
      width: 300,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      align: 'center',
    },
    {
      title: '文件发布时间',
      dataIndex: 'issue_at',
      align: 'center',
      render: (value: any) => {
        return value ? moment(value).format('YYYY-MM-DD') : '-';
      },
    },
    {
      title: '下达资金（万元）',
      dataIndex: 'villaat',
      align: 'center',
      render: (__: any, record: any) => (
        // <div>
        //   {record.sumAmount || record.sumAmount == 0
        //     ? moneyFormat(record.sumAmount)
        //     : '-'}
        // </div>
        <div>
          {record.all_order_amount || record.all_order_amount == 0
            ? moneyFormat(record.all_order_amount)
            : '-'}
        </div>
      ),
    },
    {
      title: '拨付资金（万元）',
      dataIndex: 'vit',
      align: 'center',
      render: (__: any, record: any) => (
        <div>
          {record.fund_amount || record.fund_amount == 0
            ? moneyFormat(record.fund_amount)
            : '-'}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      align: 'center',
      render: (text: any, record: any) => (
        <Space size="middle">
          <a className={styles.darker} onClick={() => popPreview(record)}>
            预览
          </a>
          <AuthWrapper mark={'pressRelease-/pressRelease/policyDocument-edit'}>
            <a className={styles.darker} onClick={() => toEdit(record)}>
              编辑
            </a>
          </AuthWrapper>
          <AuthWrapper
            mark={'pressRelease-/pressRelease/policyDocument-remove'}
          >
            <Popconfirm
              title="确定删除此条目?"
              onConfirm={() => deleteCurrent(record)}
            >
              <a className={styles.red}>删除</a>
            </Popconfirm>
          </AuthWrapper>
          <AuthWrapper
            mark={'pressRelease-/pressRelease/policyDocument-online'}
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

  const onPagChange = (e: any) => {
    setCurrent(e);
  };
  const onSizeChange = (current: any, size: any) => {
    setPagesize(size);
  };
  const toNew = () => {
    history.push('/pressRelease/policyDocumentNew');
  };
  const toEdit = (item: any) => {
    history.push({
      pathname: '/pressRelease/policyDocumentEdit',
      query: {
        id: item.id,
      },
    });
  };
  const handlePreviewOk = () => {
    setShowPreview(false);
  };
  const handlePreviewCancel = () => {
    setShowPreview(false);
  };
  const runSearch = (value?: any) => {
    setCurrent(1);
    initRequest(value);
  };
  function createMarkup() {
    return { __html: htmlContent };
  }
  return (
    <div className={styles.homePageCon}>
      <div className={styles.topLine}>
        <div className={styles.topLeft}>
          <Form
            form={form}
            name="search_form"
            onFinish={runSearch}
            layout="inline"
            // labelCol={{ span: 7 }}
          >
            <Form.Item label="文件名称" name="keywords">
              <Input placeholder="请输入"></Input>
            </Form.Item>
            <Form.Item label="文件类型" name="article_type">
              <Select
                placeholder="请选择"
                fieldNames={fieldNames}
                optionLabelProp="category_name"
                options={documentType}
                style={{ minWidth: 180 }}
              ></Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
                  htmlType="submit"
                >
                  搜索
                </Button>
                <Button
                  type="default"
                  className={`${styles.resetBtn}`}
                  htmlType="reset"
                  onClick={() => {
                    runSearch();
                  }}
                >
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
          {/* <Search
            placeholder="请输入你要搜索的内容"
            onSearch={runSearch}
            className={styles.searchIcon}
            onChange={(e) => onKeyWordsChange(e)}
            value={keywords}
            enterButton
          ></Search> */}
        </div>
        <div>
          <AuthWrapper mark={'pressRelease-/pressRelease/policyDocument-new'}>
            <Button
              type="primary"
              className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
              onClick={() => toNew()}
            >
              新 增
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
          scroll={{ x: 1300 }}
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

export default connect(({ baseModel }) => ({ baseModel }))(PolicyDocumentPage);
