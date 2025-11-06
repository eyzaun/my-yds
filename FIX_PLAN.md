# 🔧 SPACED REPETITION - TAM ÇÖZÜM PLANI

## 🎯 HEDEF
Tüm sayfalarda quiz/flashcard çalışması sırasında spaced repetition tracking'in otomatik olarak çalışmasını sağlamak.

---

## 📋 AŞAMALAR

### AŞAMA 1: Quiz.tsx Komponenti - Tracking Ekleme ✅
**Dosya:** `src/components/Quiz.tsx`

**Yapılacaklar:**
1. useAuth hook'u ekle
2. saveQuizResult import et
3. Her soru cevaplandığında tracking kaydet
4. categoryId ve categoryName props ekle
5. Kelime çevirisini vocabulary'den al

**Kod Değişiklikleri:**
```typescript
// Import ekle
import { useAuth } from '@/contexts/AuthContext';
import { saveQuizResult } from '@/lib/firebase/spacedRepetition';

// Props'a ekle
interface QuizProps {
  // ... mevcut props
  categoryId: string;
  categoryName?: string;
}

// Quiz cevap kontrolünde
const handleAnswer = async () => {
  // Mevcut cevap kontrolü
  const isCorrect = selectedOption === currentQuestion.correctAnswer;

  // Spaced Repetition Tracking
  if (user && categoryId) {
    const word = currentQuestion.word;
    const translation = categoryWords.find(w => w.en === word)?.tr || '';

    await saveQuizResult(
      user.uid,
      'category',
      word,
      translation,
      isCorrect,
      categoryId,
      categoryName
    );
  }

  // ... geriye kalan kod
};
```

---

### AŞAMA 2: Upload-Flashcards - FlashcardDeck'e Geçiş ✅
**Dosya:** `src/app/upload-flashcards/page.tsx`

**Yapılacaklar:**
1. FlashcardViewer komponentini kaldır
2. FlashcardDeck import et
3. State'leri güncelle
4. FlashcardDeck'e geçiş yap

**Kod Değişiklikleri:**
```typescript
// Import ekle
import FlashcardDeck from '@/components/flashcards/FlashcardDeck';

// FlashcardViewer yerine FlashcardDeck kullan
{showViewer && flashcards.length > 0 && (
  <FlashcardDeck
    flashcards={flashcards}
    categoryId={`custom-${setName}`}
    categoryName={setName}
    cardType="custom"
    quizMode={viewerQuizMode}
    onReset={() => {
      setShowViewer(false);
      setFlashcards([]);
      setSetName('');
    }}
  />
)}
```

---

### AŞAMA 3: Kategori Sayfaları - Props Güncelleme ✅
**Dosyalar:** Tüm kategori sayfaları (9 adet)

**Yapılacaklar:**
1. Quiz komponentine categoryName prop'u ekle
2. categoryName değişkenini tanımla

**Kod Değişiklikleri:**
```typescript
// Her kategori sayfasında
const categoryName = 'İşletme ve Ekonomi'; // Kategoriye göre değişir

<Quiz
  questions={quizData.business_and_economy}
  categoryWords={vocabulary.business_and_economy}
  categoryId={categoryId}
  categoryName={categoryName} // EKLE
  onQuizComplete={setScore}
/>
```

---

### AŞAMA 4: Test ve Doğrulama ✅

**Test Senaryoları:**
1. Kategori sayfasında quiz çöz → Firebase'de kayıt var mı?
2. Upload-flashcards'da quiz çöz → Firebase'de kayıt var mı?
3. /spaced-repetition dashboard → İstatistikler güncellendi mi?
4. /spaced-repetition/review → Kartlar doğru mu?

---

## 📁 GÜNCELLENECEK DOSYALAR

### 1. Core Component
- [ ] `src/components/Quiz.tsx` - Tracking ekle

### 2. Upload-Flashcards
- [ ] `src/app/upload-flashcards/page.tsx` - FlashcardDeck'e geç

### 3. Kategori Sayfaları (9 adet)
- [ ] `src/app/business/page.tsx`
- [ ] `src/app/abstract/page.tsx`
- [ ] `src/app/nature/page.tsx`
- [ ] `src/app/academic-terms/page.tsx`
- [ ] `src/app/social-sciences/page.tsx`
- [ ] `src/app/official/page.tsx`
- [ ] `src/app/conjunctions/page.tsx`
- [ ] `src/app/phrasal/page.tsx`
- [ ] `src/app/phrasal2/page.tsx`

**Toplam:** 11 dosya güncellenecek

---

## ✅ BAŞARI KRİTERLERİ

1. ✅ Kategori sayfalarında quiz çözülürken Firebase'e veri kaydediliyor
2. ✅ Upload-flashcards'da quiz çözülürken Firebase'e veri kaydediliyor
3. ✅ /spaced-repetition dashboard doğru istatistikleri gösteriyor
4. ✅ /spaced-repetition/review doğru kartları gösteriyor
5. ✅ SM-2 algoritması doğru çalışıyor
6. ✅ Günlük istatistikler doğru

---

## 🚀 UYGULAMA SIRASI

1. Quiz.tsx → Tracking ekle
2. Test et (bir kategori sayfasında)
3. Upload-flashcards → FlashcardDeck'e geç
4. Test et
5. Tüm kategori sayfalarını güncelle
6. Final test
7. Commit & Push
8. Dokümantasyon

---

**Tahmini Süre:** 45-60 dakika
**Öncelik:** 🔴 KRİTİK
