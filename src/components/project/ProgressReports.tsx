import React, { useEffect, useRef, useState } from 'react';
import StandardTable, { TableRef } from '@/components/table/StandardTable';
import { RawResponseObj } from '@/components/system/useNav';
import { getProgressReports } from '@/api/projects';
import { parseImageArrayString } from '@/utils/common';
import ImageCarousel from '../table/ImageCarousel';
import { Tooltip } from 'antd';

export default function ProgressReports({ id }) {
  const [data, setData] = useState<RawResponseObj[]>([]);
  const [params, setParams] = useState({ project_id: id });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const tableRef = useRef<TableRef>();

  const columns: any = [
    {
      title: '时间',
      dataIndex: 'created_at',
      align: 'center',
      hideInSearch: true,
      width: 140,
    },
    {
      title: '本年计划投资(万元)',
      dataIndex: 'this_year_amount',
      align: 'center',
      hideInSearch: true,
      width: 100,
      render: (value: any, record: any, index: any) => {
        return <span>{record.this_year_amount || '-'}</span>;
      },
    },
    {
      title: '本年形象进度',
      dataIndex: 'this_year_progress_of_works',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (value: any, record: any, index: any) => {
        return <span>{record.this_year_progress_of_works || '-'}</span>;
      },
    },
    {
      title: '当月投资金额(万元)',
      dataIndex: 'this_month_amount',
      align: 'center',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '问题描述',
      dataIndex: 'content',
      align: 'center',
      hideInSearch: true,
      width: 120,
      render: (value: any, record: any, index: any) => {
        return <span>{record.content || '无'}</span>;
      },
    },
    {
      title: '累计完成投资金额(万元)',
      dataIndex: 'total_amount',
      align: 'center',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '工程形象进度',
      dataIndex: 'progress_of_works',
      align: 'center',
      width: 200,
      hideInSearch: true,
      render: (value: any, record: any, index: any) => {
        return (
          <Tooltip placement="top" title={value}>
            <div className='longContentTd'>{value}</div>
          </Tooltip>
        );
      },
    },
    {
      title: '滞后原因',
      dataIndex: 'lag_reason',
      align: 'center',
      hideInSearch: true,
      width: 120,
      render: (value: any, record: any, index: any) => {
        return <span>{record.lag_reason || '无'}</span>;
      },
    },
    {
      title: '协调情况',
      dataIndex: 'coordination_condition',
      align: 'center',
      hideInSearch: true,
      width: 100,
      render: (value: any, record: any, index: any) => {
        return <span>{record.coordination_condition || '无'}</span>;
      },
    },
    {
      title: '工作建议',
      dataIndex: 'work_suggest',
      align: 'center',
      hideInSearch: true,
      width: 100,
      render: (value: any, record: any, index: any) => {
        return <span>{record.work_suggest || '无'}</span>;
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      hideInSearch: true,
      width: 120,
      render: (value: any, record: any, index: any) => {
        return <span>{record.remark || '无'}</span>;
      },
    },
    {
      title: '图片',
      dataIndex: 'image',
      align: 'center',
      width: 200,
      hideInSearch: true,
      render: (text) => <ImageCarousel src={parseImageArrayString(text)} />,
    },
  ];

  const dataHandler = (result: any) => {
    setData(result);
  };

  useEffect(() => {}, [id]);

  return (
    <div style={{ height: '100%', padding: '16px', boxSizing: 'border-box' }}>
      <StandardTable
        params={params}
        dataFetcherFn={getProgressReports}
        dataHandlerFn={dataHandler}
        columns={columns}
        data={data}
        dataField={null}
        ref={tableRef}
        scroll={{x: 'max-content'}}
      />
    </div>
  );
}
