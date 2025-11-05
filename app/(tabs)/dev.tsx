import fetchProductData from '@/constants/fetchProductData';
import getQuantity from '@/constants/getQuantity';
//import { File, Paths } from 'expo-file-system';
import { getFile } from '@/constants/fs';
import { Button, View } from "react-native";


export default function Dev() {
    //function clearFile() {
    //    try {
    //        const file = new File(Paths.document, 'products.json');
    //        if (file.exists) {
    //            // write an empty JSON array so readers don't get parse errors
    //            file.write('[]');
    //        }
    //    } catch(error) {
    //        console.error(error);
    //    }
    //}


  async function newTest( ) {
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
        productData: { product_name: 'Test Product', quantity: "42g" },
        expirationDate: '2000-20-20'//date.toISOString().split('T')[0], // YYYY-MM-DD
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

    async function fetchTest() {
        try {
            const barcode = '4008400402222'; // example barcode
            const productData: Record<string, unknown>[] = await fetchProductData(barcode);
            //console.log('Fetched product data:', productData);
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    }
    function getqty() {
        getQuantity('4008400402222');
    }


    return (
        <View>
            <Button title='New Test' onPress={newTest} />
            <Button title='Fetch Test' onPress={getqty}/>
        </View>
    );
}


//             <Button title='Clear FIle'onPress={clearFile} />