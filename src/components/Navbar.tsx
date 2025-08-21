'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/market', label: 'Market' },
    { href: '/orders', label: 'Orders' },
  ];

  return (
    <Card className="p-4 mb-6">
      <nav className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-primary">Nexus Trading</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? 'default' : 'outline'}
                size="sm"
                className="text-sm"
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </nav>
    </Card>
  );
}
