import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { default as Theme } from '../../constants/theme';

export default function Login() {
  const router = useRouter();

  //useEffect(() => {
  //  async function setupFile() {
  //    const file2 = new File(Paths.document, 'constants.json');
  //    //const exists = await file2.existsAsync(); // check asynchronously
  //    if (!file2.exists) {
  //      await file2.create();
  //      const initialConstants = { 
  //        totalWeight: 0 
  //      };
  //      await file2.write(JSON.stringify(initialConstants, null, 2));
  //    }
  //  }
  //  setupFile();
  //}, []); // empty dependency array → runs only once on mount
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food Scan</Text>
      <Image
        style={styles.logo}
        source={require('../../assets/images/icon.png')}
      />
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/dashboard')}>
        <Text style={styles.text}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/scan')}>
        <Text style={styles.text}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

/*import { Button, StyleSheet, Text, View } from "react-native";


export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Madspilds App</Text>
      <Button style={styles.button}>
        <Text style={styles.text}>Login</Text>
      </Button>
      <Button style={styles.button}>
        <Text style={styles.text}>Sign Up</Text>
      </Button>
    </View>
  );
}*/

//function checkIfLoggedOn() {
//  if(isLoggedIn==true) {
//    
//  }
//};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  text: {
    color: Theme.colors.text,
    fontSize: 20
  },
  title: {
    fontSize: 40,
    color: Theme.colors.title,
    marginBottom: 75,
  },
  button: {
    borderRadius: 25,
    width: 200,
    height: 50,
    borderWidth: 5,
    borderColor: Theme.colors.text,
    backgroundColor: Theme.colors.accent,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 50,
    //marginTop: -50
  }
});