import React, { memo, useMemo, useRef, useState } from 'react';
import { FlatList, Image, PanResponder, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import ViewShot, { captureRef } from 'react-native-view-shot';
import locations from '../../dataforapp/locations';
import { SketchEntry } from '../../engine/helpers/types';
import { AppText } from '../../ui/primitives/AppText';
import { AppCard } from '../../ui/primitives/AppCard';
import { AppButton } from '../../ui/primitives/AppButton';
import { colors } from '../../core/theme/colors';
import { dimensions, iconSizes, radius, spacing } from '../../core/dimensions/tokens';
import { ArrowLeftIcon, PhotoIcon, SwatchIcon, TrashIcon } from 'react-native-heroicons/outline';

type Props = {
    gallery: SketchEntry[];
    onSaveSketch: (entry: SketchEntry) => void;
    onDeleteSketch: (id: string) => void;
};

type SketchMode = 'library' | 'draw' | 'gallery';

type Stroke = {
    color: string;
    width: number;
    points: { x: number; y: number }[];
};

const palette = ['#FFFFFF', '#F2D36C', '#32D46E', '#52B8FF', '#FA5A7A', '#F89A2D'];
const brushSizes = [2, 4, 6, 8];

const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = `${date.getDate()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

const SketchStudioScreenComponent: React.FC<Props> = ({ gallery, onSaveSketch, onDeleteSketch }) => {
    const [mode, setMode] = useState<SketchMode>('library');
    const [activeImage, setActiveImage] = useState<any | null>(null);
    const [activeImageName, setActiveImageName] = useState('');
    const [selectedColor, setSelectedColor] = useState(palette[0]);
    const [selectedBrush, setSelectedBrush] = useState(4);
    const [strokes, setStrokes] = useState<Stroke[]>([]);

    const currentStrokeRef = useRef<Stroke | null>(null);
    const drawBoardRef = useRef<ViewShot | null>(null);

    const sketchSources = useMemo(() => {
        return (locations as any[]).slice(0, 8);
    }, []);

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onMoveShouldSetPanResponder: () => true,
                onPanResponderGrant: event => {
                    const { locationX, locationY } = event.nativeEvent;
                    currentStrokeRef.current = {
                        color: selectedColor,
                        width: selectedBrush,
                        points: [{ x: locationX, y: locationY }],
                    };
                    setStrokes(prev => [...prev, currentStrokeRef.current as Stroke]);
                },
                onPanResponderMove: event => {
                    const { locationX, locationY } = event.nativeEvent;
                    setStrokes(prev => {
                        if (!prev.length) {
                            return prev;
                        }
                        const next = [...prev];
                        const last = next[next.length - 1];
                        next[next.length - 1] = {
                            ...last,
                            points: [...last.points, { x: locationX, y: locationY }],
                        };
                        return next;
                    });
                },
                onPanResponderRelease: () => {
                    currentStrokeRef.current = null;
                },
            }),
        [selectedBrush, selectedColor],
    );

    const saveSketch = async () => {
        if (!activeImage || !strokes.length) {
            return;
        }

        const capturedUri = drawBoardRef.current
            ? await captureRef(drawBoardRef.current, {
                format: 'png',
                quality: 1,
                result: 'tmpfile',
            })
            : undefined;

        onSaveSketch({
            id: `${Date.now()}`,
            sourceName: activeImageName,
            createdAt: Date.now(),
            pointsCount: strokes.reduce((sum, stroke) => sum + stroke.points.length, 0),
            previewUri: capturedUri,
            previewImage: typeof activeImage === 'number' ? activeImage : undefined,
        });
        setMode('gallery');
    };

    const buildPath = (points: { x: number; y: number }[]) => {
        if (!points.length) {
            return '';
        }
        return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    };

    if (mode === 'gallery') {
        return (
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <AppText variant="title">My Sketches</AppText>
                    <AppButton title="Back" variant="ghost" onPress={() => setMode('library')} />
                </View>
                <FlatList
                    key="sketch-gallery-list"
                    data={gallery}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.column}
                    contentContainerStyle={styles.grid}
                    ListEmptyComponent={<AppText color={colors.textMuted}>No sketches saved yet.</AppText>}
                    renderItem={({ item }) => {
                        const imageSource = item.previewUri
                            ? { uri: item.previewUri }
                            : item.previewImage ?? (locations as any[]).find(location => location.title === item.sourceName)?.image;

                        return (
                            <View style={styles.galleryItem}>
                                {imageSource ? (
                                    <Image source={imageSource} style={styles.galleryImage} />
                                ) : (
                                    <View style={styles.galleryImageFallback}>
                                        <AppText variant="bodySmall" color={colors.textMuted}>No preview</AppText>
                                    </View>
                                )}
                                <Pressable style={styles.deleteButton} onPress={() => onDeleteSketch(item.id)}>
                                    <TrashIcon size={16} color={colors.danger} />
                                </Pressable>
                                <View style={styles.galleryMeta}>
                                    <AppText variant="section" numberOfLines={1}>{item.sourceName}</AppText>
                                    <AppText variant="bodySmall" color={colors.textSecondary}>
                                        {formatDate(item.createdAt)}
                                    </AppText>
                                </View>
                            </View>
                        );
                    }}
                />
            </View>
        );
    }

    if (mode === 'draw') {
        return (
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <Pressable onPress={() => setMode('library')} style={styles.iconBtn}>
                        <ArrowLeftIcon size={iconSizes.lg} color={colors.textPrimary} />
                    </Pressable>
                    <AppText variant="section">Sketch board</AppText>
                    <View style={styles.headerAction}>
                        <AppButton title="Save" onPress={saveSketch} />
                    </View>
                </View>

                <ViewShot ref={drawBoardRef} style={styles.drawBoard} options={{ format: 'png', quality: 1 }}>
                    <View style={styles.drawBoardInner} {...panResponder.panHandlers} collapsable={false}>
                        {!!activeImage && <Image source={activeImage} style={styles.drawImage} />}
                        <Svg style={styles.overlay}>
                            {strokes.map((stroke, index) => (
                                <Path
                                    key={`${stroke.color}-${index}`}
                                    d={buildPath(stroke.points)}
                                    stroke={stroke.color}
                                    strokeWidth={stroke.width}
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            ))}
                        </Svg>
                    </View>
                </ViewShot>

                <AppCard style={styles.toolsCard}>
                    <View style={styles.paletteRow}>
                        <SwatchIcon size={18} color={colors.textSecondary} />
                        {palette.map(color => (
                            <Pressable
                                key={color}
                                onPress={() => setSelectedColor(color)}
                                style={[styles.colorDot, { backgroundColor: color }, selectedColor === color && styles.colorDotSelected]}
                            />
                        ))}
                    </View>
                    <View style={styles.paletteRow}>
                        {brushSizes.map(size => (
                            <Pressable
                                key={String(size)}
                                onPress={() => setSelectedBrush(size)}
                                style={[styles.brush, selectedBrush === size && styles.brushSelected]}
                            >
                                <AppText variant="label">{size}px</AppText>
                            </Pressable>
                        ))}
                        <AppButton title="Clear" variant="secondary" onPress={() => setStrokes([])} />
                    </View>
                </AppCard>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <AppText variant="title">Sketch Studio</AppText>
                <AppButton title="Gallery" variant="secondary" onPress={() => setMode('gallery')} />
            </View>
            <FlatList
                key="sketch-library-list"
                data={sketchSources}
                keyExtractor={item => String(item.id)}
                numColumns={2}
                columnWrapperStyle={styles.column}
                contentContainerStyle={styles.grid}
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.libraryItem}
                        onPress={() => {
                            setActiveImage(item.image);
                            setActiveImageName(item.title);
                            setStrokes([]);
                            setMode('draw');
                        }}
                    >
                        <Image source={item.image} style={styles.libraryImage} />
                        <View style={styles.libraryCaption}>
                            <PhotoIcon size={14} color={colors.textMuted} />
                            <View style={{
                                width: '88%',
                            }}>
                                <AppText variant="bodySmall" numberOfLines={1} ellipsizeMode='tail'>{item.title}</AppText>
                            </View>
                        </View>
                    </Pressable>
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
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: spacing.sm,
    },
    headerAction: {
        minWidth: 86,
    },
    grid: {
        gap: spacing.sm,
        paddingBottom: spacing.lg,
    },
    column: {
        gap: spacing.sm,
    },
    libraryItem: {
        flex: 1,
        backgroundColor: colors.bgCard,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: radius.md,
        padding: spacing.xs,
    },
    libraryImage: {
        width: '100%',
        height: 120,
        borderRadius: radius.sm,
    },
    libraryCaption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginTop: spacing.xs,
    },
    galleryItem: {
        position: 'relative',
        flex: 1,
        backgroundColor: colors.bgCard,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: radius.lg,
        overflow: 'hidden',
        maxWidth: '49%',
    },
    galleryImage: {
        width: '100%',
        height: 200,
    },
    galleryImageFallback: {
        width: '100%',
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.bgInput,
    },
    deleteButton: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        width: 30,
        height: 30,
        borderRadius: radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(30, 8, 8, 0.75)',
        borderWidth: 1,
        borderColor: 'rgba(217, 75, 88, 0.7)',
        zIndex: 2,
        elevation: 2,
    },
    galleryMeta: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
        gap: spacing.xxs,
    },
    iconBtn: {
        width: 32,
        height: 32,
        borderRadius: radius.pill,
        backgroundColor: colors.bgInput,
        alignItems: 'center',
        justifyContent: 'center',
    },
    drawBoard: {
        flex: 1,
        borderRadius: radius.lg,
        overflow: 'hidden',
        backgroundColor: colors.bgInput,
    },
    drawBoardInner: {
        flex: 1,
        borderRadius: radius.lg,
        overflow: 'hidden',
    },
    drawImage: {
        width: '100%',
        height: '100%',
        opacity: 0.65,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    toolsCard: {
        gap: spacing.sm,
    },
    paletteRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        flexWrap: 'wrap',
    },
    colorDot: {
        width: 22,
        height: 22,
        borderRadius: radius.pill,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorDotSelected: {
        borderColor: colors.accent,
    },
    brush: {
        minWidth: 54,
        minHeight: 30,
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xs,
    },
    brushSelected: {
        borderColor: colors.accent,
    },
});

export const SketchStudioScreen = memo(SketchStudioScreenComponent);
