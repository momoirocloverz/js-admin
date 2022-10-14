import { message, Upload } from 'antd';
import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { uploadImage } from '@/api/common';
import {
  RcFile as OriRcFile,
  UploadRequestOption as RcCustomRequestOptions,
  UploadProps as RcUploadProps,
} from 'rc-upload/lib/interface';
import SimpleCropper from '@/components/system/simpleCropper';
export interface RcFile extends OriRcFile {
  readonly lastModifiedDate: Date;
}
import {
  generateThumbnail,
  MEDIA_STORE_ENDPOINT,
  getExtension,
} from '@/utils/common';
const TYPES = [
  'png',
  'jpg',
  'jpeg',
  'doc',
  'docx',
  'pdf',
  'xlsx',
  'wps',
  'csv',
  'xls',
  'zip',
  'rar',
];
function fileListReducer(state: any, action: any) {
  switch (action.type) {
    case 'add': {
      return [...state, action.item];
    }
    case 'remove': {
      return state.filter((file) => file.uid !== action.uid);
    }
    case 'set': {
      if (!(state.length === 0 && action.item.length === 0)) {
        return action.item;
      }
      return state;
    }
    case 'modifyItem': {
      const newState = [...state];
      const obj = newState.find((file) => file.uid === action.uid);
      if (obj) {
        Object.assign(obj, action.item);
        return newState;
      }
      return state;
    }
    case 'clear': {
      return [];
    }
    default:
      return state;
  }
}

export default function MediaUploader({
  value = null,
  onChange = () => {},
  max = 1,
  accept = '*',
  disabled = false,
  watchUploading = () => {},
  cropperConfig = null,
  beforeUpload = () => {},
}: {
  value?: any;
  onChange?: Function;
  max?: number;
  accept?: string;
  disabled?: boolean;
  watchUploading?: Function;
  cropperConfig?: any;
  beforeUpload?: Function;
}) {
  const [fileList, dispatch] = useReducer(
    fileListReducer,
    Array.isArray(value) ? value : [],
  );
  const [initialRender, setInitialRender] = useState(true);

  const currentListSizeRef = useRef(Array.isArray(value) ? value.length : 0);
  const [cropperWorkQueue, setCropperWorkQueue] = useState<
    {
      src: string | File;
      promise: Promise<File>;
      name: string;
      uid: string;
      resolve: (value: any) => void;
      reject: (reason?: any) => void;
    }[]
  >([]);
  const currentCropperContext = useMemo(() => {
    return {
      visible: cropperWorkQueue.length > 0,
      cropSrc: cropperWorkQueue[0]?.src,
      name: cropperWorkQueue[0]?.name,
      uid: cropperWorkQueue[0]?.uid,
      resolve: cropperWorkQueue[0]?.resolve,
      reject: cropperWorkQueue[0]?.reject,
    };
  }, [cropperWorkQueue]);

  useEffect(() => {
    if (!initialRender) {
      onChange(fileList);
    }
    setInitialRender(false);
  }, [fileList]);

  useEffect(() => {
    if (!initialRender) {
      dispatch({
        type: 'set',
        item: Array.isArray(value) ? value : [],
      });
    }
  }, [value]);

  const manualUpload = async (file: RcFile, list: RcFile[]) => {
    // if (!TYPES.includes(getExtension(file.name).toLowerCase())) {
    //   return message.error('文件格式不正确');
    // }
    const isLt1M = file.size / 1024 / 1024 > 20;
    if (isLt1M) {
      message.error('体积不能超过 20MB!');
      return false;
    }
    let potentiallyModifiedFile: RcFile;
    try {
      potentiallyModifiedFile = await (beforeUpload?.(file, list) ?? file);
      // 处理图片裁剪
      if (cropperConfig) {
        const newQueueEntry: Partial<typeof cropperWorkQueue[0]> = {
          src: file,
          promise: undefined,
          name: file.name,
          uid: file.uid,
        };
        const promise = new Promise<RcFile>((res, rej) => {
          newQueueEntry.resolve = res;
          newQueueEntry.reject = rej;
        });
        newQueueEntry.promise = promise;
        setCropperWorkQueue((queue) => [
          ...queue,
          newQueueEntry as typeof cropperWorkQueue[0],
        ]);
        potentiallyModifiedFile = await promise;
      }
    } catch (e) {
      currentListSizeRef.current -= 1;
      return Promise.reject();
    }
    dispatch({
      type: 'add',
      item: {
        name: potentiallyModifiedFile.name,
        uid: potentiallyModifiedFile.uid,
        status: 'uploading',
      },
    });
    try {
      // const result = {}
      watchUploading(true);
      const result: any = await uploadImage(potentiallyModifiedFile);
      if (result.code === 0) {
        dispatch({
          type: 'modifyItem',
          uid: potentiallyModifiedFile.uid,
          item: {
            thumbUrl: `${MEDIA_STORE_ENDPOINT}/${generateThumbnail(
              result.data.img_url,
            )}`,
            url: `${MEDIA_STORE_ENDPOINT}/${result.data.img_url}`,
            status: 'done',
          },
        });
        watchUploading(false);
      } else {
        watchUploading(false);
        throw new Error(result.msg || '其他错误');
      }
    } catch (e: any) {
      watchUploading(false);
      dispatch({
        type: 'modifyItem',
        uid: file.uid,
        item: {
          status: 'error',
        },
      });
      message.error(e.message);
    }
    return Promise.reject();
  };

  const uploadText = useMemo(() => {
    if (max > 1) {
      return (
        <>
          + 上传
          <br />
          {`(限制${max}个)`}
        </>
      );
    }
    return '+ 上传';
  }, [max]);

  return (
    <>
      <Upload
        listType="picture-card"
        accept={accept || '*'}
        fileList={fileList}
        maxCount={max}
        disabled={disabled}
        beforeUpload={manualUpload}
        onRemove={(file) => {
          dispatch({
            type: 'remove',
            uid: file.uid,
          });
        }}
      >
        {fileList?.length < max && !disabled && uploadText}
      </Upload>
      {cropperConfig && (
        <SimpleCropper
          accept="image/*"
          title={cropperConfig.title ?? '裁剪图片'}
          context={currentCropperContext}
          visible={currentCropperContext.visible}
          onCancel={() => setCropperWorkQueue(cropperWorkQueue.slice(1))}
          onOk={() => setCropperWorkQueue(cropperWorkQueue.slice(1))}
          aspect={cropperConfig.aspectRatio}
        />
      )}
    </>
  );
}
