import React, { memo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, ViewProps } from 'react-native';
import { colors } from '../../core/theme/colors';
import { dimensions, spacing } from '../../core/dimensions/tokens';

type Props = ViewProps & {
  scrollable?: boolean;
  children: React.ReactNode;
};

const AppContainerComponent: React.FC<Props> = ({ scrollable = false, children, style, ...rest }) => {
  const content = <View style={[styles.content, style]} {...rest}>{children}</View>;

  return (
    <SafeAreaView style={styles.safeArea}>
      {scrollable ? <ScrollView contentContainerStyle={styles.scrollContent}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: dimensions.topInset,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
});

export const AppContainer = memo(AppContainerComponent);
