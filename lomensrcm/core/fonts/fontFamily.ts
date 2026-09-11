export const fontFamily = {
  poppinsRegular: 'Poppins-Regular',
  poppinsSemiBold: 'Poppins-SemiBold',
  sfDisplayMedium: 'SF-Pro-Display-Medium',
  sfDisplayRegular: 'SF-Pro-Display-Regular',
  sfTextRegular: 'SFProText-Regular',
  sfTextSemiBold: 'SFProText-Semibold',
  spaceGroteskRegular: 'SpaceGrotesk-Regular',
  spaceGroteskMedium: 'SpaceGrotesk-Medium',
  spaceGroteskBold: 'SpaceGrotesk-Bold',
} as const;

export type FontFamilyKey = keyof typeof fontFamily;
