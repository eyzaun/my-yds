'use client';
import { useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export default function Contact() {
  const { colors } = useTheme();
  
  // Sayfa için SEO ve yapısal veri ekleme
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      'name': 'YDS Kelime Listesi İletişim',
      'description': 'YDS Kelime Listesi projesi iletişim bilgileri ve iletişim kanalları.',
      'url': 'https://my-yds.web.app/contact',
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
          İletişim
        </h1>

        <div className="space-y-6 mt-8">
          <section className="p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.cardBackground }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              Bizimle İletişime Geçin
            </h2>
            <p className="mb-4" style={{ color: colors.text }}>
              YDS Kelime Listesi platformu hakkında sorularınız, önerileriniz veya geri bildirimleriniz varsa, 
              aşağıdaki iletişim kanallarından bizimle iletişime geçebilirsiniz.
            </p>
            <p className="mb-2" style={{ color: colors.text }}>
              Her türlü soru, öneri ve geri bildirimlerinize en geç 1 iş günü içerisinde yanıt vermeye çalışıyoruz.
            </p>
          </section>
          
          <section className="p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.cardBackground }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              İletişim Bilgileri
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{ color: colors.accent }}>
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-md font-medium" style={{ color: colors.text }}>E-posta</h3>
                  <p className="mt-1" style={{ color: colors.text }}>
                    <a href="mailto:eyzaun@gmail.com" className="hover:underline">eyzaun@gmail.com</a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{ color: colors.accent }}>
                    <path d="M10 4a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM10 3a1 1 0 011 1v1.5a1 1 0 01-2 0V4a1 1 0 011-1zM2 10a8 8 0 1116 0v1h-2v-1a6 6 0 10-12 0v1H2v-1z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-md font-medium" style={{ color: colors.text }}>Instagram</h3>
                  <p className="mt-1" style={{ color: colors.text }}>
                    <a href="https://www.instagram.com/eyzaun/" target="_blank" rel="noopener noreferrer" className="hover:underline">@eyzaun</a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{ color: colors.accent }}>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-md font-medium" style={{ color: colors.text }}>Kick</h3>
                  <p className="mt-1" style={{ color: colors.text }}>
                    <a href="https://kick.com/eyzaun" target="_blank" rel="noopener noreferrer" className="hover:underline">kick.com/eyzaun</a>
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <section className="p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.cardBackground }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              İletişim Konuları
            </h2>
            <p className="mb-3" style={{ color: colors.text }}>
              Aşağıdaki konularda bizimle iletişime geçebilirsiniz:
            </p>
            <ul className="list-disc pl-5 space-y-2" style={{ color: colors.text }}>
              <li>Platform hakkında öneri ve geri bildirimler</li>
              <li>Hata bildirimleri</li>
              <li>Kelime listelerine eklemek istediğiniz kelimeler</li>
              <li>Test soruları hakkında düzeltmeler</li>
              <li>İşbirliği talepleri</li>
              <li>Diğer soru ve önerileriniz</li>
            </ul>
          </section>
          
          <section className="p-6 rounded-lg shadow-md" style={{ backgroundColor: colors.cardBackground }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
              Yanıt Süresi
            </h2>
            <p style={{ color: colors.text }}>
              Tüm mesajlarınıza en kısa sürede yanıt vermeye çalışıyoruz. Genellikle yanıt süremiz 24 saat içerisindedir. 
              Yoğun dönemlerde bu süre maksimum 1 iş gününe uzayabilir. Anlayışınız için teşekkür ederiz.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}