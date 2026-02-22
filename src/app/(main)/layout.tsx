"use client";

import MainLayout from "../MainLayout";

export default function MainRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
