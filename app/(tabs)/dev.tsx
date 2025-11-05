import fetchProductData from '@/constants/fetchProductData';
import getQuantity from '@/constants/getQuantity';
import { File, Paths } from 'expo-file-system';
import { Button, View } from "react-native";

export default function Dev() {
    function clearFile() {
        try {
            const file = new File(Paths.document, 'products.json');
            if (file.exists) {
                // write an empty JSON array so readers don't get parse errors
                file.write('[]');
            }
        } catch(error) {
            console.error(error);
        }
    }

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
            <Button title='Clear FIle'onPress={clearFile} />
            <Button title='Fetch Test' onPress={getqty}/>
        </View>
    );
}