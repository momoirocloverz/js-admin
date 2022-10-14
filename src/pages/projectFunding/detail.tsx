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
  const initAction = () => {
    commitGlobalBread([
      {
        title: '资金管理',
        triggerOn: true,
      },
      {
        title: '项目资金来源',
        triggerOn: true,
      },
      {
        title: '项目资金来源查看',
      },
    ]);
  };
  const projectTypeIcon: any = {
    1: 'https://img.hzanchu.com/acimg/1f4f6b3934298977758651240d062249.png',
    2: 'https://img.hzanchu.com/acimg/0afdb17f54cbfe544331d56ca1002724.png',
    3: 'https://img.hzanchu.com/acimg/28120b2e873fa1e3a692ab30dc4b5639.png',
    4: 'https://img.hzanchu.com/acimg/a3eb533892d9092ef6675560ace7b0c8.png',
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
      title: '资金文件分项名称',
      align: 'left',
      dataIndex: 'fund_subitem_info',
      render: (_: any, record: any) => (
        <div>
          {record.fund_subitem_info && record.fund_subitem_info.subitem_name
            ? record.fund_subitem_info.subitem_name
            : '-'}
        </div>
      ),
    },
    {
      title: '资金金额（万元）',
      dataIndex: 'amount',
      align: 'left',
    },
    {
      title: '资金名称',
      dataIndex: 'amount',
      align: 'left',
      render: (_: any, record: any) => (
        <div>
          {record.project_fund_source_info &&
          record.project_fund_source_info.project_name
            ? record.project_fund_source_info.project_name
            : '-'}
        </div>
      ),
    },
    {
      title: '资金文号',
      dataIndex: 'amount',
      align: 'left',
      render: (_: any, record: any) => (
        <div className={styles.rowFlex}>
          <div>
            {record.project_fund_source_info &&
            record.project_fund_source_info.fund_number
              ? record.project_fund_source_info.fund_number
              : '-'}
          </div>
          {record.project_fund_source_info &&
          record.project_fund_source_info.project_type ? (
            <img
              className={styles.marginLeft8}
              src={
                projectTypeIcon[record.project_fund_source_info.project_type]
              }
            />
          ) : null}
        </div>
      ),
    },
    {
      title: '资金年度',
      dataIndex: 'amount',
      align: 'left',
      render: (_: any, record: any) => (
        <div>
          {record.project_fund_source_info &&
          record.project_fund_source_info.year
            ? record.project_fund_source_info.year
            : '-'}
        </div>
      ),
    },
  ];
  useEffect(() => {
    initAction();
    fetchDetail();
  }, []);
  const fetchDetail = () => {
    Apis.projectCapitalSourceInfo({ id: location.query.id })
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
  return (
    <div className={styles.homePageCon}>
      <div className={styles.leftCon}>
        <div className={styles.leftInnerCon}>
          <div className={styles.mainTitle}>项目资金来源查看</div>
          <Space direction="vertical" size={20}>
            <Row gutter={24}>
              <Col span={8}>
                <div className={styles.itemCon}>
                  <div className={styles.itemTitle}>项目名称：</div>
                  <div className={styles.itemReal}>
                    {currentDetail.project_name}
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.itemCon}>
                  <div className={styles.itemTitle}>年度：</div>
                  <div className={styles.itemReal}>{currentDetail.year}</div>
                </div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <div className={styles.itemCon}>
                  <div className={styles.itemTitle}>资金来源总额：</div>
                  <div className={`${styles.itemReal} ${styles.blueBold}`}>
                    {currentDetail.all_amount}万元
                  </div>
                </div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={20}>
                <Table
                  size="small"
                  columns={columns}
                  dataSource={
                    currentDetail.project_capital_source_rel_subitem_list
                  }
                  scroll={{ y: 250 }}
                  pagination={false}
                  rowKey="id"
                />
              </Col>
            </Row>
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
