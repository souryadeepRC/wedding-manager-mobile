import { useChecklistTileStat } from "@/features/checklist";
import { useExpenseTileStat } from "@/features/expenses";
import { useGuestTileStat } from "@/features/guests";
import { useShoppingTileStat } from "@/features/shopping";
import type { Ionicons } from "@expo/vector-icons";
import type { Href } from "expo-router";
import type { ComponentProps } from "react";

export type ModuleStatus = "live" | "soon";

export type ModuleEntry = {
  id: string;
  title: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  route: Href;
  status: ModuleStatus;
  order: number;
  useStat?: () => string | undefined;
};

const entries: ModuleEntry[] = [
  {
    id: "guests",
    title: "Guests",
    icon: "people",
    route: "/guests",
    status: "live",
    order: 1,
    useStat: useGuestTileStat,
  },
  {
    id: "expenses",
    title: "Expenses",
    icon: "wallet",
    route: "/expenses" as Href,
    status: "live",
    order: 2,
    useStat: useExpenseTileStat,
  },
  {
    id: "shopping",
    title: "Shopping",
    icon: "bag-handle",
    route: "/shopping" as Href,
    status: "live",
    order: 3,
    useStat: useShoppingTileStat,
  },
  {
    id: "checklist",
    title: "Checklist",
    icon: "checkbox",
    route: "/checklist" as Href,
    status: "live",
    order: 4,
    useStat: useChecklistTileStat,
  },
];

export const registry = [...entries].sort((a, b) => a.order - b.order);
