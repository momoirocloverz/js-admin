import { defineConfig } from 'umi';
const { REACT_APP_ENV } = process.env;
import px2vw from 'postcss-px-to-viewport';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/login', component: '@/pages/login/index', title: '登录' },
    {
      path: '/deny',
      component: '@/pages/deny/deny',
      title: '暂无权限',
    },
    {
      path: '/',
      component: '@/layouts/antdLeftRight',
      routes: [
        {
          path: '/pressRelease/policyDocument',
          component: '@/pages/pressRelease/policyDocument/index',
          title: '政策文件',
        },
        {
          path: '/pressRelease/policyDocumentNew',
          component: '@/pages/pressRelease/policyDocument/new/index',
          title: '政策文件发布',
        },
        {
          path: '/pressRelease/policyDocumentEdit',
          component: '@/pages/pressRelease/policyDocument/edit/index',
          title: '政策文件编辑',
        },
        {
          path: '/pressRelease/attractInvestment',
          component: '@/pages/pressRelease/attractInvestment/index',
          title: '招商推介',
        },
        {
          path: '/pressRelease/attractInvestmentNew',
          component: '@/pages/pressRelease/attractInvestment/new/index',
          title: '招商推介发布',
        },
        {
          path: '/pressRelease/attractInvestmentEdit',
          component: '@/pages/pressRelease/attractInvestment/edit/index',
          title: '招商推介编辑',
        },
        {
          path: '/pressRelease/understandPaper',
          component: '@/pages/pressRelease/understandPaper/index',
          title: '明白纸',
          wrappers: ['@/KeepAlive'],
        },
        {
          path: '/pressRelease/understandPaperNew',
          component: '@/pages/pressRelease/understandPaper/new/index',
          title: '明白纸发布',
        },
        {
          path: '/pressRelease/understandPaperEdit',
          component: '@/pages/pressRelease/understandPaper/edit/index',
          title: '明白纸编辑',
        },
        {
          path: '/pressRelease/understandPaperPush',
          component: '@/pages/pressRelease/understandPaper/push/index',
          title: '明白纸推送',
        },
        {
          path: '/pressRelease/noticePaper',
          component: '@/pages/pressRelease/notice/index',
          title: '公示栏',
        },
        {
          path: '/notificationList',
          component: '@/pages/notificationList/index',
          title: '待办事项',
        },
        {
          path: '/pressRelease/noticePaperNew',
          component: '@/pages/pressRelease/notice/new/index',
          title: '公示栏发布',
        },
        {
          path: '/pressRelease/noticePaperEdit',
          component: '@/pages/pressRelease/notice/edit/index',
          title: '公示栏编辑',
        },
        {
          path: '/authority/index',
          component: '@/pages/authority/index',
          title: '权限管理',
        },
        {
          path: '/application/project',
          component: '@/pages/project/index',
          name: 'projectsList',
          wrappers: ['@/KeepAlive'],
          title: '全部项目',
        },
        {
          path: '/application/ImplementMana',
          component: '@/pages/application/ImplementMana/index',
          title: '实施管理',
          name: 'projectsImplementList',
          wrappers: ['@/KeepAlive'],
        },
        {
          path: '/application/projectReserve',
          component: '@/pages/application/projectReserve/index',
          title: '项目储备',
          name: 'projectsReserveList',
          wrappers: ['@/KeepAlive'],
        },
        {
          path: '/application/projectReserveDetail',
          component: '@/pages/application/projectReserve/detail',
          title: '项目储备详情',
        },
        {
          path: '/application/projectReserveTable',
          component: '@/pages/application/projectReserve/table',
          title: '项目申报表',
        },
        {
          path: '/application/acceptanceMana',
          component: '@/pages/application/acceptanceMana/index',
          title: '验收管理',
          name: 'projectsAcceptList',
          wrappers: ['@/KeepAlive'],
        },
        {
          path: '/application/projectDeclare',
          component: '@/pages/application/index',
          name: 'projectsDeclareList',
          title: '项目申报管理',
          wrappers: ['@/KeepAlive'],
        },
        {
          path: '/application/projectDeclareDetail',
          component: '@/pages/application/declare/index',
          title: '项目申报管理详情',
        },
        {
          path: '/application/projectDeclarationDetail',
          component: '@/pages/application/declarationDetail/index',
          title: '项目申报书详情',
        },
        {
          path: '/application/projectImplementDetail',
          component: '@/pages/application/implementDetail/index',
          title: '项目实施方案简表详情',
        },
        {
          path: '/application/projectFacilityDetail',
          component: '@/pages/application/facilityDetail/index',
          title: '项目购置设备设施清单详情',
        },
        {
          path: '/application/payments',
          component: '@/pages/application/payments',
          name: 'paymentsList',
          title: '资金拨付',
          wrappers: ['@/KeepAlive'],
        },
        {
          path: '/application/files',
          component: '@/pages/application/files',
          name: 'filesList',
          title: '文件下达专区',
        },
        {
          path: '/invest/code',
          component: '@/pages/application/code/index',
          name: 'projectsAppCode',
          title: '项目赋码',
          wrappers: ['@/KeepAlive'],
        },
        {
          path: '/invest/code/Detail',
          component: '@/pages/application/code/detail',
          title: '项目赋码详情',
        },
        {
          path: '/invest/code/Detail/table',
          component: '@/pages/application/code/com/table',
          title: '项目赋码详情',
        },
        {
          path: '/baseSet/investSet',
          component: '@/pages/baseSet/investSet/index',
          name: 'baseSetInvestSet',
          title: '投资管理设置',
          wrappers: ['@/KeepAlive'],
        },
        {
          path: '/baseSet/guide',
          component: '@/pages/baseSet/guide',
          title: '指导单管理',
        },
        {
          path: '/helpFarmer/organicFertilizerAudit',
          component: '@/pages/application/organicFertilizerAudit',
          title: '有机肥补贴审核',
        },
        {
          path: '/helpFarmer/organicFertilizerAudit/detail',
          component: '@/pages/application/organicFertilizerAudit/detail',
          title: '有机肥补贴审核详情',
        },
        {
          path: '/helpFarmer/strawAudit',
          component: '@/pages/application/strawAudit',
          title: '秸秆综合利用审核',
        },
        {
          path: '/helpFarmer/strawAudit/detail',
          component: '@/pages/application/strawAudit/detail',
          title: '秸秆综合利用审核详情',
        },
        {
          path: '/helpFarmer/huLambsAudit',
          component: '@/pages/application/huLambsAudit',
          title: '湖羊产业扶持审核',
        },
        {
          path: '/helpFarmer/huLambsAudit/detail',
          component: '@/pages/application/huLambsAudit/detail',
          title: '湖羊产业扶持审核详情',
        },
        {
          path: '/helpFarmer/harmlessAudit',
          component: '@/pages/application/harmlessAudit',
          title: '病死动物无害化处理审核',
        },
        {
          path: '/helpFarmer/harmlessAudit/detail',
          component: '@/pages/application/harmlessAudit/detail',
          title: '病死动物无害化处理审核详情',
        },
        {
          path: '/helpFarmer/cropsAudit',
          component: '@/pages/application/cropsAudit',
          title: '粮油适度规模经营补贴审核',
        },
        {
          path: '/helpFarmer/cropsAudit/detail',
          component: '@/pages/application/cropsAudit/detail',
          title: '粮油适度规模经营补贴审核详情',
        },
        {
          path: '/project/details/:id?',
          component: '@/pages/application/details/index',
          title: '项目详情',
        },
        {
          path: '/',
          component: '@/pages/homePage/index',
          title: '首页',
        },
        {
          path: '/system/users',
          component: '@/pages/system/Users',
          title: '用户管理',
        },
        {
          path: '/system/roles',
          component: '@/pages/system/Roles',
          title: '用户角色管理',
        },
        {
          path: '/system/navs',
          component: '@/pages/system/Navs',
          title: '导航管理',
        },
        {
          path: '/system/homePageConfig',
          component: '@/pages/system/homePageConfig',
          title: '首页配置',
        },
        {
          path: '/feedbacks',
          component: '@/pages/feedbacks',
          title: '反馈管理',
        },
        {
          path: '/fund/index',
          component: '@/pages/fund',
          title: '资金管理',
        },

        {
          path: '/fund/detail',
          component: '@/pages/fund/detail',
          title: '资金下达详情',
        },
        {
          path: '/fund/documentDetail',
          component: '@/pages/fund/documentDetail',
          title: '政策文件详情',
        },
        {
          path: '/fund/source',
          component: '@/pages/fundSource/index',
          title: '资金来源',
        },
        {
          path: '/fund/source/new',
          component: '@/pages/fundSource/new',
          title: '资金来源',
        },
        {
          path: '/fund/source/edit',
          component: '@/pages/fundSource/edit',
          title: '资金来源',
        },
        {
          path: '/fund/source/detail',
          component: '@/pages/fundSource/detail',
          title: '资金来源',
        },
        {
          path: '/fund/projectFunding',
          component: '@/pages/projectFunding/index',
          title: '项目资金来源',
        },
        {
          path: '/fund/projectFunding/new',
          component: '@/pages/projectFunding/new',
          title: '项目资金来源',
        },
        {
          path: '/fund/projectFunding/edit',
          component: '@/pages/projectFunding/edit',
          title: '项目资金来源',
        },
        {
          path: '/fund/projectFunding/detail',
          component: '@/pages/projectFunding/detail',
          title: '项目资金来源',
        },
        {
          path: '/*',
          exact: false,
          component: '@/pages/404',
        },
      ],
    },
  ],
  fastRefresh: {},
  hash: true,
  antd: {},
  dva: {
    immer: { enableES5: true },
    hmr: true,
  },
  define: {
    REACT_APP_ENV,
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
  },
  // mfsu:{},
  dynamicImport: {},
  targets: {
    ie: 11,
  },
  // https://3x.ant.design/docs/react/customize-theme-cn
  // https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
  // 定制样式,有需要再加
  theme: {
    '@primary-color': '#0270c3',
    '@error-color': '#FF4D4F',
    '@border-color-base': '#333',
  },
  ignoreMomentLocale: true,
  proxy: {
    '/admin': {
      target: 'http://dev-jiangshan-tzyjs-apiadmini.hzanchu.com',
      // target: 'http://pre-jiangshan-tzyjs-apiadmini.hzanchu.com',
      // target: 'https://jiangshan-tzyjs-apiadmini.zjsszxc.com',
      secure: false,
      changeOrigin: true,
    },
  },
  // 配置额外的 postcss 插件(px 转 vw|vh)
  extraPostCSSPlugins: [
    px2vw({
      unitToConvert: 'px', // 要转化的单位
      viewportWidth: 1920, // 视窗的宽度，可根据自己的需求调整（这里是以PC端为例）
      viewportHeight: 1080, // 视窗的高度
      unitPrecision: 6, // 转换后的精度，即小数点位数
      propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
      fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
      selectorBlackList: ['wrap'], // 指定不转换为视窗单位的类名，
      minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
      mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
      replace: true, // 是否转换后直接更换属性值
      exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
      landscape: false, // 是否处理横屏情况
    }),
  ],
});
