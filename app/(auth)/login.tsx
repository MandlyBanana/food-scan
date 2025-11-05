import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Login() {
    const router = useRouter();
    return (
        <View>
            <Text>TRUST YOU ARE NOW LOGGED IN </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/dashboard')}>
                <Text>Go to Home2vuzzzz</Text>
            </TouchableOpacity>
        </View>
    );
};

const Styles = StyleSheet.create({
    container: {

    }
});