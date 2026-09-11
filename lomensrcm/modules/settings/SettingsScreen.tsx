import React, { memo, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { AppSettings } from '../../engine/helpers/types';
import { AppText } from '../../ui/primitives/AppText';
import { AppButton } from '../../ui/primitives/AppButton';
import { SettingToggleRow } from '../../ui/components/SettingToggleRow';
import { colors } from '../../core/theme/colors';
import { dimensions, radius, spacing } from '../../core/dimensions/tokens';

type Props = {
  settings: AppSettings;
  onUpdateSettings: (value: Partial<AppSettings>) => void;
  onClearData: () => Promise<void>;
};

const SettingsScreenComponent: React.FC<Props> = ({ settings, onUpdateSettings, onClearData }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <AppText variant="title">Settings</AppText>
      <AppText variant="bodySmall" color={colors.textMuted}>Tune app behaviour and storage.</AppText>

      <SettingToggleRow
        label="Enable notifications"
        value={settings.notifications}
        onValueChange={value => onUpdateSettings({ notifications: value })}
      />
      <SettingToggleRow
        label="Haptic feedback"
        value={settings.haptics}
        onValueChange={value => onUpdateSettings({ haptics: value })}
      />
      <SettingToggleRow
        label="Auto-save sketches"
        value={settings.autoSaveSketches}
        onValueChange={value => onUpdateSettings({ autoSaveSketches: value })}
      />

      <AppButton title="Clear App Data" variant="danger" onPress={() => setIsModalVisible(true)} style={styles.clearBtn} />

      <Modal transparent animationType="fade" visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <AppText variant="section">Clear app data?</AppText>
            <AppText variant="bodySmall" color={colors.textSecondary}>
              This action removes saved places, personal spots, photos and sketches.
            </AppText>
            <View style={styles.actions}>
              <AppButton title="Cancel" variant="ghost" onPress={() => setIsModalVisible(false)} style={styles.actionBtn} />
              <AppButton
                title="Clear Data"
                variant="danger"
                onPress={async () => {
                  await onClearData();
                  setIsModalVisible(false);
                }}
                style={styles.actionBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.sm,
    paddingBottom: dimensions.bottomBarHeight + spacing.md,
  },
  clearBtn: {
    marginTop: spacing.sm,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  modalCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.md,
    gap: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  actionBtn: {
    flex: 1,
  },
});

export const SettingsScreen = memo(SettingsScreenComponent);
