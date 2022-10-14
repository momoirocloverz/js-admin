import styles from './detail.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import { message, Button, Form, Row, Col, Space, Table } from 'antd';
import moment from 'moment';
const ProjectReserveDetail = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [currentDetail, setCurrentDetail] = useState<any>({});
  const [form] = Form.useForm();
  const [project_typeArray, setProject_typeArray] = useState({
    1: '中央',
    2: `省级`,
    3: `市级`,
    4: `县级`,
  });
  const initAction = () => {
    commitGlobalBread([
      {
        title: '资金管理',
        triggerOn: true,
      },
      {
        title: '资金文件',
        triggerOn: true,
      },
      {
        title: '资金文件查看',
      },
    ]);
  };
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };

  const columns: any = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'left',
      width: 70,
      render: (text: any, record: any, index: number) => `${index + 1}`,
    },
    {
      title: '分项名称',
      align: 'left',
      dataIndex: 'subitem_info',
      render: (value: any) => {
        return value.subitem_name || '-';
      },
    },
    {
      title: '资金金额（万元）',
      dataIndex: 'amount',
      align: 'left',
    },
  ];

  useEffect(() => {
    initAction();
    fetchDetail();
  }, []);
  const fetchDetail = () => {
    Apis.projectFundSourceInfo({ id: location.query.id })
      .then((res: any) => {
        if (res && res.code === 0) {
          setCurrentDetail(res.data.info);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log(' err ', err);
      });
  };
  const popDetail = (item: any) => {
    window.open(item.url);
  };
  return (
    <div className={styles.homePageCon}>
      <div className={styles.leftCon}>
        <div className={styles.leftInnerCon}>
          <div className={styles.mainTitle}>资金文件查看</div>
          <Space direction="vertical" size={20}>
            <Row gutter={24}>
              <Col span={8}>
                <div className={styles.itemCon}>
                  <div className={styles.itemTitle}>文件名称：</div>
                  <div className={styles.itemReal}>
                    {currentDetail.project_name}
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.itemCon}>
                  <div className={styles.itemTitle}>资金文号：</div>
                  <div className={styles.itemReal}>
                    {currentDetail.fund_number}
                  </div>
                </div>
              </Col>
              {/* <Col span={8}>
                <div className={styles.itemCon}>
                  <div className={styles.itemTitle}>资金性质：</div>
                  <div className={styles.itemReal}>
                    {currentDetail.fund_type &&
                      fund_typeArray[currentDetail.fund_type]}
                  </div>
                </div>
              </Col> */}
              <Col span={8}>
                <div className={styles.itemCon}>
                  <div className={styles.itemTitle}>资金性质：</div>
                  <div className={styles.itemReal}>
                    {currentDetail.project_type &&
                      project_typeArray[currentDetail.project_type]}
                  </div>
                </div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <div className={styles.itemCon}>
                  <div className={styles.itemTitle}>年度：</div>
                  <div className={styles.itemReal}>{currentDetail.year}</div>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.itemCon}>
                  <div className={styles.itemTitle}>下达时间：</div>
                  <div className={styles.itemReal}>{currentDetail.xd_at}</div>
                </div>
              </Col>
            </Row>
            <Row gutter={24}>
              {/* <Col span={8}>
                <div className={styles.itemCon}>
                  <div className={styles.itemTitle}>资金总额：</div>
                  <div className={`${styles.itemReal} ${styles.blueBold}`}>
                    {currentDetail.all_amount}万元
                  </div>
                </div>
              </Col> */}
              <Col span={8}>
                <div className={styles.itemCon}>
                  <div className={styles.itemTitle}>分项总金额：</div>
                  <div className={`${styles.itemReal} ${styles.blueBold}`}>
                    {currentDetail.subitem_all_amount}万元
                  </div>
                </div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <div className={styles.itemCon}>
                  <div className={styles.itemTitle}>资金分项：</div>
                </div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={20}>
                <Table
                  size="small"
                  columns={columns}
                  dataSource={currentDetail.subitem_list}
                  scroll={{ y: 250 }}
                  pagination={false}
                  rowKey="id"
                />
              </Col>
            </Row>
            <div className={styles.flexStart}>
              <div className={styles.attachTitle}>政策文件：</div>
              {currentDetail.attachment &&
              currentDetail.attachment.length > 0 ? (
                currentDetail.attachment.map((ele: any, index: any) => (
                  <span key={index} className={styles.cursor}>
                    <span onClick={() => popDetail(ele)}>{ele.name}</span>
                  </span>
                ))
              ) : (
                <div className={styles.itemReal}>无</div>
              )}
            </div>
          </Space>
        </div>

        <div className={styles.btnCon}>
          <Button type="primary" onClick={() => history.goBack()}>
            返回
          </Button>
        </div>
      </div>
    </div>
  );
};

export default connect((baseModel) => ({ baseModel }))(ProjectReserveDetail);
