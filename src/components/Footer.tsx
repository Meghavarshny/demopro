
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-8 mt-12 shadow-lg">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="text-2xl">👨‍💻</span>
          <p className="text-xl font-semibold tracking-wide">
            Made with <span className="text-orange-200 text-2xl">❤️</span> by{' '}
            <span className="font-bold text-orange-100 hover:text-white transition-colors cursor-pointer">
              Meghavarshy
            </span>
          </p>
        </div>
        <div className="w-24 h-1 bg-orange-300 mx-auto rounded-full"></div>
      </div>
    </footer>
  );
};

export default Footer;
