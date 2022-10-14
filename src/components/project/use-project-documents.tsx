import Apis from '@/utils/apis';
import useSWR from 'swr';
import axios from '@/utils/axios';
import { message } from 'antd';

export default function useProjectDocuments(article_type?: number) {
  const fetcher = (url: any) =>
    axios
      .post(url, {
        article_type, // 项目类型
        page: 1,
        pagesize: 999,
      })
      .then((res) => {
        if (res.code === 0) {
          return res.data?.data || [];
        } else {
          message.error(res.msg);
        }
      });

  const { data = [], error } = useSWR('/policy_document/list', fetcher, {
    // revalidateIfStale: false,
    revalidateOnFocus: false,
    // revalidateOnReconnect: false,
    onError(err, key, config) {
      message.error(`${err.message}`);
    },
  });

  return {
    data,
    isLoading: !data && !error,
    error,
  };
}
