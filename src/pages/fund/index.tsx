import React, { useEffect, useRef, useState } from 'react';
import StandardTable, { TableRef } from '@/components/table/StandardTable';
import { Button, message, Select, Form } from 'antd';
import SearchForm from '@/components/table/SearchForm';
import { getDocumentList } from '@/api/projects';
import styles from './index.less';
import { connect, history } from 'umi';
import Apis from '@/utils/apis';

const Users = (props) => {
  const { location, accountInfo, dispatch, children } = props;
  const [data, setData] = useState([]);
  const [params, setParams] = useState({});
  const [documentType, setDocumentType] = useState([]);
  const tableRef = useRef<TableRef>();
  const [form] = Form.useForm();
  const fieldNames = {
    label: 'category_name',
    value: 'id',
    options: 'get_parent_do',
  };
  const columns: any = [
    {
      title: '文件名称',
      dataIndex: 'title',
      width: 180,
      align: 'center',
    },
    {
      title: '文件类型',
      dataIndex: 'category_name',
      align: 'center',
      width: 160,
      renderFormItem: () => (
        <Select
          placeholder="请选择"
          fieldNames={fieldNames}
          optionLabelProp="category_name"
          options={documentType}
        ></Select>
      ),
    },
    {
      title: '下达资金（万元）',
      dataIndex: 'fund_amount',
      key: 'fund_amount',
      align: 'center',
      width: 120,
      render: (value: any) => {
        return parseFloat(value / 10000).toFixed(2);
      },
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      hideInSearch: true,
      width: 80,
      render: (__: any, record: any) => (
        <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          <Button
            size="small"
            type="link"
            onClick={() => {
              jump2Detail(record, 0);
            }}
          >
            查看
          </Button>
          <Button
            size="small"
            type="link"
            onClick={() => {
              jump2Detail(record, 1);
            }}
          >
            编辑
          </Button>
        </div>
      ),
    },
  ];

  const jump2Detail = (record: any, editable: any) => {
    const { id } = record;
    history.push({
      pathname: '/fund/detail',
      query: {
        id,
        editable,
      },
    });
  };
  const initAction = () => {
    commitGlobalBread([
      {
        title: '资金管理',
      },
      {
        title: '资金使用',
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
    getDocumentType();
  }, []);

  const getDocumentType = () => {
    Apis.fetchPolicyCategoryList().then((res) => {
      if (res.data[1] && res.data[1].get_parent_do) {
        res.data[1].get_parent_do.push({
          category_name: '竞争性财政支农项目',
          id: 14,
        });
      }
      setDocumentType(res.data);
    });
  };

  const searchHandler = (rawValues: any) => {
    // console.log('rawValues', rawValues);
    setParams({
      keywords: rawValues.title,
      article_type: rawValues.category_name,
    });
  };

  const dataHandler = (result: any) => {
    setData(result);
    return result;
  };

  return (
    <div style={{ height: '100%' }}>
      <SearchForm columns={columns} onSubmit={searchHandler} />
      <div className={styles.tableWraper}>
        <StandardTable
          params={params}
          dataFetcherFn={getDocumentList}
          dataHandlerFn={dataHandler}
          columns={columns}
          data={data}
          ref={tableRef}
        />
      </div>
    </div>
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(Users);
