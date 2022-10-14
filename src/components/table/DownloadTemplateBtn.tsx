import React from 'react';
import { Button } from 'antd';

const downloadTemplate = (src) => {
  const link = document.createElement('a');
  link.href = src;
  link.download = '';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function DownloadTemplateBtn({ src }) {
  return (
    <Button type="primary" onClick={() => downloadTemplate(src)}>
      下载模板
    </Button>
  );
}
DownloadTemplateBtn.defaultProps = {};

export default React.memo(DownloadTemplateBtn);
