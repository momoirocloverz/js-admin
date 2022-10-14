import axios from '../utils/axios';

export function getUsers(data: Object | undefined) {
  return axios.post('/admin/get_list', data);
}

export function createUser(data: Object | undefined) {
  return axios.post('/admin/add', data);
}

export function modifyUser(data: Object | undefined) {
  return axios.post('/admin/modify', data);
}

export function removeUser(id: number | string) {
  return axios.post('/admin/remove', { id });
}

export function toggleUserAccountStatus(data: Object | undefined) {
  return axios.post('/admin/switch_forbidden_status', data);
}
// =========================================================================
export function getRoles(data: Object | undefined) {
  return axios.post('/role/get_list', data);
}

export function getRole(id: number | string) {
  return axios.post('/role/detail', { id });
}

export function createRole(data: Object | undefined) {
  return axios.post('/role/add', data);
}

export function modifyRole(data: Object | undefined) {
  return axios.post('/role/modify', data);
}

export function removeRole(id: number | string) {
  return axios.post('/role/remove', { id });
}

// =========================================================================
export function getNavs(data: Object | undefined = {}) {
  return axios.post('/navigate/get_all_list', data);
}

export function createNav(data: Object | undefined) {
  return axios.post('/navigate/add', data);
}

export function modifyNav(data: Object | undefined) {
  return axios.post('/navigate/modify', data);
}

export function removeNav(id: number | string) {
  return axios.post('/navigate/remove', { id });
}

export function batchAddBtn(data: Object | undefined) {
  return axios.post('/navigate/batch_add_btn', data);
}

// === 首页配置 ===
// 首页封面图--分页列表
export function bannerList(data: Object | undefined) {
  return axios.post('/banner_index/get_list', data);
}
// 首页封面图--添加/编辑
export function bannerUpdate(data: Object | undefined) {
  return axios.post('/banner_index/action', data);
}
// 首页封面图--删除
export function bannerDelete(data: Object | undefined) {
  return axios.post('/banner_index/remove', data);
}

// 竞争性封面图--分页列表
export function bannerJzxList(data: Object | undefined) {
  return axios.post('/banner_project_jzx/get_list', data);
}
// 竞争性封面图--添加/编辑
export function bannerJzxUpdate(data: Object | undefined) {
  return axios.post('/banner_project_jzx/action', data);
}
// 竞争性封面图--删除
export function bannerJzxDelete(data: Object | undefined) {
  return axios.post('/banner_project_jzx/remove', data);
}

// 惠农补贴封面图--分页列表
export function bannerPhList(data: Object | undefined) {
  return axios.post('/banner_project_czbt/get_list', data);
}
// 惠农补贴封面图--添加/编辑
export function bannerPhUpdate(data: Object | undefined) {
  return axios.post('/banner_project_czbt/action', data);
}
// 惠农补贴封面图--删除
export function bannerPhDelete(data: Object | undefined) {
  return axios.post('/banner_project_czbt/remove', data);
}
