import axios from '../utils/axios';

export function getFeedbacks(data: Object | undefined) {
  return axios.post('/feedback/list', data);
}

export function markAsResolved(id: number | string) {
  return axios.post('/feedback/check', { id, is_check: 2});
}
