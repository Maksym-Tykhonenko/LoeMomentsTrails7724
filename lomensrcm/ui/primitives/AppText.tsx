import { typography } from '../../core/fonts/typography';


import { StyleProp, 
    StyleSheet, 
    Text,
     TextProps,
     TextStyle } from 'react-native';

import React, { memo } from 'react';

import { colors } from '../../core/theme/colors';

type Props = TextProps & {
  variant?: 'title' | 'section' | 'body' | 'bodySmall' | 'label';
  color?: string;
  style?: StyleProp<TextStyle>;
};

const AppTextComponent: React.FC<Props> = ({
  variant = 'body',
  color = colors.textPrimary,
  style,
  children,
  ...rest
}) => {
  return (
    <Text {...rest} style={[styles.base, typography[variant], { color }, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});

export const AppText = memo(AppTextComponent);
