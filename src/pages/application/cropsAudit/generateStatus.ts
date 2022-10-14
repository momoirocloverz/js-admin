/**
 * 根据下面三个参数判断显示状态文案与样式
 * @param searchStatus 当前筛选tab值
 * @param record 条目数据
 */
export const generateStatus = (searchStatus?: any, record?: any) => {
  let admin_info = JSON.parse(window.sessionStorage.getItem('currentInfo'))
    ?.admin_info;
  if (!admin_info) return ['', ''];
  const { role_type, id } = admin_info;
  const { status } = record;
  const approvalUsers = [
    record.ly_cun_audit_admin_id,
    record.ly_cun_public_admin_id,
    record.ly_village_audit_admin_id,
    record.ly_village_njzx_admin_id,
    record.ly_rural_audit_admin_id,
    record.ly_three_company_admin_id,
    record.ly_public_govn_admin_id,
    record.ly_fund_admin_id,
  ]; // 每级审批人的id
  const params = {
    status,
    searchStatus,
    ROLE_TYPE: Number(role_type),
    USER_ID: Number(id),
    approvalUsers,
  };

  if (searchStatus == 1) {
    return ['待审核', 'yellowStatus'];
  }
  if (searchStatus == 2) {
    return ['已审核', 'greenStatus'];
  }
  if (searchStatus == 9 || status == 0) {
    return ['驳回待修改', 'greyStatus'];
  }
  switch (status) {
    case 11: // 公示（村）
      return handleVillagePublic(params);
    case 21: // 村级领导
      return handleVillageLeader(params);
    case 31: // 乡镇农技中心审核人
      return handleNJZXPeople(params);
    case 41: // 乡镇农技中心领导
      return handleNJZXLeader(params);
    case 51: // 农业农村局审核
      return handleRural(params);
    case 61: // 第三方公司核查审核
      return handleThreeCompany(params);
    case 71: // 公示（政府网）
      return handleGoverPublic(params);
    case 81: // 资金拨付
      return handleFund(params);
    case 82: // 资金拨付成功
      return ['已审核', 'greenStatus'];
  }
};

// 公示（村）处理 11
const handleVillagePublic = (params: any) => {
  let text = '',
    className = '';
  const { status, searchStatus, ROLE_TYPE, USER_ID, approvalUsers } = params;
  if (ROLE_TYPE == 31) {
    text = '待审核';
  } else {
    text = '公示(村)-待审核';
  }
  className = 'yellowStatus';
  return [text, className];
};

// 村级领导处理 21
const handleVillageLeader = (params: any) => {
  let text = '',
    className = '';
  const { status, searchStatus, ROLE_TYPE, USER_ID, approvalUsers } = params;
  if (ROLE_TYPE == 31) {
    text = '待审核';
  } else {
    text = '村级人员-待审核';
  }
  className = 'yellowStatus';
  return [text, className];
};

// 乡镇农技中心审核人 31
const handleNJZXPeople = (params: any) => {
  let text = '',
    className = '';
  const { status, searchStatus, ROLE_TYPE, USER_ID, approvalUsers } = params;

  if (ROLE_TYPE == 26) {
    text = '待审核';
    className = 'yellowStatus';
  } else if (approvalUsers.slice(2).includes(USER_ID)) {
    // 是后面节点的审核人
    text = '乡镇街道-待审核';
    className = 'yellowStatus';
  } else if (approvalUsers.slice(0, 2).includes(USER_ID)) {
    // 是之前两个节点的审核人
    text = '已审核';
    className = 'greenStatus';
  } else {
    text = '乡镇街道-待审核';
    className = 'yellowStatus';
  }
  return [text, className];
};

// 乡镇农技中心领导 41
const handleNJZXLeader = (params: any) => {
  let text = '',
    className = '';
  const { status, searchStatus, ROLE_TYPE, USER_ID, approvalUsers } = params;
  if (ROLE_TYPE == 27) {
    text = '待审核';
    className = 'yellowStatus';
  } else if (approvalUsers.slice(3).includes(USER_ID)) {
    // 是后面节点的审核人
    text = '乡镇街道-待审核';
    className = 'yellowStatus';
  } else if (approvalUsers.slice(0, 3).includes(USER_ID)) {
    // 是之前两个节点的审核人
    text = '已审核';
    className = 'greenStatus';
  } else {
    text = '乡镇街道-待审核';
    className = 'yellowStatus';
  }
  return [text, className];
};

// 农业农村局审核 51
const handleRural = (params: any) => {
  let text = '',
    className = '';
  const { status, searchStatus, ROLE_TYPE, USER_ID, approvalUsers } = params;

  if (USER_ID == approvalUsers[4]) {
    text = '待审核';
    className = 'yellowStatus';
  } else if (approvalUsers.slice(4).includes(USER_ID)) {
    // 是后面节点的审核人
    text = '农业农村局-待审核';
    className = 'yellowStatus';
  } else if (approvalUsers.slice(0, 4).includes(USER_ID)) {
    // 是之前两个节点的审核人
    text = '已审核';
    className = 'greenStatus';
  } else {
    text = '农业农村局-待审核';
    className = 'yellowStatus';
  }

  return [text, className];
};

// 第三方公司核查审核
const handleThreeCompany = (params: any) => {
  let text = '',
    className = '';
  const { status, searchStatus, ROLE_TYPE, USER_ID, approvalUsers } = params;

  if (USER_ID == approvalUsers[5]) {
    text = '待审核';
    className = 'yellowStatus';
  } else if (approvalUsers.slice(5).includes(USER_ID)) {
    // 是后面节点的审核人
    text = '第三方公司-待审核';
    className = 'yellowStatus';
  } else if (approvalUsers.slice(0, 5).includes(USER_ID)) {
    // 是之前两个节点的审核人
    text = '已审核';
    className = 'greenStatus';
  } else {
    text = '第三方公司-待审核';
    className = 'yellowStatus';
  }

  return [text, className];
};

// 公示（政府网）71
const handleGoverPublic = (params: any) => {
  let text = '',
    className = '';
  const { status, searchStatus, ROLE_TYPE, USER_ID, approvalUsers } = params;

  if (USER_ID == approvalUsers[6]) {
    text = '待审核';
    className = 'yellowStatus';
  } else if (approvalUsers.slice(6).includes(USER_ID)) {
    // 是后面节点的审核人
    text = '公示(政府网)-待审核';
    className = 'yellowStatus';
  } else if (approvalUsers.slice(0, 6).includes(USER_ID)) {
    // 是之前两个节点的审核人
    text = '已审核';
    className = 'greenStatus';
  } else {
    text = '公示(政府网)-待审核';
    className = 'yellowStatus';
  }

  return [text, className];
};

// 资金拨付
const handleFund = (params: any) => {
  let text = '',
    className = '';
  const { status, searchStatus, ROLE_TYPE, USER_ID, approvalUsers } = params;

  if (USER_ID == approvalUsers[6]) {
    text = '待审核';
    className = 'yellowStatus';
  } else {
    text = '已审核';
    className = 'greenStatus';
  }
};

// 资金拨付
// const handleFundCompleted = (
//   status?: any,
//   roleType?: any,
//   searchStatus?: any,
// ) => {
//   return ['已审核', 'greenStatus'];
// };
