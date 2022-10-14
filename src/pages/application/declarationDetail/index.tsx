import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { message, Button } from 'antd';
import moment from 'moment';
const ProjectDeclareDetailPage = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [currentInfo, setCurrentInfo] = useState({});
  const initAction = () => {
    commitGlobalBread([
      {
        title: '申请处理',
      },
      {
        title: '项目申报管理',
      },
      {
        title: '项目申报书详情',
      },
    ]);
  };
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };
  useEffect(() => {
    initAction();
    initRequest();
  }, []);
  const initRequest = () => {
    let data = {
      declaration_history_id: location.query.id,
    };
    Apis.fetchDeclarationHistoryDetail(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          let newObj = {};
          newObj = res.data.info.history_content;
          if (res.data.info && res.data.info.history_content) {
            if (
              res.data.info.history_content.build_contents &&
              res.data.info.history_content.build_contents.length
            ) {
              var short = newObj.build_contents;
              let res = short.reduce((acc, current) => {
                return acc + current.invest_money;
              }, 0);
              newObj.total_money = res;
            }
            setCurrentInfo(newObj);
          }
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const goback = () => {
    history.goBack();
  };

  const moneyFormat = (value: any) => {
    if (value || value == 0) {
      let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
      return fix;
    }
  };

  return (
    <div className={styles.homePageCon}>
      <div className={styles.contentCon}>
        <Button
          type="primary"
          className={styles.resetGoback}
          onClick={() => goback()}
        >
          返回
        </Button>
        <div className={styles.formCon}>
          <div className={styles.displayArea}>
            <div className={styles.all}>
              <div className={styles.page}>
                <div className={styles.subject}>
                  <div>{currentInfo.project_declaration_name}</div>
                  <div>项目申报书</div>
                </div>
                <div className={styles.innerBox}>
                  <div className={`${styles.item}  ${styles.withFlex}`}>
                    <div className={styles.title}>项目名称：</div>
                    <div className={styles.content}>
                      {currentInfo.project_name}
                    </div>
                  </div>
                  <div className={`${styles.item}  ${styles.withFlex}`}>
                    <div className={styles.title}>项目地点：</div>
                    <div className={styles.content}>
                      {currentInfo.area_detail}
                    </div>
                  </div>
                  <div className={`${styles.item}  ${styles.withFlex}`}>
                    <div className={styles.title}>建设期限：</div>
                    <div className={styles.content}>
                      {currentInfo.build_start_at
                        ? moment(currentInfo.build_start_at).format('YYYY年M月')
                        : ''}
                      至
                      {currentInfo.build_end_at
                        ? moment(currentInfo.build_end_at).format('YYYY年M月')
                        : ''}
                    </div>
                  </div>
                  <div className={`${styles.item}  ${styles.withFlex}`}>
                    <div className={styles.title}>申报单位：</div>
                    <div className={styles.withMarkCon}>
                      <div className={styles.underWithMarkContent}>
                        {currentInfo.declare_unit}
                      </div>
                      <div>（ 公章 ）</div>
                    </div>
                  </div>
                  <div className={`${styles.item}  ${styles.withFlex}`}>
                    <div className={styles.divideCon}>
                      <div className={styles.title}>负责人：</div>
                      <div className={styles.divideContent}>
                        {currentInfo.unit_charge_name}
                      </div>
                    </div>
                    <div className={styles.divideCon}>
                      <div className={styles.title}>联系电话：</div>
                      <div className={styles.divideContent}>
                        {currentInfo.unit_charge_mobile}
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.item}  ${styles.withFlex}`}>
                    <div className={styles.title}>申报日期：</div>
                    <div className={styles.content}>
                      {currentInfo.start_declare_at
                        ? moment(currentInfo.start_declare_at).format(
                            'YYYY年M月D日',
                          )
                        : ''}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.page}>
                <div className={styles.tableBox}>
                  <table cellPadding={0} cellSpacing={0}>
                    <tbody>
                      <tr>
                        <td colSpan={3} className={styles.tableTitle}>
                          一、项目建设条件
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="titleResetHeight">
                          {currentInfo.build_condition}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3} className={styles.tableTitle}>
                          二、项目资金筹措
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3}>{currentInfo.fund_raise}</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className={styles.tableTitle}>
                          三、项目建设内容
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.tableSubTitle}>序号</td>
                        <td className={styles.tableSubTitle}>
                          名称、规模数量、建设标准、设备设施规格型号等，要求内容详实
                        </td>
                        <td className={styles.tableSubTitle}>投资额（万元）</td>
                      </tr>
                      {currentInfo.build_contents &&
                        currentInfo.build_contents.map(
                          (ele: any, index: any) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{ele.content}</td>
                              <td>{ele.invest_money}</td>
                            </tr>
                          ),
                        )}
                      <tr>
                        <td colSpan={2}>合计</td>
                        <td>{moneyFormat(currentInfo.total_money)}</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className={styles.tableTitle}>
                          四、建设进度安排
                        </td>
                      </tr>
                      {currentInfo.schedule_contents &&
                        currentInfo.schedule_contents.map(
                          (ele: any, index: any) => (
                            <tr key={index + Date.now()}>
                              <td>{index + 1}</td>
                              <td colSpan="2">{ele.content}</td>
                            </tr>
                          ),
                        )}
                      <tr>
                        <td colSpan={3} className={styles.tableTitle}>
                          五、项目效益分析
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3} className={styles.titleResetHeight}>
                          {currentInfo.efficiency_analysis}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3}>
                          <div className={styles.sixteentFont}>
                            申报主体承诺：
                          </div>
                          <div className={styles.sixteentFont}>
                            &nbsp;&nbsp;&nbsp;&nbsp;以上申报材料真实有效，并按期完成项目建设计划。承诺保证不出现任何项目建设违法违规行为，如出现上述问题将承担一切责任。
                          </div>
                          <br />
                          <div
                            className={`${styles.alignRight} ${styles.mr100} ${styles.sixteentFont}`}
                          >
                            负责人（签章）：
                          </div>
                          <br />
                          <div
                            className={`${styles.alignRight} ${styles.mr100} ${styles.sixteentFont}`}
                          >
                            单位（公章）：
                          </div>
                          <br />
                          <div
                            className={`${styles.alignRight}  ${styles.sixteentFont}`}
                          >
                            年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3}>
                          <div className={styles.sixteentFont}>
                            乡镇(街道)审核意见：
                          </div>
                          <br />
                          <div
                            className={`${styles.alignRight} ${styles.mr50} ${styles.sixteentFont}`}
                          >
                            负责人（签字）：&nbsp;&nbsp;&nbsp;&nbsp;（公章）
                          </div>
                          <br />
                          <div
                            className={`${styles.alignRight}  ${styles.sixteentFont}`}
                          >
                            年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(
  ProjectDeclareDetailPage,
);
