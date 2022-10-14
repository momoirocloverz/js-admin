import styles from './basicForm.less';
import React, { ReactElement, ReactNode, useMemo, useState } from 'react';
import { Carousel, Select, Image, Button, Modal, Card } from 'antd';
const { Meta } = Card;
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import ImgsViewer from 'react-images-viewer';
import { Fragment } from 'react';
function Section({ data }) {
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
    <div className={styles.sectionWrapper}>
      <div className={styles.compareSection}>
        <div className={styles.comparedItem}>
          <h3 className={styles.itemHeader}>实施前</h3>
          {/* src={data.before_pic} */}
          <Image
            preview={{ visible: false }}
            className={styles.itemImage}
            src={imgIconFilter(data.before_pic)}
            onClick={(e) => {
              outer(e, data.before_pic);
            }}
          />
          <div className={styles.itemDesc}>{data.before_desc}</div>
        </div>
        {/* src={data.after_pic}    */}
        <div className={styles.comparedItem}>
          <h3 className={styles.itemHeader}>实施后</h3>
          <Image
            preview={{ visible: false }}
            className={styles.itemImage}
            src={imgIconFilter(data.after_pic)}
            onClick={(e) => {
              outer(e, data.after_pic);
            }}
          />
          <div className={styles.itemDesc}>{data.after_desc}</div>
        </div>
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

export default function Comparison({ data }) {
  return (
    <div className={styles.comparison}>
      {data?.ss_content_list?.map((e, i) => (
        <Section key={i} data={e} />
      ))}
    </div>
  );
}
