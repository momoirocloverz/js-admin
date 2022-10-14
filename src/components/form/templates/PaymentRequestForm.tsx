import styles from './basicForm.less';
import { changeNumMoneyToChinese } from '@/utils/common';
import { amountApplyDownloadWord } from '@/api/projects';
import { Button } from 'antd';
export default function PaymentRequestForm({ data = {} }) {
  const date = new Date(data.apply_at);
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
  const downloadAction = () => {
    amountApplyDownloadWord({ project_amount_apply_id: data.id })
      .then((res) => {
        if (res) {
          const content = res;
          const blob = new Blob([content]);
          const fileName =
            '江山市农业农村局财政专项资金拨款申请表' + Date.now() + '.doc';
          if ('download' in document.createElement('a')) {
            const elink = document.createElement('a');
            elink.download = fileName;
            elink.style.display = 'none';
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else {
            navigator.msSaveBlob(blob, fileName);
          }
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  return (
    <div className={styles.customForm}>
      <h3>江山市农业农村局财政专项资金拨款申请表</h3>
      <div>
        <div style={{ display: 'flex' }}>
          <span className={styles.inlineField}>
            申请单位（盖章）: {data.apply_unit}
          </span>
          <span className={styles.inlineField} style={{ marginLeft: 'auto' }}>
            申请时间:
            {` ${date.getFullYear() || '----'}年${
              date.getMonth() + 1 || '--'
            }月${date.getDate() || '--'}日`}
          </span>
        </div>
      </div>
      <div>
        <table cellPadding={0} cellSpacing="0">
          <colgroup>
            <col style={{ width: '15px' }} />
            <col />
            <col />
            <col />
            <col />
            <col />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row" colSpan={2}>
                项目名称
              </th>
              <td colSpan={5}>{data.project_name}</td>
            </tr>
            <tr>
              <th scope="row" colSpan={2}>
                负责人
              </th>
              <td>{data.principal}</td>
              <td>经手人</td>
              <td> {data.pass_person}</td>
              <td>联系电话</td>
              <td> {data.link_mobile}</td>
            </tr>
            <tr style={{ height: '60px' }}>
              <th scope="row" colSpan={2}>
                项目主要建设内容
              </th>
              <td colSpan={5}>{data.construction_content}</td>
            </tr>
            <tr style={{ height: '60px' }}>
              <th scope="row" colSpan={2}>
                项目实施情况及进度
              </th>
              <td colSpan={5}>{data.progress}</td>
            </tr>
            <tr>
              <th scope="row" rowSpan={4}>
                申请拨款
              </th>
              <th>依据</th>
              <td colSpan={3}>{data.allotment_according}</td>
              <td>计划补助金额（万元）</td>
              <td>{data.plan_subsidy}</td>
            </tr>
            <tr>
              <th scope="row">已补助金额</th>
              <td colSpan={5}>
                人民币（大写）
                {data.already_subsidy ? (
                  <span>
                    {+data.already_subsidy
                      ? changeNumMoneyToChinese(+data.already_subsidy * 10000)
                      : changeNumMoneyToChinese('0')}
                  </span>
                ) : null}
                <span>￥：{moneyFormat(+data.already_subsidy * 10000)}</span>
              </td>
            </tr>
            <tr>
              <th scope="row">本次申报金额</th>
              <td colSpan={5}>
                人民币（大写）
                {data.apply_amount ? (
                  <span>
                    {+data.apply_amount
                      ? changeNumMoneyToChinese(+data.apply_amount * 10000)
                      : changeNumMoneyToChinese('0')}
                  </span>
                ) : null}
                <span>￥：{moneyFormat(+data.apply_amount * 10000)}</span>
              </td>
            </tr>
            <tr>
              <th scope="row">累计补助金额</th>
              <td colSpan={5}>
                人民币（大写）
                {data.total_subsidy ? (
                  <span>
                    {+data.total_subsidy
                      ? changeNumMoneyToChinese(+data.total_subsidy * 10000)
                      : changeNumMoneyToChinese('0')}
                  </span>
                ) : null}
                <span>￥：{moneyFormat(+data.total_subsidy * 10000)}</span>
              </td>
            </tr>
            <tr>
              <th scope="row" colSpan={2}>
                开户银行及账号
              </th>
              <td colSpan={5}>{`${data.bank || ''}: ${
                data.bank_account || ''
              }`}</td>
            </tr>
            <tr style={{ height: '60px' }}>
              <th scope="row" colSpan={2}>
                项目管理责任单位负责人建议
              </th>
              <td colSpan={5}>{data.principal_reason}</td>
            </tr>
            <tr style={{ height: '60px' }}>
              <th scope="row" colSpan={2}>
                分管领导意见
              </th>
              <td colSpan={5}>{data.leader_reason}</td>
            </tr>
            <tr style={{ height: '60px' }}>
              <th scope="row" colSpan={2}>
                主要领导意见
              </th>
              <td colSpan={5}>{data.important_reason}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {data.id ? (
        <div className={styles.endHere}>
          <Button type="primary" onClick={() => downloadAction()}>
            导出专项资金拨款申请表
          </Button>
        </div>
      ) : null}
    </div>
  );
}
