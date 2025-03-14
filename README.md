# 打字练习网站项目环境配置说明

## 1. 开发环境要求

### 1.1 Node.js环境
- Node.js版本：>= 12.0.0
- npm版本：>= 6.0.0

### 1.2 Vue CLI
- Vue CLI版本：>= 5.0.0
- Vue.js版本：3.2.13

## 2. 项目依赖

### 2.1 核心依赖
- vue: ^3.2.13
- vue-router: ^4.5.0
- vuex: ^4.1.0
- core-js: ^3.8.3

### 2.2 开发依赖
- @vue/cli-service: ~5.0.0
- @vue/cli-plugin-babel: ~5.0.0
- @vue/cli-plugin-eslint: ~5.0.0
- eslint: ^7.32.0
- eslint-plugin-vue: ^8.0.3

## 3. 环境配置步骤

### 3.1 安装Node.js
1. 访问 [Node.js官网](https://nodejs.org/)
2. 下载并安装对应操作系统的Node.js LTS版本
3. 安装完成后，打开命令行工具验证：
   ```bash
   node -v
   npm -v
   ```

### 3.2 安装Vue CLI
```bash
npm install -g @vue/cli
```

### 3.3 克隆项目（如果是从Git仓库获取）
```bash
git clone [项目仓库地址]
cd daziwagnzhan2
```

### 3.4 安装项目依赖
```bash
npm install
```

## 4. 项目运行

### 4.1 开发环境运行
```bash
npm run serve
```
- 启动开发服务器
- 支持热重载
- 访问地址：http://localhost:8080

### 4.2 生产环境构建
```bash
npm run build
```
- 构建生产环境代码
- 代码会被压缩和优化
- 输出目录：/dist

### 4.3 代码检查
```bash
npm run lint
```
- 运行ESLint检查代码
- 自动修复可修复的问题

## 5. 项目结构

```
/src
  ├── /assets        # 静态资源
  ├── /components    # Vue组件
  ├── /config        # 配置文件
  ├── /router        # 路由配置
  ├── /store         # Vuex状态管理
  ├── App.vue        # 根组件
  └── main.js        # 入口文件
```

## 6. 注意事项

1. 确保Node.js和npm版本符合要求
2. 如果安装依赖时出现问题，可以尝试删除node_modules目录和package-lock.json文件，然后重新运行npm install
3. 开发时建议使用VSCode编辑器，并安装Vetur或Volar插件以获得更好的Vue开发体验
4. 在提交代码前，确保运行npm run lint检查并修复代码问题

## 7. 常见问题解决

### 7.1 依赖安装失败
- 检查网络连接
- 尝试使用cnpm或yarn作为替代包管理器
- 清除npm缓存：npm cache clean --force

### 7.2 运行错误
- 检查Node.js版本是否符合要求
- 确保所有依赖都已正确安装
- 查看控制台错误信息进行具体问题排查

## 8. 更新日志

### v0.1.0
- 初始化项目配置
- 添加基础依赖
- 配置开发环境
