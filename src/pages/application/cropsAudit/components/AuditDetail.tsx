import styles from './index.less';
import { useEffect, useState } from 'react';
import FileList from '@/components/form/FileList';
import SectionHeader from '@/components/form/SectionHeader';
import { Input, Form, Row, Col, Table } from 'antd';
import { ConsoleSqlOutlined } from '@ant-design/icons';

const fileListCustomFieldNames = {
  fileName: 'origin_name',
  extension: 'suffix',
};

const AuditDetail = (props: any) => {
  const { currentDetail, cropList } = props;
  const [form] = Form.useForm();
  const [cropTotalArea, setCropTotalArea] = useState(0);

  useEffect(() => {
    if (currentDetail.sub_info) {
      const subInfo = currentDetail.sub_info;
      if (subInfo.crop_list?.length) {
        let totalArea = 0;
        subInfo.crop_list.forEach((v: any) => {
          totalArea += Number(v.total_area);
        });
        setCropTotalArea(totalArea);
      }
      form.setFieldsValue({
        principal: subInfo.principal,
        address: subInfo.address,
        cbAddress: `${subInfo.cb_area_info?.town_name}/${subInfo.cb_area_info?.village_name}`,
        ...subInfo,
      });
    }
  }, [currentDetail]);

  const formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 8 },
    },
  };

  // 材料
  let bottomContentVariable = (
    <>
      <div>
        <SectionHeader title="1.粮油生产经营主体承诺书" />
        <FileList
          list={
            currentDetail.materials_list && currentDetail.materials_list[71]
              ? currentDetail.materials_list[71]
              : []
          }
          customFieldNames={fileListCustomFieldNames}
        />
      </div>
      <div>
        <SectionHeader title="2.种植区域农村土地承包经营权委托流转合同" />
        <FileList
          list={
            currentDetail.materials_list && currentDetail.materials_list[72]
              ? currentDetail.materials_list[72]
              : []
          }
          customFieldNames={fileListCustomFieldNames}
        />
      </div>
      <div>
        <SectionHeader title="3.种植区域耕地承包流转清册" />
        <FileList
          list={
            currentDetail.materials_list && currentDetail.materials_list[73]
              ? currentDetail.materials_list[73]
              : []
          }
          customFieldNames={fileListCustomFieldNames}
        />
      </div>
      <div>
        <SectionHeader title="4.种植区域分布示意图（现状图）" />
        <FileList
          list={
            currentDetail.materials_list && currentDetail.materials_list[74]
              ? currentDetail.materials_list[74]
              : []
          }
          customFieldNames={fileListCustomFieldNames}
        />
      </div>
      <div>
        <SectionHeader title="5.大田租金支付凭证或分户支付清册" />
        <FileList
          list={
            currentDetail.materials_list && currentDetail.materials_list[75]
              ? currentDetail.materials_list[75]
              : []
          }
          customFieldNames={fileListCustomFieldNames}
        />
      </div>
    </>
  );

  // 表单信息
  let formContentVariable = () => {
    const { bg_area_info } = currentDetail.sub_info;
    return (
      <>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="main_name" label="粮食生产经营主体">
              <Input
                placeholder="粮食生产经营主体"
                disabled
                style={{ width: 230 }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="principal" label="负责人">
              <Input placeholder="负责人" disabled style={{ width: 230 }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="mobile" label="电话">
              <Input disabled placeholder="电话" style={{ width: 230 }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="idcard" label="身份证">
              <Input disabled placeholder="身份证" style={{ width: 230 }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="company_credit_code" label="企业信用代码">
              <Input
                disabled
                placeholder="企业信用代码"
                style={{ width: 230 }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="cbAddress" label="承包地址">
              <Input disabled placeholder="承包地址" style={{ width: 230 }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="cb_area" label="承包面积（亩）">
              <Input disabled placeholder="承包面积" style={{ width: 230 }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="办公地址">
              <Input
                disabled
                placeholder="承包面积"
                value={`${bg_area_info.city_name}${bg_area_info.town_name}${bg_area_info.village_name}${currentDetail.sub_info.bg_address}`}
                style={{ width: 230 }}
              />
              {/* <div className={styles.bg_address} style={{ width: 200 }}>
                
              </div> */}
            </Form.Item>
          </Col>
          {/* <Col span={12}>
            <Form.Item name="bank" label="申请单位开户银行">
              <Input
                disabled
                placeholder="申请单位开户银行"
                style={{ width: 200 }}
              />
            </Form.Item>
          </Col> */}
        </Row>
      </>
    );
  };

  // 表单信息-多项信息表格展示
  const tableColumns = [
    {
      title: '作物类型',
      dataIndex: 'type_text',
      key: 'type_text',
    },
    {
      title: '种粮面积(亩)',
      dataIndex: 'total_area',
      key: 'total_area',
    },
    {
      title: '分布地名称/面积',
      key: 'crop_type',
      render: (text: any, record: any) => (
        <div>
          {record.list.map((item: any, i: number) => (
            <span key={i}>
              {item.dist_name}/{item.area}亩；
            </span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className={styles.leftTopCon}>
        <div className={styles.subTitle}>基本信息</div>
        <Form
          {...formItemLayout}
          form={form}
          name="nest-messages"
          labelAlign={'left'}
          className={styles.formCon}
        >
          {currentDetail && currentDetail.sub_info && formContentVariable}
        </Form>

        <div className={styles.subTitle}>农作物种植情况</div>
        <Table
          bordered
          size="small"
          columns={tableColumns}
          dataSource={cropList}
          pagination={false}
          rowKey="crop_type"
          summary={(pageData) => {
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell
                    className={styles.centerAlignBold}
                    colSpan={1}
                  >
                    合计
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    className={styles.centerAlignBold}
                    colSpan={1}
                  >
                    <div>{cropTotalArea}</div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell></Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
      </div>

      <div className={styles.leftBottomCon}>
        <div className={styles.subTitle}>材料查看</div>

        {bottomContentVariable}
      </div>
    </>
  );
};

export default AuditDetail;
