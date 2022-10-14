import { generateAntdOptions } from '@/utils/common';

export const USER_ACCOUNT_STATUS = {
  0: '正常',
  1: '禁用',
};
export const userAccountStatusOptions = generateAntdOptions(
  USER_ACCOUNT_STATUS,
);

export const NAV_ITEM_TYPES = {
  1: '导航',
  2: '权限',
};
export const navItemTypeOptions = generateAntdOptions(
  NAV_ITEM_TYPES,
);
