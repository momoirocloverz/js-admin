import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Form,
  Input,
  message,
  Modal,
  Spin,
  Tree,
  TreeSelect,
  Select,
  Cascader,
} from 'antd';
import { urlToUploaderValue } from '@/utils/common';
import MediaUploader from '@/components/form/MediaUploader';
import Apis from '@/utils/apis';
import {
  createRole,
  createUser,
  getRole,
  modifyRole,
  modifyUser,
} from '@/api/system';
import { useNav } from '@/components/system/useNav';
import _ from 'lodash';
import {
  getTreeItem,
  checkNode,
  genHalfChecked,
  uncheckNode,
} from '@/utils/treeUtils';
const { Option } = Select;

export default function RoleModal({ context, visible, onCancel, onSuccess }) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [townList, setTownList] = useState([]);
  const [allTownList, setAllTownList] = useState([]);
  const [currentRole, setCurrentRole] = useState<string | number>('');
  const [isLoadingItem, setIsLoadingItem] = useState(false);
  const [townValue, setTownValue] = useState<any>([]);
  const { data: navData } = useNav();
  const [checkedKeys, setCheckedKeys] = useState<any>([]);

  // 寻找某节点的所有上级父节点key
  const findRootNode = (navData: any, key: any) => {
    const temp: any = [];
    //先定义个函数寻找子节点位置 找到后 再找改节点父元素位置 以此类推
    const callback = function (nowArr: any, key: any) {
      for (var i = 0; i < nowArr.length; i++) {
        var item = nowArr[i];
        if (item.key == key) {
          temp.push(item);
          callback(navData, item.pid); //pid 父级ID
          break;
        } else {
          if (item.children) {
            callback(item.children, key); //menus 子节点字段名称
          }
        }
      }
    };
    callback(navData, key);
    return temp; //最后返回
  };

  // 根据后端返回数据生成TreeSelect受控数组对象
  const genCheckedKeysByIds = (ids: string[]) => {
    // console.log('后端返回ids', ids, navData.length);
    let result: any = [];
    if (navData?.length) {
      // 遍历返回id 每个id有没有父级 有的话生成父级数据存入
      ids.forEach((id: any) => {
        // 找到当前节点的所有父节点
        const parentNodes = findRootNode(navData, id);
        if (parentNodes?.length) {
          parentNodes.forEach((node: any) => {
            result.push({
              value: node.key,
              label: node.label,
              halfChecked: genHalfChecked(navData, ids, node.key),
              disabled: undefined,
            });
          });
        }
      });
    }
    // 去重
    result = _.uniqBy(result, 'value');
    // console.log('result', result);
    return result;
  };

  useEffect(() => {
    Apis.getRoleTypeList({})
      .then((res: any) => {
        if (res && res.code === 0) {
          setRoleList(res.data.list);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
    // 获取镇列表数据
    Apis.areaGetTownList({})
      .then((res: any) => {
        if (res && res.code === 0) {
          setTownList(res.data.list);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
    // 获取级联选择乡镇数据
    Apis.fetchAreaList({})
      .then((res: any) => {
        if (res && res.code === 0) {
          setAllTownList(res.data.list[0].children);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, []);

  useEffect(() => {
    if (visible) {
      if (context.town_id) {
        setTownValue([context.town_id, context.village_id]);
      } else {
        setTownValue([]);
      }
      form.resetFields();
      setIsLoadingItem(true);
      getRole(context.id)
        .then((result) => {
          const ids = result.data?.info?.navigate_ids || [];

          let allNavIds = sessionStorage.getItem('allNavIds')
            ? JSON.parse(sessionStorage.getItem('allNavIds') as string)
            : '';
          if (allNavIds) {
            let after = ids.filter((ele: any) => {
              let inner = allNavIds.find((sub: any) => {
                return sub == ele;
              });
              return inner;
            });
            let sim2ple = after.map((id: any) => id.toString());
            genCheckedKeysByIds(sim2ple);
            setCheckedKeys(genCheckedKeysByIds(sim2ple));
            form.setFieldsValue({ navigate_ids: sim2ple });
          } else {
            let simple = ids.map((id: any) => id.toString());
            setCheckedKeys(genCheckedKeysByIds(simple));
            form.setFieldsValue({ navigate_ids: simple });
          }
          // setCheckedKeys(ids.map((id) => id.toString()));
          // form.setFieldsValue({ navigate_ids: ids.map((id) => id.toString()) });
          setCurrentRole(context.role_type);
        })
        .finally(() => {
          setIsLoadingItem(false);
        });
    }
  }, [visible]);

  const submit = async () => {
    let params;
    try {
      params = await form.validateFields();
    } catch (e) {
      return;
    }
    params.id = context.id;
    if (checkedKeys?.length) {
      checkedKeys.sort((a: any, b: any) => a - b);
      params.navigate_ids = checkedKeys.map((v: any) => v.value);
    }
    // if (params.navigate_ids.length) {
    //   if (params.navigate_ids[0].value) {
    //     params.navigate_ids = params.navigate_ids.map((v: any) => v.value);
    //   }
    // }
    // 村级审核人员取villageId
    if (currentRole == 31) {
      params.town_id = townValue[0];
      params.village_id = townValue[1];
    }
    setIsLoading(true);
    try {
      if (context.action === 'create') {
        const result = await createRole(params);
        if (result.code === 0) {
          message.success('创建成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
      if (context.action === 'modify') {
        const result = await modifyRole(params);
        if (result.code === 0) {
          message.success('修改成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
    } catch (e) {
      message.error(`提交失败: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectChange = (value: any) => {
    setCurrentRole(value);
  };

  // 村级授权区域选择回调
  const handleTownSelectChange = (value: any) => {
    setTownValue(value);
  };

  const onSelectTree = (value: any, label: any, extra: any) => {
    // console.log(value, label, extra);
    const { checked, triggerValue } = extra;
    // 获取节点数据
    const currentNode: any = getTreeItem(navData, triggerValue);
    console.log('操作的条目', currentNode);
    if (checked) {
      // 勾选操作
      let newCheckedKeys = _.cloneDeep(checkedKeys);
      const currentCheckedKeys = checkNode(
        navData,
        currentNode.key,
        newCheckedKeys,
      );
      // console.log('要钩选的子孙节点和祖先节点', currentCheckedKeys);
      newCheckedKeys = currentCheckedKeys.concat(newCheckedKeys);
      newCheckedKeys = _.uniqBy(newCheckedKeys, 'value');
      // console.log('新的受控数据', newCheckedKeys);
      setCheckedKeys(newCheckedKeys);
    } else {
      // 取消勾选
      let newCheckedKeys = _.cloneDeep(checkedKeys);
      const uncheckedNodes = uncheckNode(navData, currentNode.key, newCheckedKeys);
      newCheckedKeys = newCheckedKeys.map((node: any) => {
        // 找到要取消勾选的数据在原始数据中的索引
        const index = uncheckedNodes.findIndex(
          (v: any) => v.value == node.value,
        );
        if (index > -1) {
          // 是否要置为半选
          if (uncheckedNodes[index].halfChecked) {
            node.halfChecked = true;
            return node;
          }
        } else {
          return node;
        }
      });
      console.log('要取消的受控数据', uncheckedNodes);
      setCheckedKeys(newCheckedKeys.filter((v: any) => v));
    }
  };

  return (
    <Modal
      title={context.action === 'create' ? '新建' : '编辑'}
      visible={visible}
      width={450}
      centered
      confirmLoading={isLoading || isLoadingItem}
      onCancel={onCancel}
      onOk={submit}
    >
      <Spin spinning={isLoadingItem} tip="读取数据中...">
        <Form
          form={form}
          initialValues={{
            ...context,
            avatar: urlToUploaderValue(context.avatar),
          }}
          layout="vertical"
          // labelCol={{ span: 10 }}
          // wrapperCol={{ span: 14 }}
        >
          <Form.Item
            label="角色名称"
            name="role_name"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="角色描述"
            name="comment"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <Input.TextArea autoSize={{ minRows: 2 }} />
          </Form.Item>
          <Form.Item
            label="角色类型"
            name="role_type"
            rules={[{ required: true, message: '请选择角色类型' }]}
          >
            <Select style={{ width: 400 }} onChange={handleSelectChange}>
              {roleList.map((ele) => (
                <Option value={ele.role_type} key={ele.role_type}>
                  {ele.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {currentRole == 22 ||
          currentRole == 23 ||
          currentRole == 24 ||
          currentRole == 25 ||
          currentRole == 26 ||
          currentRole == 27 ? (
            <Form.Item
              label="授权区域"
              name="town_id"
              rules={[{ required: true, message: '请选择授权区域' }]}
            >
              <Select style={{ width: 400 }}>
                {townList.map((ele) => (
                  <Option value={ele.id} key={ele.id}>
                    {ele.town_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          ) : null}
          {currentRole == 31 ? (
            <Form.Item
              label="授权区域"
              rules={[{ required: true, message: '请选择授权区域' }]}
            >
              <Cascader
                options={allTownList}
                style={{
                  width: 220,
                  marginBottom: '10px',
                  marginRight: '30px',
                }}
                fieldNames={{
                  label: 'name',
                  value: 'id',
                  children: 'children',
                }}
                onChange={handleTownSelectChange}
                value={townValue}
                defaultValue={townValue}
                changeOnSelect={true}
                placeholder="请选择项目地点"
              />
            </Form.Item>
          ) : null}
          <Form.Item
            label="导航权限"
            // name="navigate_ids"
            required
            rules={[{ required: true, message: '请选择导航权限' }]}
          >
            <TreeSelect
              treeData={navData}
              listHeight={400}
              treeCheckable
              treeCheckStrictly
              value={checkedKeys}
              onChange={onSelectTree}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
