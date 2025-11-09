'use client';
import WordList from '@/components/WordList';
import Quiz from '@/components/Quiz';
import { vocabulary } from '@/data/vocabulary';
import { quizData } from '@/data/quizData';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Container } from '@/components/design-system/Container';
import { Card } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { Heading1, Heading3, Text } from '@/components/design-system/Typography';
import { useDesignTokens } from '@/hooks/useDesignTokens';

// Replace the import using path alias
const ClientOnlyAd = dynamic(() => import('../../components/ClientOnlyAd'), { ssr: false });

export default function PhrasalVerbs2() {
  const designTokens = useDesignTokens();
 const [showQuiz, setShowQuiz] = useState(false);
 const [score, setScore] = useState<number | null>(null);
 const { user } = useAuth(); // Kullanıcı durumunu al

 // Kategori ID'si, ismi ve soruları
 const categoryId = 'phrasal2';
 const categoryName = 'Fiil Öbekleri 2';
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
   <div className="min-h-screen pb-16" style={{ backgroundColor: designTokens.colors.background.primary }}>

     <Container maxWidth="lg" className="py-8">
       {/* Sayfa Başlığı */}
       <Heading1 className="text-2xl md:text-3xl mb-6 text-center">
         Fiil Öbekleri 2
       </Heading1>
       
       {/* Kategori Açıklaması */}
       <Card variant="elevated" className="mb-6">
         <Text className="mb-3">
           Fiil öbekleri (phrasal verbs), İngilizce&apos;de bir fiil ve bir veya daha fazla edattan oluşan ve genellikle farklı bir anlam oluşturan ifadelerdir.
           YDS sınavında metin içerisindeki anlam bütünlüğünü kavramak ve doğru çeviri yapabilmek için bu ifadeleri bilmek çok önemlidir.
         </Text>
         <Text style={{ fontSize: designTokens.typography.fontSize.sm }}>
           Bu kategoride toplam <strong>{vocabulary.phrasal_verbs2.length}</strong> kelime ve <strong>{questionCount}</strong> test sorusu bulunmaktadır.
         </Text>

         {/* Kullanıcı giriş yapmışsa bilgilendirme mesajı */}
         {user && (
           <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${designTokens.colors.primary[600]}20` }}>
             <Text style={{ fontSize: designTokens.typography.fontSize.sm }}>
               İlerlemeniz otomatik olarak kaydedilmektedir. Çalıştığınız kelimeler ve test sonuçlarınız profil sayfanızda görüntülenebilir.
             </Text>
           </div>
         )}

         {/* Kullanıcı giriş yapmamışsa giriş yapma önerisi */}
         {!user && (
           <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${designTokens.colors.primary[600]}20` }}>
             <Text style={{ fontSize: designTokens.typography.fontSize.sm }}>
               İlerlemenizi kaydetmek için <Link href="/login" className="underline">giriş yapın</Link> veya <Link href="/register" className="underline">kayıt olun</Link>.
             </Text>
           </div>
         )}
       </Card>

       {/* Mod Seçimi */}
       <div className="flex justify-center space-x-4 mb-6">
         <Button
           onClick={() => setShowQuiz(false)}
           variant={!showQuiz ? 'primary' : 'secondary'}
           size="sm"
         >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
             <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c-1.255 0-2.443.29-3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
           </svg>
           Kelime Listesi
         </Button>
         <Button
           onClick={() => setShowQuiz(true)}
           variant={showQuiz ? 'primary' : 'secondary'}
           size="sm"
         >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
           </svg>
           Test
         </Button>
       </div>

       {showQuiz ? (
         <div>
           {/* Test açıklaması */}
           <Card variant="elevated" className="mb-6">
             <Text style={{ fontSize: designTokens.typography.fontSize.sm }}>
               Bu test, Fiil Öbekleri 2 kategorisinden {questionCount} soru içermektedir.
             </Text>
           </Card>
           
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
           categoryId={categoryId}
           categoryName={categoryName}
         />
       )}

       {score !== null && (
         <Card variant="elevated" className="text-center mt-8">
           <Heading3 className="mb-4">
             Test Sonucu
           </Heading3>
           <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 mx-auto" style={{ backgroundColor: designTokens.colors.primary[600] }}>
             <span className="text-2xl font-bold" style={{ color: designTokens.colors.text.inverse }}>%{Math.round((score / questionCount) * 100)}</span>
           </div>
           <Text>
             Toplam Doğru: {score} / {questionCount}
           </Text>
           <Button
             onClick={() => setScore(null)}
             variant="primary"
             className="mt-4"
           >
             Tekrar Dene
           </Button>
         </Card>
       )}
       
       {/* Kategori Hakkında Ek Bilgi */}
       {!showQuiz && (
         <Card variant="elevated" className="mt-8">
           <Heading3 className="mb-3">
             YDS&apos;de Fiil Öbeklerinin Önemi
           </Heading3>
           <Text className="mb-3">
             Fiil öbekleri (phrasal verbs), YDS sınavında çoğunlukla anlam ve çeviri sorularında karşınıza çıkar. Bu ifadelerin anlamlarını bilmek,
             metindeki bağlamı doğru anlamanızı ve doğru cevabı bulmanızı sağlar.
           </Text>
           <Text>
             Fiil öbeklerini öğrenirken, sadece anlamlarını ezberlemek yerine örnek cümleler içinde kullanımlarını görmek ve bu şekilde çalışmak
             daha etkilidir. Ayrıca, aynı fiilin farklı edatlarla oluşturduğu farklı anlamları karşılaştırarak öğrenmek
             (ör. take off, take on, take up) kalıcı öğrenmeyi destekler.
           </Text>
         </Card>
       )}
     </Container>
     
     <ClientOnlyAd 
       slot="phrasal2-footer"
       format="auto"
       className="my-4 mx-auto"
     />
   </div>
 );
}
