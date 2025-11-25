import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context'; // For safe area handling

// IMPORTANT: Replace with the actual IP address of your machine running the FastAPI server
// If running on an emulator, '10.0.2.2' (Android) or 'localhost' (iOS) might work.
// For a physical device, use your machine's local IP address (e.g., '192.168.1.100')
const API_BASE_URL = 'http://192.168.43.139:8000';

// Define the TypeScript interface for the prediction result
// This should match the PredictionResponse BaseModel in your FastAPI backend
interface PredictionResult {
    predicted_price: number;
    product: string;
    region: string;
    market: string;
    year: number;
    month: number;
}

export default function App() {
    const [region, setRegion] = useState<string>('');
    const [market, setMarket] = useState<string>('');
    const [product, setProduct] = useState<string>('');
    const [year, setYear] = useState<string>('');
    const [month, setMonth] = useState<string>('');
    // Explicitly type predictionResult as PredictionResult or null
    const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handlePredict = async () => {
        setLoading(true);
        setError(null);
        setPredictionResult(null);

        // Basic client-side validation for numeric inputs
        const parsedYear = parseInt(year);
        const parsedMonth = parseInt(month);

        if (isNaN(parsedYear) || isNaN(parsedMonth) || !region || !market || !product) {
            setError("Please fill in all fields with valid data.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post<PredictionResult>(`${API_BASE_URL}/predict-price`, {
                region: region.trim(),
                market: market.trim(),
                product: product.trim(),
                year: parsedYear,
                month: parsedMonth,
            });
            setPredictionResult(response.data);
        } catch (err: any) { // Use 'any' for the catch error type for broader compatibility
            console.error("Error making prediction:", err); // Log the full error object for debugging
            if (err.response) {
                // Server responded with an error status (e.g., 400, 500)
                let errorMessage = "An unexpected server error occurred.";
                if (err.response.data) {
                    // Prioritize 'detail' from FastAPI, otherwise stringify the whole data object
                    errorMessage = err.response.data.detail || JSON.stringify(err.response.data);
                }
                setError(`Prediction Error: ${errorMessage}`);
            } else if (err.request) {
                // Request was made but no response was received (e.g., network issue, CORS)
                setError("Network Error: No response from server. Is FastAPI running and accessible? (Check IP/CORS)");
            } else {
                // Something else happened in setting up the request
                setError(`Request Setup Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="p-6">
                    <View className="items-center mb-8">
                        <Text className="text-3xl font-bold text-gray-800">Price Predictor</Text>
                        <Text className="text-lg text-gray-600 mt-2">Powered by FastAPI AI Model</Text>
                    </View>

                    {/* Input Fields */}
                    <View className="mb-4">
                        <Text className="text-base text-gray-700 mb-1">Region:</Text>
                        <TextInput
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
                            placeholder="e.g., New York"
                            value={region}
                            onChangeText={setRegion}
                            autoCapitalize="words"
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-base text-gray-700 mb-1">Market:</Text>
                        <TextInput
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
                            placeholder="e.g., Fish Market"
                            value={market}
                            onChangeText={setMarket}
                            autoCapitalize="words"
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-base text-gray-700 mb-1">Product:</Text>
                        <TextInput
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
                            placeholder="e.g., Tilapia"
                            value={product}
                            onChangeText={setProduct}
                            autoCapitalize="words"
                        />
                    </View>

                    <View className="flex-row justify-between mb-6">
                        <View className="w-[48%]">
                            <Text className="text-base text-gray-700 mb-1">Year:</Text>
                            <TextInput
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
                                placeholder="e.g., 2024"
                                keyboardType="numeric"
                                value={year}
                                onChangeText={setYear}
                            />
                        </View>
                        <View className="w-[48%]">
                            <Text className="text-base text-gray-700 mb-1">Month (1-12):</Text>
                            <TextInput
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800"
                                placeholder="e.g., 7"
                                keyboardType="numeric"
                                value={month}
                                onChangeText={setMonth}
                            />
                        </View>
                    </View>

                    {/* Predict Button */}
                    <TouchableOpacity
                        onPress={handlePredict}
                        disabled={loading}
                        className={`w-full p-4 rounded-lg flex-row justify-center items-center ${loading ? 'bg-blue-300' : 'bg-blue-600'}`}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="text-white text-lg font-semibold">Predict Price</Text>
                        )}
                    </TouchableOpacity>

                    {/* Error Display */}
                    {error && (
                        <View className="mt-6 p-4 bg-red-100 border border-red-400 rounded-lg">
                            <Text className="text-red-700 font-medium text-center">{error}</Text>
                        </View>
                    )}

                    {/* Prediction Result Display */}
                    {predictionResult && (
                        <View className="mt-8 p-6 bg-green-50 border border-green-300 rounded-lg shadow-md">
                            <Text className="text-lg font-bold text-green-800 mb-2">Prediction Successful!</Text>
                            <Text className="text-2xl font-extrabold text-green-700 mb-4">
                                Predicted Price: ${predictionResult.predicted_price.toFixed(2)}
                            </Text>
                            <View className="border-t border-green-200 pt-4">
                                <Text className="text-base text-gray-700">Product: {predictionResult.product}</Text>
                                <Text className="text-base text-gray-700">Region: {predictionResult.region}</Text>
                                <Text className="text-base text-gray-700">Market: {predictionResult.market}</Text>
                                <Text className="text-base text-gray-700">Year: {predictionResult.year}</Text>
                                <Text className="text-base text-gray-700">Month: {predictionResult.month}</Text>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}