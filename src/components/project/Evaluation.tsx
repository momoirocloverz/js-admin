import React, { useEffect, useState, Fragment } from 'react';
import {
  getEvaluationReportDetails,
  getHistory,
  resolveEvaluation,
  makeProjectYsWord,
} from '@/api/projects';
import { Button, Image, Input, message, Modal, Table, Space, Form } from 'antd';
import ImgsViewer from 'react-images-viewer';
import styles from './index.less';
import FilesUploader from '@/components/form/filesUploader';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { last, parseImageString } from '@/utils/common';
import SectionHeader from '@/components/form/SectionHeader';
import { actionTypes } from '@/pages/application/const';
import FileList from '@/components/form/FileList';
import EvalRequestForm from '../form/templates/EvalRequestForm';
import SummaryForm from '@/components/form/templates/SummaryForm';
import CompletionReport from '@/components/form/templates/CompletionReport';
import EvalMaterials from '@/components/form/templates/EvalMaterials';
import Comparison from '@/components/form/templates/Comparison';
import InfoCardList from '@/components/form/InfoCardList';
const fileListCustomFieldNames = {
  fileName: 'origin_name',
  extension: 'suffix',
};
function ViewBtn({ source, width = 800, component, loading }) {
  return (
    <div style={{ padding: '20px' }}>
      <Button
        loading={loading}
        disabled={!(source?.length > 0)}
        type="primary"
        onClick={() => {
          Modal.info({
            width,
            icon: null,
            okText: '关闭',
            content: React.createElement(component, {
              data: last(source)?.history_content ?? {},
            }),
            // <EvalRequestForm
            //   data={
            //     last(source)?.history_content ?? {}
            //   }
            // />
          });
        }}
      >
        {loading ? '读取中' : source?.length > 0 ? '查看' : '未递交'}
      </Button>
      {source?.length > 0 && (
        <div style={{ color: 'darkgray', fontSize: 12, margin: '4px 0' }}>
          上次更新: {last(source)?.created_at}
        </div>
      )}
    </div>
  );
}

