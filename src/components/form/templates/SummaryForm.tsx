import styles from './basicForm.less';
import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useState,
  Fragment,
} from 'react';
import { Button, Modal } from 'antd';
import ImgsViewer from 'react-images-viewer';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
export default function SummaryForm({ data = {} }) {
  const [files, setFiles] = useState(0);
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

  useEffect(() => {
    if (data.attachment) {
      let after = JSON.parse(data.attachment);
      after.forEach((ele) => {
        ele.suffix = ele.name.split('.')[ele.name.split('.').length - 1];
      });
      setFiles(after);
    }
  }, []);
  const previewImages = (item: any = []) => {
    if (item) {
      let isImg =
        item.suffix.toUpperCase() == 'PNG' ||
        item.suffix.toUpperCase() == 'JPG' ||
        item.suffix.toUpperCase() == 'JPEG';

      let isPdf = item.suffix.toUpperCase() === 'PDF';
      let isWord =
        item.suffix.toUpperCase() === 'DOC' ||
        item.suffix.toUpperCase() === 'DOCX';

      if (isImg) {
        setViewerArray([{ src: item.url, name: item.name }]);
        setViewerIsOpen(true);
      } else if (isPdf) {
        setPdflink(item.url);
        setShowEdit2Modal(true);
      } else if (isWord) {
        //
        setLink(item.url);
        setShowEdit3Modal(true);
      }
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

  const imgIconFilter = (ele) => {
    if (ele) {
      let part =
        ele.suffix.toUpperCase() == 'PNG' ||
        ele.suffix.toUpperCase() == 'JPG' ||
        ele.suffix.toUpperCase() == 'JPEG'
          ? ele.url
          : ele.suffix.toUpperCase() == 'ZIP'
          ? zipIcon
          : ele.suffix.toUpperCase() == 'RAR'
          ? rarIcon
          : ele.suffix.toUpperCase() == 'PDF'
          ? pdfIcon
          : ele.suffix.toUpperCase() == 'DOC' ||
            ele.suffix.toUpperCase() == 'KSWPS'
          ? docIcon
          : ele.suffix.toUpperCase() == 'DOCX' ||
            ele.suffix.toUpperCase() == 'DOCUMENT'
          ? docxIcon
          : ele.suffix.toUpperCase() == 'XLSX'
          ? xlsxIcon
          : ele.suffix.toUpperCase() == 'XLS'
          ? xlsIcon
          : ele.suffix.toUpperCase() == 'CSV'
          ? csvIcon
          : ele.suffix.toUpperCase() == 'WPS'
          ? wpsIcon
          : '';
      let obj = part;
      return obj;
    }
  };
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    <article className={styles.article}>
      <h1 className={styles.articleTitle}>项目实施工作总结（提纲）</h1>
      <article>
        <h3>前言</h3>
        <p>{data.foreword}</p>
        <h3>一、项目建设计划</h3>
        <p>{data.build_plan_content}</p>
        <h3>二、项目预期目标</h3>
        <p>{data.expected_goal_content}</p>
        <h3>三、项目建设计划完成情况</h3>
        <p>{data.build_plan_complete_content}</p>
        <h3>四、项目建设取得的成效</h3>
        <p>{data.build_achievement_content}</p>
        <h3>五、项目存在的问题及一下打算</h3>
        <p>{data.problem_intend_content}</p>
        {files && files.length ? <h3>六、相关附件</h3> : null}
        {files && files.length ? (
          <div className={styles.previewDialogCon}>
            {files &&
              files.length &&
              files.map((item: any, index: any) => (
                <div
                  key={index}
                  className={styles.previewCon}
                  onClick={() => previewImages(item)}
                >
                  <img
                    className={styles.previewImg}
                    src={imgIconFilter(item)}
                  />
                  <div className={styles.previewName}>
                    <span>{item.name}</span>
                  </div>
                </div>
              ))}
          </div>
        ) : null}
      </article>

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
    </article>
  );
}
