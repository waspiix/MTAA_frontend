import React from 'react';
import { WebView } from 'react-native-webview';

const PaymentScreen = ({ route, navigation }) => {
  const { paymentUrl } = route.params;

  return (
    <WebView
      source={{ uri: paymentUrl }}
      onNavigationStateChange={(navState) => {
        if (navState.url.includes('success')) {
          // Payment succeeded!
          navigation.navigate('Tickets');
        }
        if (navState.url.includes('cancel')) {
          // Payment canceled
          navigation.goBack();
        }
      }}
    />
  );
};

export default PaymentScreen;
