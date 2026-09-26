import {
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  Boxes,
  ClipboardPenLine,
  LayoutDashboard,
  MapPinned,
  PackageSearch,
  ScrollText,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  stage: 3 | 4 | 5 | 6;
};

export type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

export const navigationGroups: NavigationGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, stage: 3 },
    ],
  },
  {
    label: "Inventory",
    items: [
      { href: "/products", label: "Products", icon: Boxes, stage: 4 },
      { href: "/operations/receipts", label: "Receipts", icon: ArrowDownToLine, stage: 5 },
      { href: "/operations/deliveries", label: "Deliveries", icon: ArrowUpFromLine, stage: 5 },
      { href: "/operations/transfers", label: "Transfers", icon: ArrowLeftRight, stage: 5 },
      { href: "/operations/adjustments", label: "Adjustments", icon: ClipboardPenLine, stage: 5 },
      { href: "/moves", label: "Move history", icon: ScrollText, stage: 6 },
    ],
  },
  {
    label: "Configure",
    items: [
      { href: "/settings/warehouses", label: "Warehouses", icon: MapPinned, stage: 4 },
      { href: "/profile", label: "Profile", icon: PackageSearch, stage: 3 },
    ],
  },
];

export function isNavigationItemActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
