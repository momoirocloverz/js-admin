# 1.项目名称：）admin
# 2.项目分支 dev/pre/master/test-child-route
# 3.关于上架平台说明，目前已经上线了网页端与浙政钉
# 4.关于部署发布
## 发布时需要自行 build 并提交代码
## 需要发布 master 与 test-child-route（统一域名分支）
## 分支合并说明：只需要 master 向 test-child-route 单向合并代码，不需要反向合并,避免冲突导致的错误
# 5.关于文件结构
## 1.细分结构 pages/document.ejs 内部说明
![image](https://img.hzanchu.com/acimg/c62f7c0595d56babe22bfd05e51d72c6.png)
### 浙政钉埋点
![image](https://img.hzanchu.com/acimg/a89760b6049a3405e83551d2291919c7.png)
### tinymce-react与react-pdf js依赖
## 2.细分结构 utils/api 内部说明
### 部分请求
## 3.细分结构 components/auth/authWrapper 内部说明
### 按钮权限容器
## 4.细分结构 src/models/base 内部说明
### 面包屑状态维护,菜单激活状态维护
## 5.细分结构 src/utils/treeUtils 内部说明
### 角色权限tree控制
# 6.备注
## 1.浙政钉相关依赖 gdt-jsapi