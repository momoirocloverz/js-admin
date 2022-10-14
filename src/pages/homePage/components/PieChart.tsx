/**
 * 项目储备饼图
 */
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import * as echarts from 'echarts';
import { fitChartSize } from '@/utils/common';

export default function PieChart(props: any) {
  const { chartId, data } = props;
  useEffect(() => {
    let chartData: Array<any> = [];
    if (data) {
      chartData.push(
        { name: '种植业', value: data.plant },
        { name: '养殖业', value: data.process },
        { name: '加工业', value: data.cultivation },
        { name: '乡村建设', value: data.build },
        { name: '其他', value: data.other },
      );
      const option = {
        color: [
          '#3392E6',
          '#B67CFE',
          '#EF9763',
          '#2EB6BB',
          '#6271FD',
          '#5EB4F0',
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{b}：{c}个',
        },
        legend: {
          orient: 'vertical',
          top: 'center',
          right: 0,
          selectedMode: false,
          textStyle: {
            color: '#fft',
            rich: {
              name: { width: fitChartSize(100) },
            },
          },
          formatter: (name: any) => {
            let percent: any = '';
            let total = 0;
            chartData.forEach((v) => {
              total += parseFloat(v.value);
            });
            const item = chartData.filter((item: any) => item.name === name)[0];
            if (!item) return;
            chartData.forEach((v) => {
              if (v.name == name) {
                if (data.all_reserve == 0) {
                  percent = 0;
                } else {
                  percent = ((v.value / data.all_reserve) * 100).toFixed(2);
                }
              }
            });
            return `{name|${name}}${percent}%`;
          },
        },
        series: [
          {
            name: '项目储备',
            type: 'pie',
            radius: '86%',
            left: '-20%',
            data: chartData,
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: false,
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
      const myChart = echarts.init(document.getElementById(chartId));
      myChart.setOption(option);
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    }
  }, [data]);

  return (
    <>
      <div id={chartId} className={`${styles.chartWrapper}`}></div>
    </>
  );
}
