# GitHub Pages 部署指南

本项目支持通过 GitHub Actions 自动部署到 GitHub Pages。

## 自动部署步骤

### 1. 推送代码到 GitHub

确保你的代码已经推送到 GitHub 仓库的 `master` 分支：

```bash
git push origin master
```

### 2. 启用 GitHub Pages

1. 打开你的 GitHub 仓库页面
2. 点击 **Settings** (设置)
3. 在左侧菜单找到 **Pages**
4. 在 **Source** (源) 下拉菜单中选择：
   - **Source**: `GitHub Actions`

### 3. 等待自动部署

- 推送代码后，GitHub Actions 会自动触发构建和部署流程
- 在仓库的 **Actions** 标签页可以查看部署进度
- 部署成功后，你的网站将可通过以下地址访问：
  ```
  https://<你的用户名>.github.io/<仓库名>/
  ```

## 手动触发部署

如果需要手动触发部署（不推送新代码）：

1. 进入仓库的 **Actions** 页面
2. 选择 **Deploy to GitHub Pages** 工作流
3. 点击 **Run workflow** 按钮
4. 选择 `master` 分支
5. 点击绿色的 **Run workflow** 按钮

## 本地测试

在部署前，建议先在本地测试构建结果：

```bash
# 编译 SASS
npx sass src/scss/styles.sass assets/css/styles.css

# 构建项目
npm run build

# 使用本地服务器预览 export 目录
npx serve export
```

## 故障排除

### 部署失败
- 检查 Actions 页面的错误日志
- 确保 `package.json` 中的依赖都已正确安装
- 验证本地构建是否成功

### 404 错误
- 确认 GitHub Pages 已启用并选择了 `GitHub Actions` 作为源
- 检查部署日志确认文件已正确上传
- 等待几分钟让 CDN 刷新

### 资源加载失败
- 如果使用自定义域名，确保路径配置正确
- 检查 `index.html` 中的资源引用路径是否为相对路径

## 自定义域名（可选）

如果你想使用自定义域名：

1. 在仓库根目录创建 `CNAME` 文件，内容为你的域名：
   ```
   example.com
   ```
2. 在域名提供商处配置 DNS：
   - 添加 CNAME 记录指向 `<你的用户名>.github.io`
3. 在 GitHub Pages 设置中输入你的自定义域名
4. 等待 DNS 传播（可能需要几小时）

## 更新网站

每次推送到 `master` 分支时，网站都会自动重新构建和部署。
