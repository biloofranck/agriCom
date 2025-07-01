// No changes needed in SummaryScreen.tsx for this fix,
// as it correctly parses the JSON and the Image component will
// now receive valid persistent URIs.
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function SummaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const title = Array.isArray(params.title)
    ? params.title[0]
    : params.title || "";
  const quantity = Array.isArray(params.quantity)
    ? params.quantity[0]
    : params.quantity || "";

  const description = Array.isArray(params.description)
    ? params.description[0]
    : params.description || "";
  const listingType = Array.isArray(params.listingType)
    ? params.listingType[0]
    : params.listingType || "";
  const price = Array.isArray(params.price)
    ? params.price[0]
    : params.price || "";

  const rawImages = Array.isArray(params.selectedImages)
    ? params.selectedImages[0]
    : params.selectedImages || "[]";
  let imagesArray: string[] = [];
  try {
    imagesArray = JSON.parse(rawImages);
    if (!Array.isArray(imagesArray)) imagesArray = [];
  } catch {
    imagesArray = [];
  }

  const handleEditGeneralInformation = () => {
    router.push({
      pathname: "/(tabs)/add",
      params: {
        title,
        quantity,
        description,
        listingType,
        price,
        selectedImages: JSON.stringify(imagesArray),
      },
    });
  };

  const handleEditPhotos = () => {
    router.push({
      pathname: "/screens/addScreen2",
      params: {
        title,
        quantity,
        description,
        listingType,
        price,
        selectedImages: JSON.stringify(imagesArray),
      },
    });
  };

  const handlePublish = () => {
    alert("Listing Published!");
    console.log("Listing Data:", {
      title,
      quantity,
      description,
      listingType,
      price,
      imagesArray,
    });
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView className="flex-1 mt-8">
      <StatusBar style="dark" />
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <TouchableOpacity className="p-2" onPress={() => router.back()}>
            <View className="w-3 h-3 border-b-2 border-l-2 border-black rotate-45" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold">Add Listing</Text>
          <View className="w-8" />
        </View>

        {/* Progress */}
        <View className="mb-6">
          <Text className="text-sm text-gray-600 mb-2">
            Step 2/3: Check Ad & Publish
          </Text>
          <View className="flex-row h-2 rounded-full bg-gray-200">
            <View className="w-2/3 bg-[#34D399] rounded-full" />
            <View className="w-1/3 bg-[#34D399] rounded-full ml-1" />
          </View>
        </View>

        {/* General Info Summary */}
        <View className="mb-6 p-4 border border-gray-300 rounded-lg">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold">General Information</Text>
            <TouchableOpacity onPress={handleEditGeneralInformation}>
              <Text className="text-[#34D399] text-xl">✏️</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-base text-gray-700 mb-1">
            <Text className="font-medium">Title:</Text> {title}
          </Text>
           <Text className="text-base text-gray-700 mb-1">
            <Text className="font-medium">Quantity:</Text> {quantity}
          </Text>
          <Text className="text-base text-gray-700 mb-1">
            <Text className="font-medium">Description:</Text> {description}
          </Text>
          <Text className="text-base text-gray-700 mb-1">
            <Text className="font-medium">Ad Type:</Text> {listingType}
          </Text>
          <Text className="text-base text-gray-700">
            <Text className="font-medium">Price:</Text> {price} FCFA
          </Text>
        </View>

        {/* Photos Summary */}
        <View className="mb-6 p-4 border border-gray-300 rounded-lg">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold">Add Photo & Videos</Text>
            <TouchableOpacity onPress={handleEditPhotos}>
              <Text className="text-[#34D399] text-xl">✏️</Text>
            </TouchableOpacity>
          </View>

          {imagesArray.length > 0 ? (
            <View className="flex-row flex-wrap">
              {imagesArray.map((uri: string, index) => (
                <Image
                  key={`${uri}-${index}`}
                  source={{ uri }}
                  className="w-20 h-20 rounded-lg mr-2 mb-2"
                  resizeMode="cover"
                />
              ))}
            </View>
          ) : (
            <Text className="text-base text-gray-500">No photos added.</Text>
          )}
        </View>

        {/* Publish Button */}
        <TouchableOpacity
          className="bg-[#34D399] py-4 rounded-full mb-8"
          onPress={handlePublish}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Publish Listing
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
