import React, { useEffect, useMemo, useState } from 'react';
import { Space, message } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import APIs from '@/utils/apis';
import styles from './second.less';
import editorConfig from '@/utils/tinymce_config';
import tinymce from 'tinymce';
import { connect, history, useLocation } from 'umi';
const Details = (props: any) => {
  const { accountInfo, dispatch, children, initValue, getContent } = props;
  const location = useLocation();
  const [editor2Ref, setEditor2Ref] = useState(null);
  const [imgPre, setImgPre] = useState(
    'https://jiangshan-tzyjs-img.zjsszxc.com/',
  );
  useEffect(() => {
    if (initValue && editor2Ref) {
      tinymce.activeEditor.setContent(initValue, {
        format: 'html',
      });
    }
  }, [initValue, editor2Ref]);
  const fetchDetail = () => {
    //
  };
  useEffect(() => {
    fetchDetail();
  }, []);

  const uploadImageCallBack = async (
    value: any,
    success: Function,
    fail: Function,
  ) => {
    const form = new FormData();
    form.append('file', value.blob());
    const res = await APIs.uploadImages(form);
    if (res && res.code === 0) {
      success(`${imgPre}${res.data.img_url}`);
    } else {
      message.error(res.msg);
      fail(res);
    }
  };
  const handleEditor2Change = (e: any) => {
    getContent(e);
  };
  return (
    <div>
      <Editor
        apiKey="3n4phtjjc1f71ldjf41wpymq5tg4hpc0vd0k0k8xha6ci89i"
        init={{
          ...editorConfig,
          images_upload_handler: uploadImageCallBack,
        }}
        onEditorChange={handleEditor2Change}
        tinymceScriptSrc={'/tinymce/js/tinymce/tinymce.min.js'}
        onInit={(evt, editor) => {
          setEditor2Ref(editor);
        }}
      />
    </div>
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(Details);
