import React, { useEffect, useMemo, useState } from 'react';
import {
  Tabs,
  Form,
  Input,
  Button,
  Table,
  Pagination,
  message,
  Space,
  Modal,
  Select,
  Popconfirm,
} from 'antd';
const { confirm } = Modal;
const { Option } = Select;
import APIs from '@/utils/apis';
import styles from './third.less';
import { connect, history, useLocation } from 'umi';
const Details = (props: any) => {
  const { accountInfo, dispatch, children, shutDialog, popDialog } = props;
  const location = useLocation();
  const [dataArray, setDataArray] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showEdit3Modal, setShowEdit3Modal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [littleForm] = Form.useForm();
  const [dynamicTitle, setDynamicTitle] = useState('新建');
  const [categoryArray, setCategoryArray] = useState([]);
  const [currentItem, setCurrentIrem] = useState({});
  const [firstArray, setFirstArray] = useState([]);
  const popPreview = (item: any) => {
    setShowEdit3Modal(true);
    console.log(item);
    setCurrentIrem(item);
    littleForm.setFieldsValue({
      pid: item.pid,
      name: item.name,
    });
    setDynamicTitle('编辑');
  };
  const toDownload = (item: any) => {
    confirm({
      title: '提示',
      icon: '',
      centered: true,
      content: '确定删除此类型吗？',
      onOk() {
        console.log('OK');
        let data = {
          id: item.id,
        };
        APIs.investCategoryRemove(data)
          .then((res) => {
            if (res && res.code == 0) {
              message.success('删除成功');
              if (current == 1) {
                fetchDetail();
              } else {
                setCurrent(1);
              }
            } else {
              message.error(res.msg);
            }
          })
          .catch((err) => {
            console.log('err', err);
          });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const columns = [
    {
      title: '投资类型',
      dataIndex: 'name',
      align: 'center',
      render: (_: any, record: any, index: any) => {
        return <div>{record.firName}</div>;
      },
    },
    {
      title: '投资子类',
      dataIndex: 'item_code',
      align: 'center',
      render: (_: any, record: any) => {
        return <span>{record.secName || '-'}</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'address',
      align: 'center',
      render: (_: any, record: any) => {
        if (!record.children) {
          return (
            <Space size="middle">
              <a onClick={() => popPreview(record)}>编辑</a>
              <a onClick={() => toDownload(record)} className={styles.red}>
                删除
              </a>
            </Space>
          );
        } else {
          return '-';
        }
      },
    },
  ];
  const fetchDetail = () => {
    let data = {
      page: current,
      pagesize: pagesize,
    };
    setLoading(true);
    APIs.investCategoryList(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          if (res.data && res.data.data && res.data.data.length) {
            let shorter = res.data.data;
            shorter.forEach((ele) => {
              ele.firName = ele.name;
              ele.key = ele.id + '9abc';
              ele.children.forEach((sub) => {
                sub.secName = sub.name;
                sub.key = sub.id + '8abc';
                sub.firName = ele.name;
              });
            });
            setDataArray(res.data.data);
            setTotal(res.data.total);
          } else {
            setDataArray([]);
            setTotal(res.data.total);
          }
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
    fetchDetail();
    return () => {};
  }, []);
  useEffect(() => {
    fetchDetail();
  }, [current, pagesize]);
  const showTotal = (total: number) => {
    return `共 ${total} 条`;
  };
  const onPagChange = (e: any) => {
    setCurrent(e);
    console.log('e', e);
  };
  const onSizeChange = (current: any, size: any) => {
    setPagesize(size);
  };
  useEffect(() => {
    if (popDialog) {
      setShowEdit3Modal(true);
      setDynamicTitle('新建');
      littleForm.setFieldsValue({
        pid: undefined,
        name: undefined,
      });
    } else {
      setShowEdit3Modal(false);
    }
  }, [popDialog]);
  useEffect(() => {
    fetchCategoryList();
  }, []);
  const handleEdit3Ok = () => {
    littleForm
      .validateFields()
      .then((res) => {
        console.log('res', res);
        let data = {
          pid: res.pid,
          name: res.name,
        };
        if (dynamicTitle == '新建') {
          APIs.investCategoryAction(data)
            .then((res) => {
              if (res && res.code == 0) {
                message.success('操作成功');
                if (current == 1) {
                  fetchDetail();
                } else {
                  setCurrent(1);
                }
                setShowEdit3Modal(false);
                shutDialog();
              } else {
                message.error(res.msg);
              }
            })
            .catch((err) => {
              console.log('err', err);
            });
        } else {
          data.id = currentItem.id;
          APIs.investCategoryAction(data)
            .then((res) => {
              if (res && res.code == 0) {
                message.success('操作成功');
                if (current == 1) {
                  fetchDetail();
                } else {
                  setCurrent(1);
                }
                setShowEdit3Modal(false);
                shutDialog();
              } else {
                message.error(res.msg);
              }
            })
            .catch((err) => {
              console.log('err', err);
            });
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const handleEdit3Cancel = () => {
    setShowEdit3Modal(false);
    shutDialog();
  };
  const handleNewOk = () => {
    setShowEdit(false);
  };
  const handleNewCancel = () => {
    setShowEdit(false);
  };
  const changeCategoryName = (e) => {
    setCategoryName(e.target.value);
  };
  const addCategoryNameAction = () => {
    let value = categoryName.trim();
    if (value) {
      APIs.investCategoryAction({
        pid: 0,
        name: value,
      })
        .then((res: any) => {
          if (res && res.code === 0) {
            setCategoryName('');
            message.success('添加成功');
            fetchCategoryList();
            if (current == 1) {
              fetchDetail();
            } else {
              setCurrent(1);
            }
          } else {
            message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    } else {
      message.error('请输入类目名称');
    }
  };
  const fetchCategoryList = () => {
    APIs.investCategoryFirstLevelList({
      page: 1,
      pagesize: 999999999,
    })
      .then((res: any) => {
        if (res && res.code === 0) {
          res.data.data.forEach((ele) => {
            ele.value = ele.id;
            ele.label = ele.name;
          });
          setFirstArray(res.data.data);
          setCategoryArray(res.data.data);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const deleteCategory = (ele: any) => {
    APIs.investCategoryRemove({
      id: ele.id,
    })
      .then((res: any) => {
        if (res && res.code === 0) {
          message.success('删除成功');
          fetchCategoryList();
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const popModal = () => {
    setCategoryName('');
    setShowEdit(true);
  };
  return (
    <div className={styles.pageThird3}>
      <Table
        key="3"
        columns={columns}
        rowKey={(item) => item.id}
        dataSource={dataArray}
        pagination={false}
        loading={loading}
        scroll={{ y: 630 }}
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
      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showEdit3Modal}
        title={dynamicTitle}
        width={500}
        onOk={handleEdit3Ok}
        onCancel={handleEdit3Cancel}
      >
        <div className={styles.rightCon}>
          <Form
            form={littleForm}
            name="nest-messages"
            labelAlign={'left'}
            layout="vertical"
          >
            <div className={styles.speicalItem}>
              <Form.Item
                name="pid"
                label="投资类型"
                rules={[{ required: true, message: '投资类型不能为空' }]}
              >
                <Select style={{ width: 320 }} placeholder={'请选择投资类型'}>
                  {firstArray.map((ele) => (
                    <Option value={ele.value} key={ele.value}>
                      {ele.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Button
                type="primary"
                className={styles.flyIngBtn}
                onClick={() => popModal()}
              >
                分类管理
              </Button>
            </div>
            <Form.Item
              label="投资子类"
              name="name"
              rules={[{ required: true, message: '投资子类不能为空' }]}
            >
              <Input placeholder="请输入投资子类" maxLength={50} />
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showEdit}
        title="类目管理"
        onOk={handleNewOk}
        onCancel={handleNewCancel}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
            onClick={handleNewOk}
          >
            确定
          </Button>,
        ]}
      >
        <div>
          <div className={styles.categoryNameInputCon}>
            <Input
              placeholder="请输入"
              className={styles.leftInput}
              allowClear
              value={categoryName}
              onChange={(e) => changeCategoryName(e)}
            />
            <Button
              type="primary"
              className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
              onClick={() => addCategoryNameAction()}
            >
              添加
            </Button>
          </div>
          <div className={styles.categoryItemCon}>
            {categoryArray.map((ele: any) => (
              <div key={ele.id} className={styles.categoryItem}>
                <div>{ele.name}</div>
                <Popconfirm
                  title="确定删除此条目?"
                  onConfirm={() => deleteCategory(ele)}
                >
                  {ele.can_delete == 1 ? (
                    <div className={styles.red}>删除</div>
                  ) : null}
                </Popconfirm>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(Details);
