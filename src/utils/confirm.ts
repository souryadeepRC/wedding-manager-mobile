import { Alert } from 'react-native';

export function confirm(
  title: string,
  message: string,
  confirmLabel = 'Discard',
  cancelLabel = 'Keep editing',
): Promise<boolean> {
  return new Promise(resolve => {
    Alert.alert(
      title,
      message,
      [
        { text: cancelLabel, style: 'cancel', onPress: () => resolve(false) },
        { text: confirmLabel, style: 'destructive', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}
