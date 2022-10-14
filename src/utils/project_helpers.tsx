/**
 * 项目相关页面，表格项工具函数
 */
const DECLARE_MAP: any = {
  1: '乡镇审核中',
  10: '材料审核中',
  20: '评审中',
  30: '联审中',
  40: '公示中',
  45: '文件下达完成',
};
const DECLARE_MAPCopy: any = {
  0:'已驳回',
  1: '乡镇审核中',
  10: '材料审核中',
  20: '评审中',
  30: '联审中',
  40: '公示中',
  45: '文件下达完成',
};
const ACCEPTANCE_MAP: any = {
  60: '未提交验收申请',
  61: '待审核',
  62: '验收通过',
  69: '已驳回',
};
/**
 * 根据项目status获取项目当前节点
 * @param status 必传，项目状态
 * @returns 节点文案
 */
export const generateNodeText = (status: number | string) => {
  status = status.toString();
  if (['0'].includes(status)) {
    return '材料未提交';
  } else if (['1', '3', '9'].includes(status)) {
    return '乡镇审核';
  } else if (['10', '11'].includes(status)) {
    return '材料审核';
  } else if (['20', '21', '29'].includes(status)) {
    return '评审';
  } else if (['30', '31', '39'].includes(status)) {
    return '联审';
  } else if (['40', '43'].includes(status)) {
    return '公示';
  } else if (['45', '46'].includes(status)) {
    return '文件下达';
  } else if (['50'].includes(status)) {
    return '项目实施';
  } else if (['51', '52', '59'].includes(status)) {
    return '项目变更';
  } else if (['60'].includes(status)) {
    return '项目验收';
  } else if (['61', '62', '69'].includes(status)) {
    return '项目验收';
  } else if (['70', '71', '72', '79'].includes(status)) {
    return '资金兑现';
  } else {
    return '-';
  }
};

/**
 * 根据项目status获取审核状态
 * @param status 必传，项目状态
 * @param projectStage 必传,项目节点
 * @returns 审核状态文案
 */
export const generateApprovalStatusText = (
  status: number | string,
  projectStage: number,
) => {
  if (projectStage == 1) {
    // 项目申报
    return status >= 45 ? DECLARE_MAPCopy[45] : DECLARE_MAPCopy[status] || '-';
  } else if (projectStage == 2) {
    // 项目实施
    return '-';
  } else if (projectStage == 3) {
    // 项目验收
    return status >= 69 ? ACCEPTANCE_MAP[62] : ACCEPTANCE_MAP[status] || '-';
  } else if (projectStage == 4) {
    // 资金拨付
    return '-';
  } else {
    return '-';
  }
};

/**
 * 根据项目status获取审核类型
 * @param status 必传，项目状态
 * @returns 审核类型文案
 */
export const generateApprovalType = (status: number | string) => {
  status = status.toString();
  const decalre = [
    '1',
    '3',
    '9',
    '10',
    '11',
    '20',
    '21',
    '29',
    '30',
    '31',
    '39',
    '40',
    '43',
    '45',
    '46',
  ];
  if (['0'].includes(status)) {
    return '材料未提交';
  } else if (decalre.includes(status)) {
    return '申报审核';
  } else if (['51', '52', '59'].includes(status)) {
    return '变更审核';
  } else if (['60', '61', '62', '69'].includes(status)) {
    return '验收审核';
  } else if (['70', '71', '72', '79'].includes(status)) {
    return '资金兑现审核';
  } else {
    return '-';
  }
};
