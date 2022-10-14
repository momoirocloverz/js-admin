import { useEffect, useState } from 'react';
import styles from '../index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import { Typography, Button } from 'antd';
const { Title } = Typography;

const DocumentDetail = (props: any) => {
  const { location, dispatch } = props;
  const [detail, setDetail] = useState({});

  const initAction = () => {
    commitGlobalBread([
      {
        title: '资金管理',
      },
      {
        title: '资金使用',
      },
      {
        title: '政策文件详情',
      },
    ]);
  };

  const commitGlobalBread = (e: any) => {
    dispatch({
      type: 'baseModel/changeBreadArray',
      payload: e,
    });
  };
  useEffect(() => {
    initAction();
    getDetails();
  }, []);

  const getDetails = () => {
    Apis.fetchPolicyDocumentInfo({ id: location.query.id })
      .then((res) => {
        setDetail(res.data);
      })
      .catch((e) => {});
  };

  return (
    <div className={styles.pageCon}>
      <Button onClick={() => history.goBack()}>返回</Button>
      <Title level={2} style={{ margin: '10px auto' }}>
        {detail.title}
      </Title>

      {/* <Title level={5} style={{ margin: '10px auto' }}>
        {detail.get_category?.category_name}
      </Title> */}

      <Title level={5} style={{ margin: '0 auto 10px', fontWeight: 'normal' }}>
        {`发布时间：${detail.issue_at}`}
      </Title>

      <div dangerouslySetInnerHTML={{ __html: detail?.content }} />
    </div>
  );
};

export default connect((baseModel) => ({ baseModel }))(DocumentDetail);
