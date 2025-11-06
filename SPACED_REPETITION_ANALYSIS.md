# 📚 SPACED REPETITION SİSTEMİ - DETAYLI ANALİZ

## 🎯 SİSTEM GENEL BAKIŞ

Spaced Repetition sistemi, quiz modunda çalışan kelimeleri otomatik olarak takip edip, bilimsel olarak kanıtlanmış SM-2 algoritması ile optimal zamanlarda tekrar için sunan bir sistemdir.

---

## ✅ BAŞARIYLA UYGULANMIŞ KISI

MLAR

### 1. **Core Algorithm & Types** ✅
- ✅ `src/types/spacedRepetition.ts` - Tüm tip tanımlamaları
- ✅ `src/lib/spacedRepetition.ts` - SM-2 algoritması implementasyonu
- ✅ `src/lib/firebase/spacedRepetition.ts` - Firebase operations

### 2. **Dedicated Pages** ✅
- ✅ `/spaced-repetition` - Ana dashboard sayfası
- ✅ `/spaced-repetition/review` - Tekrar sayfası (FlashcardDeck ile entegre)

### 3. **FlashcardDeck Integration** ✅
- ✅ `QuizMode.tsx` - Tracking entegrasyonu eklendi
- ✅ `FlashcardDeck.tsx` - Props güncellendi (categoryName, cardType)
- ✅ `FlashcardMobileView.tsx` - Props güncellendi

### 4. **Navigation** ✅
- ✅ NavigationBar'a "📚 Aralıklı Tekrar" linki eklendi

---

## ❌ ÖNEMLİ SORUNLAR TESPIT EDİLDİ

### SORUN 1: Kategori Sayfaları - Quiz Tracking YOK ❌

**Durum:**
- Tüm kategori sayfaları (business, abstract, nature, vb.) `WordList` komponenti kullanıyor
- `WordList`'te **quiz modu yok**, sadece kart görünümü var
- Dolayısıyla **kategori kelimelerinde spaced repetition tracking çalışmıyor**

**Etkilenen Sayfalar:**
```
src/app/business/page.tsx
src/app/abstract/page.tsx
src/app/nature/page.tsx
src/app/academic-terms/page.tsx
src/app/social-sciences/page.tsx
src/app/official/page.tsx
src/app/conjunctions/page.tsx
src/app/phrasal/page.tsx
src/app/phrasal2/page.tsx
```

**Çözüm Gerekliliği:** 🔴 KRİTİK
- Bu sayfalar `Quiz` komponenti kullanıyor ancak Quiz komponenti **ayrı bir component** ve tracking'i yok
- WordList'te quiz modu olmadığı için FlashcardDeck ve QuizMode entegrasyonu yapılamıyor

---

### SORUN 2: Upload-Flashcards Sayfası - Tracking YOK ❌

**Durum:**
- `src/app/upload-flashcards/page.tsx` kendi `FlashcardViewer` komponenti kullanıyor
- Bu viewer **FlashcardDeck kullanmıyor**
- Dolayısıyla **custom flashcard'larda spaced repetition tracking çalışmıyor**

**Çözüm Gerekliliği:** 🔴 KRİTİK
- FlashcardViewer'ı FlashcardDeck kullanacak şekilde güncelle
- Veya FlashcardViewer'a da QuizMode tracking ekle

---

### SORUN 3: Quiz Komponenti - Tracking YOK ❌

**Durum:**
- `src/components/Quiz.tsx` ayrı bir quiz komponenti
- Kategori sayfalarında kullanılıyor
- Bu komponent **spaced repetition tracking'e entegre değil**

**Çözüm Gerekliliği:** 🟡 ORTA
- Quiz komponenti kategori testleri için kullanılıyor
- Ama biz FlashCard quiz modunu tracking için kullanıyoruz
- İki ayrı quiz sistemi var ve birbirleriyle bağlantısız

---

## 🔧 ŞU ANDA ÇALIŞAN KISIMLAR

### ✅ SADECE `/spaced-repetition/review` Sayfası Tam Çalışıyor

**Neden Çalışıyor:**
1. Bu sayfa `FlashcardDeck` kullanıyor
2. FlashcardDeck içinde `QuizMode` var
3. QuizMode içinde `saveQuizResult` çağrılıyor
4. Quiz sonuçları Firebase'e kaydediliyor

**Test Senaryosu:**
```
1. /spaced-repetition/review sayfasına git
2. Quiz modunu aç
3. Kelimeleri cevapla
4. Her cevap sonrası Firebase'de şu dokümana yazılır:
   - spacedRepetitionCards/{cardId}
   - dailyStatistics/{userId}_{date}
```

---

## 📊 SPACED REPETITION SİSTEMİ NASIL ÇALIŞIR?

### **Şu Anki Durum:**

