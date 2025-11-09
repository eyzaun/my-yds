'use client';
import React, { useState } from 'react';
import { getDesignTokensByTheme, designTokens, Theme } from '@/styles/design-tokens';

export default function DesignSystemPage() {
  const [selectedTheme, setSelectedTheme] = useState<Theme>('light');
  const [selectedSection, setSelectedSection] = useState<'colors' | 'components' | 'tokens'>('colors');
  const tokens = getDesignTokensByTheme(selectedTheme);
  const colors = tokens.colors;

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: colors.background.primary }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: colors.text.primary }}>
            Design System
          </h1>
          <p className="text-lg" style={{ color: colors.text.secondary }}>
            Design Tokens ile Merkezi Tema Yönetimi
          </p>
        </div>

        {/* Theme Toggle */}
        <div className="mb-8 flex gap-3">
          {(['light', 'dark'] as const).map((theme) => (
            <button
              key={theme}
              onClick={() => setSelectedTheme(theme)}
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              style={{
                backgroundColor: selectedTheme === theme ? colors.accent.primary : colors.background.secondary,
                color: selectedTheme === theme ? colors.background.primary : colors.text.primary,
                border: `2px solid ${selectedTheme === theme ? colors.accent.primary : 'transparent'}`,
                boxShadow: selectedTheme === theme ? designTokens.shadows.md : designTokens.shadows.sm,
              }}
            >
              {theme === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {(['colors', 'components', 'tokens'] as const).map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              style={{
                backgroundColor: selectedSection === section ? colors.accent.primary : colors.background.secondary,
                color: selectedSection === section ? colors.background.primary : colors.text.primary,
                boxShadow: selectedSection === section ? designTokens.shadows.md : designTokens.shadows.sm,
              }}
            >
              {section === 'colors' && 'Renk Paleti'}
              {section === 'components' && 'Componentler'}
              {section === 'tokens' && 'Design Tokens'}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {selectedSection === 'colors' && <ColorsSection tokens={tokens} />}
        {selectedSection === 'components' && <ComponentsSection tokens={tokens} />}
        {selectedSection === 'tokens' && <TokensSection tokens={tokens} />}
      </div>
    </div>
  );
}

// Renk Paletleri Bölümü
function ColorsSection({ tokens }: { tokens: any }) {
  const colors = tokens.colors;

  return (
    <div className="space-y-8">
      {/* Primary Color Palette */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.light}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
          Primary Renk Paleti
        </h2>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
          {Object.entries(colors.primary).map(([name, value]: [string, any]) => (
            <div key={name} className="text-center group">
              <div
                className="h-14 rounded-md mb-2 cursor-pointer transition-transform hover:scale-110 shadow-sm hover:shadow-md"
                style={{
                  backgroundColor: value,
                }}
                title={`${value}`}
              />
              <div className="text-xs font-semibold truncate" style={{ color: colors.text.primary }}>
                {name}
              </div>
              <div className="text-xs font-mono" style={{ color: colors.text.tertiary }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gray Color Palette */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.light}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
          Gray Renk Paleti
        </h2>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
          {Object.entries(colors.gray).map(([name, value]: [string, any]) => (
            <div key={name} className="text-center group">
              <div
                className="h-14 rounded-md mb-2 cursor-pointer transition-transform hover:scale-110 shadow-sm hover:shadow-md"
                style={{
                  backgroundColor: value,
                }}
                title={`${value}`}
              />
              <div className="text-xs font-semibold truncate" style={{ color: colors.text.primary }}>
                {name}
              </div>
              <div className="text-xs font-mono" style={{ color: colors.text.tertiary }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Red Color Palette (Error) */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.light}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
          Red Renk Paleti (Error)
        </h2>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
          {Object.entries(colors.red).map(([name, value]: [string, any]) => (
            <div key={name} className="text-center group">
              <div
                className="h-14 rounded-md mb-2 cursor-pointer transition-transform hover:scale-110 shadow-sm hover:shadow-md"
                style={{
                  backgroundColor: value,
                }}
                title={`${value}`}
              />
              <div className="text-xs font-semibold truncate" style={{ color: colors.text.primary }}>
                {name}
              </div>
              <div className="text-xs font-mono" style={{ color: colors.text.tertiary }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Green Color Palette (Success) */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.light}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
          Green Renk Paleti (Success)
        </h2>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
          {Object.entries(colors.green).map(([name, value]: [string, any]) => (
            <div key={name} className="text-center group">
              <div
                className="h-14 rounded-md mb-2 cursor-pointer transition-transform hover:scale-110 shadow-sm hover:shadow-md"
                style={{
                  backgroundColor: value,
                }}
                title={`${value}`}
              />
              <div className="text-xs font-semibold truncate" style={{ color: colors.text.primary }}>
                {name}
              </div>
              <div className="text-xs font-mono" style={{ color: colors.text.tertiary }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cyan Color Palette */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.light}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
          Cyan Renk Paleti
        </h2>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
          {Object.entries(colors.cyan).map(([name, value]: [string, any]) => (
            <div key={name} className="text-center group">
              <div
                className="h-14 rounded-md mb-2 cursor-pointer transition-transform hover:scale-110 shadow-sm hover:shadow-md"
                style={{
                  backgroundColor: value,
                }}
                title={`${value}`}
              />
              <div className="text-xs font-semibold truncate" style={{ color: colors.text.primary }}>
                {name}
              </div>
              <div className="text-xs font-mono" style={{ color: colors.text.tertiary }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Colors */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.light}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
          Status Renkleri
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(colors.status).map(([name, value]: [string, any]) => (
            <div key={name} className="p-4 rounded-lg" style={{ backgroundColor: colors.background.tertiary, border: `1px solid ${colors.border.medium}` }}>
              <div
                className="h-20 rounded-md mb-3"
                style={{
                  backgroundColor: value,
                }}
              />
              <div className="font-semibold capitalize" style={{ color: colors.text.primary }}>
                {name}
              </div>
              <div className="text-sm font-mono" style={{ color: colors.text.tertiary }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accent Colors */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.light}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
          Accent Renkleri
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Primary Accent */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: colors.background.tertiary, border: `1px solid ${colors.border.medium}` }}>
            <h3 className="font-semibold mb-3" style={{ color: colors.text.primary }}>
              Primary Accent
            </h3>
            <div
              className="h-24 rounded-md mb-3"
              style={{
                backgroundColor: colors.accent.primary,
              }}
            />
            <div className="text-sm font-mono" style={{ color: colors.text.tertiary }}>
              {colors.accent.primary}
            </div>
          </div>

          {/* Success Accent */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: colors.background.tertiary, border: `1px solid ${colors.border.medium}` }}>
            <h3 className="font-semibold mb-3" style={{ color: colors.text.primary }}>
              Success
            </h3>
            <div className="space-y-2">
              <div
                className="h-6 rounded-md"
                style={{
                  backgroundColor: colors.accent.success.main,
                }}
              />
              <div className="text-xs font-mono" style={{ color: colors.text.tertiary }}>
                Main: {colors.accent.success.main}
              </div>
            </div>
          </div>

          {/* Error Accent */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: colors.background.tertiary, border: `1px solid ${colors.border.medium}` }}>
            <h3 className="font-semibold mb-3" style={{ color: colors.text.primary }}>
              Error
            </h3>
            <div className="space-y-2">
              <div
                className="h-6 rounded-md"
                style={{
                  backgroundColor: colors.accent.error.main,
                }}
              />
              <div className="text-xs font-mono" style={{ color: colors.text.tertiary }}>
                Main: {colors.accent.error.main}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componentler Bölümü
function ComponentsSection({ tokens }: { tokens: any }) {
  const colors = tokens.colors;
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="space-y-8">
      {/* Buttons */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.light}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
          Butonlar
        </h2>
        <div className="flex flex-wrap gap-4">
          {/* Primary Button */}
          <button
            className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            style={{
              backgroundColor: colors.accent.primary,
              color: colors.background.primary,
              boxShadow: designTokens.shadows.md,
            }}
          >
            Primary Button
          </button>

          {/* Secondary Button */}
          <button
            className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            style={{
              backgroundColor: colors.background.tertiary,
              color: colors.text.primary,
              border: `2px solid ${colors.accent.primary}`,
            }}
          >
            Secondary Button
          </button>

          {/* Outline Button */}
          <button
            className="px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            style={{
              backgroundColor: 'transparent',
              color: colors.accent.primary,
              border: `2px solid ${colors.accent.primary}`,
            }}
          >
            Outline Button
          </button>

          {/* Ghost Button */}
          <button
            className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:opacity-80"
            style={{
              backgroundColor: colors.background.secondary,
              color: colors.accent.primary,
            }}
          >
            Ghost Button
          </button>

          {/* Disabled Button */}
          <button
            className="px-6 py-3 rounded-lg font-semibold cursor-not-allowed opacity-50"
            disabled
            style={{
              backgroundColor: colors.background.tertiary,
              color: colors.text.disabled,
            }}
          >
            Disabled Button
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.light}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
          Kartlar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Elevated Card */}
          <div
            className="p-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            style={{
              backgroundColor: colors.surface.elevated,
              boxShadow: designTokens.shadows.md,
              border: `1px solid ${colors.border.light}`,
            }}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.text.primary }}>
              Elevated Card
            </h3>
            <p style={{ color: colors.text.secondary }}>
              Gölge ile vurgulanmış kart
            </p>
          </div>

          {/* Interactive Card */}
          <div
            className="p-6 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: colors.surface.elevated,
              boxShadow: designTokens.shadows.md,
              border: `2px solid ${colors.accent.primary}`,
            }}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.accent.primary }}>
              Interactive Card
            </h3>
            <p style={{ color: colors.text.secondary }}>
              Hover efektli interaktif kart
            </p>
          </div>

          {/* Accent Card */}
          <div
            className="p-6 rounded-xl transition-all duration-300"
            style={{
              backgroundColor: colors.background.tertiary,
              border: `2px solid ${colors.accent.primary}`,
            }}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.accent.primary }}>
              Accent Card
            </h3>
            <p style={{ color: colors.text.primary }}>
              Accent renkli vurgulu kart
            </p>
          </div>
        </div>
      </div>

      {/* Inputs & Forms */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.light}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
          Input & Form Elementleri
        </h2>
        <div className="space-y-4 max-w-md">
          {/* Normal Input */}
          <input
            type="text"
            placeholder="Normal input..."
            className="w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none"
            style={{
              backgroundColor: colors.background.primary,
              color: colors.text.primary,
              borderColor: colors.border.medium,
            }}
          />

          {/* Input with Button */}
          <div className="flex">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Input ile button..."
              className="flex-grow px-4 py-3 rounded-l-lg border-2 focus:outline-none"
              style={{
                backgroundColor: colors.background.primary,
                color: colors.text.primary,
                borderColor: colors.accent.primary,
              }}
            />
            <button
              className="px-6 py-3 rounded-r-lg font-semibold transition-all hover:opacity-90"
              style={{
                backgroundColor: colors.accent.primary,
                color: colors.background.primary,
              }}
            >
              Gönder
            </button>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.light}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
          Durum Mesajları
        </h2>
        <div className="space-y-3">
          <div className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: colors.status.successBg, border: `1px solid ${colors.status.success}` }}>
            <span className="text-2xl">✓</span>
            <span style={{ color: colors.status.success }}>Başarılı işlem!</span>
          </div>

          <div className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: colors.status.errorBg, border: `1px solid ${colors.status.error}` }}>
            <span className="text-2xl">✕</span>
            <span style={{ color: colors.status.error }}>Hata oluştu!</span>
          </div>

          <div className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: colors.status.warningBg, border: `1px solid ${colors.status.warning}` }}>
            <span className="text-2xl">⚠</span>
            <span style={{ color: colors.status.warning }}>Dikkat! Önemli bilgi.</span>
          </div>

          <div className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: colors.status.infoBg, border: `1px solid ${colors.status.info}` }}>
            <span className="text-2xl">ℹ</span>
            <span style={{ color: colors.status.info }}>Bilgilendirme mesajı.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Design Tokens Bölümü
