import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'; // Import FileSystem
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function AddListingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const title = Array.isArray(params.title) ? params.title[0] : params.title || '';
  const quantity = Array.isArray(params.quantity)
    ? params.quantity[0]
    : params.quantity || "";
  const description = Array.isArray(params.description) ? params.description[0] : params.description || '';
  const listingType = Array.isArray(params.listingType) ? params.listingType[0] : params.listingType || '';
  const price = Array.isArray(params.price) ? params.price[0] : params.price || '';

  const [selectedImages, setSelectedImages] = useState<string[]>(() => {
    try {
      const raw = Array.isArray(params.selectedImages) ? params.selectedImages[0] : params.selectedImages;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch (e) {
      console.warn('Error parsing selectedImages:', e);
      return [];
    }
  });

  // Function to move image to a permanent directory
  const saveImagePermanently = async (uri: string) => {
    // Define the directory for your app's images
    const appImagesDirectory = `${FileSystem.documentDirectory}app_images/`;

    // Ensure the directory exists
    const directoryInfo = await FileSystem.getInfoAsync(appImagesDirectory);
    if (!directoryInfo.exists) {
      await FileSystem.makeDirectoryAsync(appImagesDirectory, { intermediates: true });
    }

    // Generate a unique file name
    const fileName = uri.split('/').pop(); // Get original file name
    const newUri = `${appImagesDirectory}${Date.now()}_${fileName}`; // Add timestamp for uniqueness

    try {
      await FileSystem.copyAsync({
        from: uri,
        to: newUri,
      });
      return newUri; // Return the new permanent URI
    } catch (error) {
      console.error('Error saving image permanently:', error);
      Alert.alert('Error', 'Failed to save image. Please try again.');
      return uri; // Fallback to original URI if save fails, though it might not display
    }
  };


  // Pick image handler
  const pickImage = async () => {
    if (selectedImages.length >= 4) {
      Alert.alert('Image Limit Exceeded', 'You can only add up to 4 images.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant media library permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const tempUri = result.assets[0].uri;
      const permanentUri = await saveImagePermanently(tempUri); // Save the image
      if (permanentUri) {
        setSelectedImages([...selectedImages, permanentUri]);
      }
    }
  };

  const removeImage = (uriToRemove: string) => {
    // Optionally, you can also delete the file from FileSystem when removed from the list
    // FileSystem.deleteAsync(uriToRemove, { idempotent: true }).catch(e => console.log("Failed to delete file:", e));
    setSelectedImages(selectedImages.filter(uri => uri !== uriToRemove));
  };

  const ImageSlot = ({
    imageUri,
    onAdd,
    onRemove,
  }: {
    imageUri?: string;
    onAdd?: () => void;
    onRemove?: (uri: string) => void;
  }) => {
    if (imageUri) {
      return (
        <View className="relative w-[48%] h-36 rounded-lg overflow-hidden mb-4">
          <Image source={{ uri: imageUri }} className="w-full h-full" />
          <TouchableOpacity
            onPress={() => onRemove?.(imageUri)}
            className="absolute top-2 right-2 p-1 bg-gray-700/50 rounded-full"
          >
            <Text className="text-white text-xs font-bold">X</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={onAdd}
          className="w-[48%] h-36 border-2 border-dashed border-[#34D399] rounded-lg justify-center items-center mb-4 bg-teal-50"
        >
          <Text className="text-[#34D399] text-3xl mb-2">⬆️</Text>
          <Text className="text-[#34D399] text-sm">Add Image</Text>
        </TouchableOpacity>
      );
    }
  };

  const goBack = () => {
    router.push({
      pathname: '/add', // Assuming '/add' is your first screen for general info
      params: {
        title,
        quantity,
        description,
        listingType,
        price,
        selectedImages: JSON.stringify(selectedImages),
      },
    });
  };

  const goNext = () => {
    router.push({
      pathname: '/screens/summaryScreen',
      params: {
        title,
        quantity,
        description,
        listingType,
        price,
        selectedImages: JSON.stringify(selectedImages),
      },
    });
  };

  return (
    <View className="flex-1  p-6">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center mt-8 justify-between py-4">
        <TouchableOpacity onPress={goBack}>
          <Text className="text-2xl">{'<'}</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Add Products</Text>
        <View className="w-6 h-6" />
      </View>

      {/* Progress Indicator */}
      <View className="mb-6 mt-2">
        <Text className="text-gray-500 text-sm mb-2">Step 2/3 Add Photo & Videos</Text>
        <View className="h-2 bg-gray-200 rounded-full">
          <View className="w-2/3 h-full bg-[#34D399] rounded-full" />
        </View>
      </View>

      {/* Image Grid */}
      <View className="flex-row flex-wrap justify-between">
        {selectedImages.map((uri, index) => (
          <ImageSlot key={`${uri}-${index}`} imageUri={uri} onRemove={removeImage} />
        ))}
        {[...Array(4 - selectedImages.length)].map((_, index) => (
          <ImageSlot key={`empty-${index}`} onAdd={pickImage} />
        ))}
      </View>

      {/* Navigation Buttons */}
      <View className="flex-row justify-between mt-auto py-4">
        <TouchableOpacity
          className="flex-1 mr-2 p-3 rounded-full border border-teal-500 items-center"
          onPress={goBack}
        >
          <Text className="text-[#34D399] text-base font-semibold">Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 ml-2 p-3 rounded-full ${selectedImages.length === 0 ? 'bg-gray-300' : 'bg-[#34D399]'} items-center`}
          onPress={goNext}
          disabled={selectedImages.length === 0}
        >
          <Text className="text-white text-base font-semibold">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}