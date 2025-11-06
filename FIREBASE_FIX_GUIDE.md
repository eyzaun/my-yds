# 🔥 Firebase İzin Hatası Çözüm Rehberi

## ⚠️ Acil Durum: "Missing or insufficient permissions" Hatası

Bu rehber, Firebase güvenlik kurallarını doğru şekilde deploy etmenizi sağlayacak.

---

## 📋 ÖNEMLİ KONTROL LİSTESİ

### 1. Firebase Console'da Rules Kontrolü

**Adımlar:**

1. https://console.firebase.google.com adresine git
2. **my-yds** projesini seç
3. Sol menüden **"Firestore Database"** tıkla
4. Üst menüden **"Rules"** sekmesine geç

**Kontrol Et:**
- Rules görüyor musunuz?
- Son güncelleme tarihi bugün mü?
- **"Publish"** butonu aktif mi yoksa gri mi?

---

## 🚨 HIZLI ÇÖZÜM - YÖN

TEM 1: Test Rules (5 dakika)

**UYARI: Bu kurallar GEÇİCİ olarak tüm authenticated kullanıcılara tam erişim verir!**

Firebase Console → Firestore Database → Rules sekmesine şu kuralları yapıştırın:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**"Publish"** butonuna tıklayın ve sayfayı yenileyin.

✅ Çalışıyorsa → Sorun rules'da, Yöntem 2'ye geçin
❌ Hala hata varsa → Authentication problemi, Yöntem 3'e geçin

---

## 🔐 YÖNTEM 2: Doğru Production Rules

Test rules çalıştıysa, şimdi güvenli production rules'ı deploy edin:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection with subcollections
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /flashcard-sets/{setId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;

        match /flashcards/{cardId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }

      match /spaced-repetition-custom/{cardId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /spaced-repetition-category/{cardId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /quiz-sessions/{sessionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /statistics-daily/{dateId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /settings/{settingId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    match /userProgress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /categories/{categoryId} {
      allow read: if request.auth != null;
      allow write: if false;

      match /words/{wordId} {
        allow read: if request.auth != null;
        allow write: if false;
      }
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**"Publish"** butonuna tıklayın.

---

## 🔍 YÖNTEM 3: Authentication Kontrolü

Eğer test rules bile çalışmadıysa, authentication sorunu olabilir.

### Console'da Kontrol:

1. **F12** tuşuna basın (Developer Tools)
2. **Console** sekmesine geçin
3. Şunu yazın ve Enter'a basın:

```javascript
firebase.auth().currentUser
```

**Sonuç:**
- ✅ `{uid: "...", email: "..."}` görüyorsanız → Giriş yapılmış
- ❌ `null` görüyorsanız → Giriş yapılmamış (tekrar giriş yapın)

### Network Tab Kontrolü:

1. **F12** → **Network** sekmesi
2. **Filter**: `firestore`
3. Sayfa yenile
4. Kırmızı (failed) request'lere tıklayın
5. **Headers** → **Response** bölümüne bakın

**Hata mesajında ne yazıyor?**
- `PERMISSION_DENIED` → Rules problemi
- `UNAUTHENTICATED` → Giriş problemi
- `NOT_FOUND` → Collection yolu yanlış

---

## 🧪 YÖNTEM 4: Rules Simulator

Firebase Console'da rules test edin:

1. Firestore Database → Rules sekmesi
2. Sağ üstteki **"Rules Playground"** butonuna tıklayın
3. Şu ayarları yapın:

```
Location: /users/{your-user-id}/flashcard-sets/test123
Read/Write: Write
Authenticated: Yes (toggle on)
Provider: Google/Email
```

4. **"Run"** butonuna tıklayın

**Sonuç:**
- ✅ **Simulated read: Allowed** → Rules doğru
- ❌ **Simulated read: Denied** → Rules yanlış yapılandırılmış

---

## 🎯 YÖNTEM 5: Manuel Path Kontrolü

Firestore Console'da koleksiyonları kontrol edin:

1. Firestore Database → **"Data"** sekmesi
2. Şu yolu kontrol edin:

```
users
└── {your-user-id}
    └── flashcard-sets
        └── {set-id}
            └── flashcards
                └── {card-id}
```

**Eksik bir seviye varsa:**
- Uygulama yanlış path kullanıyor olabilir
- Kod tarafında path düzeltmesi gerekebilir

---

## 💡 YÖNTEM 6: Cache Temizleme

Bazen browser cache probleme neden olabilir:

1. **Tamamen çıkış yapın** (Sign Out)
2. **Browser cache'i temizleyin**:
   - Chrome: Ctrl+Shift+Delete
   - "Cached images and files" seçin
   - "Clear data"
3. **Hard refresh yapın**:
   - Windows/Linux: Ctrl+Shift+R
   - Mac: Cmd+Shift+R
4. **Incognito/Private modda** test edin
5. **Tekrar giriş yapın**

---

## 📊 Sorun Giderme Tablosu

| Hata Mesajı | Olası Sebep | Çözüm |
|-------------|-------------|-------|
| `Missing or insufficient permissions` | Rules deploy edilmedi | Yöntem 1 veya 2 |
| `PERMISSION_DENIED` | Rules yanlış | Yöntem 4 - Simulator |
| `UNAUTHENTICATED` | Giriş yapılmamış | Yöntem 3 |
| `NOT_FOUND` | Collection yok | Yöntem 5 - Path kontrolü |
| `Error 403` | Rules deny ediyor | Yöntem 1 - Test rules |

---

## 🔧 Son Çare: CLI ile Deploy

Eğer Console'dan publish çalışmıyorsa:

```bash
# Firebase CLI kur
npm install -g firebase-tools

# Login
firebase login

# Proje seç
firebase use my-yds

# Rules deploy et
firebase deploy --only firestore:rules

# Tüm deploy
firebase deploy
```

---

## ✅ Başarı Kontrolü

Rules doğru deploy edildikten sonra:

1. ✅ Console'da error görmemeli
2. ✅ Excel yükleyebilmeli
3. ✅ Eski flashcard'ları görmeli
4. ✅ Quiz progress kaydedilmeli

Test için:
```javascript
// Console'da çalıştır
fetch('https://firestore.googleapis.com/v1/projects/my-yds/databases/(default)/documents/users')
  .then(r => r.json())
  .then(console.log)
```

---

## 📞 Hala Çalışmıyor mu?

1. **Firebase Status**: https://status.firebase.google.com
2. **Browser console'da tam hata mesajını** kopyalayın
3. **Network tab'de failed request'in Response'unu** kontrol edin
4. **Firestore Data tab'de** collection'ların olup olmadığını kontrol edin

---

## 🚀 Production'a Geçiş

Test rules çalıştıktan sonra mutlaka production rules'a dönün!

**Asla production'da bırakmayın:**
```javascript
allow read, write: if true;  // ❌ VERY DANGEROUS
allow read, write: if request.auth != null;  // ⚠️ Test için OK, prod için riskli
```

**Production için kullanın:**
```javascript
allow read, write: if request.auth != null && request.auth.uid == userId;  // ✅ GÜVENLİ
```

---

## 📝 Son Notlar

- Rules deploy **5-10 saniye** içinde aktif olur
- **Yayınlamadan** önce simulator ile test edin
- **Her zaman backup** alın (Export data)
- **Version control** için rules'ı Git'e commit edin
