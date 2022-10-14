import { Col, Progress, Row } from 'antd';
import styles from './basicForm.less';
function ProjectSection({ data }) {
  return (
    <article className={styles.projectSection}>
      <Row>
        <Col span={4}>
          <h3 className={styles.sectionTitle}>{data.option_name}</h3>
        </Col>
        <Col span={20}>
          {data.list.map((item) => (
            <Row key={`${item.name}//${item.location}`}>
              <Col span={6} className={styles.cell}>
                {item.name}
              </Col>
              <Col span={6} className={styles.cell}>
                {item.location}
              </Col>
              <Col
                span={6}
                className={styles.cell}
                style={{ flexFlow: 'column' }}
              >
                <Progress
                  showInfo={false}
                  percent={
                    (parseFloat(item.complete_scale) /
                      parseFloat(item.plan_scale)) *
                    100
                  }
                />
                <div>
                  {item.complete_scale}/{item.plan_scale}
                </div>
              </Col>
              <Col
                span={6}
                className={styles.cell}
                style={{ flexFlow: 'column' }}
              >
                <Progress
                  showInfo={false}
                  percent={
                    (parseFloat(item.complete_invest_money) /
                      parseFloat(item.plan_invest_money)) *
                    100
                  }
                />
                <div>
                  {item.complete_invest_money}/{item.plan_invest_money}
                </div>
              </Col>
            </Row>
          ))}
        </Col>
      </Row>
    </article>
  );
}

export default function CompletionReport({ data }) {
  return (
    <div className={styles.fakeTable}>
      <h2>项目完成情况对比表</h2>
      <Row className={styles.headerRow}>
        <Col span={4} />
        <Col span={20}>
          <Row>
            <Col span={6} className={styles.cell}>
              项目建设分项名称
            </Col>
            <Col span={6} className={styles.cell}>
              建设地点
            </Col>
            <Col span={6} className={styles.cell}>
              建设内容
            </Col>
            <Col span={6} className={styles.cell}>
              投资情况(万元)
            </Col>
          </Row>
        </Col>
      </Row>
      {data.part_options.map((section) => (
        <ProjectSection key={section.option_mark} data={section} />
      ))}
    </div>
  );
}
