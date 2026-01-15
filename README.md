# The Cube - Rubik's Cube Game

一个基于 Three.js 开发的 3D 魔方游戏，支持多种规格（2x2 到 5x5）、自定义主题以及离线访问。

## 🌟 特性

- **支持多种阶数**: 2x2, 3x3, 4x4, 5x5。
- **平滑交互**: 支持触屏和鼠标旋转魔方层。
- **高度自定义**: 内置主题编辑器，可自由调整配色、相机角度和动画类型。
- **离线支持**: 采用 PWA 技术，支持在无网络环境下运行。
- **性能优异**: 使用原生 Three.js，无沉重的框架开销。

## 🚀 启动指南

### 前置要求

确保你的系统中安装了 [Node.js](https://nodejs.org/) (建议 v14+)。

### 1. 安装依赖

```bash
npm install
```

### 2. 开发与构建

项目使用 Rollup 进行打包。由于项目中的 `package.json` 主要配置了生产环境构建，你可以运行以下命令：

**生产环境构建**:
```bash
npm run build
```
构建结果将输出到 `export/` 文件夹中，包含所有静态资源。

### 3. 本地预览

由于浏览器安全限制（如跨域问题），建议使用静态文件服务器运行项目，而不是直接双击打开 `index.html`。

**推荐方式 A: 使用 VS Code Live Server 插件**
右键项目根目录下的 `index.html` -> 选择 `Open with Live Server`。

**推荐方式 B: 使用 npx 快速启动**
```bash
npx serve .
```

## 📂 项目结构

关于项目架构、代码层级及扩展开发的详细说明，请参考 [ARCHITECTURE_GUIDE.md](ARCHITECTURE_GUIDE.md)。

## 🛠 技术栈

- **3D 引擎**: [Three.js](https://threejs.org/)
- **打包工具**: Rollup
- **样式**: SASS (SCSS)
- **PWA**: UpUp

## 🤝 致谢

本项目基于 [Boris Sehovac](https://github.com/bsehovac) 的原创项目 **The Cube** 进行二次开发。感谢原作者分享如此精彩的 3D 作品。

## 📄 开源协议

本项目采用 ISC 许可协议。
