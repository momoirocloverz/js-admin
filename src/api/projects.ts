import axios from '../utils/axios';

export function getPayments(data: Object | undefined) {
  return axios.post('/project/amount_apply/list', data);
}

export function resolvePayment(data: Object | undefined) {
  return axios.post('/project/amount_apply/check', data);
}

export function getPaymentDetails(id: number) {
  return axios.post('/project/amount_apply/info', { id: id });
}

// 获取某项目所有资金拨付申请记录
export function getPaymentApplyList(data: Object) {
  return axios.post('/project_amount_apply/get_list_by_project_id', data);
}
// =========================================================================

export function getAllProjects(data: Object | undefined) {
  return axios.post('/project/get_all_project_list', data);
}
export function getdeclareProjects(data: Object | undefined) {
  return axios.post('/project/get_list', data);
}

export function getInProgressProjects(data: Object | undefined) {
  return axios.post('/project/report/list', data);
}

export function getImplementProjects(data?: Object) {
  return axios.post('/project_report/get_list', data);
}

export function getProgressReports(data: Object | undefined) {
  return axios.post('/project/report_info/list', data);
}
export function getContractModificationRequest(id: string | number) {
  return axios.post('/project/change_apply/info', { project_id: id });
}

export function getPaymentsProjects(data: Object | undefined) {
  return axios.post('/project_amount_apply/get_list', data);
}

export function resolveModificationRequest(data: Object) {
  return axios.post('/project/change_apply/check', data);
}

// =========================================================================

export function getEvaluationReports(data: Object | undefined) {
  return axios.post('/project_ys/get_list', data);
}

export function getEvaluationReportDetails(id: number) {
  return axios.post('/project_ys/detail', { project_id: id });
}

export function getHistory(data: Object) {
  return axios.post('/project/project_declaration_record_list', data);
}
export function resolveEvaluation(data: Object) {
  return axios.post('/project_ys/action_ys', data);
}

// =========================================================================

// 项目储备审核
export function approvalProjectReserve(data: Object) {
  return axios.post('/project_reserve/audit', data);
}

// 获取政策文件列表
export function getDocumentList(data: Object) {
  return axios.post('/policy_document/list', data);
}

// 资金下达信息编辑
export function editFundInfo(data?: Object) {
  return axios.post('/policy_document/funds/edit', data);
}

// 资金下达信息详情
export function getFundInfo(data?: Object) {
  return axios.post('/policy_document/funds/info', data);
}

// 获取项目类型列表
export function getCategory(data?: Object) {
  return axios.post('/policy_category/list', data);
}

// 获取项目储备列表
export function getReserveList(data?: Object) {
  return axios.post('/project_reserve/get_list', data);
}

export function fileIssuedList(data: Object | undefined) {
  return axios.post('/file_issued/get_list', data);
}

export function fileIssuedRemove(data: Object | undefined) {
  return axios.post('/file_issued/remove', data);
}

export function fileIssuedAction(data: Object | undefined) {
  return axios.post('/file_issued/action', data);
}
export function getWaitNum(data: any) {
  return axios.post('/project_navigate/get_wait_num', data);
}

export function makeProjectYsWord(data: any) {
  return axios.post('/project_ys/make_project_ys_word', data);
}
export function exportUnitProjectList(data: any) {
  return axios({
    url: `/project/export_unit_project_list`,
    method: 'post',
    responseType: 'blob',
    data,
  });
}

export function exportProjectYsCollectList(data: any) {
  return axios({
    url: `/project_ys/export_project_ys_collect_list
    `,
    method: 'post',
    responseType: 'blob',
    data,
  });
}

export function amountApplyDownloadWord(data: any) {
  return axios({
    url: `/project_amount_apply/download_word
    `,
    method: 'post',
    responseType: 'blob',
    data,
  });
}

export function exportProjectReportList(data: any) {
  return axios({
    url: `/project_report/export_project_report_list`,
    method: 'post',
    responseType: 'blob',
    data,
  });
}

// export function exportProjectReportList(data: any) {
//   return axios({
//     url: `/project_report/export_project_report_list`,
//     method: 'post',
//     responseType: 'blob',
//     data,
//   });
// }

/**
 * 2.20.0版本表格重构 区分pc和移动端治理端的列表接口 start
 */
// pc-获取全部项目
export function getPCAllProjects(data: Object | undefined) {
  return axios.post('/project/get_pc_all_project_list', data);
}
// pc-获取申报管理列表
export function getPCProjectDeclareList(data: Object | undefined) {
  return axios.post('/project/get_pc_list', data);
}
// pc-获取实施管理列表
export function getPCProjectImplementList(data: Object | undefined) {
  return axios.post('/project_report/get_pc_list', data);
}
// pc-获取实施管理列表
export function getPCProjectAcceptList(data: Object | undefined) {
  return axios.post('/project_ys/get_pc_list', data);
}
// pc-获取项目储备列表
export function getPCProjectReserveList(data: Object | undefined) {
  return axios.post('/project_reserve/get_pc_list', data);
}
/**
 * 2.20.0版本表格重构 区分pc和移动端治理端的列表接口 end
 */
