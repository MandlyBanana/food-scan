
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(auth)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

/*
import { Stack } from 'expo-router';


export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {  

  return (
      <Stack>
        <Stack.Screen name='(tabs)' options={{}}/>
      </Stack>
  );
};
*/
