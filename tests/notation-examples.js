/**
 * Console Examples for Notation API
 * 
 * 打开浏览器控制台，粘贴以下代码进行测试
 */

// ========== 基础使用 ==========

// 1. 执行单个动作
game.notation.move("R");

// 2. 执行算法序列
game.notation.move("R U R' U'");

// 3. 带回调
game.notation.move("F R U' R' U' F'", () => {
  console.log("✅ 算法执行完成！");
});


// ========== 常用算法 ==========

// Sexy Move
game.notation.move("R U R' U'");

// T-Perm (顶层角块交换)
game.notation.move("R U R' U' R' F R2 U' R' U' R U R' F'");

// Y-Perm (顶层角块轮换)
game.notation.move("F R U' R' U' R U R' F' R U R' U' R' F R F'");

// Superflip (超级翻转)
game.notation.move("U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2");


// ========== 整体旋转 ==========

// x轴旋转（R方向）
game.notation.move("x");

// y轴旋转（U方向）
game.notation.move("y");

// 组合旋转
game.notation.move("x y2 z'");


// ========== 中间层 ==========

// M层（中间竖层，与L同向）
game.notation.move("M");

// E层（中间横层，与D同向）
game.notation.move("E");

// S层（中间前后层，与F同向）
game.notation.move("S");


// ========== 宽转 ==========

// 右两层
game.notation.move("r");

// 等价于 Rw
game.notation.move("Rw");


// ========== 逆序算法 ==========

// 获取逆序
const inverse = game.notation.inverseAlgorithm("R U R' U'");
console.log("Original: R U R' U'");
console.log("Inverse:", inverse);  // U R U' R'

// 执行后立即还原
game.notation.move("R U R' U'", () => {
  console.log("执行正向算法完成");
  game.notation.move(game.notation.inverseAlgorithm("R U R' U'"), () => {
    console.log("执行逆向算法完成 - 已还原");
  });
});


// ========== 解析算法 ==========

// 解析但不执行
const parsed = game.notation.parseAlgorithm("R U2 F' L'");
console.log("解析结果:", parsed);
/*
[
  { base: 'R', axis: 'x', angle: -1.5707..., layers: [2], type: 'layer', repetitions: 1 },
  { base: 'U', axis: 'y', angle: -1.5707..., layers: [2], type: 'layer', repetitions: 2 },
  { base: 'F', axis: 'z', angle: 1.5707..., layers: [2], type: 'layer', repetitions: 1 },
  { base: 'L', axis: 'x', angle: 1.5707..., layers: [0], type: 'layer', repetitions: 1 }
]
*/


// ========== 高级示例：录制回放 ==========

class MoveRecorder {
  constructor(game) {
    this.game = game;
    this.moves = [];
  }
  
  record(notation) {
    this.moves.push(notation);
    this.game.notation.move(notation);
    console.log(`📝 记录: ${notation} (总共 ${this.moves.length} 步)`);
  }
  
  replay() {
    const algorithm = this.moves.join(' ');
    console.log(`🔄 回放: ${algorithm}`);
    this.game.notation.move(algorithm);
  }
  
  undo() {
    const lastMove = this.moves.pop();
    if (lastMove) {
      const inverseMove = this.game.notation.inverse(lastMove);
      console.log(`↩️ 撤销: ${lastMove} -> ${inverseMove}`);
      this.game.notation.move(inverseMove);
    }
  }
  
  clear() {
    this.moves = [];
    console.log("🗑️ 清空记录");
  }
  
  showHistory() {
    console.log("📜 历史记录:", this.moves.join(' '));
  }
}

// 使用录制器
const recorder = new MoveRecorder(game);
recorder.record("R");
recorder.record("U");
recorder.record("R'");
recorder.showHistory();  // R U R'
recorder.undo();         // 撤销 R'
recorder.replay();       // 回放 R U


// ========== 高级示例：打乱生成 ==========

function generateScramble(length = 20) {
  const moves = ['R', 'L', 'U', 'D', 'F', 'B'];
  const modifiers = ['', "'", '2'];
  
  let scramble = [];
  let lastAxis = '';
  
  for (let i = 0; i < length; i++) {
    let move;
    // 避免连续相同轴（如 R L 或 R R'）
    do {
      move = moves[Math.floor(Math.random() * moves.length)];
    } while (
      move === scramble[scramble.length - 1]?.[0] || 
      (move === 'R' && lastAxis === 'L') ||
      (move === 'L' && lastAxis === 'R') ||
      (move === 'U' && lastAxis === 'D') ||
      (move === 'D' && lastAxis === 'U') ||
      (move === 'F' && lastAxis === 'B') ||
      (move === 'B' && lastAxis === 'F')
    );
    
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    scramble.push(move + modifier);
    lastAxis = move;
  }
  
  return scramble.join(' ');
}

