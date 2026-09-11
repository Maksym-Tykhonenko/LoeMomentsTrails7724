


import { PhotoHuntScreen } from './modules/photohunt/PhotoHuntScreen';
import React, { memo, useMemo, useState } from 'react';
import { SettingsScreen } from './modules/settings/SettingsScreen';

import { useAppState } from './engine/hooks/useAppState';

import { colors } from './core/theme/colors';


import { spacing } from './core/dimensions/tokens';

import { SketchStudioScreen } from './modules/sketch/SketchStudioScreen';
import { BottomBar } from './ui/components/BottomBar';
import { Animated,

   Dimensions, 
   Easing, 
   Platform, 
   SafeAreaView, StyleSheet, 
   View} from 'react-native';
import { MainTabKey } from './engine/helpers/types';
import { ExploreScreen } from './modules/explore/ExploreScreen';
import { MapScreen } from './modules/map/MapScreen';


const LaefontsemsWrapperComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTabKey>('Explore');
  const appState = useAppState();
  const [isAnimating, setIsAnimating] = useState(false);
  const contentTransition = React.useRef(new Animated.Value(1)).current;

  const animateToTab = React.useCallback((nextTab: MainTabKey) => {
    if (nextTab === activeTab || isAnimating) {
      return;
    }

    setIsAnimating(true);

    Animated.timing(contentTransition, {
      toValue: 0,
      duration: 170,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(nextTab);

      Animated.timing(contentTransition, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setIsAnimating(false);
      });
    });
  }, [activeTab, contentTransition, isAnimating]);

  const contentAnimatedStyle = React.useMemo(() => ({
    opacity: contentTransition,
    transform: [
      {
        translateY: contentTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [8, 0],
        }),
      },
      {
        scale: contentTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [0.985, 1],
        }),
      },
    ],
  }), [contentTransition]);

  const content = useMemo(() => {
    switch (activeTab) {
      case 'Explore':
        return <ExploreScreen savedLookup={appState.savedLookup} onToggleSaved={appState.toggleSaved} />;
      case 'Map':
        return <MapScreen mySpots={appState.mySpots} onAddSpot={appState.addMySpot} onRemoveSpot={appState.removeMySpot} />;
      case 'Photo Hunt':
        return <PhotoHuntScreen photos={appState.photoShots} onAddPhoto={appState.addPhotoShot} />;
      case 'Sketch Studio':
        return (
          <SketchStudioScreen gallery={appState.sketchGallery} onSaveSketch={appState.addSketchToGallery} onDeleteSketch={appState.removeSketchFromGallery}
          />
        );
      case 'Settings':
        return (
          <SettingsScreen
            settings={appState.settings}
            onUpdateSettings={appState.updateSettings}
            onClearData={appState.clearAllData}
          />
        );
      default:
        return null;
    }
  }, [activeTab, appState]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <View style={{paddingTop: Platform.OS === 'android' ? Dimensions.get('window').height * 0.03 : 0}}/> */}
      <Animated.View style={[styles.screenContent, contentAnimatedStyle]}>{content}</Animated.View>
      <BottomBar activeTab={activeTab} onTabPress={animateToTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.bg,
    flex: 1,
  },
  screenContent: {
    paddingTop: Platform.OS === 'android' ? Dimensions.get('window').height * 0.04 : Dimensions.get('window').height * 0.012,
    flex: 1,
    paddingHorizontal: spacing.md,
  },
});

export const LemontsWrapAppLocalize = memo(LaefontsemsWrapperComponent);
