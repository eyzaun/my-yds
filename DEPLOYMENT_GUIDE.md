# Version Management Guide

## How Version Checking Works

```
User opens app
    ↓
VersionProvider fetches /app-version.json (currentVersion)
    ↓
Sets serverVersion = currentVersion (first load)
    ↓
If currentVersion < serverVersion
    ↓
Show UpdateModal automatically
    ↓
User clicks "Şimdi Güncelle" → Clear cache + Reload
```

## Updating Your Version

### Step 1: Make Changes
```bash
npm run dev
# Make your feature changes and test locally
```

### Step 2: Build
```bash
npm run build
```

### Step 3: Update buildNumber
Edit `public/app-version.json`:

**BEFORE** (deployed version):
```json
{
  "buildNumber": 1
}
```

**AFTER** (new version):
```json
{
  "buildNumber": 2
}
```

### Step 4: Deploy
```bash
npm run deploy
```

### Step 5: Test Version Check

**On same device (cache will show old version):**
1. Open app in incognito/private window
2. UpdateModal should appear automatically
3. Click "Şimdi Güncelle"
4. Cache clears + page reloads
5. Voilà!

**Or test on different device:**
1. Open app on phone/tablet
2. UpdateModal appears if buildNumber increased

## Important Files

| File | Purpose |
|------|---------|
| `public/app-version.json` | Current deployed buildNumber |
| `src/contexts/VersionContext.tsx` | Version comparison logic |
| `src/components/UpdateModal.tsx` | Update notification UI |

## Testing Scenarios

### Scenario 1: First Time (Testing)
- buildNumber: 1 (local)
- buildNumber: 1 (deployed)
- **Result**: No update (versions match)

### Scenario 2: New Version Available
- buildNumber: 1 (local/cached)
- buildNumber: 2 (deployed)
- **Result**: UpdateModal shows ✓

### Scenario 3: User Dismisses Update
- Click "Daha Sonra"
- Modal dismissed for this session
- Reappears after browser restart

## Current State

```
Local buildNumber:    1
Server buildNumber:   1
Update showing:       No (versions match)

To test: Change buildNumber to 2, deploy, then reload from different device
```

## Q&A

**Q: UpdateModal is not showing?**
A: Make sure:
1. buildNumber in public/app-version.json is deployed
2. You're loading from cache (incognito mode to test)
3. Browser DevTools Network tab shows new app-version.json

**Q: How do I deploy?**
A:
```bash
npm run deploy
```

**Q: Can I force everyone to update?**
A: Currently, it shows a notification. Users can dismiss with "Daha Sonra". To make it mandatory, add `forceUpdate` flag.

**Q: Does cache clearing happen automatically?**
A: Yes! UpdateModal handler clears:
- Service worker registrations
- All browser caches
- Then reloads page

**Q: What about Firestore?**
A: Not used anymore. System runs entirely on public/app-version.json

---

**TL;DR**: Just increment buildNumber in `public/app-version.json` and deploy! 🚀