// 生成并执行打乱
const scramble = generateScramble(25);
console.log("🎲 打乱序列:", scramble);
game.notation.move(scramble, () => {
  console.log("✅ 打乱完成！");
});


// ========== 高级示例：教学演示 ==========

const tutorials = {
  beginner: [
    { name: "白十字第一步", algo: "F R U R' U' F'" },
    { name: "第一层角块", algo: "R U R' U'" },
    { name: "第二层边块", algo: "U R U' R' U' F' U F" }
  ],
  
  oll: [
    { name: "OLL 1", algo: "R U2 R' U' R U' R'" },
    { name: "OLL 2", algo: "F R U R' U' F' f R U R' U' f'" },
    { name: "OLL 21", algo: "R U R' U R U' R' U R U2 R'" }
  ],
  
  pll: [
    { name: "T-Perm", algo: "R U R' U' R' F R2 U' R' U' R U R' F'" },
    { name: "J-Perm", algo: "R U R' F' R U R' U' R' F R2 U' R'" },
    { name: "Y-Perm", algo: "F R U' R' U' R U R' F' R U R' U' R' F R F'" }
  ]
};

function demoTutorial(category, index = 0) {
  const lessons = tutorials[category];
  if (!lessons || index >= lessons.length) {
    console.log("🎓 教学完成！");
    return;
  }
  
  const lesson = lessons[index];
  console.log(`📚 ${lesson.name}: ${lesson.algo}`);
  
  game.notation.move(lesson.algo, () => {
    setTimeout(() => {
      // 执行逆序还原
      game.notation.move(game.notation.inverseAlgorithm(lesson.algo), () => {
        setTimeout(() => demoTutorial(category, index + 1), 1000);
      });
    }, 2000);
  });
}

// 演示 PLL 算法
// demoTutorial('pll');


// ========== 高级示例：步进执行 ==========

class StepExecutor {
  constructor(game, algorithm) {
    this.game = game;
    this.moves = game.notation.parseAlgorithm(algorithm);
    this.currentIndex = 0;
  }
  
  next() {
    if (this.currentIndex >= this.moves.length) {
      console.log("✅ 算法执行完毕");
      return false;
    }
    
    const move = this.moves[this.currentIndex];
    console.log(`Step ${this.currentIndex + 1}/${this.moves.length}: ${move.base}`);
    
    this.game.notation.executeMove(move, () => {
      console.log(`✓ 完成`);
    });
    
    this.currentIndex++;
    return true;
  }
  
  auto(delay = 500) {
    const executeNext = () => {
      if (this.next()) {
        setTimeout(executeNext, delay);
      }
    };
    executeNext();
  }
  
  reset() {
    this.currentIndex = 0;
    console.log("↺ 重置到开始");
  }
}

// 使用步进执行器
const stepper = new StepExecutor(game, "R U R' U' R' F R2 U' R' U' R U R' F'");
// stepper.next();  // 执行下一步
// stepper.auto(800);  // 自动执行，每步间隔800ms


// ========== 快捷函数 ==========

// 定义一些快捷函数
window.R = () => game.notation.move("R");
window.U = () => game.notation.move("U");
window.F = () => game.notation.move("F");
window.sexy = () => game.notation.move("R U R' U'");
window.tperm = () => game.notation.move("R U R' U' R' F R2 U' R' U' R U R' F'");
window.scramble = () => {
  const s = generateScramble(20);
  console.log("🎲", s);
  game.notation.move(s);
};

console.log(`
🎮 魔方标准记法 API 已就绪！

快捷命令:
  R()      - 执行 R
  U()      - 执行 U
  F()      - 执行 F
  sexy()   - 执行 Sexy Move (R U R' U')
  tperm()  - 执行 T-Perm
  scramble() - 随机打乱

完整 API:
  game.notation.move("R U R' U'")
  game.notation.inverseAlgorithm("R U R' U'")
  game.notation.parseAlgorithm("R U F")
  
更多示例见 NOTATION_GUIDE.md
`);
