/**
 * 数字层记法测试
 * Test script for numeric layer notation (2R, 3R, etc.)
 */

// 测试辅助函数
function testParse(notation, description, cubeSize, expectedLayers) {
  console.log(`\n测试: ${description}`);
  console.log(`记法: ${notation} (${cubeSize}x${cubeSize})`);
  
  // 模拟设置魔方尺寸
  game.cube.size = cubeSize;
  game.notation.generateMoves();
  
  const result = game.notation.parseMove(notation);
  
  if (!result) {
    console.log('❌ 解析失败');
    return false;
  }
  
  console.log(`解析结果: 层级 [${result.layers}]`);
  console.log(`修饰符: ${result.modifier || '无'}`);
  
  if (expectedLayers) {
    const match = JSON.stringify(result.layers) === JSON.stringify(expectedLayers);
    console.log(match ? '✅ 层级正确' : `❌ 期望 [${expectedLayers}]`);
    return match;
  }
  
  return true;
}

console.log('=== 数字层记法测试 ===\n');

// 4x4 测试
console.log('\n【4x4 魔方测试】');
testParse('2R', '4x4 双层右转', 4, [2, 3]);
testParse('2R\'', '4x4 双层右转逆时针', 4, [2, 3]);
testParse('2R2', '4x4 双层右转180度', 4, [2, 3]);
testParse('2Rw', '4x4 双层右转（w记法）', 4, [2, 3]);
testParse('2L', '4x4 双层左转', 4, [0, 1]);
testParse('2U', '4x4 双层上转', 4, [2, 3]);
testParse('2D', '4x4 双层下转', 4, [0, 1]);

// 5x5 测试
console.log('\n【5x5 魔方测试】');
testParse('2R', '5x5 双层右转', 5, [3, 4]);
testParse('3R', '5x5 三层右转', 5, [2, 3, 4]);
testParse('4R', '5x5 四层右转', 5, [1, 2, 3, 4]);
testParse('2L', '5x5 双层左转', 5, [0, 1]);
testParse('3L', '5x5 三层左转', 5, [0, 1, 2]);
testParse('3Rw\'', '5x5 三层右转逆时针', 5, [2, 3, 4]);

// 边界测试
console.log('\n【边界条件测试】');
testParse('2R', '3x3 不支持数字记法（应警告）', 3);
testParse('5R', '4x4 层数超限（应警告）', 4);
testParse('1R', '层数小于2（应警告）', 4);

// 组合算法测试
console.log('\n【组合算法测试】');
console.log('\n测试: 4x4 配对中心块');
game.cube.size = 4;
game.notation.generateMoves();
game.notation.move('2R 2U 2R\' 2U\'');
console.log('✅ 算法执行成功');

console.log('\n测试: 5x5 三层算法');
game.cube.size = 5;
game.notation.generateMoves();
game.notation.move('3Rw U 3Rw\' U\'');
console.log('✅ 算法执行成功');

// 等价性测试
console.log('\n【等价性测试】');
console.log('\n4x4 等价记法测试:');
console.log('2R ≡ r ≡ Rw (双层右转)');

game.cube.size = 4;
game.notation.generateMoves();

const r2 = game.notation.parseMove('2R');
const r_lower = game.notation.parseMove('r');
const rw = game.notation.parseMove('Rw');

console.log(`2R 层级: [${r2.layers}]`);
console.log(`r 层级: [${r_lower.layers}]`);
console.log(`Rw 层级: [${rw.layers}]`);

const equivalent = 
  JSON.stringify(r2.layers) === JSON.stringify(r_lower.layers) &&
  JSON.stringify(r2.layers) === JSON.stringify(rw.layers);

console.log(equivalent ? '✅ 三种记法等价' : '❌ 记法不等价');

console.log('\n=== 测试完成 ===');
console.log('\n使用方法:');
console.log('1. 在浏览器控制台打开 index.html');
console.log('2. 复制此文件内容到控制台');
console.log('3. 或直接使用: game.notation.move("2R U 3R\' 2U")');
