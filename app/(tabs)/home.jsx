import { Text, View, FlatList, Image, RefreshControl, Alert } from 'react-native';
import React, {useEffect, useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from "../../constants";
import SearchInput from '../../components/SearchInput';
import Trending from '../../components/Trending';
import EmptyState from '../../components/EmptyState';
import VideoCard from '../../components/VideoCard';
import { getAllPost, getLatestPost } from '../../lib/appwrite';
import useAppwrite from "../../lib/useAppwrite";

const Home= () => {

  const { data: posts, refetch } = useAppwrite(getAllPost)
  const {data:Latestposts}=useAppwrite(getLatestPost)
  const [refreshing, setRefreshing] = useState(false)

  const onRefreh = async () => {
    setRefreshing(true);
    //re call videos-> if any new video appeared
    await refetch()
    setRefreshing(false);
  };
  console.log(posts)

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <VideoCard video={ item} />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">Welcome Back</Text>
                <Text className="text-2xl font-psemibold text-white">Khushi</Text>
              </View>
              <View className="mt-1.5">
                  <Image source={images.logoSmall} className="w-9 h-10" resizeMode='contain'/>
              </View>
            </View>
            <SearchInput />
            
            <View className="flex-1 w-full pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">Latest Videos</Text>
              <Trending posts={ Latestposts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle="Be the first one to upload video"
          />
        )}
        refreshControl={<RefreshControl refreshing={ refreshing} onRefresh={onRefreh} />}
      />
    </SafeAreaView>
  )
}

export default Home