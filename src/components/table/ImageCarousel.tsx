import React, { useState } from 'react';
import { Image, Carousel, Modal, Card } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styles from './index.less'

type Props = {
  src: string[];
  height?: number;
  minWidth?: string;
  objectFit?: string;
};

export default function ImageCarousel({
  src,
  // height = 100,
  // minWidth = '100px',
  // objectFit = 'cover',
}: Props) {
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <>
      <div
        style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
        >
        {src.length > 0 && <img
          height={90}
          width={90}
          style={{objectFit: 'cover'}}
          src={`${src[0]}?x-oss-process=image/resize,s_100`}
        />}
        <Card
          style={{minWidth: '100px', cursor: 'pointer'}}
          onClick={()=>{
            setModalVisible(src.length > 0)
          }}>
          总共<br />{src.length}张
        </Card>
      </div>
      <Modal
        centered
        visible={modalVisible}
        onCancel={()=>setModalVisible(false)}
        wrapClassName={styles.customCarouselModal}
        closable={false}
        footer={false}
      >
        <Carousel
          autoplay
          className={styles.carousel}
          arrows
          prevArrow={<LeftOutlined />}
          nextArrow={<RightOutlined />}
        >
          {src.map(url=><img key={url} className={styles.carouselImage} src={url} />)}
        </Carousel>
      </Modal>
    </>

  );
}
