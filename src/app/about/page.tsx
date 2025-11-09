'use client';
import { useEffect } from 'react';
import { Container } from '@/components/design-system/Container';
import { Card } from '@/components/design-system/Card';
import { Heading1, Heading3, Text } from '@/components/design-system/Typography';
import { designTokens } from '@/styles/design-tokens';

export default function About() {
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
    <div className="min-h-screen pb-16" style={{ backgroundColor: designTokens.colors.background.primary }}>

      <Container maxWidth="md" className="py-8">
        <Heading1 className="text-2xl md:text-3xl mb-6 text-center">
          Hakkımızda
        </Heading1>

        <div className="space-y-6 mt-8">
          <Card variant="elevated">
            <Heading3 className="mb-4">
              Proje Hakkında
            </Heading3>
            <Text className="mb-3">
              YDS Kelime Listesi, YDS sınavına hazırlanan bireyler için geliştirilmiş etkili bir kelime öğrenme
              platformudur. Bu proje, sınav hazırlık sürecindeki kişisel deneyimlerimden yola çıkarak, kelime öğrenmeyi
              daha sistematik ve verimli hale getirmek amacıyla oluşturulmuştur.
            </Text>
            <Text>
              Platformda yer alan kelimeler YDS sınavında sıkça karşılaşılan 8 farklı kategoride düzenlenmiştir.
              Bu kategorik yaklaşım, kelimeleri bağlamlarına göre öğrenmeyi kolaylaştırır ve hafızada daha kalıcı
              hale getirir.
            </Text>
          </Card>
          
          <Card variant="elevated">
            <Heading3 className="mb-4">
              Misyon ve Vizyon
            </Heading3>
            <Text className="mb-3">
              Bu projenin temel misyonu, kendi YDS çalışma deneyimimde en etkili bulduğum yöntemleri dijital bir platforma
              aktarmak ve diğer YDS adaylarına fayda sağlamaktır. Öncelikle kendim için geliştirilen bu platform, aynı
              zamanda benzer öğrenme ihtiyaçları olan diğer kullanıcılara da hizmet etmeyi hedeflemektedir.
            </Text>
            <Text>
              Vizyonumuz, dil öğrenimini daha erişilebilir, etkili ve kişiselleştirilmiş hale getirmektir. YDS sınavına
              hazırlanmanın zorluklarını bilen biri olarak, bu süreçteki verimlilik ve başarı oranını arttırmayı amaçlıyorum.
            </Text>
          </Card>
          
          <Card variant="elevated">
            <Heading3 className="mb-4">
              Geliştirici Hakkında
            </Heading3>
            <Text className="mb-3">
              Bu platform, &quot;eyzaun&quot; tarafından tasarlanmış ve geliştirilmiştir. YDS hazırlık sürecimde kendi ihtiyaçlarımı
              karşılamak üzere başlattığım bu proje, zamanla daha kapsamlı bir öğrenme aracına dönüşmüştür.
            </Text>
            <Text>
              Her ne kadar profesyonel bir dil eğitimcisi olmasam da, kendi öğrenme yolculuğumdan edindiğim tecrübeleri
              ve en etkili bulduğum yöntemleri bu platformda paylaşıyorum. Amacım, kendi çalışma yöntemimi dijitalleştirerek,
              benzer hedefleri olan kişilere yardımcı olmaktır.
            </Text>
          </Card>

          <Card variant="elevated">
            <Heading3 className="mb-4">
              Kullanıcı Odaklı Yaklaşım
            </Heading3>
            <Text className="mb-3">
              YDS Kelime Listesi, kullanıcı dostu arayüzü ve kategori temelli öğrenme sistemiyle,
              YDS sınavına hazırlanan herkesin kelime haznesini geliştirmesine yardımcı olmayı hedeflemektedir.
              Her kategoride bulunan kelime listeleri ve testlerle, öğrenme sürecinizi takip edebilir ve
              gelişiminizi ölçebilirsiniz.
            </Text>
            <Text>
              Platformun sürekli iyileştirilmesi ve geliştirilmesi için kullanıcılarımızın geri bildirimlerine
              her zaman açığız. Önerileriniz, platformun daha da gelişmesine katkı sağlayacaktır.
            </Text>
          </Card>
        </div>
      </Container>
    </div>
  );
}