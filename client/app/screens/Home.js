import { View, Text, StyleSheet, ScrollView, Button, Image, SafeAreaView, FlatList, TouchableOpacity, StatusBar, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import client from '../../api/client'
import { useIsFocused } from '@react-navigation/native';



const Home = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const isFocused = useIsFocused();


  useEffect(() => {
    getPosts();
  }, [isFocused])

  const getPosts = async () => {
    try {
      const result = await client.get("/posts/following");
      result.data.reverse();
      setPosts(result.data);
    } catch (err) {
      return alert(err.response.data);
    }
  }


  const Item = ({ item }) => (

    <View style={{ flex: 1, marginTop: 15 }}>

      <View style={{ backgroundColor: '#232323' }}>

        {item.image && (
          <Image
            source={{ uri: `${client.defaults.baseURL}/images/${item.image}` }}
            style={{ width: 500, height: 500, alignSelf: 'center' }}
          />
        )}

        <Text style={styles.title}>{item.title} </Text>
        {item.body && <Text style={styles.body}>{item.body} </Text>}
        <TouchableHighlight onPress={() =>
          navigation.navigate('Profile', { id: item.user })
        }>
          <Text style={styles.info}>Posted by {item.username} on {item.createdAt.substring(0, 10)} at {item.createdAt.substring(11, 16)} </Text>
        </TouchableHighlight>
      </View>

    </View>
  );


  return (
    <SafeAreaView style={styles.container}>
      {posts && (
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <Item item={item} />
          )}
          keyExtractor={(item) => item._id}
        />
      )}
      <StatusBar
        barStyle={'light-content'}
      />

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 21,
    backgroundColor: '#151515',
    justifyContent: 'center',
    marginBottom: 90,
  },
  title: {
    padding: 20,
    paddingVertical: 4,
    backgroundColor: '#232323',
    fontSize: 15,
    color: '#B7B7B7',
    marginTop: 4

  },
  body: {
    padding: 20,
    paddingVertical: 5,
    backgroundColor: '#292929',
    fontSize: 15,
    color: '#D1D1D1',
  },
  info: {
    padding: 10,
    paddingVertical: 5,
    backgroundColor: '#292929',
    fontSize: 12,
    color: '#979797',
    flex: 1
  },

});

export default Home