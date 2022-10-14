import styles from './index.less';
import { useEffect, useState } from 'react';
import { Table } from 'antd';
import { getExtension, isImage } from '@/utils/common';
import { CROPS_MAP as approvalMap } from '@/pages/application/const';

const AuditRecord = (props: any) => {
  const { approvalRecord, loading, showAttachment } = props;

  useEffect(() => {}, []);

  const openDoc = (src: any) => {
    window.open(src, '_blank');
  };

  // 审核记录表头
  const columns = [
    {
      title: '操作类型',
      dataIndex: 'action_type',
      align: 'center',
      render: (text: any, record: any) => <div>{approvalMap[text].title}</div>,
    },
    {
      title: '操作人',
      dataIndex: 'action_username',
      align: 'center',
    },
    {
      title: '操作时间',
      dataIndex: 'updated_at',
      align: 'center',
    },
    {
      title: '意见',
      dataIndex: 'action_content',
      align: 'center',
    },
    {
      title: '附件',
      dataIndex: 'attachment',
      align: 'center',
      render: (text: any, record: any) => {
        // 区分开图片和文件
        if (text && text.length && JSON.stringify(text) != '{}') {
          let imgs: any = [];
          let docs: any = [];
          text = text.filter((v: any) => v);          
          text.forEach((file: any) => {
            isImage(getExtension(file)) ? imgs.push(file) : docs.push(file);
          });
          let imgAttachment = null;
          if (imgs.length) {
            imgAttachment = (
              <div onClick={() => showAttachment(imgs)} className={styles.link}>
                查看附件
              </div>
            );
          }
          let docAttachment = null;
          if (docs.length) {
            docAttachment = (
              <>
                {docs.map((src: any, i: number) => (
                  <div
                    onClick={() => openDoc(src)}
                    className={styles.link}
                    key={i}
                  >{`文件${i + 1}`}</div>
                ))}
              </>
            );
          }
          return (
            <>
              {imgAttachment}
              {docAttachment}
            </>
          );
        }
        return <></>;
      },
    },
  ];

  return (
    <>
      <div className={styles.leftBottomCon}>
        <div className={styles.subTitle}>审核记录</div>
        <Table
          columns={columns}
          rowKey={(item) => item.id}
          dataSource={approvalRecord}
          pagination={false}
          loading={loading}
          scroll={{ y: 550 }}
          bordered
        />
      </div>
    </>
  );
};

export default AuditRecord;
