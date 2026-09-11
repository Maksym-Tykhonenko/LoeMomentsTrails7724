import React, { memo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../../core/theme/colors';
import { radius, spacing } from '../../core/dimensions/tokens';

type Props = {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

const AppCardComponent: React.FC<Props> = ({ style, children }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
  },
});

export const AppCard = memo(AppCardComponent);
