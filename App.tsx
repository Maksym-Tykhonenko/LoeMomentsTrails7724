import React, { useEffect, useState } from 'react';
import StackNavigator from './StackNavigator';
//
import {LogLevel, OneSignal} from 'react-native-onesignal';
// Значення міняємо в src/config/projectConfig.jsx, не тут.
import { ONESIGNAL_APP_ID } from './lomensrcm/config/projectConfig';

function App() {
  const [oneSignKkkk] = useState(ONESIGNAL_APP_ID);

  useEffect(() => {

    const initOnsignall = async () => {
      try {
        // Verbose-логи лишаємо тільки в дебазі
        if (__DEV__) {
          OneSignal.Debug.setLogLevel(LogLevel.Verbose);
        }

        // OneSignal ініціалізація
        if (oneSignKkkk) {
          OneSignal.initialize(oneSignKkkk);
        }
      } catch (e) {
        console.log('OneSignal init error:', e);
      }
    };
    
    initOnsignall();
    
  }, []);
  
  return <StackNavigator />;
}

export default App;