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
  message,
  Select,
} from 'antd';
import { Editor } from '@tinymce/tinymce-react';
const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;
import APIs from '@/utils/apis';
import styles from './second.less';
import Editor1 from './editor1';
import Editor2 from './editor2';
import editorConfig from '@/utils/tinymce_config';
import tinymce from 'tinymce';
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
  const [littleForm] = Form.useForm();
  const [dynamicTitle, setDynamicTitle] = useState('新建');
  const [firstArray, setFirstArray] = useState([]);
  const [secondArray, setSecondArray] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  useEffect(() => {
    if (popDialog) {
      setShowEdit3Modal(true);
      setDynamicTitle('新建');
      littleForm.setFieldsValue({
        first: undefined,
        invest_category_ids: undefined,
        bslc_title: undefined,
        bslc_content: undefined,
        zysx_title: undefined,
        zysx_content: undefined,
      });
    } else {
      setShowEdit3Modal(false);
    }
  }, [popDialog]);
  const popPreview = (item: any) => {
    setShowEdit3Modal(true);
    setDynamicTitle('编辑');
    fetchSecond(item.pid);
    setValue1(item.bsys_info.bslc_content);
    setValue2(item.bsys_info.zysx_content);
    setCurrentItem(item);
    littleForm.setFieldsValue({
      first: item.pid,
      invest_category_ids: [item.bsys_info.invest_category_id],
      bslc_title: item.bsys_info.bslc_title,
      bslc_content: item.bsys_info.bslc_content,
      zysx_title: item.bsys_info.zysx_title,
      zysx_content: item.bsys_info.zysx_content,
    });
    setShowEdit3Modal(true);
  };
  const toDownload = (item: any) => {
    confirm({
      title: '提示',
      icon: '',
      centered: true,
      content: '确定删除此条目吗？',
      onOk() {
        let data = {
          id: item.bsys_info.id,
        };
        APIs.investBsydRemove(data)
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
  const analyse1Content = (e) => {
    littleForm.setFieldsValue({
      bslc_content: e,
    });
  };
  const analyseContent = (e) => {
    littleForm.setFieldsValue({
      zysx_content: e,
    });
  };
  const columns = [
    {
      title: '类型',
      dataIndex: 'name',
      align: 'center',
      render: (_: any, record: any, index: any) => {
        return <div>{record.firName}</div>;
      },
    },
    {
      title: '类别',
      dataIndex: 'APPROVALITEMID',
      align: 'center',
      render: (_: any, record: any) => {
        return <span>{record.secName || '-'}</span>;
      },
    },
    {
      title: '办事流程',
      dataIndex: 'APPLYTITLE',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <span>
            {(record.bsys_info && record.bsys_info.bslc_title) || '-'}
          </span>
        );
      },
    },
    {
      title: '注意事项',
      dataIndex: 'FILENAME',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <span>
            {(record.bsys_info && record.bsys_info.zysx_title) || '-'}
          </span>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'address',
      align: 'center',
      render: (_: any, record: any) => {
        if (record.bsys_info) {
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
    APIs.investBsydList(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          let shorter = res.data.data;
          shorter.forEach((ele) => {
            ele.key = ele.id + '9abc';
            ele.firName = ele.name;
            ele.children.forEach((sub) => {
              sub.key = sub.id + '8abc';
              sub.secName = sub.name;
              sub.firName = ele.name;
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
  }, []);
  useEffect(() => {
    fetchDetail();
  }, [current, pagesize]);
  const showTotal = (total: number) => {
    return `共 ${total} 条`;
  };
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
          bslc_title: res.bslc_title,
          bslc_content: res.bslc_content,
          zysx_title: res.zysx_title,
          zysx_content: res.zysx_content,
        };
        function getText(str) {
          return str
            .replace(/<[^<>]+>/g, '')
            .replace(/&nbsp;/gi, '')
            .replace(/\s/gi, '');
        }
        if (!data.bslc_content || !data.zysx_content) {
          if (!data.bslc_content) {
            message.error('办事流程内容不能为空');
          }
          if (!data.zysx_content) {
            message.error('注意事项内容不能为空');
          }
        } else {
          let hi = getText(data.bslc_content);
          let hi2 = getText(data.zysx_content);
          if (!hi.length) {
            message.error('办事流程内容不能为空');
          }
          if (!hi2.length) {
            message.error('注意事项内容不能为空');
          }
          if (hi.length && hi2.length) {
            if (dynamicTitle == '新建') {
              APIs.investBsydAdd(data)
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
              data.id = currentItem.bsys_info.id;
              delete data.invest_category_ids;
              data.invest_category_id = res.invest_category_ids[0];
              APIs.investBsydModify(data)
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
          }
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
    fetchSecond(value);
    littleForm.setFieldsValue({
      invest_category_ids: undefined,
    });
  };
  return (
    <div className={styles.page}>
      <Table
        key="3"
        className={styles.tableWidth}
        columns={columns}
        rowKey={(item) => item.key}
        dataSource={dataArray}
        pagination={false}
        loading={loading}
        scroll={{ y: 630, x: 'auto' }}
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
        width={1000}
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
                disabled={dynamicTitle == '编辑' ? true : false}
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
                disabled={dynamicTitle == '编辑' ? true : false}
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
              label="办事流程标题"
              name="bslc_title"
              rules={[{ required: true, message: '请填写办事流程标题' }]}
            >
              <Input
                placeholder="请输入"
                maxLength={50}
                placeholder={'请填写办事流程标题'}
              />
            </Form.Item>
            <Form.Item
              name="bslc_content"
              style={{ display: 'none' }}
            ></Form.Item>
            <Form.Item
              label="办事流程内容"
              rules={[{ required: true, message: '请填写办事流程内容' }]}
            >
              <Editor1 initValue={value1} getContent={analyse1Content} />
            </Form.Item>
            <Form.Item
              label="注意事项标题"
              name="zysx_title"
              rules={[{ required: true, message: '请填写注意事项标题' }]}
            >
              <Input
                placeholder="请输入"
                maxLength={50}
                placeholder={'请填写注意事项标题'}
              />
            </Form.Item>
            <Form.Item
              name="zysx_content"
              style={{ display: 'none' }}
            ></Form.Item>
            <Form.Item
              label="注意事项内容"
              rules={[{ required: true, message: '请填写注意事项内容' }]}
            >
              <Editor2 initValue={value2} getContent={analyseContent} />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(Details);
