import { Drawer } from 'expo-router/drawer';

export default function TabsGroupLayout() {
  return (
    <Drawer>  
      <Drawer.Screen 
        name="dashboard"
        options={{ title: 'Dashboard' }}
      />
      <Drawer.Screen 
        name="productList"
        options={{ title: 'Product List' }}
      />
      <Drawer.Screen 
        name="scan"
        options={{ title: 'Scan a new product' }}
      /> 
    </Drawer>
  );
};
/*
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ title: 'Home' }}
      />
      <Tabs.Screen
        name="homescreen"
        options={{ title: 'Home Screen' }}
      />
    </Tabs>
  );
}


<Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen name='index' options={{ title: 'Home'}} />
        <Tabs.Screen name='homescreen' options={{ title: 'Profile' }} />
    </Tabs>
*/