function TokensSection({ tokens }: { tokens: any }) {
  const colors = tokens.colors;

  return (
    <div className="space-y-8">
      {/* Shadows */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.light}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
          Gölgeler (Shadows)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(designTokens.shadows).map(([name, value]: [string, any]) => (
            <div key={name} className="text-center">
              <div
                className="h-24 rounded-lg mb-2 flex items-center justify-center"
                style={{
                  backgroundColor: colors.surface.elevated,
                  boxShadow: value,
                  border: `1px solid ${colors.border.light}`,
                }}
              >
                <span className="font-semibold" style={{ color: colors.text.primary }}>
                  {name}
                </span>
              </div>
              <code className="text-xs break-words" style={{ color: colors.text.tertiary }}>
                {value}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* Border Radius */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.light}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
          Border Radius
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(designTokens.borderRadius).map(([name, value]: [string, any]) => (
            <div key={name} className="text-center">
              <div
                className="h-20 mb-2"
                style={{
                  backgroundColor: colors.accent.primary,
                  borderRadius: value,
                }}
              />
              <div className="font-semibold" style={{ color: colors.text.primary }}>
                {name}
              </div>
              <div className="text-sm" style={{ color: colors.text.tertiary }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.light}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
          Spacing Scale
        </h2>
        <div className="space-y-3">
          {Object.entries(designTokens.spacing).map(([name, value]: [string, any]) => (
            <div key={name} className="flex items-center gap-4">
              <div className="w-16 font-semibold" style={{ color: colors.text.primary }}>
                {name}
              </div>
              <div
                className="rounded"
                style={{
                  width: value,
                  height: '2rem',
                  backgroundColor: colors.accent.primary,
                }}
              />
              <div className="text-sm" style={{ color: colors.text.tertiary }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.light}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
          Typography Scale
        </h2>
        <div className="space-y-4">
          {Object.entries(designTokens.typography.fontSize).map(([name, value]: [string, any]) => (
            <div key={name} className="flex items-baseline gap-4">
              <div className="w-16 text-sm font-semibold" style={{ color: colors.text.tertiary }}>
                {name}
              </div>
              <div style={{ fontSize: value, color: colors.text.primary }}>
                The quick brown fox jumps over the lazy dog
              </div>
              <div className="text-sm ml-auto" style={{ color: colors.text.tertiary }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transitions */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.light}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
          Transition Süreleri
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(designTokens.transitions).map(([name, value]: [string, any]) => (
            <div key={name} className="text-center">
              <div
                className="h-20 rounded-lg mb-2 flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                style={{
                  backgroundColor: colors.accent.primary,
                  transitionDuration: value,
                }}
              >
                <span className="font-semibold" style={{ color: colors.background.primary }}>
                  Hover
                </span>
              </div>
              <div className="font-semibold" style={{ color: colors.text.primary }}>
                {name}
              </div>
              <div className="text-sm" style={{ color: colors.text.tertiary }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Z-Index */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.light}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
          Z-Index Katmanları
        </h2>
        <div className="space-y-2">
          {Object.entries(designTokens.zIndex).map(([name, value]: [string, any]) => (
            <div key={name} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: colors.background.tertiary }}>
              <div className="font-semibold" style={{ color: colors.text.primary }}>
                {name}
              </div>
              <div className="font-mono font-bold" style={{ color: colors.accent.primary }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
