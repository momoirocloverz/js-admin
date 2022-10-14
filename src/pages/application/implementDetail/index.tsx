import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { message, Button, Input, Table, Pagination, Space } from 'antd';
import moment from 'moment';
moment.suppressDeprecationWarnings = true;
const ProjectImplementDetailPage = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [currentInfo, setCurrentInfo] = useState<any>({});
  const [invest_moneyTotal, setInvest_moneyTotal] = useState(0);
  const [subsidy_moneyTotal, setSubsidy_moneyTotal] = useState(0);
  const initAction = () => {
    commitGlobalBread([
      {
        title: '申请处理',
      },
      {
        title: '项目申报管理',
      },
      {
        title: '项目实施方案简表详情',
      },
    ]);
  };
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };
  const goback = () => {
    history.goBack();
  };
  useEffect(() => {
    initAction();
    initRequest();
  }, []);
  const moneyFormat = (value: any) => {
    if (value || value == 0) {
      if (value === 0) {
        return 0;
      } else {
        let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
        return fix;
      }
    }
  };
  const initRequest = () => {
    let data = {
      implement_plan_history_id: location.query.id,
    };
    Apis.fetchImplementPlanHistoryDetail(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          let newObj: any = {};
          newObj = res.data.info.history_content;
          newObj.part1 = newObj.part_options.find((ele: any) => {
            return ele.option_name == '基础设施建设';
          })?.list;
          newObj.part2 = newObj.part_options.find((ele: any) => {
            return ele.option_name == '设施设备';
          })?.list;
          newObj.part3 = newObj.part_options.find((ele: any) => {
            return ele.option_name == '其他';
          })?.list;

          let temp1 =
            newObj.part1?.map((ele: any) => {
              if (!ele.invest_money || !ele.subsidy_money) {
                return {
                  ...ele,
                  invest_money: ele.invest_money ? ele.invest_money : 0,
                  subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0,
                };
              } else {
                return {
                  ...ele,
                };
              }
            }) || [];
          let temp2 =
            newObj.part2?.map((ele: any) => {
              if (!ele.invest_money || !ele.subsidy_money) {
                return {
                  ...ele,
                  invest_money: ele.invest_money ? ele.invest_money : 0,
                  subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0,
                };
              } else {
                return {
                  ...ele,
                };
              }
            }) || [];
          let temp3 =
            newObj.part3?.map((ele: any) => {
              if (!ele.invest_money || !ele.subsidy_money) {
                return {
                  ...ele,
                  invest_money: ele.invest_money ? ele.invest_money : 0,
                  subsidy_money: ele.subsidy_money ? ele.subsidy_money : 0,
                };
              } else {
                return {
                  ...ele,
                };
              }
            }) || [];

          let tempMaster = [...temp1, ...temp2, ...temp3];
          let res1 = tempMaster.reduce((acc, current) => {
            return acc + current.invest_money;
          }, 0);
          let res2 = tempMaster.reduce((acc, current) => {
            return acc + current.subsidy_money;
          }, 0);
          setInvest_moneyTotal(res1);
          setSubsidy_moneyTotal(res2);
          setCurrentInfo(newObj);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const getPart3Index = () => {
    const { part1, part2, part3 } = currentInfo;
    if (part3) {
      if (part1?.length && part2?.length) {
        return '3';
      } else if (!(part1?.length || part2?.length)) {
        return '1';
      } else {
        return '2';
      }
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
            <div className={styles.page}>
              <div className={styles.subject}>
                <div>{currentInfo.project_declaration_name}</div>
                <div>实施方案简表</div>
              </div>
              <div className={styles.tableBox}>
                <table cellPadding={0} cellSpacing={0}>
                  <tbody>
                    <tr>
                      <td className={styles.tableTitle}>一</td>
                      <td className={styles.tableTitle}>项目名称</td>
                      <td colSpan={6}>{currentInfo.project_name}</td>
                    </tr>
                    <tr>
                      <td className={styles.tableTitle}>二</td>
                      <td className={styles.tableTitle}>建设单位( 印 )</td>
                      <td colSpan={3}>{currentInfo.declare_unit}</td>
                      <td>负责人及电话</td>
                      <td colSpan={2}>
                        {currentInfo.unit_charge_name}-
                        {currentInfo.unit_charge_mobile}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.tableTitle}>三</td>
                      <td className={styles.tableTitle}>项目建设地点</td>
                      <td colSpan={6}>{currentInfo.area_detail}</td>
                    </tr>
                    <tr>
                      <td className={styles.tableTitle}>四</td>
                      <td className={styles.tableTitle}>土地性质或来源</td>
                      <td colSpan={6}>{currentInfo.land_info}</td>
                    </tr>
                    <tr>
                      <td className={styles.tableTitle}>五</td>
                      <td className={styles.tableTitle}>项目建设期限</td>
                      <td colSpan={6}>
                        {currentInfo.build_start_at
                          ? moment(currentInfo.build_start_at).format(
                              'YYYY年M月',
                            )
                          : ''}
                        至
                        {currentInfo.build_end_at
                          ? moment(currentInfo.build_end_at).format('YYYY年M月')
                          : ''}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.tableTitle}>六</td>
                      <td className={styles.tableTitle}>主要建设内容</td>
                      <td colSpan={6} className={styles.resetHeight}>
                        {currentInfo.build_main_content}
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.tableTitle}>七</td>
                      <td className={styles.tableTitle}>项目建设分项名称</td>
                      <td>建设地点</td>
                      <td>规模（数量）</td>
                      <td>投资（万元）</td>
                      <td>其中财政补助（万元）</td>
                      <td colSpan={2} style={{ textAlign: 'center' }}>
                        进度安排
                      </td>
                    </tr>

                    {currentInfo.part1 && currentInfo.part1.length > 0 && (
                      <>
                        <tr>
                          <td className={styles.center}>分项1</td>
                          <td className={styles.tableTitle}>基础设施建设</td>
                          <td colSpan={6}></td>
                        </tr>
                        {currentInfo.part1 &&
                          currentInfo.part1.map((ele: any, index: any) => (
                            <tr key={index}>
                              <td className={styles.center}>{index + 1}</td>
                              <td>{ele.name}</td>
                              <td>{ele.location}</td>
                              {/* <td>{ele.declare_unit}</td> */}
                              <td>{ele.scale}</td>
                              <td>{ele.invest_money}</td>
                              <td>{ele.subsidy_money}</td>
                              <td colSpan={2}>
                                {ele.schedule_start_at
                                  ? moment(ele.schedule_start_at).format(
                                      'YYYY年M月',
                                    )
                                  : ''}
                                至
                                {ele.schedule_end_at
                                  ? moment(ele.schedule_end_at).format(
                                      'YYYY年M月',
                                    )
                                  : ''}
                              </td>
                            </tr>
                          ))}
                      </>
                    )}

                    {currentInfo.part2 && currentInfo.part2.length > 0 && (
                      <>
                        <tr>
                          <td className={styles.center}>
                            分项{currentInfo.part1?.length > 0 ? '2' : '1'}
                          </td>
                          <td className={styles.tableTitle}>设施设备</td>
                          <td colSpan={6}></td>
                        </tr>
                        {currentInfo.part2 &&
                          currentInfo.part2.map((ele: any, index: any) => (
                            <tr key={index}>
                              <td className={styles.center}>{index + 1}</td>
                              <td>{ele.name}</td>
                              <td>{ele.location}</td>
                              {/* <td>{ele.declare_unit}</td> */}
                              <td>{ele.scale}</td>
                              <td>{ele.invest_money}</td>
                              <td>{ele.subsidy_money}</td>
                              <td colSpan={2}>
                                {ele.schedule_start_at
                                  ? moment(ele.schedule_start_at).format(
                                      'YYYY年M月',
                                    )
                                  : ''}
                                至
                                {ele.schedule_end_at
                                  ? moment(ele.schedule_end_at).format(
                                      'YYYY年M月',
                                    )
                                  : ''}
                              </td>
                            </tr>
                          ))}
                      </>
                    )}

                    {currentInfo.part3 && currentInfo.part3.length > 0 && (
                      <>
                        <tr>
                          <td className={styles.center}>
                            分项{getPart3Index()}
                          </td>
                          <td className={styles.tableTitle}>其他</td>
                          <td colSpan={6}></td>
                        </tr>
                        {currentInfo.part3 &&
                          currentInfo.part3.map((ele: any, index: any) => (
                            <tr key={index}>
                              <td className={styles.center}>{index + 1}</td>
                              <td>{ele.name}</td>
                              <td>{ele.location}</td>
                              {/* <td>{ele.declare_unit}</td> */}
                              <td>{ele.scale}</td>
                              <td>{ele.invest_money}</td>
                              <td>{ele.subsidy_money}</td>
                              <td colSpan={2}>
                                {ele.schedule_start_at
                                  ? moment(ele.schedule_start_at).format(
                                      'YYYY年M月',
                                    )
                                  : ''}
                                至
                                {ele.schedule_end_at
                                  ? moment(ele.schedule_end_at).format(
                                      'YYYY年M月',
                                    )
                                  : ''}
                              </td>
                            </tr>
                          ))}
                      </>
                    )}

                    <tr>
                      <td></td>
                      <td>合计</td>
                      <td></td>
                      <td></td>
                      <td>{moneyFormat(invest_moneyTotal)}</td>
                      <td>{moneyFormat(subsidy_moneyTotal)}</td>
                      <td colSpan={2}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect()(ProjectImplementDetailPage);
