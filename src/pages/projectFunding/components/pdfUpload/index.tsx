import React, { useState, useEffect } from 'react';
import { message, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Apis from '@/utils/apis';

interface ImgProps {
  values: any;
  getPdfData: any;
  disabled?: boolean;
}

const ImgUpload: React.FC<ImgProps> = (props) => {
  const { values, getPdfData, disabled, noRestriction = false } = props;
  const [pdfUrl, setPdfUrl] = useState<Array<any>>([values]);
  const [imgPre, setImgPre] = useState(
    'https://jiangshan-tzyjs-img.zjsszxc.com/',
  );
  const [uploadBtnShow, setUploadBtnShow] = useState(
    values.length > 0 ? false : true,
  );
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState({});
  useEffect(() => {
    setPdfUrl(values);
    setUploadBtnShow(values.length > 0 ? false : true);
  }, [values.length]);

  // 预览
  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src) {
    } else {
      window.open(src);
    }
  };
  // img 上传 props
  const imgUploadProps: any = {
    fileList: pdfUrl,
    accept: '.pdf,.doc,.docx,.rar,.jpeg,.png,.zip,.jpg',
    onPreview,
    onRemove: (file: any) => {
      let Index = pdfUrl.findIndex((ele) => {
        return ele.uid == file.uid;
      });
      pdfUrl.splice(Index, 1);
      setPdfUrl(pdfUrl);
      getPdfData(pdfUrl);
      setUploadBtnShow(true);
      setLoading(false);
    },
    beforeUpload: (file: any) => {
      setLoading(true);
      if (!noRestriction) {
        // const isPdf =
        //   file.type === 'application/pdf' ||
        //   file.type == 'application/msword' ||
        //   file.type ==
        //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        //   file.type === 'application/zip' ||
        //   file.type === 'application/x-zip' ||
        //   file.type === 'application/x-zip-compressed' ||
        //   file.type === 'multipart/x-zip' ||
        //   file.type === 'application/x-rar' ||
        //   file.type === 'application/octet-stream' ||
        //   file.type === 'application/x-compress' ||
        //   file.type === 'application/x-compressed' ||
        //   file.type === 'image/jpeg' ||
        //   file.type === 'image/png';
        // if (!isPdf) {
        //   message.error('只能上传 PDF/WORD/RAR/ZIP/JPG/PNG 格式!');
        //   setLoading(false);
        //   return false;
        // }
        const isLt1M = file.size / 1024 / 1024 > 20;
        if (isLt1M) {
          message.error('体积不能超过 20MB!');
          setLoading(false);
          return false;
        }
      }
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const form = new FormData();
        form.append('file', file);
        // form.append('is_multi', 1);
        Apis.uploadImages(form)
          .then((res) => {
            if (res && res.code === 0) {
              let arr = [
                ...pdfUrl,
                {
                  url: `${imgPre}${res.data.img_url}`,
                  name: file.name,
                  uid: Date.now(),
                },
              ];
              setLoading(false);
              setPdfUrl(arr);
              getPdfData(arr);
              setUploadBtnShow(false);
            } else {
              setLoading(false);
            }
          })
          .catch((err) => {
            setLoading(false);
          });
      };
      return false;
    },
  };
  useEffect(() => {}, []);
  return (
    <>
      <Upload {...imgUploadProps} disabled={loading}>
        {pdfUrl.length >= 5 ? null : (
          <Button
            icon={<UploadOutlined />}
            loading={loading}
            disabled={loading || disabled}
          >
            点击上传
          </Button>
        )}
      </Upload>
      {!noRestriction && (
        <p className="img-remark" style={{ marginTop: '10px' }}>
          支持扩展名：.rar .zip .doc .docx .pdf .jpg
          .png，且大小不超过20M，最多上传5个
        </p>
      )}
    </>
  );
};
ImgUpload.defaultProps = {
  disabled: false,
};

export default ImgUpload;
