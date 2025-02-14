'use client';
import { Logo } from '@/components/base/logo';
import { ChainSelector } from '@/components/chain-selector';
import { ConnectButton } from '@/components/connect-button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {} from '@/components/ui/select';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo height={34} width={32} />
          <NavigationMenu>
            <NavigationMenuList className="gap-4">
              <NavigationMenuItem>
                <Link href="/" legacyBehavior={true} passHref={true}>
                  <NavigationMenuLink
                    className={`text-sm transition-colors hover:text-white py-1 ${
                      pathname === '/'
                        ? 'text-white border-b-2 border-primary'
                        : 'text-text-secondary'
                    }`}
                  >
                    Agent
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/dashboard" legacyBehavior={true} passHref={true}>
                  <NavigationMenuLink
                    className={`text-sm transition-colors hover:text-white ${
                      pathname === '/dashboard'
                        ? 'text-white border-b-2 border-primary'
                        : 'text-text-secondary'
                    }`}
                  >
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <ChainSelector />
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};
