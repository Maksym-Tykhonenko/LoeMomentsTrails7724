import React, { memo } from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../core/theme/colors';
import { radius, spacing } from '../../core/dimensions/tokens';
import { AppText } from './AppText';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

const AppButtonComponent: React.FC<Props> = ({ title, onPress, variant = 'primary', style, disabled }) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.base, styles[variant], pressed && !disabled && styles.pressed, disabled && styles.disabled, style]}
    >
      <AppText variant="label" style={[styles.label, variant === 'primary' && styles.primaryLabel]}>
        {title}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 42,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
  },
  primary: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.bgInput,
    borderColor: colors.borderStrong,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: 'transparent',
    borderColor: colors.danger,
  },
  label: {
    color: colors.textPrimary,
  },
  primaryLabel: {
    color: '#2C2B16',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
});

export const AppButton = memo(AppButtonComponent);
