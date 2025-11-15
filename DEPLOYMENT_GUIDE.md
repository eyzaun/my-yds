# Version Management Guide

## Simple Version Tracking

Bu projede version takibi çok basittir - sadece **buildNumber** kontrol edilir.

### Nasıl Çalışır?

```
1. Uygulama yüklenir
2. /public/app-version.json dosyasından currentVersion alınır
3. 30 dakikada bir kontrol yapılır
4. Eğer yeni bir versiyon çıkmışsa UpdateModal gösterilir
5. Kullanıcı "Şimdi Güncelle" veya "Daha Sonra" seçer
```

### Versiyon Güncellemesi

**Tek yapmanız gereken**: `public/app-version.json` dosyasında `buildNumber` artırmak

```json
{
  "buildNumber": 1  // Bunu 2, 3, 4... şeklinde artırın
}
```

### Adımlar

1. **Değişiklik yapın ve test edin**
   ```bash
   npm run dev
   ```

2. **Build edin**
   ```bash
   npm run build
   ```

3. **buildNumber artırın** (public/app-version.json)
   ```json
   // Değiştir:
   "buildNumber": 1

   // Yapı:
   "buildNumber": 2
   ```

4. **Deploy edin**
   ```bash
   npm run deploy
   ```

5. **Test edin** (farklı browser/device)
   - Eski cache'li sayfaya girin
   - UpdateModal otomatik görünecek
   - "Şimdi Güncelle" tıklayın

### Örnek Workflow

```
Build #1 → production
   ↓
Yeni özellik ekle
   ↓
npm run build
   ↓
public/app-version.json'da buildNumber: 1 → 2
   ↓
npm run deploy
   ↓
Eski versiyondan açan kullanıcılar güncelleme isteği görür
```

### Important Files

- `public/app-version.json` - Güncel version bilgisi (sadece buildNumber)
- `src/contexts/VersionContext.tsx` - Version kontrol mantığı
- `src/components/UpdateModal.tsx` - Güncelleme UI

### Güvenlik Kuralları

Firestore security rules `firestore.rules` dosyasında tanımlanmıştır:
- ✅ appConfig/version dokümantı herkese açık (read)
- ❌ Yazma işlemi yasaklı (sadece admin SDK)

Rules zaten deployed. Değiştirmek için:
```bash
firebase deploy --only firestore:rules
```

## Q&A

**S: Firestore'a neden ihtiyaç var?**
A: Şu anki kurulumda ihtiyaç yok. Sadece `public/app-version.json` kullanılıyor.

**S: Cache problemi varsa?**
A: UpdateModal otomatik cache temizler ve sayfayı yeniler.

**S: Mobil/Desktop farklı davranır mı?**
A: UpdateModal ikisinde de aynı şekilde çalışır. Responsive tasarım vardır.

**S: Zorunlu güncelleme yapabilir miyim?**
A: Şu anki haliyle hayır. Yapılmak istiyorsa VersionContext'e `forceUpdate` mantığı eklenebilir.

---

**Kısaca:** Yeni version için sadece `buildNumber`'ı artırın ve deploy edin! 🚀
