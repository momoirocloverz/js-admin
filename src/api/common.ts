import axios from '../utils/axios';

export function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post('/upload/upload_images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function getSideNavs() {
  return axios.post('/admin/get_permissions_navigate_list');
}

export function mock() {
  return Promise.resolve({
    code: 0,
    data: [],
    msg: 'mock'
  })
}
