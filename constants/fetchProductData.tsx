import axios from 'axios';

async function fetchProductData(barcode: string) {
    try {
        const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        if (response.data.status === 1) {
            //console.log('Product found:', response.data.product);
            return response.data.product;
        } else {
            //console.log('Product not found');
            return null;
        }
    } catch (error) {
        //console.error('Error fetching product data:', error);
        return null;
    }
}

export default fetchProductData;