import axios from '../utils/axios';

export function getProgramFundSource(params: any) {
  return axios.post('/project_capital_source/get_list', params);
}

// 惠农补贴项目 资金拨付时 获取分项列表
export function getSubItemByDocumentId(params: any) {
  return axios.post(
    '/project_capital_source/get_sub_item_list_by_policy_document_id',
    params,
  );
}
