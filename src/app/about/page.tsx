'use client';
import { useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function About() {
  const { colors } = useTheme();
  
  // Sayfa için SEO ve yapısal veri ekleme
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      'name': 'YDS Kelime Listesi Hakkında',
      'description': 'YDS Kelime Listesi projesi hakkında bilgiler, site amacı ve misyonu.',
      'url': 'https://my-yds.web.app/about',
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: colors.background }}>
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center" style={{ color: colors.text }}>
          Hakkımızda
        </h1>

        <div className="space-y-6 mt-8">
          <section className="p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.cardBackground }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              Proje Hakkında
            </h2>
            <p className="mb-3" style={{ color: colors.text }}>
              YDS Kelime Listesi, YDS sınavına hazırlanan bireyler için geliştirilmiş etkili bir kelime öğrenme 
              platformudur. Bu proje, sınav hazırlık sürecindeki kişisel deneyimlerimden yola çıkarak, kelime öğrenmeyi 
              daha sistematik ve verimli hale getirmek amacıyla oluşturulmuştur.
            </p>
            <p style={{ color: colors.text }}>
              Platformda yer alan kelimeler YDS sınavında sıkça karşılaşılan 8 farklı kategoride düzenlenmiştir. 
              Bu kategorik yaklaşım, kelimeleri bağlamlarına göre öğrenmeyi kolaylaştırır ve hafızada daha kalıcı 
              hale getirir.
            </p>
          </section>
          
          <section className="p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.cardBackground }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              Misyon ve Vizyon
            </h2>
            <p className="mb-3" style={{ color: colors.text }}>
              Bu projenin temel misyonu, kendi YDS çalışma deneyimimde en etkili bulduğum yöntemleri dijital bir platforma 
              aktarmak ve diğer YDS adaylarına fayda sağlamaktır. Öncelikle kendim için geliştirilen bu platform, aynı 
              zamanda benzer öğrenme ihtiyaçları olan diğer kullanıcılara da hizmet etmeyi hedeflemektedir.
            </p>
            <p style={{ color: colors.text }}>
              Vizyonumuz, dil öğrenimini daha erişilebilir, etkili ve kişiselleştirilmiş hale getirmektir. YDS sınavına 
              hazırlanmanın zorluklarını bilen biri olarak, bu süreçteki verimlilik ve başarı oranını arttırmayı amaçlıyorum.
            </p>
          </section>
          
          <section className="p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.cardBackground }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              Geliştirici Hakkında
            </h2>
            <p className="mb-3" style={{ color: colors.text }}>
              Bu platform, &quot;eyzaun&quot; tarafından tasarlanmış ve geliştirilmiştir. YDS hazırlık sürecimde kendi ihtiyaçlarımı 
              karşılamak üzere başlattığım bu proje, zamanla daha kapsamlı bir öğrenme aracına dönüşmüştür.
            </p>
            <p style={{ color: colors.text }}>
              Her ne kadar profesyonel bir dil eğitimcisi olmasam da, kendi öğrenme yolculuğumdan edindiğim tecrübeleri 
              ve en etkili bulduğum yöntemleri bu platformda paylaşıyorum. Amacım, kendi çalışma yöntemimi dijitalleştirerek, 
              benzer hedefleri olan kişilere yardımcı olmaktır.
            </p>
          </section>
          
          <section className="p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.cardBackground }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              Kullanıcı Odaklı Yaklaşım
            </h2>
            <p className="mb-3" style={{ color: colors.text }}>
              YDS Kelime Listesi, kullanıcı dostu arayüzü ve kategori temelli öğrenme sistemiyle, 
              YDS sınavına hazırlanan herkesin kelime haznesini geliştirmesine yardımcı olmayı hedeflemektedir. 
              Her kategoride bulunan kelime listeleri ve testlerle, öğrenme sürecinizi takip edebilir ve 
              gelişiminizi ölçebilirsiniz.
            </p>
            <p style={{ color: colors.text }}>
              Platformun sürekli iyileştirilmesi ve geliştirilmesi için kullanıcılarımızın geri bildirimlerine 
              her zaman açığız. Önerileriniz, platformun daha da gelişmesine katkı sağlayacaktır.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}