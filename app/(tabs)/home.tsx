import { View, Text, Image, FlatList } from 'react-native';
import posts from '../../assets/posts.json';
import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';

const imageMap: Record<string, any> = {
  'profile1.jpg': require('../../assets/images/profile1.jpg'),
  'profile2.jpg': require('../../assets/images/profile2.jpg'),
  'profile3.jpeg': require('../../assets/images/profile3.jpeg'),
  'profile4.jpeg': require('../../assets/images/profile4.jpeg'),
  'kitchen1.jpg': require('../../assets/images/kitchen1.jpg'),
  'kitchen2.jpg': require('../../assets/images/kitchen2.jpeg'),
  'kitchen3.jpg': require('../../assets/images/kitchen3.jpg'),
  'kitchen4.jpg': require('../../assets/images/kitchen4.jpg'),
};

const getImage = (filename: string) =>
  imageMap[filename] ?? require('../../assets/images/placeholder.png');

const storyData = [
  { id: 'add', type: 'add', name: 'Add Story' },
  { id: '1', image: require('../../assets/images/profile1.jpg'), name: 'Cheneh Paul' },
  { id: '2', image: require('../../assets/images/profile2.jpg'), name: 'Anna Asol' },
  { id: '3', image: require('../../assets/images/profile3.jpeg'), name: 'Branly B' },
  { id: '4', image: require('../../assets/images/profile4.jpeg'), name: 'Anne G' },
  { id: '5', image: require('../../assets/images/profile4.jpeg'), name: 'Anne G' },
  { id: '6', image: require('../../assets/images/profile4.jpeg'), name: 'Anne G' },
  { id: '7', image: require('../../assets/images/profile4.jpeg'), name: 'Anne G' },
];

const Home = () => {
  const renderPost = ({ item }: any) => (
    <View className="rounded-xl p-4 mb-1">
      {/* Header */}
      <View className="flex-row items-center mb-1">
        <Image
          source={getImage(item.profile)}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View>
          <Text className="font-bold">{item.name}</Text>
          <Text className="text-gray-500 text-xs">{item.time}</Text>
        </View>
      </View>

      {/* Post text */}
      <Text className="mb-3">{item.text}</Text>

      {/* Image Grid */}
      <View className="flex-row flex-wrap justify-between gap-2">
        {item.images.map((img: string, index: number) => (
          <Image
            key={index}
            source={getImage(img)}
            className="w-[48%] h-32 rounded-lg"
            resizeMode="cover"
          />
        ))}
      </View>

      {/* Footer (Likes/Comments) */}
      <View className="flex-row justify-between mt-3 px-1">
        <Text className="text-[#34D399]">💚 {(item.likes / 1000).toFixed(1)}K</Text>
        <Text className="text-gray-600">💬 {item.comments}</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 ">
      {/* Header */}
      <View className="flex-row justify-between items-center px-3 py-6 mb-3 mt-2">
        <Image
          source={require('../../assets/images/icon.png')}
          className="w-28 h-28 rounded-md"
          resizeMode="cover"
        />
        <View className="flex-row items-center gap-4 px-3">
          <Ionicons name="chatbox" size={26} color="#34D399"  />
          <Ionicons name="notifications" size={26} color="#34D399" />
        </View>
      </View>

      {/* Stories (FlatList) */}
      <View className="mb-3 px-3">
        <FlatList
          data={storyData}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4 }}
          renderItem={({ item }) => {
            if (item.type === 'add') {
              return (
                <View className="items-center mr-4">
                  <View className=" border-2 border-[#34D399] h-20 w-20 rounded-full items-center justify-center">
                    <Feather name="plus" size={28} color="#22c55e" />
                  </View>
                  <Text className="text-xs mt-1 text-gray-600 w-20 text-center" numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
              );
            }

            return (
              <View className="items-center mr-4">
                <View className="border-2 border-[#34D399] h-20 w-20 rounded-full  overflow-hidden">
                  <Image
                    source={item.image}
                    className="h-full w-full rounded-full"
                    resizeMode="cover"
                  />
                </View>
                <Text className="text-xs mt-1 text-gray-800 w-20 text-center" numberOfLines={1}>
                  {item.name}
                </Text>
              </View>
            );
          }}
        />
      </View>

      {/* Post Feed */}
      <View className="flex-[4] px-3 py-2">
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default Home;
