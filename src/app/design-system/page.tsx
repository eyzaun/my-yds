'use client';
import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { colorThemes, designTokens, ThemeName, componentStyles } from '@/styles/designSystem';

export default function DesignSystemPage() {
  const { colors, theme, setTheme } = useTheme();
  const [selectedSection, setSelectedSection] = useState<'colors' | 'components' | 'tokens'>('colors');

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: colors.text }}>
            🎨 Design System
          </h1>
          <p className="text-lg" style={{ color: colors.textSecondary }}>
            Merkezi tema ve tasarım yönetim paneli
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {(['colors', 'components', 'tokens'] as const).map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              style={{
                backgroundColor: selectedSection === section ? colors.accent : colors.cardBackground,
                color: selectedSection === section ? colors.background : colors.text,
                boxShadow: selectedSection === section ? designTokens.shadows.md : designTokens.shadows.sm,
              }}
            >
              {section === 'colors' && '🎨 Renkler & Temalar'}
              {section === 'components' && '🧩 Componentler'}
              {section === 'tokens' && '🎯 Design Tokens'}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {selectedSection === 'colors' && <ColorsSection />}
        {selectedSection === 'components' && <ComponentsSection />}
        {selectedSection === 'tokens' && <TokensSection />}
      </div>
    </div>
  );
}

// 🎨 Renkler & Temalar Bölümü
function ColorsSection() {
  const { colors, theme, setTheme } = useTheme();

  return (
    <div className="space-y-8">
      {/* Theme Selector */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
          Aktif Tema: {theme}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.keys(colorThemes).map((themeName) => (
            <button
              key={themeName}
              onClick={() => setTheme(themeName as ThemeName)}
              className="p-4 rounded-lg transition-all duration-300 transform hover:scale-105 border-2"
              style={{
                backgroundColor: colorThemes[themeName as ThemeName].cardBackground,
                borderColor: theme === themeName ? colorThemes[themeName as ThemeName].accent : 'transparent',
                boxShadow: theme === themeName ? designTokens.shadows.lg : designTokens.shadows.sm,
              }}
            >
              <div className="font-semibold capitalize mb-2" style={{ color: colorThemes[themeName as ThemeName].text }}>
                {themeName}
              </div>
              <div className="flex gap-1">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: colorThemes[themeName as ThemeName].background }} />
                <div className="w-8 h-8 rounded" style={{ backgroundColor: colorThemes[themeName as ThemeName].accent }} />
                <div className="w-8 h-8 rounded" style={{ backgroundColor: colorThemes[themeName as ThemeName].text }} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Palette */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
          Renk Paleti
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(colors).map(([name, value]) => (
            <div key={name} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.background }}>
              <div
                className="w-16 h-16 rounded-lg flex-shrink-0"
                style={{
                  backgroundColor: value,
                  boxShadow: designTokens.shadows.md,
                }}
              />
              <div>
                <div className="font-semibold capitalize" style={{ color: colors.text }}>
                  {name}
                </div>
                <div className="text-sm font-mono" style={{ color: colors.textSecondary }}>
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Opacity Variants */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
          Accent Renk Opacity Varyantları
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['10', '20', '30', '40', '50', '60', '70', '80', '90'].map((opacity) => (
            <div key={opacity} className="text-center">
              <div
                className="h-20 rounded-lg mb-2"
                style={{
                  backgroundColor: `${colors.accent}${opacity}`,
                  border: `1px solid ${colors.accent}`,
                }}
              />
              <div className="text-sm font-semibold" style={{ color: colors.text }}>
                {opacity}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 🧩 Componentler Bölümü
function ComponentsSection() {
  const { colors } = useTheme();
  const [quizAnswer, setQuizAnswer] = useState('');

  return (
    <div className="space-y-8">
      {/* Buttons */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
          Butonlar
        </h2>
        <div className="flex flex-wrap gap-4">
          {/* Primary Button */}
          <button
            className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            style={{
              backgroundColor: colors.accent,
              color: colors.background,
              boxShadow: designTokens.shadows.md,
            }}
          >
            Primary Button
          </button>

          {/* Secondary Button */}
          <button
            className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            style={{
              backgroundColor: colors.cardBackground,
              color: colors.text,
              border: `2px solid ${colors.accent}`,
            }}
          >
            Secondary Button
          </button>

          {/* Outline Button */}
          <button
            className="px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            style={{
              backgroundColor: 'transparent',
              color: colors.accent,
              border: `2px solid ${colors.accent}`,
            }}
          >
            Outline Button
          </button>

          {/* Ghost Button */}
          <button
            className="px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            style={{
              backgroundColor: `${colors.accent}20`,
              color: colors.accent,
            }}
          >
            Ghost Button
          </button>

          {/* Disabled Button */}
          <button
            className="px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
            disabled
            style={{
              backgroundColor: colors.disabled,
              color: colors.textSecondary,
              opacity: designTokens.opacity.disabled,
            }}
          >
            Disabled Button
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
          Kartlar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Elevated Card */}
          <div
            className="p-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            style={{
              backgroundColor: colors.cardBackground,
              boxShadow: designTokens.shadows.card,
            }}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.text }}>
              Elevated Card
            </h3>
            <p style={{ color: colors.textSecondary }}>
              Gölge ile vurgulanmış kart
            </p>
          </div>

          {/* Interactive Card */}
          <div
            className="p-6 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: colors.cardBackground,
              boxShadow: designTokens.shadows.card,
              border: `1px solid ${colors.accent}40`,
            }}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.accent }}>
              Interactive Card
            </h3>
            <p style={{ color: colors.textSecondary }}>
              Hover efektli interaktif kart
            </p>
          </div>

          {/* Accent Card */}
          <div
            className="p-6 rounded-xl transition-all duration-300"
            style={{
              backgroundColor: `${colors.accent}20`,
              border: `2px solid ${colors.accent}`,
            }}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.accent }}>
              Accent Card
            </h3>
            <p style={{ color: colors.text }}>
              Accent renkli vurgulu kart
            </p>
          </div>
        </div>
      </div>

      {/* Inputs & Forms */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
          Input & Form Elementleri
        </h2>
        <div className="space-y-4 max-w-md">
          {/* Normal Input */}
          <input
            type="text"
            placeholder="Normal input..."
            className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.accent + '40',
            }}
          />

          {/* Quiz Style Input */}
          <div className="flex">
            <input
              type="text"
              value={quizAnswer}
              onChange={(e) => setQuizAnswer(e.target.value)}
              placeholder="Quiz input..."
              className="flex-grow px-4 py-3 rounded-l-lg border-2 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.accent,
              }}
            />
            <button
              className="px-6 py-3 rounded-r-lg font-semibold"
              style={{
                backgroundColor: colors.accent,
                color: colors.background,
              }}
            >
              Kontrol Et
            </button>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
          Durum Mesajları
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: `${colors.success}20`, border: `1px solid ${colors.success}` }}>
            <span className="text-2xl">✓</span>
            <span style={{ color: colors.success }}>Başarılı işlem!</span>
          </div>

          <div className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: `${colors.error}20`, border: `1px solid ${colors.error}` }}>
            <span className="text-2xl">✗</span>
            <span style={{ color: colors.error }}>Hata oluştu!</span>
          </div>

          <div className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: `${colors.warning}20`, border: `1px solid ${colors.warning}` }}>
            <span className="text-2xl">⚠</span>
            <span style={{ color: colors.warning }}>Dikkat! Önemli bilgi.</span>
          </div>

          <div className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: `${colors.info}20`, border: `1px solid ${colors.info}` }}>
            <span className="text-2xl">ℹ</span>
            <span style={{ color: colors.info }}>Bilgilendirme mesajı.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🎯 Design Tokens Bölümü
