'use client';
import { useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';

export default function Privacy() {
  const { colors } = useTheme();
  
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
    <div className="min-h-screen pb-16" style={{ backgroundColor: colors.background }}>
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center" style={{ color: colors.text }}>
          Gizlilik Politikası
        </h1>
        
        <div className="mt-8 space-y-6">
          <section className="p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.cardBackground }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              Giriş
            </h2>
            <p className="mb-3" style={{ color: colors.text }}>
              Bu gizlilik politikası, YDS Kelime Listesi (&quot;biz&quot;, &quot;bizim&quot; veya &quot;sitemiz&quot; olarak anılacaktır) web sitesini 
              kullanırken topladığımız verilerin nasıl kullanıldığı, korunduğu ve ifşa edildiği hakkında bilgi vermek 
              amacıyla oluşturulmuştur.
            </p>
            <p style={{ color: colors.text }}>
              Web sitemizi kullanarak, bu politika kapsamında belirtilen veri toplama ve kullanma uygulamalarını 
              kabul etmiş olursunuz. Bu politika, kişisel veriler de dahil olmak üzere sitemizde toplanan tüm bilgileri kapsar.
            </p>
          </section>

          <section className="p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.cardBackground }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              Topladığımız Veriler
            </h2>
            <p className="mb-3" style={{ color: colors.text }}>
              Sitemizi kullanırken, aşağıdaki verileri otomatik olarak toplayabiliriz:
            </p>
            <ul className="list-disc pl-5 mb-3 space-y-2" style={{ color: colors.text }}>
              <li>
                <strong>Cihaz Bilgileri:</strong> Kullandığınız tarayıcı tipi, işletim sistemi, cihaz türü, 
                ekran çözünürlüğü gibi teknik bilgiler.
              </li>
              <li>
                <strong>Log Verileri:</strong> IP adresi, ziyaret saati ve tarihi, görüntülediğiniz sayfalar, 
                sitemizde geçirdiğiniz süre gibi bilgiler.
              </li>
              <li>
                <strong>Çerezler:</strong> Sitemizi nasıl kullandığınızı hatırlamak için çerezler ve benzer 
                teknolojiler kullanabiliriz.
              </li>
            </ul>
            <p style={{ color: colors.text }}>
              Şu an için sitemiz herhangi bir oturum açma, kayıt olma veya form doldurma gerektirmemektedir. 
              Bu nedenle, kullanıcılardan aktif olarak kişisel veri toplamamaktayız.
            </p>
          </section>

          <section className="p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.cardBackground }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              Verilerin Kullanımı
            </h2>
            <p className="mb-3" style={{ color: colors.text }}>
              Topladığımız verileri aşağıdaki amaçlar için kullanabiliriz:
            </p>
            <ul className="list-disc pl-5 mb-3 space-y-2" style={{ color: colors.text }}>
              <li>Sitemizin performansını ve içeriğini iyileştirmek</li>
              <li>Kullanıcı deneyimini geliştirmek</li>
              <li>Sitemizin nasıl kullanıldığını analiz etmek</li>
              <li>Teknik sorunları tespit etmek ve çözmek</li>
              <li>Yasal yükümlülüklerimizi yerine getirmek</li>
            </ul>
          </section>

          <section className="p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.cardBackground }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              Google AdSense ve Çerezler
            </h2>
            <p className="mb-3" style={{ color: colors.text }}>
              Sitemizde Google AdSense reklamları kullanılmaktadır. Bu hizmet, site içeriğinize ve ziyaretçilerinizin 
              ilgi alanlarına göre hedeflenmiş reklamlar sunmak için çerezleri kullanabilir. Google AdSense, 
              kullanıcıların reklamları görüntülemesi ve reklamlara tıklaması hakkında bilgileri toplar.
            </p>
            <p className="mb-3" style={{ color: colors.text }}>
              Google, bu bilgileri kullanarak reklam performansını değerlendirir, raporlar oluşturur ve reklam 
              hizmetlerini iyileştirmek için kullanır. Google, bilgileri kendi gizlilik politikasına uygun olarak 
              kullanır. Google&apos;ın veri toplama ve kullanma uygulamaları hakkında daha fazla bilgi edinmek için, 
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="mx-1 underline hover:text-opacity-80" style={{ color: colors.accent }}>
                Google Gizlilik Politikası
              </a>
              adresini ziyaret edebilirsiniz.
            </p>
            <p className="mb-3" style={{ color: colors.text }}>
              Google AdSense dışında, sitemiz aşağıdaki çerez türlerini kullanabilir:
            </p>
            <ul className="list-disc pl-5 mb-3 space-y-2" style={{ color: colors.text }}>
              <li>
                <strong>Zorunlu Çerezler:</strong> Sitenin düzgün çalışması için gerekli olan çerezler.
              </li>
              <li>
                <strong>Analitik Çerezler:</strong> Kullanıcıların sitemizle nasıl etkileşim kurduğunu anlamamıza 
                yardımcı olur.
              </li>
              <li>
                <strong>Fonksiyonel Çerezler:</strong> Kullanıcı tercihlerini hatırlamak için kullanılır.
              </li>
            </ul>
          </section>

          <section className="p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.cardBackground }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              Çerez Kontrolü ve Kişiselleştirilmiş Reklamları Devre Dışı Bırakma
            </h2>
            <p className="mb-3" style={{ color: colors.text }}>
              Çoğu web tarayıcısı, çerezleri otomatik olarak kabul eder, ancak tarayıcı ayarlarınızı değiştirerek 
              çerezleri engellemeyi veya çerezler hakkında uyarı almayı seçebilirsiniz. Çerezleri devre dışı bırakmak, 
              sitemizin bazı özelliklerinin düzgün çalışmamasına neden olabilir.
            </p>
            <p className="mb-3" style={{ color: colors.text }}>
              Google&apos;ın sunduğu kişiselleştirilmiş reklamları devre dışı bırakmak için 
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="mx-1 underline hover:text-opacity-80" style={{ color: colors.accent }}>
                Google Reklam Ayarları
              </a>
              sayfasını ziyaret edebilirsiniz.
            </p>
            <p style={{ color: colors.text }}>
              Ayrıca, 
              <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="mx-1 underline hover:text-opacity-80" style={{ color: colors.accent }}>
                Digital Advertising Alliance
              </a>
              veya 
              <a href="http://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="mx-1 underline hover:text-opacity-80" style={{ color: colors.accent }}>
                Your Online Choices
              </a>
              gibi platformlar aracılığıyla çeşitli reklam ağları için tercihlerinizi yönetebilirsiniz.
            </p>
          </section>

          <section className="p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.cardBackground }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              Veri Paylaşımı ve Açıklama
            </h2>
            <p className="mb-3" style={{ color: colors.text }}>
              Topladığımız verileri aşağıdaki durumlar hariç üçüncü taraflarla paylaşmayız veya açıklamayız:
            </p>
            <ul className="list-disc pl-5 mb-3 space-y-2" style={{ color: colors.text }}>
              <li>Yasal bir yükümlülüğü yerine getirmek için gerekli olduğunda (örn. mahkeme kararı)</li>
              <li>Sitemizin haklarını veya güvenliğini korumak için gerekli olduğunda</li>
              <li>Hizmet sağlayıcılarımızla (Google Analytics, Google AdSense gibi) gerekli olduğunda</li>
            </ul>
            <p style={{ color: colors.text }}>
              Topladığımız verileri, reklam gösterme, site performansını analiz etme ve kullanıcı deneyimini 
              iyileştirme amacıyla Google gibi üçüncü taraf hizmet sağlayıcılarımızla paylaşabiliriz.
            </p>
          </section>

          <section className="p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.cardBackground }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              Veri Güvenliği
            </h2>
            <p style={{ color: colors.text }}>
              Verilerinizin güvenliğini sağlamak için uygun teknik ve organizasyonel önlemler alıyoruz. 
              Ancak, internet üzerinden veri iletiminin veya elektronik depolamanın %100 güvenli olduğu garanti 
              edilemez. Bu nedenle, verilerinizin mutlak güvenliğini garanti edemeyiz.
            </p>
          </section>

          <section className="p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.cardBackground }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              Çocukların Gizliliği
            </h2>
            <p style={{ color: colors.text }}>
              Sitemiz 13 yaşından küçük çocuklara yönelik değildir ve bilerek 13 yaşından küçük çocuklardan 
              kişisel veri toplamıyoruz. Eğer 13 yaşından küçük bir çocuktan kişisel veri topladığımızı 
              öğrenirsek, bu verileri en kısa sürede silmek için adımlar atacağız.
            </p>
          </section>

          <section className="p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.cardBackground }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              Gizlilik Politikası Değişiklikleri
            </h2>
            <p className="mb-3" style={{ color: colors.text }}>
              Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler yaptığımızda, 
              bu değişiklikleri web sitemizde belirgin bir şekilde duyuracağız.
            </p>
            <p style={{ color: colors.text }}>
              Sizin için en güncel gizlilik politikasını görmek için bu sayfayı düzenli olarak ziyaret 
              etmenizi öneririz. Bu politikayı son güncelleme tarihi: 05.03.2025
            </p>
          </section>

          <section className="p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.cardBackground }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              Bize Ulaşın
            </h2>
            <p className="mb-3" style={{ color: colors.text }}>
              Bu gizlilik politikası hakkında sorularınız veya endişeleriniz varsa, lütfen bizimle iletişime geçin:
            </p>
            <p style={{ color: colors.text }}>
              <Link href="/contact" className="underline hover:text-opacity-80" style={{ color: colors.accent }}>
                İletişim Sayfası
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}