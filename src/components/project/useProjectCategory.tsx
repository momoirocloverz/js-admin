import { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { getCategory } from '@/api/projects';

/**
 * 获取项目类型数据
 * @param type 1：竞争性 2：惠农补贴 default：所有
 * @returns
 */
export default function useProjectCategory(type?: number) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getCategory()
      .then((result: any) => {
        if (result.code === 0) {
          const options: any = [];
          let list = result.data;
          if (type == 1) {
            list = result.data.filter(
              (v: any) => v.category_name == '竞争性财政支农项目',
            );
          } else if (type == 2) {
            list = result.data.filter(
              (v: any) => v.category_name == '惠农补贴',
            );
          }
          list.forEach((item: any) => {
            if (item.get_parent_do?.length) {
              item.get_parent_do.forEach((subItem: any) => {
                options.push({
                  value: subItem.id,
                  label: `${subItem.category_name}`,
                });
              });
            } else {
              options.push({
                value: item.id,
                label: `${item.category_name}`,
              });
            }
          });

          setData(options);
        } else {
          throw new Error(result.msg);
        }
      })
      .catch((e) => message.error(`项目类型读取失败: ${e.message}`))
      .finally(() => {
        setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [type]);

  return { data, isLoading };
}
