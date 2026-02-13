import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

export const shareView = async (viewRef: any) => {
  try {
    const uri = await captureRef(viewRef, {
      format: 'png',
      quality: 0.8,
    });
    await Sharing.shareAsync(uri);
  } catch (error) {
    console.error('Error sharing view:', error);
  }
};
