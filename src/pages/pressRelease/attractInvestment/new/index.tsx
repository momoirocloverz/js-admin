import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState, useRef, Component } from 'react';
import { RightOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Form, Input, Select, Button, Popconfirm, Modal } from 'antd';
// import { Editor } from 'react-draft-wysiwyg';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { Editor } from '@tinymce/tinymce-react';
import tinymce from 'tinymce';
import editorConfig from '@/utils/tinymce_config';
import MediaUploader from '@/components/form/MediaUploader';

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
const AttractNewInvestmentPage = (props: any) => {
  const { location, accountInfo, dispatch, children } = props;
  const [categoryName, setCategoryName] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editorRef, setEditorRef] = useState(null);
  const currentSelect = useRef(null);
  const [categoryArray, setCategoryArray] = useState([]);
  const [selectValue, setSelectValue] = useState('');
  const [form] = Form.useForm();
  const [buttonDisable, setButtonDisable] = useState(false);
  const [imgPre, setImgPre] = useState(
    'https://jiangshan-tzyjs-img.zjsszxc.com/',
  );
  const initAction = () => {
    commitGlobalBread([
      {
        title: '????????????',
        triggerOn: true,
      },
      {
        title: '??????????????????',
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
    fetchCategoryList();
  }, []);
  const onEditorStateChange = (value: any) => {
    setEditorState(value);
  };
  // const uploadImageCallBack = (value) => {
  //   return new Promise(async (resolve, reject) => {
  //     const form = new FormData();
  //     form.append('file', value);
  //     const res = await Apis.uploadImages(form);
  //     if (res && res.code === 0) {
  //       resolve({ data: { link: `${imgPre}${res.data.img_url}` } });
  //     } else {
  //       message.error(res.msg);
  //       reject(res);
  //     }
  //   });
  // };

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
    Apis.fetchAttractCategoryList({})
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
    const content = tinymce.activeEditor.getContent();
    if (content.length <= 8) {
      message.error('????????????????????????');
    } else {
      console.log('ok');
      let data = {
        title: values.title,
        content: content,
        is_putaway: 1,
        attract_category_id: values.type,
        cover: values.cover?.[0].url,
      };
      Apis.attractInvestmentAdd(data)
        .then((res: any) => {
          if (res && res.code === 0) {
            message.success('????????????');
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
    let res = confirm('???????????????????????????????');
    if (res) {
      history.goBack();
    }
  };
  const myBlockRenderer = (contentBlock) => {
    const type = contentBlock.getType();
    // ?????????????????????mediaComponent
    if (type === 'atomic') {
      return {
        component: Media,
        editable: false,
        props: {
          foo: 'bar',
        },
      };
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
  const deleteCategory = (ele: any) => {
    Apis.fetchAttractCategoryDel({
      id: ele.id,
    })
      .then((res: any) => {
        if (res && res.code === 0) {
          message.success('????????????');
          fetchCategoryList();
        } else {
          message.error(res.msg);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  const changeCategoryName = (e) => {
    setCategoryName(e.target.value);
  };
  const addCategoryNameAction = () => {
    let value = categoryName.trim();
    if (value) {
      Apis.fetchAttractCategoryAdd({
        category_name: value,
      })
        .then((res: any) => {
          if (res && res.code === 0) {
            setCategoryName('');
            message.success('????????????');
            fetchCategoryList();
          } else {
            message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    } else {
      message.error('?????????????????????');
    }
  };

  const handleEditorChange = (e: any) => {
    form.setFieldsValue({
      content: e,
    });
  };

  const watchUploading = (val: any) => {
    setButtonDisable(val);
  };

  return (
    <div className={styles.homePageCon}>
      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showEdit}
        title="????????????"
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
            ??????
          </Button>,
        ]}
      >
        <div>
          <div className={styles.categoryNameInputCon}>
            <Input
              placeholder="?????????"
              className={styles.leftInput}
              allowClear
              value={categoryName}
              onChange={(e) => changeCategoryName(e)}
            />
            <Button
              type="primary"
              className={`${styles.resetBtnColor} ${styles.resetBtnRadius}`}
              onClick={() => addCategoryNameAction()}
            >
              ??????
            </Button>
          </div>
          <div className={styles.categoryItemCon}>
            {categoryArray.map((ele: any) => (
              <div key={ele.id} className={styles.categoryItem}>
                <div>{ele.category_name}</div>
                <Popconfirm
                  title="??????????????????????"
                  onConfirm={() => deleteCategory(ele)}
                >
                  <div className={styles.red}>??????</div>
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
          label="????????????"
          hasFeedback
          rules={[{ required: true }]}
        >
          <Input
            placeholder="?????????????????????????????????50?????????"
            maxLength={50}
            style={{ width: 408 }}
          />
        </Form.Item>
        <div className={styles.flexItemCon}>
          <Form.Item
            name="type"
            label="??????"
            hasFeedback
            rules={[{ required: true }]}
          >
            <Select
              ref={currentSelect}
              value={selectValue}
              style={{ width: 408 }}
              placeholder="?????????"
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
            ????????????
          </Button>
        </div>
        <Form.Item
          label="?????????"
          rules={[{ required: true, message: '??????????????????' }]}
          name="cover"
          extra="????????????/??????????????????????????????200*200????????????????????????3M????????????jpg???png???"
        >
          <MediaUploader
            cropperConfig={{ aspectRatio: 232 / 144, title: '????????????' }}
          />
        </Form.Item>
        <Form.Item label="????????????" rules={[{ required: true }]}>
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
        <Form.Item wrapperCol={{ span: 24 }}>
          <div className={styles.btnCon}>
            <Button
              type="primary"
              htmlType="submit"
              className={`${styles.resetBtnColor} ${styles.btnMargin}`}
              disabled={buttonDisable}
            >
              ??? ???
            </Button>
            <Button disabled={buttonDisable} onClick={() => goBack()}>
              ??? ???
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(({ baseModel }) => ({ baseModel }))(
  AttractNewInvestmentPage,
);
