import * as React from "react";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@radix-ui/react-navigation-menu";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Image,
  StoreIcon,
  LinkIcon,
  MousePointerClick,
  Star,
} from "lucide-react";
import clsx from "clsx";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Background Carousel", icon: Image, path: "/bgcarousel" },
  { label: "Store Links", icon: StoreIcon, path: "/storelinks" },
  { label: "Social Links", icon: LinkIcon, path: "/sociallinks" },
  { label: "Navbar Buttons", icon: MousePointerClick, path: "/navbarbuttons" },
  { label: "Reviews", icon: Star, path: "/reviews" },
];

export default function ModernSidebar() {
  const location = useLocation();
  return (
  <aside className="h-[100dvh] w-64 bg-white/70 dark:bg-zinc-900/80 backdrop-blur-md border-r border-zinc-200 dark:border-zinc-800 shadow-xl flex flex-col">
      <div className="px-12 py-4 text-2xl font-extrabold tracking-tight text-blue-900 dark:text-blue-400 select-none border-b-2">
        Admin Panel
      </div>
      <NavigationMenu orientation="vertical" className="flex-1 px-8 py-4">
        <NavigationMenuList className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <NavigationMenuItem key={item.label}>
                <Link
                  to={item.path}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-full font-medium transition-all group",
                    "hover:bg-blue-100 dark:hover:bg-zinc-800 dark:text-zinc-400 hover:text-blue-900 dark:hover:text-blue-500",
                    active &&
                      "bg-blue-600/90 text-white dark:bg-blue-500/80 dark:text-white shadow-lg scale-105"
                  )}
                >
                  <Icon className={clsx("w-6 h-6 transition-colors", active ? "text-yellow-300" : "text-blue-600 dark:text-blue-500 group-hover:text-yellow-400")}/>
                  <span className="tracking-wide">{item.label}</span>
                </Link>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </aside>
  );
}
