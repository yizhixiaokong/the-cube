/**
 * Notation.js Unit Tests
 * Run in browser console after loading the game
 */

function testNotation() {
  console.log("🧪 开始测试 Notation.js...\n");
  
  const tests = [];
  let passed = 0;
  let failed = 0;

  // Test helper
  function test(name, fn) {
    try {
      fn();
      passed++;
      console.log(`✅ ${name}`);
    } catch (e) {
      failed++;
      console.error(`❌ ${name}:`, e.message);
    }
  }

  // Get current size
  const currentSize = game.cube.size;
  console.log(`📏 当前魔方阶数: ${currentSize}x${currentSize}\n`);

  // Test 1: Parse basic moves
  test("解析基础动作 R", () => {
    const move = game.notation.parseMove("R");
    if (!move || move.base !== 'R' || move.axis !== 'x') {
      throw new Error("解析失败");
    }
  });

  test("解析逆时针动作 R'", () => {
    const move = game.notation.parseMove("R'");
    if (!move || move.base !== 'R' || move.angle > 0) {
      throw new Error("角度方向错误");
    }
  });

  test("解析180度动作 U2", () => {
    const move = game.notation.parseMove("U2");
    if (!move || move.repetitions !== 2) {
      throw new Error("repetitions 应为 2");
    }
  });

  // Test numeric layer notation (4x4+)
  if (currentSize >= 4) {
    test("解析数字层记法 2R (4x4+)", () => {
      const move = game.notation.parseMove("2R");
      if (!move || move.base !== '2R') {
        throw new Error("解析失败");
      }
      // For 4x4: [2, 3], for 5x5: [3, 4]
      const expectedLength = 2;
      if (move.layers.length !== expectedLength) {
        throw new Error(`层数错误: 期望 ${expectedLength}, 实际 ${move.layers.length}`);
      }
    });

    test("解析数字层记法 2R' (逆时针)", () => {
      const move = game.notation.parseMove("2R'");
      if (!move || move.angle > 0) {
        throw new Error("角度方向错误");
      }
    });

    test("解析数字层记法 2R2 (180度)", () => {
      const move = game.notation.parseMove("2R2");
      if (!move || move.repetitions !== 2) {
        throw new Error("repetitions 应为 2");
      }
    });

    if (currentSize >= 5) {
      test("解析三层记法 3R (5x5+)", () => {
        const move = game.notation.parseMove("3R");
        if (!move || move.layers.length !== 3) {
          throw new Error("层数应为 3");
        }
      });

      test("解析四层记法 4R (5x5+)", () => {
        const move = game.notation.parseMove("4R");
        if (!move || move.layers.length !== 4) {
          throw new Error("层数应为 4");
        }
      });
    }
  }

  // Test 2: Size-dependent tests
  if (currentSize === 3 || currentSize === 5) {
    // Only test middle layers on odd-sized cubes
    test("解析中层 M (奇数阶)", () => {
      const move = game.notation.parseMove("M");
      const expectedMiddle = Math.floor(currentSize / 2);
      if (!move || move.layers[0] !== expectedMiddle) {
        throw new Error(`M 应该是中间层 (position=${expectedMiddle}), 实际 ${move?.layers[0]}`);
      }
    });

    test("解析中层 E (奇数阶)", () => {
      const move = game.notation.parseMove("E");
      if (!move || move.type === 'rotation') {
        throw new Error("E 应该是层转动而非整体旋转");
      }
    });
  } else if (currentSize === 2 || currentSize === 4) {
    // Test that middle layers are rejected on even-sized cubes
    test("中层 M 在偶数阶应返回 null", () => {
      const move = game.notation.parseMove("M");
      if (move !== null) {
        throw new Error("偶数阶不应支持 M");
      }
    });
  }

  // Test 3: Wide turns
  if (currentSize >= 3) {
    test("解析宽转 r (3阶+)", () => {
      const move = game.notation.parseMove("r");
      if (!move || move.layers.length !== 2) {
        throw new Error("应该有两层");
      }
      // Check correct layers
      const expected = [currentSize - 2, currentSize - 1];
      if (move.layers[0] !== expected[0] || move.layers[1] !== expected[1]) {
        throw new Error(`r 应该是 [${expected}], 实际 [${move.layers}]`);
      }
    });
  } else if (currentSize === 2) {
    test("解析宽转 r (2阶=整体旋转)", () => {
      const move = game.notation.parseMove("r");
      if (!move || move.type !== 'rotation') {
        throw new Error("2阶的宽转应该是整体旋转");
      }
    });
  }

  test("解析宽转 Rw", () => {
    const move = game.notation.parseMove("Rw");
    if (!move) {
      throw new Error("Rw 解析失败");
    }
  });

  // Test 4: Parse rotations
  test("解析整体旋转 x", () => {
    const move = game.notation.parseMove("x");
    if (!move || move.type !== 'rotation') {
      throw new Error("x 应该是 rotation 类型");
    }
  });

  // Test 5: Parse algorithms
  test("解析算法序列", () => {
    const moves = game.notation.parseAlgorithm("R U R' U'");
    if (moves.length !== 4) {
      throw new Error(`应该解析出4个动作，实际 ${moves.length}`);
    }
  });

  // Test 6: Inverse
  test("单个动作求逆 R -> R'", () => {
    const inv = game.notation.inverse("R");
    if (inv !== "R'") {
      throw new Error(`期望 R', 实际 ${inv}`);
    }
  });

  test("单个动作求逆 R' -> R", () => {
    const inv = game.notation.inverse("R'");
    if (inv !== "R") {
      throw new Error(`期望 R, 实际 ${inv}`);
    }
  });

  test("180度动作求逆 F2 -> F2", () => {
    const inv = game.notation.inverse("F2");
    if (inv !== "F2") {
      throw new Error(`期望 F2, 实际 ${inv}`);
    }
  });

  test("算法求逆", () => {
    const inv = game.notation.inverseAlgorithm("R U R' U'");
    if (inv !== "U R U' R'") {
      throw new Error(`期望 "U R U' R'", 实际 "${inv}"`);
    }
  });

  // Test 7: Invalid notation
  test("无效记法应返回 null", () => {
    const move = game.notation.parseMove("X");  // X is invalid
    if (move !== null) {
      throw new Error("应该返回 null");
    }
  });

  // Summary
  console.log(`\n📊 测试结果: ${passed} 通过, ${failed} 失败`);
  
  if (failed === 0) {
    console.log("✅ 所有测试通过！");
  } else {
    console.log("❌ 部分测试失败");
  }

  return { passed, failed };
}

// Export for console use
window.testNotation = testNotation;

console.log("💡 在控制台输入 testNotation() 运行测试");
