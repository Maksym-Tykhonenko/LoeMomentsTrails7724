import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const fontSizes = {
  xxs: 10,
  xs: 12,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 30,
} as const;

export const iconSizes = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 22,
  xl: 28,
} as const;

export const dimensions = {
  screenWidth: width,
  screenHeight: height,
  bottomBarHeight: 70,
  topInset: 46,
  cardImageHeight: 128,
  detailHeroHeight: 260,
} as const;
