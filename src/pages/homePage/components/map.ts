/**
 * 首页分布地图相关配置与工具函数
 */
import { fitChartSize, accSubtr, keepTwoDecimal } from '@/utils/common';

export const defaultOptions = {
  visualMap: {
    min: 0,
    show: false,
    range: [1, 9999999999],
    realtime: false,
    calculable: true,
    inRange: {
      color: ['#007BE6'],
    },
    outOfRange: {
      color: ['#0063BA'],
    },
  },
  tooltip: { show: false },
  geo: [
    {
      map: 'JiangShan',
      roam: false,
      zoom: 1.11,
      aspectScale: 0.9,
      selectedMode: 'single',
      itemStyle: {
        color: undefined,
      },
      emphasis: {
        label: {
          show: false,
        },
      },
    },
  ],
};

export const genJzxSeries = (isZZD: boolean, data: any) => {
  let initEmpty: any = [];
  data.financial_distribution_list.forEach((ele: any) => {
    ele.project_overview.list.forEach((sub: any) => {
      sub.town_name = ele.town_name;
      sub.groupId = ele.id;
    });
    initEmpty = initEmpty.concat(ele.project_overview.list);
  });
  const dataValue =
    initEmpty
      .filter((ele: any) => {
        return !ele.is_overdue;
      })
      .map((ele: any) => {
        return {
          name: ele.project_name,
          town_name: ele.town_name,
          groupId: ele.groupId,
          overdue_year: ele.overdue_year,
          value: ele.WGS84,
        };
      }) || [];

  var overDueMasterArray =
    initEmpty
      .filter((ele: any) => {
        return ele.is_overdue;
      })
      .map((ele: any) => {
        return {
          name: ele.project_name,
          town_name: ele.town_name,
          groupId: ele.groupId,
          value: ele.WGS84,
          overdue_year: ele.overdue_year,
        };
      }) || [];
  var data2Value =
    overDueMasterArray.filter((ele: any) => {
      return ele.overdue_year == 0.5;
    }) || [];
  var data3Value =
    overDueMasterArray.filter((ele: any) => {
      return ele.overdue_year >= 1;
    }) || [];

  // var data4Value =
  //   overDueMasterArray.filter((ele: any) => {
  //     return ele.overdue_year == 2;
  //   }) || [];
  return [
    {
      type: 'map',
      mapType: 'JiangShan',
      roam: false,
      selectedMode: true,
      aspectScale: 0.9,
      zoom: 1.11,
      label: {
        show: true,
        color: '#9BD1FF',
        fontSize: isZZD ? fitChartSize(12) : fitChartSize(16),
        // offset:   [0, 0],
        fontWeight: 600,
        formatter: function (params: any) {
          let filter = params.name.replace('浙江省衢州市江山市', '');
          params.shorter = filter;
          let match = data.mapData.find((ele: any) => {
            return ele.name == params.shorter;
          });
          if (match) {
            return filter + '\n' + match.normalValue;
          }
        },
      },
      itemStyle: {
        areaColor: 'rgba(32,99,150,1)',
        borderWidth: fitChartSize(1),
        borderColor: '#349DEC',
      },
      emphasis: {
        label: {
          color: '#9BD1FF',
        },
        itemStyle: {
          areaColor: '#007BE6',
          borderWidth: fitChartSize(2),
          borderColor: '#45AFFF',
        },
      },
      select: {
        label: {
          color: '#9BD1FF',
        },
        itemStyle: {
          areaColor: '#007BE6',
          borderWidth: fitChartSize(2),
          borderColor: '#45AFFF',
        },
      },
      data: data.mapData,
      nameMap: {
        浙江省衢州市江山市上余镇: '上余镇',
        浙江省衢州市江山市双塔街道: '双塔街道',
        浙江省衢州市江山市虎山街道: '虎山街道',
        浙江省衢州市江山市四都镇: '四都镇',
        浙江省衢州市江山市大陈乡: '大陈乡',
        浙江省衢州市江山市碗窑乡: '碗窑乡',
        浙江省衢州市江山市贺村镇: '贺村镇',
        浙江省衢州市江山市清湖街道: '清湖街道',
        浙江省衢州市江山市新塘边镇: '新塘边镇',
        浙江省衢州市江山市坛石镇: '坛石镇',
        浙江省衢州市江山市大桥镇: '大桥镇',
        浙江省衢州市江山市凤林镇: '凤林镇',
        浙江省衢州市江山市峡口镇: '峡口镇',
        浙江省衢州市江山市保安乡: '保安乡',
        浙江省衢州市江山市廿八都镇: '廿八都镇',
        浙江省衢州市江山市长台镇: '长台镇',
        浙江省衢州市江山市石门镇: '石门镇',
        浙江省衢州市江山市张村乡: '张村乡',
        浙江省衢州市江山市塘源口乡: '塘源口乡',
      },
    },
    {
      name: '1',
      type: 'scatter',
      coordinateSystem: 'geo',
      data: dataValue,
      symbol:
        'image://https://img.hzanchu.com/acimg/e750382bede911e5176a0f4e6324e5b5.png',
      symbolSize: [fitChartSize(14), fitChartSize(20)],
      hoverSymbolSize: fitChartSize(10),
      tooltip: {
        formatter(value: any) {
          return value.data.name + '<br/>' + value.data.town_name;
        },
        show: true,
      },
      encode: {
        value: 2,
      },
      label: {
        formatter: '{b}',
        position: 'right',
        show: false,
      },
      itemStyle: {
        color: '#0efacc',
      },
      emphasis: {
        label: {
          show: false,
        },
      },
    },
    {
      name: '2',
      type: 'scatter',
      coordinateSystem: 'geo',
      data: data2Value,
      symbol:
        'image://https://img.hzanchu.com/acimg/35de6d26f6f37650978419ed14a8a42b.png',
      symbolSize: [fitChartSize(14), fitChartSize(20)],
      hoverSymbolSize: fitChartSize(10),
      tooltip: {
        formatter(value: any) {
          return value.data.name + '<br/>' + value.data.town_name;
        },
        show: true,
      },
      encode: {
        value: 2,
      },
      label: {
        formatter: '{b}',
        position: 'right',
        show: false,
      },
      itemStyle: {
        color: '#0efacc',
      },
      emphasis: {
        label: {
          show: false,
        },
      },
    },
    {
      name: '3',
      type: 'scatter',
      coordinateSystem: 'geo',
      data: data3Value,
      symbol:
        'image://https://img.hzanchu.com/acimg/4cba5deb5f16f7d848048fa87fd5bd29.png',
      symbolSize: [fitChartSize(14), fitChartSize(20)],
      hoverSymbolSize: fitChartSize(10),
      tooltip: {
        formatter(value: any) {
          return value.data.name + '<br/>' + value.data.town_name;
        },
        show: true,
      },
      encode: {
        value: 2,
      },
      label: {
        formatter: '{b}',
        position: 'right',
        show: false,
      },
      itemStyle: {
        color: '#0efacc',
      },
      emphasis: {
        label: {
          show: false,
        },
      },
    },
    // {
    //   name: '4',
    //   type: 'scatter',
    //   coordinateSystem: 'geo',
    //   data: data4Value,
    //   symbol:
    //     'image://https://img.hzanchu.com/acimg/053451a21cb5c7b4a9c642e0089f37a7.png',
    //   symbolSize: [fitChartSize(14), fitChartSize(20)],
    //   hoverSymbolSize: fitChartSize(10),
    //   tooltip: {
    //     formatter(value: any) {
    //       return value.data.name + '<br/>' + value.data.town_name;
    //     },
    //     show: true,
    //   },
    //   encode: {
    //     value: 2,
    //   },
    //   label: {
    //     formatter: '{b}',
    //     position: 'right',
    //     show: false,
    //   },
    //   itemStyle: {
    //     color: '#0efacc',
    //   },
    //   emphasis: {
    //     label: {
    //       show: false,
    //     },
    //   },
    // },
  ];
};

