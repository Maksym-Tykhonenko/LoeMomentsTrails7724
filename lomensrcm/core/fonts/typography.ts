import { fontSizes } from '../dimensions/tokens';
import { fontFamily } from './fontFamily';

export const typography = {
  title: {
    fontFamily: fontFamily.spaceGroteskBold,
    fontSize: fontSizes.xl,
    lineHeight: 28,
  },
  section: {
    fontFamily: fontFamily.sfDisplayMedium,
    fontSize: fontSizes.lg,
    lineHeight: 24,
  },
  body: {
    fontFamily: fontFamily.sfTextRegular,
    fontSize: fontSizes.md,
    lineHeight: 21,
  },
  bodySmall: {
    fontFamily: fontFamily.sfTextRegular,
    fontSize: fontSizes.sm,
    lineHeight: 18,
  },
  label: {
    fontFamily: fontFamily.poppinsSemiBold,
    fontSize: fontSizes.xs,
    lineHeight: 16,
  },
} as const;
