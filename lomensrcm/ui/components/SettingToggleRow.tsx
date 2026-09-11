import React, { memo } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { AppText } from '../primitives/AppText';
import { colors } from '../../core/theme/colors';
import { AppCard } from '../primitives/AppCard';
import { spacing } from '../../core/dimensions/tokens';

type Props = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

const SettingToggleRowComponent: React.FC<Props> = ({ label, value, onValueChange }) => {
  return (
    <AppCard style={styles.card}>
      <View style={styles.row}>
        <AppText variant="body">{label}</AppText>
        <Switch
          value={value}
          onValueChange={onValueChange}
          thumbColor={colors.white}
          trackColor={{ false: colors.borderStrong, true: colors.accentGreen }}
        />
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});

export const SettingToggleRow = memo(SettingToggleRowComponent);
