"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

export function BreadcrumbNav() {
  const pathname = usePathname();
  const pathSegments = decodeURIComponent(
    pathname
      .split("/folder/")
      .filter((segment) => segment && segment !== "/")
      .join("/"),
  )
    .split("/")
    .filter(Boolean);

  console.log(pathSegments);

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Files</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Separator after root */}
        {pathSegments.length > 0 && <BreadcrumbSeparator />}

        {/* Dynamically generate breadcrumb items based on path segments */}
        {pathSegments.map((segment, index) => {
          const href =
            "/folder/" +
            encodeURIComponent(pathSegments.slice(0, index + 1).join("/"));

          const Comp =
            index === pathSegments.length - 1 ? BreadcrumbPage : BreadcrumbLink;

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                <Comp asChild>
                  <Link href={href}>{segment}</Link>
                </Comp>
              </BreadcrumbItem>
              {index < pathSegments.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
