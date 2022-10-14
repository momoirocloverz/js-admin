import { useEffect, useRef, useState } from 'react';
import {
  getPaymentDetails,
  resolvePayment,
  getPaymentApplyList,
} from '@/api/projects';
import { Button, Input, message, InputNumber, Space, Spin, Form } from 'antd';
import styles from './index.less';
import Apis from '@/utils/apis';
import PaymentRequestForm from '@/components/form/templates/PaymentRequestForm';
import FundSource from './components/FundSource';
import MediaUploader from '@/components/form/MediaUploader';

export default function Payment({ id, userId, applyId }: any) {
  const [data, setData] = useState<any>({});
  const [globalData, setGlobalData] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [showInputIndex, setShowInputIndex] = useState(0); // 显示的审核文本序号
  const fundSourceRef: any = useRef();
  const [originSubItem, setOriginSubItem] = useState([]); // 已有分项数据(政策文件自带&已有数据)
  const [freezSubItemIds, setFreezSubItemIds] = useState([]); // 政策文件自带分项id 不可删除
  const [form] = Form.useForm();
  const [buttonDisable, setButtonDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentApplyId, setCurrentApplyId] = useState(applyId);

  // 判断显示输入框的序号
  const handleShowInputIndex = (data: any) => {
    const {
      admin_id = 0,
      fund_first_admin_id: first_id = 0,
      fund_second_admin_id: second_id = 0,
      fund_confirm_admin_id: confirm_id = 0,
    } = data.project_info?.get_policy || {};
    const { check_schedule, is_check } = data;
    if (check_schedule == 1 && userId == admin_id) {
      return setShowInputIndex(1);
    }

    if (check_schedule == 2 && userId == first_id) {
      return setShowInputIndex(2);
    }

    if (check_schedule == 3 && userId == second_id) {
      return setShowInputIndex(3);
    }

    if (check_schedule == 4 && is_check != 4 && userId == confirm_id) {
      return setShowInputIndex(4);
    }
    setShowInputIndex(0);
  };

  // 获取资金拨付信息
  const getData = async () => {
    if (applyId) {
      // 从资金拨付列表进入 携带applyId参数
      setCurrentApplyId(applyId);
      initData(applyId);
    } else {
      // 其他入口进入 根据projectId获取最新一条申请记录的applyId显示
      const result: any = await getPaymentApplyList({
        page: 1,
        pagesize: 20,
        project_id: id,
      });
      if (result.code == 0) {
        if (result.data?.list?.[0]) {
          setCurrentApplyId(result.data?.list?.[0].id);
          initData(result.data?.list?.[0].id);
        } else {
          message.warning('无申请记录');
        }
      } else {
        message.error(result.msg);
      }
    }
  };

  // 页面数据处理及初始化
  const initData = (applyId: any) => {
    getPaymentDetails(applyId)
      .then((result: any) => {
        if (result.code === 0) {
          handleShowInputIndex(result.data);
          setGlobalData(result.data);
          const {
            check_schedule,
            project_fund_rel_subitem_list = [],
            project_capital_source_rel_subitem_list,
          } = result.data || {};
          if (
            check_schedule == 1 &&
            !project_capital_source_rel_subitem_list?.length
          ) {
            // 未选择过资金来源分项 使用政策文件关联的分项展示
            getDocumentInfo(
              result.data.project_info.policy_document_id,
              result.data,
            );
          } else {
            // 已选择过使用详情中的数据展示
            getDocumentInfo(
              result.data.project_info.policy_document_id,
              result.data,
            );
            if (showInputIndex == 0) {
              project_fund_rel_subitem_list.forEach((ele) => {
                ele.project_fund_source_info = ele.fund_source_info;
                ele.fund_subitem_info = ele.subitem_info;
              });
              initSubItem(project_fund_rel_subitem_list, result.data);
            }
          }
          if (result.data.project_info) {
            setData({
              ...result.data,
              real_fund_amount: result.data.project_info.real_fund_amount,
              principal_opnion: result.data.principal_reason,
              leader_opnion: result.data.leader_reason,
              important_opnion: result.data.important_reason,
            });
            setFormData({
              ...result.data,
              real_fund_amount: result.data.project_info.real_fund_amount,
              principal_opnion: result.data.principal_reason,
              leader_opnion: result.data.leader_reason,
              important_opnion: result.data.important_reason,
            });
            if (result.data.principal_attachment) {
              // 项目负责人附件
              form.setFieldsValue({
                fileList: JSON.parse(result.data.principal_attachment),
              });
            }
          }
        } else {
          throw new Error(result.msg);
        }
      })
      .catch((e) => {
        message.error(`资金申请表读取失败: ${e.message}`);
      });
  };

  // 获取政策文件信息 获取默认显示资金来源分项数据 useDocRelSubItem：是否默认展示政策关联分项
  /*   const getDocumentInfo = (id: any, useDocRelSubItem?: any) => {
    Apis.fetchPolicyDocumentInfo({ id }).then((res: any) => {
      if (res?.code == 0) {
        // useDocRelSubItem &&
        //   initSubItem(res.data.project_capital_source_rel_subitem_list);
        if (res.data.project_capital_source_rel_subitem_list) {
          if (res.data.project_capital_source_rel_subitem_list.length) {
            useDocRelSubItem &&
              initSubItem(res.data.project_capital_source_rel_subitem_list);            
            
            setFreezSubItemIds(
              res.data.project_capital_source_rel_subitem_list.map(
                (v: any) => v.rel_subitem_id,
              ),
            );
          } else {
            let temp =
              res.data.project_capital_source_rel_subitem_list
                .project_capital_source_rel_subitem_list;
            useDocRelSubItem && initSubItem(temp);
            let bridge = temp.map((v: any) => v.rel_subitem_id);
            setFreezSubItemIds(bridge);
          }
        }
      } else {
        message.error(res.msg);
      }
    });
  }; */

  const getDocumentInfo = (id: any, global?: any) => {
    Apis.fetchPolicyDocumentInfo({ id }).then((res: any) => {
      if (res?.code == 0) {
        // useDocRelSubItem &&
        //   initSubItem(res.data.project_capital_source_rel_subitem_list);
        if (res.data.project_capital_source_rel_subitem_list) {
          if (res.data.project_capital_source_rel_subitem_list.length) {
            initSubItem(
              res.data.project_capital_source_rel_subitem_list,
              global,
            );

            setFreezSubItemIds(
              res.data.project_capital_source_rel_subitem_list.map(
                (v: any) => v.rel_subitem_id,
              ),
            );
          } else {
            let temp =
              res.data.project_capital_source_rel_subitem_list
                .project_capital_source_rel_subitem_list;
            initSubItem(temp, global);
            let bridge = temp.map((v: any) => v.rel_subitem_id);
            setFreezSubItemIds(bridge);
          }
        }
      } else {
        message.error(res.msg);
      }
    });
  };

  // 初始化分项数据 replaceAmount:是否要使用接口返回的amount
  const initSubItem = (data: any = [], global?: any) => {
    data.forEach((ele) => {
      let track = global.project_order_amount_list.find((sub) => {
        return sub.rel_subitem_id == ele.rel_subitem_id;
      });
      if (track) {
        ele.amount = track.amount;
        ele.remain_amount = track.remain_can_use_apply_amount;
      }
    });
    const result = data.map((v: any) => {
      return {
        ...v,
        // actual_amount: v.amount,
        id: v.rel_subitem_id,
      };
    });
    setOriginSubItem(result);
  };
  useEffect(() => {
    if (id && userId) {
      getData();
    }
  }, [id, userId]);

  // 提交审核
  const submit = async (
    actionType: number,
    contentFieldName: string | undefined,
    agentType: number,
    real_fund_amount?: number,
  ) => {
    if (!formData[contentFieldName as string]) {
      message.warning('请填写意见');
      return Promise.reject();
    }
    try {
      setIsLoading(true);
      let params: any = {
        id: currentApplyId,
        project_id: data.project_info?.project_id,
        is_check: actionType,
        reason: contentFieldName && formData[contentFieldName],
        schedule: agentType,
      };
      if (actionType == 1 && agentType == 1) {
        // 校验资金来源
        const documentSubItem = getDocumentSubItem();
        if (documentSubItem?.length) {
          // 判断是否全部填写了金额
          const checkActualAmount = documentSubItem.every(
            (v: any) => v.actual_amount >= 0,
          );
          if (!checkActualAmount) {
            setIsLoading(false);
            return message.error('请填写资金来源分项资金金额');
          }
          // 组装数据
          params.rel_subitem_list = documentSubItem.map((item: any) => {
            return {
              rel_subitem_id: item.id,
              amount: item.actual_amount,
            };
          });
        } else {
          setIsLoading(false);
          return message.error('请添加资金来源');
        }
      }
      if (agentType == 1) {
        // 附件数据
        params.attachment = form.getFieldsValue().fileList || '';
      }
      // return console.log(params);
      const result: any = await resolvePayment(params);
      if (result.code === 0) {
        message.success('操作成功');
        setIsLoading(false);
        getData();
      } else {
        throw new Error(result.msg);
      }
    } catch (e: any) {
      setIsLoading(false);
      message.error(`操作失败: ${e.message}`);
      return Promise.reject(e.message);
    }
  };

  const watchUploading = (val: any) => {
    setButtonDisable(val);
  };
  // 获取已选资金来源
  const getDocumentSubItem = () => {
    return fundSourceRef?.current.getDocumentSubItem();
  };

  return (
    <Spin spinning={isLoading}>
      <Space
        direction="vertical"
        style={{ width: '100%', padding: '16px', boxSizing: 'border-box' }}
      >
        <div className={styles.projectForm}>
          <div className={styles.previewForm}>
            <PaymentRequestForm data={data} />
          </div>
          <div className={styles.actionCol}>
            {data.check_schedule > 1 && (
              <Space direction="vertical">
                <Space>
                  <div className={styles.opnionTitle}>项目管理负责人意见：</div>
                  <div className={styles.operator}>
                    {`(操作人：${formData.project_info?.get_policy?.admin_info?.real_name})`}
                  </div>
                </Space>
                <Input.TextArea
                  className={styles.opnionText}
                  value={data.principal_opnion}
                  autoSize={{ minRows: 4, maxRows: 6 }}
                  readOnly
                />
                <Form form={form}>
                  <Form.Item name="fileList">
                    <MediaUploader
                      watchUploading={watchUploading}
                      max={5}
                      disabled={showInputIndex != 1}
                    />
                  </Form.Item>
                </Form>
              </Space>
            )}
            {/* {data.check_schedule > 2 && (
              <Space direction="vertical">
                <Space>
                  <div className={styles.opnionTitle}>分管领导意见：</div>
                  <div className={styles.operator}>
                    {`(操作人：${formData.project_info?.get_policy?.fund_first_admin_info?.real_name})`}
                  </div>
                </Space>
                <Input.TextArea
                  className={styles.opnionText}
                  value={data.leader_opnion}
                  autoSize={{ minRows: 4, maxRows: 6 }}
                  readOnly
                />
              </Space>
            )} */}
            {/* {data.check_schedule > 3 && (
              <Space direction="vertical">
                <Space>
                  <div className={styles.opnionTitle}>主要领导意见：</div>
                  <div className={styles.operator}>
                    {`(操作人：${formData.project_info?.get_policy?.fund_second_admin_info?.real_name})`}
                  </div>
                </Space>
                <Input.TextArea
                  className={styles.opnionText}
                  value={data.important_opnion}
                  autoSize={{ minRows: 4, maxRows: 6 }}
                  readOnly
                />
              </Space>
            )} */}

            {/* {formData.is_check == 4 && (
              <Space direction="vertical">
                <Space>
                  <div className={styles.opnionTitle}>资金拨付：</div>
                  <div className={styles.operator}>
                    {`(操作人：${formData.project_info?.get_policy?.fund_confirm_admin_info?.real_name})`}
                  </div>
                </Space>
                <Input.TextArea
                  className={styles.opnionText}
                  value={data.fund_reason}
                  autoSize={{ minRows: 4, maxRows: 6 }}
                  readOnly
                />
              </Space>
            )} */}

            {showInputIndex == 1 && (
              <Space direction="vertical">
                <Space>
                  <div className={styles.opnionTitle}>项目管理负责人意见：</div>
                  <div className={styles.operator}>
                    {`(操作人：${formData.project_info?.get_policy?.admin_info?.real_name})`}
                  </div>
                </Space>
                <Input.TextArea
                  value={formData.principal_reason}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      principal_reason: e.target.value,
                    })
                  }
                  autoSize={{ minRows: 4, maxRows: 6 }}
                />
                <Form form={form}>
                  <Form.Item name="fileList">
                    <MediaUploader
                      watchUploading={watchUploading}
                      max={5}
                      disabled={showInputIndex != 1}
                    />
                  </Form.Item>
                </Form>
                <Space className={styles.row}>
                  <Button
                    disabled={buttonDisable}
                    danger
                    onClick={() => {
                      submit(2, 'principal_reason', 1);
                    }}
                  >
                    驳回
                  </Button>
                  <Button
                    disabled={buttonDisable}
                    type="primary"
                    onClick={() => {
                      submit(1, 'principal_reason', 1).then(() => {
                        // setData({ ...data, check_schedule: 2 });
                      });
                    }}
                  >
                    通过
                  </Button>
                </Space>
              </Space>
            )}

            {/* {showInputIndex == 2 && (
              <Space direction="vertical">
                <Space>
                  <div className={styles.opnionTitle}>分管领导意见：</div>
                  <div className={styles.operator}>
                    {`(操作人：${formData.project_info?.get_policy?.fund_first_admin_info?.real_name})`}
                  </div>
                </Space>
                <Input.TextArea
                  value={formData.leader_reason}
                  onChange={(e) =>
                    setFormData({ ...formData, leader_reason: e.target.value })
                  }
                  autoSize={{ minRows: 4, maxRows: 6 }}
                />
                <Space className={styles.row}>
                  <Button
                    danger
                    onClick={() => {
                      submit(2, 'leader_reason', 2);
                    }}
                  >
                    驳回
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      submit(1, 'leader_reason', 2).then(() => {
                        // setData({ ...data, check_schedule: 3 });
                      });
                    }}
                  >
                    通过
                  </Button>
                </Space>
              </Space>
            )} */}

            {/* {showInputIndex == 3 && (
              <Space direction="vertical">
                <Space>
                  <div className={styles.opnionTitle}>主要领导意见：</div>
                  <div className={styles.operator}>
                    {`(操作人：${formData.project_info?.get_policy?.fund_second_admin_info?.real_name})`}
                  </div>
                </Space>
                <Input.TextArea
                  value={formData.important_reason}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      important_reason: e.target.value,
                    })
                  }
                  autoSize={{ minRows: 4, maxRows: 6 }}
                />
                <Space className={styles.row}>
                  <Button
                    danger
                    onClick={() => {
                      submit(2, 'important_reason', 3);
                    }}
                  >
                    驳回
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      submit(1, 'important_reason', 3).then(() => {
                        // setData({ ...data, check_schedule: 4 });
                      });
                    }}
                  >
                    通过
                  </Button>
                </Space>
              </Space>
            )} */}

            {/* {showInputIndex == 4 && (
              <Space direction="vertical">
                <Space>
                  <div className={styles.opnionTitle}>资金拨付人意见：</div>
                  <div className={styles.operator}>
                    {`(操作人：${formData.project_info?.get_policy?.fund_confirm_admin_info?.real_name})`}
                  </div>
                </Space>

                <Input.TextArea
                  value={formData.fund_reason}
                  onChange={(e) =>
                    setFormData({ ...formData, fund_reason: e.target.value })
                  }
                  autoSize={{ minRows: 4, maxRows: 6 }}
                />

                <Space className={styles.row}>
                  <Button
                    type="primary"
                    onClick={() => {
                      submit(1, 'fund_reason', 4).then(() => {
                        // setData({ ...formData, check_schedule: 5 });
                        // setFormData({ ...formData, check_schedule: 5 });
                      });
                    }}
                  >
                    完成资金拨付
                  </Button>
                </Space>
              </Space>
            )} */}
          </div>
        </div>
        <FundSource
          ref={fundSourceRef}
          originSubItem={originSubItem}
          freezSubItemIds={freezSubItemIds}
          paymentData={data}
          showInputIndex={showInputIndex}
          getDocumentSubItem={getDocumentSubItem}
        />
      </Space>
    </Spin>
  );
}
