'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { X, Menu } from 'lucide-react';

interface MobileNavProps {
  navItems: Array<{ href: string; label: string; icon: React.ReactNode }>;
}

export function MobileNav({ navItems }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden"
        onClick={toggleMenu}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={closeMenu}
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 max-w-[80vw] bg-white shadow-2xl z-50 flex flex-col md:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-white font-bold text-sm">N</span>
                  </div>
                  <span className="font-bold text-xl">Nexus</span>
                </div>
                <Button variant="ghost" size="sm" onClick={closeMenu}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 p-4">
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} onClick={closeMenu}>
                      <Button
                        variant={pathname === item.href ? 'default' : 'ghost'}
                        size="lg"
                        className="w-full justify-start"
                      >
                        <span className="mr-3">{item.icon}</span>
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Footer */}
              <div className="p-4 border-t">
                <div className="text-sm text-gray-500">
                  <p>Nexus Trading Platform</p>
                  <p>v1.0.0</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
