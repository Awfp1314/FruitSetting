/**
 * 共享工具函数 - 被所有发布脚本引用
 */
const fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHANGELOG_PATH = path.join(ROOT, 'src/constants/changelog.js');
const PACKAGE_PATH = path.join(ROOT, 'package.json');
const GRADLE_PATH = path.join(ROOT, 'android/app/build.gradle');
const APK_DEBUG = path.join(ROOT, 'android/app/build/outputs/apk/debug/app-debug.apk');

function getDesktopApkPath(version) {
  return path.join(process.env.USERPROFILE || '', 'Desktop', `摆摊小助手-v${version}.apk`);
}

function createRL() {
  return readline.createInterface({ input: process.stdin, output: process.stdout });
}

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function getCurrentVersion() {
  const content = fs.readFileSync(CHANGELOG_PATH, 'utf-8');
  const match = content.match(/export const CURRENT_VERSION = '(\d+\.\d+\.\d+)'/);
  return match ? match[1] : '1.0.0';
}

function getNewVersion(current, type) {
  const [major, minor, patch] = current.split('.').map(Number);
  switch (type) {
    case '1':
      return `${major + 1}.0.0`;
    case '2':
      return `${major}.${minor + 1}.0`;
    case '3':
      return `${major}.${minor}.${patch + 1}`;
    default:
      return current;
  }
}

function getVersionType(type) {
  return { 1: 'major', 2: 'minor', 3: 'patch' }[type] || 'patch';
}

function getVersionTypeName(type) {
  return { 1: '重大更新', 2: '功能更新', 3: '问题修复' }[type] || '更新';
}

function getRecentCommits(count = 10) {
  try {
    const log = execSync(`git log -${count} --pretty=format:"%s"`, {
      encoding: 'utf-8',
      cwd: ROOT,
    });
    return log.split('\n').filter((l) => l.trim());
  } catch {
    return [];
  }
}

function extractChanges(commits) {
  const emojiMap = {
    feat: '✨',
    fix: '🐛',
    perf: '⚡',
    style: '🎨',
    refactor: '🔄',
    docs: '📝',
    chore: '🔧',
  };
  return commits
    .filter((c) => !c.includes('chore: 发布 v') && !c.includes('Merge'))
    .map((c) => {
      const m = c.match(/^(\w+):\s*(.+)$/);
      return m ? `${emojiMap[m[1]] || '•'} ${m[2]}` : `• ${c}`;
    });
}

function generateTitle(commits) {
  const feat = commits.find((c) => c.startsWith('feat:'));
  const first = feat || commits[0] || '';
  return (
    first
      .replace(/^\w+:\s*/, '')
      .split('(')[0]
      .trim() || '版本更新'
  );
}

