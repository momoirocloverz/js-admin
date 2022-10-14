export const actionTypes = Object.freeze({
  1: '材料提交',
  2: '通过',
  3: '驳回',
});

// 0=项目验收未验收(相当于验收材料未填写) 1=项目验收待审核 2=项目验收已验收 9=项目验收不通过
export const EVALUATION_STATUS = Object.freeze({
  0: '未验收',
  1: '待审核',
  2: '已验收',
  9: '不通过',
});
// is_check(1 待审核 2 审核通过（待拨款）3 驳回 4 完成拨款)"
export const PAYMENT_STATUS = Object.freeze({
  1: '待审核',
  2: '待拨款',
  3: '驳回',
  4: '完成拨款',
});

export const DECLARE_MAP: any = {
  1: { title: '材料提交' },
  2: { title: '乡镇审核驳回' },
  3: { title: '乡镇审核通过' },
  4: { title: '材料需修改' },
  5: { title: '材料审核通过' },
  6: { title: '评审驳回' },
  7: { title: '评审通过' },
  8: { title: '联审驳回' },
  9: { title: '联审通过' },
  10: { title: '公示通过' },
  11: { title: '公示驳回' },
};

export const CHECK_MAP: any = {
  1: { title: '材料提交' },
  2: { title: '审核通过' },
  3: { title: '审核驳回' },
};
// 10: 'greyStatus',
// 11: 'yellowStatus',
// 12: 'greenStatus',
// 13: 'greyStatus',
// 19: 'redStatus',
export const INCLUSIVE_MAP: any = {
  0: { title: '驳回待修改', color: 'greyStatus' },
  1: { title: '材料提交', color: 'greyStatus' },
  11: { title: '待审核', color: 'yellowStatus' },
  12: { title: '乡镇经办人通过' },
  19: { title: '乡镇经办人驳回' },
  21: { title: '待审核', color: 'yellowStatus' },
  22: { title: '公示(所在村)通过' },
  29: { title: '公示(所在村)驳回' },
  31: { title: '待审核', color: 'yellowStatus' },
  32: { title: '乡镇领导通过' },
  39: { title: '乡镇领导驳回' },
  41: { title: '待审核', color: 'yellowStatus' },
  42: { title: '农业农村局通过' },
  49: { title: '农业农村局驳回' },
  51: { title: '待审核', color: 'yellowStatus' },
  52: { title: '公示(政府网)通过' },
  59: { title: '公示(政府网)驳回' },
  61: { title: '待审核', color: 'yellowStatus' },
  62: { title: '已审核', color: 'greenStatus' },
  69: { title: '资金拨付驳回' },
};

export const LAMBS_MAP: any = {
  0: { title: '驳回待修改', color: 'greyStatus' },
  1: { title: '材料提交' },
  11: { title: '待审核', color: 'yellowStatus' },
  12: { title: '乡镇经办人通过' },
  19: { title: '乡镇经办人驳回' },
  21: { title: '待审核', color: 'yellowStatus' },
  22: { title: '市养殖发展服务中心通过' },
  29: { title: '市养殖发展服务中心驳回' },
  31: { title: '待审核', color: 'yellowStatus' },
  32: { title: '农业农村局审核通过' },
  39: { title: '农业农村局审核驳回' },
  41: { title: '待审核', color: 'yellowStatus' },
  42: { title: '公示通过' },
  49: { title: '公示驳回' },
  51: { title: '待审核', color: 'yellowStatus' },
  52: { title: '已审核', color: 'greenStatus' },
  59: { title: '资金拨付驳回' },
};

export const HARMLESS_MAP: any = {
  0: { title: '驳回待修改', color: 'greyStatus' },
  1: { title: '材料提交' },
  30: { title: '申请待提交', color: 'greyStatus' },
  31: { title: '材料提交' },
  33: { title: '驳回待修改', color: 'greyStatus' },
  11: { title: '待审核', color: 'yellowStatus' },
  12: { title: '申报-市养殖中心人员通过' },
  19: { title: '申报-市养殖中心人员驳回' },
  21: { title: '待审核', color: 'yellowStatus' },
  22: { title: '申报-公示通过' },
  29: { title: '申报-公示驳回' },
  32: { title: '申请-市养殖中心人员通过' },
  39: { title: '申请-市养殖中心人员驳回' },
  41: { title: '待审核', color: 'yellowStatus' },
  42: { title: '已审核', color: 'greenStatus' },
  49: { title: '文件下达驳回' },
};

