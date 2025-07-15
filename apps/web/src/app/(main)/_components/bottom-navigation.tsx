"use client";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/api/utils";

interface IItem {
  id: number;
  label: string;
  icon: React.JSX.Element;
  href?: string;
  action?: () => void;
}

interface BottomNavigationProps {
  items: IItem[];
}

interface NavigationItemProps {
  item: IItem;
  className?: string;
}

export default function BottomNavigation({ items }: BottomNavigationProps) {
  return (
    <div>
      <nav className="border-border h-[50px] fixed bottom-0 left-0 z-40 flex w-full items-center justify-between border-t bg-white shadow lg:hidden">
        {items &&
          items.length > 0 &&
          items.map((item, index) => (
            <NavigationItem key={index} item={item} />
          ))}
      </nav>
    </div>
  );
}

const NavigationItem = ({ item, className }: NavigationItemProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  const isActive = item.href ? item.href === currentUrl : false;

  const handleClick = (e: React.MouseEvent) => {
    if (item.action) {
      e.preventDefault();
      item.action();
    }
  };

  if (item.action) {
    return (
      <button
        onClick={handleClick}
        arial-label={`${item.label} page`}
        className={cn(
          "text-primary-gray hover:bg-primary-gray-background flex h-full w-full cursor-pointer flex-col items-center justify-center bg-white transition-all duration-300 ease-in-out active:bg-white",
          className
        )}
      >
        <div className="flex items-center justify-center w-4 h-4">
          {item.icon}
        </div>
        <span className="text-[10px]">{item.label}</span>
      </button>
    );
  }
  return (
    <Link
      href={item.href || "#"}
      aria-label={`${item.label} page`}
      className={cn(
        "flex h-full w-full p-1 cursor-pointer flex-col items-center justify-center bg-white transition-all duration-300 ease-in-out active:bg-white",
        {
          "text-blue-500 border-x-blue-500 border-t": isActive,
        },
        className
      )}
    >
      <div className="flex items-center justify-center w-6 h-6">
        {item.icon}
      </div>
      <span className="text-[11px]">{item.label}</span>
    </Link>
  );
};
