// @ts-nocheck
import { Dimensions, StyleSheet,  Pressable, Text, View } from 'react-native';
import React, { memo } from 'react';
import {
    LightBulbIcon as LightbulbOutline,

    MapIcon as MapOutline,

    NewspaperIcon as NewspaperOutline,



    GlobeAltIcon as GlobeAltOutline,

    QuestionMarkCircleIcon as HelpCircleOutline,


    BookmarkIcon as BookmarkOutline,
} from 'react-native-heroicons/outline';
import {


    BookmarkIcon as BookmarkSolid,

    MapIcon as MapSolid,

    NewspaperIcon as NewspaperSolid,

    LightBulbIcon as LightbulbSolid,

    QuestionMarkCircleIcon as HelpCircleSolid,
    
    GlobeAltIcon as GlobeAltSolid,
} from 'react-native-heroicons/solid';
import { colors } from '../constants/colors';
import { appSizes } from '../constants/dimensions';
import { typography } from '../constants/typography';
import { MainTabKey } from '../utils/types';

type BottomTabBarProps = {
    activeTab: MainTabKey;
    onTabPress: (tab: MainTabKey) => void;
};

type TabConfig = {
    key: MainTabKey;
    label: string;
    icon: React.ComponentType<any>;
    activeIcon: React.ComponentType<any>;
};

const tabConfig: TabConfig[] = [
    { key: 'Explore', label: 'Explore', icon: GlobeAltOutline, activeIcon: GlobeAltSolid },
    { key: 'Saved', label: 'Saved', icon: BookmarkOutline, activeIcon: BookmarkSolid },
    { key: 'Map', label: 'Map', icon: MapOutline, activeIcon: MapSolid },
    { key: 'Blog', label: 'Blog', icon: NewspaperOutline, activeIcon: NewspaperSolid },
    { key: 'Facts', label: 'Facts', icon: LightbulbOutline, activeIcon: LightbulbSolid },
    { key: 'Quiz', label: 'Quiz', icon: HelpCircleOutline, activeIcon: HelpCircleSolid },
];

const BottomTabBarComponent: React.FC<BottomTabBarProps> = ({ activeTab, onTabPress }) => {
    return (
        <View style={styles.shell}>
            <View style={styles.container}>
                {tabConfig.map(tab => {
                    const isActive = tab.key === activeTab;
                    const IconComponent = isActive ? tab.activeIcon : tab.icon;
                    return (
                        <Pressable
                            key={tab.key}
                            onPress={() => onTabPress(tab.key)}
                            style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}
                        >
                            <IconComponent
                                width={appSizes.iconSizes.lg}
                                height={appSizes.iconSizes.lg}
                                color={isActive ? colors.primary : colors.textMuted}
                                style={styles.icon}
                            />
                            <Text style={[styles.label, isActive ? styles.active : styles.inactive]}>{tab.label}</Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    shell: {
        // paddingBottom: Dimensions.get('window').height * 0.0,
        bottom: 0,

        width: Dimensions.get('window').width,

        borderTopWidth: appSizes.stroke.regular,

        borderTopColor: colors.borderStrong,

        position: 'absolute',



        backgroundColor: 'rgba(8, 6, 5, 0.95)',
    },
    container: {
        height: appSizes.tabBar.height,



        flexDirection: 'row',

        justifyContent: 'space-around',

        alignItems: 'center',

        paddingHorizontal: appSizes.spacing.xs,
    },
    tabButton: {
        alignItems: 'center',

        justifyContent: 'center',

        minWidth: appSizes.spacing.xxl + appSizes.spacing.sm,

        paddingVertical: appSizes.spacing.xxs,
    },
    icon: {
        lineHeight: appSizes.iconSizes.lg,
    },
    label: {
        marginTop: appSizes.spacing.xxs,

        fontSize: appSizes.fontSizes.xs,

        fontWeight: typography.weight.semibold,

        
    },
    active: {
        color: colors.primary,
    },
    inactive: {
        color: colors.textMuted,
    },
    pressed: {
        opacity: 0.84,
        transform: [{ scale: 0.96 }],
    },
});

export default memo(BottomTabBarComponent);
