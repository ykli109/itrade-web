'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-10 right-10 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 w-64">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">联系方式</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="space-y-4">
            <div className="text-center">
              <Image 
                src="/group.png" 
                alt="联系二维码" 
                className="w-32 h- mx-auto mb-2"
                width={128}
                height={168}
              />
              <p className="text-sm text-gray-600">扫描二维码联系我们</p>
            </div>
            <div className="text-sm text-gray-600">
              <p>邮箱：ykli109@outlook.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 