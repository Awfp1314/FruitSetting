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

// 获取最近的 Git 提交信息
function getRecentCommits(count = 5) {
  try {
    const log = execSync(`git log -${count} --pretty=format:"%s"`, { encoding: 'utf-8' });
    return log.split('\n').filter((line) => line.trim());
  } catch {
    return [];
  }
}

// 从提交信息中提取更新内容
function extractChangesFromCommits(commits) {
  const changes = [];
  const emojiMap = {
    feat: '✨',
    fix: '🐛',
    perf: '⚡',
    style: '🎨',
    refactor: '🔄',
    docs: '📝',
    chore: '🔧',
  };

  commits.forEach((commit) => {
    // 跳过版本发布的提交
    if (commit.includes('chore: 发布 v') || commit.includes('Merge')) {
      return;
    }

    // 提取类型和消息
    const match = commit.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const [, type, message] = match;
      const emoji = emojiMap[type] || '•';
      changes.push(`${emoji} ${message}`);
    } else {
      changes.push(`• ${commit}`);
    }
  });

  return changes;
}

// 从提交信息中生成标题
function generateTitle(commits) {
  if (commits.length === 0) return '';

  // 查找最主要的功能
  const featCommit = commits.find((c) => c.startsWith('feat:'));
  if (featCommit) {
    return featCommit
      .replace(/^feat:\s*/, '')
      .split('(')[0]
      .trim();
  }

  // 如果没有 feat，用第一个提交
  return commits[0]
    .replace(/^\w+:\s*/, '')
    .split('(')[0]
    .trim();
}
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

  // 获取最近的提交信息
  const recentCommits = getRecentCommits(10);
  const suggestedChanges = extractChangesFromCommits(recentCommits);
  const suggestedTitle = generateTitle(recentCommits);

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

  // 输入更新标题（提供建议）
  if (suggestedTitle) {
    console.log(`💡 建议标题: ${suggestedTitle}`);
  }
  const titleInput = await ask('请输入更新标题 (直接回车使用建议): ');
  const title = titleInput.trim() || suggestedTitle || '版本更新';

  // 输入更新内容（提供建议）
  console.log('\n📝 根据最近的提交，建议的更新内容：');
  if (suggestedChanges.length > 0) {
    suggestedChanges.forEach((change, index) => {
      console.log(`${index + 1}. ${change}`);
    });
    console.log('\n选项：');
    console.log('- 直接回车：使用所有建议');
    console.log('- 输入数字（如 1,3,5）：只使用选中的');
    console.log('- 输入 n：手动输入\n');

    const choiceInput = await ask('请选择: ');
    let changes = [];

    if (!choiceInput.trim()) {
      // 使用所有建议
      changes = suggestedChanges;
    } else if (choiceInput.toLowerCase() === 'n') {
      // 手动输入
      console.log('\n请输入更新内容（每行一条，输入空行结束）:');
      while (true) {
        const change = await ask('- ');
        if (!change.trim()) break;
        changes.push(change);
      }
    } else {
      // 使用选中的
      const indices = choiceInput.split(',').map((s) => parseInt(s.trim()) - 1);
      changes = indices
        .filter((i) => i >= 0 && i < suggestedChanges.length)
        .map((i) => suggestedChanges[i]);
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
  } else {
    // 没有建议，手动输入
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
  }

  rl.close();
}

main();
