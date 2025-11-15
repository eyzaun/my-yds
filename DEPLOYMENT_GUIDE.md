# Deployment Guide

## Version Management & Deployment

### 1. Firebase Setup (One-time)

If you haven't already, set up Firebase credentials:

```bash
# Copy your Firebase admin SDK JSON file to project root as:
# serviceAccountKey.json

# Then initialize Firestore with version data
npm run init-firestore
```

### 2. Firestore Security Rules

Security rules have been configured in `firestore.rules`:
- ✅ Public read access to `appConfig/version` for all users
- ✅ Write access restricted to admin SDK only
- ✅ All other collections denied by default

Rules are automatically deployed when you run:

```bash
firebase deploy --only firestore:rules
```

### 3. Managing Versions

#### Option A: Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **my-yds**
3. Go to Firestore Database
4. Collection: **appConfig** → Document: **version**
5. Edit fields:
   - `buildNumber` - Increment for updates
   - `version` - Semantic version (e.g., 0.2.0)
   - `updateMessage` - User-facing message
   - `changelog` - What changed
   - `forceUpdate` - true/false (true = mandatory update)

#### Option B: CLI Script

```bash
npm run update-version
```

Interactive prompts will guide you through version updates.

### 4. Deployment

```bash
npm run deploy
```

This will:
1. Increment build number automatically
2. Update `public/app-version.json`
3. Deploy to Firebase Hosting
4. Update Firestore version document

### 5. Version Update Flow

```
User visits app
    ↓
VersionContext loads
    ↓
Checks /app-version.json (current version)
    ↓
Fetches appConfig/version from Firestore
    ↓
Compares build numbers
    ↓
If newer version exists:
  - Show UpdateModal
  - If forceUpdate=true: Cannot dismiss
  - If forceUpdate=false: Can dismiss or update
```

### 6. Current Firestore Document

Location: `appConfig/version`

```json
{
  "buildNumber": 1,
  "version": "0.1.0",
  "releaseDate": "2025-11-15T...",
  "minSupportedBuild": 1,
  "forceUpdate": false,
  "updateMessage": "Hoşgeldiniz! Bu uygulamanın ilk versiyonudur.",
  "changelog": "Initial release\n- AdSense integration\n- User authentication\n- Word learning system"
}
```

### 7. Testing Version Updates

To test:

1. Update `buildNumber` in Firebase Console (e.g., 1 → 2)
2. Refresh app in browser (different device or incognito)
3. UpdateModal should appear automatically
4. Click "Şimdi Güncelle" to test update flow

### 8. Troubleshooting

**Error: "Missing or insufficient permissions"**
- Firestore rules may not be deployed
- Run: `firebase deploy --only firestore:rules`

**Error: "Cannot find serviceAccountKey.json"**
- Place your Firebase admin SDK JSON in project root
- Rename to `serviceAccountKey.json`
- Update `.gitignore` to prevent accidental commit

**Ad errors in console**
- AdSense script loads asynchronously
- Minor errors are suppressed and retried
- Check Firebase console for ad approval status

## Files Modified

- `firestore.rules` - Security rules for Firestore
- `src/contexts/VersionContext.tsx` - Version management logic
- `src/components/UpdateModal.tsx` - Update notification UI
- `src/components/AdUnit.tsx` - Ad loading improvements
- `scripts/initialize-firestore.js` - Firestore setup
- `scripts/update-version.js` - CLI for manual updates
- `package.json` - Added npm scripts

## Support

For issues with:
- **Firebase**: [Firebase Docs](https://firebase.google.com/docs)
- **Next.js**: [Next.js Docs](https://nextjs.org/docs)
- **Version Management**: Check `src/contexts/VersionContext.tsx`
