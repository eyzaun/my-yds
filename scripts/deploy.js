#!/usr/bin/env node

/**
 * Custom Firebase deployment script
 * Versiyon kontrolü ve build numarasını otomatik arttırır
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const incrementVersionScript = require('./increment-version.js');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function deploy() {
  try {
    log('\n🚀 Firebase Deployment başlıyor...', 'cyan');

    // Step 1: Build
    log('\n📦 Build process başlıyor...', 'yellow');
    await runCommand('npm run build');
    log('✅ Build tamamlandı', 'green');

    // Step 2: Increment version
    log('\n📝 Version bilgileri güncellenyor...', 'yellow');
    try {
      // Version increment script'i çalıştır
      await runCommand('node scripts/increment-version.js');
    } catch (error) {
      log('⚠️  Version increment uyarısı: ' + error.message, 'yellow');
      log('Firebase credentials bulunamadı. Versioning skipped. Lütfen deploy sonrası manuel olarak güncelleyin.', 'yellow');
    }

    // Step 3: Deploy to Firebase
    log('\n☁️  Firebase\'a deploy yapılıyor...', 'yellow');
    await runCommand('firebase deploy --only hosting');
    log('✅ Firebase deployment tamamlandı', 'green');

    log('\n🎉 Deployment başarıyla tamamlandı!', 'green');
    log('\n📊 Deployment Summary:', 'cyan');
    const buildRc = JSON.parse(fs.readFileSync(path.join(__dirname, '../.buildrc'), 'utf8'));
    log(`   Build Number: #${buildRc.buildNumber}`, 'cyan');
    log(`   Version: ${buildRc.version}`, 'cyan');
    log(`   Updated: ${new Date().toLocaleString('tr-TR')}`, 'cyan');

  } catch (error) {
    log('\n❌ Deployment failed:', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    const process = exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr && !stderr.includes('warning')) {
        log(stderr, 'yellow');
      }
      if (stdout) {
        console.log(stdout);
      }
      resolve();
    });

    // Stream output in real-time
    process.stdout?.pipe(process.stdout);
    process.stderr?.pipe(process.stderr);
  });
}

// Run deployment
deploy();
