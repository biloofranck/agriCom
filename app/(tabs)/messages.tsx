import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

export default function PricePredictionScreen() {
  const [region, setRegion] = useState('');
  const [market, setMarket] = useState('');
  const [product, setProduct] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);

  const apiUrl = "http://172.20.10.3:8000/predict-price"; // Change to your server IP

  const handlePredict = async () => {
    const trimmedRegion = region.trim().toLocaleLowerCase();
    const trimmedMarket = market.trim().toLocaleLowerCase();
    const trimmedProduct = product.trim().toLocaleLowerCase();
    const trimmedYear = year.trim().toLocaleLowerCase();
    const trimmedMonth = month.trim().toLocaleLowerCase();

    if (!trimmedRegion || !trimmedMarket || !trimmedProduct || !trimmedYear || !trimmedMonth) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(apiUrl, {
        region: trimmedRegion,
        market: trimmedMarket,
        product: trimmedProduct,
        year: parseInt(trimmedYear),
        month: parseInt(trimmedMonth),
      });

      setPredictedPrice(response.data.predicted_price);
    } catch (error: any) {
      Alert.alert(
        "Prediction Error",
        error.response?.data?.detail || error.message || "Something went wrong"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 mt-16 p-6"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />

      <Text className="text-2xl font-bold mb-6 text-center">Price Prediction</Text>

      <TextInput
        placeholder="Region (e.g., Northern)"
        value={region}
        onChangeText={setRegion}
        className="border border-gray-300 rounded-md px-4 py-2 mb-4"
      />

      <TextInput
        placeholder="Market (e.g., Kano Market)"
        value={market}
        onChangeText={setMarket}
        className="border border-gray-300 rounded-md px-4 py-2 mb-4"
      />

      <TextInput
        placeholder="Product (e.g., Tomatoes)"
        value={product}
        onChangeText={setProduct}
        className="border border-gray-300 rounded-md px-4 py-2 mb-4"
      />

      <TextInput
        placeholder="Year (e.g., 2025)"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
        maxLength={4}
        className="border border-gray-300 rounded-md px-4 py-2 mb-4"
      />

      <TextInput
        placeholder="Month (1-12)"
        value={month}
        onChangeText={setMonth}
        keyboardType="numeric"
        maxLength={2}
        className="border border-gray-300 rounded-md px-4 py-2 mb-4"
      />

      <TouchableOpacity
        onPress={handlePredict}
        className="bg-green-500 rounded-md py-3 items-center"
      >
        <Text className="text-white font-semibold text-lg">Predict Price</Text>
      </TouchableOpacity>

      {predictedPrice !== null && (
        <View className="mt-6 p-4 bg-green-100 rounded-md">
          <Text className="text-green-800 text-lg font-semibold">
            Predicted Price: {predictedPrice} FCFA
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
