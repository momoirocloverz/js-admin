import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, Form, Input, Button, message } from 'antd';
import APIs from '@/utils/apis';
import ImgsViewer from 'react-images-viewer';
import FilesUploader from '@/components/form/filesUploader';
import styles from './detail.less';
import Addon from './com/detail';
import Base from './com/base';
import Second from './com/second';
import Third from './com/third';
import { connect, history } from 'umi';
const { TabPane } = Tabs;
const { TextArea } = Input;
const Details = ({ location, ...all }) => {
  const { dispatch } = all;
  const [tabKey, setTabKey] = useState('1');
  const [viewerArray, setViewerArray] = useState([]);
  const [currImg, setCurrImg] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [littleForm] = Form.useForm();
  const [operateAble, setOperateAble] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [files, setFiles] = useState([]);
  const [globalData, setGlobalData] = useState({});
  const [tabTrigger, setTabTrigger] = useState(false);
  const [realId, setRealId] = useState('');
  const [statusMap, setStatusMap] = useState({
    1: '待审核',
    2: '可行',
    9: '不可行',
  });
  const [status, setStatus] = useState(1);
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };
  const breadCrumbsAction = () => {
    commitGlobalBread([
      {
        title: '投资项目管理',
      },
      {
        title: '项目赋码详情',
      },
    ]);
  };
  const checkTab = () => {
    if (location.query && location.query.tab) {
      setTabKey(location.query.tab);
    }
  };
  const checkAble = () => {
    if (location.query && location.query.able && location.query.able == '1') {
      setOperateAble(false);
      if (status == 1) {
        //
      } else {
        setOperateAble(true);
      }
    } else {
      setOperateAble(true);
    }
  };
  const fetchDetail = () => {
    APIs.projectFmInfo({ id: location.query.id })
      .then((res) => {
        if (res && res.code == 0) {
          if (res.data.info && res.data.info.id) {
            let shorter = res.data.info;
            if (shorter.from_source == 1) {
              setTabTrigger(true);
              setRealId(shorter.project_reserve_id);
            } else {
              setTabTrigger(false);
              setRealId('');
            }
            setStatus(shorter.status);
            setGlobalData(shorter);
            if (shorter.attachment && shorter.attachment.length) {
              let mixArray = shorter.attachment;
              littleForm.setFieldsValue({
                audit_reason: shorter.audit_reason,
                attachment: mixArray,
              });
              setFiles(mixArray);
            }
          }
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    breadCrumbsAction();
    checkAble();
    checkTab();
    fetchDetail();
    return () => {};
  }, []);
  useEffect(() => {
    checkAble();
  }, [status]);
  const popImgPreview = (item) => {
    let newImgArray = item.files.map((ele) => {
      return {
        src: ele,
      };
    });
    setCurrImg(0);
    setViewerIsOpen(true);
    setViewerArray(newImgArray);
  };
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
  const onFinish = (values) => {
    console.log('同意', values);
    let data: any = {
      id: location.query.id,
      status: 2,
      audit_reason: values.audit_reason,
      attachment: values.attachment
        ? values.attachment.map((ele) => {
            return {
              url: ele.url,
              name: ele.name,
            };
          })
        : [],
    };
    console.log('data', data);
    APIs.projectFmAudit(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          message.success('操作成功');
          fetchDetail();
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const submitAction = () => {
    console.log('拒绝');
    littleForm
      .validateFields()
      .then((res) => {
        let data = {
          id: location.query.id,
          status: 9,
          audit_reason: res.audit_reason,
          attachment: res.attachment
            ? res.attachment.map((ele) => {
                return {
                  url: ele.url,
                  name: ele.name,
                };
              })
            : [],
        };
        APIs.projectFmAudit(data)
          .then((res: any) => {
            if (res && res.code === 0) {
              message.success('操作成功');
              fetchDetail();
            } else {
              message.error(res.msg);
            }
          })
          .catch((err) => {
            console.log('err', err);
          });
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
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
    <div className={styles.page}>
      <div className={styles.leftCon}>
        <div className={styles.leftInnerCon}>
          <Tabs
            defaultActiveKey="1"
            activeKey={tabKey}
            onChange={(value) => {
              setTabKey(value);
              history.replace({
                pathname: '/invest/code/Detail',
                query: {
                  id: location.query.id,
                  tab: value,
                },
              });
            }}
          >
            {tabTrigger ? (
              <>
                <TabPane tab="储备申报信息" key="1">
                  {tabKey == '1' && <Addon realId={realId} />}
                </TabPane>
                <TabPane tab="基本信息" key="2">
                  {tabKey == '2' && <Base />}
                </TabPane>
                <TabPane tab="申报信息" key="3">
                  {tabKey == '3' && (
                    <Second project_code={globalData.project_code} />
                  )}
                </TabPane>
                <TabPane tab="事项信息" key="4">
                  {tabKey == '4' && (
                    <Third project_code={globalData.project_code} />
                  )}
                </TabPane>
              </>
            ) : (
              <>
                <TabPane tab="基本信息" key="1">
                  {tabKey == '1' && <Base />}
                </TabPane>
                <TabPane tab="申报信息" key="2">
                  {tabKey == '2' && (
                    <Second project_code={globalData.project_code} />
                  )}
                </TabPane>
                <TabPane tab="事项信息" key="3">
                  {tabKey == '3' && (
                    <Third project_code={globalData.project_code} />
                  )}
                </TabPane>
              </>
            )}
          </Tabs>
        </div>
        <div className={styles.leftStatus}>
          <div
            className={` ${styles.statuself}   ${
              status == 2 ? styles.successd : status == 9 ? styles.failed : ''
            }`}
          >
            {statusMap[status]}
          </div>
        </div>
      </div>
      <div className={styles.rightCon}>
        <Form
          form={littleForm}
          name="nest-messages"
          labelAlign={'left'}
          layout="vertical"
          onFinish={(values) => onFinish(values)}
        >
          <Form.Item
            name="audit_reason"
            label="审核意见"
            rules={[{ required: true, message: '审核意见不能为空' }]}
          >
            <TextArea
              rows={4}
              placeholder="请输入审核意见"
              disabled={operateAble}
            />
          </Form.Item>
          <Form.Item label="上传附件" name="attachment">
            {/* rules={[{ required: true, message: '附件不能为空' }]} */}
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
          </Form.Item>
          {!operateAble ? (
            <div className={styles.btnsFlex}>
              <Button
                type="primary"
                htmlType="submit"
                disabled={operateAble || buttonDisable}
              >
                可行
              </Button>
              <Button
                className={styles.marginLeft20}
                onClick={submitAction}
                disabled={operateAble || buttonDisable}
              >
                不可行
              </Button>
            </div>
          ) : null}
        </Form>
        {status != 1 ? <div>审批结果:{statusMap[status]}</div> : null}
      </div>
      {/* <ImgsViewer
        imgs={viewerArray}
        onClickThumbnail={clickThumbnail}
        showThumbnails={true}
        currImg={currImg}
        isOpen={viewerIsOpen}
        onClickPrev={gotoPrevious}
        onClickNext={gotoNext}
        onClose={closeViewer}
      /> */}
    </div>
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(Details);
