/**
 * Multi-Size Cube Notation Test
 * 测试不同阶数魔方的标准记法支持
 */

console.log("🎲 多阶数魔方记法测试\n");

// Helper: 切换魔方阶数
function setCubeSize(size) {
  console.log(`\n📏 切换到 ${size}x${size} 魔方...`);
  
  // 通过 UI 切换阶数
  game.preferences.set('size', size - 2); // 0=2x2, 1=3x3, 2=4x4, 3=5x5
  
  // 等待魔方重新初始化
  setTimeout(() => {
    console.log(`✅ 当前阶数: ${game.cube.size}x${game.cube.size}\n`);
  }, 100);
}

// Test Suite
const tests = {
  
  // 2x2 魔方测试
  test2x2: function() {
    console.log("=== 2x2 魔方测试 ===");
    
    console.log("1️⃣ 基础转动 R U R' U'");
    game.notation.move("R U R' U'", () => {
      console.log("  ✅ 完成");
    });
    
    setTimeout(() => {
      console.log("\n2️⃣ 宽转 r (应该等同于整体旋转 x)");
      game.notation.move("r", () => {
        console.log("  ✅ 完成 (2x2 的 r = x 旋转)");
      });
    }, 2000);
    
    setTimeout(() => {
      console.log("\n3️⃣ 尝试中间层 M (应该警告并跳过)");
      game.notation.move("M", () => {
        console.log("  ⚠️ 如果看到这条，说明有问题");
      });
      console.log("  ℹ️ 检查控制台警告信息");
    }, 4000);
  },
  
  // 3x3 魔方测试
  test3x3: function() {
    console.log("=== 3x3 魔方测试 ===");
    
    console.log("1️⃣ 标准算法 Sexy Move");
    game.notation.move("R U R' U'", () => {
      console.log("  ✅ 完成");
    });
    
    setTimeout(() => {
      console.log("\n2️⃣ 宽转 r (右两层 [1,2])");
      const move = game.notation.parseMove("r");
      console.log(`  层索引: [${move.layers}]`);
      game.notation.move("r", () => {
        console.log("  ✅ 完成");
      });
    }, 2000);
    
    setTimeout(() => {
      console.log("\n3️⃣ 中间层 M (中间竖层)");
      const move = game.notation.parseMove("M");
      console.log(`  层索引: [${move.layers}]`);
      game.notation.move("M M2", () => {
        console.log("  ✅ 完成");
      });
    }, 4000);
  },
  
  // 4x4 魔方测试
  test4x4: function() {
    console.log("=== 4x4 魔方测试 ===");
    
    console.log("1️⃣ 基础转动 R U R' U'");
    game.notation.move("R U R' U'", () => {
      console.log("  ✅ 完成");
    });
    
    setTimeout(() => {
      console.log("\n2️⃣ 宽转 r (右两层 [2,3])");
      const move = game.notation.parseMove("r");
      console.log(`  层索引: [${move.layers}]`);
      game.notation.move("r", () => {
        console.log("  ✅ 完成");
      });
    }, 2000);
    
    setTimeout(() => {
      console.log("\n3️⃣ 尝试中间层 M (4x4 无单一中间层)");
      game.notation.move("M", () => {
        console.log("  ⚠️ 如果看到这条，说明有问题");
      });
      console.log("  ℹ️ 检查控制台警告信息");
    }, 4000);
  },
  
  // 5x5 魔方测试
  test5x5: function() {
    console.log("=== 5x5 魔方测试 ===");
    
    console.log("1️⃣ 基础转动 R U R' U'");
    game.notation.move("R U R' U'", () => {
      console.log("  ✅ 完成");
    });
    
    setTimeout(() => {
      console.log("\n2️⃣ 宽转 r (右两层 [3,4])");
      const move = game.notation.parseMove("r");
      console.log(`  层索引: [${move.layers}]`);
      game.notation.move("r", () => {
        console.log("  ✅ 完成");
      });
    }, 2000);
    
    setTimeout(() => {
      console.log("\n3️⃣ 中间层 M (中间竖层, 索引 2)");
      const move = game.notation.parseMove("M");
      console.log(`  层索引: [${move.layers}]`);
      game.notation.move("M", () => {
        console.log("  ✅ 完成");
      });
    }, 4000);
  },
  
  // 完整测试序列
  runAll: function() {
    console.log("🚀 开始完整测试序列...\n");
    
    const sequence = [
      { size: 2, test: 'test2x2', delay: 7000 },
      { size: 3, test: 'test3x3', delay: 7000 },
      { size: 4, test: 'test4x4', delay: 7000 },
      { size: 5, test: 'test5x5', delay: 7000 }
    ];
    
    let index = 0;
    
    function runNext() {
      if (index >= sequence.length) {
        console.log("\n🎉 所有测试完成！");
        return;
      }
      
      const step = sequence[index];
      setCubeSize(step.size);
      
      setTimeout(() => {
        tests[step.test]();
        index++;
        setTimeout(runNext, step.delay);
      }, 500);
    }
    
    runNext();
  },
  
  // 层索引检查
  inspectLayers: function() {
    const size = game.cube.size;
    console.log(`\n🔍 当前 ${size}x${size} 魔方的层索引映射：\n`);
    
    const moves = ['R', 'L', 'U', 'D', 'F', 'B', 'r', 'l', 'M', 'E', 'S'];
    
    console.table(
      moves.map(m => {
        const parsed = game.notation.parseMove(m);
        return {
          记法: m,
          类型: parsed ? (parsed.type || 'layer') : 'N/A',
          轴: parsed ? parsed.axis : 'N/A',
          层索引: parsed ? parsed.layers?.join(',') : 'N/A',
          支持: parsed ? '✅' : '❌'
        };
      })
    );
  },
  
  // 对比测试
  compareAcrossSizes: function() {
    console.log("\n📊 不同阶数的 'R' 动作对比：\n");
    
    [2, 3, 4, 5].forEach(size => {
      // 临时切换阶数
      const oldSize = game.cube.size;
      game.cube.size = size;
      game.notation.cachedSize = null; // 强制重新生成
      
      const move = game.notation.parseMove("R");
      console.log(`${size}x${size}: R → 层索引 [${move.layers}] (最右层)`);
      
      game.cube.size = oldSize; // 恢复
      game.notation.cachedSize = null;
    });
    
    console.log("\n📊 不同阶数的 'r' 宽转对比：\n");
    
    [2, 3, 4, 5].forEach(size => {
      const oldSize = game.cube.size;
      game.cube.size = size;
      game.notation.cachedSize = null;
      
      const move = game.notation.parseMove("r");
      if (move.type === 'rotation') {
        console.log(`${size}x${size}: r → 整体旋转 (2x2 特性)`);
      } else {
        console.log(`${size}x${size}: r → 层索引 [${move.layers}] (右两层)`);
      }
      
      game.cube.size = oldSize;
      game.notation.cachedSize = null;
    });
    
    console.log("\n📊 不同阶数的 'M' 中间层对比：\n");
    
    [2, 3, 4, 5].forEach(size => {
      const oldSize = game.cube.size;
      game.cube.size = size;
      game.notation.cachedSize = null;
      
      const move = game.notation.parseMove("M");
      if (move) {
        console.log(`${size}x${size}: M → 层索引 [${move.layers}] ✅`);
      } else {
        console.log(`${size}x${size}: M → 不支持 ❌ (偶数阶无单一中间层)`);
      }
      
      game.cube.size = oldSize;
      game.notation.cachedSize = null;
    });
  }
};

// 导出到全局
window.cubeTests = tests;

console.log(`
🎮 多阶数测试工具已加载！

使用方法:
  cubeTests.test2x2()           - 测试 2x2
  cubeTests.test3x3()           - 测试 3x3
  cubeTests.test4x4()           - 测试 4x4
  cubeTests.test5x5()           - 测试 5x5
  cubeTests.runAll()            - 运行所有测试
  cubeTests.inspectLayers()     - 查看当前阶数的层索引
  cubeTests.compareAcrossSizes() - 对比不同阶数

💡 提示: 先在 UI 中切换到想要测试的阶数，然后运行对应测试
`);
