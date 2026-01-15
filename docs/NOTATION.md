# 魔方标准记法

## 快速开始

```javascript
// 浏览器控制台中执行
game.notation.move("R U R' U'");        // 基础算法
game.notation.move("r U r' U'");        // 宽转（双层）
game.notation.move("2R U 2R' U'");      // 数字记法（4x4+）
```

## 支持的记法

### 1. 基础转动（所有阶数）

| 记法 | 说明 | 修饰符 |
|------|------|--------|
| `R` `L` | 右/左面 | `'` 逆时针 |
| `U` `D` | 上/下面 | `2` 转180° |
| `F` `B` | 前/后面 | |

**示例**: `R` `R'` `R2` `U` `U'` `U2`

### 2. 宽转（双层转动）

| 记法 | 等价 | 说明 |
|------|------|------|
| `r` `Rw` | 相同 | 右侧双层 |
| `l` `Lw` | 相同 | 左侧双层 |
| `u` `Uw` | 相同 | 上侧双层 |

**示例**: `r U r' U'` `Rw2` `u'`

### 3. 整体旋转（所有阶数）

| 记法 | 说明 |
|------|------|
| `x` | 沿 R 方向旋转整个魔方 |
| `y` | 沿 U 方向旋转整个魔方 |
| `z` | 沿 F 方向旋转整个魔方 |

**示例**: `x` `y2` `z'`

### 4. 中间层（仅奇数阶：3x3, 5x5）

| 记法 | 说明 |
|------|------|
| `M` | 中间竖层（L方向）|
| `E` | 中间横层（D方向）|
| `S` | 中间前后层（F方向）|

**示例**: `M E S` `M2 E' S`

### 5. 数字层记法（仅4x4+）

| 格式 | 示例 | 说明 |
|------|------|------|
| `[n]R` | `2R` `3R` | 右侧 n 层 |
| `[n]L` | `2L` `3L` | 左侧 n 层 |
| `[n]U` | `2U` `3U` | 上侧 n 层 |

**4x4 示例**: `2R` `2U` `2R'` `2U'`  
**5x5 示例**: `3Rw U 3Rw' U'` `4R U 4R'`

**等价关系**（4x4）:
- `2R` = `r` = `Rw`（双层右转）

## 阶数支持

| 阶数 | 基础 | 宽转 | 旋转 | 中间层 | 数字记法 |
|------|------|------|------|--------|----------|
| 2x2 | ✅ | ✅* | ✅ | ❌ | ❌ |
| 3x3 | ✅ | ✅ | ✅ | ✅ | ❌ |
| 4x4 | ✅ | ✅ | ✅ | ❌ | ✅ (2R) |
| 5x5 | ✅ | ✅ | ✅ | ✅ | ✅ (2R-4R) |

*2x2 宽转等同于整体旋转

## 常用算法示例

```javascript
// 3x3 算法
game.notation.move("R U R' U'");                    // Sexy Move
game.notation.move("R U R' U R U2 R'");            // Sune
game.notation.move("R U R' U' R' F R2 U' R' U' R U R' F'"); // T-Perm

// 4x4 算法
game.notation.move("2R 2U 2R' 2U'");               // 配对中心块
game.notation.move("r U r' U'");                   // 等价于 2R U 2R' U'

// 5x5 算法
game.notation.move("3Rw U 3Rw' U'");               // 三层算法
game.notation.move("M E S");                       // 中间层组合

// 整体旋转
game.notation.move("x y2");                        // 调整观察角度
```

## API 参考

### `game.notation.move(algorithm)`
执行一个或多个算法步骤。

```javascript
game.notation.move("R U R' U'");           // 单个算法
game.notation.move("R U R' U' R U R'");    // 多步骤
```

### `game.notation.parseMove(move)`
解析单个动作，返回详细信息。

```javascript
const result = game.notation.parseMove("2R'");
// 返回: { base: "2R'", layers: [2,3], axis: "x", angle: -90, ... }
```

### 自动适配
系统会根据当前魔方阶数自动调整：

```javascript
// 切换到4x4
game.cube.size = 4;
game.notation.generateMoves();  // 自动重新生成映射

game.notation.move("2R U 2R'"); // 现在可用
```

## 控制台快速测试

打开浏览器控制台（F12），尝试以下命令：

```javascript
// 查看当前阶数
game.cube.size;

// 测试基础动作
game.notation.move("R U R' U'");

// 测试数字记法（4x4+）
game.notation.move("2R 2U 2R' 2U'");

// 解析动作详情
game.notation.parseMove("3R");

// 重置魔方
game.controls.scrambleCube();
```

## 注意事项

1. **大小写敏感**: `R` ≠ `r`（`R` 单层，`r` 双层）
2. **空格分隔**: 多个动作用空格分开：`R U R'`
3. **阶数限制**: 数字记法仅在 4x4+ 魔方有效
4. **自动验证**: 无效输入会在控制台显示警告

## 测试工具

本地测试页面：[tests/notation-test.html](../tests/notation-test.html)

```bash
# 构建后在浏览器打开
npm run build
# 打开 tests/notation-test.html
```
