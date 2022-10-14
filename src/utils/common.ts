import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export const MEDIA_STORE_ENDPOINT = 'https://jiangshan-tzyjs-img.zjsszxc.com';

export function downloadAs(stream, name, MIMEType) {
  if (stream && name) {
    const blob = new Blob([stream], {
      type: MIMEType,
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(link.href); // 释放URL 对象
    document.body.removeChild(link);
  }
}

export function traverseTree(
  tree: Record<string, any>[],
  path: string[],
  nodeKey: string,
  targetProp: string,
): any[] {
  if (!path || path.length === 0) {
    return [];
  }
  const [current, ...next] = path;
  const idx = tree
    .map((node) => node[nodeKey]?.toString())
    .indexOf(current?.toString());
  if (idx >= 0) {
    return [tree[idx][targetProp]].concat(
      traverseTree(tree[idx].children ?? [], next, nodeKey, targetProp),
    );
  }
  return [];
}

export function isValidDate(dateValue) {
  return dateValue && !dateValue.toString().startsWith('0000');
}
//
// export function momentToString(momentDate, type, customFormat = undefined) {
//   if (!momentDate) {
//     return undefined;
//   }
//   let date = momentDate;
//   if (typeof momentDate === 'string') {
//     date = moment(momentDate);
//   }
//   if (customFormat) {
//     return date.format(customFormat);
//   }
//   let str = '';
//   switch (type) {
//     case 'year': {
//       str = date.startOf('year').format('YYYY');
//       break;
//     }
//     case 'month': {
//       str = date.startOf('month').format('YYYY-MM');
//       break;
//     }
//     case 'date': {
//       str = date.startOf('day').format('YYYY-MM-DD');
//       break;
//     }
//     case 'datetime': {
//       str = date.format('YYYY-MM-DD HH:mm:ss');
//       break;
//     }
//     default:
//   }
//   return str;
// }
// /**
//  * @param {moment[] | string[]} rawDates - source
//  * @param {'year'| 'month' | 'date' | 'datetime'} type - date type
//  * @param {object} [options] - options
//  * @param {string} [options.customFormat] - custom date formatter string
//  * @param {boolean} [options.undefinedIfEmpty] - return undefined instead of source is not array or result is empty
//  * @returns {string[] | undefined}
//  * */
// export function momentArrayToStringArray(rawDates, type, options) {
//   if (!rawDates || !Array.isArray(rawDates)) {
//     return options?.undefinedIfEmpty ? undefined : [];
//   }
//   const result = rawDates.map(
//     (date) => date && momentToString(date, type, options?.customFormat),
//   );
//   if (options?.undefinedIfEmpty) {
//     return result.length > 0 ? result : undefined;
//   }
//   return result;
// }

export function generateAntdOptions(source = {}) {
  return Object.entries(source).map(([k, v]: [string, any]) => ({
    value: k,
    label: v,
  }));
}

export function generateThumbnail(url: string) {
  const strs = url.split('.');
  const extension = strs[strs.length - 1].toLowerCase();
  if (
    ['png', 'webp', 'avif', 'jpeg', 'jpg', 'gif', 'svg'].includes(extension)
  ) {
    return `${url}?x-oss-process=image/resize,s_200`;
  }
  if (['mp4'].includes(extension)) {
    return `${url}?x-oss-process=video/snapshot,w_200,t_2000,f_png,m_fast`;
  }
  return url;
}

export function urlToUploaderValue(source, uid = undefined) {
  if (typeof source !== 'string') {
    return [];
  }
  const url = source.startsWith('http')
    ? source
    : `${MEDIA_STORE_ENDPOINT}/${source}`;
  return [
    { uid: uid ?? performance.now(), url, thumbUrl: generateThumbnail(url) },
  ];
}

export function parseImageString(source: string) {
  return !source || source.length === 0
    ? ''
    : source.startsWith('http')
    ? source
    : `${MEDIA_STORE_ENDPOINT}/${source}`;
}
export function parseImageArrayString(source: string): string[] {
  let rawUrls = source;
  if (typeof source == 'string') {
    rawUrls = source.split(',');
  }
  return rawUrls
    .map((url) => parseImageString(url))
    .filter((e) => e.length > 0);
}

export function isImage(extension: string) {
  return ['jpeg', 'jpg', 'png', 'webp', 'gif', 'svg'].includes(
    extension.toLowerCase(),
  );
}
export function getFileIcon(extension: string) {
  let result;
  switch (extension) {
    case 'docx':
      result =
        'https://img.hzanchu.com/acimg/baf327802e8e5536d75a619da1e41703.png';
      break;
    case 'doc':
      result =
        'https://img.hzanchu.com/acimg/18b4db2f0a34e503869c5ea5e515f24b.png';
      break;
    case 'rar':
      result =
        'https://img.hzanchu.com/acimg/21f96594470ebf4190f90b7a313207f1.png';
      break;
    case 'pdf':
      result =
        'https://img.hzanchu.com/acimg/55b8d7dceaca8e5d8526f32dc8c8d603.png';
      break;
    case 'zip':
      result =
        'https://img.hzanchu.com/acimg/35fc02369154eb26c99f0dac911c850b.png';
      break;
    default:
      result =
        'https://img.hzanchu.com/acimg/7a36af7882fccdd49e449f91757c1535.png';
      break;
  }
  return result;
}

export function last(source: any) {
  if (Array.isArray(source)) {
    return source[source.length - 1];
  }
  return undefined;
}

export function guessFileName(url: string) {
  const name = last(url.split('/'));
  if (name.length > 32) {
    return decodeURIComponent(name.slice(32));
  }
  return decodeURIComponent(name);
}

export function validatePassword(password: any) {
  if (!password || typeof password !== 'string' || password.length < 8) {
    return Promise.reject(
      new Error('请输入新密码（至少8位, 包括至少一个数字和一个字母）'),
    );
  }
  if (/^(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    return Promise.resolve();
  }
  return Promise.reject(new Error('新密码必须包括至少一个数字和一个字母'));
}

/* Echarts图表字体、间距自适应 */
export function fitChartSize(size: any, defaultWidth = 1920) {
  let clientWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  if (!clientWidth) return size;
  let scale = clientWidth / defaultWidth;
  return Number((size * scale).toFixed(3));
}

// 根据文件地址获取文件后缀名
export function getExtension(name: string) {
  return name?.substring(name.lastIndexOf('.') + 1);
}

/**
 * 根据文件类型过滤文件
 * @param typeArray 文件后缀数组 eg：['jpeg', 'jpg', 'png',]
 * @param attachment 文件数组 eg: [{url: 'xxx'}, {url: 'xxx'}]
 * @returns
 */
export function filterAttachment(typeArray?: any, attachment: any = []) {
  if (!attachment?.length) return [];
  if (typeArray?.length == 0) {
    // 过滤非图片
    return attachment.filter(
      (item: any) =>
        !['jpeg', 'jpg', 'png', 'JPEG', 'JPG', 'PNG'].includes(
          getExtension(item.url),
        ),
    );
  }
  return attachment.filter((item: any) =>
    typeArray.includes(getExtension(item.url)),
  );
}

// 递归遍历对象：过滤对象中为null/undefined/''/[]/{}的属性值
export function clearDeep(obj: any) {
  if (!obj || typeof obj !== 'object') return;

  const keys = Object.keys(obj);
  for (var key of keys) {
    const val = obj[key];
    if (
      typeof val === 'undefined' ||
      ((typeof val === 'object' || typeof val === 'string') && !val)
    ) {
      // 如属性值为null或undefined或''，则将该属性删除
      delete obj[key];
    } else if (typeof val === 'object') {
      // 属性值为对象，递归调用
      clearDeep(obj[key]);

      if (Object.keys(obj[key]).length === 0) {
        // 如某属性的值为不包含任何属性的独享，则将该属性删除
        delete obj[key];
      }
    }
  }
}

/**
 *
 * @param accAdd    加
 * @param accSubtr  减
 * @param accMul    乘
 * @param accDiv    除
 * @returns
 */
export function accAdd(arg1: any, arg2: any) {
  let r1;
  let r2;
  let m;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
}

export function accSubtr(arg1: any, arg2: any) {
  let r1;
  let r2;
  let m;
  let n;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  // 动态控制精度长度
  n = r1 >= r2 ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

export function accMul(arg1: any, arg2: any) {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  try {
    m += s1.split('.')[1].length;
  } catch (e) {}
  try {
    m += s2.split('.')[1].length;
  } catch (e) {}
  return (
    (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
    Math.pow(10, m)
  );
}

export function accDiv(arg1: any, arg2: any) {
  var t1 = 0,
    t2 = 0,
    r1,
    r2;
  try {
    t1 = arg1.toString().split('.')[1].length;
  } catch (e) {}
  try {
    t2 = arg2.toString().split('.')[1].length;
  } catch (e) {}
  //with(Math){
  r1 = Number(arg1.toString().replace('.', ''));
  r2 = Number(arg2.toString().replace('.', ''));
  return (r1 / r2) * Math.pow(10, t2 - t1);
  //}
}

// 保留两位小数 如果小数点后两位为0 则取整
export function keepTwoDecimal(num: any) {
  var result = parseFloat(num);
  if (isNaN(result)) {
    console.log('数据格式错误');
    return false;
  }
  result = Math.round(num * 100) / 100;
  return result;
}

// 根据url获取图片
export function getImage(url: string) {
  return new Promise((resolve, reject) => {
    axios(url, { responseType: 'blob' })
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

/* 
    用于检测11位的手机号是否有效
    规则：第一位为1，第二位为3，4，5，7，8，后九位为0-9
    parameter：<string> 
    return：<boolean>
*/
export function useVerifyPhoneNum(phoneNum: string) {
  let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  if (!phoneReg.test(phoneNum)) {
    return false;
  }
  return true;
}

export function changeNumMoneyToChinese  (money: any) {
  var cnNums = new Array(
    '零',
    '壹',
    '贰',
    '叁',
    '肆',
    '伍',
    '陆',
    '柒',
    '捌',
    '玖',
  ); //汉字的数字
  var cnIntRadice = new Array('', '拾', '佰', '仟'); //基本单位
  var cnIntUnits = new Array('', '万', '亿', '兆'); //对应整数部分扩展单位
  var cnDecUnits = new Array('角', '分', '毫', '厘'); //对应小数部分单位
  var cnInteger = '整'; //整数金额时后面跟的字符
  var cnIntLast = '圆'; //整型完以后的单位
  var maxNum = 999999999999999.9999; //最大处理的数字
  var IntegerNum; //金额整数部分
  var DecimalNum; //金额小数部分
  var ChineseStr = ''; //输出的中文金额字符串
  var parts; //分离金额后用的数组，预定义
  var Symbol = ''; //正负值标记
  if (money == '') {
    return '';
  }

  money = parseFloat(money);
  if (money >= maxNum) {
    alert('超出最大处理数字');
    return '';
  }
  if (money == 0) {
    ChineseStr = cnNums[0] + cnIntLast + cnInteger;
    return ChineseStr;
  }
  if (money < 0) {
    money = -money;
    Symbol = '负 ';
  }
  money = money.toString(); //转换为字符串
  if (money.indexOf('.') == -1) {
    IntegerNum = money;
    DecimalNum = '';
  } else {
    parts = money.split('.');
    IntegerNum = parts[0];
    DecimalNum = parts[1].substr(0, 4);
  }
  if (parseInt(IntegerNum, 10) > 0) {
    //获取整型部分转换
    var zeroCount = 0;
    var IntLen = IntegerNum.length;
    for (var i = 0; i < IntLen; i++) {
      var n = IntegerNum.substr(i, 1);
      var p = IntLen - i - 1;
      var q = p / 4;
      var m = p % 4;
      if (n == '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          ChineseStr += cnNums[0];
        }
        zeroCount = 0; //归零
        ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        ChineseStr += cnIntUnits[q];
      }
    }
    ChineseStr += cnIntLast;
    //整型部分处理完毕
  }
  if (DecimalNum != '') {
    //小数部分
    var decLen = DecimalNum.length;
    for (var i = 0; i < decLen; i++) {
      var n = DecimalNum.substr(i, 1);
      if (n != '0') {
        ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (ChineseStr == '') {
    ChineseStr += cnNums[0] + cnIntLast + cnInteger;
  } else if (DecimalNum == '') {
    ChineseStr += cnInteger;
  }
  ChineseStr = Symbol + ChineseStr;

  return ChineseStr;
};

