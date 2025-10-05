'use client';
import WordList from '@/components/WordList';
import Quiz from '@/components/Quiz';
import { vocabulary } from '@/data/vocabulary';
import { quizData } from '@/data/quizData';
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Replace the import using path alias
const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });

export default function PhrasalVerbs2() {
 const [showQuiz, setShowQuiz] = useState(false);
 const [score, setScore] = useState<number | null>(null);
 const { colors } = useTheme();
 const { user } = useAuth(); // Kullanıcı durumunu al

 // Kategori ID'si ve soruları
 const categoryId = 'phrasal2';
 const questionCount = quizData.phrasal_verbs2.length;
 
 // Sayfa için SEO ve yapısal veri ekleme
 useEffect(() => {
   const script = document.createElement('script');
   script.type = 'application/ld+json';
   script.innerHTML = JSON.stringify({
     '@context': 'https://schema.org',
     '@type': 'WebPage',
     'name': 'YDS Fiil Öbekleri (Phrasal Verbs) Kelime Listesi',
     'description': 'YDS sınavı için önemli fiil öbekleri (phrasal verbs) içeren kapsamlı liste ve testler.',
     'url': 'https://my-yds.web.app/phrasal2',
   });
   document.head.appendChild(script);

   return () => {
     document.head.removeChild(script);
   };
 }, []);

 return (
   <div className="min-h-screen pb-16" style={{ backgroundColor: colors.background }}>
     
     <div className="max-w-4xl mx-auto px-4 py-8">
       {/* Sayfa Başlığı */}
       <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center" style={{ color: colors.text }}>
         Fiil Öbekleri 2
       </h1>
       
       {/* Kategori Açıklaması */}
       <div className="rounded-lg shadow-md p-4 mb-6" style={{ backgroundColor: colors.cardBackground, marginBottom: '1.5rem' }}>
         <p style={{ color: colors.text }} className="text-base mb-3">
           Fiil öbekleri (phrasal verbs), İngilizce&apos;de bir fiil ve bir veya daha fazla edattan oluşan ve genellikle farklı bir anlam oluşturan ifadelerdir. 
           YDS sınavında metin içerisindeki anlam bütünlüğünü kavramak ve doğru çeviri yapabilmek için bu ifadeleri bilmek çok önemlidir.
         </p>
         <p style={{ color: colors.text }} className="text-sm">
           Bu kategoride toplam <strong>{vocabulary.phrasal_verbs2.length}</strong> kelime ve <strong>{questionCount}</strong> test sorusu bulunmaktadır.
         </p>
         
         {/* Kullanıcı giriş yapmışsa bilgilendirme mesajı */}
         {user && (
           <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${colors.accent}20`, color: colors.text }}>
             <p className="text-sm">
               İlerlemeniz otomatik olarak kaydedilmektedir. Çalıştığınız kelimeler ve test sonuçlarınız profil sayfanızda görüntülenebilir.
             </p>
           </div>
         )}
         
         {/* Kullanıcı giriş yapmamışsa giriş yapma önerisi */}
         {!user && (
           <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${colors.accent}20`, color: colors.text }}>
             <p className="text-sm">
               İlerlemenizi kaydetmek için <Link href="/login" className="underline">giriş yapın</Link> veya <Link href="/register" className="underline">kayıt olun</Link>.
             </p>
           </div>
         )}
       </div>

       {/* Mod Seçimi */}
       <div className="flex justify-center space-x-4 mb-6">
         <button
           onClick={() => setShowQuiz(false)}
           className="px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-300"
           style={{ 
             backgroundColor: !showQuiz ? colors.accent : colors.cardBackground,
             color: colors.text 
           }}
         >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
             <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c-1.255 0-2.443.29-3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
           </svg>
           Kelime Listesi
         </button>
         <button
           onClick={() => setShowQuiz(true)}
           className="px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-300"
           style={{ 
             backgroundColor: showQuiz ? colors.accent : colors.cardBackground,
             color: colors.text 
           }}
         >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
           </svg>
           Test
         </button>
       </div>

       {showQuiz ? (
         <div>
           {/* Test açıklaması */}
           <div className="rounded-lg shadow-md p-4 mb-6" style={{ backgroundColor: colors.cardBackground }}>
             <p style={{ color: colors.text }} className="text-sm">
               Bu test, Fiil Öbekleri 2 kategorisinden {questionCount} soru içermektedir.
             </p>
           </div>
           
           <Quiz
              questions={quizData.phrasal_verbs2}
              categoryWords={vocabulary.phrasal_verbs2}
              categoryId={categoryId} // Bu satırı ekleyin
              onQuizComplete={setScore}
            />
         </div>
       ) : (
         <WordList 
           words={vocabulary.phrasal_verbs2} 
           categoryId={categoryId} // Kategori ID'sini ekleyin
         />
       )}

       {score !== null && (
         <div className="text-center mt-8 p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.cardBackground }}>
           <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
             Test Sonucu
           </h2>
           <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 mx-auto" style={{ backgroundColor: colors.accent }}>
             <span className="text-2xl font-bold" style={{ color: colors.text }}>%{Math.round((score / questionCount) * 100)}</span>
           </div>
           <p style={{ color: colors.text }}>
             Toplam Doğru: {score} / {questionCount}
           </p>
           <button
             onClick={() => setScore(null)}
             className="mt-4 px-6 py-2 rounded-lg hover:bg-opacity-90 transition duration-300"
             style={{ backgroundColor: colors.accent, color: colors.text }}
           >
             Tekrar Dene
           </button>
         </div>
       )}
       
       {/* Kategori Hakkında Ek Bilgi */}
       {!showQuiz && (
         <div className="rounded-lg shadow-md p-4 mb-6" style={{ backgroundColor: colors.cardBackground, marginTop: '2rem' }}>
           <h3 className="text-lg font-semibold mb-3" style={{ color: colors.text }}>
             YDS&apos;de Fiil Öbeklerinin Önemi
           </h3>
           <p style={{ color: colors.text }} className="mb-3">
             Fiil öbekleri (phrasal verbs), YDS sınavında çoğunlukla anlam ve çeviri sorularında karşınıza çıkar. Bu ifadelerin anlamlarını bilmek, 
             metindeki bağlamı doğru anlamanızı ve doğru cevabı bulmanızı sağlar.
           </p>
           <p style={{ color: colors.text }}>
             Fiil öbeklerini öğrenirken, sadece anlamlarını ezberlemek yerine örnek cümleler içinde kullanımlarını görmek ve bu şekilde çalışmak 
             daha etkilidir. Ayrıca, aynı fiilin farklı edatlarla oluşturduğu farklı anlamları karşılaştırarak öğrenmek 
             (ör. take off, take on, take up) kalıcı öğrenmeyi destekler.
           </p>
         </div>
       )}
     </div>
     
     <ClientOnlyAd 
       slot="phrasal2-footer"
       format="auto"
       className="my-4 mx-auto"
     />
   </div>
 );
}