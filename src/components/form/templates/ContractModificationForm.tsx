import styles from './basicForm.less';
import moment from 'moment';

export default function ContractModificationForm({ data = {} }) {
  const date = new Date(data.created_at);

  return (
    <div className={styles.customForm}>
      <h3>财政支农项目建设内容变更申请表</h3>
      <section>
        <div className={styles.flexBetween}>
          <div>申请单位（盖章）: {data.apply_unit}</div>
          <div>联系人: {data.link_person}</div>
        </div>
        <div className={styles.flexBetween}>
          <div>联系电话: {data.link_mobile}</div>
          <div>
            申请时间:
            {`${date.getFullYear() || '-----'}年${
              date.getMonth() + 1 || '--'
            }月${date.getDate() || '--'}日`}
          </div>
        </div>
      </section>
      <table cellPadding="0" cellSpacing="0">
        <colgroup>
          <col width="100" />
          <col width="100" />
          <col />
          <col width="100" />
          <col width="100" />
          <col width="100" />
          <col width="100" />
          <col width="100" />
        </colgroup>
        <tbody>
          <tr>
            <th scope="row">项目名称</th>
            <td colSpan={7}>{data.project_name}</td>
          </tr>
          <tr>
            <th scope="row">文件名称</th>
            <td colSpan={5}>{data.project_name}</td>
            <td>文号</td>
            <td>{data.file_name}</td>
          </tr>
          <tr style={{ height: '80px' }}>
            <th scope="row">文件下达的建设计划</th>
            <td colSpan={7}>{data.construction_content}</td>
          </tr>
          <tr style={{ height: '80px' }}>
            <th scope="row">延期时间</th>
            <td colSpan={7}>
              {data.delay_start_date
                ? moment(data.delay_start_date).format('YYYY年M月D日')
                : '未延期'}
            </td>
          </tr>
          <tr style={{ height: '80px' }}>
            <th scope="row">申请变更内容</th>
            {/* {data.change_apply_content} */}
            <td
              colSpan={7}
              dangerouslySetInnerHTML={{ __html: data.change_apply_content }}
            ></td>
          </tr>
          <tr style={{ height: '80px' }}>
            <th scope="row">申请变更原因</th>
            <td colSpan={7}>{data.apply_reason}</td>
          </tr>
          <tr style={{ height: '80px' }}>
            <th scope="row">变更后项目建设计划</th>
            <td colSpan={7}>{data.after_build_plan}</td>
          </tr>
          <tr style={{ height: '80px' }}>
            <th scope="row">项目主管部门审核意见</th>
            <td colSpan={7}>{data.check_reason}</td>
          </tr>
          <tr style={{ height: '80px' }}>
            <th scope="row">备注</th>
            <td colSpan={7}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
