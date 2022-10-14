import React, { useRef, useState } from 'react';
import StandardTable, { TableRef } from '@/components/table/StandardTable';
import { getRoles, removeRole } from '@/api/system';
import { Modal, Button, message } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import SearchForm from '@/components/table/SearchForm';
import RoleModal from '@/components/system/RoleModal';
import AuthWrapper from '@/components/auth/authWrapper';

export default function Users() {
  const [data, setData] = useState([]);
  const [params, setParams] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const tableRef = useRef<TableRef>();

  const columns: any = [
    {
      title: '角色名',
      dataIndex: 'role_name',
      align: 'center',
      // renderFormItem: ()=> ()
    },
    {
      title: '角色描述',
      dataIndex: 'comment',
      align: 'center',
      hideInSearch: true,
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
          <AuthWrapper mark={'/system-/system/roles-edit'}>
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
          <AuthWrapper mark={'/system-/system/roles-remove'}>
            <Button
              size="small"
              type="link"
              onClick={() => {
                Modal.confirm({
                  content: `确认删除角色"${record.role_name}"?`,
                  icon: <ExclamationCircleOutlined />,
                  onOk: async () => {
                    try {
                      const result = await removeRole(record.id);
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

  const searchHandler = (rawValues: any) => {
    setParams({
      search_role_name: rawValues.role_name,
    });
  };
  const dataHandler = (result: any) => {
    setData(result);
    return result;
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
        <AuthWrapper mark={'/system-/system/roles-new'}>
          <Button
            type="primary"
            onClick={() => {
              setSelectedRow({ action: 'create' });
              setIsModalVisible(true);
            }}
            icon={<PlusOutlined />}
          >
            新建
          </Button>
        </AuthWrapper>
      </div>
      <StandardTable
        params={params}
        dataFetcherFn={getRoles}
        dataHandlerFn={dataHandler}
        columns={columns}
        data={data}
        ref={tableRef}
      />
      <RoleModal
        context={selectedRow}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={() => {
          tableRef.current?.reload();
          setIsModalVisible(false);
        }}
      />
    </div>
  );
}
