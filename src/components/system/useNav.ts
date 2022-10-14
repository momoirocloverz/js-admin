import { useEffect, useState } from 'react';
import { message } from 'antd';
import { getNavs } from '@/api/system';
import { getSideNavs } from '@/api/common';

export type RawResponseObj = {
  id: number; // 导航id
  pid: number; // 父级导航id
  name: string; // 导航名
  mark: string; // 导航标识
  icon: string; // 导航图标,非必传
  type: 1 | 2; // 导航类型 1=导航 2=按钮
  sort: number; // 排序
  children?: RawResponseObj[];
  permissions?: RawResponseObj[];
};

export function findNavs(rawResponse: RawResponseObj[]) {
  const filtered = rawResponse.filter((e) => e.type === 1);
  filtered.forEach((e) => {
    if (e.children) {
      const children = findNavs(e.children);
      e.children = children.length > 0 ? children : undefined;
    }
  });
  return filtered;
}
export function fixNavs(rawResponse: RawResponseObj[]) {
  const filtered = rawResponse.filter((e) => e.type === 1);
  const permissions = rawResponse.filter((e) => e.type === 2);
  filtered.forEach((e) => {
    // if (e.children) {
    //   const [children, permissions] = fixNavs(e.children);
    //   e.children = children.length > 0 ? children : undefined;
    //   e.permissions = permissions;
    // } else {
    //   e.permissions = [];
    //   e.children = [];
    // }
  });
  return [filtered, permissions];
}

export function useUserNav() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getSideNavs({})
      .then((result) => {
        if (result.code == 0) {
          let allNavIds = result.data.navigate_list.map((ele) => {
            return ele.id;
          });
          let allBtnsIds = result.data.navigate_list
            .filter((ele) => {
              return ele.type == 2;
            })
            .map((ele) => {
              return ele.full_mark;
            });
          if (allNavIds && allNavIds.length) {
            sessionStorage.setItem('allNavIds', JSON.stringify(allNavIds));
          }
          if (allBtnsIds && allBtnsIds.length) {
            sessionStorage.setItem('allBtnsIds', JSON.stringify(allBtnsIds));
          }
        }
        const navMap = new Map([[0, { id: 0, children: [] }]]);
        const source =
          result.data?.navigate_list?.sort((a, b) => a.sort - b.sort) || [];
        source.forEach((nav) => {
          navMap.set(nav.id, nav);
        });
        source.forEach((nav) => {
          const parent = navMap.get(nav.pid);
          // nav.type = 1;
          if (parent) {
            if (parent.children) {
              parent.children.push(nav);
            } else {
              parent.children = [nav];
            }
          }
        });
        setData(navMap.get(0).children);
      })
      .catch((e) => message.error(`导航列表读取失败: ${e.message}`))
      .finally(() => {
        setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);
  return { data, isLoading };
}

export function useNav() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getNavs({})
      .then((result) => {
        const tree = result?.data?.list || [];
        const formatTree = (node) => {
          const newNode = { ...node };
          newNode.label = node.name;
          newNode.value = node.id.toString();
          newNode.key = node.id.toString();
          newNode.title = node.name;
          if (node.children) {
            newNode.children = node.children.map((child) => formatTree(child));
          }
          return newNode;
        };
        setData(tree.map((node) => formatTree(node)));
      })
      .catch((e) => message.error(`导航列表读取失败: ${e.message}`))
      .finally(() => {
        setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading };
}
