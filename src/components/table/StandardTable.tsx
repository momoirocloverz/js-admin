import { message, Pagination, Table, TableProps } from 'antd';
import styles from '@/pages/application/index.less';
import React, {
  ForwardedRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { ColumnsType } from 'antd/lib/table';
import TableRadio, { RadioItemProps } from './TableRadio';

interface Props extends TableProps<any> {
  params?: Record<string, any>;
  data: Array<any>;
  columns: ColumnsType;
  dataFetcherFn: (params: Record<string, any>) => Promise<any>;
  dataHandlerFn?: (result: any) => unknown;
  pageSizeName?: string;
  dataField?: string | null;
  radioConfig?: {
    data: Array<RadioItemProps>;
    defaultValue?: string | number;
  };
}

type ResponseData = {
  total: number;
  per_page: number;
  current_page: number;
  data: Object[];
};

type StandardResponse = {
  code: number;
  data: ResponseData;
  msg: string;
};

export interface BaseColumn {
  id: number;
}

export interface TableRef {
  reload: () => Promise<any>;
}

function StandardTableComponent(
  {
    params = {},
    data = [],
    columns,
    dataHandlerFn = (rawResult: Object[]) => rawResult,
    dataFetcherFn,
    pageSizeName = 'pagesize',
    dataField = 'data',
    radioConfig,
    ...rest
  }: Props,
  ref: ForwardedRef<any>,
) {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 15,
  });
  const [count, setCount] = useState(0);
  const [savedParams, setSavedParams] = useState({});
  const [initialRender, setInitialRender] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const requestRef = useRef<string | undefined>();
  useImperativeHandle(ref, () => ({
    reload: () => {
      setPagination({
        ...pagination,
        page: 1,
      });
    },
  }));

  const loadData = async () => {
    const rid = performance.now().toString();
    requestRef.current = rid;
    setIsLoading(true);
    try {
      const requestParams = {
        ...params,
        page: pagination.page,
        [pageSizeName || 'pagesize']: pagination.pageSize,
      };
      const result: StandardResponse = await dataFetcherFn(requestParams);
      if (rid === requestRef.current) {
        dataHandlerFn(dataField ? result.data[dataField] : result.data);
        setSavedParams(requestParams);
        setCount(result?.data?.total || 0);
      }
    } catch (e) {
      message.error(`列表读取错误: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialRender) {
      setPagination({
        ...pagination,
        page: 1,
      });
    }
  }, [params]);
  useEffect(() => {
    loadData();
    setInitialRender(false);
  }, [pagination]);
  useEffect(() => {
    return () => {
      requestRef.current = '';
    };
  }, []);

  return (
    <>
      {radioConfig && radioConfig?.data.length > 0 && (
        <TableRadio
          radioArray={radioConfig.data}
          defaultValue={radioConfig.defaultValue}
        />
      )}

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={isLoading}
        pagination={false}
        {...rest}
      />
      <Pagination
        className={styles.pagination}
        total={count}
        current={pagination.page}
        showSizeChanger={false}
        pageSize={pagination.pageSize}
        onChange={(page, pageSize) => {
          setPagination({ ...pagination, page, pageSize: pageSize || 20 });
        }}
      />
    </>
  );
}
const StandardTable = React.forwardRef(StandardTableComponent);
// StandardTable.defaultProps = {
//   params: {},
//   data: [],
//   pageSizeName: 'pagesize',
//   dataHandlerFn: (rawResult: Object[]) => rawResult,
// };

export default StandardTable;
