import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#000000] text-[#ffffff] flex flex-col font-sans relative">
      <Header />
      
      {/* 
        CHANGED HERE: Increased to pt-44 (176px) for mobile to clear the taller 2-row header, 
        but kept it at lg:pt-32 (128px) for desktop where the header is shorter.
      */}
      <main className="flex-grow flex flex-col pt-44 lg:pt-32">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;