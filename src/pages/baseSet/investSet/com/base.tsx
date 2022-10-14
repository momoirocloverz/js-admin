import React, { useEffect, useMemo, useState } from 'react';
import {
  Tabs,
  Form,
  Input,
  Button,
  Table,
  Pagination,
  Space,
  Modal,
  Select,
  message,
  Cascader,
} from 'antd';
const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;
import APIs from '@/utils/apis';
import styles from './base.less';
import { connect, history, useLocation } from 'umi';
const Details = (props: any) => {
  const { accountInfo, dispatch, children, popDialog, shutDialog } = props;
  const location = useLocation();
  const [dataArray, setDataArray] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [total, setTotal] = useState(0);
  const [littleForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showEdit3Modal, setShowEdit3Modal] = useState(false);
  const [dynamicTitle, setDynamicTitle] = useState('新建');
  const [firstArray, setFirstArray] = useState([]);
  const [secondArray, setSecondArray] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  useEffect(() => {
    if (popDialog) {
      setShowEdit3Modal(true);
      setDynamicTitle('新建');
      littleForm.setFieldsValue({
        first: undefined,
        invest_category_ids: undefined,
        name: undefined,
      });
    } else {
      setShowEdit3Modal(false);
    }
  }, [popDialog]);
  const toDownload = (item: any) => {
    confirm({
      title: '提示',
      icon: '',
      centered: true,
      content: '确定删除此标签吗？',
      onOk() {
        console.log('OK');
        let data = {
          id: item.id,
        };
        APIs.investTagRemove(data)
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
  const popPreview = (item: any) => {
    setDynamicTitle('编辑');
    fetchSecond(item.firId);
    setCurrentItem(item);
    littleForm.setFieldsValue({
      first: item.firId,
      invest_category_ids: [item.invest_category_id],
      name: item.name,
    });
    setShowEdit3Modal(true);
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
      title: '子类',
      dataIndex: 'APPROVALITEMID',
      align: 'center',
      render: (_: any, record: any) => {
        return <span>{record.secName || '-'}</span>;
      },
    },
    {
      title: '标签名称',
      dataIndex: 'APPLYTITLE',
      align: 'center',
      render: (_: any, record: any) => {
        return <span>{record.thirdName || '-'}</span>;
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
  // useEffect(() => {
  //   console.log('asidai', dataArray);
  // }, [dataArray]);
  const fetchDetail = () => {
    let data = {
      page: current,
      pagesize: pagesize,
    };
    setLoading(true);
    APIs.investTagList(data)
      .then((res) => {
        if (res && res.code == 0) {
          let shorter = res.data.data;
          shorter.forEach((ele, index) => {
            ele.key = ele.id + '9abc';
            ele.firName = ele.name;
            ele.children.forEach((sub, subIndex) => {
              sub.key = sub.id + '8abc';
              sub.secName = sub.name;
              sub.firName = ele.name;
              sub.tag_list.forEach((third, thirdIndex) => {
                third.key = third.id + '7abc';
                third.thirdName = third.name;
                third.firName = ele.name;
                third.firId = ele.id;
                third.secName = sub.name;
              });
              sub.children = sub.tag_list;
            });
          });
          setDataArray(shorter);
          setTotal(res.data.total);
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
  }, [current, pagesize]);
  useEffect(() => {
    fetchFirst();
  }, []);
  const fetchFirst = () => {
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
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const showTotal = (total: number) => {
    return `共 ${total} 条`;
  };
  const onPagChange = (e: any) => {
    setCurrent(e);
  };
  const onSizeChange = (current: any, size: any) => {
    setPagesize(size);
  };
  const handleEdit3Ok = () => {
    littleForm
      .validateFields()
      .then((res) => {
        let data = {
          invest_category_ids: res.invest_category_ids,
          name: res.name,
        };
        if (dynamicTitle == '新建') {
          APIs.investTagAdd(data)
            .then((res: any) => {
              if (res && res.code === 0) {
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
          delete data.invest_category_ids;
          data.invest_category_id = res.invest_category_ids[0];
          APIs.investTagModify(data)
            .then((res: any) => {
              if (res && res.code === 0) {
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
  const fetchSecond = (value: any) => {
    APIs.investCategorySecondLevelList({
      first_level_id: value,
    })
      .then((res: any) => {
        if (res && res.code === 0) {
          res.data.list.forEach((ele) => {
            ele.value = ele.id;
            ele.label = ele.name;
          });
          setSecondArray(res.data.list);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const onChange = (value: string[]) => {
    console.log(value);
    fetchSecond(value);
    littleForm.setFieldsValue({
      invest_category_ids: undefined,
    });
  };
  return (
    <div className={styles.page}>
      <Table
        key="3"
        columns={columns}
        rowKey={(item) => item.key}
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
            <Form.Item
              name="first"
              label="投资类型"
              rules={[{ required: true, message: '请选择投资类型' }]}
            >
              <Select
                style={{ width: '100%' }}
                onChange={onChange}
                placeholder={'请选择投资类型'}
              >
                {firstArray.map((ele) => (
                  <Option value={ele.value} key={ele.value}>
                    {ele.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="invest_category_ids"
              label="投资子类"
              rules={[{ required: true, message: '请选择投资子类' }]}
            >
              <Select
                style={{ width: '100%' }}
                mode={dynamicTitle == '新建' ? 'multiple' : ''}
                placeholder={'请选择投资子类'}
              >
                {secondArray.map((ele) => (
                  <Option value={ele.value} key={ele.value}>
                    {ele.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="标签名称"
              name="name"
              rules={[{ required: true, message: '请填写标签名称' }]}
            >
              <TextArea
                rows={4}
                placeholder="请输入"
                maxLength={50}
                placeholder={'请填写标签名称'}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};
export default connect(({ baseModel }) => ({ baseModel }))(Details);
