import React, { memo, useMemo, useState } from 'react';
import { Dimensions, FlatList, Image, Modal, Pressable, Share, StyleSheet, TextInput, View } from 'react-native';
import locations from '../../dataforapp/locations';
import { LocationItem } from '../../engine/helpers/types';
import { AppText } from '../../ui/primitives/AppText';
import { AppCard } from '../../ui/primitives/AppCard';
import { AppButton } from '../../ui/primitives/AppButton';
import { SegmentedSwitch } from '../../ui/components/SegmentedSwitch';
import { colors } from '../../core/theme/colors';
import { dimensions, fontSizes, iconSizes, radius, spacing } from '../../core/dimensions/tokens';
import { BookmarkIcon as BookmarkOutline, ShareIcon } from 'react-native-heroicons/outline';
import { BookmarkIcon as BookmarkSolid, XMarkIcon } from 'react-native-heroicons/solid';

type Props = {
  savedLookup: Record<number, boolean>;
  onToggleSaved: (id: number) => void;
};

type ExploreFilter = 'all' | 'saved';

const ExploreScreenComponent: React.FC<Props> = ({ savedLookup, onToggleSaved }) => {
  const [filter, setFilter] = useState<ExploreFilter>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<LocationItem | null>(null);

  const filteredData = useMemo(() => {
    return (locations as LocationItem[]).filter(item => {
      const bySaved = filter === 'saved' ? !!savedLookup[item.id] : true;
      const byQuery = item.title.toLowerCase().includes(query.trim().toLowerCase());
      return bySaved && byQuery;
    });
  }, [filter, query, savedLookup]);

  const showSavedEmptyState = filter === 'saved' && filteredData.length === 0;

  return (
    <View style={styles.container}>
      <AppText variant="title">Explore</AppText>
      <AppText variant="bodySmall" color={colors.textMuted}>
        Find scenic locations, save favourites and open details.
      </AppText>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search locations"
        placeholderTextColor={colors.textMuted}
        style={styles.search}
      />

      <SegmentedSwitch
        value={filter}
        onChange={setFilter}
        options={[
          { label: 'All', value: 'all' },
          { label: `Saved (${Object.keys(savedLookup).length})`, value: 'saved' },
        ]}
      />

      <FlatList
        contentContainerStyle={styles.listContent}
        data={filteredData}
        keyExtractor={item => String(item.id)}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={showSavedEmptyState ? (
          <View style={styles.emptyStateWrap}>
            <Image
              source={require('../../laitassets/lfyimages/emptyerrayofsvd.png')}
              style={styles.emptyStateImage}
            />
            <AppText variant="section" style={[styles.emptyStateTitle, {
              fontFamily: 'SpaceGrotesk-Medium',
              fontSize: fontSizes.xl,
            }]}>No saved trails yet</AppText>
            <AppText variant="bodySmall" color={colors.textMuted} style={[styles.emptyStateSubtitle, {
              color: '#8892AA',
              fontSize: fontSizes.md,
              fontFamily: 'SpaceGrotesk-Medium',
            }]}>
              Bookmark locations you love to find them here instantly.
            </AppText>
          </View>
        ) : null}
        renderItem={({ item }) => {
          const isSaved = !!savedLookup[item.id];
          return (
            <Pressable onPress={() => setSelected(item)}>
              <AppCard style={styles.locationCard}>
                <Image source={item.image} style={styles.locationImage} />
                <View style={styles.cardHeader}>
                  <View style={styles.textCol}>
                    <AppText variant="section" numberOfLines={1}>{item.title}</AppText>
                    <AppText variant="bodySmall" color={colors.textSecondary} numberOfLines={1}>
                      {item.location}
                    </AppText>
                  </View>
                  <Pressable onPress={() => onToggleSaved(item.id)} style={styles.bookmarkBtn}>
                    {isSaved ? (
                      <BookmarkSolid color={colors.accent} size={iconSizes.lg} />
                    ) : (
                      <BookmarkOutline color={colors.textSecondary} size={iconSizes.lg} />
                    )}
                  </Pressable>
                </View>
              </AppCard>
            </Pressable>
          );
        }}
      />

      <Modal animationType="slide" visible={!!selected} onRequestClose={() => setSelected(null)}>
        {selected ? (
          <View style={styles.modalRoot}>
            <Image source={selected.image} style={styles.hero} />
            <Pressable style={styles.close} onPress={() => setSelected(null)}>
              <XMarkIcon size={iconSizes.xl} color={colors.textPrimary} />
            </Pressable>

            <View style={styles.modalContent}>
              <AppText variant="title">{selected.title}</AppText>
              <AppText variant="bodySmall" color={colors.textSecondary}>{selected.location}</AppText>
              <AppText variant="body" style={styles.description}>{selected.description}</AppText>
              <View style={styles.actions}>
                <AppButton
                  title={savedLookup[selected.id] ? 'Saved' : 'Save'}
                  onPress={() => onToggleSaved(selected.id)}
                  style={[styles.actionButton, {
                    backgroundColor: savedLookup[selected.id] ? 'rgba(201, 168, 76, 1)' : 'rgba(201, 168, 76, 0.5)',
                  }]}
                  variant={savedLookup[selected.id] ? 'primary' : 'secondary'}
                />
                <AppButton
                  variant="secondary"
                  title="Share"
                  onPress={() => {
                    Share.share({
                        message: `Check out this location: ${selected.title} in ${selected.location}. ${selected.description}`,
                    })
                  }}
                  style={styles.actionButton}
                />
              </View>
            </View>
          </View>
        ) : null}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.sm,
  },
  search: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgInput,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 40,
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
  },
  listContent: {
    paddingTop: spacing.xs,
    gap: spacing.sm,
    paddingBottom: dimensions.bottomBarHeight + spacing.lg,
  },
  emptyStateWrap: {
    marginTop: Dimensions.get('window').height * 0.1,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  emptyStateImage: {
    width: Dimensions.get('window').width * 0.23,
    height: Dimensions.get('window').width * 0.23,
    resizeMode: 'contain',
  },
  emptyStateTitle: {
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    textAlign: 'center',
    maxWidth: 280,
  },

  locationCard: {
    padding: spacing.xs,
  },


  locationImage: {
    width: '100%',
    height: dimensions.cardImageHeight,
    borderRadius: radius.md,
  },



  cardHeader: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  textCol: {
    flex: 1,
  },
  bookmarkBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalRoot: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  hero: {
    width: '100%',
    height: dimensions.detailHeroHeight,
  },
  close: {
    position: 'absolute',
    top: dimensions.topInset,
    right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: radius.pill,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  description: {
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  shareIconWrap: {
    alignItems: 'flex-end',
  },
});

export const ExploreScreen = memo(ExploreScreenComponent);
