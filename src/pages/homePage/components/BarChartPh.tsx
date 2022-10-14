/**
 * 惠农补贴-柱状图
 */
import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import * as echarts from 'echarts';
import { fitChartSize, accMul, accDiv } from '@/utils/common';

export default function BarChart(props: any) {
  // nameList：第一列政策名称 hadList：第一条柱（资金总额）cashList：兑现资金
  const { chartId, nameList, fundList, cashList, onBarClick } = props;

  const [myChartInstance, setMyChartInstance] = useState<any>(null); // 图表实例

  useEffect(() => {
    let data = nameList?.length ? new Array(nameList?.length).fill(100) : [];
    let titlename = nameList || [];

    // 根据fundList和cashList计算兑现所占百分比
    let cashPercents: any = [];
    cashList.forEach((item: any, index: number) => {
      if (fundList[index]) {
        if (Number(fundList[index].value) == 0) {
          cashPercents.push(0);
        } else {
          let tempPercent = accMul(
            accDiv(item.value, Number(fundList[index].value)),
            100,
          );
          if (tempPercent >= 100) {
            cashPercents.push(100);
          } else {
            cashPercents.push(tempPercent);
          }
        }
      }
    });

    const option: any = {
      grid: {
        top: '5%',
        right: '5%',
        bottom: fitChartSize(60),
        left: '18%',
      },
      legend: {
        bottom: 0,
        icon: 'rect',
        selectedMode: false,
        itemGap: fitChartSize(48),
        itemWidth: fitChartSize(60),
        itemHeight: fitChartSize(12),
      },
      dataZoom: [
        {
          type: 'inside',
          id: 'insideY',
          yAxisIndex: 0,
          start: 0,
          end: 5,
          minValueSpan: 5,
          zoomOnMouseWheel: false,
          moveOnMouseMove: true,
          moveOnMouseWheel: true,
        },
      ],
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        padding: [
          fitChartSize(5),
          fitChartSize(10),
          fitChartSize(5),
          fitChartSize(10),
        ],
        formatter: (params: any) => {
          const policyName = params[0]?.name;
          let fundItem = fundList.find((v: any) => v.label == policyName);
          let cashItem = cashList.find((v: any) => v.label == policyName);
          return `${policyName}<br />项目资金总额：${fundItem?.value}万元<br />已兑现资金：${cashItem?.value}`;
        },
        textStyle: {},
      },
      xAxis: [
        {
          show: true,
          type: 'value',
          position: 'bottom',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { type: 'dashed' } },
          axisPointer: { show: false },
          axisLabel: {
            formatter: function (value: number, index: number) {
              if (index == 2) {
                return `${value}（%）`;
              } else {
                return value;
              }
            },
          },
          min: 0,
          max: 100,
          interval: 50,
        },
        {
          show: false,
        },
      ],
      yAxis: [
        {
          show: true,
          data: titlename,
          inverse: true,
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            color: '#333',
            hideOverlap: false,
            width: 80,
            overflow: 'truncate',
          },
        },
      ],
      series: [
        {
          name: '项目资金总额',
          type: 'bar',
          data: data,
          barGap: 0,
          barWidth: fitChartSize(8),
          itemStyle: {
            color: '#95F064',
          },
          label: {
            show: true,
            position: 'insideRight',
            verticalAlign: 'middle',
            formatter: (params: any) => {
              const { dataIndex } = params;
              return fundList[dataIndex]?.value + '万';
            },
            color: '#666666',
            fontSize: fitChartSize(12),
            distance: 0,
          },
        },
        {
          name: '已兑现资金',
          type: 'bar',
          barGap: 0,
          barWidth: fitChartSize(8),
          itemStyle: {
            color: '#5C6EFC',
          },
          data: cashPercents,
          label: {
            show: true,
            position: 'right',
            verticalAlign: 'middle',
            formatter: (params: any) => {
              const { dataIndex } = params;
              return cashList[dataIndex]?.value + '万';
            },
            color: '#666666',
            fontSize: fitChartSize(12),
            distance: 0,
          },
        },
      ],
    };

    const myChart = echarts.init(
      document.getElementById(chartId) as HTMLElement,
    );
    myChart.setOption(option);
    window.addEventListener('resize', () => {
      myChart.resize();
    });
    myChart && myChart.resize(); // 手动执行一次
    getInstance(myChart);
  }, [nameList, fundList, cashList]);

  const getInstance = (obj: any) => {
    setMyChartInstance(obj);
    if (myChartInstance) {
      myChartInstance.off('click'); //图表渲染前销毁点击事件
      myChartInstance.on('click', (e: any) => {
        if (e.name && onBarClick) {
          onBarClick(e.name);
        }
      });
    }
  };

  return (
    <>
      <div id={chartId} className={`${styles.chartWrapper2}`}></div>
    </>
  );
}
