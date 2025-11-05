import fetchProductData from '@/constants/fetchProductData';
import { getFile } from '@/constants/fs';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const DateTimePickerModal: any = (require('react-native-modal-datetime-picker') as any).default || require('react-native-modal-datetime-picker');

export default function Scan() {
  //const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  //const [scannedData, setScannedData] = useState({type: '', data: ''});
  const [menuVisible, setMenuVisible] = useState(false);
  const [date, setDate] = useState(new Date())
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [productData, setProductData] = useState<Record<string, any> | null>(null);
  const [isActive, setIsActive] = useState(true);


  
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }


  async function handleBarCodeScanned({ data, type }: { data: string; type: string }) {
    if (!isActive) {
      console.log('Scan ignored - not active');
      return;
    }
    
    console.log('Barcode scanned:', { type, data });
    
    try {
      // For testing, uncomment this line to use a test barcode
      // data = '4008400402222';
      
      const product = await fetchProductData(data);
      console.log('API response:', { product });
      
      if (!product) {
        console.log('No product data found for barcode:', data);
        // Optionally show an error message to the user here
        return;
      }
      
      // Product found, show popup
      setProductData(product);
      setMenuVisible(true);
      setIsActive(false);
      
    } catch (error) {
      console.error('Error scanning:', error);
      // Optionally show an error message to the user here
    }

  };

  


  async function saveProduct( ) {
    try {
      const file = await getFile('products.json');
      if (!file.exists && file.create) {
        await file.create();
      }
      let products: any[] = [];
      const text = await file.textSync();
      try {
        products = text && text !== '' ? JSON.parse(text) : [];
      } catch (e) {
        products = [];
      }

      // compute next id using the max existing id to avoid duplicates when file is unsorted
      const maxId = products.length > 0 ? Math.max(...products.map(p => (typeof p.id === 'number' ? p.id : -1))) : -1;
      const nextId = maxId + 1;

      const newProduct = {
        id: nextId,
        productData: productData,
        expirationDate: date.toISOString().split('T')[0], // YYYY-MM-DD
      };

      products.push(newProduct);
      await file.write(JSON.stringify(products, null, 2));

      // Update constants.json with new weight
      //try {
      //  const constFile = await getFile('constants.json');
      //  if (!constFile.exists && constFile.create) {
      //    await constFile.create();
      //  }
      //  const constText = await constFile.textSync();
      //  let constants: Record<string, any> = {};
      //  try { 
      //    constants = constText && constText !== '' ? JSON.parse(constText) : {};
      //  } catch {
      //    constants = {};
      //  }
      //  const currentWeight = Number(constants.totalWeight || 0);
      //  const addWeight = Number(productData?.quantity || 0);
      //  constants.totalWeight = currentWeight + addWeight;
      //  await constFile.write(JSON.stringify(constants, null, 2));
      //} catch (e) {
      //  console.warn('Failed to update constants.json', e);
      //}

    } catch (error) {
      console.error(error);
    };
  };

  function pressScan() {
    setIsActive(true);
  };

  return (
    <View style={styles.container}>
        <CameraView
         style={{ flex: 1 }}
         facing='back'
         barcodeScannerSettings={{
           barcodeTypes: ['ean13']
        }}
        onBarcodeScanned={handleBarCodeScanned}
        >
          <View style={styles.overlayContainer}>
            <View style={styles.overlayTop} />
            <View style={styles.overlayMiddle}>
              <View style={styles.overlaySide} />
              <View style={styles.scanBox} />
              <View style={styles.overlaySide} />
            </View>
            <View style={styles.overlayBottom} />
          </View>
        </CameraView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pressScan}>
          <Text style={styles.text}>Scan</Text>
        </TouchableOpacity>
        <Modal
        visible={menuVisible}
        animationType="slide" // or "fade"
        transparent={true}
        >
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPressOut={() => setMenuVisible(false)}
        >
          <View style={styles.menu}>
            <Text style={styles.menuText}>Menu Content</Text>
            <Text style={{fontSize: 16, marginBottom: 20}}>Product Name: {productData?.product_name || 'not defined'}</Text>
            <Text style={{fontSize: 16, marginBottom: 20}}>Weight: {productData?.quantity || 'not defined'}</Text>
            <TouchableOpacity style={styles.menuButton} onPress={() => setDatePickerVisibility(true)}>
              <Text style={{color: 'white', textAlign:'center',fontWeight:'bold',fontSize:20}}>Select Expiration Date</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              date={date}
              onConfirm={(selectedDate: Date) => {
                setDatePickerVisibility(false);
                setDate(selectedDate);
              }}
              onCancel={() => setDatePickerVisibility(false)}
            />
            <View style={{ flex: 1 }} />
            <Button title="Finish" onPress={async () => { await saveProduct(); setMenuVisible(false); }} />
          </View>
        </TouchableOpacity>
      </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // dark transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    width: '80%',
    height: '70%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'column',
  },
  menuText: {
    fontSize: 20,
    marginBottom: 20,
  },
  menuButton: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
    width: '100%',
    textAlign: 'center',
    backgroundColor: '#00e5faff',
    borderColor: '#00e5faff',
    padding: 10,
    borderRadius: 8,
  },
    overlayContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  overlayMiddle: {
    flexDirection: 'row',
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scanBox: {
    width: 300,
    height: 150,
    borderWidth: 2,
    borderColor: '#00E5FA', // bright blue outline
    borderRadius: 12,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});