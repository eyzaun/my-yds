#!/usr/bin/env node

/**
 * Manual Version Update Script
 * Firestore'da version bilgilerini manuel olarak güncelleyebilirsiniz
 *
 * Kullanım:
 * node scripts/update-version.js --build 2 --message "Yeni özellikler eklendi" --force false
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

// Color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      parsed[key] = args[i + 1];
      i++;
    }
  }

  return parsed;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function updateVersion() {
  try {
    // Initialize Firebase Admin
    const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

    if (!fs.existsSync(serviceAccountPath)) {
      log('\n❌ serviceAccountKey.json bulunamadı!', 'red');
      log('Lütfen önce: npm run init-firestore\n', 'yellow');
      process.exit(1);
    }

    const serviceAccount = require(serviceAccountPath);

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }

    const db = admin.firestore();

    log('\n' + '='.repeat(50), 'cyan');
    log('  VERSION MANUEL GÜNCELLEME', 'cyan');
    log('='.repeat(50) + '\n', 'cyan');

    // Get current version
    const versionRef = db.collection('appConfig').doc('version');
    const currentDoc = await versionRef.get();

    if (!currentDoc.exists()) {
      log('❌ Version document bulunamadı!', 'red');
      log('Lütfen önce: npm run init-firestore\n', 'yellow');
      process.exit(1);
    }

    const current = currentDoc.data();

    log('📊 Mevcut Version:', 'blue');
    log(`  Build Number: ${current.buildNumber}`, 'blue');
    log(`  Version: ${current.version}`, 'blue');
    log(`  Force Update: ${current.forceUpdate}`, 'blue');
    log(`  Message: ${current.updateMessage}\n`, 'blue');

    const args = parseArgs();

    // Build Number
    let newBuildNumber = current.buildNumber;
    if (args.build) {
      newBuildNumber = parseInt(args.build);
    } else {
      const input = await question(`Yeni Build Number girin (mevcut: ${current.buildNumber}): `);
      if (input) newBuildNumber = parseInt(input);
    }

    // Update Message
    let updateMessage = current.updateMessage;
    if (args.message) {
      updateMessage = args.message;
    } else {
      const input = await question(`Update mesajı girin:\n> `);
      if (input) updateMessage = input;
    }

    // Changelog
    let changelog = current.changelog;
    const changelogInput = await question(`Changelog'u girin (boş bırakmak için mevcut'ı korur):\n> `);
    if (changelogInput) changelog = changelogInput;

    // Force Update
    let forceUpdate = current.forceUpdate;
    if (args.force !== undefined) {
      forceUpdate = args.force === 'true';
    } else {
      const forceInput = await question(`Force Update aktif olsun mu? (true/false, mevcut: ${current.forceUpdate}): `);
      if (forceInput) forceUpdate = forceInput.toLowerCase() === 'true';
    }

    // Version string
    const versionParts = current.version.split('.');
    let newVersion = current.version;
    const versionInput = await question(`Versiyon numarasını girin (format: 0.1.0, boş: ${current.version}): `);
    if (versionInput) newVersion = versionInput;

    // Confirmation
    log('\n' + '='.repeat(50), 'yellow');
    log('  GÜNCELLEMELER', 'yellow');
    log('='.repeat(50), 'yellow');
    log(`Build Number: ${current.buildNumber} → ${newBuildNumber}`, 'yellow');
    log(`Version: ${current.version} → ${newVersion}`, 'yellow');
    log(`Force Update: ${current.forceUpdate} → ${forceUpdate}`, 'yellow');
    log(`Update Message: "${updateMessage}"`, 'yellow');
    log(`Changelog: "${changelog}"`, 'yellow');

    const confirm = await question(`\n⚠️  Bu değişiklikleri kaydetmek istiyor musunuz? (evet/hayır): `);

    if (confirm.toLowerCase() !== 'evet' && confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      log('\n❌ İptal edildi.\n', 'red');
      rl.close();
      process.exit(0);
    }

    // Update Firestore
    log('\n🔄 Firestore güncelleniyor...', 'cyan');

    await versionRef.update({
      buildNumber: newBuildNumber,
      version: newVersion,
      releaseDate: admin.firestore.Timestamp.now(),
      forceUpdate: forceUpdate,
      updateMessage: updateMessage,
      changelog: changelog
    });

    log('✅ Firestore başarıyla güncellendi!\n', 'green');

    log('📊 Yeni Version:', 'green');
    log(`  Build Number: ${newBuildNumber}`, 'green');
    log(`  Version: ${newVersion}`, 'green');
    log(`  Force Update: ${forceUpdate}`, 'green');
    log(`  Message: "${updateMessage}"\n`, 'green');

    log('💡 İpuçları:', 'cyan');
    log('• Force Update: true ise kullanıcılar güncellemek zorunda olur', 'cyan');
    log('• Force Update: false ise "Daha Sonra" seçebilirler', 'cyan');
    log('• Sayfayı yenileyin ve UpdateModal\'u test edin\n', 'cyan');

    rl.close();
    process.exit(0);
  } catch (error) {
    log('\n❌ Hata oluştu:', 'red');
    log(error.message, 'red');
    rl.close();
    process.exit(1);
  }
}

updateVersion();
