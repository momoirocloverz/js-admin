import Axios, { AxiosResponse } from 'axios';
import { message, notification, Modal } from 'antd';
import { history } from 'umi';
import dd from 'gdt-jsapi';
import APIs from '@/utils/apis';

const Instance = Axios.create({
  baseURL: '/admin',
  timeout: 60000,
  headers: {
    Accept: 'application/vnd.datashare.v1+json',
  },
});

// 取消请求
const allPendingRequestsRecord: any = [];
const pending: any = {};
const removeAllPendingRequestsRecord = () => {
  allPendingRequestsRecord &&
    allPendingRequestsRecord.forEach((func: any) => {
      // 取消请求（调用函数就是取消该请求）
      func('取消请求');
    });
  // 移除所有记录
  allPendingRequestsRecord.splice(0);
};

Instance.interceptors.request.use(
  (config: any) => {
    if (config?.url == '/upload/upload_images') {
      config.timeout = 600000; // 上传接口设置10分钟超时时间
    }
    // 设置请求的 cancelToken（设置后就能中途控制取消了）
    let reqData = config.url + config.method + JSON.stringify(config.data);
    config.cancelToken = new Axios.CancelToken((c) => {
      pending[reqData] = c;
      allPendingRequestsRecord.push(c);
    });

    const loginToken = sessionStorage.getItem('loginToken')
      ? sessionStorage.getItem('loginToken')
      : '';
    if (loginToken) {
      config.headers.Authorization = loginToken;
    } else {
      if (history.location.pathname != '/login') {
        removeAllPendingRequestsRecord();
      }
    }
    // config.headers.Accept = 'application/vnd.datashare.v1+json';
    // if (config.url == '/upload-avatar-image') {
    //   config.headers['Content-Type'] = 'multipart/form-data';
    // }
    return config;
  },
  (error) => Promise.reject(error),
);
Instance.interceptors.response.use((res: AxiosResponse) => {
  const { code } = res.data;
  // Modal.confirm({
  //   title: 'response.use',
  //   content: JSON.stringify(res),
  // });
  if (code !== 0) {
    switch (code) {
      case 21001: {
        loginOutZzd();
        // window.location.href = '/login';
        // sessionStorage.clear();
        // sessionStorage.clear();
        break;
      }
      default: {
        // return Promise.reject(new Error(res.data.msg));
      }
    }
  }
  return res.data;
});

export default Instance;

// 这里判断是不是浙政钉情况
// 如果是浙政钉情况下，需要在判断一遍是否能自动登录，如果能自动登录，那么则设置当前token，并且重新刷新
// 如果不是浙政钉情况下，那么则直接跳转到登录页面即可
const loginOutZzd = () => {
  dd.getAuthCode({})
    .then((res) => {
      getAccessToken();
    })
    .catch(() => {
      window.location.href = '/login';
      sessionStorage.clear();
      sessionStorage.clear();
    });
};

// 获取accessToken
const getAccessToken = () => {
  APIs.zzdAccessToken({})
    .then((res) => {
      if (res.code == 0) {
        if (res.data.success) {
          if (res.data.content.success) {
            getUserInfo(res.data.content.data.accessToken);
          } else {
            message.error(res.data.content.responseMessage);
          }
        } else {
          message.error(res.msg);
        }
      } else {
        message.error(res.msg);
      }
    })
    .catch((err) => {
      console.log('err', err);
    });
};
// 获取用户信息
const getUserInfo = (access_token: any) => {
  dd.getAuthCode({})
    .then((result) => {
      if (result) {
        APIs.zzdAuthUserInfo({ auth_code: result.auth_code, access_token })
          .then((res) => {
            // Modal.confirm({
            //   title: 'zzdAuthUserInfo.then',
            //   content: JSON.stringify(res),
            // });
            let data = res.data.content.data;
            try {
              // 用户信息埋点
              // 如采集用户信息是异步行为需要先执行这个BLOCK埋点

              // Modal.confirm({
              //   content: "aplus_queue.try" + JSON.stringify(aplus_queue) + myDate.getHours() + myDate.getMinutes() + myDate.getSeconds(),
              //   onOk: async () => { },
              // });

              aplus_queue.push({
                action: 'aplus.setMetaInfo',
                arguments: ['_hold', 'BLOCK'],
              });

              // 设置会员昵称
              aplus_queue.push({
                action: 'aplus.setMetaInfo',
                arguments: ['_user_nick', data.nickNameCn],
              });
              // 设置会员ID
              aplus_queue.push({
                action: 'aplus.setMetaInfo',
                arguments: ['_user_id', data.accountId],
              });

              // 如采集用户信息是异步行为，需要先设置完用户信息后再执行这个START埋点
              // 此时被block住的日志会携带上用户信息逐条发出
              aplus_queue.push({
                action: 'aplus.setMetaInfo',
                arguments: ['_hold', 'START'],
              });
            } catch (e) {
              // Modal.confirm({
              //   content: "aplus_queue.catch" + JSON.stringify(e) + myDate.getHours() + myDate.getMinutes() + myDate.getSeconds(),
              //   onOk: async () => { },
              // });
            }
            loginType(data);
          })
          .catch((e) => {});
      }
    })
    .catch(() => {});
};
// 正常登录
const loginType = (data: any) => {
  let loginData = {
    login_type: '3',
    tenantUserId: data.tenantUserId,
    accountId: data.accountId,
    account: data.account,
    realmId: data.realmId,
    nickname: data.nickNameCn,
  };
  APIs.adminLoginZzd(loginData)
    .then((e: any) => {
      // Modal.confirm({
      //   title: 'loginType',
      //   content: JSON.stringify(e),
      // });
      if (e.code == 0) {
        setToken(e.data.token);
      } else {
        sessionStorage.clear();
        sessionStorage.clear();
        window.location.href = '/deny';
        // window.location.href = '/login';
      }
    })
    .catch((e) => {});
};

// 设置token进行登陆
const setToken = (token: any) => {
  sessionStorage.setItem('loginToken', token);
  APIs.getAdminInfo({})
    .then((res2: any) => {
      if (res2 && res2.code === 0) {
        sessionStorage.setItem('currentInfo', JSON.stringify(res2.data));
        setTimeout(() => {
          window.location.href = '/';
        }, 250);
      } else {
        message.error(res2.msg);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
