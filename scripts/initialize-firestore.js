#!/usr/bin/env node

/**
 * Initialize Firestore with version data
 * Bunu bir kez çalıştırırsınız ve Firestore'a ilk version document'i oluşturur
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function initializeFirestore() {
  try {
    // Initialize Firebase Admin
    const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

    if (!fs.existsSync(serviceAccountPath)) {
      log('\n❌ serviceAccountKey.json bulunamadı!', 'red');
      log('\nYapmanız gerekenler:', 'yellow');
      log('1. Firebase Console > Project Settings > Service Accounts açın', 'yellow');
      log('2. "Generate new private key" butonuna tıklayın', 'yellow');
      log('3. İndirilen JSON dosyasını project root\'a serviceAccountKey.json olarak kaydedin', 'yellow');
      log('4. Bu script\'i tekrar çalıştırın\n', 'yellow');
      process.exit(1);
    }

    const serviceAccount = require(serviceAccountPath);

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }

    const db = admin.firestore();

    log('\n🔄 Firestore initialize ediliyor...', 'cyan');

    // Check if appConfig already exists
    const appConfigRef = db.collection('appConfig').doc('version');
    const existingDoc = await appConfigRef.get();

    if (existingDoc.exists()) {
      log('⚠️  Firestore zaten initialize edilmiş!', 'yellow');
      log(`\nMevcut versiyon:`, 'cyan');
      const data = existingDoc.data();
      log(`  Build Number: ${data.buildNumber}`, 'cyan');
      log(`  Version: ${data.version}`, 'cyan');
      log(`  Force Update: ${data.forceUpdate}`, 'cyan');
      log(`\nVersiyonu güncellemek için: npm run update-version\n`, 'cyan');
      process.exit(0);
    }

    // Create initial version document
    const initialVersion = {
      buildNumber: 1,
      version: '0.1.0',
      releaseDate: admin.firestore.Timestamp.now(),
      minSupportedBuild: 1,
      forceUpdate: false,
      updateMessage: 'Hoşgeldiniz! Bu uygulamanın ilk versiyonudur.',
      changelog: 'Initial release\n- AdSense integration\n- User authentication\n- Word learning system'
    };

    await appConfigRef.set(initialVersion);

    log('\n✅ Firestore başarıyla initialize edildi!', 'green');
    log('\n📊 Oluşturulan Version Document:', 'cyan');
    log(`  Collection: appConfig`, 'cyan');
    log(`  Document: version`, 'cyan');
    log(`  Build Number: ${initialVersion.buildNumber}`, 'cyan');
    log(`  Version: ${initialVersion.version}`, 'cyan');
    log(`  Force Update: ${initialVersion.forceUpdate}`, 'cyan');

    log('\n📝 Sonraki Adımlar:', 'yellow');
    log('1. Versiyonu güncellemek için: npm run update-version', 'yellow');
    log('2. Force update aktif etmek için Firestore Console\'u kullanın', 'yellow');
    log('3. Deploy etmek için: npm run deploy\n', 'yellow');

    process.exit(0);
  } catch (error) {
    log('\n❌ Hata oluştu:', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

initializeFirestore();