function TokensSection() {
  const { colors } = useTheme();

  return (
    <div className="space-y-8">
      {/* Shadows */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
          Gölgeler (Shadows)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {Object.entries(designTokens.shadows).map(([name, value]) => (
            <div key={name} className="text-center">
              <div
                className="h-24 rounded-lg mb-2 flex items-center justify-center"
                style={{
                  backgroundColor: colors.cardBackground,
                  boxShadow: value,
                }}
              >
                <span className="font-semibold" style={{ color: colors.text }}>
                  {name}
                </span>
              </div>
              <code className="text-xs" style={{ color: colors.textSecondary }}>
                {value}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
          Spacing Scale
        </h2>
        <div className="space-y-3">
          {Object.entries(designTokens.spacing).map(([name, value]) => (
            <div key={name} className="flex items-center gap-4">
              <div className="w-20 font-semibold" style={{ color: colors.text }}>
                {name}
              </div>
              <div
                className="rounded"
                style={{
                  width: value,
                  height: '2rem',
                  backgroundColor: colors.accent,
                }}
              />
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Border Radius */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
          Border Radius
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(designTokens.radius).map(([name, value]) => (
            <div key={name} className="text-center">
              <div
                className="h-20 mb-2"
                style={{
                  backgroundColor: colors.accent,
                  borderRadius: value,
                }}
              />
              <div className="font-semibold" style={{ color: colors.text }}>
                {name}
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
          Typography Scale
        </h2>
        <div className="space-y-3">
          {Object.entries(designTokens.typography.fontSize).map(([name, value]) => (
            <div key={name} className="flex items-baseline gap-4">
              <div className="w-16 text-sm font-semibold" style={{ color: colors.textSecondary }}>
                {name}
              </div>
              <div style={{ fontSize: value, color: colors.text }}>
                The quick brown fox jumps over the lazy dog
              </div>
              <div className="text-sm ml-auto" style={{ color: colors.textSecondary }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animations */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.cardBackground }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
          Animasyon Süreleri
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(designTokens.animations).slice(0, 3).map(([name, value]) => (
            <div key={name} className="text-center">
              <div
                className="h-20 rounded-lg mb-2 flex items-center justify-center transition-all hover:scale-110"
                style={{
                  backgroundColor: colors.accent,
                  transitionDuration: value,
                }}
              >
                <span className="font-semibold" style={{ color: colors.background }}>
                  Hover me
                </span>
              </div>
              <div className="font-semibold" style={{ color: colors.text }}>
                {name}
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
