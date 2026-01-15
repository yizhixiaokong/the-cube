# 测试文件说明

## 测试页面

### playground.html
**独立的** Cube Playground，包含：
- 3D 魔方预览
- 基础动作按钮
- 宽转、旋转、中间层测试
- 数字层记法测试（4x4+）
- 常用算法库

**重要**: 
- ✅ 测试页面**完全独立**，自己初始化 game 对象
- ⚠️ 由于使用了 ES6 模块，**不能直接双击打开 HTML 文件**，必须通过本地服务器访问

**使用方法**:
```bash
# 1. 构建项目
npm run build

# 2. 启动本地服务器（选择其中一种方式）
npx serve .                      # 推荐
# 或
python3 -m http.server 8000
# 或在 VS Code 中右键 HTML -> Open with Live Server

# 3. 浏览器访问
# http://localhost:3000/tests/playground.html
```

## 测试脚本

这些 JS 文件是**在浏览器控制台运行**的测试脚本，用于验证记法解析功能。

**适用页面**：
- ✅ `tests/playground.html` - Cube Playground（推荐）
- ✅ `index.html` - 主页面（也可用，但不建议）

### notation-tests.js
核心记法单元测试，包含所有记法类型的解析验证。

### notation-examples.js
各种记法的实际使用示例，可直接在控制台运行。

### numeric-notation-test.js
专门测试数字层记法（4x4+）的脚本，包含边界条件和等价性验证。

### multi-size-test.js
测试不同阶数魔方（2x2-5x5）的记法自动适配。

**使用方法（2 种方式）**:

1. **动态加载脚本**（推荐）
```javascript
// 打开 tests/playground.html，按 F12，然后执行：
const script = document.createElement('script');
script.src = 'notation-tests.js';  // 或其他测试脚本
document.body.appendChild(script);
script.onload = () => testNotation();  // 调用对应的测试函数
```

2. **手动测试**
```javascript
// 直接调用 API
game.notation.move("R U R' U'");
game.notation.parseMove("2R");
```

## 本地测试流程

### 方式 1: 使用测试页面（推荐，完全独立）

1. 构建项目
```bash
npm run build
```

2. 启动本地服务器
```bash
npx serve .
```

3. 访问 Playground
```
http://localhost:3000/tests/playground.html
```

4. 页面会自动初始化魔方，点击按钮测试各种记法

### 方式 2: 在 Playground 使用控制台脚本

1. 打开 Playground（同上）

2. 按 F12 打开浏览器控制台

3. 加载并运行测试脚本
```javascript
// 动态加载测试脚本
const script = document.createElement('script');
script.src = 'notation-tests.js';
document.body.appendChild(script);
script.onload = () => testNotation();

// 或手动测试
game.notation.move("R U R' U'");
```

## 为什么需要本地服务器？

HTML 文件使用了 ES6 模块（`import`），浏览器的同源策略会阻止 `file://` 协议加载模块。因此必须通过 HTTP 服务器访问，不能直接双击打开。
