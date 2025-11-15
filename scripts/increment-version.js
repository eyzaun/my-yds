/**
 * Version increment script
 * Her Firebase deploy öncesi otomatik olarak build numarasını arttırır
 * ve Firestore'u güncelleştirir
 */

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.log('⚠️  serviceAccountKey.json bulunamadı. Lütfen Firebase credentials dosyasını ekleyin.');
  console.log('Deploy yapabilmek için:');
  console.log('1. Firebase Console > Project Settings > Service Accounts > Generate new private key');
  console.log('2. Dosyayı project root\'a serviceAccountKey.json olarak kaydedin');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project.firebaseio.com'
});

const db = admin.firestore();

async function incrementVersion() {
  try {
    console.log('🔄 Version bilgileri okunuyor...');

    // Read current local version
    const buildRcPath = path.join(__dirname, '../.buildrc');
    let localVersion = { buildNumber: 1, version: '0.1.0', lastUpdated: new Date().toISOString() };

    if (fs.existsSync(buildRcPath)) {
      localVersion = JSON.parse(fs.readFileSync(buildRcPath, 'utf8'));
    }

    // Increment build number
    const newBuildNumber = localVersion.buildNumber + 1;
    const version = require(path.join(__dirname, '../package.json')).version;

    const updatedVersion = {
      buildNumber: newBuildNumber,
      version: version,
      lastUpdated: new Date().toISOString()
    };

    // Write updated version to .buildrc
    fs.writeFileSync(buildRcPath, JSON.stringify(updatedVersion, null, 2));
    console.log(`✅ .buildrc updated: Build #${newBuildNumber}`);

    // Also update public/app-version.json for fast client access
    const appVersionPath = path.join(__dirname, '../public/app-version.json');
    const currentAppVersion = JSON.parse(fs.readFileSync(appVersionPath, 'utf8'));

    const newAppVersion = {
      ...currentAppVersion,
      buildNumber: newBuildNumber,
      version: version,
      releaseDate: new Date().toISOString(),
      forceUpdate: false, // Set to true if you want to force update on all users
      updateMessage: currentAppVersion.updateMessage || 'Uygulamanın yeni bir versiyonu mevcut. Lütfen sayfayı yenileyin.',
      changelog: currentAppVersion.changelog || `Build #${newBuildNumber} - Yeni özellikler ve iyileştirmeler`
    };

    fs.writeFileSync(appVersionPath, JSON.stringify(newAppVersion, null, 2));
    console.log(`✅ public/app-version.json updated`);

    // Update Firestore appConfig
    console.log('🔄 Firestore güncellendiyor...');

    const versionRef = db.collection('appConfig').doc('version');
    await versionRef.set({
      buildNumber: newBuildNumber,
      version: version,
      releaseDate: admin.firestore.Timestamp.now(),
      minSupportedBuild: 1, // Adjust as needed
      forceUpdate: false,
      updateMessage: 'Uygulamanın yeni bir versiyonu mevcut. Lütfen sayfayı yenileyin.',
      changelog: `Build #${newBuildNumber} - Yeni özellikler ve iyileştirmeler`
    });

    console.log(`✅ Firestore updated: Build #${newBuildNumber}`);
    console.log(`\n🎉 Version successfully incremented!`);
    console.log(`   Old Build: #${localVersion.buildNumber}`);
    console.log(`   New Build: #${newBuildNumber}`);
    console.log(`   Version: ${version}`);
    console.log(`   Updated: ${new Date().toLocaleString('tr-TR')}`);

    // Don't exit immediately to avoid connection issues
    setTimeout(() => process.exit(0), 1000);
  } catch (error) {
    console.error('❌ Error incrementing version:', error);
    process.exit(1);
  }
}

// Run the script
incrementVersion();