export const genPhSeries = (isZZD: boolean, data: any) => {
  let initEmpty: any = [];
  data.financial_distribution_list.forEach((ele: any) => {
    ele.project_overview.list.forEach((sub: any) => {
      sub.town_name = ele.town_name;
      sub.groupId = ele.id;
    });
    initEmpty = initEmpty.concat(ele.project_overview.list);
  });
  const yjfValue: any = [],
    jgValue: any = [],
    hyValue: any = [],
    whhValue: any = [],
    lyValue: any = [];
  initEmpty.forEach((ele: any) => {
    const category_name = ele.policy_document_info?.get_category?.category_name;
    const temp = {
      name: ele.policy_document_info?.get_category?.category_name,
      town_name: ele.town_name,
      groupId: ele.groupId,
      overdue_year: ele.overdue_year,
      value: ele.WGS84,
    };
    if (category_name == '有机肥使用补贴') {
      yjfValue.push(temp);
    } else if (category_name == '秸秆综合利用补贴') {
      jgValue.push(temp);
    } else if (category_name == '湖羊产业补贴') {
      hyValue.push(temp);
    } else if (category_name == '病死动物无害化处理补贴') {
      whhValue.push(temp);
    } else if (category_name == '粮油适度规模经营补贴') {
      lyValue.push(temp);
    }
  });
  return [
    {
      type: 'map',
      mapType: 'JiangShan',
      roam: false,
      selectedMode: true,
      aspectScale: 0.9,
      zoom: 1.11,
      label: {
        show: true,
        color: '#9BD1FF',
        fontSize: isZZD ? fitChartSize(12) : fitChartSize(16),
        // offset:   [0, 0],
        fontWeight: 600,
        formatter: function (params: any) {
          let filter = params.name.replace('浙江省衢州市江山市', '');
          params.shorter = filter;
          let match = data.mapData.find((ele: any) => {
            return ele.name == params.shorter;
          });
          if (match) {
            return filter + '\n' + match.normalValue;
          }
        },
      },
      itemStyle: {
        areaColor: 'rgba(32,99,150,1)',
        borderWidth: fitChartSize(1),
        borderColor: '#349DEC',
      },
      emphasis: {
        label: {
          color: '#9BD1FF',
        },
        itemStyle: {
          areaColor: '#007BE6',
          borderWidth: fitChartSize(2),
          borderColor: '#45AFFF',
        },
      },
      select: {
        label: {
          color: '#9BD1FF',
        },
        itemStyle: {
          areaColor: '#007BE6',
          borderWidth: fitChartSize(2),
          borderColor: '#45AFFF',
        },
      },
      data: data.mapData,
      nameMap: {
        浙江省衢州市江山市上余镇: '上余镇',
        浙江省衢州市江山市双塔街道: '双塔街道',
        浙江省衢州市江山市虎山街道: '虎山街道',
        浙江省衢州市江山市四都镇: '四都镇',
        浙江省衢州市江山市大陈乡: '大陈乡',
        浙江省衢州市江山市碗窑乡: '碗窑乡',
        浙江省衢州市江山市贺村镇: '贺村镇',
        浙江省衢州市江山市清湖街道: '清湖街道',
        浙江省衢州市江山市新塘边镇: '新塘边镇',
        浙江省衢州市江山市坛石镇: '坛石镇',
        浙江省衢州市江山市大桥镇: '大桥镇',
        浙江省衢州市江山市凤林镇: '凤林镇',
        浙江省衢州市江山市峡口镇: '峡口镇',
        浙江省衢州市江山市保安乡: '保安乡',
        浙江省衢州市江山市廿八都镇: '廿八都镇',
        浙江省衢州市江山市长台镇: '长台镇',
        浙江省衢州市江山市石门镇: '石门镇',
        浙江省衢州市江山市张村乡: '张村乡',
        浙江省衢州市江山市塘源口乡: '塘源口乡',
      },
    },
    {
      name: '有机肥',
      type: 'scatter',
      coordinateSystem: 'geo',
      data: yjfValue,
      symbol:
        'image://https://img.hzanchu.com/acimg/64a6dbaee1ea144b630ce124997078f5.png',
      symbolSize: [fitChartSize(54), fitChartSize(64)],
      hoverSymbolSize: fitChartSize(10),
      tooltip: {
        formatter(value: any) {
          return value.data.name + '<br/>' + value.data.town_name;
        },
        show: true,
      },
      encode: {
        value: 2,
      },
      label: {
        formatter: '{b}',
        position: 'right',
        show: false,
      },
      itemStyle: {
        color: '#0efacc',
      },
      emphasis: {
        label: {
          show: false,
        },
      },
    },
    {
      name: '秸秆',
      type: 'scatter',
      coordinateSystem: 'geo',
      data: jgValue,
      symbol:
        'image://https://img.hzanchu.com/acimg/eba7a3f20e2ec7de04f42c6d35d8cde2.png',
      symbolSize: [fitChartSize(54), fitChartSize(64)],
      hoverSymbolSize: fitChartSize(10),
      tooltip: {
        formatter(value: any) {
          return value.data.name + '<br/>' + value.data.town_name;
        },
        show: true,
      },
      encode: {
        value: 2,
      },
      label: {
        formatter: '{b}',
        position: 'right',
        show: false,
      },
      itemStyle: {
        color: '#0efacc',
      },
      emphasis: {
        label: {
          show: false,
        },
      },
    },
    {
      name: '湖羊',
      type: 'scatter',
      coordinateSystem: 'geo',
      data: hyValue,
      symbol:
        'image://https://img.hzanchu.com/acimg/5fcb74abc2056ba75cdba35c8bca1769.png',
      symbolSize: [fitChartSize(54), fitChartSize(64)],
      hoverSymbolSize: fitChartSize(10),
      tooltip: {
        formatter(value: any) {
          return value.data.name + '<br/>' + value.data.town_name;
        },
        show: true,
      },
      encode: {
        value: 2,
      },
      label: {
        formatter: '{b}',
        position: 'right',
        show: false,
      },
      itemStyle: {
        color: '#0efacc',
      },
      emphasis: {
        label: {
          show: false,
        },
      },
    },
    {
      name: '无害化',
      type: 'scatter',
      coordinateSystem: 'geo',
      data: whhValue,
      symbol:
        'image://https://img.hzanchu.com/acimg/50a09dafbcfafcf709194c246573b843.png',
      symbolSize: [fitChartSize(54), fitChartSize(64)],
      hoverSymbolSize: fitChartSize(10),
      tooltip: {
        formatter(value: any) {
          return value.data.name + '<br/>' + value.data.town_name;
        },
        show: true,
      },
      encode: {
        value: 2,
      },
      label: {
        formatter: '{b}',
        position: 'right',
        show: false,
      },
      itemStyle: {
        color: '#0efacc',
      },
      emphasis: {
        label: {
          show: false,
        },
      },
    },
    {
      name: '粮油',
      type: 'scatter',
      coordinateSystem: 'geo',
      data: lyValue,
      symbol:
        'image://https://img.hzanchu.com/acimg/08b2ad065f015efd3d44a182870c8a1d.png',
      symbolSize: [fitChartSize(54), fitChartSize(64)],
      hoverSymbolSize: fitChartSize(10),
      tooltip: {
        formatter(value: any) {
          return value.data.name + '<br/>' + value.data.town_name;
        },
        show: true,
      },
      encode: {
        value: 2,
      },
      label: {
        formatter: '{b}',
        position: 'right',
        show: false,
      },
      itemStyle: {
        color: '#0efacc',
      },
      emphasis: {
        label: {
          show: false,
        },
      },
    },
  ];
};
