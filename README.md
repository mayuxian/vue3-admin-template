# vue3-admin-template 管理端极简纯净版脚手架模板工程
**此项目是集成vue3 +  vite + Element-Plus + Pinia + vue-router的后台管理系统的模板工程。**  
>即开即用，提供初创团队或新项目专注于快速启动和开发交易。不再考虑脚手架编译打包和优化、ESLlint统一配置、项目和编码规范等问题。  
参考、借鉴[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin/)项目。

**在打开vscode时根据提示安装上推荐插件。**   
[在线预览页面](http://vue3-admin-template.mayuxian.cn/)
![首页](https://resource.mayuxian.cn/images/vue3-admin-template-home.jpg)

## 特性(Features)
- [x] vite打包编译优化
- [x] 表格的自适应
- [x] 打开页面进度条显示
- [x] 页面全屏
- [x] 全局设置组件大小
- [x] 页签页
- [x] 主题颜色
- [x] 提供动态创建Dialog，弹出同一弹框组件实例
- [x] **同一路由页签分裂模式 （推荐）**  
 
## 规范文档
项目和编码规范文档是致力于为初创企业、初创团队、新项目提供统一的规范，方便项目快速启动，团队协作，保障质量。  
建议约定团队成员安装如下项目和编码规范开发。 
[点击查看 前端项目和编码规范](http://fe-docs.mayuxian.cn/spec/project.html#%E9%A1%B9%E7%9B%AE%E5%90%8D%E5%91%BD%E5%90%8D)

主要分享以下几方面：  
- 前端统一标准规范  
- 约定项目规范，提高代码可读性，方便团队新成员快速加入项目开发。  
  约定编码风格和规范，规避一些技术踩坑，提升代码质量。（包含Vue、React等编码规范）  
- git管理  
- 工程配置  
- 编程小技巧  
- 性能优化  
- FAQ查询  
- Vue、Nest、Rect等项目工程模板  
  会对工程模板有详细的文档说明，模板可支持项目快速启动。

## 内容(Content)
包含以下内容：  
- **权限管理模块**  
定义后台人员、角色、角色权限三个模块和mock数据。
- **vite脚手架**    
解决了vite脚手架存在的一些问题。vite的默认打包配置已做优化。
- **vue-router**    
- **store存储 - pinia**  
- **配置推荐插件**    
  .vscode/extensions.json中配置了推荐插件，在打开vscode时根据提示安装上推荐插件即可。比如：  
  - vue-volar-extention-pack     -- vue3插件全家桶  
  - eamodio.gitlens      -- git记录查看工具  
  - gruntfuggly.todo-tree     --查看TODO事项   
  - lihuiwang.vue-alias-skip   --别名路径可以点击快速跳转查看  
- **提供插件方式**  
router、store、plugins、directive目录可直接创建文件，自动动态引入加载。  
- **引入auto-import机制**  
  引入unplugin-auto-import/vite插件，可自动引入加载组件和vue、vue-router的API    
- **ESLint + Prettier配置**    
- **区分环境变量与配置**    
   区分dev调试环境、dev的build构建环境、test构建环境、生产构建环境。  
- **支持TypeScript开发**    
  api接口的参数params建议都要定义参数对象属性和类型  
- **libs工具库**  
  提供了倒计时、数据检查器、加密器、存储器、类型检查器等  
- **提供主题颜色替换**
  
## 组件(Components)
- **具有SvgIcon组件**  
  路径：components/SvgIcon/index.vue  
  可以使用SvgIcon展示svg格式的ICON。  
  使用svg做icon优于font icon。  
- **列表页面组件** 
  路径：common/ListPage.vue 
  通过config.ts配置快速创建表格页面的快速开发，同时也规范统一了表格页面的组件布局和组件样式，可参考```views/admin/user/index.vue```  
  若差异化较大列表页面，可参考"common/ListPage.vue"页面复制后重写。
- **信息详情字段单元组件**  
   路径：common/DetailCell.vue  
   主要为了规范统一订单详情页字段的显示样式。
   编写订单详情页可参考```views/admin/user/Detail.vue```  

- **新增编辑页组件**  
   路径：components/DynForm/index.jsx  
   可以实现编辑页面字段的增量更新，避免只修改一个字段更新全部字段的问题。  
   规范统一订单详情页字段的显示样式。  
   编写订单详情页可参考```？？``` 

## 安装(Installing)
先安装项目依赖
# 安装时确保是管理员身份运行vscode，path-browserify安装时可能需要管理员权限。
Using npm:

```bash
$ npm install  
```

Using bower:

```bash
$ bower install
```

Using yarn:

```bash
$ yarn  install  
```
## 运行(Running)

1. 通过Todo tree插件或者搜索//TODO:来查找需要替换代码

2. 查看package.json中的script即可查看到dev和不同环境的build脚本命令

dev调试模式
``` javascript
yarn dev
```

## 视频解说
-------------------------------------------
TODO:有待补充哔哩哔哩视频。
视频会将项目模板的模板说明、注意事项、考虑过程、实现过程等详细解说，方便用户更熟练、详细的使用工程模板，并可基于此工程模板作为项目快速启动开发，和提供定制化改造。

## License
**MIT**

可参考阮一峰老师的开源协议说明
![开源协议](https://resource.mayuxian.cn/images/os-protocol.jpg)