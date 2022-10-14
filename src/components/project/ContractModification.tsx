import React, { useEffect, useState } from 'react';
import {
  getContractModificationRequest,
  resolveModificationRequest,
} from '@/api/projects';
import { Button, Input, message, Space } from 'antd';
import styles from './index.less';
import ContractModificationForm from '@/components/form/templates/ContractModificationForm';

export default function ContractModification({ id, userId }) {
  const [data, setData] = useState({});
  const [debugMode] = useState(false);

  useEffect(() => {
    let processResult = true;
    getContractModificationRequest(id)
      .then((result) => {
        if (processResult) {
          if (result.code === 0) {
            setData(result.data.id ? result.data : {});
          } else {
            throw new Error(result.msg);
          }
        }
      })
      .catch((e) => {
        message.error(`变更申请表读取失败: ${e.message}`);
      });
    return () => {
      processResult = false;
    };
  }, [id]);

  const submit = async (type) => {
    if (!data.check_reason) {
      message.warning('请填写审批意见');
      return Promise.reject();
    }
    try {
      const result = await resolveModificationRequest({
        id: data.id,
        is_check: type,
        check_reason: data.check_reason,
        remark: undefined,
      });
      if (result.code === 0) {
        message.success('操作成功');
      } else {
        throw new Error(result.msg);
      }
    } catch (e) {
      message.error(`操作失败: ${e.message}`);
      return Promise.reject(e.message);
    }
  };
  const statusLabelBgColor =
    data.is_check === 1
      ? '#D09800'
      : [2, 3].includes(data.is_check)
      ? '#5e8d65'
      : undefined;
  const statusLabelText =
    data.is_check === 1
      ? '未处理'
      : [2, 3].includes(data.is_check)
      ? '已处理'
      : undefined;
  const canAct =
    data.is_check == 1 && userId == data.change_admin_id?.toString();

  return (
    <div className={styles.projectForm}>
      <div className={styles.previewForm}>
        <ContractModificationForm data={data} />
        {data.is_check && (
          <div
            className={styles.statusLabel}
            style={{ backgroundColor: statusLabelBgColor }}
          >
            {statusLabelText}
          </div>
        )}
      </div>
      <div className={styles.actionCol}>
        <div>
          <h4 className={styles.fakeRequired}>审批意见：</h4>
          <Input.TextArea
            disabled={!debugMode && !canAct}
            value={data.check_reason}
            onChange={(e) => setData({ ...data, check_reason: e.target.value })}
            autoSize={{ minRows: 5 }}
          />
          <Space className={styles.row}>
            <Button
              disabled={!debugMode && !canAct}
              danger
              onClick={() => {
                submit(3).then(() => {
                  setData({ ...data, is_check: 3 });
                });
              }}
            >
              驳回
            </Button>
            <Button
              disabled={!debugMode && !canAct}
              type="primary"
              onClick={() => {
                submit(2).then(() => {
                  setData({ ...data, is_check: 2 });
                });
              }}
            >
              通过
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
}
