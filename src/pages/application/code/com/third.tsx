import React, { useEffect, useMemo, useState } from 'react';
import {
  Tabs,
  Form,
  Input,
  Button,
  Table,
  Pagination,
  message,
  Space,
  Modal,
} from 'antd';
import APIs from '@/utils/apis';
import styles from './third.less';
import { getImage } from '@/utils/common';
import { connect, history, useLocation } from 'umi';
const Details = (props: any) => {
  const { accountInfo, dispatch, children, project_code } = props;
  const location = useLocation();
  const [dataArray, setDataArray] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showEdit3Modal, setShowEdit3Modal] = useState(false);
  const [link, setLink] = useState(
    'https://jiangshan-tzyjs-img.zjsszxc.com/dev/jiangshan_tzyjs/a98c4d0e638e00cc0a5e997834cab98bp202208221653175757227321js_ztqkhzb%282%29.xlsx',
  );
  const popPreview = (item: any) => {
    // setLink( item.xxxx )
    setShowEdit3Modal(true);
  };
  const typeMap = (res: any) => {
    console.log(res.type);
    let map = {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        '.xlsx',
      'application/vnd.ms-excel': '.xls',
      'application/zip': '.zip',
      'application/x-7z-compressed': '.7z',
      'text/plain': '.txt',
      'application/x-rar-compressed': '.rar',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        '.pptx',
      'application/vnd.ms-powerpoint': '.ppt',
      'application/pdf': '.pdf',
      'image/png': '.png',
      'image/jpeg': '.jpg',
      'image/gif': '.gif',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        '.docx',
      'application/msword': '.doc',
      'image/bmp': '.bmp',
    };
    return map[res.type];
  };
  const toDownload = (item: any) => {
    // let temp =
    // 'https://img.anchumall.cn/test/2d19cf1f7a41074565250489588a16e1.png';
    // window.location.href = 'https://img.anchumall.cn/test/2d19cf1f7a41074565250489588a16e1.png';
    // window.location.href = 'https://ningbo-xcdn.oss-cn-hangzhou.aliyuncs.com/live/enterprise/????????????/?????????/????????????/?????????????????????.jpg';
    let data = {
      file_path: item.file_path,
    };
    APIs.projectFmFilePath(data)
      .then((res1) => {
        if (res1 && res1.code == 0) {
          // window.open();
          let url = res1.data.file_url;
          // window.open(url)
          window.open(url, '_blank');
          // const promise = getImage(url).then((res: any) => {
          //   let end = typeMap(res);
          //   const fileName = item.approval_title + Date.now() + end;
          //   if ('download' in document.createElement('a')) {
          //     const elink = document.createElement('a');
          //     elink.download = fileName;
          //     elink.style.display = 'none';
          //     elink.href = URL.createObjectURL(res);
          //     document.body.appendChild(elink);
          //     elink.click();
          //     URL.revokeObjectURL(elink.href); // ??????URL ??????
          //     document.body.removeChild(elink);
          //   } else {
          //     navigator.msSaveBlob(res, fileName);
          //   }
          // });
        } else {
          message.error(res1.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const columns = [
    {
      title: '??????',
      dataIndex: 'name',
      align: 'center',
      width: 70,
      render: (_: any, record: any, index: any) => {
        return <div>{index + 1}</div>;
      },
    },
    {
      title: '??????????????????',
      dataIndex: 'item_code',
      align: 'center',
      render: (_: any, record: any) => {
        return <span>{record.item_code || '-'}</span>;
      },
    },
    {
      title: '??????????????????',
      dataIndex: 'item_name',
      align: 'center',
      render: (_: any, record: any) => {
        return <span>{record.item_name || '-'}</span>;
      },
    },
    {
      title: '????????????',
      dataIndex: 'approval_number',
      align: 'center',
      render: (_: any, record: any) => {
        return <span>{record.approval_number || '-'}</span>;
      },
    },
    {
      title: '??????????????????',
      dataIndex: 'approval_title',
      align: 'center',
      render: (_: any, record: any) => {
        return <span>{record.approval_title || '-'}</span>;
      },
    },
    {
      title: '??????????????????',
      dataIndex: 'current_state',
      align: 'center',
      render: (_: any, record: any) => {
        return <span>{record.current_state || '-'}</span>;
      },
    },
    {
      title: '??????????????????',
      dataIndex: 'dept_name',
      align: 'center',
      render: (_: any, record: any) => {
        return <span>{record.dept_name || '-'}</span>;
      },
    },
    // {
    //   title: '????????????',
    //   dataIndex: 'file_path',
    //   align: 'center',
    //   width: 120,
    //   render: (_: any, record: any) => {
    //     return <span>{record.file_path || '-'}</span>;
    //   },
    // },
    {
      title: '?????????????????????',
      dataIndex: 'validity_date',
      align: 'center',
      render: (_: any, record: any) => {
        return <span>{record.validity_date || '-'}</span>;
      },
    },
    {
      title: '??????',
      dataIndex: 'address',
      align: 'center',
      render: (_: any, record: any) => (
        <Space size="middle">
          {/* <a onClick={() => popPreview(record)}>??????</a> */}
          <a onClick={() => toDownload(record)}>??????</a>
        </Space>
      ),
    },
  ];
  const fetchDetail = () => {
    let data = {
      project_code: project_code,
    };
    setLoading(true);
    APIs.projectFmgetInfoSxList(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          if (res.data && res.data.list && res.data.list.length) {
            setDataArray(res.data.list);
          } else {
            setDataArray([]);
          }
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (project_code) {
      fetchDetail();
    }
    return () => {};
  }, [project_code]);
  // useEffect(() => {
  //   if (project_code) {
  //     fetchDetail();
  //   }
  // }, [current, pagesize]);
  const showTotal = (total: number) => {
    return `??? ${total} ???`;
  };
  const onPagChange = (e: any) => {
    setCurrent(e);
    console.log('e', e);
  };
  const onSizeChange = (current: any, size: any) => {
    setPagesize(size);
  };
  const handleEdit3Ok = () => {
    setShowEdit3Modal(false);
  };
  const handleEdit3Cancel = () => {
    setShowEdit3Modal(false);
  };
  return (
    <div className={styles.page}>
      <Table
        key="3"
        size="small"
        columns={columns}
        rowKey={(item) => item.approval_itemid}
        dataSource={dataArray}
        pagination={false}
        loading={loading}
        scroll={{ y: 630 }}
        bordered
      />
      {/* <Pagination
        size="small"
        className={styles.pagination}
        total={total}
        current={current}
        pageSize={pagesize}
        showTotal={showTotal}
        showSizeChanger={true}
        onChange={onPagChange}
        onShowSizeChange={onSizeChange}
      /> */}
      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showEdit3Modal}
        title={'??????'}
        width={1200}
        onOk={handleEdit3Ok}
        onCancel={handleEdit3Cancel}
        footer={[
          <Button key="su2bmit" type="primary" onClick={handleEdit3Ok}>
            ??????
          </Button>,
        ]}
      >
        <div>
          <iframe
            width="100%"
            className={styles.innerIframe}
            height="520"
            src={'https://view.officeapps.live.com/op/view.aspx?src=' + link}
          ></iframe>
        </div>
      </Modal>
    </div>
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(Details);
