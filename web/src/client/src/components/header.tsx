'use client';
import { Logo } from '@/components/base/logo';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConnectKitButton } from 'connectkit';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-background-[#10131A]">
      <div className="container px-12 h-16 flex items-center justify-between">
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
          <Select defaultValue="base">
            <SelectTrigger className="w-[100px] bg-background border-border">
              <SelectValue placeholder="Chain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="base">Base</SelectItem>
              <SelectItem value="optimism">Optimism</SelectItem>
              <SelectItem value="arbitrum">Arbitrum</SelectItem>
            </SelectContent>
          </Select>
          <ConnectKitButton
            customTheme={{
              '--ck-connectbutton-background': '#1A1D24',
              '--ck-connectbutton-color': '#AAAABF',
              '--ck-connectbutton-hover-background': '#21212E',
              '--ck-connectbutton-active-background': '#21212E',
            }}
          />
        </div>
      </div>
    </header>
  );
};
