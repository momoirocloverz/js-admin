import styles from './table.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { message, Button } from 'antd';
import moment from 'moment';
const ProjectDeclareDetailPage = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [currentInfo, setCurrentInfo] = useState({});
  const [invest_moneyTotal, setInvest_moneyTotal] = useState(0);
  const [globalInfo, setGlobalInfo] = useState({});
  const [subsidy_moneyTotal, setSubsidy_moneyTotal] = useState(0);
  const initAction = () => {
    commitGlobalBread([
      {
        title: '投资项目管理',
      },
      {
        title: '项目赋码详情',
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
    if (location.query.id) {
      let data = {
        id: location.query.id,
      };
      Apis.projectReserveDetail(data)
        .then((res: any) => {
          if (res && res.code === 0) {
            setGlobalInfo(res.data.info);
            if (res.data.info && res.data.info.part_options) {
              let after = res.data.info.part_options;
              let newObj = {};
              newObj = after;
              newObj.part1 =
                after.find((ele: any) => {
                  return ele.option_name == '基础设施建设';
                }).list || [];
              newObj.part2 =
                after.find((ele: any) => {
                  return ele.option_name == '设施设备';
                }).list || [];
              newObj.part3 =
                after.find((ele: any) => {
                  return ele.option_name == '技术引进推广';
                }).list || [];
              newObj.part4 =
                after.find((ele: any) => {
                  return ele.option_name == '其他';
                }).list || [];

              let temp1 = newObj.part1.map((ele: any) => {
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
              });
              let temp2 = newObj.part2.map((ele: any) => {
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
              });
              let temp3 = newObj.part3.map((ele: any) => {
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
              });

              let temp4 = newObj.part4.map((ele: any) => {
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
              });
              let tempMaster = [...temp1, ...temp2, ...temp3, ...temp4];
              let res1 = tempMaster.reduce((acc, current) => {
                return +acc + +current.invest_money;
              }, 0);
              let res2 = tempMaster.reduce((acc, current) => {
                return +acc + +current.subsidy_money;
              }, 0);
              setInvest_moneyTotal(res1);
              setSubsidy_moneyTotal(res2);
              setCurrentInfo(newObj);
            }
          } else {
            message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  };
  const goback = () => {
    history.goBack();
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

  const getPart4Index = () => {
    const { part1, part2, part3, part4 } = currentInfo;
    if (part4) {
      if (part4.length) {
        if (
          part1 &&
          part1.length &&
          part2 &&
          part2.length &&
          part3 &&
          part3.length
        ) {
          return '4';
        } else if (part1?.length && part2?.length) {
          return '3';
        } else if (!(part1?.length || part2?.length)) {
          return '1';
        } else {
          return '2';
        }
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
            <div className={styles.all}>
              <div className={styles.subject}>项目申报表</div>
              <div className={styles.page}>
                <div className={styles.tableBox}>
                  <table cellPadding={0} cellSpacing={0}>
                    <tbody>
                      <tr>
                        <td className={styles.center}>一</td>
                        <td className={styles.tableSubTitle}>项目名称</td>
                        <td className={styles.tableSubTitle} colSpan={7}>
                          {globalInfo.project_name || '-'}
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.center} rowSpan={2}>
                          二
                        </td>
                        <td className={styles.tableSubTitle}>
                          项目实施单位(印)
                        </td>
                        <td className={styles.tableSubTitle} colSpan={7}>
                          {globalInfo.project_ss_unit || '-'}
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.tableSubTitle}>负责人</td>
                        <td className={styles.tableSubTitle} colSpan={2}>
                          {globalInfo.unit_charge_name || '-'}
                        </td>
                        <td className={styles.tableSubTitle}>联系电话</td>
                        <td className={styles.tableSubTitle} colSpan={5}>
                          {globalInfo.unit_charge_mobile || '-'}
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.center}>三</td>
                        <td className={styles.tableSubTitle}>项目建设对点</td>
                        <td className={styles.tableSubTitle} colSpan={7}>
                          {globalInfo.project_build_area || '-'}
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.center}>四</td>
                        <td className={styles.tableSubTitle}>土地性质或来源</td>
                        <td className={styles.tableSubTitle} colSpan={7}>
                          {globalInfo.land_nature_source || '-'}
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.center}>五</td>
                        <td className={styles.tableSubTitle}>项目建设期限</td>
                        <td className={styles.tableSubTitle} colSpan={7}>
                          {globalInfo.build_start_at
                            ? moment(globalInfo.build_start_at).format(
                                'YYYY年M月',
                              )
                            : ''}
                          至
                          {globalInfo.build_end_at
                            ? moment(globalInfo.build_end_at).format(
                                'YYYY年M月',
                              )
                            : ''}
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.center}>六</td>
                        <td className={styles.tableSubTitle}>
                          建设规模及主要建设内容
                        </td>
                        <td className={styles.tableSubTitle} colSpan={7}>
                          {globalInfo.build_contents &&
                            globalInfo.build_contents.map((ele) => (
                              <div> {ele.content}</div>
                            ))}
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.tableTitle}>七</td>
                        <td className={styles.tableTitle}>项目建设分项名称</td>
                        <td>规格（型号）</td>
                        <td>规模（数量）</td>
                        <td>总投资（万元）</td>
                        <td>其中财政补助（万元）</td>
                        <td colSpan={2} style={{ textAlign: 'center' }}>
                          进度安排
                        </td>
                        <td>资金来源</td>
                      </tr>
                      {currentInfo.part1 && currentInfo.part1.length > 0 && (
                        <>
                          <tr>
                            <td className={styles.center}>分项1</td>
                            <td className={styles.tableTitle}>基础设施建设</td>
                            <td colSpan={7}></td>
                          </tr>
                          {currentInfo.part1 &&
                            currentInfo.part1.map((ele: any, index: any) => (
                              <tr key={index}>
                                <td className={styles.center}>{index + 1}</td>
                                <td>{ele.name}</td>
                                <td>{ele.spec}</td>
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
                                <td>{ele.fund_source}</td>
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
                            <td colSpan={7}></td>
                          </tr>
                          {currentInfo.part2 &&
                            currentInfo.part2.map((ele: any, index: any) => (
                              <tr key={index}>
                                <td className={styles.center}>{index + 1}</td>
                                <td>{ele.name}</td>
                                <td>{ele.spec}</td>
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
                                <td>{ele.fund_source}</td>
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
                            <td className={styles.tableTitle}>技术引进推广</td>
                            <td colSpan={7}></td>
                          </tr>
                          {currentInfo.part3 &&
                            currentInfo.part3.map((ele: any, index: any) => (
                              <tr key={index}>
                                <td className={styles.center}>{index + 1}</td>
                                <td>{ele.name}</td>
                                <td>{ele.spec}</td>
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
                                <td>{ele.fund_source}</td>
                              </tr>
                            ))}
                        </>
                      )}

                      {currentInfo.part4 && currentInfo.part4.length > 0 && (
                        <>
                          <tr>
                            <td className={styles.center}>
                              分项{getPart4Index()}
                            </td>
                            <td className={styles.tableTitle}>其他</td>
                            <td colSpan={7}></td>
                          </tr>
                          {currentInfo.part4 &&
                            currentInfo.part4.map((ele: any, index: any) => (
                              <tr key={index}>
                                <td className={styles.center}>{index + 1}</td>
                                <td>{ele.name}</td>
                                <td>{ele.spec}</td>
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
                                <td>{ele.fund_source}</td>
                              </tr>
                            ))}
                        </>
                      )}
                      <tr>
                        {/* <td></td>
                        <td>合计</td>
                        <td></td>
                        <td></td>
                       
                        <td></td>
                        <td>{moneyFormat(subsidy_moneyTotal)}万元</td>
                        <td colSpan={2}></td>
                        <td></td> */}

                        <td></td>
                        <td>合计</td>

                        <td colSpan={7} className={styles.center}>
                          {moneyFormat(invest_moneyTotal)}万元
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.center} rowSpan={2}>
                          八
                        </td>
                        <td className={styles.tableSubTitle} rowSpan={2}>
                          资金来源说明
                        </td>
                        <td className={styles.tableSubTitle}>省补助资金</td>
                        <td className={styles.tableSubTitle} colSpan={6}>
                          {globalInfo.province_amount || '-'}万元
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.tableSubTitle}>地方投入</td>
                        <td className={styles.tableSubTitle} colSpan={6}>
                          {/* {globalInfo.place_amount || '-'} */}
                          <span>
                            地方财政资金整合：{globalInfo.place_amount || '-'}
                            万元
                          </span>
                          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;
                          &nbsp; &nbsp;
                          <span>
                            自筹资金：{globalInfo.self_amount || '-'}
                            万元
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.center}>九</td>
                        <td className={styles.tableSubTitle}>
                          新增生产能力和效益分析
                        </td>
                        <td className={styles.tableSubTitle} colSpan={7}>
                          {globalInfo.product_benefit || '-'}
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
