#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 读取当前版本
function getCurrentVersion() {
  const changelogPath = './src/constants/changelog.js';
  const content = fs.readFileSync(changelogPath, 'utf-8');
  const match = content.match(/export const CURRENT_VERSION = '(\d+\.\d+\.\d+)'/);
  return match ? match[1] : '2.2.0';
}

// 计算新版本号
function getNewVersion(current, type) {
  const [major, minor, patch] = current.split('.').map(Number);

  switch (type) {
    case '1': // 大版本
      return `${major + 1}.0.0`;
    case '2': // 小版本
      return `${major}.${minor + 1}.0`;
    case '3': // 修复版本
      return `${major}.${minor}.${patch + 1}`;
    default:
      return current;
  }
}

// 获取版本类型名称
function getVersionType(type) {
  switch (type) {
    case '1':
      return 'major';
    case '2':
      return 'minor';
    case '3':
      return 'patch';
    default:
      return 'patch';
  }
}

// 获取版本类型中文名
function getVersionTypeName(type) {
  switch (type) {
    case '1':
      return '重大更新';
    case '2':
      return '功能更新';
    case '3':
      return '问题修复';
    default:
      return '更新';
  }
}

// 询问问题
function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// 更新 changelog.js
function updateChangelog(version, type, title, changes) {
  const changelogPath = './src/constants/changelog.js';
  let content = fs.readFileSync(changelogPath, 'utf-8');

  // 更新 CURRENT_VERSION
  content = content.replace(
    /export const CURRENT_VERSION = '[\d.]+'/,
    `export const CURRENT_VERSION = '${version}'`
  );

  // 获取当前日期
  const today = new Date().toISOString().split('T')[0];

  // 构建新的版本记录
  const newEntry = `  '${version}': {
    date: '${today}',
    type: '${type}',
    title: '${title}',
    changes: [
${changes.map((c) => `      '${c}',`).join('\n')}
    ],
  },`;

  // 插入新版本记录到 CHANGELOG 对象的开头
  content = content.replace(
    /export const CHANGELOG = \{/,
    `export const CHANGELOG = {\n${newEntry}`
  );

  fs.writeFileSync(changelogPath, content, 'utf-8');
}

// 更新 package.json
function updatePackageJson(version) {
  const packagePath = './package.json';
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  packageJson.version = version;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8');
}

// 主函数
async function main() {
  console.log('\n🚀 版本发布工具\n');

  const currentVersion = getCurrentVersion();
  console.log(`当前版本: v${currentVersion}\n`);

  // 选择版本类型
  console.log('请选择版本类型：');
  console.log('1. 大版本更新 (重大功能、不兼容改动)');
  console.log('2. 小版本更新 (新功能、向后兼容)');
  console.log('3. 问题修复 (Bug 修复、小改进)\n');

  const typeChoice = await ask('请输入选项 (1/2/3): ');

  if (!['1', '2', '3'].includes(typeChoice)) {
    console.log('❌ 无效的选项');
    rl.close();
    return;
  }

  const newVersion = getNewVersion(currentVersion, typeChoice);
  const versionType = getVersionType(typeChoice);
  const versionTypeName = getVersionTypeName(typeChoice);

  console.log(`\n新版本号: v${newVersion} (${versionTypeName})\n`);

  // 输入更新标题
  const title = await ask('请输入更新标题: ');

  // 输入更新内容
  console.log('\n请输入更新内容（每行一条，输入空行结束）:');
  const changes = [];
  while (true) {
    const change = await ask('- ');
    if (!change.trim()) break;
    changes.push(change);
  }

  if (changes.length === 0) {
    console.log('❌ 至少需要一条更新内容');
    rl.close();
    return;
  }

  // 确认信息
  console.log('\n📋 发布信息预览：');
  console.log(`版本: v${newVersion}`);
  console.log(`类型: ${versionTypeName}`);
  console.log(`标题: ${title}`);
  console.log('更新内容:');
  changes.forEach((c) => console.log(`  - ${c}`));

  const confirm = await ask('\n确认发布？(y/n): ');

  if (confirm.toLowerCase() !== 'y') {
    console.log('❌ 已取消发布');
    rl.close();
    return;
  }

  try {
    // 更新文件
    console.log('\n📝 更新版本文件...');
    updateChangelog(newVersion, versionType, title, changes);
    updatePackageJson(newVersion);

    // Git 操作
    console.log('📦 构建项目...');
    execSync('npm run build', { stdio: 'inherit' });

    console.log('📤 提交到 Git...');
    execSync('git add -A', { stdio: 'inherit' });
    execSync(`git commit -m "chore: 发布 v${newVersion} - ${title}"`, { stdio: 'inherit' });

    console.log('🚀 推送到远程仓库...');
    execSync('git push', { stdio: 'inherit' });

    console.log(`\n✅ 成功发布 v${newVersion}！`);
    console.log('🎉 Vercel 将自动部署新版本');
  } catch (error) {
    console.error('\n❌ 发布失败:', error.message);
  }

  rl.close();
}

main();