export default function Evaluation({ id, userId }: any) {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [debugMode] = useState(false);
  const [formRef] = Form.useForm();
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currImg, setCurrImg] = useState(0);
  const [link, setLink] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEdit2Modal, setShowEdit2Modal] = useState(false);
  const [showEdit3Modal, setShowEdit3Modal] = useState(false);
  const [showEdit1Modal, setShowEdit1Modal] = useState(false);
  const [showEdit4Modal, setShowEdit4Modal] = useState(false);
  const [pdflink, setPdflink] = useState('');
  const [littleForm] = Form.useForm();
  const [operateAble, setOperateAble] = useState(false);
  const [files, setFiles] = useState([]);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [viewerArray, setViewerArray] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const docIcon =
    'https://img.hzanchu.com/acimg/18b4db2f0a34e503869c5ea5e515f24b.png';
  const docxIcon =
    'https://img.hzanchu.com/acimg/baf327802e8e5536d75a619da1e41703.png';
  const rarIcon =
    'https://img.hzanchu.com/acimg/21f96594470ebf4190f90b7a313207f1.png';
  const pdfIcon =
    'https://img.hzanchu.com/acimg/55b8d7dceaca8e5d8526f32dc8c8d603.png';
  const zipIcon =
    'https://img.hzanchu.com/acimg/35fc02369154eb26c99f0dac911c850b.png';
  const xlsxIcon =
    'https://img.hzanchu.com/acimg/2850bd929723576ff53afd3315b5fd40.png';
  const xlsIcon =
    'https://img.hzanchu.com/acimg/2d28f8877e8b0a3194b4f2fcfcbcfac2.png';
  const wpsIcon =
    'https://img.hzanchu.com/acimg/744ca05e5f8b341d2199be5c8aa3896b.png';
  const csvIcon =
    'https://img.hzanchu.com/acimg/8e0f2b1cd0de448ca444d0af1c3b35eb.png';

  const imgIconFilter = (ele: any) => {
    if (ele) {
      let eleArr = ele.split('.');
      let suffix = eleArr[eleArr.length - 1];
      let part =
        suffix.toUpperCase() == 'PNG' ||
        suffix.toUpperCase() == 'JPG' ||
        suffix.toUpperCase() == 'JPEG'
          ? ele
          : suffix.toUpperCase() == 'ZIP'
          ? zipIcon
          : suffix.toUpperCase() == 'RAR'
          ? rarIcon
          : suffix.toUpperCase() == 'PDF'
          ? pdfIcon
          : suffix.toUpperCase() == 'DOC' || suffix.toUpperCase() == 'KSWPS'
          ? docIcon
          : suffix.toUpperCase() == 'DOCX' || suffix.toUpperCase() == 'DOCUMENT'
          ? docxIcon
          : suffix.toUpperCase() == 'XLSX'
          ? xlsxIcon
          : suffix.toUpperCase() == 'XLS'
          ? xlsIcon
          : suffix.toUpperCase() == 'CSV'
          ? csvIcon
          : suffix.toUpperCase() == 'WPS'
          ? wpsIcon
          : '';
      let obj = part;
      return obj;
    }
  };

  useEffect(() => {
    let processResult = true;
    setLoading(true);
    getEvaluationReportDetails(id)
      .then((result) => {
        if (processResult) {
          if (result.code === 0) {
            setData(result.data.id ? result.data : {});
          } else {
            throw new Error(result.msg);
          }
        }
      })
      .catch((e) => {
        message.error(`验收信息读取失败: ${e.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
    getHistory({ project_id: id, record_type: 3 })
      .then((result) => {
        if (processResult) {
          if (result.code === 0) {
            setHistoryData(result.data?.list || []);
          } else {
            throw new Error(result.msg);
          }
        }
      })
      .catch((e) => {
        message.error(`操作历史读取失败: ${e.message}`);
      });
    return () => {
      processResult = false;
    };
  }, [id]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('tempMarkEva1');
    };
  }, []);

  const submit = async (actionType: number, content: string) => {
    if (!content) {
      message.warning('请填写验收意见');
      return Promise.reject();
    }
    try {
      const result = await resolveEvaluation({
        project_id: data.project_id,
        action_type: actionType,
        ys_suggest: content,
      });
      if (result.code === 0) {
        message.success('操作成功');
      } else {
        throw new Error(result.msg);
      }
    } catch (e) {
      message.error(`操作失败: ${e.message}`);
      return Promise.reject(e.message);
    }
  };
  const canUseForm1 = (() => {
    // 项目验收状态 0=项目验收未验收(相当于验收材料未填写) 1=项目验收待审核 2=项目验收已验收 9=项目验收不通过
    return [1, 9].includes(data.ys_status) && userId == data.policy.toString();
  })();

  const historyTableColumns: any = [
    {
      title: '操作类型',
      dataIndex: 'action_type',
      align: 'center',
      render: (text, record) => actionTypes[record.action_type],
    },
    {
      title: '操作人',
      dataIndex: 'action_username',
      align: 'center',
    },
    {
      title: '操作时间',
      dataIndex: 'created_at',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'action_content',
      align: 'center',
    },
  ];
  const popSelect = () => {
    let track = sessionStorage.getItem('tempMarkEva1');
    if (track) {
      setShowEdit2Modal(true);
    } else {
      setShowEditModal(true);
    }
    formRef.resetFields();
  };

  const handleEdit2Ok = () => {
    setShowEdit2Modal(false);
  };
  const handleEdit2Cancel = () => {
    setShowEdit2Modal(false);
  };

  const handleEditOk = () => {
    formRef.validateFields().then((values: any) => {
      makeProjectYsWord({
        ys_code: values.ys_code,
        project_id: id,
      })
        .then((res) => {
          if (res && res.code == 0) {
            message.success('操作成功');
            sessionStorage.setItem('tempMarkEva1', '1');
            setShowEditModal(false);
            let processResult = true;
            getEvaluationReportDetails(id)
              .then((result) => {
                if (processResult) {
                  if (result.code === 0) {
                    setData(result.data.id ? result.data : {});
                  } else {
                    throw new Error(result.msg);
                  }
                }
              })
              .catch((e) => {
                message.error(`验收信息读取失败: ${e.message}`);
              })
              .finally(() => {
                setLoading(false);
              });
          } else {
            message.error(`操作失败: ${res.msg}`);
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    });
  };
  const handleEditCancel = () => {
    setShowEditModal(false);
    formRef.resetFields();
  };
  const handleEdit3Ok = () => {
    setShowEdit3Modal(false);
  };
  const handleEdit3Cancel = () => {
    setShowEdit3Modal(false);
  };
  const popPreview = () => {
    setShowEdit3Modal(true);
  };
  const handleEdit1Ok = () => {
    setShowEdit1Modal(false);
  };
  const handleEdit1Cancel = () => {
    setShowEdit1Modal(false);
  };
  const downloadCurrent = () => {
    const ele = document.createElement('a');
    ele.setAttribute('href', data.yszl_url);
    ele.setAttribute('download', 'download');
    ele.click();
  };

  const outer = (e, ele) => {
    if (ele) {
      let eleArr = ele.split('.');
      let suffix = eleArr[eleArr.length - 1];
      let isImg =
        suffix.toUpperCase() == 'PNG' ||
        suffix.toUpperCase() == 'JPG' ||
        suffix.toUpperCase() == 'JPEG';
      let isPdf = suffix.toUpperCase() === 'PDF';
      let isWord =
        suffix.toUpperCase() === 'DOC' || suffix.toUpperCase() === 'DOCX';
      if (isImg) {
        setViewerArray([{ src: ele }]);
        setViewerIsOpen(true);
      } else if (isPdf) {
        setPdflink(ele);
        setShowEdit1Modal(true);
      } else if (isWord) {
        //
        setLink(ele);
        setShowEdit4Modal(true);
      }
    }
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

  const handleEdit4Ok = () => {
    setShowEdit4Modal(false);
  };
  const handleEdit4Cancel = () => {
    setShowEdit4Modal(false);
  };
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const watchUploading = (val: any) => {
    setButtonDisable(val);
  };
  const fileChange = (value) => {
    setFiles(value);
    littleForm.setFieldsValue({
      attachment: value,
    });
  };

  return (
    <div className={styles.projectForm}>
      <div className={styles.evaluationItems}>
        <h3 className={styles.itemTitle}>申报材料</h3>
        <div>
          <SectionHeader title="局财政支农项目验收申请书" />
          <ViewBtn
            source={data.project_ys_finance_application_history_list}
            component={EvalRequestForm}
            loading={loading}
          />
        </div>
        {/*-------------------------------------------------------------*/}
        <div>
          <SectionHeader title="项目实施工作总结（提纲）" />
          <ViewBtn
            source={data.project_ys_work_summary_history_list}
            component={SummaryForm}
            loading={loading}
          />
        </div>
        {/*/!*-------------------------------------------------------------*!/*/}
        <div>
          <SectionHeader title="完成情况对比表" />
          <ViewBtn
            source={data.project_ys_complete_compare_history_list}
            width={1200}
            component={CompletionReport}
            loading={loading}
          />
        </div>
        {/*/!*-------------------------------------------------------------*!/*/}
        <div>
          <SectionHeader title="竣工验收示意图" />
          <ViewBtn
            source={data.project_ys_completed_sketch_history_list}
            component={EvalMaterials}
            loading={loading}
          />
        </div>
        {/*/!*-------------------------------------------------------------*!/*/}
        <div>
          <SectionHeader title="实施前后对照图片" />
          <ViewBtn
            source={data.project_ys_comparison_pic_history_list}
            component={Comparison}
            loading={loading}
          />
        </div>

        <div>
          <SectionHeader title="购置设备" />
          <InfoCardList
            width={'100px'}
            list={last(
              data.project_ys_comparison_pic_history_list,
            )?.history_content?.gz_content_list.map((e: any) => ({
              id: e.gz_desc,
              cover: (
                <Image
                  preview={{ visible: false }}
                  src={parseImageString(imgIconFilter(e.gz_pic))}
                  width={100}
                  onClick={(h) => {
                    outer(h, e.gz_pic);
                  }}
                />
              ),
              desc: e.gz_desc,
            }))}
          />
          <InfoCardList
            width={'100px'}
            list={last(
              data.project_ys_comparison_pic_history_list,
            )?.history_content?.gz_content_list.map((e: any) => ({
              id: e.nameplate_desc,
              cover: (
                <Image
                  preview={{ visible: false }}
                  src={parseImageString(imgIconFilter(e.nameplate_pic))}
                  width={100}
                  onClick={(h) => {
                    outer(h, e.nameplate_pic);
                  }}
                />
              ),
              desc: e.nameplate_desc,
            }))}
          />
        </div>

        <div>
          <SectionHeader title="项目审计报告" />
          <FileList
            list={data.project_ys_audit_report_list ?? []}
            customFieldNames={fileListCustomFieldNames}
          />
        </div>
        <div>
          <SectionHeader title="财务凭证复印件" />
          <FileList
            list={data.project_ys_financial_list ?? []}
            customFieldNames={fileListCustomFieldNames}
          />
        </div>
        <div>
          <SectionHeader title="项目其他相关材料" />
          <FileList
            list={data.project_ys_other_materials_list ?? []}
            customFieldNames={fileListCustomFieldNames}
          />
        </div>
        <h3 className={styles.itemTitle}>操作记录</h3>
        <Table
          size="small"
          columns={historyTableColumns}
          dataSource={historyData}
          pagination={{
            pageSize: 5,
          }}
          rowKey="id"
        />
      </div>
      <div className={styles.actionCol}>
        <div className={styles.stickyItem}>
          <h4 className={styles.fakeRequired}>验收意见：</h4>
          <Input.TextArea
            disabled={!debugMode && !canUseForm1}
            value={data.ys_suggest}
            onChange={(e) => setData({ ...data, ys_suggest: e.target.value })}
            autoSize={{ minRows: 5 }}
          />
          <Space className={styles.row}>
            <Button
              disabled={!debugMode && !canUseForm1}
              danger
              onClick={() => {
                submit(9, data.ys_suggest).then(() => {
                  setData({ ...data, ys_status: 9 });
                });
              }}
            >
              驳回
            </Button>
            <Button
              disabled={!debugMode && !canUseForm1}
              type="primary"
              onClick={() => {
                submit(1, data.ys_suggest).then(() => {
                  setData({ ...data, ys_status: 2 });
                });
              }}
            >
              通过
            </Button>
          </Space>
        </div>
        {data && data.ys_status == 2 ? (
          <div className={styles.center}>
            <Button type="primary" onClick={() => popSelect()}>
              {sessionStorage.getItem('tempMarkEva1')
                ? '查看验收资料'
                : '生成验收资料'}
            </Button>
          </div>
        ) : null}
        <>
          <FilesUploader
            watchUploading={watchUploading}
            max={8}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xlsx,.wps,.csv,.xls,.zip,.rar"
            disabled={operateAble}
            value={files}
            onChange={(value) => fileChange(value)}
          />
          <div className={styles.infoText}>
            支持扩展名：.rar .zip .doc .docx .pdf .jpg,且大小不超过20M
          </div>
        </>
      </div>
      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showEditModal}
        title={'验收资料编码设置'}
        width={500}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        footer={[
          <Button key="12" onClick={handleEditCancel}>
            取消
          </Button>,
          <Button key="su2bmit" type="primary" onClick={handleEditOk}>
            确定
          </Button>,
        ]}
      >
        <Form
          className={styles.formModal}
          form={formRef}
          name="nest-messages"
          labelAlign={'left'}
          labelCol={{ span: 14 }}
        >
          <Form.Item
            label="农业专项资金项目竣工验收报告编码"
            name="ys_code"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input maxLength={30} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showEdit2Modal}
        title={'验收资料编码设置'}
        width={500}
        onOk={handleEdit2Ok}
        onCancel={handleEdit2Cancel}
        footer={[
          <Button key="su2bmit" type="primary" onClick={handleEdit2Ok}>
            确定
          </Button>,
        ]}
      >
        <Form
          className={styles.formModal}
          form={formRef}
          name="nest-messages"
          labelAlign={'left'}
          labelCol={{ span: 14 }}
        >
          <Form.Item label="农业专项资金项目竣工验收报告">
            <div className={styles.center}>
              <Button type="text" onClick={() => popPreview()}>
                预览
              </Button>
              <Button type="text" onClick={() => downloadCurrent()}>
                下载
              </Button>
              {/* <Button type="text">上传</Button> */}
            </div>
          </Form.Item>
        </Form>
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
          <iframe
            width="100%"
            className={styles.innerIframe}
            height="520"
            src={
              'https://view.officeapps.live.com/op/view.aspx?src=' +
              data.yszl_url
            }
          ></iframe>
        </div>
      </Modal>

      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showEdit1Modal}
        title={'预览'}
        width={1200}
        onOk={handleEdit1Ok}
        onCancel={handleEdit1Cancel}
        footer={[
          <Button key="su2bmit" type="primary" onClick={handleEdit1Ok}>
            确定
          </Button>,
        ]}
      >
        <div className={styles.Example__container__document}>
          <Document file={pdflink} onLoadSuccess={onDocumentLoadSuccess}>
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
      </Modal>

      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showEdit4Modal}
        title={'预览'}
        width={1200}
        onOk={handleEdit4Ok}
        onCancel={handleEdit4Cancel}
        footer={[
          <Button key="su2bmit" type="primary" onClick={handleEdit4Ok}>
            确定
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
}
