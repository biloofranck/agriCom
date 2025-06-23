// app/(tabs)/messages/index.js
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Sample chat data (no changes needed here, IDs are unique)
const chats = [
  {
    id: '1',
    name: 'Andrew Witmer',
    lastMessage: 'Hi, nice to meet you',
    time: 'Today',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    isOnline: false,
    status: 'Today',
  },
  {
    id: '2',
    name: 'Alex Smith',
    lastMessage: 'Typing Message...',
    time: '',
    avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
    isOnline: true,
    status: 'Typing Message...',
  },
  {
    id: '3',
    name: 'Anna Asol',
    lastMessage: 'I have idea',
    time: 'Today',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    isOnline: false,
    status: 'Today',
  },
  {
    id: '4',
    name: 'Anna Asol', // Duplicate name for demonstration
    lastMessage: 'How are you?',
    time: '27/01',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    isOnline: false,
    status: '27/01',
  },
  {
    id: '5',
    name: 'Skylar Geidt',
    lastMessage: "Look I's my new kitchen",
    time: '25/01',
    avatar: 'https://randomuser.me/api/portraits/women/46.jpg',
    isOnline: false,
    status: '25/01',
  },
  {
    id: '6',
    name: 'Angel Franci',
    lastMessage: 'Hi, nice to meet you',
    time: '24/01',
    avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
    isOnline: false,
    status: '24/01',
  },
];

export default function ChatListScreen() {
  const [activeTab, setActiveTab] = useState("General"); // State for active tab

  // Define your tabs with a consistent ID or base name for keys
  const tabs = [
    { name: 'General', display: `General(${chats.filter(c => c.status === 'Today' || c.status === 'Typing Message...').length})` },
    { name: 'Services', display: 'Services' },
    { name: 'Request', display: 'Request' },
  ];

  const filteredChats = chats.filter((chat) => {
    if (activeTab === 'General') return true;
    if (activeTab === 'Services' && chat.name.includes('Smith')) return true;
    if (activeTab === 'Request' && chat.name.includes('Anna')) return true;
    return false;
  });

  return (
    <View className="flex-1 bg-gray-100 pt-12">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pb-4">
        {/* Adjusted: If this is the main messages screen, router.back() might go back to the previous tab or just close the app if no history. */}
        {/* For a true back button if you navigate to this screen, it's fine. */}
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Message</Text>
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-4">
            <Ionicons name="search-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="filter" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-4 pb-4">
        <View className="flex-row items-center bg-white rounded-xl px-3 py-2 shadow-sm">
          <Ionicons name="search-outline" size={20} color="gray" className="mr-2" />
          <TextInput
            placeholder="Search..."
            className="flex-1 text-base"
            placeholderTextColor="gray"
          />
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row justify-around border-b border-gray-200 bg-white px-4 pt-2 pb-2">
        {tabs.map((tabItem) => (
          <TouchableOpacity
            key={tabItem.name}
            onPress={() => setActiveTab(tabItem.name)}
            className={`py-2 ${
              activeTab === tabItem.name ? 'border-b-2 border-green-500' : ''
            }`}
          >
            <Text
              className={`text-base ${
                activeTab === tabItem.name ? 'text-green-500 font-semibold' : 'text-gray-500'
              }`}
            >
              {tabItem.display}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chat List */}
      <ScrollView className="flex-1 bg-white">
        {filteredChats.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            className="flex-row items-center p-4 border-b border-gray-100"
            // FIX: Updated pathname to match the nested route type
            onPress={() => router.push({ pathname: '/(tabs)/messages/[id]', params: { id: chat.id } })}
          >
            <View className="relative mr-3">
              <Image source={{ uri: chat.avatar }} className="w-14 h-14 rounded-full" />
              {chat.isOnline && (
                <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">{chat.name}</Text>
              <Text className="text-gray-500 text-sm mt-1" numberOfLines={1}>
                {chat.lastMessage}
              </Text>
            </View>
            <View className="items-end ml-2">
              <Text className="text-gray-400 text-xs mb-1">{chat.status}</Text>
              {chat.isOnline && (
                <View className="w-2 h-2 bg-green-500 rounded-full" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}