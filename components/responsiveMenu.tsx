import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Menu = {
  title: string;
  href: string;
  icon: keyof typeof Icons;
};

export const menus: Menu[] = [
  { title: "Home", href: "/dashboard", icon: "home" },
  {
    title: "Organizations",
    href: "/dashboard/organizations",
    icon: "building",
  },
  { title: "Users", href: "/dashboard/users", icon: "users" },
  { title: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export const DesktopMenu: FC<{}> = () => {
  const path = usePathname();

  return (
    <nav className="grid items-start gap-2">
      {menus.map((menu, index) => {
        const MenuIcon = Icons[menu.icon];

        return (
          <Link key={index} href={menu.href}>
            <span
              className={cn(
                `group flex items-center rounded-md px-3 
                    py-2 text-sm font-light 
                    hover:bg-accent hover:text-accent-foreground hover:font-medium`,
                path === menu.href ? "bg-accent font-normal" : "transparent"
              )}
            >
              <MenuIcon className="mr-2 h-4 w-4" />
              <span>{menu.title}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

type mobileMenuProps = {
  className?: string;
  onLogout: () => void;
};

export const MobileMenu: FC<mobileMenuProps> = ({ className, onLogout }) => {
  const path = usePathname();

  return (
    <nav className={`grid ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Icons.menu className="w-3 h-3 mx-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            {menus.map((menu, index) => (
              <DropdownMenuItem
                asChild
                key={index}
                className={cn(
                  path === menu.href ? "bg-accent font-normal" : "transparent"
                )}
              >
                <Link key={index} href={menu.href}>
                  {menu.title}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem key={menus.length} onSelect={onLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};
