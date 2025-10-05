// styles/config.ts
export const themes = {
  blue: {
    background: '#212121',
    cardBackground: '#323232',
    accent: '#0D7377',
    text: '#14FFEC',
    textSecondary: '#14FFEC80',
    disabled: '#32323280'
  },
  purple: {
    background: '#212121',
    cardBackground: '#323232',
    accent: '#8A2BE2', // Mor
    text: '#E6E6FA', // Lavanta
    textSecondary: '#E6E6FA80',
    disabled: '#32323280'
  },
  green: {
    background: '#212121',
    cardBackground: '#323232',
    accent: '#2E8B57', // Deniz yeşili
    text: '#98FB98', // Açık yeşil
    textSecondary: '#98FB9880',
    disabled: '#32323280'
  },
  orange: {
    background: '#212121',
    cardBackground: '#323232',
    accent: '#FF8C00', // Koyu turuncu
    text: '#FFD700', // Altın sarısı
    textSecondary: '#FFD70080',
    disabled: '#32323280'
  }
};

// Geçerli temayı almak için
export const getThemeColors = (themeName: keyof typeof themes = 'blue') => {
  return themes[themeName];
};

interface ColorTheme {
  background: string;
  cardBackground: string;
  accent: string;
  text: string;
  textSecondary: string;
  disabled: string;
}

interface StyleClasses {
  pageContainer: string;
  contentContainer: string;
  card: string;
  pageTitle: string;
  sectionTitle: string;
  modeButtonsContainer: string;
  resultContainer: string;
  resultCircle: string;
  resultText: string;
  actionButton: string;
  // Diğer sınıfları buraya ekleyebilirsiniz
}

interface IStyleConfig {
  colors: ColorTheme;
  classes: StyleClasses;
  getButtonClass: () => string;
  getDynamicButtonClass: () => string;
}

// Sabit sınıf adları tanımlayın
const classes: StyleClasses = {
  pageContainer: "min-h-screen pb-16",
  contentContainer: "max-w-4xl mx-auto px-4 py-8",
  card: "rounded-lg shadow-md p-4 mb-6",
  pageTitle: "text-2xl md:text-3xl font-bold mb-6 text-center",
  sectionTitle: "text-xl font-semibold mb-4",
  modeButtonsContainer: "flex justify-center space-x-4 mb-6",
  resultContainer: "text-center mt-8 p-6 rounded-lg shadow-md",
  resultCircle: "inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 mx-auto",
  resultText: "text-2xl font-bold",
  actionButton: "mt-4 px-6 py-2 rounded-lg hover:bg-opacity-90 transition duration-300",
};

export const StyleConfig: IStyleConfig = {
  colors: getThemeColors('blue'), // Varsayılan tema
  
  classes: classes,
  
  // Düzeltilmiş getButtonClass fonksiyonu
  getButtonClass: () => {
    return `px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-300`;
  },
  
  // Düzeltilmiş getDynamicButtonClass fonksiyonu
  getDynamicButtonClass: () => {
    return `px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-300`;
  }
};

export default StyleConfig;