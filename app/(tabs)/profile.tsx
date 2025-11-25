import React, { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView, StatusBar, Image, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Feather, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// --- LOCAL IMAGE IMPORTS ---
// Make sure these paths correctly point to your images in the assets folder
const defaultBackground = require('../../assets/images/kitchen3.jpg');
const defaultProfilePic = require('../../assets/images/profile1.jpg');
const defaultKitchen1 = require('../../assets/images/banana3.jpg');
const defaultKitchen2 = require('../../assets/images/tomatoes1.jpg');

// Get screen height for more adaptive layout if needed, though Tailwind mostly handles it
const { height: screenHeight } = Dimensions.get('window');

export default function App() {
  const [activeTab, setActiveTab] = useState('Posts');
  const [backgroundImage, setBackgroundImage] = useState(defaultBackground);
  const [profilePic, setProfilePic] = useState(defaultProfilePic);

  useEffect(() => {
    (async () => {
      const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync(); // Request camera permission too for 'Take Photo'
      
      if (mediaLibraryStatus !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need access to your photo library to pick images!');
      }
      if (cameraStatus !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera access to take photos!');
      }
    })();
  }, []);

  const stats = [
    { label: 'Posts', value: '100' },
    { label: 'Goods', value: '33' },
    { label: 'Followers', value: '3.2K' },
    { label: 'Following', value: '435' },
  ];

  const tabs = [
    { name: 'Posts', count: null },
    { name: 'Ads', count: null },
    { name: 'Reviews', count: 10 },
  ];

  const post = {
    profilePic: profilePic,
    name: 'Anna Asol',
    time: 'Just Now',
    content: 'I want to show my new kitchen which some company finish for me yesterday. What do you think about it.',
    images: [
      defaultKitchen1,
      defaultKitchen2,
    ],
  };

  const pickImage = async (setImageFunction: { (value: any): void; (value: any): void; (arg0: { uri: string; }): void; }) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3], // Common aspect ratio, adjust as needed
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageFunction({ uri: result.assets[0].uri });
    }
  };

  const pickCameraImage = async (setImageFunction: { (value: any): void; (arg0: { uri: string; }): void; }) => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square for profile pic
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageFunction({ uri: result.assets[0].uri });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 mt-8">
      <StatusBar barStyle="dark-content" />
      <ScrollView className="flex-1">

        {/* --- Header Section --- */}
        {/* Adjusted header height for better responsiveness relative to screen height */}
        <View className="relative w-full" style={{ height: screenHeight * 0.35 }}> 
          {/* Background Image */}
          <Image
            source={backgroundImage}
            className="w-full h-full object-cover"
          />

          {/* Top Navigation Bar */}
          <View className="absolute top-4 left-4 right-4 flex-row justify-between items-center z-10">
            <Text className="text-gray-800 font-bold text-lg">Profile</Text>
            <View className="flex-row items-center space-x-4">
              <MaterialCommunityIcons name="crown" size={24} color="#2DD4BF" />
              <Feather name="settings" size={22} color="gray" />
            </View>
          </View>

          {/* Change Background Button */}
          {/* Adjusted top position to be more relative to the header's height */}
          <TouchableOpacity
            className="absolute top-[20%] right-4 bg-gray-700/60 flex-row items-center px-3 py-1.5 rounded-full z-10"
            onPress={() => pickImage(setBackgroundImage)}
          >
            <Feather name="image" size={16} color="white" />
            <Text className="text-white text-sm ml-2">Change Background</Text>
          </TouchableOpacity>

          {/* Profile Picture */}
          {/* Using a more relative top position and ensuring the border is consistent */}
          <View className="absolute left-4 top-[65%] w-24 h-24 rounded-full border-4 border-white overflow-hidden z-20">
            <Image
              source={profilePic}
              className="w-full h-full object-cover"
            />
            {/* Camera icon on profile pic */}
            <TouchableOpacity
              className="absolute bottom-0 right-0 bg-teal-400 p-1 rounded-full border-2 border-white"
              onPress={() => Alert.alert(
                "Change Profile Picture",
                "Choose an option:",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Choose from Library", onPress: () => pickImage(setProfilePic) },
                  { text: "Take Photo", onPress: () => pickCameraImage(setProfilePic) }
                ]
              )}
            >
              <Feather name="camera" size={14} color="white" />
            </TouchableOpacity>
          </View>

          {/* Profile Name and Edit Icon */}
          {/* Adjusted positioning relative to the profile pic's new, more dynamic position */}
          <View className="absolute left-[118px] top-[75%] flex-row items-center z-20">
            <Text className="text-xl font-bold text-gray-800">Anna Asol</Text>
            <TouchableOpacity className="ml-2">
              <Feather name="edit-2" size={18} color="#2DD4BF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Profile Stats Section --- */}
        {/* Adjusted mt to overlap with profile pic regardless of screen size */}
        <View className="flex-row justify-around py-4 px-4 bg-white mt-[-20px] rounded-t-xl shadow-sm z-10">
          {stats.map((stat, index) => (
            <View key={index} className="items-center">
              <Text className="text-lg font-bold text-gray-800">{stat.value}</Text>
              <Text className="text-sm text-gray-500">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* --- Tab Bar Section --- */}
        <View className="flex-row justify-around border-b border-gray-200 mt-4 bg-white">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.name}
              className={`py-3 flex-1 items-center ${activeTab === tab.name ? 'border-b-2 border-teal-500' : ''}`}
              onPress={() => setActiveTab(tab.name)}
            >
              <Text className={`text-base ${activeTab === tab.name ? 'text-teal-600 font-bold' : 'text-gray-600'}`}>
                {tab.name}
                {tab.count !== null && <Text className="text-gray-500">({tab.count})</Text>}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- Posts Section (Example Post Item) --- */}
        <View className="px-4 py-3">
          <View className="bg-white rounded-lg mb-4 shadow-sm">
            {/* Post Header */}
            <View className="flex-row items-center p-4">
              <Image
                source={post.profilePic}
                className="w-12 h-12 rounded-full mr-3"
              />
              <View className="flex-1">
                <Text className="font-semibold text-gray-800">Anna Asol</Text>
                <Text className="text-xs text-gray-500">Just Now</Text>
              </View>
              <TouchableOpacity className="p-2">
                <Entypo name="dots-three-horizontal" size={20} color="gray" />
              </TouchableOpacity>
            </View>

            {/* Post Content */}
            <View className="px-4 pb-4">
              <Text className="text-gray-700 leading-relaxed">
                {post.content}
              </Text>
            </View>

            {/* Post Images */}
            <View className="flex-row flex-wrap justify-between px-4 pb-4 gap-2">
              {post.images.map((imageSource, index) => (
                <Image
                  key={index}
                  source={imageSource}
                  className="w-[calc(50%-4px)] h-40 rounded-lg"
                />
              ))}
            </View>
          </View>
        </View>
        {/* Add more PostItem views here if you have more posts */}
      </ScrollView>
    </SafeAreaView>
  );
}