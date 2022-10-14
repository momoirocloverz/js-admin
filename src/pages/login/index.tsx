import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import { Input, message, Radio, Modal, Spin } from 'antd';
import dd from 'gdt-jsapi';

const LoginPage = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [activeIndex, setActiveIndex] = useState('1');
  const [firstPhone, setFirstPhone] = useState('');
  const [firstPass, setFirstPass] = useState('');
  const [timerText, setTimerText] = useState('获取验证码');
  const [timerBtnDisabled, setTimerBtnDisabled] = useState(false);
  const [normalLoginAble, setNormalLoginAble] = useState(false);
  const [phoneLoginAble, setPhoneLoginAble] = useState(false);
  const [radioValue, setRadioValue] = React.useState(1);
  let [counter, setCounter] = useState(60);
  const [account, setAccount] = useState('');
  const [secondPass, setSecondPass] = useState('');
  const [showPage, setShowPage] = useState(false);
  const phoneReg = /^1[3-9]\d{9}$/;
  const timerAction = () => {
    if (firstPhone) {
      const result = phoneReg.test(firstPhone);
      if (result) {
        if (!timerBtnDisabled) {
          let data = {
            mobile: firstPhone,
          };
          setTimerBtnDisabled(true);
          Apis.sendSms(data)
            .then((res: any) => {
              if (res && res.code === 0) {
                message.success('短信验证码发送成功');
                window.timer = setInterval(() => {
                  setCounter(counter--);
                  setTimerText(`${counter}s后重新发送`);
                  if (counter == 0) {
                    setTimerBtnDisabled(false);
                    setCounter(60);
                    setTimerText('获取验证码');
                    clearInterval(window.timer);
                  }
                }, 1000);
              } else {
                message.error(res.msg);
                setTimerBtnDisabled(false);
              }
            })
            .catch((err) => {
              console.log(err);
              setTimerBtnDisabled(false);
            });
        }
      } else {
        message.error('请输入正确手机号');
      }
    }
  };
  const phoneLoginAction = () => {
    if (firstPass && firstPhone) {
      let data = {
        mobile: firstPhone,
        verify_code: firstPass,
      };
      if (!phoneLoginAble) {
        setPhoneLoginAble(true);
        Apis.adminLoginMobile(data)
          .then((res: any) => {
            if (res && res.code === 0) {
              sessionStorage.setItem('loginInfo', JSON.stringify(res.data));
              Apis.getAdminInfo({})
                .then((res2: any) => {
                  if (res2 && res2.code === 0) {
                    history.push({
                      pathname: '/',
                    });
                    dispatch({
                      type: 'baseModel/initBaseState',
                      payload: '1',
                    });
                    sessionStorage.setItem(
                      'currentInfo',
                      JSON.stringify(res2.data),
                    );
                  } else {
                    message.error(res2.msg);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              message.error(res.msg);
            }
          })
          .catch((err) => {
            console.log('err', err);
          })
          .finally(() => {
            setPhoneLoginAble(false);
          });
      }
    } else {
      message.error('请检查输入项');
    }
  };
  const normalLoginAction = () => {
    if (secondPass && account) {
      let data = {
        username: account,
        password: secondPass,
      };
      if (!normalLoginAble) {
        setNormalLoginAble(true);
        Apis.adminLogin(data)
          .then((res: any) => {
            if (res && res.code === 0) {
              sessionStorage.setItem('loginToken', res.data.token);
              Apis.getAdminInfo({})
                .then((res2: any) => {
                  if (res2 && res2.code === 0) {
                    history.push({
                      pathname: '/',
                    });
                    dispatch({
                      type: 'baseModel/initBaseState',
                      payload: '1',
                    });
                    sessionStorage.setItem(
                      'currentInfo',
                      JSON.stringify(res2.data),
                    );
                  } else {
                    message.error(res2.msg);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              message.error(res.msg);
            }
          })
          .catch((err) => {
            console.log('err', err);
          })
          .finally(() => {
            setNormalLoginAble(false);
          });
      }
    } else {
      message.error('请检查输入项');
    }
  };
  const secondPassChange = (e: any) => {
    setSecondPass(e.target.value);
  };
  const firstPhoneChange = (e: any) => {
    setFirstPhone(e.target.value);
  };
  const firstPassChange = (e: any) => {
    setFirstPass(e.target.value);
  };
  const changeActive = (index: string) => {
    setActiveIndex(index);
  };
  const secondAccountChange = (e: any) => {
    setAccount(e.target.value);
  };
  const onRadioChange = (e: any) => {
    console.log('radio checked', e.target.value);
    setRadioValue(e.target.value);
  };
  let formSwitch;
  if (activeIndex == '1') {
    formSwitch = (
      <div className={styles.secondFormCon}>
        <div className={styles.secondFormFirstLineCon}>
          <img
            className={styles.account}
            src="https://img.hzanchu.com/acimg/d905d1cc8807f5efa0646829752ccdbd.png"
          />
          <Input
            size="large"
            className={styles.secondFormFirstInput}
            placeholder="请输入账号"
            allowClear
            bordered={false}
            maxLength={25}
            value={account}
            onChange={(e) => {
              secondAccountChange(e);
            }}
          />
        </div>
        <div className={styles.secondFormSecondLineCon}>
          <img
            className={styles.account}
            src="https://img.hzanchu.com/acimg/63e98d65dc30255be5af4c4d633afd87.png"
          />
          <Input
            size="large"
            className={styles.secondFormFirstInput}
            placeholder="请输入密码"
            allowClear
            type="password"
            bordered={false}
            maxLength={25}
            value={secondPass}
            onChange={(e) => {
              secondPassChange(e);
            }}
          />
        </div>
        <button
          className={styles.loginBtn}
          disabled={normalLoginAble}
          onClick={() => {
            normalLoginAction();
          }}
        >
          登录
        </button>
      </div>
    );
  } else {
    formSwitch = null;
    // <div className={styles.firstFormCon}>
    //   <div className={styles.firstFormFirstLineCon}>
    //     <img
    //       className={styles.phone}
    //       src="https://img.hzanchu.com/acimg/ac32e8d9571ee029fbe6faa4076de989.png"
    //     />
    //     <Input
    //       size="large"
    //       className={styles.firstFormFirstInput}
    //       placeholder="请输入手机号"
    //       allowClear
    //       bordered={false}
    //       maxLength={11}
    //       value={firstPhone}
    //       onChange={(e) => {
    //         firstPhoneChange(e);
    //       }}
    //     />
    //   </div>
    //   <div className={styles.firstFormSecondLineCon}>
    //     <div className={styles.firstFormSecondFakeInputCon}>
    //       <img
    //         className={styles.password1}
    //         src="https://img.hzanchu.com/acimg/5c4a1b2a921ea136a33aa4219d6931a2.png"
    //       />
    //       <Input
    //         className={styles.firstFormSecondInput}
    //         size="large"
    //         placeholder="请输入验证码"
    //         allowClear
    //         bordered={false}
    //         type="password"
    //         maxLength={6}
    //         value={firstPass}
    //         onChange={(e) => {
    //           firstPassChange(e);
    //         }}
    //       />
    //     </div>
    //     <div>
    //       <button
    //         className={styles.getSms}
    //         disabled={timerBtnDisabled}
    //         onClick={() => {
    //           timerAction();
    //         }}
    //       >
    //         {timerText}
    //       </button>
    //     </div>
    //   </div>
    //   <button
    //     className={styles.loginBtn}
    //     disabled={phoneLoginAble}
    //     onClick={() => {
    //       phoneLoginAction();
    //     }}
    //   >
    //     登录
    //   </button>
    // </div>
    // );
  }

  useEffect(() => {
    sessionStorage.clear();
    sessionStorage.clear();
    loginZzd();
  }, []);

  // 这里判断是不是浙政钉情况
  // 如果是浙政钉情况下，需要在判断一遍是否能自动登录，如果能自动登录，那么则设置当前token，并且重新刷新
  // 如果不是浙政钉情况下，那么则直接跳转到登录页面即可
  const loginZzd = () => {
    dd.getAuthCode({})
      .then((res) => {
        getAccessToken();
        // Modal.confirm({
        //   title: 'loginOutZzd',
        //   content: JSON.stringify(res),
        // });
      })
      .catch(() => {
        setShowPage(true);
      });
  };

  // 获取accessToken
  const getAccessToken = () => {
    Apis.zzdAccessToken({})
      .then((res) => {
        // Modal.confirm({
        //   title: 'getAccessToken',
        //   content: JSON.stringify(res),
        // });
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
  const getUserInfo = (access_token) => {
    dd.getAuthCode({})
      .then((result) => {
        if (result) {
          Apis.zzdAuthUserInfo({ auth_code: result.auth_code, access_token })
            .then((res) => {
              // Modal.confirm({
              //   title: 'zzdAuthUserInfo.then',
              //   content: JSON.stringify(res),
              // });
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
              loginType(res.data.content.data);
            })
            .catch((e) => {});
        }
      })
      .catch(() => {});
  };
  // 正常登录
  const loginType = (data) => {
    let loginData = {
      login_type: '3',
      tenantUserId: data.tenantUserId,
      accountId: data.accountId,
      account: data.account,
      realmId: data.realmId,
      nickname: data.nickNameCn,
    };
    Apis.adminLoginZzd(loginData)
      .then((e: any) => {
        // Modal.confirm({
        //   title: 'loginType',
        //   content: JSON.stringify(e),
        // });
        if (e.code == 0) {
          sessionStorage.setItem('loginToken', e.data.token);
          Apis.getAdminInfo({})
            .then((res2: any) => {
              if (res2 && res2.code === 0) {
                history.push({
                  pathname: '/',
                });
                dispatch({
                  type: 'baseModel/initBaseState',
                  payload: '1',
                });
                sessionStorage.setItem(
                  'currentInfo',
                  JSON.stringify(res2.data),
                );
              } else {
                message.error(res2.msg);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          sessionStorage.clear();
          sessionStorage.clear();
          window.location.href = '/deny';
        }
      })
      .catch((e) => {});
  };

  return showPage ? (
    <div className={styles.masterPageCon}>
      <div
        className={styles.centerCon}
        style={{ visibility: showPage ? 'visible' : 'hidden' }}
      >
        <div className={styles.leftPart}>
          <div className={styles.hrLine}></div>
          <div className={styles.welcome}>欢迎登录</div>
          <div className={styles.name}>江山投资一件事管理后台</div>
        </div>
        <div className={styles.rightPart}>
          <div className={styles.radioCon}>
            <Radio.Group
              className={styles.radioGroup}
              onChange={onRadioChange}
              value={radioValue}
            >
              <Radio value={1}>帐号登录</Radio>
              <Radio value={2} disabled={true}>
                浙政钉登录
              </Radio>
            </Radio.Group>
            <div className={styles.formCon}>
              <div>{formSwitch}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.loadingWrapper}>
      <Spin tip="自动登录中..."></Spin>
    </div>
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(LoginPage);
