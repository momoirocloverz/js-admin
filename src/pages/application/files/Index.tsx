import React, { useRef, useState, useEffect, Fragment } from 'react';
import {
  Button,
  Switch,
  Space,
  Modal,
  message,
  Form,
  Input,
  DatePicker,
} from 'antd';
import {
  fileIssuedList,
  fileIssuedRemove,
  fileIssuedAction,
} from '@/api/projects';
import MediaUploader from '@/components/form/MediaUploader';
import { history, useActivate, connect } from 'umi';
import ImgsViewer from 'react-images-viewer';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import styles from './index.less';
import AuthWrapper from '@/components/auth/authWrapper';
import ProTable, { ActionType } from '@ant-design/pro-table';
import moment from 'moment';
import { getImage } from '@/utils/common';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
const Payments = (props: any) => {
  const { dispatch } = props;
  const tableRef = useRef<ActionType>();
  const [downloading, setDownloading] = useState(false);
  const [form] = Form.useForm();
  const [editVisible, setEditVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [modalDisable, setModalDisable] = useState(false);
  const [current, setCurrent] = useState({});
  const [showEdit3Modal, setShowEdit3Modal] = useState(false);
  const [showEdit4Modal, setShowEdit4Modal] = useState(false);
  const [viewerArray, setViewerArray] = useState([]);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currImg, setCurrImg] = useState(0);
  const [link, setLink] = useState('');
  const [pdfLink, setPdfLink] = useState('');
  const [isPdf, setIsPdf] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };
  const initAction = () => {
    commitGlobalBread([
      {
        title: '投资项目管理',
      },
      {
        title: '文件下达专区',
      },
    ]);
  };
  useEffect(() => {
    initAction();
  }, []);
  useActivate(() => {
    initAction();
    tableRef.current?.reload();
  });
  const toPreview = (item: any) => {
    window.open(item, '_blank');
  };
  const downloadTrigger = (record: any) => {
    if (record && record.attachment) {
      if (downloading) {
        //
      } else {
        const zip = new JSZip();
        let promises: any = [];
        record.attachment.forEach((file: any) => {
          const promise = getImage(file.url).then((res: any) => {
            const fileName = file.name;
            zip.file(fileName, res, { binary: true });
          });
          promises.push(promise);
        });
        Promise.all(promises)
          .then(() => {
            zip
              .generateAsync({
                type: 'blob',
                compression: 'DEFLATE', // STORE：默认不压缩 DEFLATE：需要压缩
                compressionOptions: {
                  level: 1, // 压缩等级1~9    1压缩速度最快，9最优压缩方式
                },
              })
              .then((res: any) => {
                FileSaver.saveAs(res, '附件.zip'); // 利用file-saver保存文件
                setDownloading(false);
              });
          })
          .catch(() => {
            setDownloading(false);
          })
          .finally(() => {
            setDownloading(false);
          });
      }
    } else {
      //
    }
  };
  const popDetail = (item: any) => {
    setTitle('详情');
    setModalDisable(true);
    setCurrent(item);
    form.setFieldsValue({
      project_name: item.project_name,
      issued_at: moment(item.issued_at),
      attachment: item.attachment,
    });
    setEditVisible(true);
  };
  const popEdit = (item: any) => {
    setEditVisible(true);
    setTitle('编辑下达文件');
    setModalDisable(false);
    setCurrent(item);
    form.setFieldsValue({
      id: item.id,
      project_name: item.project_name,
      issued_at: moment(item.issued_at),
      attachment: item.attachment,
    });
    setEditVisible(true);
  };
  const popDelete = (item: any) => {
    const { id } = item;
    Modal.confirm({
      content: '删除后不可撤回，是否确认删除？',
      centered: true,
      onOk: async () => {
        const result: any = await fileIssuedRemove({ id });
        if (result.code == 0) {
          message.success('删除成功');
          tableRef.current?.reload();
        } else {
          message.warning(result.msg);
        }
      },
      onCancel: async () => {},
    });
  };
  const popNew = () => {
    setTitle('新增下达文件');
    setModalDisable(false);
    setCurrent({});
    form.setFieldsValue({
      project_name: '',
      issued_at: '',
      attachment: [],
    });
    setEditVisible(true);
  };
  const onCancel = () => {
    setEditVisible(false);
  };
  const onConfirm = () => {
    if (modalDisable) {
      setEditVisible(false);
    } else {
      form
        .validateFields()
        .then((res) => {
          let data = {
            project_name: res.project_name,
            issued_at: moment(res.issued_at).format('YYYY-MM-DD HH:mm:ss'),
            attachment: res.attachment.map((ele: any) => {
              return {
                name: ele.name,
                url: ele.url,
              };
            }),
          };
          if (current && current.id) {
            data.id = current.id;
            Modal.confirm({
              content: ' 修改不可撤回，是否确认修改？',
              centered: true,
              onOk: async () => {
                const result: any = await fileIssuedAction(data);
                if (result.code == 0) {
                  message.success('编辑成功');
                  tableRef.current?.reload();
                  setEditVisible(false);
                } else {
                  message.warning(result.msg);
                }
              },
              onCancel: async () => {},
            });
          } else {
            //新增
            fileIssuedAction(data)
              .then((res) => {
                if (res && res.code == 0) {
                  message.success('新增成功');
                  tableRef.current?.reload();
                  setEditVisible(false);
                }
              })
              .catch((err) => {
                console.log('err', err);
              });
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  };
  const checkPreview = (item: any) => {
    if (item.attachment) {
      item.attachment.forEach((ele) => {
        ele.suffix = ele.name.split('.')[ele.name.split('.').length - 1];
      });
    }
    setCurrent(item);
    setShowEdit4Modal(true);
  };
  const columns: any = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      width: 100,
      hideInSearch: true,
    },
    {
      title: '项目名称',
      dataIndex: 'project_name',
      key: 'search_project_name',
      width: 300,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '内容查询',
      dataIndex: 'project_name',
      key: 'search_project_name',
      width: 300,
      align: 'center',
      hideInTable: true,
    },
    {
      title: '日期区间',
      key: 'search_issued_ats',
      dataIndex: 'createdAtRange',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '下达文件',
      dataIndex: 'order_amount',
      align: 'center',
      hideInSearch: true,
      render: (__: any, record: any) => {
        return (
          <>
            {/* className={styles.attachmentName}
             */}
            {record.attachment.map((v: any, index: any) => (
              <div key={index}>
                <div>{v.name}</div>
              </div>
            ))}
          </>
        );
      },
    },
    {
      title: '下达时间',
      dataIndex: 'issued_at',
      align: 'center',
      hideInSearch: true,
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'get_project_ys',
      align: 'center',
      width: 300,
      hideInSearch: true,
      render: (__: any, record: any) => {
        return (
          <>
            <Space>
              <div
                className={`${styles.darker}`}
                onClick={() => popDetail(record)}
              >
                详情
              </div>
              <div
                className={`${styles.darker}`}
                onClick={() => popEdit(record)}
              >
                编辑
              </div>
              <div
                className={`${styles.red}`}
                onClick={() => popDelete(record)}
              >
                删除
              </div>
              <div
                className={`${styles.darker}`}
                onClick={() => downloadTrigger(record)}
              >
                下载
              </div>
              <div
                className={`${styles.darker}`}
                onClick={() => checkPreview(record)}
              >
                预览
              </div>
            </Space>
          </>
        );
      },
    },
  ];
  const jump2Reserve = (id: any) => {
    history.push({
      pathname: '/application/projectReserveDetail',
      query: { id },
    });
  };
  const loadData = async (rawParams: any) => {
    const { current: page, pageSize: pagesize, ...rest } = rawParams;
    const params = {
      ...rest,
      page,
      pagesize,
      current: undefined,
    };
    if (params && params.search_issued_ats) {
      params.search_issued_ats = [
        params.search_issued_ats[0] + ' 00:00:00',
        params.search_issued_ats[1] + ' 23:59:59',
      ];
    }
    const result = await fileIssuedList(params);
    let final = [];
    result.data.data.forEach((ele: any, index: any) => {
      ele.index = index + 1;
    });
    final = result.data.data;
    tableRef?.current?.clearSelected?.();
    return {
      data: final,
      total: result?.data?.total,
    };
  };
  const handleEdit3Ok = () => {
    setShowEdit3Modal(false);
  };
  const handleEdit3Cancel = () => {
    setShowEdit3Modal(false);
  };
  const handleEdit4Ok = () => {
    setShowEdit4Modal(false);
  };
  const handleEdit4Cancel = () => {
    setShowEdit4Modal(false);
  };
  const popPreview = (item: any) => {
    // setLink(item.sss);
    setShowEdit3Modal(true);
  };
  const clickThumbnail = (item: any) => {
    setCurrImg(item);
  };

  const gotoPrevious = () => {
    setCurrImg(currImg - 1);
  };
  const gotoNext = () => {
    setCurrImg(currImg + 1);
  };
  const checkType = (item) => {
    console.log(item);
    let isImg =
      item.suffix.toUpperCase() == 'PNG' ||
      item.suffix.toUpperCase() == 'JPG' ||
      item.suffix.toUpperCase() == 'JPEG';
    let isPDF = item.suffix.toUpperCase() == 'PDF';
    let isOffice =
      item.suffix.toUpperCase() == 'DOC' ||
      item.suffix.toUpperCase() == 'DOCX' ||
      item.suffix.toUpperCase() == 'XLSX' ||
      item.suffix.toUpperCase() == 'XLS' ||
      item.suffix.toUpperCase() == 'PPTX' ||
      item.suffix.toUpperCase() == 'PPT';
    setIsPdf(false);
    setShowEdit3Modal(false);
    setViewerIsOpen(false);
    if (isImg) {
      setViewerArray([{ src: item.url, name: item.name }]);
      setViewerIsOpen(true);
    } else if (isPDF) {
      setShowEdit3Modal(true);
      setIsPdf(true);
      setPdfLink(item.url);
    } else if (isOffice) {
      setShowEdit3Modal(true);
      setIsPdf(false);
      setLink(item.url);
    } else {
      window.open(item.url, '_blank');
    }
  };
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    <div style={{ minHeight: '100%' }}>
      <ProTable
        tableStyle={{ margin: '0 20' }}
        columns={columns}
        actionRef={tableRef}
        request={loadData}
        toolBarRender={() => [
          <Button
            type="primary"
            className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
            onClick={() => popNew()}
          >
            新增
          </Button>,
        ]}
        options={false}
        revalidateOnFocus={false}
        rowKey="id"
      />
      <Modal
        title={title}
        maskClosable={false}
        visible={editVisible}
        width={450}
        centered
        onCancel={onCancel}
        onOk={onConfirm}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="项目名称"
            name="project_name"
            rules={[{ required: true, message: '请填写项目名称' }]}
          >
            <Input
              placeholder="请填写项目名称"
              maxLength={20}
              disabled={modalDisable}
            />
          </Form.Item>
          <Form.Item
            label="文件下达时间"
            name="issued_at"
            rules={[{ required: true, message: '请填写文件下达时间' }]}
          >
            <DatePicker showTime disabled={modalDisable} />
          </Form.Item>
          <Form.Item
            label="下达文件"
            name="attachment"
            rules={[{ required: true, message: '请上传下达文件' }]}
          >
            <MediaUploader disabled={modalDisable} max={5} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showEdit4Modal}
        title={'选择'}
        width={500}
        onOk={handleEdit4Ok}
        onCancel={handleEdit4Cancel}
        footer={[
          <Button key="su2bmit" type="primary" onClick={handleEdit4Ok}>
            关闭
          </Button>,
        ]}
      >
        <div>
          <>
            {current.attachment &&
              current.attachment.map((item: any, index: any) => (
                <div
                  key={index}
                  className={styles.attachmentName}
                  onClick={() => checkType(item)}
                >
                  <div>{item.name}</div>
                </div>
              ))}
          </>
        </div>
      </Modal>

      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showEdit3Modal}
        title={'预览'}
        width={1200}
        onOk={handleEdit3Ok}
        onCancel={handleEdit3Cancel}
        footer={[
          <Button key="su2bmit" type="primary" onClick={handleEdit3Ok}>
            确定
          </Button>,
        ]}
      >
        <div>
          {!isPdf ? (
            <iframe
              width="100%"
              className={styles.innerIframe}
              height="520"
              src={'https://view.officeapps.live.com/op/view.aspx?src=' + link}
            ></iframe>
          ) : (
            <div className={styles.Example__container__document}>
              <Document file={pdfLink} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (el, index) => (
                  <Fragment key={index + 9999999}>
                    <Page
                      loading={'加载中...'}
                      width={1000}
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                    />
                    <div className={styles.pagCon}>
                      第{index + 1}页 总{numPages}页
                    </div>
                  </Fragment>
                ))}
              </Document>
            </div>
          )}
        </div>
      </Modal>
      <ImgsViewer
        imgs={viewerArray}
        onClickThumbnail={clickThumbnail}
        showThumbnails={true}
        currImg={currImg}
        isOpen={viewerIsOpen}
        onClickPrev={gotoPrevious}
        onClickNext={gotoNext}
        onClose={() => setViewerIsOpen(false)}
      />
    </div>
  );
};
export default connect(({ baseModel }) => ({ baseModel }))(Payments);
