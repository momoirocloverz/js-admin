import styles from './index.less';
import Apis from '@/utils/apis';
import React, { useEffect, useState, useRef, Component } from 'react';
import {
  message,
  Form,
  InputNumber,
  Select,
  Button,
  Popconfirm,
  Radio,
  Spin,
  Space,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import {
  understandPaperPushDetail,
  understandPaperPushExecute,
  understandPaperPushUpdate,
} from '@/api/understandPaper';

const { Option } = Select;
const UnderstandPushPaperPage = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [form] = Form.useForm();
  const cropTypeAll = [
    {
      // 农作物类型中文
      CROP_TYPE_NAME: '油菜', // 油菜
    },
    {
      // 农作物类型中文
      CROP_TYPE_NAME: '大小麦', // 大小麦
    },
    {
      // 农作物类型中文
      CROP_TYPE_NAME: '早稻', // 早稻
    },
    {
      // 农作物类型中文
      CROP_TYPE_NAME: '单季稻', // 单季稻
    },
    {
      // 农作物类型中文
      CROP_TYPE_NAME: '连作晚稻', // 连作晚稻
    },
  ];

  const operationType = [
    {
      // 推送条件 等于/不等于/大于/小于/大于等于/小于等于
      PUSH_CONDITION_tYPE: '等于',
    },
    {
      PUSH_CONDITION_tYPE: '不等于',
    },
    {
      PUSH_CONDITION_tYPE: '小于',
    },
    {
      PUSH_CONDITION_tYPE: '大于',
    },
    {
      PUSH_CONDITION_tYPE: '小于等于',
    },
    {
      PUSH_CONDITION_tYPE: '大于等于',
    },
  ];
  const [isShowFirstSelectBox, setIsShowFirstSelectBox] = useState(false);
  const [isShowSecondSelectBox, setIsShowSecondSelectBox] = useState(false);
  const [isShowThirdSelectBox, setIsShowThirdSelectBox] = useState(false);
  const [isShowThirdBox, setIsShowThirdBox] = useState(false); //或条件
  const [isLoading, setIsLoading] = useState(true);

  const initAction = () => {
    console.log(location.query.edit);

    commitGlobalBread([
      {
        title: '发布中心',
        triggerOn: true,
      },
      {
        title: '明白纸推送',
        triggerOn: true,
      },
      {
        title:
          location.query.push == '1'
            ? location.query.edit == '1'
              ? '推送编辑'
              : '推送详情'
            : '新建推送',
      },
    ]);
  };
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };
  const setFormValue = (value: any) => {
    const { push_channel, rule_list = [] } = value;
    if (!push_channel) return; //没有推送方式说明之前没有填写过推送信息无需执行回显功能
    const formData = { push_channel: push_channel + '' };
    rule_list.forEach((item, firstIndex) => {
      (item || []).length > 0 &&
        (item || []).forEach((element, index) => {
          const { attr, condition, value } = element;
          if (firstIndex == 0) {
            //对应三个下拉框
            if (!index) setIsShowFirstSelectBox(true);
            console.log(`firstAttr${index ? 'Two' : 'One'}`);
            formData[`firstAttr${index ? 'Two' : 'One'}`] = attr;
            formData[`firstCondition${index ? 'Two' : 'One'}`] = condition;
            formData[`firstValue${index ? 'Two' : 'One'}`] = value;
          } else if (firstIndex == 1) {
            if (!index) setIsShowSecondSelectBox(true);
            formData[`secondAttr${index ? 'Two' : 'One'}`] = attr;
            formData[`secondCondition${index ? 'Two' : 'One'}`] = condition;
            formData[`secondValue${index ? 'Two' : 'One'}`] = value;
          } else if (firstIndex == 2) {
            if (!index) {
              setIsShowThirdSelectBox(true);
              setIsShowThirdBox(true);
            }
            formData[`thirdAttr${index ? 'Two' : 'One'}`] = attr;
            formData[`thirdCondition${index ? 'Two' : 'One'}`] = condition;
            formData[`thirdValue${index ? 'Two' : 'One'}`] = value;
          }
        });
    });
    form.setFieldsValue(formData); //赋值给form
  };
  const fetchFromInfo = async () => {
    if (location.query.id) {
      try {
        let result = null;
        if (location.query.push == '1') {
          // 推送草稿箱进入
          result = await understandPaperPushDetail({ id: location.query.id });
        } else {
          // 明白纸列表进入
          result = await Apis.understandPaperGetInfo({
            understand_paper_id: location.query.id,
          });
        }
        setIsLoading(false);
        if (result && result.code === 0) {
          setFormValue(result?.data?.info);
        } else {
          message.error(result.msg);
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
  };
  const fetchSelectList = async (params: any) => {
    let isHaveValue = false; //判断是否有填写条件
    Array.isArray(params.rule_list) &&
      params.rule_list.forEach((item) => {
        if (item.length > 0) isHaveValue = true;
      });
    if (location.query.id) {
      if (isHaveValue) {
        let result = null;
        if (location.query.push == '1') {
          // 推送草稿修改
          params.id = location.query.id;
          result = await understandPaperPushUpdate(params);
        } else {
          // 推送新建修改
          result = await Apis.understandPaperPushAction(params);
        }
        if (result?.code === 0) {
          message.success('保存成功');
        } else {
          message.error(result.msg);
        }
      } else {
        message.error('请输入推送条件后再保存');
      }
    }
  };
  const getParams = (values: any) => {
    const {
      push_channel,
      firstAttrOne,
      firstConditionOne,
      firstValueOne,
      firstAttrTwo,
      firstConditionTwo,
      firstValueTwo,
      secondAttrOne,
      secondConditionOne,
      secondValueOne,
      secondAttrTwo,
      secondConditionTwo,
      secondValueTwo,
      thirdAttrOne,
      thirdConditionOne,
      thirdValueOne,
      thirdAttrTwo,
      thirdConditionTwo,
      thirdValueTwo,
    } = values || {};
    const ruleArr = [[], [], []];
    //如果每个组下拉框条件的值都输入将他组合用来传参(写的有点笨后续优化一下)
    if (firstAttrOne && firstConditionOne && firstValueOne) {
      ruleArr[0].push({
        attr: firstAttrOne,
        condition: firstConditionOne,
        value: firstValueOne,
      });
    }
    if (firstAttrTwo && firstConditionTwo && firstValueTwo) {
      ruleArr[0].push({
        attr: firstAttrTwo,
        condition: firstConditionTwo,
        value: firstValueTwo,
      });
    }
    if (secondAttrOne && secondConditionOne && secondValueOne) {
      ruleArr[1].push({
        attr: secondAttrOne,
        condition: secondConditionOne,
        value: secondValueOne,
      });
    }
    if (secondAttrTwo && secondConditionTwo && secondValueTwo) {
      ruleArr[1].push({
        attr: secondAttrTwo,
        condition: secondConditionTwo,
        value: secondValueTwo,
      });
    }
    if (thirdAttrOne && thirdConditionOne && thirdValueOne) {
      ruleArr[2].push({
        attr: thirdAttrOne,
        condition: thirdConditionOne,
        value: thirdValueOne,
      });
    }
    if (thirdAttrTwo && thirdConditionTwo && thirdValueTwo) {
      ruleArr[2].push({
        attr: thirdAttrTwo,
        condition: thirdConditionTwo,
        value: thirdValueTwo,
      });
    }
    const params = {
      push_channel,
      understand_paper_id: location?.query?.id,
      rule_list: ruleArr,
    };
    return params;
  };
  const onFinish = (values: any) => {
    fetchSelectList(getParams(values));
  };
  const onReset = () => {
    //清空
    form.resetFields();
    setIsShowFirstSelectBox(false);
    setIsShowSecondSelectBox(false);
    setIsShowThirdSelectBox(false);
    setIsShowThirdBox(false);
  };
  const onBack = () => {
    return history.goBack();
    if (location.query.push == '1') {
      // 草稿箱推送详情
      history.goBack();
    } else {
      //清空
      form.resetFields();
      setIsShowFirstSelectBox(false);
      setIsShowSecondSelectBox(false);
      setIsShowThirdSelectBox(false);
      setIsShowThirdBox(false);
    }
  };
  const onClickPush = async () => {
    try {
      // 执行推送
      const result: any = await understandPaperPushExecute({
        id: location.query?.id,
      });
      if (result?.code === 0) {
        message.success('推送成功');
        history.goBack();
      } else {
        message.error(result.msg);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    initAction();
    fetchFromInfo();
  }, []);
  return (
    <Spin spinning={isLoading}>
      <div className={styles.homePageCon}>
        <Form
          name="nest-messages"
          labelAlign={'left'}
          form={form}
          onFinish={(values) => onFinish(values)}
          className={styles.formCon}
          disabled={location.query.edit != '1'}
        >
          <Form.Item
            name="push_channel"
            rules={[{ required: true }]}
            label="推送渠道"
          >
            <Radio.Group>
              <Radio value="1">浙里办</Radio>
              <Radio value="2">短信</Radio>
            </Radio.Group>
          </Form.Item>
          <div
            style={{ marginBottom: '0' }}
            className={styles['form-item-box']}
          >
            <div>
              <Form.Item name="firstAttrOne" className={styles.antFormItemCon}>
                <Select placeholder="请选择">
                  {cropTypeAll.map((item, index) => {
                    return (
                      <Option value={item.CROP_TYPE_NAME} key={index}>
                        {item.CROP_TYPE_NAME}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                name="firstConditionOne"
                className={styles.antFormItemCon}
              >
                <Select placeholder="请选择">
                  {operationType.map((item, index) => {
                    return (
                      <Option value={item.PUSH_CONDITION_tYPE} key={index}>
                        {item.PUSH_CONDITION_tYPE}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item name="firstValueOne" className={styles.antFormItemCon}>
                <InputNumber
                  style={{ width: '100%' }}
                  controls={false}
                  placeholder="请输入数字"
                />
              </Form.Item>
              <span className={styles.units}>亩</span>
            </div>
            且
            <div>
              {!isShowFirstSelectBox && (
                <Button
                  // type="dashed"
                  onClick={() => setIsShowFirstSelectBox(true)}
                  style={{ width: '20%' }}
                  icon={<PlusOutlined />}
                >
                  添加条件
                </Button>
              )}
              <Form.Item name="firstAttrTwo" className={styles.antFormItemCon}>
                {isShowFirstSelectBox && (
                  <Select placeholder="请选择">
                    {cropTypeAll.map((item, index) => {
                      return (
                        <Option value={item.CROP_TYPE_NAME} key={index}>
                          {item.CROP_TYPE_NAME}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
              {isShowFirstSelectBox && (
                <Form.Item
                  name="firstConditionTwo"
                  className={styles.antFormItemCon}
                >
                  <Select placeholder="请选择">
                    {operationType.map((item, index) => {
                      return (
                        <Option value={item.PUSH_CONDITION_tYPE} key={index}>
                          {item.PUSH_CONDITION_tYPE}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              )}
              {isShowFirstSelectBox && (
                <Form.Item
                  name="firstValueTwo"
                  className={styles.antFormItemCon}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    controls={false}
                    placeholder="请输入数字"
                  />
                </Form.Item>
              )}
              {isShowFirstSelectBox && <span className={styles.units}>亩</span>}
            </div>
          </div>
          <div className={styles.orCon}>
            ----------------------------------------------------------或---------------------------------------------------
          </div>
          <div className={styles['form-item-box']}>
            <div>
              <Form.Item name="secondAttrOne" className={styles.antFormItemCon}>
                <Select placeholder="请选择">
                  {cropTypeAll.map((item, index) => {
                    return (
                      <Option value={item.CROP_TYPE_NAME} key={index}>
                        {item.CROP_TYPE_NAME}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                name="secondConditionOne"
                className={styles.antFormItemCon}
              >
                <Select placeholder="请选择">
                  {operationType.map((item, index) => {
                    return (
                      <Option value={item.PUSH_CONDITION_tYPE} key={index}>
                        {item.PUSH_CONDITION_tYPE}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                name="secondValueOne"
                className={styles.antFormItemCon}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  controls={false}
                  placeholder="请输入数字"
                />
              </Form.Item>
              <span className={styles.units}>亩</span>
            </div>
            且
            <div>
              {!isShowSecondSelectBox && (
                <Button
                  // type="dashed"
                  onClick={() => setIsShowSecondSelectBox(true)}
                  style={{ width: '20%' }}
                  icon={<PlusOutlined />}
                >
                  添加条件
                </Button>
              )}
              <Form.Item name="secondAttrTwo" className={styles.antFormItemCon}>
                {isShowSecondSelectBox && (
                  <Select placeholder="请选择">
                    {cropTypeAll.map((item, index) => {
                      return (
                        <Option value={item.CROP_TYPE_NAME} key={index}>
                          {item.CROP_TYPE_NAME}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
              {isShowSecondSelectBox && (
                <Form.Item
                  name="secondConditionTwo"
                  className={styles.antFormItemCon}
                >
                  <Select placeholder="请选择">
                    {operationType.map((item, index) => {
                      return (
                        <Option value={item.PUSH_CONDITION_tYPE} key={index}>
                          {item.PUSH_CONDITION_tYPE}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              )}
              {isShowSecondSelectBox && (
                <Form.Item
                  name="secondValueTwo"
                  className={styles.antFormItemCon}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    controls={false}
                    placeholder="请输入数字"
                  />
                </Form.Item>
              )}
              {isShowSecondSelectBox && (
                <span className={styles.units}>亩</span>
              )}
            </div>
          </div>
          {!isShowThirdBox && (
            <Button
              // type="dashed"
              onClick={() => setIsShowThirdBox(true)}
              style={{ width: '20%' }}
              icon={<PlusOutlined />}
            >
              添加“或”条件
            </Button>
          )}
          {isShowThirdBox && (
            <div className={styles.orCon}>
              ----------------------------------------------------------或---------------------------------------------------
            </div>
          )}
          {isShowThirdBox && (
            <div className={styles['form-item-box']}>
              <div>
                <Form.Item
                  name="thirdAttrOne"
                  className={styles.antFormItemCon}
                >
                  <Select placeholder="请选择">
                    {cropTypeAll.map((item, index) => {
                      return (
                        <Option value={item.CROP_TYPE_NAME} key={index}>
                          {item.CROP_TYPE_NAME}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="thirdConditionOne"
                  className={styles.antFormItemCon}
                >
                  <Select placeholder="请选择">
                    {operationType.map((item, index) => {
                      return (
                        <Option value={item.PUSH_CONDITION_tYPE} key={index}>
                          {item.PUSH_CONDITION_tYPE}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="thirdValueOne"
                  className={styles.antFormItemCon}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    controls={false}
                    placeholder="请输入数字"
                  />
                </Form.Item>
                <span className={styles.units}>亩</span>
              </div>
              且
              <div>
                {!isShowThirdSelectBox && (
                  <Button
                    // type="dashed"
                    onClick={() => setIsShowThirdSelectBox(true)}
                    style={{ width: '20%' }}
                    icon={<PlusOutlined />}
                  >
                    添加条件
                  </Button>
                )}
                <Form.Item
                  name="thirdAttrTwo"
                  className={styles.antFormItemCon}
                >
                  {isShowThirdSelectBox && (
                    <Select placeholder="请选择">
                      {cropTypeAll.map((item, index) => {
                        return (
                          <Option value={item.CROP_TYPE_NAME} key={index}>
                            {item.CROP_TYPE_NAME}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
                {isShowThirdSelectBox && (
                  <Form.Item
                    name="thirdConditionTwo"
                    className={styles.antFormItemCon}
                  >
                    <Select placeholder="请选择">
                      {operationType.map((item, index) => {
                        return (
                          <Option value={item.PUSH_CONDITION_tYPE} key={index}>
                            {item.PUSH_CONDITION_tYPE}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                )}
                {isShowThirdSelectBox && (
                  <Form.Item
                    name="thirdValueTwo"
                    className={styles.antFormItemCon}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      controls={false}
                      placeholder="请输入数字"
                    />
                  </Form.Item>
                )}
                {isShowThirdSelectBox && (
                  <span className={styles.units}>亩</span>
                )}
              </div>
            </div>
          )}
          {/* <Form.Item wrapperCol={{ span: 22 }}> */}
          <Space className={styles.btnCon}>
            <Button onClick={onReset}>重置</Button>
            <Button onClick={onBack}>返回</Button>
            {location.query.edit == '1' && (
              <Button
                type="primary"
                htmlType="submit"
                className={`${styles.resetBtnColor}`}
              >
                保 存
              </Button>
            )}
            {location.query?.push == '1' && (
              <Button
                type="primary"
                onClick={onClickPush}
                className={`${styles.resetBtnColor}`}
              >
                推送
              </Button>
            )}
          </Space>
          {/* </Form.Item> */}
        </Form>
      </div>
    </Spin>
  );
};
export default connect(({ baseModel }) => ({ baseModel }))(
  UnderstandPushPaperPage,
);
