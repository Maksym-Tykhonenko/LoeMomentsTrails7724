import React, { memo } from 'react';




import {
    GlobeAltIcon as GlobeAltOutline,

    MapIcon as MapOutline,

    CameraIcon as CameraOutline,

    PencilSquareIcon as PencilSquareOutline,
    Cog6ToothIcon as CogOutline,



} from 'react-native-heroicons/outline';
import { laefontsems } from '../../laefontsems'
import {
    GlobeAltIcon as GlobeAltSolid,

    MapIcon as MapSolid,

    CameraIcon as CameraSolid,

    PencilSquareIcon as PencilSquareSolid,



    Cog6ToothIcon as CogSolid,
} from 'react-native-heroicons/solid';
import {  iconSizes, spacing } from '../../core/dimensions/tokens';


import { colors } from '../../core/theme/colors';

import { AppText } from '../primitives/AppText';

import { Dimensions, Platform, Pressable, StyleSheet, View } from 'react-native';

import { MainTabKey } from '../../engine/helpers/types';

type Props = {
    activeTab: MainTabKey;
    onTabPress: (tab: MainTabKey) => void;
};

type TabItem = {
    key: MainTabKey;
    label: string;
    icon: React.ComponentType<any>;
    activeIcon: React.ComponentType<any>;
};

const tabs: TabItem[] = [
    { key: 'Explore', label: 'Explore', icon: GlobeAltOutline, activeIcon: GlobeAltSolid },
    ...(Platform.OS !== 'android' ? [{ key: 'Map' as const, label: 'Map', icon: MapOutline, activeIcon: MapSolid }] : []),
    { key: 'Photo Hunt', label: 'Hunt', icon: CameraOutline, activeIcon: CameraSolid },
    { key: 'Sketch Studio', label: 'Sketch', icon: PencilSquareOutline, activeIcon: PencilSquareSolid },
    { key: 'Settings', label: 'Settings', icon: CogOutline, activeIcon: CogSolid },
];

const BottomBarComponent: React.FC<Props> = ({ activeTab, onTabPress }) => {
    return (
        <View style={styles.shell}>
            <View style={styles.row}>
                {tabs.map(tab => {
                    const isActive = tab.key === activeTab;
                    const Icon = isActive ? tab.activeIcon : tab.icon;

                    return (
                        <Pressable
                            key={tab.key}
                            onPress={() => onTabPress(tab.key)}
                            style={({ pressed }) => [styles.tab, pressed && styles.pressed, {
                                backgroundColor: isActive ? 'rgba(201, 168, 76, 0.12)' : 'transparent',
                                borderRadius: isActive ? Dimensions.get('window').width * 0.03 : 0,
                                paddingHorizontal: isActive ? spacing.xs : 0,
                                paddingVertical: isActive ? spacing.xxs : 0,
                            }]}
                        >
                            <Icon color={isActive ? colors.accent : colors.textMuted} size={iconSizes.lg} />
                            <AppText variant="label" color={isActive ? colors.accent : colors.textMuted} style={{
                                fontFamily: laefontsems.spacegroteskMed
              }}>
                                {tab.label}
                            </AppText>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    shell: {
        right: 0,
        borderTopWidth: 1,
        paddingBottom: spacing.xl,
        bottom: 0,
        // height: dimensions.bottomBarHeight,
        paddingTop: spacing.md,

        
        borderTopColor: colors.borderStrong,
        backgroundColor: '#061C12',
        position: 'absolute',


        
        justifyContent: 'center',
        left: 0,
        paddingHorizontal: spacing.xs,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        alignItems: 'center',
    },
    tab: {
        minWidth: 60,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xxs,
    },
    pressed: {
        opacity: 0.85,
    },
});

export const BottomBar = memo(BottomBarComponent);
