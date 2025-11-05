import { getFile } from '@/constants/fs';
import getQuantity from '@/constants/getQuantity';
import { useFocusEffect } from 'expo-router'; // to refresh when screen is focused
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";


type Product = {
  id: number;
  expirationDate: string;
  productData: Record<string, any>; // allows any nested structure
};


export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [])


  async function refresh() {
    try {
      const file = await getFile('products.json');
      const text = await file.textSync();
      if (text && text !== '') {
        const parsed = JSON.parse(text);
        setProducts(Array.isArray(parsed) ? parsed : []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Failed to read products file', error);
      setProducts([]);
    }
  }

  async function deleteEntry(id: number) {
    try {
      const file = await getFile('products.json');
      if (!file.exists) return;

      const text = await file.textSync();
      let parsed: Product[] = [];
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        parsed = [];
      }

      const updated = parsed.filter((p) => p.id !== id);
      await file.write(JSON.stringify(updated, null, 2));
      setProducts(updated);

      const constFile = await getFile('constants.json');
      if (constFile.exists) {
        const text2 = await constFile.textSync();
        let constants: Record<string, any> = {};
        try {
          constants = JSON.parse(text2);
        } catch (e) {
          constants = {};
        }
        console.log('constants before deletion:', constants);
        const removedProduct = parsed.find((p) => p.id === id);
        const removeWeight = Number(getQuantity(removedProduct?.productData._id) || 0);
        constants.totalWeight = Number(constants.totalWeight || 0) + removeWeight;
        await constFile.write(JSON.stringify(constants, null, 2));
        console.log('constants after deletion:', constants);
      }

    } catch (error) {
      console.error('Failed to delete entry', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      //console.log('entereed page');
      refresh();
      return;//console.log('exited page');
    }, [])
  );
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product List</Text>

      {products.length === 0 ? (
        <Text style={styles.empty}>No products saved.</Text>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
          }
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.name}>{item.productData.product_name || 'not defined'}</Text>
              <Text style={styles.date}>Expires: {item.expirationDate}</Text>
              <Text style={styles.date}>Weight: {item.productData.quantity || 'not defined'}</Text>
              <TouchableOpacity onPress={() => deleteEntry(item.id)}>
                <Text style={{ color: 'red' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  empty: {
    color: "#888",
  },
  item: {
    paddingVertical: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
});