#### 1. **Tracking Aktif Olduğu Durumlar:**
- ✅ `/spaced-repetition/review` sayfasında quiz çözülürse
- ❌ Kategori sayfalarında quiz çözülürse (WordList quiz yok, Quiz komponenti tracking'siz)
- ❌ Upload-flashcards sayfasında quiz çözülürse (FlashcardViewer tracking'siz)

#### 2. **Veri Akışı (Sadece /review için):**

```
Kullanıcı Quiz'de Kelimeyi Cevaplar
          ↓
QuizMode.tsx - handleSubmit()
          ↓
saveQuizResult() çağrılır
          ↓
Firebase'e kaydedilir:
  - spacedRepetitionCards/{cardId}
    • SM-2 parametreleri güncellenir
    • nextReviewDate hesaplanır
  - dailyStatistics/{userId}_{date}
    • Günlük istatistikler güncellenir
```

#### 3. **Firebase Schema:**

**Collection: `spacedRepetitionCards`**
```javascript
{
  id: "userId_type_word" // veya "userId_type_categoryId_word"
  userId: "user123"
  type: "custom" | "category"
  word: "abandon"
  translation: "terk etmek"
  categoryId: "business" // category type için
  categoryName: "İşletme ve Ekonomi"

  // SM-2 Parameters
  easeFactor: 2.5  // 1.3 - ∞
  interval: 1      // gün cinsinden
  repetitions: 0   // arka arkaya doğru sayısı

  // Dates
  nextReviewDate: Timestamp
  lastReviewDate: Timestamp
  createdAt: Timestamp

  // Stats
  totalReviews: 3
  correctCount: 2
  incorrectCount: 1
}
```

**Collection: `dailyStatistics`**
```javascript
{
  id: "user123_2025-01-15"
  date: "2025-01-15"
  userId: "user123"
  reviewedCards: 20
  correctAnswers: 15
  incorrectAnswers: 5
  studyTime: 0
  customCardsReviewed: 10
  categoryCardsReviewed: 10
  timestamp: Timestamp
}
```

---

## 🧮 SM-2 ALGORİTMASI DETAYLI

### **Nasıl Çalışır:**

```javascript
// 1. Kullanıcı cevap verir
const isCorrect = userAnswer === correctAnswer;

// 2. Quality belirlenir
const quality = isCorrect ? 4 : 0;  // 0-5 arası

// 3. Ease Factor güncellenir
newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
if (newEaseFactor < 1.3) newEaseFactor = 1.3;

// 4. Interval ve Repetitions güncellenir
if (quality < 3) {
  // Yanlış cevap
  newRepetitions = 0;
  newInterval = 1;
} else {
  // Doğru cevap
  newRepetitions = repetitions + 1;

  if (newRepetitions === 1) {
    newInterval = 1;      // İlk doğru: 1 gün sonra
  } else if (newRepetitions === 2) {
    newInterval = 6;      // İkinci doğru: 6 gün sonra
  } else {
    newInterval = Math.round(interval * newEaseFactor);
  }
}

// 5. Sonraki tekrar tarihi hesaplanır
nextReviewDate = today + newInterval;
```

### **Örnek Senaryo:**

```
Kelime: "abandon" (terk etmek)

1. Kullanıcı ilk kez doğru cevap veriyor:
   - easeFactor: 2.5
   - interval: 1 gün
   - repetitions: 1
   - nextReviewDate: Yarın

2. Yarın tekrar doğru cevap veriyor:
   - easeFactor: 2.5
   - interval: 6 gün
   - repetitions: 2
   - nextReviewDate: 6 gün sonra

3. 6 gün sonra tekrar doğru cevap veriyor:
   - easeFactor: 2.5
   - interval: 15 gün (6 * 2.5)
   - repetitions: 3
   - nextReviewDate: 15 gün sonra

4. 15 gün sonra YANLIŞ cevap veriyor:
   - easeFactor: 2.2 (azaldı)
   - interval: 1 gün (sıfırlandı)
   - repetitions: 0 (sıfırlandı)
   - nextReviewDate: Yarın
```

---

## 🎯 KART DURUMLARI

Kartlar 3 kategoriye ayrılır:

### 1. **Yeni (New)** 🆕
- `repetitions === 0`
- Henüz hiç doğru cevaplanmamış
- Veya son cevap yanlış olduğu için sıfırlanmış

### 2. **Öğreniliyor (Learning)** 📖
- `0 < repetitions < 5`
- Arka arkaya 1-4 kez doğru cevaplanmış
- Hala öğrenme aşamasında

### 3. **Ustalaşıldı (Mastered)** 🎓
- `repetitions >= 5`
- Arka arkaya 5+ kez doğru cevaplanmış
- Artık uzun aralıklarla tekrar ediliyor

---

## 📈 DASHBOARD ÖZELLİKLERİ

### **Ana Sayfa (`/spaced-repetition`):**

**Gösterilen İstatistikler:**
1. 🔥 Bugün Tekrar Edilecek - `dueToday`
2. ✅ Bugün Tamamlanan - `completedToday`
3. 📊 Toplam Kart - `totalCards`
4. 🏆 Günlük Seri - `currentStreak`

**İlerleme Göstergeleri:**
- Yeni Kartlar (Mavi)
- Öğreniliyor (Sarı)
- Ustalaşıldı (Yeşil)
- Genel Doğruluk Oranı (%)

**Kategori İlerlemeleri:**
Her kategori için:
- Toplam kelime sayısı
- Öğrenilen kelime sayısı
- Doğruluk oranı
- Son çalışma tarihi

---

## 🚨 ÇÖZÜLMESI GEREKEN SORUNLAR

### Öncelik 1: 🔴 Kategori Sayfalarını Düzelt

**Seçenek A - Quiz Komponenti Entegrasyonu:**
- Quiz.tsx'e spaced repetition tracking ekle
- Her doğru/yanlış cevap sonrası saveQuizResult çağır

**Seçenek B - WordList'e Quiz Modu Ekle:**
- WordList içine QuizMode entegre et
- FlashCard ile aynı mantıkta çalışsın

**Seçenek C - Quiz Yerine FlashCard Kullan:**
- Kategori sayfalarını FlashcardDeck kullanacak şekilde değiştir
- Quiz butonuna tıklayınca FlashcardDeck quiz modu açılsın

### Öncelik 2: 🔴 Upload-Flashcards Sayfasını Düzelt

**Seçenek A - FlashcardViewer'ı Güncelle:**
- FlashcardViewer içindeki quiz mantığına tracking ekle
- saveQuizResult çağır

**Seçenek B - FlashcardDeck Kullan:**
- FlashcardViewer yerine FlashcardDeck kullan
- Daha tutarlı bir yapı olur

### Öncelik 3: 🟡 Firebase Index Oluştur

Firestore'da query performansı için index'ler gerekebilir:
```
Collection: spacedRepetitionCards
Indexes:
- userId (Ascending) + nextReviewDate (Ascending)
- userId (Ascending) + type (Ascending)
```

---

## ✅ ÖNERİLEN ÇÖZÜM PLANI

### Adım 1: Quiz.tsx'e Tracking Ekle
```typescript
// src/components/Quiz.tsx içinde
import { saveQuizResult } from '@/lib/firebase/spacedRepetition';
import { useAuth } from '@/contexts/AuthContext';

// Quiz cevap kontrolünde:
if (user && categoryId) {
  await saveQuizResult(
    user.uid,
    'category',
    question.word, // kelimenin İngilizce hali
    getCategoryWordTranslation(question.word), // Türkçe karşılığı
    isCorrect,
    categoryId,
    categoryName
  );
}
```

### Adım 2: Upload-Flashcards'ı FlashcardDeck'e Geçir
```typescript
// FlashcardViewer yerine:
<FlashcardDeck
  flashcards={flashcards}
  categoryId="custom"
  categoryName={setName}
  cardType="custom"
  quizMode={viewerQuizMode}
/>
```

### Adım 3: Test Et
1. Kategori sayfasında quiz çöz
2. Upload-flashcards'da quiz çöz
3. Firebase'de verilerin kaydedildiğini kontrol et
4. /spaced-repetition sayfasında istatistiklerin güncellendiğini gör

---

## 📝 KULLANICI İÇİN KILAVUZ

### **Spaced Repetition Nasıl Kullanılır?**

#### 1. Kelime Çalışın
- Herhangi bir kategoriye gidin (örn: /business)
- Quiz modunu açın
- Kelimeleri cevaplayan (**ŞU AN ÇALIŞMIYOR - DÜZELTİLECEK**)

VEYA

- Kendi flashcard'larınızı yükleyin
- Quiz modunda çalışın (**ŞU AN ÇALIŞMIYOR - DÜZELTİLECEK**)

#### 2. Aralıklı Tekrar Sayfasına Gidin
- Menüden "📚 Aralıklı Tekrar" seçin
- Dashboard'da ilerlemenizi görün
- "Bugünkü Kelimeleri Tekrar Et" butonuna tıklayın

#### 3. Günlük Tekrarlarınızı Yapın
- Her gün /spaced-repetition/review sayfasına gidin
- Bugün tekrar edilmesi gereken kartları çözün
- İlerlemeni takip edin

---

## 🎯 SONUÇ

**Mevcut Durum:**
- ✅ SM-2 algoritması ve Firebase entegrasyonu tam çalışıyor
- ✅ Dashboard ve review sayfası tam çalışıyor
- ❌ Kategori sayfalarında tracking yok (önemli)
- ❌ Upload-flashcards'da tracking yok (önemli)

**Düzeltme Sonrası:**
- ✅ Tüm sayfalarda quiz çözülürken otomatik tracking
- ✅ Tam fonksiyonel spaced repetition sistemi
- ✅ Kullanıcılar her yerden kelime çalışabilir ve takip edilir

---

**Son Güncelleme:** 2025-01-15
**Durum:** Kısmen Çalışıyor - Düzeltme Gerekli
**Öncelik:** 🔴 YÜKSEK
