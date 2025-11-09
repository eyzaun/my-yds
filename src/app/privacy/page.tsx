'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/design-system/Container';
import { Card } from '@/components/design-system/Card';
import { Heading1, Heading2, Text } from '@/components/design-system/Typography';
import { designTokens } from '@/styles/design-tokens';

export default function Privacy() {
  
  // Sayfa için SEO ve yapısal veri ekleme
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'PrivacyPolicy',
      'name': 'YDS Kelime Listesi Gizlilik Politikası',
      'description': 'YDS Kelime Listesi projesi gizlilik politikası ve veri kullanım bilgileri.',
      'url': 'https://my-yds.web.app/privacy',
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: designTokens.colors.background.primary }}>

      <Container maxWidth="lg" className="py-8">
        <Heading1 className="text-2xl md:text-3xl mb-6 text-center">
          Gizlilik Politikası
        </Heading1>

        <div className="mt-8 space-y-6">
          <Card>
            <Heading2 className="mb-4">
              Giriş
            </Heading2>
            <Text className="mb-3">
              Bu gizlilik politikası, YDS Kelime Listesi (&quot;biz&quot;, &quot;bizim&quot; veya &quot;sitemiz&quot; olarak anılacaktır) web sitesini
              kullanırken topladığımız verilerin nasıl kullanıldığı, korunduğu ve ifşa edildiği hakkında bilgi vermek
              amacıyla oluşturulmuştur.
            </Text>
            <Text>
              Web sitemizi kullanarak, bu politika kapsamında belirtilen veri toplama ve kullanma uygulamalarını
              kabul etmiş olursunuz. Bu politika, kişisel veriler de dahil olmak üzere sitemizde toplanan tüm bilgileri kapsar.
            </Text>
          </Card>

          <Card>
            <Heading2 className="mb-4">
              Topladığımız Veriler
            </Heading2>
            <Text className="mb-3">
              Sitemizi kullanırken, aşağıdaki verileri otomatik olarak toplayabiliriz:
            </Text>
            <ul className="list-disc pl-5 mb-3 space-y-2">
              <li>
                <Text as="span"><strong>Cihaz Bilgileri:</strong> Kullandığınız tarayıcı tipi, işletim sistemi, cihaz türü,
                ekran çözünürlüğü gibi teknik bilgiler.</Text>
              </li>
              <li>
                <Text as="span"><strong>Log Verileri:</strong> IP adresi, ziyaret saati ve tarihi, görüntülediğiniz sayfalar,
                sitemizde geçirdiğiniz süre gibi bilgiler.</Text>
              </li>
              <li>
                <Text as="span"><strong>Çerezler:</strong> Sitemizi nasıl kullandığınızı hatırlamak için çerezler ve benzer
                teknolojiler kullanabiliriz.</Text>
              </li>
            </ul>
            <Text>
              Şu an için sitemiz herhangi bir oturum açma, kayıt olma veya form doldurma gerektirmemektedir.
              Bu nedenle, kullanıcılardan aktif olarak kişisel veri toplamamaktayız.
            </Text>
          </Card>

          <Card>
            <Heading2 className="mb-4">
              Verilerin Kullanımı
            </Heading2>
            <Text className="mb-3">
              Topladığımız verileri aşağıdaki amaçlar için kullanabiliriz:
            </Text>
            <ul className="list-disc pl-5 mb-3 space-y-2">
              <li><Text as="span">Sitemizin performansını ve içeriğini iyileştirmek</Text></li>
              <li><Text as="span">Kullanıcı deneyimini geliştirmek</Text></li>
              <li><Text as="span">Sitemizin nasıl kullanıldığını analiz etmek</Text></li>
              <li><Text as="span">Teknik sorunları tespit etmek ve çözmek</Text></li>
              <li><Text as="span">Yasal yükümlülüklerimizi yerine getirmek</Text></li>
            </ul>
          </Card>

          <Card>
            <Heading2 className="mb-4">
              Google AdSense ve Çerezler
            </Heading2>
            <Text className="mb-3">
              Sitemizde Google AdSense reklamları kullanılmaktadır. Bu hizmet, site içeriğinize ve ziyaretçilerinizin
              ilgi alanlarına göre hedeflenmiş reklamlar sunmak için çerezleri kullanabilir. Google AdSense,
              kullanıcıların reklamları görüntülemesi ve reklamlara tıklaması hakkında bilgileri toplar.
            </Text>
            <Text className="mb-3">
              Google, bu bilgileri kullanarak reklam performansını değerlendirir, raporlar oluşturur ve reklam
              hizmetlerini iyileştirmek için kullanır. Google, bilgileri kendi gizlilik politikasına uygun olarak
              kullanır. Google&apos;ın veri toplama ve kullanma uygulamaları hakkında daha fazla bilgi edinmek için,
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="mx-1 underline hover:text-opacity-80" style={{ color: designTokens.colors.accent }}>
                Google Gizlilik Politikası
              </a>
              adresini ziyaret edebilirsiniz.
            </Text>
            <Text className="mb-3">
              Google AdSense dışında, sitemiz aşağıdaki çerez türlerini kullanabilir:
            </Text>
            <ul className="list-disc pl-5 mb-3 space-y-2">
              <li>
                <Text as="span"><strong>Zorunlu Çerezler:</strong> Sitenin düzgün çalışması için gerekli olan çerezler.</Text>
              </li>
              <li>
                <Text as="span"><strong>Analitik Çerezler:</strong> Kullanıcıların sitemizle nasıl etkileşim kurduğunu anlamamıza
                yardımcı olur.</Text>
              </li>
              <li>
                <Text as="span"><strong>Fonksiyonel Çerezler:</strong> Kullanıcı tercihlerini hatırlamak için kullanılır.</Text>
              </li>
            </ul>
          </Card>

          <Card>
            <Heading2 className="mb-4">
              Çerez Kontrolü ve Kişiselleştirilmiş Reklamları Devre Dışı Bırakma
            </Heading2>
            <Text className="mb-3">
              Çoğu web tarayıcısı, çerezleri otomatik olarak kabul eder, ancak tarayıcı ayarlarınızı değiştirerek
              çerezleri engellemeyi veya çerezler hakkında uyarı almayı seçebilirsiniz. Çerezleri devre dışı bırakmak,
              sitemizin bazı özelliklerinin düzgün çalışmamasına neden olabilir.
            </Text>
            <Text className="mb-3">
              Google&apos;ın sunduğu kişiselleştirilmiş reklamları devre dışı bırakmak için
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="mx-1 underline hover:text-opacity-80" style={{ color: designTokens.colors.accent }}>
                Google Reklam Ayarları
              </a>
              sayfasını ziyaret edebilirsiniz.
            </Text>
            <Text>
              Ayrıca,
              <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="mx-1 underline hover:text-opacity-80" style={{ color: designTokens.colors.accent }}>
                Digital Advertising Alliance
              </a>
              veya
              <a href="http://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="mx-1 underline hover:text-opacity-80" style={{ color: designTokens.colors.accent }}>
                Your Online Choices
              </a>
              gibi platformlar aracılığıyla çeşitli reklam ağları için tercihlerinizi yönetebilirsiniz.
            </Text>
          </Card>

          <Card>
            <Heading2 className="mb-4">
              Veri Paylaşımı ve Açıklama
            </Heading2>
            <Text className="mb-3">
              Topladığımız verileri aşağıdaki durumlar hariç üçüncü taraflarla paylaşmayız veya açıklamayız:
            </Text>
            <ul className="list-disc pl-5 mb-3 space-y-2">
              <li><Text as="span">Yasal bir yükümlülüğü yerine getirmek için gerekli olduğunda (örn. mahkeme kararı)</Text></li>
              <li><Text as="span">Sitemizin haklarını veya güvenliğini korumak için gerekli olduğunda</Text></li>
              <li><Text as="span">Hizmet sağlayıcılarımızla (Google Analytics, Google AdSense gibi) gerekli olduğunda</Text></li>
            </ul>
            <Text>
              Topladığımız verileri, reklam gösterme, site performansını analiz etme ve kullanıcı deneyimini
              iyileştirme amacıyla Google gibi üçüncü taraf hizmet sağlayıcılarımızla paylaşabiliriz.
            </Text>
          </Card>

          <Card>
            <Heading2 className="mb-4">
              Veri Güvenliği
            </Heading2>
            <Text>
              Verilerinizin güvenliğini sağlamak için uygun teknik ve organizasyonel önlemler alıyoruz.
              Ancak, internet üzerinden veri iletiminin veya elektronik depolamanın %100 güvenli olduğu garanti
              edilemez. Bu nedenle, verilerinizin mutlak güvenliğini garanti edemeyiz.
            </Text>
          </Card>

          <Card>
            <Heading2 className="mb-4">
              Çocukların Gizliliği
            </Heading2>
            <Text>
              Sitemiz 13 yaşından küçük çocuklara yönelik değildir ve bilerek 13 yaşından küçük çocuklardan
              kişisel veri toplamıyoruz. Eğer 13 yaşından küçük bir çocuktan kişisel veri topladığımızı
              öğrenirsek, bu verileri en kısa sürede silmek için adımlar atacağız.
            </Text>
          </Card>

          <Card>
            <Heading2 className="mb-4">
              Gizlilik Politikası Değişiklikleri
            </Heading2>
            <Text className="mb-3">
              Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler yaptığımızda,
              bu değişiklikleri web sitemizde belirgin bir şekilde duyuracağız.
            </Text>
            <Text>
              Sizin için en güncel gizlilik politikasını görmek için bu sayfayı düzenli olarak ziyaret
              etmenizi öneririz. Bu politikayı son güncelleme tarihi: 05.03.2025
            </Text>
          </Card>

          <Card>
            <Heading2 className="mb-4">
              Bize Ulaşın
            </Heading2>
            <Text className="mb-3">
              Bu gizlilik politikası hakkında sorularınız veya endişeleriniz varsa, lütfen bizimle iletişime geçin:
            </Text>
            <Text>
              <Link href="/contact" className="underline hover:text-opacity-80" style={{ color: designTokens.colors.accent }}>
                İletişim Sayfası
              </Link>
            </Text>
          </Card>
        </div>
      </Container>
    </div>
  );
}