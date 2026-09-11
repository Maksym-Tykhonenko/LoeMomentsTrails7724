import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppSettings, MySpot, PhotoEntry, SketchEntry } from '../helpers/types';
import { clearAllAppData, getJson, setJson } from '../storage/appStorage';
import { storageKeys } from '../storage/storageKeys';
import RNFS from 'react-native-fs';

const defaultSettings: AppSettings = {
  notifications: true,
  haptics: false,
  autoSaveSketches: true,
};

export const useAppState = () => {
  const [savedLocationIds, setSavedLocationIds] = useState<number[]>([]);
  const [mySpots, setMySpots] = useState<MySpot[]>([]);
  const [photoShots, setPhotoShots] = useState<PhotoEntry[]>([]);
  const [sketchGallery, setSketchGallery] = useState<SketchEntry[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isBootstrapped, setIsBootstrapped] = useState(false);

  useEffect(() => {
    const boot = async () => {
      const [saved, spots, photos, sketches, loadedSettings] = await Promise.all([
        getJson<number[]>(storageKeys.savedLocationIds, []),
        getJson<MySpot[]>(storageKeys.mySpots, []),
        getJson<PhotoEntry[]>(storageKeys.photoHuntShots, []),
        getJson<SketchEntry[]>(storageKeys.sketchGallery, []),
        getJson<AppSettings>(storageKeys.appSettings, defaultSettings),
      ]);

      setSavedLocationIds(saved);
      setMySpots(spots);
      setPhotoShots(photos);
      setSketchGallery(sketches);
      setSettings(loadedSettings);
      setIsBootstrapped(true);
    };

    boot();
  }, []);

  const savedLookup = useMemo(() => {
    return savedLocationIds.reduce<Record<number, boolean>>((acc, id) => {
      acc[id] = true;
      return acc;
    }, {});
  }, [savedLocationIds]);

  const toggleSaved = useCallback((id: number) => {
    setSavedLocationIds(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      setJson(storageKeys.savedLocationIds, next);
      return next;
    });
  }, []);

  const addMySpot = useCallback((spot: MySpot) => {
    setMySpots(prev => {
      const next = [spot, ...prev];
      setJson(storageKeys.mySpots, next);
      return next;
    });
  }, []);

  const removeMySpot = useCallback((id: string) => {
    setMySpots(prev => {
      const next = prev.filter(item => item.id !== id);
      setJson(storageKeys.mySpots, next);
      return next;
    });
  }, []);

  const addPhotoShot = useCallback((photo: PhotoEntry) => {
    setPhotoShots(prev => {
      const next = [photo, ...prev];
      setJson(storageKeys.photoHuntShots, next);
      return next;
    });
  }, []);

  const addSketchToGallery = useCallback((item: SketchEntry) => {
    setSketchGallery(prev => {
      const next = [item, ...prev];
      setJson(storageKeys.sketchGallery, next);
      return next;
    });
  }, []);

  const removeSketchFromGallery = useCallback((id: string) => {
    setSketchGallery(prev => {
      const target = prev.find(item => item.id === id);
      const next = prev.filter(item => item.id !== id);
      setJson(storageKeys.sketchGallery, next);

      if (target?.previewUri) {
        void RNFS.unlink(target.previewUri).catch(() => {
          // ignore missing cache files
        });
      }

      return next;
    });
  }, []);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...partial };
      setJson(storageKeys.appSettings, next);
      return next;
    });
  }, []);

  const clearAllData = useCallback(async () => {
    await clearAllAppData(Object.values(storageKeys));
    setSavedLocationIds([]);
    setMySpots([]);
    setPhotoShots([]);
    setSketchGallery([]);
    setSettings(defaultSettings);
  }, []);

  return {
    isBootstrapped,
    savedLookup,
    savedLocationIds,
    mySpots,
    photoShots,
    sketchGallery,
    settings,
    toggleSaved,
    addMySpot,
    removeMySpot,
    addPhotoShot,
    addSketchToGallery,
    removeSketchFromGallery,
    updateSettings,
    clearAllData,
  };
};
