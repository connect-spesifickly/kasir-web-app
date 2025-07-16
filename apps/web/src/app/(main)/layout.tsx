"use client";

import { PageType } from "@/interfaces/page-type";
import { redirect, usePathname, useRouter } from "next/navigation";
import SidebarPage from "./_components/sidebar";
import BottomNavigation from "./_components/bottom-navigation";
import { Navbar } from "@/components/ui/navbar/main-navbar";
import { useSession } from "next-auth/react";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  React.useEffect(() => {
    const waitForSession = async () => {
      if (status === "unauthenticated") {
        redirect("/login");
      }
      if (status === "authenticated") {
        redirect("/sale");
      }
    };
    if (status === "loading") return;
    waitForSession();
  }, [session, status]);
  const router = useRouter();
  const pathname = usePathname();

  const getActivePage = (): PageType => {
    if (pathname.startsWith("/sale")) return "sale";
    if (pathname.startsWith("/product")) return "product";
    if (pathname.startsWith("/report")) return "report";
    if (pathname.startsWith("/adjustment")) return "adjustment";
    return "sale";
  };

  const bottomNavItems = [
    {
      id: 1,
      label: "Sale",
      icon: (
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007 17h10a1 1 0 00.95-.68L21 13M7 13V6a1 1 0 011-1h5a1 1 0 011 1v7"
          />
        </svg>
      ),
      href: "/sale",
    },
    {
      id: 2,
      label: "Product",
      icon: (
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
          />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      href: "/product",
    },
    {
      id: 3,
      label: "Report",
      icon: (
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3v18h18"
          />
          <rect x="7" y="13" width="3" height="5" rx="1" />
          <rect x="12" y="9" width="3" height="9" rx="1" />
          <rect x="17" y="6" width="3" height="12" rx="1" />
        </svg>
      ),
      href: "/report",
    },
    {
      id: 4,
      label: "Adjustment",
      icon: (
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="3" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19.4 15A7.97 7.97 0 0021 12c0-4.42-3.58-8-8-8S5 7.58 5 12c0 1.07.21 2.09.6 3"
          />
        </svg>
      ),
      href: "/adjustment",
    },
  ];

  const handlePageChange = (page: PageType) => {
    if (page === "sale") router.push("/sale");
    else if (page === "product") router.push("/product");
    else if (page === "report") router.push("/report");
    else if (page === "adjustment") router.push("/adjustment");
  };
  return (
    <div className="flex-col  ">
      <Navbar className="border-b-[1px] border-slate-200 " />
      <div className="flex h-full min-h-[90vh] min-w-[calc(100vw)] ">
        <aside className="">
          <SidebarPage
            activePage={getActivePage()}
            onPageChange={handlePageChange}
          />
        </aside>
        <BottomNavigation items={bottomNavItems} />
        <main className="w-full h-full min-h-[90vh]">
          <div className="flex sm:px-7 px-5 pt-[0px] lg:border-l-2 min-h-[91vh] pb-12 lg:pb-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
