import React, { useRef, useState } from 'react';
import StandardTable, { TableRef } from '@/components/table/StandardTable';
import { getNavs, removeNav } from '@/api/system';
import { Modal, Button, message, Select, Avatar } from 'antd';
import AuthWrapper from '@/components/auth/authWrapper';
import {
  CalculatorFilled,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import SearchForm from '@/components/table/SearchForm';
import NavModal from '@/components/system/NavModal';
import { findNavs, fixNavs, RawResponseObj } from '@/components/system/useNav';
import ImgsViewer from 'react-images-viewer';
import { getFeedbacks, markAsResolved, markResolved } from '@/api/feedbacks';
import Styles from './index.less';

export default function Feedbacks() {
  const [data, setData] = useState<RawResponseObj[]>([]);
  const [params, setParams] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const tableRef = useRef<TableRef>();
  const [viewerArray, setViewerArray] = useState([]);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currImg, setCurrImg] = useState(0);
  const clickThumbnail = (item) => {
    setCurrImg(item);
  };
  const gotoPrevious = () => {
    setCurrImg(currImg - 1);
  };
  const gotoNext = () => {
    setCurrImg(currImg + 1);
  };
  const closeViewer = () => {
    setViewerIsOpen(false);
  };
  const popImgPreview = (item) => {
    let newImgArray = item.img.map((ele) => {
      return {
        src: ele,
      };
    });

    setCurrImg(0);
    setViewerIsOpen(true);
    setViewerArray(newImgArray);
  };
  const columns: any = [
    {
      title: '反馈内容',
      dataIndex: 'content',
      align: 'center',
      hideInSearch: true,
      width: 300,
    },
    {
      title: '反馈时间',
      dataIndex: 'created_at',
      align: 'center',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '联系方式',
      dataIndex: 'mobile',
      align: 'center',
      width: 200,
      hideInSearch: true,
    },
    {
      title: '图片',
      dataIndex: 'mobile',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (_, record) => {
        if (record.img&&record.img.length) {
          return <img onClick={()=>popImgPreview(record)} src={record.img[0] + '?x-oss-process=image/resize,l_300'} width={100} height={100} />
        } else {
          return <div>暂无</div>
        }       
      },
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      hideInSearch: true,
      width: 300,
      render: (__, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <AuthWrapper mark={'/feedbacks-deal'}>
            <Button
              type="primary"
              ghost
              disabled={record.is_check === 2}
              onClick={() => {
                Modal.confirm({
                  content: `确认标记已处理?`,
                  icon: <ExclamationCircleOutlined />,
                  onOk: async () => {
                    try {
                      const result = await markAsResolved(record.id);
                      if (result.code === 0) {
                        message.success('标记成功!');
                        tableRef.current?.reload();
                      } else {
                        throw new Error(result.msg);
                      }
                    } catch (e) {
                      message.error(`标记失败: ${e.message}!`);
                    }
                  },
                });
              }}
            >
              {record.is_check === 2 ? '已处理' : '标记已处理'}
            </Button>
          </AuthWrapper>
          {/*<Button*/}
          {/*  size="small"*/}
          {/*  type="link"*/}
          {/*  onClick={() => {*/}
          {/*    Modal.confirm({*/}
          {/*      content: `确认删除"${record.name}"?`,*/}
          {/*      icon: <ExclamationCircleOutlined />,*/}
          {/*      onOk: async () => {*/}
          {/*        try {*/}
          {/*          const result = await removeNav(record.id);*/}
          {/*          if(result.code === 0) {*/}
          {/*            message.success('删除成功!');*/}
          {/*            tableRef.current?.reload();*/}
          {/*          } else {*/}
          {/*            throw new Error(result.msg)*/}
          {/*          }*/}
          {/*        } catch (e) {*/}
          {/*          message.error(`删除失败: ${e.message}!`);*/}
          {/*        }*/}
          {/*      },*/}
          {/*    });*/}
          {/*  }}*/}
          {/*>*/}
          {/*  删除*/}
          {/*</Button>*/}
        </div>
      ),
    },
  ];

  const dataHandler = (result: any) => {
    setData(result);
  };

  return (
    <div className={Styles.tableCon}>
      {/*<div*/}
      {/*  style={{*/}
      {/*    display: 'flex',*/}
      {/*    flexDirection: 'row-reverse',*/}
      {/*    backgroundColor: 'white',*/}
      {/*    padding: '10px',*/}
      {/*    columnGap: '5px',*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Button*/}
      {/*    type="primary"*/}
      {/*    onClick={() => {*/}
      {/*      setSelectedRow({ action: 'create', pid: 0, type: 1 });*/}
      {/*      setIsModalVisible(true);*/}
      {/*    }}*/}
      {/*    icon={<PlusOutlined />}*/}
      {/*  >*/}
      {/*    新建导航*/}
      {/*  </Button>*/}
      {/*</div>*/}
      <StandardTable
        params={params}
        dataFetcherFn={getFeedbacks}
        dataHandlerFn={dataHandler}
        columns={columns}
        data={data}
        ref={tableRef}
      />
                 <ImgsViewer
        imgs={viewerArray}
        onClickThumbnail={clickThumbnail}
        showThumbnails={true}
        currImg={currImg}
        isOpen={viewerIsOpen}
        onClickPrev={gotoPrevious}
        onClickNext={gotoNext}
        onClose={closeViewer}
      />
    </div>
  );
}
