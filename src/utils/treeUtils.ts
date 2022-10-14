/**
 * 树形结构相关工具函数
 */
import _ from 'lodash';

/**
 * 根据节点唯一标识获取节点数据对象
 * @param data 被遍历树数据
 * @param key 要找的节点唯一标识key
 */
export const getTreeItem = (data: any, key: any) => {
  var obj = {};
  function loop(data: any, key: any) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].key == key) {
        obj = data[i];
      } else if ('children' in data[i] && data[i].children.length > 0) {
        loop(data[i].children, key);
      }
    }
  }
  loop(data, key);
  return obj;
};

/**
 * 根据key勾选节点 需深度遍历全选子节点
 * @param data 被遍历树数据
 * @param key 要勾选的节点
 * @param checkedKeys 当前已选数据 [{value, label, halfChecked}]
 */
export const checkNode = (data: any, key: any, checkedKeys: string[]) => {
  try {
    const result: any = [];
    const node: any = getTreeItem(data, key); // 当前节点数据
    let checkedKeysCopy = _.cloneDeep(checkedKeys);
    if (node?.children?.length) {
      result.push({
        value: node.key,
        label: node.label,
        halfChecked: false,
        disabled: undefined,
      });
      // 递归找到所有子节点key
      function loop(children: any) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          result.push({
            value: child.key,
            label: child.label,
            halfChecked: false,
            disabled: undefined,
          });
          if (child.children?.length) {
            loop(child.children);
          }
        }
      }
      loop(node?.children);
    } else {
      result.push({
        value: node.key,
        label: node.label,
        halfChecked: false,
        disabled: undefined,
      });
    }

    // 是否有父级
    const parentNodes = hasParent(data, key);
    // console.log('parentNodes', parentNodes);

    if (parentNodes?.length) {
      checkedKeysCopy = checkedKeysCopy.concat(result); // 加入当前点击的节点数据
      checkedKeysCopy = _.uniqBy(checkedKeysCopy, 'value'); // 去重
      // 有父级 从下往上遍历每一层父级的子孙节点是否选中 选中的话halfchecked为false 否则halfchecked为true
      parentNodes.forEach((node: any, i: number) => {
        if (i) {
          // 第一条是当前点击节点不处理
          const halfChecked = genHalfChecked(
            data,
            [
              ...checkedKeysCopy.map((v: any) => v.value),
              ...result.map((v: any) => v.value),
            ],
            node.key,
          );

          result.push({
            value: node.key,
            label: node.label,
            halfChecked,
            disabled: undefined,
          });
        }
      });
    }

    return result;
  } catch (e) {
    console.log('checkNode error', e);
  }
};

/**
 * 根据key取消勾选节点 需深度遍历全部取消子节点
 * @param data 被遍历树数据
 * @param key 要勾选的节点
 */
export const uncheckNode = (data: any, key: any, checkedKeys: string[]) => {
  try {
    const uncheckedNodes: any = []; // 要取消的node数据
    const node: any = getTreeItem(data, key); // 当前节点数据
    const checkedKeysCopy = _.cloneDeep(checkedKeys);
    if (node?.children?.length) {
      uncheckedNodes.push({
        value: node.key,
        label: node.label,
        halfChecked: false,
        disabled: undefined,
      });
      // 递归找到所有要取消的子节点key
      function loop(children: any) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          uncheckedNodes.push({
            value: child.key,
            label: child.label,
            halfChecked: false,
            disabled: undefined,
          });
          if (child.children?.length) {
            loop(child.children);
          }
        }
      }
      loop(node?.children);
    } else {
      uncheckedNodes.push({
        value: node.key,
        label: node.label,
        halfChecked: false,
        disabled: undefined,
      });
    }

    // 是否有父级 判断父级节点取消勾选或者置为半选
    const parentNodes = hasParent(data, key);
    // console.log('parentNodes', parentNodes);

    if (parentNodes?.length) {
      // 有父级 从下往上遍历每一层父级的子孙节点是否选中 选中的话halfchecked为false 否则halfchecked为true
      parentNodes.forEach((node: any, i: number) => {
        if (i) {
          // 第一条是当前点击节点不处理
          // 判断父节点下所有子节点是否全都取消 是-不push此父节点 否-push对象中halfChecked=true
          // 递归找到所有子节点key
          let childKeys: any = findChildren(data, node.key);
          let halfChecked = false;
          // 已选节点删除当前取消的节点之后 还存不存在父节点下的子孙节点
          const uncheckedIds = uncheckedNodes.map((v: any) => v.value);
          _.remove(checkedKeysCopy, (v: any) => {
            return uncheckedIds.includes(v.value);
          });
          const ids = checkedKeysCopy.map((v: any) => v.value);
          if (childKeys.some((v: string) => ids.includes(v))) {
            // 有选中的子节点
            halfChecked = true;
          }
          uncheckedNodes.push({
            value: node.key,
            label: node.label,
            halfChecked,
            disabled: undefined,
          });
        }
      });
    }

    return uncheckedNodes;
  } catch (e) {
    console.log('uncheckNode error', e);
  }
};

/**
 * 根据key判断当前节点是全选还是半选
 * @param data
 * @param ids 已选的key数组
 * @param key
 * @return boolean
 */
export const genHalfChecked = (data: any, ids: any, key: any) => {
  // 遍历找到此节点 看此节点有没有children
  const node: any = getTreeItem(data, key);
  if (node?.children?.length) {
    // 递归找到所有子节点key
    let childKeys: any = findChildren(data, key);
    // ids.sort((a: any, b: any) => a - b);
    // childKeys.sort((a: any, b: any) => a - b);
    return !childKeys.every((v: string) => ids.includes(v));
  } else {
    return false;
  }
};

/**
 * 判断某节点是否有父级，并返回所有父级
 * @param data
 * @param key
 */
export const hasParent = (data: any, key: any) => {
  let parentNodes: any = [];
  function loop(pid: any) {
    const node: any = getTreeItem(data, pid);
    parentNodes.push(node);
    if (node?.pid > 0) {
      loop(node?.pid);
    }
  }
  loop(key);
  return parentNodes;
};

/**
 * 找到某节点的所有子孙节点，并返回key数组
 * @param data
 * @param key
 */
export const findChildren = (data: any, key: any) => {
  const node: any = getTreeItem(data, key);
  let childKeys: any = [];
  if (node?.children?.length) {
    // 递归找到所有子节点key
    function loop(children: any) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        childKeys.push(child.key);
        if (child.children?.length) {
          loop(child.children);
        }
      }
    }
    loop(node?.children);
  }
  return childKeys;
};
