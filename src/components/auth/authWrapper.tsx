import React from 'react';
const AuthWrapper = (props) => {
  let { children, mark } = props;
  let final = null;
  let allBtnsIds = sessionStorage.getItem('allBtnsIds')
    ? JSON.parse(sessionStorage.getItem('allBtnsIds'))
    : '';
  let userInfo = sessionStorage.getItem('currentInfo')
    ? JSON.parse(sessionStorage.getItem('currentInfo'))
    : '';
  if (allBtnsIds) {
    let exist = allBtnsIds.filter((ele) => {
      return ele == mark;
    });
    if (exist && exist.length) {
      final = children;
    }
  }
  if (userInfo) {
    if (userInfo.admin_info) {
      if (userInfo.admin_info.username == 'superadmin') {
        final = children;
      }
    }
  }
  return <>{final}</>;
};

export default AuthWrapper;
