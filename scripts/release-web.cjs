#!/usr/bin/env node
/**
 * 仅发布网站：更新版本号 → 构建 → Git 提交推送 → Vercel 自动部署
 */
const {
  createRL,
  updateWebVersion,
  buildWeb,
  gitCommitAndPush,
  collectVersionInfo,
} = require('./shared.cjs');

async function main() {
  console.log('\n🌐 发布网站\n');
  const rl = createRL();

  try {
    const info = await collectVersionInfo(rl);
    if (!info) {
      rl.close();
      return;
    }

    const { newVersion, versionType, title, changes } = info;

    console.log('\n📝 更新网站版本...');
    updateWebVersion(newVersion, versionType, title, changes);

    buildWeb();
    gitCommitAndPush(`chore: 发布 v${newVersion} - ${title}`);

    console.log(`\n✅ v${newVersion} 网站发布完成！`);
    console.log('🎉 Vercel 将自动部署');
  } catch (error) {
    console.error('\n❌ 发布失败:', error.message);
  }

  rl.close();
}

main();
