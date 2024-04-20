import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { Link } from 'expo-router'
export default function App() {
  return (
    <View className="flex-1 h-screen items-center justify-center">
      <Text className="text-3xl font-pblack">Hello</Text>
          <StatusBar style="auto" />
          <Link href="/home" style={ {color:'red'} }>Go to Home</Link>
    </View>
  );
}
