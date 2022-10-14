import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState, useRef, Component } from 'react';
import { RightOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Form, Input, Select, Button, Popconfirm, Modal } from 'antd';
// import { Editor } from 'react-draft-wysiwyg';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from '@tinymce/tinymce-react';
import tinymce from 'tinymce';
import editorConfig from '@/utils/tinymce_config';
const { Option } = Select;
import PdfUpload from '../components/pdfUpload';
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
  const { dispatch } = props;
  const currentSelect = useRef(null);
  const [categoryArray, setCategoryArray] = useState([]);
  const [imgPre, setImgPre] = useState(
    'https://jiangshan-tzyjs-img.zjsszxc.com/',
  );
  const [editorRef, setEditorRef] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState([]);
  const [form] = Form.useForm();
  const initAction = () => {
    commitGlobalBread([
      {
        title: '发布中心',
        triggerOn: true,
      },
      {
        title: '公告栏发布',
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
    Apis.noticeBoardCategoryList({})
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
  const selectChange = (e: any) => {
    // console.log('e', e);
  };
  const onFinish = (values: any) => {
    const content = tinymce.activeEditor.getContent();
    if (content.length <= 7) {
      message.error('文章内容不能为空');
    } else {
      let data = {
        title: values.title,
        content: content,
        is_putaway: 1,
        attachment: values.attachment ? values.attachment : [],
        category_id: values.type,
      };
      Apis.noticeBoardAdd(data)
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
      Apis.noticeBoardCategoryAdd({
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
    Apis.noticeBoardCategoryDel({
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
  const getPdfData = (arr: any) => {
    setPdfUrl(arr);
    if (arr.length) {
      form.setFieldsValue({
        attachment: arr,
      });
    } else {
      form.setFieldsValue({
        attachment: '',
      });
    }
  };
  return (
    <div className={styles.homePageCon}>
      <Modal
        centered
        maskClosable={false}
        destroyOnClose
        visible={showEdit}
        title="类目管理"
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
        <Form.Item label="文章内容">
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
        <Form.Item
          name="attachment"
          label="附件"
          wrapperCol={{ span: 8 }}
          // rules={[{ required: true, message: `请上传政策附件` }]}
        >
          <div>
            <PdfUpload values={pdfUrl} getPdfData={getPdfData} />
          </div>
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
