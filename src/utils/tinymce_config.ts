const editorConfig: any = {
  // height: '800',
  min_height: 500,
  max_height: 1000,
  language: 'zh_CN',
  branding: false,
  toolbar:
    'table image | forecolor bold italic underline strikethrough link removeformat | alignleft aligncenter alignright alignjustify outdent indent | bullist numlist | preview fullscreen | bdmap lineheight formatpainter axupimgs',
  plugins: [
    'autolink lists link print preview anchor',
    'searchreplace visualblocks fullscreen',
    'media table help wordcount image imagetools',
    'autoresize',
    'powerpaste', // plugins中，用powerpaste替换原来的paste
  ],
  toolbar_mode: 'scrolling',
  menubar: false,
};

export default editorConfig;
