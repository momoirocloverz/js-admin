import axios from '../utils/axios';

// 明白纸推送历史草稿--分页列表
export function understandPaperList(data?: Object) {
  return axios.post('/understand_paper_push_history/get_list', data);
}

// 明白纸推送历史草稿--详情
export function understandPaperPushDetail(data?: Object) {
  return axios.post('/understand_paper_push_history/get_info', data);
}

// 白纸推送历史草稿--编辑
export function understandPaperPushUpdate(data?: Object) {
  return axios.post('/understand_paper_push_history/action', data);
}

// 白纸推送历史草稿--删除
export function understandPaperPushDelete(data?: Object) {
  return axios.post('/understand_paper_push_history/remove', data);
}

// 白纸推送历史草稿--执行推送
export function understandPaperPushExecute(data?: Object) {
  return axios.post('/understand_paper_push_history/push', data);
}

