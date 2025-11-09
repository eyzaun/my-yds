// styles/config.ts
import { designTokens, getDesignTokensByTheme } from './design-tokens';

// Legacy theme structure - now uses design tokens
export const themes = {
  blue: {
    background: designTokens.colors.background.primary,
    cardBackground: designTokens.colors.background.secondary,
    accent: designTokens.colors.primary[600],
    text: designTokens.colors.text.primary,
    textSecondary: designTokens.colors.text.secondary,
    disabled: designTokens.colors.text.disabled
  },
  purple: {
    background: designTokens.colors.background.primary,
    cardBackground: designTokens.colors.background.secondary,
    accent: designTokens.colors.primary[600],
    text: designTokens.colors.text.primary,
    textSecondary: designTokens.colors.text.secondary,
    disabled: designTokens.colors.text.disabled
  },
  green: {
    background: designTokens.colors.background.primary,
    cardBackground: designTokens.colors.background.secondary,
    accent: designTokens.colors.status.success,
    text: designTokens.colors.text.primary,
    textSecondary: designTokens.colors.text.secondary,
    disabled: designTokens.colors.text.disabled
  },
  orange: {
    background: designTokens.colors.background.primary,
    cardBackground: designTokens.colors.background.secondary,
    accent: designTokens.colors.status.warning,
    text: designTokens.colors.text.primary,
    textSecondary: designTokens.colors.text.secondary,
    disabled: designTokens.colors.text.disabled
  }
};

// Get theme colors - now uses design tokens
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