import React, { useRef, useState } from 'react';
import StandardTable, { TableRef } from '@/components/table/StandardTable';
import { getNavs, removeNav } from '@/api/system';
import { Modal, Button, message, Select, Avatar } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import SearchForm from '@/components/table/SearchForm';
import NavModal from '@/components/system/NavModal';
import BatchBtnModal from '@/components/system/batchBtnModal';
import { findNavs, fixNavs, RawResponseObj } from '@/components/system/useNav';
import AuthWrapper from '@/components/auth/authWrapper';

export default function Navs() {
  const [data, setData] = useState<RawResponseObj[]>([]);
  const [params, setParams] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBatchModalVisible, setIsBatchModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const tableRef = useRef<TableRef>();

  const columns: any = [
    {
      title: '导航名称',
      dataIndex: 'name',
      align: 'center',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '导航路径',
      dataIndex: 'mark',
      align: 'center',
      width: 300,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      align: 'center',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      hideInSearch: true,
      width: 300,
      render: (__, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <AuthWrapper mark={'/system-/system/navs-sub'}>
            {record.level < 2 && (
              <Button
                size="small"
                type="link"
                onClick={() => {
                  setSelectedRow({ action: 'create', pid: record.id, type: 1 });
                  setIsModalVisible(true);
                }}
              >
                创建子导航
              </Button>
            )}
          </AuthWrapper>
          <AuthWrapper mark={'/system-/system/navs-btn'}>
            {record.type == 1 ? (
              <Button
                size="small"
                type="link"
                onClick={() => {
                  setSelectedRow({
                    action: 'create',
                    pid: record.id,
                    type: 2,
                    level: record.level,
                    haveChildren:
                      record.children && record.children.length ? '1' : '0',
                  });
                  setIsModalVisible(true);
                }}
              >
                {/* 绑定新权限 */}
                创建子级按钮
              </Button>
            ) : null}
          </AuthWrapper>
          <AuthWrapper mark={'/system-/system/navs-batchbtn'}>
            {record.type == 1 ? (
              <Button
                size="small"
                type="link"
                onClick={() => {
                  setSelectedRow({
                    action: 'create',
                    pid: record.id,
                    type: 2,
                    level: record.level,
                    haveChildren:
                      record.children && record.children.length ? '1' : '0',
                  });
                  setIsBatchModalVisible(true);
                }}
              >
                批量创建子级按钮
              </Button>
            ) : null}
          </AuthWrapper>
          <AuthWrapper mark={'/system-/system/navs-edit'}>
            <Button
              size="small"
              type="link"
              onClick={() => {
                setSelectedRow({
                  ...record,
                  action: 'modify',
                  pid: record.pid,
                  type: record.type,
                  level: record.level,
                });
                setIsModalVisible(true);
              }}
            >
              编辑
            </Button>
          </AuthWrapper>
          <AuthWrapper mark={'/system-/system/navs-remove'}>
            <Button
              size="small"
              type="link"
              onClick={() => {
                Modal.confirm({
                  content: `确认删除"${record.name}"?`,
                  icon: <ExclamationCircleOutlined />,
                  onOk: async () => {
                    try {
                      const result = await removeNav(record.id);
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
    setParams({});
  };
  const dataHandler = (result: any) => {
    const [data] = fixNavs(result);
    // console.log('data', data);
    setData(data);
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
        <AuthWrapper mark={'/system-/system/navs-new'}>
          <Button
            type="primary"
            onClick={() => {
              setSelectedRow({ action: 'create', pid: 0, type: 1 });
              setIsModalVisible(true);
            }}
            icon={<PlusOutlined />}
          >
            新建导航
          </Button>
        </AuthWrapper>
      </div>
      <StandardTable
        params={params}
        dataFetcherFn={getNavs}
        dataHandlerFn={dataHandler}
        columns={columns}
        data={data}
        ref={tableRef}
        dataField="list"
      />
      <NavModal
        context={selectedRow}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={(modalVisibility = false) => {
          tableRef.current?.reload();
          setIsModalVisible(modalVisibility);
        }}
      />
      <BatchBtnModal
        context={selectedRow}
        visible={isBatchModalVisible}
        onCancel={() => setIsBatchModalVisible(false)}
        onSuccess={(modalVisibility = false) => {
          tableRef.current?.reload();
          setIsBatchModalVisible(modalVisibility);
        }}
      />
    </div>
  );
}
