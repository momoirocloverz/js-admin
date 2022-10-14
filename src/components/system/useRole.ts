import { useEffect, useRef, useState } from 'react';
import { getSideNavs } from '@/api/common';
import { message } from 'antd';
import { getRoles, getUsers } from '@/api/system';

export default function useUser(searchedName = '') {
  const [data, setData] = useState([{}, []]);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useRef({})

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    searchParams.current = {
      searchedName
    }
    getRoles({search_role_name: searchedName, page: 1, pagesize: Number.MAX_SAFE_INTEGER})
      .then((result) => {
        if (result.code === 0 && searchedName === searchParams.current?.searchedName) {
          const dict = {}
          const options = []
          result.data.data.forEach((role)=>{
            dict[role.id.toString()] = role;
            options.push({value: role.id, label: role.role_name})
          })
          setData([dict, options])
        } else {
          throw new Error(result.msg)
        }
      })
      .catch((e) => message.error(`角色列表读取失败: ${e.message}`))
      .finally(() => {
        setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [searchedName]);

  return { data, isLoading };
}
