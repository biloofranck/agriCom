import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface Prediction {
  status: string;
  confidence: number;
}

export default function AddListingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const title = Array.isArray(params.title) ? params.title[0] : params.title || '';
  const quantity = Array.isArray(params.quantity) ? params.quantity[0] : params.quantity || '';
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

  const [predictions, setPredictions] = useState<Record<string, Prediction>>(() => {
    try {
      const raw = Array.isArray(params.predictions) ? params.predictions[0] : params.predictions;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') return parsed;
      }
      return {};
    } catch (e) {
      console.warn('Error parsing predictions:', e);
      return {};
    }
  });

  const uploadImageForPrediction = async (uri: string) => {
    const apiUrl = 'http://172.20.10.3:8000/predict';
    const fileName = uri.split('/').pop() || `image_${Date.now()}.jpg`;

    const formData = new FormData();
    formData.append('file', {
      uri,
      name: fileName,
      type: 'image/jpeg',
    } as any);

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return await response.json(); // { product, status, confidence }
  };

  const saveImagePermanently = async (uri: string) => {
    const appImagesDirectory = `${FileSystem.documentDirectory}app_images/`;

    const directoryInfo = await FileSystem.getInfoAsync(appImagesDirectory);
    if (!directoryInfo.exists) {
      await FileSystem.makeDirectoryAsync(appImagesDirectory, { intermediates: true });
    }

    const fileName = uri.split('/').pop();
    const newUri = `${appImagesDirectory}${Date.now()}_${fileName}`;

    try {
      await FileSystem.copyAsync({ from: uri, to: newUri });
      return newUri;
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save image.');
      return uri;
    }
  };

  const pickImage = async () => {
    if (selectedImages.length >= 4) {
      Alert.alert('Image Limit', 'You can only add up to 4 images.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'Grant media access to upload.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images', // <== Updated here
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      const tempUri = result.assets[0].uri;
      const permanentUri = await saveImagePermanently(tempUri);
      if (permanentUri) {
        setSelectedImages((prev) => [...prev, permanentUri]);

        try {
          const prediction = await uploadImageForPrediction(permanentUri);
          setPredictions((prev) => ({
            ...prev,
            [permanentUri]: {
              status: prediction.status,
              confidence: prediction.confidence,
            },
          }));

          Alert.alert(
            '🧠 Prediction Result',
            `📦 Product: ${prediction.product}\n` +
              `✅ Status: ${prediction.status}\n` +
              `📈 Confidence: ${(prediction.confidence * 100).toFixed(2)}%`
          );
        } catch (error: any) {
          Alert.alert('❌ Prediction Failed', error.message || 'An error occurred');
        }
      }
    }
  };

  const removeImage = (uriToRemove: string) => {
    setSelectedImages((prev) => prev.filter((uri) => uri !== uriToRemove));
    setPredictions((prev) => {
      const updated = { ...prev };
      delete updated[uriToRemove];
      return updated;
    });
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
      const prediction = predictions[imageUri];
      const statusColor =
        prediction?.status?.toLowerCase() === 'fresh' ? 'bg-green-500' : 'bg-red-500';

      return (
        <View className="relative w-[48%] h-36 rounded-lg overflow-hidden mb-4">
          <Image source={{ uri: imageUri }} className="w-full h-full" />
          <TouchableOpacity
            onPress={() => onRemove?.(imageUri)}
            className="absolute top-2 right-2 p-1 bg-gray-700/50 rounded-full z-10"
          >
            <Text className="text-white text-xs font-bold">X</Text>
          </TouchableOpacity>

          {prediction && (
            <View
              className={`absolute bottom-2 left-2 px-2 py-1 rounded-md ${statusColor} bg-opacity-80`}
            >
              <Text className="text-white text-xs font-semibold">
                {prediction.status} ({(prediction.confidence * 100).toFixed(0)}%)
              </Text>
            </View>
          )}
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
      pathname: '/add',
      params: {
        title,
        quantity,
        description,
        listingType,
        price,
        selectedImages: JSON.stringify(selectedImages),
        predictions: JSON.stringify(predictions), // Pass predictions back
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
        predictions: JSON.stringify(predictions), // Pass predictions forward
      },
    });
  };

  return (
    <View className="flex-1 p-6">
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
          className={`flex-1 ml-2 p-3 rounded-full ${
            selectedImages.length === 0 ? 'bg-gray-300' : 'bg-[#34D399]'
          } items-center`}
          onPress={goNext}
          disabled={selectedImages.length === 0}
        >
          <Text className="text-white text-base font-semibold">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
