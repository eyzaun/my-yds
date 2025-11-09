'use client';

import React, { useState, useRef } from 'react';
import { Card } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { Input } from '@/components/design-system/Input';
import { useDesignTokens } from '@/hooks/useDesignTokens';

interface ExcelUploaderProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

export default function ExcelUploader({
  onFileUpload,
  isLoading
}: ExcelUploaderProps) {
  const designTokens = useDesignTokens();
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is Excel
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('Lütfen geçerli bir Excel dosyası (.xlsx veya .xls) yükleyin.');
      return;
    }
    
    setFileName(file.name);
    onFileUpload(file);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    // Check if file is Excel
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('Lütfen geçerli bir Excel dosyası (.xlsx veya .xls) yükleyin.');
      return;
    }
    
    setFileName(file.name);
    onFileUpload(file);
  };
  
  return (
    <Card>
      <div
        className="border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-opacity-90 transition"
        style={{
          backgroundColor: designTokens.colors.background.primary,
          borderColor: `${designTokens.colors.accent.primary}50`,
          color: designTokens.colors.text.primary,
          padding: designTokens.spacing[12]
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
        />

        {isLoading ? (
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-10 w-10"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              style={{
                color: designTokens.colors.accent.primary,
                marginBottom: designTokens.spacing[2]
              }}
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-lg font-medium" style={{ color: designTokens.colors.text.primary }}>Dosya işleniyor...</p>
          </div>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{
                color: designTokens.colors.accent.primary,
                marginBottom: designTokens.spacing[6]
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>

            {fileName ? (
              <>
                <p className="font-medium" style={{ color: designTokens.colors.text.primary }}>Seçilen Dosya: {fileName}</p>
                <p
                  className="text-sm opacity-70"
                  style={{
                    color: designTokens.colors.text.primary,
                    marginTop: designTokens.spacing[1]
                  }}
                >
                  Başka bir dosya seçmek için tıklayın veya sürükleyin
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium" style={{ color: designTokens.colors.text.primary }}>Excel dosyanızı sürükleyip bırakın</p>
                <p
                  className="text-sm opacity-70"
                  style={{
                    color: designTokens.colors.text.primary,
                    marginTop: designTokens.spacing[1]
                  }}
                >
                  veya dosya seçmek için tıklayın
                </p>
              </>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
