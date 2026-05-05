import {Collection} from "@/src/types";

export type NavigationItem = {
  label: string;
  path?: string;
  icon?: React.ReactNode;
  children?: NavigationItem[];
};

export interface HeaderProps {
  collection: Collection;
  collections: Collection[]
  handleChange: (x: Collection) => void
}