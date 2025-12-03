import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Helper to normalize query params to a single string
const toStringParam = (v: string | string[] | undefined): string | undefined =>
  Array.isArray(v) ? v[0] : v;

export default function AddScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Initialize state from params (if coming back from addScreen2 or summary)
  const [title, setTitle] = useState(toStringParam(params.title) ?? '');
  const [quantity, setQuantity] = useState(toStringParam(params.quantity) ?? "" );

  const [description, setDescription] = useState(toStringParam(params.description) ?? '');
  const [listingType, setListingType] = useState(toStringParam(params.listingType) ?? 'Goods'); // 'Goods' or 'Services'
  const [price, setPrice] = useState(Number(toStringParam(params.price)) || 1250);

  const handleNext = () => {
    router.push({
      pathname: '/screens/addScreen2',
      params: {
        title,
        description,
        listingType,
        quantity,
        price: price.toString(),
        selectedImages: typeof params.selectedImages === 'string'
          ? params.selectedImages
          : JSON.stringify(params.selectedImages ?? []),
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 mt-8">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <View className="w-3 h-3 border-b-2 border-l-2 border-black rotate-45" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold">Add Listing</Text>
          <View className="w-8" />
        </View>

        {/* Progress Indicator */}
        <View className="mb-6">
          <Text className="text-sm text-gray-600 mb-2">Step 1/3 General Information</Text>
          <View className="flex-row h-2 rounded-full bg-gray-200">
            <View className="w-1/3 bg-[#34D399] rounded-full" />
          </View>
        </View>

        {/* Title Input */}
        <View className="mb-4">
          <Text className="text-base font-medium mb-2">Title</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-base"
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
        </View>

         <View className="mb-4">
          <Text className="text-base font-medium mb-2">Quantity</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-base"
            placeholder="quantity"
            value={quantity}
            onChangeText={setQuantity}
          />
        </View>

        {/* Description Input */}
        <View className="mb-4">
          <Text className="text-base font-medium mb-2">Description</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-base h-24"
            placeholder="Description"
            multiline
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Listing Type Radio Buttons */}
        <View className="mb-6">
          <Text className="text-base font-medium mb-3">Listing Type</Text>
          <TouchableOpacity
            className="flex-row items-center mb-2"
            onPress={() => setListingType('Goods')}
          >
            <View
              className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center ${
                listingType === 'Goods' ? 'border-[#34D399] bg-[#34D399]' : 'border-gray-400'
              }`}
            >
              {listingType === 'Goods' && <View className="w-2.5 h-2.5 rounded-full bg-white" />}
            </View>
            <Text className="text-base">Goods</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => setListingType('Services')}
          >
            <View
              className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center ${
                listingType === 'Services' ? 'border-[#34D399] bg-[#34D399]' : 'border-gray-400'
              }`}
            >
              {listingType === 'Services' && <View className="w-2.5 h-2.5 rounded-full bg-white" />}
            </View>
            <Text className="text-base">Services</Text>
          </TouchableOpacity>
        </View>

        {/* Price Control */}
        <View className="mb-10">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base font-medium">Price</Text>
            <Text className="text-lg font-bold text-[#34D399]">FCFA {price}</Text>
          </View>
          <View className="relative h-2 rounded-full bg-gray-300">
            <View
              className="absolute h-2 rounded-full bg-[#34D399]"
              style={{ width: `${(price / 10000) * 100}%` }}
            />
            <View
              className="absolute -top-1 w-4 h-4 rounded-full bg-[#34D399]"
              style={{ left: `${(price / 10000) * 100}%`, transform: [{ translateX: -8 }] }}
            />
          </View>
          <View className="flex-row justify-between items-center mt-4">
            <TouchableOpacity className="px-3 py-2" onPress={() => setPrice(Math.max(0, price - 50))}>
              <Text className="text-lg font-bold text-[#34D399]">-</Text>
            </TouchableOpacity>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 text-center w-24"
              keyboardType="numeric"
              value={String(price)}
              onChangeText={(text) => setPrice(parseInt(text, 10) || 0)}
            />
            <TouchableOpacity className="px-3 py-2" onPress={() => setPrice(Math.min(10000, price + 50))}>
              <Text className="text-lg font-bold text-[#34D399]">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Next Step Button */}
        <TouchableOpacity
          className="bg-[#34D399] py-4 rounded-full mb-8"
          onPress={handleNext}
          disabled={!title || !quantity ||!description || !listingType || price <= 0}
        >
          <Text className="text-white text-center text-lg font-semibold">Next Step</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
