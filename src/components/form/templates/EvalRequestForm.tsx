import styles from './basicForm.less';

export default function EvalRequestForm({ data = {} }) {
  const date = new Date(data.apply_at);

  return (
    <div className={styles.customForm}>
      <h3>江山市农业农村局财政支农项目验收申请书</h3>
      <div>
        <div style={{ display: 'flex' }}>
          <span className={styles.inlineField}>
            申请验收单位: {data.declare_unit}
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
            <col />
            <col />
            <col />
            <col />
            <col />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">申请验收项目名称</th>
              <td colSpan={5}>{data.project_name}</td>
            </tr>
            <tr>
              <th scope="row">申请单位负责人</th>
              <td>{data.unit_charge_name}</td>
              <td>联系人</td>
              <td> {data.unit_linker_name}</td>
              <td>联系电话</td>
              <td> {data.unit_charge_mobile}</td>
            </tr>
            <tr>
              <th scope="row">申请验收项目建设地点</th>
              <td colSpan={5}>{data.full_area}</td>
            </tr>
            <tr style={{ height: '60px' }}>
              <th scope="row">项目计划建设内容</th>
              <td colSpan={5}>{data.build_plan_content}</td>
            </tr>
            <tr style={{ height: '60px' }}>
              <th scope="row">建设内容完成情况</th>
              <td colSpan={5}>{data.build_complete_content}</td>
            </tr>
            <tr>
              <th scope="row">财务（资金）执行情况</th>
              <td colSpan={5}>{data.fund_exec_content}</td>
            </tr>
            <tr style={{ height: '60px' }}>
              <th scope="row">申请单位意见</th>
              {/* <td colSpan={5} >{data.applicant_content}</td> */}
              <td colSpan={5}>
                <br />
                <div>
                  本单位已经按要求完成项目建设任务，提供的项目验收资料真实有效，如有虚假愿承担一切责任。
                </div>
                <br />
                <div
                  className={styles.startCon}
                  style={{
                    paddingLeft: '30px',
                  }}
                >
                  <span>(单位盖章)</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>经手人：</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>负责人：</span>
                </div>
                <br />
                <div
                  className={styles.endCon}
                  style={{
                    paddingRight: '60px',
                  }}
                >
                  年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日
                </div>
                <br />
              </td>
            </tr>

            <tr style={{ height: '60px' }}>
              <th scope="row">项目管理责任单位审查意见</th>
              {/* <td colSpan={5} >{data.applicant_content}</td> */}
              <td colSpan={5}>
                <br />
                <div
                  className={styles.startCon}
                  style={{
                    paddingLeft: '30px',
                  }}
                >
                  <span>(单位盖章)</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>经手人：</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>负责人：</span>
                </div>
                <br />
                <div
                  className={styles.endCon}
                  style={{
                    paddingRight: '60px',
                  }}
                >
                  年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日
                </div>
                <br />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
