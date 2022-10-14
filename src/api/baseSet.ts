import axios from '../utils/axios';

// 指导单事项--不分页列表 -- v3.2.2
export function getGuideItemGetAllList(params: any) {
    return axios.post('/guide_item/get_all_list', params);
}

// 指导单事项--分页列表 -- v3.2.2
export function getGuideItemGetList(params: any) {
    return axios.post('/guide_item/get_list', params);
}

// 指导单事项--切换启禁用状态 -- v3.2.2
export function getGuideItemSwitchStatus(params: any) {
    return axios.post('/guide_item/switch_status', params);
}

// 指导单事项--不分页列表 -- v3.2.2
export function getGuideItemRemove(params: any) {
    return axios.post('/guide_item/remove', params);
}

// 指导单事项--添加/编辑 -- v3.2.2
export function getGuideItemAction(params: any) {
    return axios.post('/guide_item/action', params);
}



