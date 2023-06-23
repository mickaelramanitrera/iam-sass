import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

type Menu = {
  title: string;
  href: string;
  icon: keyof typeof Icons;
};

const menus: Menu[] = [
  { title: "dashboard", href: "/dashboard", icon: "post" },
  {
    title: "organizations",
    href: "/organizations",
    icon: "add",
  },
  { title: "users", href: "/users", icon: "user" },
  { title: "settings", href: "/settings", icon: "settings" },
];

export const Aside = () => {
  const path = usePathname();

  return (
    <aside className="px-8">
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
    </aside>
  );
};
