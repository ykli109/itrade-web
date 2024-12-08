'use client';

import { defaultNavConfig } from '@/config/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 h-screen w-44 bg-white border-r border-gray-200 p-4 space-y-2 overflow-y-auto">
      {defaultNavConfig.map((item) => (
        <div key={item.id} className="space-y-1">
          <Link
            href={item.path}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              pathname === item.path 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="w-4 h-4">{item.icon}</span>
            <span className="font-medium text-sm">{item.title}</span>
          </Link>
          {item.children && (
            <div className="ml-6 space-y-0.5">
              {item.children.map((child) => (
                <Link
                  key={child.id}
                  href={child.path}
                  className={`block px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    pathname === child.path
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {child.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}