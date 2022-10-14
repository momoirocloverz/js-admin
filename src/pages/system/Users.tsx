import React, { useEffect, useRef, useState } from 'react';
import StandardTable, { TableRef } from '@/components/table/StandardTable';
import { getUsers, removeUser, toggleUserAccountStatus } from '@/api/system';
import { Modal, Button, message, Select, Avatar, Form, Input } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import SearchForm from '@/components/table/SearchForm';
import { USER_ACCOUNT_STATUS } from '@/pages/system/const';
import UserModal from '@/components/system/UserModal';
import dd from 'gdt-jsapi';
import Apis from '@/utils/apis';
import { validatePassword } from '@/utils/common';
import AuthWrapper from '@/components/auth/authWrapper';
const { Option } = Select;
export default function Users() {
  const [data, setData] = useState([]);
  const [params, setParams] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const tableRef = useRef<TableRef>();
  const [form] = Form.useForm();
  const [editVisible, setEditVisible] = useState(false);
  const [chossenOne, setChossenOne] = useState(false);
  const [roleTypeList, setRoleTypeList] = useState([]);
  const columns: any = [
    {
      title: '头像',
      dataIndex: 'avatar',
      width: 120,
      align: 'center',
      hideInSearch: true,
      render: (url: string) => <Avatar src={url} size={80} />,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      align: 'center',
    },
    {
      title: '角色名',
      dataIndex: 'role_name',
      align: 'center',
    },
    {
      title: '角色类型',
      dataIndex: 'role_type',
      align: 'center',
      className: 'notshow',
      renderFormItem: () => (
        <Select placeholder="请选择" options={roleTypeList}></Select>
      ),
    },
    {
      title: '真实姓名',
      dataIndex: 'real_name',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      hideInSearch: true,
      render: (text) => USER_ACCOUNT_STATUS[text],
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      hideInSearch: true,
      width: 80,
      render: (__, record) => (
        <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          <AuthWrapper mark={'/system-/system/users-edit'}>
            <Button
              size="small"
              type="link"
              onClick={() => {
                setSelectedRow({ ...record, action: 'modify' });
                setIsModalVisible(true);
              }}
            >
              编辑
            </Button>
          </AuthWrapper>
          <AuthWrapper mark={'/system-/system/users-password'}>
            <Button
              size="small"
              type="link"
              onClick={() => {
                // setSelectedRow({ ...record, action: 'modify' });
                setChossenOne(record);
                setEditVisible(true);
              }}
            >
              修改密码
            </Button>
          </AuthWrapper>
          <AuthWrapper mark={'/system-/system/users-disable'}>
            <Button
              size="small"
              type="link"
              onClick={async () => {
                try {
                  const result = await toggleUserAccountStatus({
                    id: record.id,
                  });
                  if (result.code === 0) {
                    tableRef.current?.reload();
                    message.success('切换状态成功!');
                  } else {
                    throw new Error(result.msg);
                  }
                } catch (e) {
                  message.error(`切换状态失败: ${e.message}`);
                }
              }}
            >
              {record.status === 0 ? '禁用' : '启用'}
            </Button>
          </AuthWrapper>
          <AuthWrapper mark={'/system-/system/users-remove'}>
            <Button
              size="small"
              type="link"
              onClick={() => {
                Modal.confirm({
                  content: `确认删除用户"${record.username}"?`,
                  icon: <ExclamationCircleOutlined />,
                  onOk: async () => {
                    try {
                      const result = await removeUser(record.id);
                      if (result.code === 0) {
                        message.success('删除成功!');
                        tableRef.current?.reload();
                      } else {
                        throw new Error(result.msg);
                      }
                    } catch (e) {
                      message.error(`删除失败: ${e.message}!`);
                    }
                  },
                });
              }}
            >
              删除
            </Button>
          </AuthWrapper>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getRoleType();
  }, []);

  const getRoleType = () => {
    Apis.getRoleTypeList()
      .then((res) => {
        const list = res.data?.list.map((v: any) => {
          return { label: v.name, value: v.role_type };
        });
        setRoleTypeList(list || []);
      })
      .catch(() => {});
  };

  const searchHandler = (rawValues: any) => {
    setParams({
      search_username: rawValues.username,
      role_type: rawValues.role_type,
      search_role_name: rawValues.role_name,
    });
  };

  const dataHandler = (result: any) => {
    setData(result);
    return result;
  };

  // 浙政钉相关
  // 新增用户，这里需要判断当前环境是否是浙政钉环境
  const popNew = async () => {
    dd.getAuthCode({})
      .then((res) => {
        getAccessToken();
        // Modal.confirm({
        //   title: "getAuthCode",
        //   content: JSON.stringify('getAuthCode'),
        // });
      })
      .catch(() => {
        setSelectedRow({ action: 'create' });
        setIsModalVisible(true);
      });
  };

  // 获取accessToken
  const getAccessToken = () => {
    Apis.zzdAccessToken({})
      .then((res) => {
        // Modal.confirm({
        //   title: "getAccessToken.then",
        //   content: JSON.stringify(res),
        // });
        if (res.code == 0) {
          if (res.data.success) {
            if (res.data.content.success) {
              getTicket(res.data.content.data.accessToken);
            } else {
              message.error(res.data.content.responseMessage);
            }
          } else {
            message.error(res.msg);
          }
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
        // Modal.confirm({
        //   title: "getAccessToken.catch",
        //   content: JSON.stringify(err),
        // });
      });
  };
  //获取tikcet
  const getTicket = (access_token: any) => {
    Apis.zzdTicket({
      access_token,
    })
      .then((e) => {
        // Modal.confirm({
        //   title: "getTicket.then",
        //   content: JSON.stringify(e),
        // });
        getContact(e.data.content.data.accessToken);
      })
      .catch((e) => {
        // Modal.confirm({
        //   title: "getTicket.catch",
        //   content: JSON.stringify(e),
        // });
      });
  };
  // 获取组织
  const getContact = (ticket: any) => {
    dd.authConfig({
      ticket,
      jsApiList: ['chooseContactWithComplexPicker'],
    })
      .then((res1) => {
        // Modal.confirm({
        //   title: "getContact.then",
        //   content: JSON.stringify(res1),
        // });
        dd.chooseContactWithComplexPicker({
          panelTypes: 1,
          responseUserOnly: true,
          maxUsers: 1, // 目前最多选择一次
        })
          .then((res) => {
            // Modal.confirm({
            //   title: "chooseContactWithComplexPicker.then",
            //   content: JSON.stringify(res),
            // });
            dealContact(res);
          })
          .catch((res) => {
            // Modal.confirm({
            //   title: "chooseContactWithComplexPicker.catch",
            //   content: JSON.stringify(res),
            // });
          });
      })
      .catch((err) => {
        // Modal.confirm({
        //   title: "getContact.catch",
        //   content: JSON.stringify(err),
        // });
      });
  };
  // 这里处理返回的组织数据
  const dealContact = (e: any) => {
    // setRes(JSON.stringify(e));
    if (e.users && e.users.length > 0) {
      // 这里多做一层判断，理论上一定会返回数组
      let accountId = e.users[0].userid; // 这里获取到用户userid
      let username = e.users[0].name; // 用户名字
      let real_name = e.users[0].name; // 用户名字
      setSelectedRow({ action: 'create', accountId, username, real_name });
      setIsModalVisible(true);
    }
  };
  const onCancel = () => {
    setEditVisible(false);
  };
  const onConfirm = () => {
    console.log('chossenOne', chossenOne);
    form
      .validateFields()
      .then((res) => {
        console.log('res', res);
        Apis.modifyListPassword({
          password: res.password,
          password2: res.password2,
          id: chossenOne.id,
        })
          .then((res) => {
            if (res && res.code === 0) {
              message.success('密码修改成功');
              setEditVisible(false);
            } else {
              message.error(res.msg);
            }
          })
          .catch((err) => {
            console.log('err', err);
          });
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  return (
    <div style={{ height: '100%' }}>
      <SearchForm columns={columns} onSubmit={searchHandler} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row-reverse',
          backgroundColor: 'white',
          padding: '10px',
          columnGap: '5px',
        }}
      >
        <AuthWrapper mark={'/system-/system/users-new'}>
          <Button
            type="primary"
            onClick={() => {
              popNew();
            }}
            icon={<PlusOutlined />}
          >
            新建
          </Button>
        </AuthWrapper>
      </div>
      <StandardTable
        params={params}
        dataFetcherFn={getUsers}
        dataHandlerFn={dataHandler}
        columns={columns}
        data={data}
        ref={tableRef}
      />
      <UserModal
        context={selectedRow}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={() => {
          tableRef.current?.reload();
          setIsModalVisible(false);
        }}
      />
      <Modal
        title={'修改密码'}
        visible={editVisible}
        width={450}
        onCancel={onCancel}
        onOk={onConfirm}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="密码"
            name="password"
            required
            rules={[
              {
                validator: (r, v) => {
                  return validatePassword(v);
                },
              },
            ]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="password2"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('密码必须是一致的!'));
                },
              }),
            ]}
          >
            <Input type="password" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
