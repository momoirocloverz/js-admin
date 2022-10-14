import styles from './detail.less';
import Apis from '@/utils/apis';
import { connect } from 'umi';
import { useEffect, useState } from 'react';
import { message, Form } from 'antd';
import ImgsViewer from 'react-images-viewer';
import AuditDetail from './components/AuditDetail';
import AuditRecord from './components/AuditRecord';
import AuditApproval from './components/AuditApproval';

const PolicyDocumentPage = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [currentDetail, setCurrentDetail] = useState({});
  const [townList, setTownList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [cropList, setCropList] = useState([]);
  const [viewerArray, setViewerArray] = useState([]);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currImg, setCurrImg] = useState(0);
  const [typeForm, setTypeForm] = useState(21);
  const [loading, setLoading] = useState(false);
  const [approvalRecord, setApprovalRecord] = useState([]);

  const initAction = () => {
    commitGlobalBread([
      {
        title: '惠农补贴管理',
        triggerOn: true,
      },
      {
        title: '粮油适度规模经营补贴审核',
      },
    ]);
  };
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };
  const initRequest = () => {
    if (location.query.id) {
      let data = {
        id: location.query.id,
      };
      Apis.fetchProjectSubDetail(data)
        .then((res: any) => {
          if (res && res.code === 0) {
            let shorter = res.data.info;
            let subInfo = shorter.sub_info;
            // console.log('subInfo', subInfo);
            setCurrentDetail(shorter);
            setCropList(subInfo.crop_list);
            setTypeForm(shorter.form_type);
            Apis.fetchAreaList({})
              .then((res: any) => {
                if (res && res.code === 0) {
                  setTownList(res.data.list);
                  let track1 = res.data.list[0].children.find((ele) => {
                    return ele.id == subInfo.bg_town_id;
                  });
                  if (track1) {
                    let track2 = track1.children.find((ele) => {
                      return ele.id == subInfo.bg_village_id;
                    });
                    setAreaList([{ name: '江山市' }, track1, track2]);
                  }
                } else {
                  message.error(res.msg);
                }
              })
              .catch((err) => {
                console.log('err', err);
              });
          } else {
            message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(' err ', err);
        });
    }
  };

  useEffect(() => {
    initAction();
    initRequest();
    getApprovalRecord();
  }, []);

  // 获取审核记录
  const getApprovalRecord = () => {
    Apis.fetchDeclarationRecordList({
      project_id: location.query.id,
      record_type: 11,
    })
      .then((res) => {
        setApprovalRecord(res.data.list);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 显示附件
  const showAttachment = (attachment: any) => {
    if (attachment && attachment.length && JSON.stringify(attachment) != '{}') {
      setCurrImg(0);
      setViewerIsOpen(true);
      setViewerArray(
        attachment.map((v: any) => {
          return { src: v };
        }),
      );
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

  const closeViewer = () => {
    setViewerIsOpen(false);
  };

  return (
    <div className={styles.homePageCon}>
      <div className={styles.leftCon}>
        <AuditDetail
          currentDetail={currentDetail}
          cropList={cropList}
          areaList={areaList}
        />
        <AuditRecord
          approvalRecord={approvalRecord}
          loading={loading}
          showAttachment={showAttachment}
        />
      </div>

      <div className={styles.rightCon}>
        <AuditApproval
          currentDetail={currentDetail}
          location={location}
          initRequest={initRequest}
          showProcess={true}
        />
      </div>

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
};

export default connect((baseModel) => ({ baseModel }))(PolicyDocumentPage);
