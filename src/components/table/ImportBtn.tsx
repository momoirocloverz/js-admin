import { Button, message, notification, List } from 'antd';
import React, { useRef, useState } from 'react';
import { getApiParams, getLocalToken } from '@/utils/utils';
import { PUBLIC_KEY } from '@/services/api';
import { ALL_API } from '@/services/api';

const token = getLocalToken();

export default function ImportBtn({ btnText, api, params, onSuccess, method }) {
  const [isImporting, setIsImporting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File | undefined | null) => {
    if (!file) {
      return;
    }
    setIsImporting(true);
    const formData = new FormData();
    const headers = new Headers();
    headers.append('authorization', token ?? '');
    formData.append('file', file);
    const data = getApiParams(params, PUBLIC_KEY);
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));

    fetch(`${ALL_API}/${api}`, {
      headers,
      method,
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code === 0) {
          if (result?.data?.error_count > 0) {
            notification.warn({
              message: '导入成功',
              description: (
                <List
                  dataSource={result?.data?.error_list ?? []}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              ),
              placement: 'bottomRight',
              duration: 0,
            });
          } else {
            message.success('导入成功');
            if (typeof onSuccess === 'function') {
              onSuccess();
            }
          }
        } else {
          switch (result.code) {
            case 3999: {
              message.warn(`导入成功: ${result.msg}`);
              if (typeof onSuccess === 'function') {
                onSuccess();
              }
              break;
            }
            default:
              throw new Error(result.msg);
          }
        }
      })
      .catch((error) => {
        message.error(`导入失败: ${error.message}`);
      })
      .finally(() => {
        setIsImporting(false);
        // 同文件不会触发上传
      });
  };

  return (
    <Button
      type="primary"
      loading={isImporting}
      onClick={() => inputRef.current?.click()}
    >
      {isImporting ? '正在导入...' : btnText}
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => {
          upload(e.target?.files?.[0]);
        }}
      />
    </Button>
  );
}
ImportBtn.defaultProps = {
  btnText: '导入',
  params: {},
  onSuccess: () => {},
  method: 'POST',
};
