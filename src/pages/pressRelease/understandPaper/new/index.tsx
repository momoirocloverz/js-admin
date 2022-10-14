import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState, useRef, Component } from 'react';
import { RightOutlined, PlusOutlined } from '@ant-design/icons';
import _ from 'lodash';
import {
  message,
  Form,
  Input,
  Select,
  Button,
  Popconfirm,
  Modal,
  Checkbox,
  Cascader,
  Tag,
} from 'antd';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from '@tinymce/tinymce-react';
import tinymce from 'tinymce';
import Check from './check';
import editorConfig from '@/utils/tinymce_config';
const { Option } = Select;
let index = 0;
class Media extends Component<Props, Sate> {
  render() {
    const { block, contentState } = this.props;
    const data = contentState.getEntity(block.getEntityAt(0)).getData();
    const emptyHtml = ' ';
    return (
      <div>
        {emptyHtml}
        <img
          src={data.src}
          alt={data.alt || ''}
          style={{ height: data.height || 'auto', width: data.width || 'auto' }}
        />
      </div>
    );
  }
}
const UnderstandNewPaperPage = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [loginStatus, setLoginStatus] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editorRef, setEditorRef] = useState(null);
  const currentSelect = useRef(null);
  const [categoryArray, setCategoryArray] = useState([]);
  const [selectValue, setSelectValue] = useState('');
  const [policyOption, setPolicyOption] = useState([]);
  const [options, setOptions] = useState([]);
  const [firstArray, setFirstArray] = useState([]);
  const [dynamicArray, setDynamicArray] = useState([]);
  const [globalInvestArray, setGlobalInvestArray] = useState([]);
  const [dynamicDefault, setDynamicDefault] = useState([]);
  const [tempArray, setTempArray] = useState([]);
  const [imgPre, setImgPre] = useState(
    'https://jiangshan-tzyjs-img.zjsszxc.com/',
  );
  const [showEdit, setShowEdit] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const initAction = () => {
    commitGlobalBread([
      {
        title: '发布中心',
        triggerOn: true,
      },
      {
        title: '明白纸发布',
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
    fetchComplex();
    fetchCategoryList();
    fetchpolicyOption();
    fetchInvestTagList();
  }, []);
  const fetchpolicyOption = () => {
    let data = {};
    Apis.fetchPolicyDocumentAllList(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          let hi = res.data;
          let newData = hi.map((ele) => {
            return {
              label: ele.title,
              value: ele.id,
              key: ele.id,
            };
          });
          setPolicyOption(newData);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const fetchInvestTagList = () => {
    let data = {
      page: 1,
      pagesize: 99999999,
    };
    Apis.investTagList(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          let shorter = res.data.data;
          shorter.forEach((ele) => {
            ele.children.forEach((sub) => {
              sub.tag_list.forEach((third) => {
                third.label = third.name;
                third.value = third.id;
              });
              sub.children = sub.tag_list;
            });
          });
          setGlobalInvestArray(res.data.data);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const uploadImageCallBack = async (
    value: any,
    success: Function,
    fail: Function,
  ) => {
    const form = new FormData();
    form.append('file', value.blob());
    const res = await Apis.uploadImages(form);
    if (res && res.code === 0) {
      success(`${imgPre}${res.data.img_url}`);
    } else {
      message.error(res.msg);
      fail(res);
    }
  };
  const fetchCategoryList = () => {
    Apis.fetchUnderstandCategoryList({})
      .then((res: any) => {
        if (res && res.code === 0) {
          setCategoryArray(res.data);
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const selectChange = (e) => {
    // console.log('e', e);
  };
  const onFinish = (values: any) => {
    console.log('values', values);
    const content = tinymce.activeEditor.getContent();
    if (content.length <= 7) {
      message.error('文章内容不能为空');
    } else {
      let empty = [];
      dynamicArray.forEach((ele) => {
        if (ele.checked) {
          empty.push(...ele.checked);
        }
      });
      let data = {
        title: values.title,
        content: content,
        is_putaway: 1,
        category_id: values.type,
        invest_category_ids: values.invest_category_ids || [],
        invest_tag_ids: empty,
      };
      if (values.policy_document_id) {
        data.policy_document_id = values.policy_document_id;
      } else {
        data.policy_document_id = 0;
      }
      Apis.understandPaperAdd(data)
        .then((res: any) => {
          if (res && res.code === 0) {
            message.success('添加成功');
            history.goBack();
          } else {
            message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  };
  const goBack = () => {
    let res = confirm('确定要退出当前编辑吗?');
    if (res) {
      history.goBack();
    }
  };
  const popCategory = () => {
    setCategoryName('');
    setShowEdit(true);
    fetchCategoryList();
  };
  const handleNewOk = () => {
    setShowEdit(false);
  };
  const handleNewCancel = () => {
    setShowEdit(false);
  };
  const changeCategoryName = (e) => {
    setCategoryName(e.target.value);
  };
  const addCategoryNameAction = () => {
    let value = categoryName.trim();
    if (value) {
      Apis.understandCategoryAdd({
        category_name: value,
      })
        .then((res: any) => {
          if (res && res.code === 0) {
            setCategoryName('');
            message.success('添加成功');
            fetchCategoryList();
          } else {
            message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    } else {
      message.error('请输入类目名称');
    }
  };
  const deleteCategory = (ele: any) => {
    Apis.understandCategoryDel({
      id: ele.id,
    })
      .then((res: any) => {
        if (res && res.code === 0) {
          message.success('删除成功');
          fetchCategoryList();
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const handleEditorChange = (e: any) => {
    form.setFieldsValue({
      content: e,
    });
  };
  const onChange2 = (checkedValues: any) => {
    let empty = [];
    checkedValues.forEach((ele) => {
      let target1 = globalInvestArray.find((sub) => {
        return sub.id == ele[0];
      });
      if (target1) {
        let target2 = target1.children.find((third) => {
          return third.id == ele[1];
        });
        if (target2) {
          empty.push(target2);
        }
      }
    });
    if (!empty.length) {
      form.setFieldsValue({
        invest_tag_ids: [],
      });
    }
    setDynamicArray(empty);
  };
  const fetchComplex = () => {
    let data = {
      page: 1,
      pagesize: 99999999999,
    };
    Apis.investCategoryList(data)
      .then((res: any) => {
        if (res && res.code === 0) {
          if (res.data && res.data.data && res.data.data.length) {
            let shorter = res.data.data.filter((ele) => {
              return ele.children && ele.children.length;
            });
            shorter.forEach((ele, index) => {
              ele.label = ele.name;
              ele.value = ele.id;
              ele.key = index;
              ele.children.forEach((sub, subIndex) => {
                sub.label = sub.name;
                sub.value = sub.id;
                sub.key = subIndex + 99999999;
              });
            });
            setFirstArray(shorter);
          } else {
            setFirstArray([]);
          }
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const checkItemAction = (item, index) => {
    dynamicArray[index].checked = item;
    // console.log('dynamicArray', dynamicArray);
  };
  return (
    <div className={styles.homePageCon}>
      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showEdit}
        title="类目1管理"
        onOk={handleNewOk}
        onCancel={handleNewCancel}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
            onClick={handleNewOk}
          >
            确定
          </Button>,
        ]}
      >
        <div>
          <div className={styles.categoryNameInputCon}>
            <Input
              placeholder="请输入"
              className={styles.leftInput}
              allowClear
              value={categoryName}
              onChange={(e) => changeCategoryName(e)}
            />
            <Button
              className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
              type="primary"
              onClick={() => addCategoryNameAction()}
            >
              添加
            </Button>
          </div>
          <div className={styles.categoryItemCon}>
            {categoryArray.map((ele: any) => (
              <div key={ele.id} className={styles.categoryItem}>
                <div>{ele.category_name}</div>
                <Popconfirm
                  title="确定删除此条目?"
                  onConfirm={() => deleteCategory(ele)}
                >
                  <div className={styles.red}>删除</div>
                </Popconfirm>
              </div>
            ))}
          </div>
        </div>
      </Modal>
      <Form
        form={form}
        name="nest-messages"
        labelAlign={'left'}
        onFinish={(values) => onFinish(values)}
        className={styles.formCon}
      >
        <Form.Item
          name="title"
          label="文章标题"
          hasFeedback
          rules={[{ required: true }]}
        >
          <Input
            placeholder="请输入文章标题，不超过50个字符"
            maxLength={50}
            style={{ width: 408 }}
          />
        </Form.Item>
        <div className={styles.flexItemCon}>
          <Form.Item
            name="type"
            label="类别"
            hasFeedback
            rules={[{ required: true }]}
          >
            <Select
              ref={currentSelect}
              value={selectValue}
              style={{ width: 408 }}
              placeholder="请选择"
              onChange={(e) => selectChange(e)}
            >
              {categoryArray.map((item) => (
                <Option key={item.id} value={item.id}>
                  <div className={styles.optionsCon}>
                    <span>{item.category_name}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Button
            type="primary"
            onClick={() => popCategory()}
            className={`${styles.resetBtnColor} ${styles.resetBtnRadius} ${styles.btnMarginLeft}`}
          >
            分类管理
          </Button>
        </div>
        <Form.Item label="文章内容" rules={[{ required: true }]}>
          <Editor
            apiKey="3n4phtjjc1f71ldjf41wpymq5tg4hpc0vd0k0k8xha6ci89i"
            onInit={(evt, editor) => {
              setEditorRef(editor);
            }}
            onEditorChange={handleEditorChange}
            init={{
              ...editorConfig,
              images_upload_handler: uploadImageCallBack,
            }}
          />
        </Form.Item>
        <Form.Item name="invest_category_ids" label="投资类型">
          <Cascader
            options={firstArray}
            onChange={onChange2}
            placeholder="请选择"
            style={{ width: 400 }}
            maxTagCount="responsive"
            showCheckedStrategy="SHOW_CHILD"
            multiple
          />
        </Form.Item>
        <Form.Item name="invest_tag_ids" label="政策标签">
          {/* {dynamicArray.length
            ? dynamicArray.map((ele, index) => (
                <div key={index} className={styles.tagItem}>
                  <Tag color="#0270c3">{ele.name}</Tag>
                  <Checkbox.Group
                    options={ele.children}
                    value={ele.checked}
                    defaultValue={dynamicDefault}
                    onChange={onChange}
                  />
                </div>
              ))
            : '无'} */}
          {dynamicArray.length
            ? dynamicArray.map((ele, index) => (
                <Check
                  item={ele}
                  key={index}
                  checkAction={checkItemAction}
                  index={index}
                  defaultValue={dynamicDefault}
                ></Check>
              ))
            : '无'}
        </Form.Item>
        <Form.Item name="policy_document_id" label="关联政策">
          <Select
            placeholder="请选择"
            style={{ width: 400 }}
            options={policyOption}
            allowClear
          />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }}>
          <div className={styles.btnCon}>
            <Button
              type="primary"
              htmlType="submit"
              className={`${styles.resetBtnColor} ${styles.btnMargin}`}
            >
              提 交
            </Button>
            <Button onClick={() => goBack()}>返 回</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(
  UnderstandNewPaperPage,
);
