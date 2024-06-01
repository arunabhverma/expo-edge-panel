import { Ionicons } from "@expo/vector-icons";
import { ViewToken } from "react-native";
import { SharedValue } from "react-native-reanimated";

export interface iconType {
  name: keyof typeof Ionicons.glyphMap;
  component: typeof Ionicons;
  color?: string;
}

export interface edgeMenuItem {
  id: string;
  title?: string;
  bg?: string;
  icon: iconType;
}

export interface edgeRenderData {
  top?: object;
  middle?: edgeMenuItem[];
  bottom?: object;
}

export interface mainDATAType {
  middle?: edgeMenuItem[];
}

export interface edgeMenuItemType {
  item: mainDATAType;
  index: number;
  translationX: SharedValue<number>;
  itemWidth: number;
  gap: number;
  data: mainDATAType[];
}

export interface edgeMenuType {
  listWidth: number;
  itemWidth: number;
  gap: number;
  data: mainDATAType[];
}

export type viewableItemsType = ViewToken<mainDATAType>[];

export interface PaginationRenderType {
  index: number;
  currentIndex: SharedValue<number | null>;
}
