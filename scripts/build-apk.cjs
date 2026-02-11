#!/usr/bin/env node
/**
 * 仅打包 APK：同步当前网站版本号到 APK → 打包 debug APK 到桌面
 */
const { getCurrentVersion, updateApkVersion, buildApk } = require('./shared.cjs');

function main() {
  console.log('\n📱 打包 APK\n');

  try {
    const version = getCurrentVersion();
    console.log(`当前网站版本: v${version}`);

    console.log('📝 同步 APK 版本号...');
    const versionCode = updateApkVersion(version);
    console.log(`   versionName: ${version}, versionCode: ${versionCode}`);

    buildApk();

    console.log(`\n✅ APK v${version} 打包完成，已放到桌面！`);
  } catch (error) {
    console.error('\n❌ 打包失败:', error.message);
  }
}

main();