export const CROPS_MAP: any = {
  0: { title: '驳回待修改', color: 'greyStatus' },
  1: { title: '材料提交' },
  11: { title: '待审核', color: 'yellowStatus' },
  12: { title: '公示人（所在村）审核通过' },
  19: { title: '公示人（所在村）驳回' },
  21: { title: '待审核', color: 'yellowStatus' },
  22: { title: '村级审核人员审核通过' },
  29: { title: '村级审核人员驳回' },
  31: { title: '待审核', color: 'yellowStatus' },
  32: { title: '乡镇街道审核通过' },
  39: { title: '乡镇街道驳回' },
  // 41: { title: '待审核', color: 'yellowStatus' },
  // 42: { title: '乡镇农技中心领导审核通过' },
  // 49: { title: '乡镇农技中心领导驳回' },
  51: { title: '待审核', color: 'yellowStatus' },
  52: { title: '农业农村局审核人员审核通过' },
  59: { title: '农业农村局审核人员驳回' },
  // 61: { title: '待审核', color: 'yellowStatus' },
  // 62: { title: '第三方公司核查审核人审核通过' },
  // 69: { title: '第三方公司核查审核人驳回' },
  71: { title: '待审核', color: 'yellowStatus' },
  72: { title: '公示人（政府网）审核通过' },
  79: { title: '公示人（政府网）驳回' },
  81: { title: '待审核', color: 'yellowStatus' },
  82: { title: '已审核', color: 'greenStatus' },
  89: { title: '资金拨付驳回' },
};

export const CROPS_MAP_PROCESS: any = {
  0: { title: '材料未提交' },
  11: { title: '公示人（所在村）' },
  12: { title: '公示人（所在村）' },
  19: { title: '公示人（所在村）' },
  21: { title: '村级审核' },
  22: { title: '村级审核' },
  29: { title: '村级审核' },
  31: { title: '乡镇街道审核人员审核' },
  32: { title: '乡镇街道审核人员审核' },
  39: { title: '乡镇街道审核人员审核' },
  41: { title: '乡镇街道审核领导审核' },
  42: { title: '乡镇街道审核领导审核' },
  49: { title: '乡镇街道审核领导审核' },
  51: { title: '农业农村局审核' },
  52: { title: '农业农村局审核' },
  59: { title: '农业农村局审核' },
  61: { title: '第三方公司核查' },
  62: { title: '第三方公司核查' },
  69: { title: '第三方公司核查' },
  71: { title: '公示人（政府网）' },
  72: { title: '公示人（政府网）' },
  79: { title: '公示人（政府网）' },
  81: { title: '资金拨付中' },
  82: { title: '归档' },
  89: { title: '资金拨付中' },
};

/**
 * 各种补贴审核流程节点
 */
export const COMPETITIVE_PROCESS: any = {
  0: '乡镇审核',
  1: '材料待审核',
  2: '评审待审核',
  3: '联审待审核',
  4: '公示待审核',
  5: '文件下达',
  10: '项目变更待审核',
  20: '项目验收待审核',
};
export const FUND_PROCESS: any = {
  1: '项目管理负责人待审核',
  2: '分管领导待审核',
  3: '主要领导待审核',
  4: '资金拨付',
};
export const INCLUSIVE_PROCESS: any = {
  1: '乡镇经办人待审核',
  2: '乡镇公示人待审核',
  3: '乡镇领导待审核',
  4: '农业农村局待审核',
  5: '公示（政府网）待审核',
  6: '资金拨付',
};
export const LAMBS_PROCESS: any = {
  1: '乡镇经办人待审核',
  2: '市养殖发展服务中心待审核',
  3: '联审待审核',
  4: '公示中（政府网）待审核',
  5: '资金拨付',
};
export const HARMLESS_PROCESS: any = {
  1: '市养殖中心人员待审核（申报阶段）',
  2: '农业农村局待审核（申报阶段）',
  3: '市养殖中心人员待审核（申请阶段）',
  4: '文件下达（申请阶段）',
};
export const CROPS_PROCESS: any = {
  1: '公示人（所在村）待审核',
  2: '村级审核人员待审核',
  3: '乡镇街道审核人员待审核',
  4: '乡镇审核人员待审核',
  5: '农业农村局待审核',
  6: '第三方公司核查待审核',
  7: '公示（政府网）待审核',
  8: '资金拨付',
};

// 列表页 审核状态valueEnum
export const APPROVAL_STATUS: any = {
  '1': '审核中',
  '2': '已通过',
  '9': '已驳回',
};

export const CHANGE_ARROVAL_STATUS: any = {
  '1': '变更未处理',
  '2': '变更已处理',
};
