import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../../core/theme/colors';
import { radius, spacing } from '../../core/dimensions/tokens';
import { AppText } from '../primitives/AppText';

type Option<T extends string> = {
  label: string;
  value: T;
};

type Props<T extends string> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
};

function SegmentedSwitchComponent<T extends string>({ value, options, onChange }: Props<T>) {
  return (
    <View style={styles.wrapper}>
      {options.map(option => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.item, selected && styles.selected]}
          >
            <AppText variant="label" color={selected ? '#2C2B16' : colors.textSecondary}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    gap: spacing.xs,
    backgroundColor: colors.bgInput,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.xxs,
  },
  item: {
    flex: 1,
    borderRadius: radius.sm,
    minHeight: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: colors.accent,
  },
});

export const SegmentedSwitch = memo(SegmentedSwitchComponent) as typeof SegmentedSwitchComponent;
