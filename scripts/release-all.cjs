#!/usr/bin/env node
/**
 * 全量发布：更新版本号 → 构建网站 → 打包 APK → Git 提交推送
 */
const {
  createRL,
  updateWebVersion,
  updateApkVersion,
  buildWeb,
  buildApk,
  gitCommitAndPush,
  collectVersionInfo,
} = require('./shared.cjs');

async function main() {
  console.log('\n🚀 全量发布（网站 + APK）\n');
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

    console.log('📝 更新 APK 版本...');
    const versionCode = updateApkVersion(newVersion);
    console.log(`   versionName: ${newVersion}, versionCode: ${versionCode}`);

    buildWeb();
    buildApk();
    gitCommitAndPush(`chore: 发布 v${newVersion} - ${title}`);

    console.log(`\n✅ v${newVersion} 发布完成！`);
    console.log('🌐 Vercel 将自动部署网站');
    console.log('📱 APK 已放到桌面');
  } catch (error) {
    console.error('\n❌ 发布失败:', error.message);
  }

  rl.close();
}

main();
