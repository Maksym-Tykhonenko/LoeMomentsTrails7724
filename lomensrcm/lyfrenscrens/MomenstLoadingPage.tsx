import { useNavigation } from '@react-navigation/native';

import React, { useEffect } from 'react';

import { View } from 'react-native';

// @ts-nocheck
import AsyncStorage from '@react-native-async-storage/async-storage';
import SuglenRdorAnimurn from '../lrappcomponents/SuglenRdorAnimurn';

const rootStyle = { flex: 1, backgroundColor: '#060914', margin: 0, padding: 0 };

type Props = {
    durationMs?: number;
};

const HAS_SEEN_ONBOARDING_KEY = 'hasSeenOnboarding';

const MomenstLoadingPage = ({ durationMs = 2200 }: Props): React.ReactElement => {
    const navigation = useNavigation<any>();

    useEffect(() => {
        let isMounted = true;

        const timeoutId = setTimeout(() => {
            AsyncStorage.getItem(HAS_SEEN_ONBOARDING_KEY)
                .then(value => {
                    if (!isMounted) {
                        return;
                    }

                    const hasSeenOnboarding = value === 'true';
                    navigation.replace(hasSeenOnboarding ? 'MainApp' : 'MosOnboardingScn');
                })
                .catch(() => {
                    if (!isMounted) {
                        return;
                    }

                    navigation.replace('MosOnboardingScn');
                });
        }, 4000);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [durationMs, navigation]);

    return (
        <View style={rootStyle}>
            <SuglenRdorAnimurn />
        </View>
    );
};

export default MomenstLoadingPage;
