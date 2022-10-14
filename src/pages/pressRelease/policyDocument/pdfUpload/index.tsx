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
  const uploadPath = (path: any, file: any) => {
    return `${path}/${file.name.split('.')[0]}-${file.uid}.${
      file.type.split('/')[1]
    }`;
  };

  useEffect(() => {
    setPdfUrl(values);
    setUploadBtnShow(values.length > 0 ? false : true);
  }, [values.length]);

  // 预览
  const onPreview = async (file: any) => {
    let src = file.url;
    console.log('src', src);
    if (!src) {
      // src = await new Promise((resolve) => {
      //   const reader = new FileReader();
      //   reader.readAsDataURL(file.originFileObj);
      //   reader.onload = () => resolve(reader.result);
      // });
    } else {
      window.open(src);
    }
  };

  // img 上传 props
  const imgUploadProps: any = {
    accept: '.pdf,.doc,.docx',
    listType: 'picture-card',
    fileList: pdfUrl,
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
        //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        // console.log(file.type);
        // if (!isPdf) {
        //   message.error('只能上传 PDF/WORD 格式!');
        //   setLoading(false);
        //   return false;
        // }
        const isLt1M = file.size / 1024 / 1024 > 50;
        if (isLt1M) {
          message.error('体积不能超过 50MB!');
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
              // let _arr = [
              //   {
              //     url: `${imgPre}${res.data.img_url}`,
              //     type: file.type,
              //     name: file.name,
              //     status: undefined,
              //     uid: Date.now(),
              //     result: res.data.img_url,
              //   },
              // ];
              // pdfUrl.push({
              //   url: `${imgPre}${res.data.img_url}`,
              //   type: file.type,
              //   name: file.name,
              //   status: undefined,
              //   uid: Date.now(),
              //   result: res.data.img_url,
              // });
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
      {/* disabled={loading || disabled} */}
      <Upload {...imgUploadProps} disabled={loading}>
        {/* {uploadBtnShow ? (
          <>
            <Button
              icon={<UploadOutlined />}
              loading={loading}
              disabled={loading || disabled}
            >
              点击上传
            </Button>
          </>
        ) : null} */}
        {pdfUrl.length >= 8 ? null : (
          <Button
            icon={<UploadOutlined />}
            loading={loading}
            style={{
              width: '100px',
              border: 'none',
              backgroundColor: '#fafafa',
              boxShadow: 'none',
            }}
            disabled={loading || disabled}
          >
            点击上传
          </Button>
        )}
      </Upload>
      {!noRestriction && (
        <p className="img-remark">
          只能上传pdf/word格式文件，且大小不超过50M，最多上传8个
        </p>
      )}
    </>
  );
};
ImgUpload.defaultProps = {
  disabled: false,
};

export default ImgUpload;
