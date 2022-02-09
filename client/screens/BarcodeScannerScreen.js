import { StyleSheet, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import BackTopNav from '../components/BackTopNav';
import { Layout, Text, Button } from '@ui-kitten/components';
import { BarCodeScanner } from 'expo-barcode-scanner';

const BarcodeScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`)
      .then((response) => {
        if (response.ok && response.status) return response.json();
        throw response;
      })
      .then((data) => {
        console.log(data);
        if (data.status === 0) {
          alert(`Ooops, could not find information for this product`);
        } else alert(`Scanned!`);
      })
      .catch((error) => {
        console.log(error);
        alert(`Ooops, could not find information for this product`);
      });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackTopNav backgroundColor={'#fff'} iconFill={'#000'} />
      <Layout style={styles.container} level="1">
        <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={StyleSheet.absoluteFillObject} />
      </Layout>
    </SafeAreaView>
  );
};

export default BarcodeScannerScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: 30,
    marginVertical: 20,
    backgroundColor: '#fff'
  }
});
