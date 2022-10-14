import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { message, Button } from 'antd';
const ProjectFacilityDetailPage = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [currentInfo, setCurrentInfo] = useState({});
  const [total_money, setTotal_money] = useState(0);
  const initAction = () => {
    commitGlobalBread([
      {
        title: '申请处理',
      },
      {
        title: '项目申报管理',
      },
      {
        title: '项目购置设备设施清单详情',
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
  const calcFunction = (array: any) => {
    let temp = array.map((ele) => {
      if (!ele.money || !ele.number) {
        return {
          ...ele,
          money: ele.money ? ele.money : 0,
          number: ele.number ? ele.number : 0,
        };
      } else {
        return {
          ...ele,
        };
      }
    });
    let res = temp.reduce((acc, current) => {
      return acc + current.money * current.number;
    }, 0);
    return res;
  };
  useEffect(() => {
    initAction();
    initRequest();
  }, []);
  const initRequest = () => {
    let data = {
      facility_list_history_id: location.query.id,
    };
    Apis.fetchFacilityHistoryList(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          let newObj = {};
          newObj = res.data.info.history_content;
          if (newObj.facility_list) {
            let final = calcFunction(newObj.facility_list);
            setTotal_money(final);
          }
          setCurrentInfo(newObj);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
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
            <div className={styles.page}>
              <div className={styles.subject}>实施方案简表</div>
              <div className={styles.tableBox}>
                <table cellPadding={0} cellSpacing={0}>
                  <tbody>
                    <tr>
                      <th>设备名称</th>
                      <th>数量</th>
                      <th>单价(万元)</th>
                      <th>金额(万元)</th>
                    </tr>
                    {currentInfo.facility_list &&
                      currentInfo.facility_list.map((ele: any, index: any) => (
                        <tr key={index}>
                          <td>{ele.name}</td>
                          <td>{ele.number}</td>
                          <td>{ele.money}</td>
                          <td>{moneyFormat(ele.money * ele.number)}</td>
                        </tr>
                      ))}
                    <tr>
                      <td colSpan={3}>合计</td>
                      <td>{moneyFormat(total_money)}</td>
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

export default connect(({ baseModel }) => ({ baseModel }))(
  ProjectFacilityDetailPage,
);