// 更新网站版本号和 changelog
function updateWebVersion(version, type, title, changes) {
  let content = fs.readFileSync(CHANGELOG_PATH, 'utf-8');
  content = content.replace(
    /export const CURRENT_VERSION = '[\d.]+'/,
    `export const CURRENT_VERSION = '${version}'`
  );
  const today = new Date().toISOString().split('T')[0];
  const entry = `  '${version}': {\n    date: '${today}',\n    type: '${type}',\n    title: '${title}',\n    changes: [\n${changes.map((c) => `      '${c}',`).join('\n')}\n    ],\n  },`;
  content = content.replace(/export const CHANGELOG = \{/, `export const CHANGELOG = {\n${entry}`);
  fs.writeFileSync(CHANGELOG_PATH, content, 'utf-8');

  const pkg = JSON.parse(fs.readFileSync(PACKAGE_PATH, 'utf-8'));
  pkg.version = version;
  fs.writeFileSync(PACKAGE_PATH, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
}

// 更新 APK 版本号 (versionCode + versionName)
function updateApkVersion(version) {
  let gradle = fs.readFileSync(GRADLE_PATH, 'utf-8');
  // 提取当前 versionCode 并 +1
  const codeMatch = gradle.match(/versionCode\s+(\d+)/);
  const newCode = codeMatch ? parseInt(codeMatch[1]) + 1 : 1;
  gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${newCode}`);
  gradle = gradle.replace(/versionName\s+"[^"]+"/, `versionName "${version}"`);
  fs.writeFileSync(GRADLE_PATH, gradle, 'utf-8');
  return newCode;
}

// 构建网站
function buildWeb() {
  console.log('📦 构建网站...');
  execSync('npm run build', { stdio: 'inherit', cwd: ROOT });
}

// Git 提交并推送
function gitCommitAndPush(message) {
  console.log('📤 提交到 Git...');
  execSync('git add -A', { stdio: 'inherit', cwd: ROOT });
  execSync(`git commit -m "${message}"`, { stdio: 'inherit', cwd: ROOT });
  console.log('🚀 推送到远程仓库...');
  execSync('git push', { stdio: 'inherit', cwd: ROOT });
}

// 打包 APK
function buildApk() {
  console.log('📱 打包 APK...');
  const version = getCurrentVersion();
  const jdk21 = 'C:\\Program Files\\Microsoft\\jdk-21.0.8.9-hotspot';
  const gradlew = path.join(ROOT, 'android', 'gradlew.bat');
  const env = { ...process.env, JAVA_HOME: jdk21 };
  execSync(`"${gradlew}" -p "${path.join(ROOT, 'android')}" assembleDebug`, {
    stdio: 'inherit',
    env,
  });
  const dest = getDesktopApkPath(version);
  fs.copyFileSync(APK_DEBUG, dest);
  console.log(`✅ APK 已放到桌面: ${dest}`);
}

// 交互式收集版本信息
async function collectVersionInfo(rl) {
  const currentVersion = getCurrentVersion();
  console.log(`当前版本: v${currentVersion}\n`);

  const commits = getRecentCommits();
  const suggestedChanges = extractChanges(commits);
  const suggestedTitle = generateTitle(commits);

  console.log('请选择版本类型：');
  console.log('1. 大版本更新 (重大功能)');
  console.log('2. 小版本更新 (新功能)');
  console.log('3. 问题修复 (Bug 修复)\n');

  const typeChoice = await ask(rl, '请输入选项 (1/2/3): ');
  if (!['1', '2', '3'].includes(typeChoice)) {
    console.log('❌ 无效的选项');
    return null;
  }

  const newVersion = getNewVersion(currentVersion, typeChoice);
  const versionType = getVersionType(typeChoice);
  const versionTypeName = getVersionTypeName(typeChoice);
  console.log(`\n新版本号: v${newVersion} (${versionTypeName})\n`);

  if (suggestedTitle) console.log(`💡 建议标题: ${suggestedTitle}`);
  const titleInput = await ask(rl, '请输入更新标题 (直接回车使用建议): ');
  const title = titleInput.trim() || suggestedTitle;

  let changes = [];
  if (suggestedChanges.length > 0) {
    console.log('\n📝 建议的更新内容：');
    suggestedChanges.forEach((c, i) => console.log(`${i + 1}. ${c}`));
    console.log('\n直接回车=全部, 输入数字如1,3=选中, n=手动输入\n');
    const choice = await ask(rl, '请选择: ');

    if (!choice.trim()) {
      changes = suggestedChanges;
    } else if (choice.toLowerCase() === 'n') {
      console.log('请输入更新内容（每行一条，空行结束）:');
      while (true) {
        const c = await ask(rl, '- ');
        if (!c.trim()) break;
        changes.push(c);
      }
    } else {
      const indices = choice.split(',').map((s) => parseInt(s.trim()) - 1);
      changes = indices
        .filter((i) => i >= 0 && i < suggestedChanges.length)
        .map((i) => suggestedChanges[i]);
    }
  } else {
    console.log('请输入更新内容（每行一条，空行结束）:');
    while (true) {
      const c = await ask(rl, '- ');
      if (!c.trim()) break;
      changes.push(c);
    }
  }

  if (changes.length === 0) {
    console.log('❌ 至少需要一条更新内容');
    return null;
  }

  console.log('\n📋 预览：');
  console.log(`版本: v${newVersion} | 类型: ${versionTypeName} | 标题: ${title}`);
  changes.forEach((c) => console.log(`  - ${c}`));

  const confirm = await ask(rl, '\n确认？(y/n): ');
  if (confirm.toLowerCase() !== 'y') {
    console.log('❌ 已取消');
    return null;
  }

  return { newVersion, versionType, title, changes };
}

module.exports = {
  createRL,
  ask,
  getCurrentVersion,
  updateWebVersion,
  updateApkVersion,
  buildWeb,
  buildApk,
  gitCommitAndPush,
  collectVersionInfo,
};
