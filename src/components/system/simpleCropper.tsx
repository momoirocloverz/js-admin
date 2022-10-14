import { Button, Modal, ModalProps, Row, Upload, UploadProps } from 'antd';
import Cropper, { CropperProps } from 'react-easy-crop';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'react-easy-crop/react-easy-crop.css';
import { Area } from 'react-easy-crop/types';
import { RcFile } from 'antd/es/upload';
import { getType } from 'mime';
import { UploadOutlined } from '@ant-design/icons';

function isString(src: any): src is string {
  return typeof src === 'string';
}
function isFile(src: any): src is File {
  return src instanceof File;
}
// https://codesandbox.io/s/q8q1mnr01w?file=/src/cropImage.js
export const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.crossOrigin = 'Anonymous';
    image.src = url;
  });
export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}
/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export async function getCroppedImg(
  imageSrc: string,
  imageSrcType: string | undefined,
  pixelCrop: Area,
  rotation = 0,
  flip = { horizontal: false, vertical: false },
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation,
  );

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
  );

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0);

  // As Base64 string
  // return canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      resolve(file);
    }, imageSrcType);
  });
}

export type SimpleCropperProps = {
  context: {
    cropSrc: string | File;
    name: string;
    uid: string;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
  };
} & Pick<ModalProps, 'visible' | 'onCancel' | 'onOk' | 'title'> &
  Pick<CropperProps, 'aspect'> &
  Pick<UploadProps, 'accept'>;
export default function SimpleCropper({
  title,
  visible,
  onCancel,
  context,
  aspect,
  accept,
  onOk,
}: SimpleCropperProps) {
  const [srcImage, setSrcImage] = useState<string | undefined>();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area>();
  const [isWorking, setIsWorking] = useState(false);
  const cropperRef = useRef<Cropper>(null);
  const tempFileUrlRef = useRef<string>();

  const reset = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setArea(undefined);
  }, []);
  const updateTempFileRef = (file?: File) => {
    if (tempFileUrlRef.current) {
      URL.revokeObjectURL(tempFileUrlRef.current);
      tempFileUrlRef.current = undefined;
    }
    if (file) {
      tempFileUrlRef.current = URL.createObjectURL(file);
    }
  };

  useEffect(() => {
    if (isFile(context.cropSrc)) {
      updateTempFileRef(context.cropSrc);
      setSrcImage(tempFileUrlRef.current);
    } else {
      setSrcImage(context.cropSrc);
    }
    reset();
    return () => {};
  }, [context]);
  // unmount前revokeObjectURL
  useEffect(() => {
    return () => {
      updateTempFileRef();
    };
  }, []);
  return (
    <Modal
      title={title}
      width={550}
      visible={visible}
      onCancel={(e) => {
        context.reject();
        onCancel?.(e);
      }}
      confirmLoading={isWorking}
      onOk={(e) => {
        if (srcImage && area) {
          setIsWorking(true);
          const type = isFile(context.cropSrc)
            ? context.cropSrc.type
            : getType(context.cropSrc) ?? undefined;
          getCroppedImg(srcImage, type, area)
            .then((blob) => {
              if (blob) {
                const file: RcFile = Object.assign(
                  new File([blob], context.name, { type: blob.type }),
                  {
                    uid: context.uid,
                  },
                ) as RcFile;
                context.resolve(file);
                onOk?.(e);
              } else {
                // TODO: 获取失败的处理
                console.error('图像获取失败');
              }
            })
            .finally(() => {
              setIsWorking(false);
            });
        }
      }}
      forceRender
    >
      <Row>
        <label>
          本地上传：
          <Upload
            fileList={[]}
            showUploadList={false}
            accept={accept}
            beforeUpload={(file) => {
              updateTempFileRef(file);
              setSrcImage(tempFileUrlRef.current);
              return Promise.reject();
            }}
          >
            <Button icon={<UploadOutlined />}>上传图片</Button>
          </Upload>
        </label>
      </Row>
      <div
        style={{ position: 'relative', height: '300px', marginBlock: '20px' }}
      >
        <Cropper
          ref={cropperRef}
          image={srcImage}
          crop={crop}
          zoom={zoom}
          cropShape="rect"
          aspect={aspect}
          onCropChange={setCrop}
          onCropComplete={(percentage, pixels) => {
            setArea(pixels);
          }}
          onZoomChange={setZoom}
        />
      </div>
    </Modal>
  );
}
