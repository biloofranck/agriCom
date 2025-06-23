import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
}
 from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import profileImage from "../../assets/images/profile1.jpg"; // Renamed for clarity
import Kitchen from "../../assets/images/kitchen1.jpg"; // Renamed for clarity
import Kitchen1 from "../../assets/images/kitchen4.jpg"; // Renamed for clarity




const products = [
  {
    id: 'p1',
    name: 'Modern Round Coffee Table',
    price: '$129.99',
    image:
      Kitchen
  },
  {
    id: 'p2',
    name: 'Cozy Living Room Sofa',
    price: '$599.00',
    image:Kitchen1  },
  {
    id: 'p3',
    name: 'Elegant Beige Sectional',
    price: '$849.00',
    image:
     Kitchen1
  },
  {
    id: 'p4',
    name: 'Minimalist Wooden Desk',
    price: '$249.99',
    image:
      Kitchen
  },
  {
    id: 'p5',
    name: 'Luxury Velvet Armchair',
    price: '$399.00',
    // Correct way to assign a local image import directly
    image:Kitchen1,
  },
  {
    id: 'p6',
    name: 'Stylish Home Office Setup',
    price: '$729.00',
    // Correct way to assign a local image import directly
    image: Kitchen1
  },
];

export default function ShopScreen() {
  const [activeTab, setActiveTab] = useState<'Products' | 'Services'>('Products');

  const renderProductItem = ({item }) => {
    // Determine if the image is a local import or a URI string
    const imageSource = typeof item.image === 'string' ? { uri: item.image } : item.image;

    return (
      <TouchableOpacity
        key={item.id}
        className="w-[48%] mb-5 bg-white rounded-2xl overflow-hidden shadow-sm"
        style={{ marginHorizontal: '1%' }}
      >
        <Image source={imageSource} className="w-full h-36" resizeMode="cover" />
        <View className="p-3 relative">
          <Text className="font-semibold text-base text-gray-800 mb-1" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-emerald-600 font-bold text-lg">{item.price}</Text>

          {/* Chat icon */}
          <TouchableOpacity className="absolute bottom-3 right-3 p-1 bg-emerald-100 rounded-full">
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#059669" />
          </TouchableOpacity>

          {/* Favorite icon */}
          <TouchableOpacity className="absolute top-3 right-3 p-1 bg-white rounded-full">
            <Ionicons name="heart-outline" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-4">
        {/* Location & Notification */}
        <View className="flex-row justify-between items-center mb-5">
          <View className="flex-row items-center">
            <Ionicons name="location-sharp" size={20} color="#10B981" />
            <Text className="ml-1 text-base font-semibold text-gray-800">Los Angeles</Text>
            <Ionicons name="chevron-down" size={16} color="gray" className="ml-1" />
          </View>
          <TouchableOpacity className="p-2 rounded-full bg-gray-100">
            <Ionicons name="notifications-outline" size={24} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="flex-row bg-gray-200 rounded-full p-1 mb-4">
          {['Products', 'Services'].map((tab) => (
            <TouchableOpacity
              key={tab}
              className={`flex-1 py-2 rounded-full ${
                activeTab === tab ? 'bg-white shadow-sm' : ''
              }`}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === tab ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-5 shadow-sm">
          <Ionicons name="search-outline" size={20} color="gray" />
          <TextInput
            placeholder="Search product or service..."
            className="flex-1 ml-3 text-base text-gray-700"
            placeholderTextColor="gray"
          />
          <TouchableOpacity>
            <Ionicons name="options-outline" size={24} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Product Grid */}
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
        />
      </View>
    </SafeAreaView>
  );
}