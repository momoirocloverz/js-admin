import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useRef, useState } from 'react';
import AuthWrapper from '@/components/auth/authWrapper';
import { message, Button, Space, Modal, Form, Switch, Input, Radio } from 'antd';
import { getGuideItemGetList, getGuideItemRemove, getGuideItemAction, getGuideItemSwitchStatus } from '@/api/baseSet';
import ProTable, { ActionType } from '@ant-design/pro-table';
const status = {
  2: '全部',
  1: '启用',
  0: '禁用'
};
const statusOptions = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 },
]
const baseSetGuide = (props: any) => {
  const { dispatch } = props;
  const tableRef = useRef<ActionType>();
  const [visiable, setVisiable] = useState(false);
  const [recordId, setRecordId] = useState(0);
  const [form] = Form.useForm();
  const initAction = () => {
    commitGlobalBread([
      {
        title: '基础设置',
      },
      {
        title: '指导单设置',
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

  // 删除=
  const deleteItem = (record: any) => {
    const { id } = record;
    Modal.confirm({
      content: '删除后不可恢复，确认删除？',
      centered: true,
      onOk: async () => {
        const result: any = await getGuideItemRemove({ id });
        if (result.code == 0) {
          message.success('删除成功');
          tableRef.current.reload()
        } else {
          message.warning(result.msg);
        }
      },
      onCancel: async () => { },
    });
  };

  const loadData = async (rawParams: any) => {
    // console.log(rawParams)
    let params
    // 这里单独处理一下数据
    if (rawParams.search_status) {
      params = {
        search_status: rawParams.search_status == 2 ? -1 : parseInt(rawParams.search_status),
        page: rawParams.current,
        pagesize: rawParams.pageSize,
      };
    } else {
      params = {
        page: rawParams.current,
        pagesize: rawParams.pageSize,
      };
    }

    const result = await getGuideItemGetList(params);
    return {
      data: result?.data?.data,
      total: result?.data?.total,
    };
  };

  const columns: any = [
    {
      title: '审批事项名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      hideInSearch: true,
      order: 4,
    },
    {
      title: '状态',
      // dataIndex: 'status',
      key: 'search_status',
      align: 'center',
      valueType: 'select',
      valueEnum: status,
      order: 2,
      width: 300,
      render: (value: any, record: any, index: number) => (
        <>
          {
            <Switch checkedChildren="开启" unCheckedChildren="禁用"
            checked={record.status == 1}
              onChange={async (checked) => {
                const result: any = await getGuideItemSwitchStatus({ id: record.id });

                if (result.code == 0) {
                  message.success('修改成功');
                } else {
                  message.warning(result.msg);
                }
                tableRef.current.reload()
              }
              } />
          }
        </>
      ),
    },

    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 300,
      hideInSearch: true,
      fixed: 'right',
      render: (text: any, record: any) => (
        <>
          <Space>
            <AuthWrapper mark={'fund-/fund/projectFunding-edit'}>
              <div
                className={`${styles.darker}`}
                onClick={(e: any) => {
                  form.setFieldsValue({ ...record })
                  setRecordId(record.id)
                  setVisiable(true)
                }}
              >
                编辑
              </div>
            </AuthWrapper>
            <AuthWrapper mark={'fund-/fund/projectFunding-remove'}>
              <div
                className={`${styles.red}`}
                onClick={(e: any) => {
                  e.stopPropagation();
                  deleteItem(record);
                }}
              >
                删除
              </div>
            </AuthWrapper>
          </Space>
        </>
      ),
    },
  ];

  return (
    <div style={{ minHeight: '100%' }}>
      <ProTable
        className="expandTable"
        actionRef={tableRef}
        request={loadData}
        search={{
          defaultCollapsed: false,
        }}
        revalidateOnFocus={false}
        columns={columns}
        rowKey={(item) => item.id}

        toolBarRender={() => [
          <AuthWrapper mark={'fund-/fund/projectFunding-new'}>
            <Button
              type="primary"
              onClick={() => {
                console.log("sdsd")
                setVisiable(true)
              }}
            >
              新建
            </Button>
          </AuthWrapper>,
        ]}
        options={false}
        scroll={{ x: 'max-content', y: 530 }}
        bordered
      />

      {visiable && <Modal
        visible={true}
        title="新增事项"
        onCancel={() => {
          setVisiable(false)
        }}
        onOk={async () => {
          const fieldsValue = await form.validateFields();

          const result: any = recordId ? await getGuideItemAction({ ...fieldsValue, id: recordId }) : await getGuideItemAction({ ...fieldsValue });
          if (result.code == 0) {
            message.success(recordId ? '编辑成功' : '新增成功');
            setVisiable(false)
            form.resetFields()
            setRecordId(0)
            tableRef.current.reload()
          } else {
            message.warning(result.msg);
          }
        }} >
        <Form
          form={form}
          labelAlign={'left'}
          labelCol={{
            span: 6
          }}
        >
          <Form.Item
            label="事项名称"
            name="name"
            rules={[{ required: true, message: '事项名称不能为空' }]}
          >
            <Input placeholder="请输入投资子类" maxLength={50} />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Radio.Group options={statusOptions} />
          </Form.Item>
        </Form>
      </Modal>
      }
    </div>
  );
};

export default connect()(baseSetGuide);
