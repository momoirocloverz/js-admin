import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import { useEffect, useState, useCallback, useRef } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import {
  message,
  Select,
  Row,
  Col,
  Modal,
  Table,
  Button,
  Radio,
  Switch,
  Tabs,
  Skeleton,
  DatePicker,
  Pagination,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import JIANGSHAN from '../../../public/jiangshan.json';
import dd from 'gdt-jsapi';
import { fitChartSize, accSubtr, keepTwoDecimal } from '@/utils/common';
import BarChart from './components/BarChart';
import BarChartPh from './components/BarChartPh';
import PieChart from './components/PieChart';
import ListTable from './components/ListTable';
import ProjectTableModal from './components/ProjectTableModal';
import ChartModalJzx from './components/ChartModalJzx';
import ChartModalPh from './components/ChartModalPh';
import useProjectCategory from '@/components/project/useProjectCategory';
import MapModalPh from './components/MapModalPh';
import { defaultOptions, genJzxSeries, genPhSeries } from './components/Map';
const { Option } = Select;
const { RangePicker } = DatePicker;
const ph_map_legend = [
  {
    icon: 'https://img.hzanchu.com/acimg/60b786d81163b8ccd94deb4cdf88b1d7.png',
    label: '有机肥使用补贴',
  },
  {
    icon: 'https://img.hzanchu.com/acimg/85546b593d681301bd03977cb8768925.png',
    label: '秸秆综合利用',
  },
  {
    icon: 'https://img.hzanchu.com/acimg/7318c28d616b44acbbf203da9508e7ac.png',
    label: '湖羊产业',
  },
  {
    icon: 'https://img.hzanchu.com/acimg/36805bd664a49261832271ec5e3a93a4.png',
    label: '病死动物无害化',
  },
  {
    icon: 'https://img.hzanchu.com/acimg/b174cc7312e8e27bf949fcb93765f980.png',
    label: '粮油适度规模经营',
  },
];

const HomePage = (props: any) => {
  const { location, dispatch } = props;
  const [project_reserve_sum, setProjectReserveNum] = useState(0);
  const [project_amount, setProject_amount] = useState(0);
  const [project_fund_source_all_amount, setProject_fund_source_all_amount] =
    useState(0);
  const [already_amount, setAlready_amount] = useState(0);
  const [yearList, setYearList] = useState<any>([]);
  const [yearGlobalList, setYearGlobalList] = useState<any>([]);
  const [yearSelect, setYearSelect] = useState(
    +moment(Date.now()).format('YYYY'),
  );

  const [dialogYearSelect, setDialogYearSelect] = useState(
    +moment(Date.now()).format('YYYY'),
  );

  const [globalYearSelect, setGlobalYearSelect] = useState(
    +moment(Date.now()).format('YYYY'),
  );

  const [dialog3YearSelect, setDialog3YearSelect] = useState(
    +moment(Date.now()).format('YYYY'),
  );
  const [townSelect, setTownSelect] = useState(undefined);
  const [townList, setTownList] = useState([]);
  const [overDueSelect, setOverDueSelect] = useState(undefined);
  const [categorySelect, setCategorySelect] = useState(undefined);
  const [selectType, setSelectType] = useState(1);
  const selectTypeRef = useRef(selectType);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [popDialogList, setPopDialogList] = useState([]);
  const [isZZD, setIsZZD] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [radio1Value, setRadio1Value] = useState('a');
  const [radio2Value, setRadio2Value] = useState('a');
  const [radio3Value, setRadio3Value] = useState('a');
  const [radio4Value, setRadio4Value] = useState('a');
  const [tableData, setTableData] = useState([]);
  const [mapForSmallScreen, setMapForSmallScreen] = useState(false);
  const [table3Data, setTable3Data] = useState([]);
  const [expandSwitchChecked, setExpandSwitchChecked] = useState<any>(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
  const [expandSwitch2Checked, setExpandSwitch2Checked] = useState<any>(false);
  const [expandedRow2Keys, setExpandedRow2Keys] = useState<any>([]);
  const [projectReserveData, setProjectReserveData] = useState<any>(null);
  const [competitiveProjectData, setCompetitiveProjectData] = useState<
    Array<any>
  >([]);
  const [competitiveFundData, setCompetitiveFundData] = useState<Array<any>>(
    [],
  );
  const [competitiveOrderData, setCompetitiveOrderData] = useState<Array<any>>(
    [],
  );
  const [competitiveCashData, setCompetitiveCashData] = useState<Array<any>>(
    [],
  );

  const [inclusiveProjectData, setInclusiveProjectData] = useState<Array<any>>(
    [],
  );
  const [inclusiveFundData, setInclusiveFundData] = useState<Array<any>>([]);
  const [inclusiveCashData, setInclusiveCashData] = useState<Array<any>>([]);

  const [projectJzSum, setProjectJzSum] = useState(0);
  const [projectPhSum, setProjectPhSum] = useState(0);
  const [restAmount, setRestAmount] = useState<any>(0);
  const [projectCapitalSourceId, setProjectCapitalSourceId] = useState('');
  const [projectTableModalVisible, setProjectTableModalVisible] =
    useState(false);
  const [chartModalSourceId, setChartModalSourceId] = useState('');
  const [chartModalJzxVisible, setChartModalJzxVisible] = useState(false);
  const [phProjectCapitalSourceId, setPhProjectCapitalSourceId] = useState('');
  const [chartModalPhVisible, setChartModalPhVisible] = useState(false);
  const [chartModalName, setChartModalName] = useState('');
  const [jzxData, setJzxData] = useState([]);
  const [phData, setPhData] = useState([]);
  const { data: category } = useProjectCategory(2);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [cu2rrent, setCu2rrent] = useState(1);
  const [to2tal, setTo2tal] = useState(0);
  const [searchCategoryName, setSearchCategoryName] = useState('');
  const [mapModalPhVisible, setMapModalPhVisible] = useState(false);
  const [townId, setTownId] = useState('');
  const [globalYear, setGlobalYear] = useState([
    moment(Date.now()),
    moment(Date.now()),
  ]);
  useEffect(() => {
    setArray();
    initAction();
    fetchArea();
    windowInit();
    windowResize();
    dd.getAuthCode({})
      .then((res) => {
        setIsZZD(true);
      })
      .catch(() => {});
    return () => {
      window.removeEventListener('resize', bindEvent);
    };
  }, []);

  const bindEvent = useCallback(
    _.debounce(() => {
      if (window.innerWidth <= 1600) {
        setMapForSmallScreen(true);
      } else {
        setMapForSmallScreen(false);
      }

      mapSearchAction();
    }, 200),
    [selectType],
  );
  const windowResize = () => {
    window.addEventListener('resize', bindEvent);
  };
  useEffect(() => {
    fetchDialog1List();
  }, [dialogYearSelect, radio1Value, radio2Value]);
  useEffect(() => {
    fetchDialog1List();
  }, [dialog3YearSelect, radio3Value, radio4Value]);
  useEffect(() => {
    if (radio2Value == 'b') {
      setTimeout(() => {
        rect1Action(tableData);
      }, 300);
    }
  }, [tableData]);
  useEffect(() => {
    if (radio3Value == 'b') {
      setTimeout(() => {
        rect3Action(table3Data);
      }, 300);
    }
  }, [table3Data]);
  useEffect(() => {
    fetchAllData();
  }, [yearSelect]);
  useEffect(() => {
    fetchAllData();
  }, [globalYear]);
  const windowInit = () => {
    if (window.innerWidth <= 1600) {
      setMapForSmallScreen(true);
    } else {
      setMapForSmallScreen(false);
    }
  };
  const setArray = () => {
    const fullYear = new Date().getFullYear();
    const arrYear = [];
    const arrMonth = [];
    for (let i = 0; i < 30; i++) {
      arrYear.push({
        name: `${fullYear - i}年`,
        value: fullYear - i,
        label: `${fullYear - i}年`,
      });
    }
    for (let i = 1; i <= 12; i++) {
      arrMonth.push({ name: `${i}月`, value: i, label: `${i}月` });
    }
    setYearList(arrYear);
    sessionStorage.setItem('runMapSearchFlag', '-1');
    let currentLength = fullYear - 2021 + 1;
    const arr2Year = [];
    for (let i = 0; i < currentLength; i++) {
      arr2Year.push({
        name: `${fullYear - i}年`,
        value: fullYear - i,
        label: `${fullYear - i}年`,
      });
    }
    setYearGlobalList(arr2Year);
  };
  const fetchArea = () => {
    Apis.areaGetTownList({})
      .then((res: any) => {
        if (res && res.code === 0) {
          setTownList(res.data.list);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const fetchAllData = () => {
    Apis.homePageList({
      search_project_type:
        selectTypeRef.current == 2 ? 'project_sub' : 'project',
      search_years:
        globalYear && globalYear.length
          ? [
              moment(globalYear[0]).format('YYYY'),
              moment(globalYear[1]).format('YYYY'),
            ]
          : undefined,
    })
      .then((res: any) => {
        if (res && res.code == 0) {
          let shorter = res.data.business_sum;
          setProjectJzSum(shorter?.jzx_xd_project_num || 0);
          setProjectPhSum(shorter?.project_ph_sum || 0);
          setProjectReserveData(res.data?.project_reserve);
          setProjectReserveNum(shorter?.project_reserve_sum || 0);
          setProject_amount(shorter?.project_analyse?.project_amount || 0);
          setProject_fund_source_all_amount(
            shorter?.project_analyse?.project_fund_source_all_amount || 0,
          );
          setAlready_amount(shorter?.project_analyse?.already_amount || 0);
          const {
            project_amount,
            already_amount,
            project_fund_source_all_amount,
          } = shorter.project_analyse;
          if (project_amount) {
            setRestAmount(
              accSubtr(project_fund_source_all_amount, already_amount),
            );
          } else {
            setRestAmount(
              accSubtr(project_fund_source_all_amount, already_amount),
            );
          }
          handleBarChartData(res.data);
          initMap(res.data);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    Apis.homePageList({
      marks: ['jzx_capital_chart'],
      search_years:
        globalYear && globalYear.length
          ? [
              moment(globalYear[0]).format('YYYY'),
              moment(globalYear[1]).format('YYYY'),
            ]
          : undefined,
      page: current,
      pagesize: 5,
    })
      .then((res: any) => {
        if (res && res.code == 0) {
          handleBarChart1Data(res.data);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, [current]);

  useEffect(() => {
    Apis.homePageList({
      marks: ['hp_capital_chart'],
      search_years:
        globalYear && globalYear.length
          ? [
              moment(globalYear[0]).format('YYYY'),
              moment(globalYear[1]).format('YYYY'),
            ]
          : undefined,
      page: cu2rrent,
      pagesize: 5,
    })
      .then((res: any) => {
        if (res && res.code == 0) {
          handleBarChart2Data(res.data);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, [cu2rrent]);

  const onPagChange = (e: any) => {
    setCurrent(e);
    console.log('e', e);
  };
  const onPag2Change = (e: any) => {
    setCu2rrent(e);
    console.log('e', e);
  };
  const showTotal = (total: number) => {
    return `共 ${total} 条`;
  };
  // 处理柱状图数据
  const handleBarChart1Data = (data: any) => {
    const { jzx_capital_chart, hp_capital_chart } = data;
    if (
      jzx_capital_chart &&
      jzx_capital_chart.data &&
      jzx_capital_chart.data.length
    ) {
      setTotal(data.jzx_capital_chart.total);
      setJzxData(jzx_capital_chart.data);
      let docs: Array<any> = [],
        funds: Array<any> = [],
        orders: Array<any> = [],
        cash: Array<any> = [];
      jzx_capital_chart.data.forEach((item: any) => {
        docs.push(item.project_name);
        funds.push({
          value: keepTwoDecimal(item.all_amount),
          label: item.project_name,
        });
        orders.push({
          value: item.all_order_amount
            ? keepTwoDecimal(item.all_order_amount)
            : 0,
          label: item.project_name,
        });
        cash.push({
          value: item.all_real_fund_amount
            ? keepTwoDecimal(item.all_real_fund_amount)
            : 0,
          label: item.project_name,
        });
      });
      setCompetitiveProjectData(docs);
      setCompetitiveFundData(funds);
      setCompetitiveOrderData(orders);
      setCompetitiveCashData(cash);
    } else {
      setTotal(0);
      setCompetitiveProjectData([]);
      setCompetitiveFundData([]);
      setCompetitiveOrderData([]);
      setCompetitiveCashData([]);
    }
  };
  const handleBarChart2Data = (data: any) => {
    const { jzx_capital_chart, hp_capital_chart } = data;

    if (
      hp_capital_chart &&
      hp_capital_chart.data &&
      hp_capital_chart.data.length
    ) {
      setTo2tal(data.hp_capital_chart.total);
      setPhData(hp_capital_chart.data);
      let docs: Array<any> = [],
        funds: Array<any> = [],
        cash: Array<any> = [];
      hp_capital_chart.data.forEach((item: any) => {
        docs.push(item.project_name);
        funds.push({
          value: keepTwoDecimal(item.all_amount),
          label: item.project_name,
        });
        cash.push({
          value: item.all_real_fund_amount
            ? keepTwoDecimal(item.all_real_fund_amount)
            : 0,
          label: item.project_name,
        });
      });
      setInclusiveProjectData(docs);
      setInclusiveFundData(funds);
      setInclusiveCashData(cash);
    } else {
      setTo2tal(0);
      setInclusiveProjectData([]);
      setInclusiveFundData([]);
      setInclusiveCashData([]);
    }
  };
  const handleBarChartData = (data: any) => {
    const { jzx_capital_chart, hp_capital_chart } = data;
    if (
      jzx_capital_chart &&
      jzx_capital_chart.data &&
      jzx_capital_chart.data.length
    ) {
      setTotal(data.jzx_capital_chart.total);
      setJzxData(jzx_capital_chart.data);
      let docs: Array<any> = [],
        funds: Array<any> = [],
        orders: Array<any> = [],
        cash: Array<any> = [];
      jzx_capital_chart.data.forEach((item: any) => {
        docs.push(item.project_name);
        funds.push({
          value: keepTwoDecimal(item.all_amount),
          label: item.project_name,
        });
        orders.push({
          value: item.all_order_amount
            ? keepTwoDecimal(item.all_order_amount)
            : 0,
          label: item.project_name,
        });
        cash.push({
          value: item.all_real_fund_amount
            ? keepTwoDecimal(item.all_real_fund_amount)
            : 0,
          label: item.project_name,
        });
      });
      setCompetitiveProjectData(docs);
      setCompetitiveFundData(funds);
      setCompetitiveOrderData(orders);
      setCompetitiveCashData(cash);
    } else {
      setTotal(0);
      setCompetitiveProjectData([]);
      setCompetitiveFundData([]);
      setCompetitiveOrderData([]);
      setCompetitiveCashData([]);
    }
    if (
      hp_capital_chart &&
      hp_capital_chart.data &&
      hp_capital_chart.data.length
    ) {
      setTo2tal(data.hp_capital_chart.total);
      setPhData(hp_capital_chart.data);
      let docs: Array<any> = [],
        funds: Array<any> = [],
        cash: Array<any> = [];
      hp_capital_chart.data.forEach((item: any) => {
        docs.push(item.project_name);
        funds.push({
          value: keepTwoDecimal(item.all_amount),
          label: item.project_name,
        });
        cash.push({
          value: item.all_real_fund_amount
            ? keepTwoDecimal(item.all_real_fund_amount)
            : 0,
          label: item.project_name,
        });
      });
      setInclusiveProjectData(docs);
      setInclusiveFundData(funds);
      setInclusiveCashData(cash);
    } else {
      setTo2tal(0);
      setInclusiveProjectData([]);
      setInclusiveFundData([]);
      setInclusiveCashData([]);
    }
  };

  const showPhMapModal = (params: any, match: any) => {
    // console.log('普惠点击', params, match);
    setTownId(match.groupId);
    if (match.value == 0) {
      // 点击的地块
      setSearchCategoryName('');
    } else {
      // 点击的图标
      setSearchCategoryName(match.name);
    }
    setMapModalPhVisible(true);
  };

  const initMap = (res: any) => {
    var myChart = echarts.init(document.getElementById('map') as HTMLElement);
    var temp = res;
    temp.mapData = (res.financial_distribution_list || []).map((ele: any) => {
      return {
        groupId: ele.id,
        value: ele.is_hign ? '1' : '0',
        normalValue: ele.project_overview.project_count,
        name: ele.town_name,
        label:
          ele.town_name == '大陈乡'
            ? { offset: [10, 10] }
            : ele.town_name == '凤林镇'
            ? { offset: [20, -40] }
            : ele.town_name == '廿八都镇'
            ? { offset: [20, -40] }
            : ele.town_name == '新塘边镇'
            ? { offset: [10, 0] }
            : {
                offset: [0, 0],
              },
      };
    });
    //@ts-ignore
    echarts.registerMap('JiangShan', JIANGSHAN);
    let series: any = [];
    if (selectTypeRef.current == 2) {
      series = genPhSeries(isZZD, temp);
    } else {
      series = genJzxSeries(isZZD, temp);
    }
    // return console.log('series', series)
    myChart.setOption(
      {
        ...defaultOptions,
        series,
      },
      true,
    );
    myChart.off('click');
    myChart.on('click', function (params) {
      if (params.seriesType == 'map') {
        let filter = params.name.replace('浙江省衢州市江山市', '');
        params.shorter = filter;
        let match = temp.mapData.find((ele: any) => {
          return ele.name == params.shorter;
        });
        if (selectTypeRef.current == 2) {
          // 普惠tab
          return showPhMapModal(params, match);
        }
        setPopDialogList([]);
        setTimeout(() => {
          setShowDialog(true);
        }, 300);
        switch (filter) {
          case '双塔街道':
            setDialogTitle('双塔街道');
            fetchMapDialogList(match);
            break;
          case '虎山街道':
            setDialogTitle('虎山街道');
            fetchMapDialogList(match);
            break;
          case '上余镇':
            setDialogTitle('上余镇');
            fetchMapDialogList(match);
            break;
          case '四都镇':
            setDialogTitle('四都镇');
            fetchMapDialogList(match);
            break;
          case '大陈乡':
            setDialogTitle('大陈乡');
            fetchMapDialogList(match);
            break;
          case '碗窑乡':
            setDialogTitle('碗窑乡');
            fetchMapDialogList(match);
            break;
          case '贺村镇':
            setDialogTitle('贺村镇');
            fetchMapDialogList(match);
            break;
          case '清湖街道':
            setDialogTitle('清湖街道');
            fetchMapDialogList(match);
            break;
          case '新塘边镇':
            setDialogTitle('新塘边镇');
            fetchMapDialogList(match);
            break;
          case '坛石镇':
            setDialogTitle('坛石镇');
            fetchMapDialogList(match);
            break;
          case '大桥镇':
            setDialogTitle('大桥镇');
            fetchMapDialogList(match);
            break;
          case '凤林镇':
            setDialogTitle('凤林镇');
            fetchMapDialogList(match);
            break;
          case '峡口镇':
            setDialogTitle('峡口镇');
            fetchMapDialogList(match);
            break;
          case '保安乡':
            setDialogTitle('保安乡');
            fetchMapDialogList(match);
            break;
          case '廿八都镇':
            setDialogTitle('廿八都镇');
            fetchMapDialogList(match);
            break;
          case '长台镇':
            setDialogTitle('长台镇');
            fetchMapDialogList(match);
            break;
          case '石门镇':
            setDialogTitle('石门镇');
            fetchMapDialogList(match);
            break;
          case '张村乡':
            setDialogTitle('张村乡');
            fetchMapDialogList(match);
            break;
          case '塘源口乡':
            setDialogTitle('塘源口乡');
            fetchMapDialogList(match);
            break;
        }
      } else {
        let match: any = params.data;
        if (selectType == 2) {
          // 普惠tab
          return showPhMapModal(params, match);
        }
        setPopDialogList([]);
        setTimeout(() => {
          setShowDialog(true);
        }, 300);
        switch (match.town_name) {
          case '双塔街道':
            setDialogTitle('双塔街道');
            fetchMapDialogList(match);
            break;
          case '虎山街道':
            setDialogTitle('虎山街道');
            fetchMapDialogList(match);
            break;
          case '上余镇':
            setDialogTitle('上余镇');
            fetchMapDialogList(match);
            break;
          case '四都镇':
            setDialogTitle('四都镇');
            fetchMapDialogList(match);
            break;
          case '大陈乡':
            setDialogTitle('大陈乡');
            fetchMapDialogList(match);
            break;
          case '碗窑乡':
            setDialogTitle('碗窑乡');
            fetchMapDialogList(match);
            break;
          case '贺村镇':
            setDialogTitle('贺村镇');
            fetchMapDialogList(match);
            break;
          case '清湖街道':
            setDialogTitle('清湖街道');
            fetchMapDialogList(match);
            break;
          case '新塘边镇':
            setDialogTitle('新塘边镇');
            fetchMapDialogList(match);
            break;
          case '坛石镇':
            setDialogTitle('坛石镇');
            fetchMapDialogList(match);
            break;
          case '大桥镇':
            setDialogTitle('大桥镇');
            fetchMapDialogList(match);
            break;
          case '凤林镇':
            setDialogTitle('凤林镇');
            fetchMapDialogList(match);
            break;
          case '峡口镇':
            setDialogTitle('峡口镇');
            fetchMapDialogList(match);
            break;
          case '保安乡':
            setDialogTitle('保安乡');
            fetchMapDialogList(match);
            break;
          case '廿八都镇':
            setDialogTitle('廿八都镇');
            fetchMapDialogList(match);
            break;
          case '长台镇':
            setDialogTitle('长台镇');
            fetchMapDialogList(match);
            break;
          case '石门镇':
            setDialogTitle('石门镇');
            fetchMapDialogList(match);
            break;
          case '张村乡':
            setDialogTitle('张村乡');
            fetchMapDialogList(match);
            break;
          case '塘源口乡':
            setDialogTitle('塘源口乡');
            fetchMapDialogList(match);
            break;
        }
      }
    });
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };

  const fetchMapDialogList = (match: any) => {
    let data = {
      town_id: match.groupId,
    };
    Apis.homePagegetTownProjectList(data)
      .then((res: any) => {
        if (res && res.code == 0) {
          let flag = sessionStorage.getItem('runMapSearchFlag');
          let match = [];
          if (flag == '-1') {
            match = res.data.list;
          } else if (flag == '1') {
            match = res.data.list.filter((ele: any) => {
              return ele.is_overdue;
            });
          } else {
            match = res.data.list.filter((ele: any) => {
              return !ele.is_overdue;
            });
          }
          console.log('match', match);
          setPopDialogList(match);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const shutDialogAction = () => {
    setShowDialog(false);
    mapSearchAction();
  };
  const initAction = () => {
    commitGlobalBread([
      {
        title: '首页',
      },
    ]);
    let userInfo = sessionStorage.getItem('currentInfo')
      ? sessionStorage.getItem('currentInfo')
      : '';
    if (userInfo) {
      console.log;
    } else {
      dd.getAuthCode({})
        .then((res) => {})
        .catch(() => {
          message.error('请登录');
          history.push('/login');
        });
    }
  };
  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };
  const globalYearChange = (value: any) => {
    setGlobalYearSelect(value);
  };
  const dialogYearChange = (value: any) => {
    setDialogYearSelect(value);
  };
  const dialog3YearChange = (value: any) => {
    setDialog3YearSelect(value);
  };
  const checkDetail = (record: any) => {
    history.push({
      pathname: '/project/details',
      query: {
        id: record.project_id,
        stage: '2',
      },
    });
  };

  const handleSummaryOk = () => {
    setShowSummary(false);
  };
  const handleSummaryCancel = () => {
    setShowSummary(false);
  };
  const calc1Function = (array: any) => {
    let temp = array.map((ele: any) => {
      if (ele.already_amount) {
        return ele.already_amount;
      } else {
        return 0;
      }
    });
    let res = temp.reduce((acc: any, current: any) => {
      return Number(acc) + Number(current);
    }, 0);
    return res;
  };
  const fetchDialog1List = () => {
    Apis.getPolicyDocumentClickZjlyze({
      search_year: dialogYearSelect,
      page: 1,
      pagesize: 99999,
    })
      .then((res: any) => {
        if (res && res.code == 0) {
          res.data.data.forEach((ele: any) => {
            ele.subitem_list.forEach((sub: any) => {
              sub.already_amount = +sub.amount - +sub.remain_amount;
            });
            let hei = calc1Function(ele.subitem_list);
            ele.alreadySumAmount = hei;
          });
          setTableData(res.data.data);
          setTable3Data(res.data.data);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const pop3Modal = () => {
    setRadio3Value('a');
    setRadio4Value('a');
    setDialog3YearSelect(+moment(Date.now()).format('YYYY'));
    setExpandedRow2Keys([]);
    setExpandSwitch2Checked(false);
    setTimeout(() => {
      setShowOrder(true);
    }, 300);
  };
  const pop1Modal = () => {
    setRadio1Value('a');
    setRadio2Value('a');
    setExpandedRowKeys([]);
    setExpandSwitchChecked(false);
    setDialogYearSelect(+moment(Date.now()).format('YYYY'));
    setTimeout(() => {
      setShowSummary(true);
    }, 300);
  };
  const handleOrderOk = () => {
    setShowOrder(false);
  };
  const handleOrderCancel = () => {
    setShowOrder(false);
  };
  const townChange = (value: any) => {
    setTownSelect(value);
  };
  const overDueChange = (value: any) => {
    setOverDueSelect(value);
  };
  const categoryChange = (value: any) => {
    if (value) {
      //@ts-ignore
      setCategorySelect(category.find((v: any) => v.value == value)?.label);
    }
  };

  // 打开二级政策文件维度表格的弹窗
  const openPolicyDocumentTableModal = async (id: string | number) => {
    await setProjectCapitalSourceId(id as string);
    setProjectTableModalVisible(true);
  };
  const columns: any = [
    {
      title: '项目名称',
      dataIndex: 'project_name',
      align: 'center',
      width: 100,
      render: (__: any, record: any) => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            openPolicyDocumentTableModal(record.id);
          }}
        >
          {record.project_name || '-'}
        </div>
      ),
    },
    {
      title: '资金来源总额（万元）',
      dataIndex: 'all_amount',
      align: 'center',
      key: 'name',
      width: 140,
    },
    {
      title: '剩余金额（万元）',
      dataIndex: 'all_remain_amount',
      align: 'center',
      key: 'name',
      width: 100,
    },
    {
      title: '年度',
      dataIndex: 'year',
      align: 'center',
      key: 'name',
      width: 100,
      render: (__: any, record: any) => <div>{record.year || '-'}</div>,
    },
  ];
  const column2s: any = [
    {
      title: '项目名称',
      dataIndex: 'project_name',
      align: 'center',
      width: 100,
      render: (__: any, record: any) => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            openPolicyDocumentTableModal(record.id);
          }}
        >
          {record.project_name || '-'}
        </div>
      ),
    },
    {
      title: '下达金额（万元）',
      dataIndex: 'all_order_amount',
      align: 'center',
      key: 'name',
      width: 140,
    },
    {
      title: '剩余下达金额（万元）',
      align: 'center',
      key: 'name',
      width: 100,
      render: (_: any, record: any) => {
        return (
          <div>{accSubtr(record.all_amount, record.all_order_amount)}</div>
        );
      },
    },
    {
      title: '年度',
      dataIndex: 'year',
      align: 'center',
      key: 'name',
      width: 100,
      render: (__: any, record: any) => <div>{record.year || '-'}</div>,
    },
  ];
  const moneyFormat = (value: any) => {
    if (value || value == 0) {
      if (value) {
        //@ts-ignore
        let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
        return fix;
      } else {
        return 0;
      }
    }
  };
  const mapResetSearchAction = () => {
    setTownSelect(undefined);
    setOverDueSelect(undefined);
    setCategorySelect(undefined);
    Apis.homePageList({
      marks: ['financial_distribution_list'],
      search_town_ids: [],
      search_is_overdue: -1,
      search_policy_category_name: undefined,
    })
      .then((res: any) => {
        if (res && res.code == 0) {
          let flag = -1;
          sessionStorage.setItem('runMapSearchFlag', `${flag}`);
          initMap(res.data);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const mapExportAction = () => {
    Apis.exportFinancialDistribution_list({
      is_export: 1,
      search_town_ids: townSelect ? townSelect : [],
      search_is_overdue: overDueSelect == undefined ? -1 : +overDueSelect,
      search_project_type:
        selectTypeRef.current == 2 ? 'project_sub' : 'project',
      search_policy_category_name: categorySelect || undefined,
    })
      .then((res: any) => {
        if (res) {
          const content = res;
          const blob = new Blob([content]);
          const fileName =
            `${selectType == 2 ? '惠农补贴项目' : '财政支农项目'}` +
            Date.now() +
            '.xls';
          if ('download' in document.createElement('a')) {
            // 非IE下载
            const elink = document.createElement('a');
            elink.download = fileName;
            elink.style.display = 'none';
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href);
            document.body.removeChild(elink);
          } else {
            //@ts-ignore IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  // project_type: 1-竞争性 2-普惠 不传-竞争性
  const mapSearchAction = (project_type?: number) => {
    console.log('here', categorySelect);
    Apis.homePageList({
      marks: ['financial_distribution_list'],
      search_town_ids: townSelect ? townSelect : [],
      search_is_overdue: overDueSelect == undefined ? -1 : +overDueSelect,
      search_project_type:
        selectTypeRef.current == 2 || project_type == 2
          ? 'project_sub'
          : 'project',
      search_policy_category_name: categorySelect || undefined,
    })
      .then((res: any) => {
        if (res && res.code == 0) {
          let flag = overDueSelect == undefined ? -1 : +overDueSelect;
          sessionStorage.setItem('runMapSearchFlag', `${flag}`);
          initMap(res.data);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const rect3Action = (table3Data: any) => {
    let data1 =
      table3Data.map((ele: any) => {
        return ele.project_name;
      }) || [];
    let data2 =
      table3Data.map((ele: any) => {
        return ele.all_order_amount;
      }) || [];
    let data3 =
      table3Data.map((ele: any) => {
        return accSubtr(ele.all_amount, ele.all_order_amount);
      }) || [];

    var myChart = echarts.init(document.getElementById('rect2') as HTMLElement);
    myChart.setOption({
      title: {
        text: '',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: 'category',
        data: data1.reverse(),
        axisLabel: {
          formatter: function (name: string) {
            return name.length > 10 ? name.slice(0, 10) + '...' : name;
          },
          interval: 0,
        },
      },
      series: [
        {
          name: '下达金额（万元）',
          type: 'bar',
          data: data2.reverse(),
        },
        {
          name: '剩余下达金额（万元）',
          type: 'bar',
          data: data3.reverse(),
        },
      ],
    });
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };
  const rect1Action = (tableData: any) => {
    let data1 =
      tableData.map((ele: any) => {
        return ele.project_name;
      }) || [];
    let data2 =
      tableData.map((ele: any) => {
        return ele.all_amount;
      }) || [];
    let data3 =
      tableData.map((ele: any) => {
        return ele.all_remain_amount;
      }) || [];
    var myChart = echarts.init(document.getElementById('rect1') as HTMLElement);
    myChart.setOption({
      title: {
        text: '',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: 'category',
        data: data1.reverse(),
        axisLabel: {
          formatter: function (name: string) {
            return name.length > 10 ? name.slice(0, 10) + '...' : name;
          },
          interval: 0,
        },
      },
      series: [
        {
          name: '资金来源总额（万元）',
          type: 'bar',
          data: data2.reverse(),
        },
        {
          name: '剩余金额（万元）',
          type: 'bar',
          data: data3.reverse(),
        },
      ],
    });
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  };
  const onRadio2Change = (e: any) => {
    setRadio2Value(e.target.value);
  };
  const onRadio3Change = (e: any) => {
    setRadio3Value(e.target.value);
  };
  const expandedSourceRowRender = (record: any) => {
    const columns1: any = [
      {
        title: '分项名称',
        align: 'center',
        key: 'name',
        width: 100,
        render: (__: any, record: any) => (
          <div>
            {(record.subitem_info && record.subitem_info.subitem_name) || '-'}
          </div>
        ),
      },
      {
        title: '分项金额',
        align: 'center',
        dataIndex: 'amount',
        key: 'name',
        width: 100,
        render: (__: any, record: any) => <div>{record.amount || '-'}</div>,
      },
      {
        title: '已下达金额',
        dataIndex: 'title',
        align: 'center',
        key: 'name',
        width: 100,
        render: (__: any, record: any) => (
          <div>{moneyFormat(record.already_amount)}</div>
        ),
      },
      {
        title: '未下达金额',
        dataIndex: 'remain_amount',
        align: 'center',
        key: 'name',
        width: 100,
        render: (__: any, record: any) => (
          <div>{record.remain_amount || '-'}</div>
        ),
      },
    ];
    const data = record.subitem_list;
    return (
      <Table
        size="small"
        rowKey="id"
        columns={columns1}
        dataSource={data}
        pagination={false}
      />
    );
  };
  const expandedOrderRowRender = (record: any) => {
    const columns1: any = [
      {
        title: '资金来源',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 50,
        render: (__: any, record: any) => (
          <div>{record.project_name || '-'}</div>
        ),
      },
      {
        title: '分项名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 50,
        render: (__: any, record: any) => (
          <div>{record.subitem_name || '-'}</div>
        ),
      },
      {
        title: '分项金额',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 50,
        render: (__: any, record: any) => <div>{record.amount}</div>,
      },
      {
        title: '已兑现金额',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 50,
        render: (__: any, record: any) => (
          <div>{moneyFormat(record.already_amount)}</div>
        ),
      },
      {
        title: '剩余兑现金额',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 50,
        render: (__: any, record: any) => <div>{record.remain_amount}</div>,
      },
      {
        title: '资金年度',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 50,
        render: (__: any, record: any) => <div>{record.year || '-'}</div>,
      },
    ];
    const data = record.policy_document_rel_subitem_list;
    return (
      <Table
        size="small"
        rowKey="id"
        columns={columns1}
        dataSource={data}
        pagination={false}
      />
    );
  };

  // 展开状态改变
  const onExpandedRowsChange = (expandedRows: any) => {
    setExpandedRowKeys(expandedRows);
    if (expandedRows.length != tableData.length) {
      setExpandSwitchChecked(false);
    } else {
      setExpandSwitchChecked(true);
    }
  };

  // 全部展开、收起
  const onExpandSwitchChange = (expand: any) => {
    setExpandSwitchChecked(expand);
    setExpandedRowKeys(expand ? tableData.map((v: any) => v.id) : []);
  };

  const onExpandedRows2Change = (expandedRows: any) => {
    setExpandedRow2Keys(expandedRows);
    if (expandedRows.length != table3Data.length) {
      setExpandSwitch2Checked(false);
    } else {
      setExpandSwitch2Checked(true);
    }
  };

  // 全部展开、收起
  const onExpandSwitch2Change = (expand: any) => {
    setExpandSwitch2Checked(expand);
    setExpandedRow2Keys(expand ? table3Data.map((v: any) => v.id) : []);
  };

  // 柱状图点击回调 name:点击条目对应项目资金文件名
  const onBarClick = (name: string) => {
    //@ts-ignore
    const sourceId = jzxData.find((v: any) => v.project_name == name)?.id;
    setChartModalSourceId(sourceId);
    setChartModalJzxVisible(true);
    setChartModalName(`${name} 资金情况`);
  };

  // 惠农补贴柱状图点击回调 name:点击条目对应项目资金文件名
  const onPhBarClick = (name: string) => {
    //@ts-ignore
    const categoryId = phData.find((v: any) => v.project_name == name)?.id;
    setPhProjectCapitalSourceId(categoryId);
    setChartModalPhVisible(true);
    setChartModalName(`${name} 资金情况`);
  };
  const disabledDate = (current: any) => {
    // console.log('current', current.year());
    return current.year() < 2021;
  };
  const setGlobalRange = (val: any) => {
    console.log(val);
    setGlobalYear(val);
  };
  return (
    <div className={styles.homePageCon}>
      <div className={styles.topyearCon}>
        <span>选择年度</span>
        {/* <Select
          className={styles.marginBottom20}
          style={{ width: 120 }}
          value={globalYearSelect}
          onChange={globalYearChange}
        >
          {yearGlobalList.map((ele: any) => (
            <Option value={ele.value} key={ele.value}>
              {ele.label}
            </Option>
          ))}
        </Select> */}
        <RangePicker
          picker="year"
          onChange={(val) => setGlobalRange(val)}
          className={styles.marginBottom20}
          disabledDate={disabledDate}
          value={globalYear}
        />
      </div>
      <div className={`${styles.topPartCon} ${isZZD ? styles.zzd : ''}`}>
        <div
          className={`${styles.blockCon} ${styles.blockCon5} ${styles.animation}`}
          onClick={() => pop1Modal()}
        >
          <div className={styles.topPart1Divide}></div>
          <div className={styles.topPartDivide}>
            <div className={styles.blockConText1}>资金来源总额</div>
            <div className={styles.blockConText2}>
              {project_fund_source_all_amount}万元
            </div>
          </div>
        </div>
        <div
          className={`${styles.blockCon} ${styles.blockCon2} ${styles.animation}`}
          onClick={() => pop3Modal()}
        >
          <div className={styles.topPart1Divide}></div>
          <div className={styles.topPartDivide}>
            <div className={styles.blockConText1}>已下达金额</div>
            <div className={styles.blockConText2}>{project_amount}万元</div>
          </div>
        </div>
        <div className={`${styles.blockCon} ${styles.blockCon7} `}>
          <div className={styles.topPart1Divide}></div>
          <div className={styles.topPartDivide}>
            <div className={styles.blockConText1}>已兑现资金数量</div>
            <div className={styles.blockConText2}>{already_amount}万元</div>
          </div>
        </div>
        <div className={`${styles.blockCon} ${styles.blockCon4}`}>
          <div className={styles.topPart1Divide}></div>
          <div className={styles.topPartDivide}>
            <div className={styles.blockConText1}>剩余兑现资金数</div>
            <div className={styles.blockConText2}>{restAmount}万元</div>
          </div>
        </div>
      </div>

      <div className={`${styles.topPartCon} ${isZZD ? styles.zzd : ''}`}>
        <div className={`${styles.blockCon} ${styles.blockCon1}`}>
          <div className={styles.topPart1Divide}></div>
          <div className={styles.topPartDivide}>
            <div className={styles.blockConText1}>项目储备数</div>
            <div className={styles.blockConText2}>{project_reserve_sum}个</div>
          </div>
        </div>
        <div className={`${styles.blockCon} ${styles.blockCon6}`}>
          <div className={styles.topPart1Divide}></div>
          <div className={styles.topPartDivide}>
            <div className={styles.blockConText1}>项目赋码数</div>
            <div className={styles.blockConText2}>0个</div>
          </div>
        </div>
        <div className={`${styles.blockCon} ${styles.blockCon3}`}>
          <div className={styles.topPart1Divide}></div>
          <div className={styles.topPartDivide}>
            <div className={styles.blockConText1}>竞争性项目下达数</div>
            <div className={styles.blockConText2}>{projectJzSum}个</div>
          </div>
        </div>
        <div className={`${styles.blockCon} ${styles.blockCon8}`}>
          <div className={styles.topPart1Divide}></div>
          <div className={styles.topPartDivide}>
            <div className={styles.blockConText1}>普惠项目申报数</div>
            <div className={styles.blockConText2}>{projectPhSum}个</div>
          </div>
        </div>
      </div>

      <Row gutter={16} className={styles.chartConatiner}>
        <Col span={12}>
          <div className={styles.leftMap}>
            <div className={styles.top}>
              <div className={`${styles.borderTitle} ${styles.hideTag}`}>
                <div
                  className={`${styles.typeItem} ${
                    selectType == 1 ? styles.typeItemSelected : ''
                  }`}
                  onClick={() => {
                    setSelectType(1);
                    selectTypeRef.current = 1;
                    mapSearchAction(1);
                  }}
                >
                  竞争性财政支农项目分布
                </div>
                <div
                  className={`${styles.typeItem} ${
                    selectType == 2 ? styles.typeItemSelected : ''
                  }`}
                  onClick={() => {
                    setSelectType(2);
                    selectTypeRef.current = 2;
                    mapSearchAction(2);
                  }}
                >
                  惠农补贴项目分布
                </div>
              </div>
              <div className={styles.mapSearchCon}>
                <div className={styles.mapSearchSingleCon}>
                  <div className={styles.mapSearchItem}>
                    <span className={styles.marginRight10}>地区</span>
                    <Select
                      style={
                        mapForSmallScreen ? { width: 100 } : { width: 170 }
                      }
                      value={townSelect}
                      size={mapForSmallScreen ? 'small' : undefined}
                      onChange={townChange}
                      placeholder="请选择"
                      mode="multiple"
                      maxTagCount={1}
                    >
                      {townList.map((ele: any) => (
                        <Option value={ele.id} key={ele.id}>
                          {ele.town_name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="btns">
                    <Button
                      type="primary"
                      size={mapForSmallScreen ? 'small' : undefined}
                      className={styles.mapReset1SearchItem}
                      onClick={() => mapSearchAction()}
                    >
                      查询
                    </Button>
                    <Button
                      size={mapForSmallScreen ? 'small' : undefined}
                      className={styles.mapReset2SearchItem}
                      onClick={() => mapResetSearchAction()}
                    >
                      重置
                    </Button>
                  </div>
                </div>
                <div className={styles.mapSearchSingleCon}>
                  {selectType == 1 ? (
                    <div className={styles.mapSearchItem}>
                      <span className={styles.marginRight10}>是否逾期</span>
                      <Select
                        style={
                          mapForSmallScreen ? { width: 75 } : { width: 140 }
                        }
                        size={mapForSmallScreen ? 'small' : undefined}
                        value={overDueSelect}
                        onChange={overDueChange}
                        placeholder="请选择"
                      >
                        <Option value={`0`}>否</Option>
                        <Option value={`1`}>是</Option>
                      </Select>
                    </div>
                  ) : (
                    <div className={styles.mapSearchSingleCon}>
                      <div className={styles.mapSearchItem}>
                        <span className={styles.marginRight10}>分类</span>
                        <Select
                          style={
                            mapForSmallScreen ? { width: 140 } : { width: 210 }
                          }
                          value={categorySelect}
                          size={mapForSmallScreen ? 'small' : undefined}
                          onChange={categoryChange}
                          placeholder="请选择"
                          maxTagCount={1}
                        >
                          {category.map((ele: any) => (
                            <Option value={ele.value} key={ele.value}>
                              {ele.label}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  )}
                  {/* <div className={styles.mapSearchItem}>
                    <span className={styles.marginRight10}>是否逾期</span>
                    <Select
                      style={mapForSmallScreen ? { width: 75 } : { width: 140 }}
                      size={mapForSmallScreen ? 'small' : undefined}
                      value={overDueSelect}
                      onChange={overDueChange}
                      placeholder="请选择"
                    >
                      <Option value={`0`}>否</Option>
                      <Option value={`1`}>是</Option>
                    </Select>
                  </div> */}
                  <div
                    className={styles.mapExportSearchItem}
                    onClick={() => mapExportAction()}
                  >
                    <img src="https://img.hzanchu.com/acimg/b748dcd9a01e0cd86ac2639b22c7007d.png" />
                    <span>导出</span>
                  </div>
                </div>
                {/* {selectType == 2 && (
                  <div className={styles.mapSearchSingleCon}>
                    <div className={styles.mapSearchItem}>
                      <span className={styles.marginRight10}>分类</span>
                      <Select
                        style={
                          mapForSmallScreen ? { width: 140 } : { width: 210 }
                        }
                        value={categorySelect}
                        size={mapForSmallScreen ? 'small' : undefined}
                        onChange={categoryChange}
                        placeholder="请选择"
                        maxTagCount={1}
                      >
                        {category.map((ele: any) => (
                          <Option value={ele.value} key={ele.value}>
                            {ele.label}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                )} */}
              </div>
            </div>
            <div className={styles.bottom}>
              <div className={styles.bottomRightCon}>
                <div id="map" className={styles.map}></div>
                {selectType == 2 ? (
                  <div className={styles.mapMarkDescribe}>
                    {ph_map_legend.map((v) => (
                      <div className={styles.mapMarkItem} key={v.label}>
                        <div className={styles.iconWrapper}>
                          <img src={v.icon} className={styles.legendIcon} />
                        </div>
                        <div>{v.label}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.mapMarkDescribe}>
                    <div className={styles.mapMarkItem}>
                      <div className={styles.normalyearSpot}></div>
                      <div>正常</div>
                    </div>
                    <div className={styles.mapMarkItem}>
                      <div className={styles.halfyearSpot}></div>
                      <div>逾期半年</div>
                    </div>
                    <div className={styles.mapMarkItem}>
                      <div className={styles.oneyearSpot}></div>
                      <div>逾期一年以上</div>
                    </div>
                    {/* <div className={styles.mapMarkItem}>
                      <div className={styles.twoyearSpot}></div>
                      <div>逾期两年</div>
                    </div> */}
                  </div>
                )}
                {showDialog ? (
                  <div className={styles.popDialog}>
                    <div className={styles.popDialogHeader}>
                      <div>{dialogTitle}</div>
                      <CloseOutlined
                        className={styles.shutIcon}
                        onClick={() => shutDialogAction()}
                      />
                    </div>
                    <div className={styles.popDialogListCon}>
                      {popDialogList && popDialogList.length ? (
                        popDialogList.map((ele: any) => (
                          <div className={styles.itemCon} key={ele.project_id}>
                            <div className={styles.itemFirstCon}>
                              <div className={styles.itemFirstLeft}>
                                <div className={styles.item1Title}>
                                  项目名称
                                </div>
                                <div className={styles.item1Content}>
                                  {ele.project_name}
                                </div>
                              </div>
                              <div className={styles.itemFirstRight}>
                                <div className={styles.popDialogListSubStatus}>
                                  {ele.is_overdue ? (
                                    !ele.overdue_year ? (
                                      <div
                                        className={styles.popDialogStatusNormal}
                                      >
                                        <div className={styles.spot}></div>
                                        <div className={styles.statusText}>
                                          正常
                                        </div>
                                      </div>
                                    ) : ele.overdue_year == 0.5 ? (
                                      <div
                                        className={styles.popDialogStatusHalf}
                                      >
                                        <div className={styles.spot}></div>
                                        <div className={styles.statusText}>
                                          逾期半年
                                        </div>
                                      </div>
                                    ) : ele.overdue_year >= 1 ? (
                                      <div
                                        className={styles.popDialogStatusOne}
                                      >
                                        <div className={styles.spot}></div>
                                        <div className={styles.statusText}>
                                          逾期一年以上
                                        </div>
                                      </div>
                                    ) : (
                                      //     : ele.overdue_year == 2 ? (
                                      // <div
                                      //   className={styles.popDialogStatusTwo}
                                      // >
                                      //   <div className={styles.spot}></div>
                                      //   <div className={styles.statusText}>
                                      //     逾期两年
                                      //   </div>
                                      // </div>
                                      //     )

                                      ''
                                    )
                                  ) : (
                                    <div
                                      className={styles.popDialogStatusNormal}
                                    >
                                      <div className={styles.spot}></div>
                                      <div className={styles.statusText}>
                                        正常
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* <div className={styles.popDialogListStatus}></div> */}
                            <div className={styles.itemSecondCon}>
                              <div className={styles.itemTitle}>
                                计划建设内容
                              </div>
                              <div className={styles.itemContent}>
                                {ele.build_main_content}
                              </div>
                            </div>
                            <div className={styles.itemThirdCon}>
                              <div className={styles.itemTitle}>
                                计划建设时间
                              </div>
                              <div className={styles.itemContent}>
                                {moment(ele.build_start_at).format(
                                  'YYYY年MM月',
                                )}
                                -{moment(ele.build_end_at).format('YYYY年MM月')}
                              </div>
                            </div>
                            <div
                              className={styles.itemButtonCon}
                              onClick={() => checkDetail(ele)}
                            >
                              查看项目进度汇报记录
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={styles.dialogEmpty}>暂无</div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.rightChart}>
            <div className={styles.chartCon}>
              <div className={styles.borderTitle}>竞争性项目资金情况</div>
              <BarChart
                chartId={'barChart1'}
                nameList={competitiveProjectData}
                fundList={competitiveFundData}
                orderList={competitiveOrderData}
                cashList={competitiveCashData}
                onBarClick={onBarClick}
              ></BarChart>
              <div className={styles.pagWrapper}>
                <Pagination
                  className={styles.pagination}
                  total={total}
                  size="small"
                  current={current}
                  pageSize={5}
                  showTotal={showTotal}
                  onChange={onPagChange}
                />
              </div>
            </div>
            <div className={styles.chartCon}>
              <div className={styles.borderTitle}>惠农补贴资金情况</div>
              <BarChartPh
                chartId={'barChart2'}
                nameList={inclusiveProjectData}
                fundList={inclusiveFundData}
                cashList={inclusiveCashData}
                onBarClick={onPhBarClick}
              ></BarChartPh>
              <div className={styles.pagWrapper}>
                <Pagination
                  className={styles.pagination}
                  total={to2tal}
                  size="small"
                  current={cu2rrent}
                  pageSize={5}
                  showTotal={showTotal}
                  onChange={onPag2Change}
                />
              </div>
            </div>
            <div className={styles.chartCon}>
              <div className={styles.borderTitle}>项目储备类型分布</div>
              <PieChart
                chartId={'pieChart1'}
                data={projectReserveData}
              ></PieChart>
            </div>
          </div>
        </Col>
      </Row>
      <Row className={styles.listContainer}>
        <div className={`${styles.borderTitle} ${styles.mb20}`}>
          竞争性项目情况
        </div>
        <ListTable></ListTable>
      </Row>
      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showSummary}
        title="资金来源汇总表"
        width={1000}
        onOk={handleSummaryOk}
        onCancel={handleSummaryCancel}
      >
        <div className={styles.htmlCon}>
          <div className={styles.radio2Con}>
            <Select
              className={styles.marginRight}
              style={{ width: 120 }}
              value={dialogYearSelect}
              onChange={dialogYearChange}
            >
              {yearList.map((ele: any) => (
                <Option value={ele.value} key={ele.value}>
                  {ele.label}
                </Option>
              ))}
            </Select>
            <Radio.Group onChange={(e) => onRadio2Change(e)} defaultValue="a">
              <Radio.Button value="a">表</Radio.Button>
              <Radio.Button value="b">图</Radio.Button>
            </Radio.Group>
          </div>
          {radio2Value == 'a' ? (
            <div className={styles.wrapper}>
              <div className={styles.expandSwitch}>
                <Switch
                  checkedChildren="展开"
                  unCheckedChildren="收起"
                  defaultChecked
                  checked={expandSwitchChecked}
                  onChange={onExpandSwitchChange}
                />
              </div>
              <Table
                columns={columns}
                className="expandTable"
                expandable={{
                  expandedRowClassName: () => 'expandRow',
                  expandedRowRender: expandedSourceRowRender,
                  defaultExpandAllRows: false,
                  expandRowByClick: true,
                  onExpandedRowsChange: onExpandedRowsChange,
                  expandedRowKeys,
                }}
                onRow={(record) => {
                  return {
                    className: expandedRowKeys.includes(record.id)
                      ? 'expanded'
                      : '',
                  };
                }}
                dataSource={tableData}
                rowKey="id"
                scroll={{ y: 400 }}
                bordered
                size="middle"
                pagination={false}
              />
            </div>
          ) : (
            <div key="123tabe">
              <div className={styles.rect1} id="rect1"></div>
            </div>
          )}
        </div>
      </Modal>
      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showOrder}
        title="已下达资金汇总表"
        width={1000}
        onOk={handleOrderOk}
        onCancel={handleOrderCancel}
      >
        <div className={styles.htmlCon}>
          <div className={styles.radio2Con}>
            <Select
              className={styles.marginRight}
              style={{ width: 120 }}
              value={dialog3YearSelect}
              onChange={dialog3YearChange}
            >
              {yearList.map((ele: any) => (
                <Option value={ele.value} key={ele.value}>
                  {ele.label}
                </Option>
              ))}
            </Select>
            <Radio.Group onChange={(e) => onRadio3Change(e)} defaultValue="a">
              <Radio.Button value="a">表</Radio.Button>
              <Radio.Button value="b">图</Radio.Button>
            </Radio.Group>
          </div>
          {radio3Value == 'a' ? (
            <div className={styles.wrapper}>
              <div className={styles.expandSwitch}>
                <Switch
                  checkedChildren="展开"
                  unCheckedChildren="收起"
                  defaultChecked
                  checked={expandSwitch2Checked}
                  onChange={onExpandSwitch2Change}
                />
              </div>
              <Table
                columns={column2s}
                dataSource={table3Data}
                rowKey="id"
                expandable={{
                  expandedRowClassName: () => 'expandRow',
                  expandedRowRender: expandedOrderRowRender,
                  expandRowByClick: true,
                  defaultExpandAllRows: false,
                  onExpandedRowsChange: onExpandedRows2Change,
                  expandedRowKeys: expandedRow2Keys,
                }}
                onRow={(record) => {
                  return {
                    className: expandedRow2Keys.includes(record.id)
                      ? 'expanded'
                      : '',
                  };
                }}
                scroll={{ y: 400 }}
                bordered
                size="middle"
                pagination={false}
              />
            </div>
          ) : (
            <div key="456tabe">
              <div id="rect2" className={styles.rect2}></div>
            </div>
          )}
        </div>
      </Modal>

      {chartModalSourceId && (
        <ChartModalJzx
          projectCapitalSourceId={chartModalSourceId}
          visible={chartModalJzxVisible}
          name={chartModalName}
          onCancel={() => {
            setChartModalSourceId('');
            setChartModalName('');
            setChartModalJzxVisible(false);
          }}
        />
      )}

      {phProjectCapitalSourceId && (
        <ChartModalPh
          projectCapitalSourceId={phProjectCapitalSourceId}
          visible={chartModalPhVisible}
          name={chartModalName}
          onCancel={() => {
            setPhProjectCapitalSourceId('');
            setChartModalName('');
            setChartModalPhVisible(false);
          }}
        />
      )}

      {projectCapitalSourceId && (
        <ProjectTableModal
          projectCapitalSourceId={projectCapitalSourceId}
          visible={projectTableModalVisible}
          onCancel={() => {
            setProjectCapitalSourceId('');
            setProjectTableModalVisible(false);
          }}
        />
      )}

      {mapModalPhVisible && (
        <MapModalPh
          townId={townId}
          projectCapitalSourceId={projectCapitalSourceId}
          searchCategoryName={searchCategoryName || categorySelect}
          visible={mapModalPhVisible}
          onCancel={() => {
            setSearchCategoryName('');
            setMapModalPhVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(HomePage);
