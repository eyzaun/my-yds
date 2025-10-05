import React from 'react';

const BUILD_TIME = new Date().toLocaleString('tr-TR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});

export default function Layout({ children }) {
  return (
    <>
      <div 
        style={{
          background: '#f0f0f0',
          padding: '5px 10px',
          fontSize: '12px',
          textAlign: 'center',
          fontWeight: 'bold',
          borderBottom: '1px solid #ddd'
        }}
      >
        Son Güncelleme: {BUILD_TIME}
      </div>
      
      {children}
    </>
  );
}