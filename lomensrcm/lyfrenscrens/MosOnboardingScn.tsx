import React, { useEffect, useRef, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import {
    StatusBar,
    Image,




    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,

    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
    StyleSheet,
} from 'react-native';
import {useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { laefontsems } from '../laefontsems';

const STORAGE_KEY_ONBOARD = 'hasSeenOnboarding';

const slides = [
    {
        accent: '#D6B44B',
        buttonText: 'Continue',
        category: 'DISCOVER',
        description:
            'Discover memorable roads, striking viewpoints, and beautiful places that feel worth every mile. Let Lodestar lead you toward destinations that stay with you long after the drive',
        gradient: ['#17583A', '#08312B', '#05090F'],
        hero: require('../laitassets/lfyimages/onbimags/follow.png'),
        title: 'Follow the Scenic\nPull',
    },
    {
        accent: '#49D8CF',
        buttonText: 'Continue',
        category: 'EXPLORE',
        description:
            'Browse scenic locations, open them on the map, and keep your favorite stops in one personal collection. Add your own places too, so every route feels more like yours',
        gradient: ['#0F6964', '#05322C', '#05090F'],
        hero: require('../laitassets/lfyimages/onbimags/savewhatcalls.png'),
        title: 'Save What Calls to\nYou',
    },
    {
        accent: '#8C64E7',
        buttonText: 'Continue',
        category: 'HUNT',
        description:
            'Take part in photo challenges inspired by quiet details, changing light, and unexpected beauty along the road. Capture the kind of moments that make a journey feel personal',
        gradient: ['#0D3955', '#051A2D', '#05090F'],
        hero: require('../laitassets/lfyimages/onbimags/turninfomoments.png'),
        title: 'Turn Stops Into\nMoments',
    },
    {
        accent: '#D6B44B',
        buttonText: "Let's Explore",
        category: 'CREATE',
        description:
            'Use location photos as creative templates, adjust transparency, and sketch directly over what inspires you. Save your artwork, revisit past sketches, and build your own visual travel diary',
        gradient: ['#2B5721', '#081D13', '#05090F'],
        hero: require('../laitassets/lfyimages/onbimags/sketchtheview.png'),
        title: 'Sketch the View Your\nWay',
    },
];

const getButtonText = (index: number) => slides[index]?.buttonText ?? 'Continue';

export default function MosOnboardingScn() {
    const navigation = useNavigation<any>();
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const pagerRef = useRef<ScrollView>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const isLastSlide = currentSlide === slides.length - 1;

    useEffect(() => {
        pagerRef.current?.scrollTo({ x: currentSlide * width, animated: false });
    }, [currentSlide, width]);

    const finishOnboarding = async () => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY_ONBOARD, 'true');
        } catch (err) {
            if (__DEV__) console.warn('MosOnboardingScn::fail', err);
        }
        navigation.replace?.('MainApp');
    };

    const handleNext = async () => {
        if (!isLastSlide) {
            pagerRef.current?.scrollTo({ x: (currentSlide + 1) * width, animated: true });
            return;
        }
        await finishOnboarding();
    };

    const handleSkip = async () => {
        await finishOnboarding();
    };

    const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentSlide(Math.max(0, Math.min(slides.length - 1, nextIndex)));
    };

    const titleSize = Math.max(34, Math.min(width * 0.09, 42));
    const bodySize = Math.max(14, Math.min(width * 0.039, 16));
    const labelSize = Math.max(11, Math.min(width * 0.03, 12));
    const buttonFontSize = Math.max(16, Math.min(width * 0.045, 18));

    const pageWidth = width;
    const pageHeight = height;
    const buttonWidth = Math.min(width - 32, 360);
    const imageWidth = Math.min(width * 0.56, 220);
    const imageHeight = Math.min(height * 0.31, 270);
    const paddingTop = Math.max(insets.top + 14, 24);
    const paddingBottom = Math.max(insets.bottom + 14, 16);

    return (
        <View style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <ScrollView
                style={styles.scroll}
                bounces={false}
                ref={pagerRef}
                pagingEnabled
                horizontal
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onMomentumScrollEnd={handleScrollEnd}
            >
                {slides.map((slide) => (
                    <View key={slide.title} style={{ height: pageHeight, width: pageWidth, overflow: 'hidden' }}>
                        <LinearGradient colors={slide.gradient} locations={[0, 0.56, 1]} style={StyleSheet.absoluteFillObject} />
                        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.12)' }]} />

                        <View style={[styles.page, { paddingBottom, paddingTop }]}> 
                            <View style={styles.topRow}>
                                <View />
                                <TouchableOpacity onPress={handleSkip} activeOpacity={0.8}>
                                    <Text style={styles.skipText}>Skip</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.heroWrap, { paddingTop: height * 0.03, paddingBottom: height * 0.03 }]}> 
                                <Image source={slide.hero} resizeMode="contain" style={{ height: imageHeight, width: imageWidth }} />
                            </View>

                            <View style={styles.copyBlock}>
                                <Text style={[styles.category, { color: slide.accent, fontSize: labelSize }]}>{slide.category}</Text>
                                <Text style={[styles.title, { fontSize: titleSize, lineHeight: titleSize * 1.08 }]}>{slide.title}</Text>
                                <Text style={[styles.description, { fontSize: bodySize, lineHeight: bodySize * 1.6 }]}>{slide.description}</Text>
                            </View>

                            <View style={styles.dotsRow}>
                                {slides.map((dotSlide, dotIndex) => {
                                    const active = dotIndex === currentSlide;
                                    return (
                                        <View
                                            key={`${dotSlide.title}-dot-${dotIndex}`}
                                            style={[
                                                active ? styles.activeDot : styles.inactiveDot,
                                                { backgroundColor: active ? slides[currentSlide].accent : 'rgba(255,255,255,0.22)' },
                                            ]}
                                        />
                                    );
                                })}
                            </View>

                            <TouchableOpacity activeOpacity={0.9} onPress={handleNext}>
                                <LinearGradient
                                    colors={currentSlide === 1 ? ['#4FD6CC', '#39B8AE'] : currentSlide === 2 ? ['#8E67E8', '#6D4CC3'] : ['#E1C15F', '#B6912A']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    style={[styles.button, { width: buttonWidth }]}
                                >
                                    <Text style={[styles.buttonText, { fontSize: buttonFontSize }]}>{getButtonText(currentSlide)}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#05070D',
        flex: 1,
    },
    scroll: {
        flex: 1,
    },
    page: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'space-between',
    },
    topRow: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    skipText: {
        color: 'rgba(255,255,255,0.42)',
        fontFamily: laefontsems.sfpropreg,
        fontSize: 15,
    },
    heroWrap: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    copyBlock: {
        marginBottom: 14,
    },
    category: {
        fontFamily: laefontsems.spacegroteskBold,
        letterSpacing: 3.2,
        marginBottom: 18,
    },
    title: {
        letterSpacing: -0.4,
        fontFamily: laefontsems.spacegroteskBold,
        maxWidth: '78%',
        color: '#F6F3EE',
    },
    description: {
        color: 'rgba(229, 224, 214, 0.55)',
        fontFamily: laefontsems.sfpropreg,
        marginTop: 18,
        maxWidth: '83%',
    },
    dotsRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 18,
        marginTop: 4,
    },
    activeDot: {
        borderRadius: 999,
        height: 5,
        marginHorizontal: 2,
        width: 18,
    },
    inactiveDot: {
        borderRadius: 999,
        height: 5,
        marginHorizontal: 2,
        width: 5,
    },
    button: {
        shadowOffset: { width: 0, height: 10 },
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 18,
        justifyContent: 'center',
        shadowColor: '#000',


        height: 46,

        shadowOpacity: 0.24,

        shadowRadius: 18,
        
        elevation: 8,
    },
    buttonText: {
        color: '#131313',
        fontFamily: laefontsems.spacegroteskBold,
        letterSpacing: 0.2,
    },
});
