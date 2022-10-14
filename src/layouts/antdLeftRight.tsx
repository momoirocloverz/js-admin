import {
  Layout,
  Menu,
  Breadcrumb,
  Anchor,
  Dropdown,
  notification,
  message,
  Button,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { connect, history, Link } from 'umi';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Apis from '@/utils/apis';
import '../../src/pages/index.less';
import styles from './antdLeftRight.less';
import UserLayout from './UserLayout';
import { findNavs, useUserNav } from '@/components/system/useNav';
import { getNavs } from '@/api/system';
import { traverseTree } from '@/utils/common';
import {
  INCLUSIVE_MAP,
  LAMBS_MAP,
  HARMLESS_MAP,
  CROPS_MAP,
} from '@/pages/application/const';
import {
  COMPETITIVE_PROCESS,
  FUND_PROCESS,
  INCLUSIVE_PROCESS,
  LAMBS_PROCESS,
  HARMLESS_PROCESS,
  CROPS_PROCESS,
} from '@/pages/application/const';
import moment from 'moment';
const { SubMenu } = Menu;
const { Header, Sider, Content } = Layout;
const AntDLeftRightLayout = (props: any) => {
  const { location, children, dispatch, baseModel } = props;
  const [collapsed, setCollapsed] = useState(false);
  const [todoCount, setTodoCount] = useState(0);
  const [dropDownVisible, setDropDownVisible] = useState<Boolean>(false);
  const [current, setCurrent] = useState(baseModel.homeTitle);
  const [breadArray, setBreadArray] = useState(baseModel.breadArray);
  const [updateFlag, setUpdateFlag] = useState(baseModel.notificationFlag);
  const [notificationList, setNotificationList] = useState([]);
  const { data: dynamicMenu } = useUserNav();

  useEffect(() => {
    const loginToken = sessionStorage.getItem('loginToken')
      ? sessionStorage.getItem('loginToken')
      : '';
    if (!loginToken) {
      history.replace('/login');
    }
    setCurrent(baseModel.homeTitle);
    setBreadArray(baseModel.breadArray);
    setUpdateFlag(baseModel.notificationFlag);
  }, [baseModel]);

  useEffect(() => {
    fetchTodo();
  }, [updateFlag]);

  useEffect(() => {
    fetchTodo();
  }, []);

  // 点击通知跳转详情页
  const clickItem = (item: any) => {
    console.log('item', item);
    const { project_id, todo_type } = item;
    let pathname = '';
    const query: any = {};
    if (todo_type == 0) {
      // 竞争性项目
      pathname = '/project/details';
      query.stage = 1;
      query.applyId = item.project_amount_apply_id;
    } else if (todo_type == 15) {
      // 竞争性项目-资金拨付
      pathname = '/project/details';
      query.stage = 5;
    } else if (todo_type == 111) {
      // 有机肥/秸秆
      pathname = '/helpFarmer/organicFertilizerAudit/detail';
    } else if (todo_type == 121) {
      // 农机
      pathname = '/helpFarmer/strawAudit/detail';
      query.form_type = '21';
    } else if (todo_type == 122) {
      // 秸秆利用
      pathname = '/helpFarmer/strawAudit/detail';
      query.form_type = '22';
    } else if (todo_type == 123) {
      // 社会化
      pathname = '/helpFarmer/strawAudit/detail';
      query.form_type = '23';
    } else if (todo_type == 2) {
      // 湖羊
      pathname = '/helpFarmer/huLambsAudit/detail';
    } else if (todo_type == 3) {
      // 无害化
      pathname = '/helpFarmer/harmlessAudit/detail';
    } else if (todo_type == 4) {
      // 粮油
      pathname = '/helpFarmer/cropsAudit/detail';
    }
    history.push({
      pathname: pathname,
      query: {
        ...query,
        id: project_id,
      },
    });
  };

  const fetchTodo = () => {
    Apis.projectTodoList({
      solve_type: 0,
      page: 1,
      pagesize: 10,
    })
      .then((res: any) => {
        if (res && res.code === 0) {
          setTodoCount(res.data.wait_solve_count);
          let newData = res.data.data.map((ele: any) => {
            return {
              ...ele,
              fromNow: moment(ele.updated_at).fromNow(),
            };
          });
          setNotificationList(newData.slice(0, 5));
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const toggle = () => {
    if (collapsed) {
      setCollapsed(false);
    } else {
      setCollapsed(true);
    }
  };
  const commitGlobalTitle = (e: any) => {
    dispatch({
      type: 'baseModel/changeHomeTitle',
      payload: e,
    });
  };
  const toHome = () => {
    history.push('/');
    commitGlobalTitle('1');
  };
  const checkAllList = () => {
    history.push('/notificationList');
  };
  // 根据todo_type project_current_position 判断项目状态
  const generateStatus = ({ todo_type, project_current_position }: any) => {
    if (todo_type == 0) {
      // 竞争性项目
      return COMPETITIVE_PROCESS[project_current_position] || '';
    } else if (todo_type == 15) {
      // 竞争性项目-资金兑现阶段
      return FUND_PROCESS[project_current_position] || '';
    } else if (todo_type == 111) {
      // 有机肥
      return INCLUSIVE_PROCESS[project_current_position] || '';
    } else if ([121, 122, 123].includes(todo_type)) {
      // 秸秆三种补贴
      return INCLUSIVE_PROCESS[project_current_position] || '';
    } else if (todo_type == 2) {
      // 湖羊
      return LAMBS_PROCESS[project_current_position] || '';
    } else if (todo_type == 3) {
      // 无害化
      return HARMLESS_PROCESS[project_current_position] || '';
    } else if (todo_type == 4) {
      // 粮油
      return CROPS_PROCESS[project_current_position] || '';
    }
    return '';
  };

  let notificationContent = (
    <div className={styles.notificationCon}>
      <div className={styles.notiTitle}>待办事项</div>
      {notificationList.length ? (
        <div className={styles.notiListCon}>
          {notificationList.map((ele: any, index: number) => (
            <div
              className={styles.notiItem}
              key={index}
              onClick={() => clickItem(ele)}
            >
              <div className={styles.notiItemContent}>
                {`【${generateStatus(ele)}】`}
              </div>
              <div className={styles.notiItemTime}>{ele.fromNow}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyListCon}>暂无</div>
      )}
      <div className={styles.notificationConBtns}>
        <Button onClick={fetchTodo} className={styles.btnMargin}>
          刷新
        </Button>
        <Button onClick={checkAllList}>所有待办事项</Button>
      </div>
    </div>
  );

  const sideNav = useMemo(() => {
    const renderItem = (item: any, hideTextWhenCollapsed = false) => {
      if (Array.isArray(item.children)) {
        const permissions = item.children.filter(
          (child: any) => child.type === 2,
        );
        const navs = item.children.filter((child: any) => child.type === 1);
        if (navs.length > 0) {
          return (
            <SubMenu
              key={item.id}
              title={
                <>
                  {item.icon && (
                    <img className={styles.icons} src={item.icon} />
                  )}
                  {hideTextWhenCollapsed && collapsed ? null : (
                    <span>{item.name}</span>
                  )}
                </>
              }
            >
              {navs.map((child: any) => renderItem(child))}
            </SubMenu>
          );
        }
      }
      return (
        <Menu.Item key={item.id}>
          <Link to={item.mark} replace={true} className={styles.flexLink}>
            {item.icon && <img className={styles.icons} src={item.icon} />}
            {hideTextWhenCollapsed && collapsed ? null : (
              <span>{item.name}</span>
            )}
          </Link>
        </Menu.Item>
      );
    };
    return dynamicMenu.map((child: any) => renderItem(child, true));
  }, [dynamicMenu, collapsed]);

  const handleVisibleChange = (flag: Boolean) => {
    setDropDownVisible(flag);
  };
  const breadTrigger = (ele: any) => {
    if (ele.triggerOn) {
      history.go(-1);
    }
  };
  return (
    <Layout className={styles.layout}>
      <Sider trigger={null} collapsible collapsed={collapsed} width={230}>
        {collapsed ? (
          <div className={styles.mainSmallName} onClick={toHome}>
            投资
          </div>
        ) : (
          <div className={styles.mainName} onClick={toHome}>
            农业投资管理系统
          </div>
        )}

        <Menu
          theme="dark"
          mode="inline"
          className={styles.cusMenu}
          onSelect={({ key, keyPath }) => {
            setCurrent(key);
            const path = [...keyPath].reverse();
            const breadcrumb = traverseTree(dynamicMenu, path, 'id', 'name');
            dispatch({
              type: 'baseModel/changeHomeTitle',
              payload: path[path.length - 1],
            });
            dispatch({
              type: 'baseModel/changeBreadArray',
              payload: breadcrumb.map((e, idx) => ({
                title: e,
                key: path[idx],
              })),
            });
            setBreadArray(
              breadcrumb.map((e, idx) => ({ title: e, key: path[idx] })),
            );
          }}
          selectedKeys={[current]}
        >
          {sideNav}
        </Menu>
      </Sider>
      <Layout className={styles.siteLayout}>
        <Header className={styles.siteLayoutBackground} style={{ padding: 0 }}>
          <div className={styles.headerCon}>
            <div className={styles.headLeft}>
              {collapsed ? (
                <MenuUnfoldOutlined
                  className={styles.trigger}
                  onClick={() => toggle()}
                ></MenuUnfoldOutlined>
              ) : (
                <MenuFoldOutlined
                  className={styles.trigger}
                  onClick={() => toggle()}
                ></MenuFoldOutlined>
              )}
              <Breadcrumb>
                {breadArray.map((ele: any) => (
                  <Breadcrumb.Item
                    key={ele.title}
                    className={ele.triggerOn ? styles.cursor : null}
                    onClick={() => breadTrigger(ele)}
                  >
                    {ele.title}
                  </Breadcrumb.Item>
                ))}
              </Breadcrumb>
            </div>
            <div className={styles.headRight}>
              <Dropdown
                overlay={notificationContent}
                onVisibleChange={handleVisibleChange}
                visible={dropDownVisible}
                arrow
                placement="bottom"
              >
                <div
                  className={styles.notificationCenter}
                  onClick={(e) => e.preventDefault()}
                >
                  <span>通知中心</span>
                  {todoCount ? (
                    <div className={styles.redSpot}>{todoCount}</div>
                  ) : null}
                </div>
              </Dropdown>
              <UserLayout></UserLayout>
            </div>
          </div>
        </Header>
        {/* className={styles.realContentCon} */}
        {/* style={{
            margin: '24px 16px',
            padding: 24,
          }} */}
        <Content>
          <div className={styles.fullCon}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default connect(({ baseModel }) => ({
  baseModel,
}))(AntDLeftRightLayout);
