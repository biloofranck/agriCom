import { Text, TouchableOpacity, View } from "react-native";
import {useRouter} from "expo-router"
import React from "react";
export default function Index() {
  const navigate = useRouter()
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-primary font-bold text-3xl">Default Screen!</Text>
      <TouchableOpacity onPress={() => navigate.push("/(tabs)/home")
      }>
        <Text>Go Home</Text>
      </TouchableOpacity>
    </View>
  );
}
