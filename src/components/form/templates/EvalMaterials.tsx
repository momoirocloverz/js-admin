import { Carousel, Select, Image, Button, Modal } from 'antd';
import styles from './basicForm.less';
import React, {
  ReactElement,
  ReactNode,
  useMemo,
  useState,
  Fragment,
} from 'react';
import {
  guessFileName,
  parseImageArrayString,
  parseImageString,
} from '@/utils/common';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import ImgsViewer from 'react-images-viewer';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
type Description = {
  label?: string;
  desc?: string;
  customContent?: ReactNode;
};

function Description({
  label = '',
  desc = '',
  customContent = undefined,
}: Description) {
  return (
    <div className={styles.descriptionItem}>
      <span className={styles.label}>{label}：</span>
      <span className={styles.desc}>{customContent || desc}</span>
    </div>
  );
}

export default function EvalMaterials({ data }) {
  const [selected, setSelected] = useState(0);
  const [viewerArray, setViewerArray] = useState([]);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [currImg, setCurrImg] = useState(0);
  const [showEdit3Modal, setShowEdit3Modal] = useState(false);
  const [link, setLink] = useState('');
  const [pdflink, setPdflink] = useState('');
  const [showEdit2Modal, setShowEdit2Modal] = useState(false);
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
  const selectOptions = (data.content_list ?? []).map((__, idx) => ({
    value: idx,
    label: `竣工验收示意图${idx + 1}`,
  }));

  const currentItem = useMemo(() => {
    return data?.content_list?.[selected] ?? {};
  }, [data, selected]);
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

  const handleEdit3Ok = () => {
    setShowEdit3Modal(false);
  };
  const handleEdit3Cancel = () => {
    setShowEdit3Modal(false);
  };
  const handleEdit2Ok = () => {
    setShowEdit2Modal(false);
  };
  const handleEdit2Cancel = () => {
    setShowEdit2Modal(false);
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
        setShowEdit2Modal(true);
      } else if (isWord) {
        //
        setLink(ele);
        setShowEdit3Modal(true);
      }
    }
  };
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    <div className={styles.materialList}>
      <Select
        options={selectOptions}
        style={{ minWidth: '30ch', fontSize: '18px' }}
        value={selected}
        onChange={(e) => setSelected(e)}
      />
      <div className={styles.descList}>
        <Description label="实施单位" desc={currentItem.declare_unit} />
        <Description label="验收时间" desc={currentItem.check_complete_at} />
        <Description
          label="设备清单"
          customContent={
            <div style={{ display: 'flex', flexFlow: 'column' }}>
              {currentItem.facility_list
                ? parseImageArrayString(currentItem.facility_list).map(
                    (file) => (
                      <a href={file} target="_blank" key={file}>
                        📄{guessFileName(file)}
                      </a>
                    ),
                  )
                : null}
            </div>
          }
        />
        <Description label="实施地址" desc={currentItem.area_detail} />
        <Description
          label="示意图"
          customContent={
            <Carousel
              className={styles.cusCarousl2}
              arrows
              prevArrow={<LeftOutlined />}
              nextArrow={<RightOutlined />}
            >
              {/* src={parseImageString(p)} */}

              {/* fallback="data:image/png;base64,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" */}

              {/* // <Image
                //   key={index}
                //   className={styles.image}
                //   src={parseImageString(imgIconFilter(p))}
                // /> */}

              {currentItem.pic_list?.map((p, index) => (
                <Image
                  preview={{ visible: false }}
                  width={280}
                  src={parseImageString(imgIconFilter(p))}
                  onClick={(e) => {
                    outer(e, p);
                  }}
                />
              ))}
            </Carousel>
          }
        ></Description>
      </div>

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
            src={'https://view.officeapps.live.com/op/view.aspx?src=' + link}
          ></iframe>
        </div>
      </Modal>

      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showEdit2Modal}
        title={'预览'}
        width={1200}
        onOk={handleEdit2Ok}
        onCancel={handleEdit2Cancel}
        footer={[
          <Button key="su2bmit" type="primary" onClick={handleEdit2Ok}>
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
