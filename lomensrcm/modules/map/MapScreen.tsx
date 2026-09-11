import React, { memo, useMemo, useRef, useState } from 'react';
import { FlatList, Image, Keyboard, Modal, Pressable, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import locations from '../../dataforapp/locations';
import { LocationItem, MySpot } from '../../engine/helpers/types';
import { AppText } from '../../ui/primitives/AppText';
import { AppButton } from '../../ui/primitives/AppButton';
import { AppCard } from '../../ui/primitives/AppCard';
import { SegmentedSwitch } from '../../ui/components/SegmentedSwitch';
import { colors } from '../../core/theme/colors';
import { dimensions, radius, spacing } from '../../core/dimensions/tokens';
import { TrashIcon, XMarkIcon } from 'react-native-heroicons/outline';

type Props = {
  mySpots: MySpot[];
  onAddSpot: (spot: MySpot) => void;
  onRemoveSpot: (id: string) => void;
};

type MapTab = 'trail' | 'my';

const initialForm = {
  title: '',
  place: '',
  note: '',
  tags: '',
};

const MapScreenComponent: React.FC<Props> = ({ mySpots, onAddSpot, onRemoveSpot }) => {
  const [activeTab, setActiveTab] = useState<MapTab>('trail');
  const [randomPreview, setRandomPreview] = useState<LocationItem | null>(null);
  const [selectedPinId, setSelectedPinId] = useState<number | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [form, setForm] = useState(initialForm);
  const mapRef = useRef<MapView | null>(null);

  const list = locations as LocationItem[];

  const region = useMemo(
    () => ({
      latitude: 47.2,
      longitude: 9.8,
      latitudeDelta: 35,
      longitudeDelta: 35,
    }),
    [],
  );

  const triggerRandom = () => {
    const randomItem = list[Math.floor(Math.random() * list.length)];
    setRandomPreview(randomItem);
    setSelectedPinId(randomItem.id);
    mapRef.current?.animateToRegion(
      {
        latitude: randomItem.coords[0],
        longitude: randomItem.coords[1],
        latitudeDelta: 10,
        longitudeDelta: 10,
      },
      450,
    );
  };

  const handleMarkerPress = (item: LocationItem) => {
    setRandomPreview(item);
    setSelectedPinId(item.id);
  };

  const submitSpot = () => {
    if (!form.title.trim()) {
      return;
    }

    onAddSpot({
      id: `${Date.now()}`,
      title: form.title.trim(),
      place: form.place.trim(),
      note: form.note.trim(),
      tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    });

    setForm(initialForm);
    setIsAddModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <AppText variant="title">Trail Map</AppText>
      <SegmentedSwitch
        value={activeTab}
        onChange={setActiveTab}
        options={[
          { label: 'Trail Locations', value: 'trail' },
          { label: `My Spots (${mySpots.length})`, value: 'my' },
        ]}
      />

      {activeTab === 'trail' ? (
        <View style={styles.mapBlock}>
          <MapView ref={mapRef} style={styles.map} initialRegion={region}>
            {list.map(item => (
              <Marker
                key={item.id}
                coordinate={{ latitude: item.coords[0], longitude: item.coords[1] }}
                title={item.title}
                description={item.location}
                pinColor={selectedPinId === item.id ? colors.accent : '#61C94C'}
                onPress={() => handleMarkerPress(item)}
              />
            ))}
          </MapView>

          {randomPreview ? (
            <AppCard style={styles.previewCard}>
              <View style={styles.previewRow}>
                <Image source={randomPreview.image} style={styles.previewImage} />
                <View style={styles.previewText}>
                  <AppText variant="body">{randomPreview.title}</AppText>
                  <AppText variant="bodySmall" color={colors.textSecondary}>{randomPreview.location}</AppText>
                </View>
              </View>
            </AppCard>
          ) : null}

          <AppButton title="Random Location" onPress={triggerRandom} />
        </View>
      ) : (
        <View style={styles.spotBlock}>
          <AppButton
            title="Add New Spot"
            variant="secondary"
            onPress={() => setIsAddModalVisible(true)}
            style={styles.addButton}
          />

          <FlatList
            data={mySpots}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.spotList}
            ListEmptyComponent={<AppText color={colors.textMuted}>No spots yet.</AppText>}
            renderItem={({ item }) => (
              <AppCard>
                <View style={styles.spotHeader}>
                  <View style={styles.spotLeft}>
                    <AppText variant="section">{item.title}</AppText>
                    {!!item.place && <AppText variant="bodySmall" color={colors.textSecondary}>{item.place}</AppText>}
                    {!!item.note && <AppText variant="bodySmall" color={colors.textMuted}>{item.note}</AppText>}
                  </View>
                  <Pressable onPress={() => onRemoveSpot(item.id)} style={styles.removeBtn}>
                    <TrashIcon color={colors.danger} size={18} />
                  </Pressable>
                </View>
              </AppCard>
            )}
          />
        </View>
      )}

      <Modal visible={isAddModalVisible} transparent animationType="fade" onRequestClose={() => setIsAddModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

        
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHead}>
              <AppText variant="section">Add My Spot</AppText>
              <Pressable onPress={() => setIsAddModalVisible(false)}>
                <XMarkIcon size={20} color={colors.textSecondary} />
              </Pressable>
            </View>

            <TextInput
              value={form.title}
              onChangeText={text => setForm(prev => ({ ...prev, title: text }))}
              placeholder="Spot name"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
            <TextInput
              value={form.place}
              onChangeText={text => setForm(prev => ({ ...prev, place: text }))}
              placeholder="Region / area"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
            <TextInput
              value={form.tags}
              onChangeText={text => setForm(prev => ({ ...prev, tags: text }))}
              placeholder="Tags (comma separated)"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
            <TextInput
              value={form.note}
              onChangeText={text => setForm(prev => ({ ...prev, note: text }))}
              placeholder="Why this place matters"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, styles.inputArea]}
              multiline
            />

            <View style={styles.modalActions}>
              <AppButton title="Cancel" variant="ghost" onPress={() => setIsAddModalVisible(false)} style={styles.modalActionBtn} />
              <AppButton title="Add Spot" onPress={submitSpot} style={styles.modalActionBtn} />
            </View>
          </View>
        </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.sm,
  },
  mapBlock: {
    flex: 1,
    gap: spacing.sm,
    paddingBottom: dimensions.bottomBarHeight + spacing.md,
  },
  map: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  previewCard: {
    padding: spacing.xs,
  },
  previewRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  previewImage: {
    width: 68,
    height: 52,
    borderRadius: radius.sm,
  },
  previewText: {
    flex: 1,
  },
  spotBlock: {
    flex: 1,
    paddingBottom: dimensions.bottomBarHeight + spacing.md,
  },
  addButton: {
    marginTop: spacing.xs,
  },
  spotList: {
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  spotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  spotLeft: {
    flex: 1,
    gap: spacing.xxs,
  },
  removeBtn: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: spacing.md,
  },
  modalCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.md,
    gap: spacing.sm,
  },
  modalHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    minHeight: 40,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgInput,
    paddingHorizontal: spacing.sm,
    color: colors.textPrimary,
  },
  inputArea: {
    minHeight: 86,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalActionBtn: {
    flex: 1,
  },
});

export const MapScreen = memo(MapScreenComponent);
