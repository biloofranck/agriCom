import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity,  } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import React from 'react';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          height: 70,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
      tabBar={({ state, descriptors, navigation }) => {
        return (
          <View className="absolute  bottom-0 left-0 right-0 items-center justify-around  overflow-visible">
            {/* Curve SVG background */}
            <View className="w-full h-24 ">
              <Svg width="100%" height="100%" viewBox="0 10 90 80" preserveAspectRatio="none">
                <Path
                  d="M0,0 L0,100 L100,100 L100,0 C66,0 60,50 50,50 C40,50 34,0 0,0 Z"
                  fill="#030014"
                  scale={1.28}
                  transform="translate(-15, -3)"
                />
              </Svg>
            </View>

            {/* Tab bar icons */}
            <View className="absolute bottom-[12] w-full flex-row justify-around items-center    h-22 rounded-t-3xl shadow-lg">
              {state.routes.map((route, index) => {
                const isFocused = state.index === index;

                const onPress = () => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                };

                // Handle middle + button differently
                if (route.name === 'add') {
                  return (
                    <TouchableOpacity
                      key={route.key}
                      onPress={onPress}
                      className="absolute -top-16 w-16 h-16 bg-[#34D399] rounded-full items-center justify-center shadow-md"
                    >
                      <Ionicons name="add" size={30} color="white" className='font-bold'/>
                    </TouchableOpacity>
                  );
                }

                let iconName;
                // Determine icon based on route name and focus state
                if (route.name === 'home') {
                  iconName = isFocused ? 'home' : 'home-outline';
                } else if (route.name === 'shop') {
                  iconName = isFocused ? 'bag' : 'bag-outline';
                } else if (route.name === 'messages') {
                  iconName = isFocused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
                } else if (route.name === 'profile') {
                  iconName = isFocused ? 'person' : 'person-outline';
                }

                return (
                  <TouchableOpacity key={route.key} onPress={onPress} className="flex-1 items-center">
                    <Ionicons
                      name={iconName}
                      size={24}
                      color={isFocused ? '#34D399' : '#6b7280'}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="shop" />
      <Tabs.Screen name="add" />
      <Tabs.Screen name="messages" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}