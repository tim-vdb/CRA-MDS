"use client";

import { NavUser } from "@/features/SideBar/nav-user";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";

export default function Header() {

    return (
        <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
            <div className="flex items-center justify-between gap-2 px-4 w-full">
                <Breadcrumb className="flex items-center gap-2">
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#" className="text-black dark:text-white">
                                Build Your Application
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block text-black dark:text-white" />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-black dark:text-white">Data Fetching</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <NavUser />
            </div>
        </header>
    );
}