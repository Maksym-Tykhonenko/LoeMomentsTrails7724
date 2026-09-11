import React, { memo, useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import alltasks from '../../dataforapp/alltasks';
import { PhotoEntry } from '../../engine/helpers/types';
import { AppText } from '../../ui/primitives/AppText';
import { AppButton } from '../../ui/primitives/AppButton';
import { AppCard } from '../../ui/primitives/AppCard';
import { colors } from '../../core/theme/colors';
import { dimensions, radius, spacing } from '../../core/dimensions/tokens';
import { ArrowPathIcon } from 'react-native-heroicons/outline';

type Props = {
  photos: PhotoEntry[];
  onAddPhoto: (photo: PhotoEntry) => void;
};

const PhotoHuntScreenComponent: React.FC<Props> = ({ photos, onAddPhoto }) => {
  const [seed, setSeed] = useState(0);

  const challenge = useMemo(() => {
    const index = Math.abs(seed) % alltasks.length;
    return alltasks[index];
  }, [seed]);

  const stats = useMemo(() => {
    const completed = photos.length;
    return {
      completed,
      active: completed > 0 ? 1 : 0,
      total: alltasks.length,
    };
  }, [photos.length]);

  const uploadChallengePhoto = async () => {
    const response = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    const picked = response.assets?.[0];
    if (!picked?.uri) {
      return;
    }

    onAddPhoto({
      id: `${Date.now()}`,
      challengeTitle: challenge.title,
      uri: picked.uri,
      createdAt: Date.now(),
    });
  };

  return (
    <View style={styles.container}>
      <AppText variant="title">Photo Hunt</AppText>
      <View style={styles.statsRow}>
        <AppCard style={styles.statCard}>
          <AppText variant="label" color={colors.textMuted}>Completed</AppText>
          <AppText variant="section">{stats.completed}</AppText>
        </AppCard>
        <AppCard style={styles.statCard}>
          <AppText variant="label" color={colors.textMuted}>Active</AppText>
          <AppText variant="section">{stats.active}</AppText>
        </AppCard>
        <AppCard style={styles.statCard}>
          <AppText variant="label" color={colors.textMuted}>Total</AppText>
          <AppText variant="section">{stats.completed + stats.active}</AppText>
        </AppCard>
      </View>

      <AppCard style={styles.challengeCard}>
        <View style={styles.challengeHeader}>
          <AppText variant="section">{challenge.title}</AppText>
          <Pressable onPress={() => setSeed(Date.now())} style={styles.shuffleBtn}>
            <ArrowPathIcon color={colors.accent} size={18} />
          </Pressable>
        </View>
        <AppText variant="bodySmall" color={colors.textSecondary}>{challenge.description}</AppText>
        <AppButton title="Generate Hunt Challenge" onPress={() => setSeed(Date.now())} style={styles.challengeButton} />
      </AppCard>

      <AppButton title="Upload Photo" onPress={uploadChallengePhoto} />

      <FlatList
        data={photos}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.galleryList}
        ListEmptyComponent={<AppText color={colors.textMuted}>No photos yet.</AppText>}
        renderItem={({ item }) => (
          <AppCard style={styles.photoCard}>
            <Image source={{ uri: item.uri }} style={styles.photo} />
            <View style={styles.meta}>
              <AppText variant="bodySmall" numberOfLines={1}>{item.challengeTitle}</AppText>
              <AppText variant="label" color={colors.textMuted}>{new Date(item.createdAt).toLocaleDateString()}</AppText>
            </View>
          </AppCard>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.sm,
    paddingBottom: dimensions.bottomBarHeight + spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xxs,
  },
  challengeCard: {
    gap: spacing.xs,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  shuffleBtn: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgInput,
  },
  challengeButton: {
    marginTop: spacing.xs,
  },
  galleryList: {
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  photoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  photo: {
    width: 68,
    height: 68,
    borderRadius: radius.sm,
  },
  meta: {
    flex: 1,
    gap: spacing.xxs,
  },
});

export const PhotoHuntScreen = memo(PhotoHuntScreenComponent);
