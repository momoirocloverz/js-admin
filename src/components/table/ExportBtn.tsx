import React, { useState } from 'react';
import { Button, message } from 'antd';
import { downloadAs } from '@/utils/genenal';

type DownloadObject = {
  name: string;
  mimeType: string;
};
type ExportBtnProps = {
  tableType?: string;
  params: object;
  func?: (params: object) => Promise<unknown>;
  customDownloadObject?: DownloadObject;
};

function ExportButton({ params, func, customDownloadObject }: ExportBtnProps) {
  const [isExporting, setIsExporting] = useState(false);
  const handleClick = async () => {
    try {
      setIsExporting(true);
      const result = await func({ ...params, asFile: 1 });
      downloadAs(
        result,
        customDownloadObject?.name ??
          `${new Date().toLocaleString()}导出记录.xls`,
        customDownloadObject?.mimeType ?? 'application/vnd.ms-excel',
      );
    } catch (e) {
      message.error(`导出失败: ${e.message}`);
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <Button type="primary" onClick={handleClick} loading={isExporting}>
      导出
    </Button>
  );
}
ExportButton.defaultProps = {
  tableType: '',
  func: undefined,
  customDownloadObject: undefined,
};

export default React.memo(ExportButton);
