# Firebase Deployment Talimatları

## 🔥 Firestore Security Rules Deployment

Uygulama şu anda **"Missing or insufficient permissions"** hatası veriyor çünkü Firestore güvenlik kuralları henüz deploy edilmedi.

### Yöntem 1: Firebase Console (Önerilen - Hızlı)

1. **Firebase Console'a git**: https://console.firebase.google.com
2. **Projenizi seçin**: `my-yds`
3. Sol menüden **"Firestore Database"** sekmesine tıklayın
4. Üst menüden **"Rules"** (Kurallar) sekmesine geçin
5. Aşağıdaki kuralları kopyalayıp yapıştırın:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function to check if user owns the resource
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Users collection - base level
    match /users/{userId} {
      // Allow users to read/write their own user document
      allow read, write: if isOwner(userId);

      // Flashcard sets subcollection
      match /flashcard-sets/{setId} {
        allow read, write: if isOwner(userId);

        // Flashcards subcollection within sets
        match /flashcards/{cardId} {
          allow read, write: if isOwner(userId);
        }
      }

      // Spaced repetition - custom cards
      match /spaced-repetition-custom/{cardId} {
        allow read, write: if isOwner(userId);
      }

      // Spaced repetition - category cards
      match /spaced-repetition-category/{cardId} {
        allow read, write: if isOwner(userId);
      }

      // Daily statistics
      match /statistics-daily/{dateId} {
        allow read, write: if isOwner(userId);
      }

      // Quiz sessions (for saving progress)
      match /quiz-sessions/{sessionId} {
        allow read, write: if isOwner(userId);
      }

      // User settings
      match /settings/{settingId} {
        allow read, write: if isOwner(userId);
      }
    }

    // User progress tracking (top-level collection)
    match /userProgress/{userId} {
      allow read, write: if isOwner(userId);
    }

    // Categories collection (read-only for all authenticated users)
    match /categories/{categoryId} {
      allow read: if isAuthenticated();
      allow write: if false; // Only admins can write (handle via Firebase Admin SDK)

      match /words/{wordId} {
        allow read: if isAuthenticated();
        allow write: if false;
      }
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

6. **"Publish"** (Yayınla) butonuna tıklayın
7. Onay penceresinde **"Publish"** butonuna tekrar tıklayın

### Yöntem 2: Firebase CLI (Alternatif)

Eğer Firebase CLI kurulu değilse önce kurun:

```bash
npm install -g firebase-tools
```

Firebase'e giriş yapın:

```bash
firebase login
```

Projeyi başlatın (sadece ilk kez):

```bash
firebase init firestore
```

Firestore rules'ı deploy edin:

```bash
firebase deploy --only firestore:rules
```

## ✅ Deployment Sonrası Kontrol

1. **Tarayıcıyı yenileyin**: https://my-yds.web.app
2. **Console'u açın** (F12)
3. **Hataların kaybolduğunu kontrol edin**:
   - ✅ "Missing or insufficient permissions" hatası olmamalı
   - ✅ Flashcard yükleme çalışmalı
   - ✅ Quiz progress kaydedilmeli
   - ✅ User progress güncellenebilmeli

## 🔒 Güvenlik Kuralları Açıklaması

### Ne İçeriyor?

1. **User Authentication**: Sadece giriş yapmış kullanıcılar erişebilir
2. **User Ownership**: Kullanıcılar sadece kendi verilerine erişebilir
3. **Read-Only Categories**: Kategori kelimeleri herkes tarafından okunabilir
4. **Secure Subcollections**:
   - Flashcard sets ve cards
   - Spaced repetition cards (custom ve category)
   - Quiz sessions
   - Daily statistics
   - User progress

### Koleksiyonlar

```
users/{userId}/
├── flashcard-sets/{setId}/
│   └── flashcards/{cardId}
├── spaced-repetition-custom/{cardId}
├── spaced-repetition-category/{cardId}
├── quiz-sessions/{sessionId}
├── statistics-daily/{dateId}
└── settings/{settingId}

userProgress/{userId}

categories/{categoryId}/
└── words/{wordId}
```

## 🐛 Hata Giderme

### Hala "Missing or insufficient permissions" hatası alıyorsanız:

1. **Cache'i temizleyin**:
   - Chrome: Ctrl+Shift+Delete → "Cached images and files"
   - Firefox: Ctrl+Shift+Delete → "Cache"

2. **Hard refresh yapın**:
   - Windows/Linux: Ctrl+Shift+R
   - Mac: Cmd+Shift+R

3. **Incognito/Private modda test edin**

4. **Firebase Console'da Rules'ı kontrol edin**:
   - Doğru deploy edildiğinden emin olun
   - "Simulator" ile test edin

5. **Authentication kontrol edin**:
   - Firebase Console → Authentication
   - Kullanıcının oturum açtığından emin olun

## 📝 Notlar

- Güvenlik kuralları deploy edildikten sonra **birkaç saniye** içinde aktif olur
- Eski kurallar tamamen değiştirilir (merge olmaz)
- Production ortamında her zaman güvenlik kurallarını test edin
- **ASLA** `allow read, write: if true;` kullanmayın (güvensiz!)

## 🎯 Sonraki Adımlar

Güvenlik kuralları deploy edildikten sonra:

1. ✅ Flashcard upload özelliğini test edin
2. ✅ Spaced repetition quiz'i test edin
3. ✅ Progress tracking'in çalıştığını kontrol edin
4. ✅ Quiz'den çıkıp tekrar girdiğinizde "Resume" dialog'u görmeli

## 📞 Yardım

Sorun yaşıyorsanız:

1. Browser console'daki hataları kontrol edin
2. Firebase Console → Firestore → Rules sekmesini kontrol edin
3. Network tab'inde 403 hataları olup olmadığına bakın
