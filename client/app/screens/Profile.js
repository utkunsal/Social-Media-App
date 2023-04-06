import { View, Text, StyleSheet, Image, SafeAreaView, FlatList, TouchableOpacity, Alert, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import client from '../../api/client'
import { useIsFocused } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const Profile = ({ navigation, route }) => {

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [isFollowing, setIsFollowing] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();
  const { onLogout } = useAuth();
  let { id } = route.params;


  useEffect(() => {
    getUser();
    getPosts();
    getFollowStatus();
    setRefresh(false)
  }, [isFocused, refresh])


  const getPosts = async () => {
    try {
      const result = await client.get(`/posts/user/${id}`);
      result.data.reverse();
      setPosts(result.data);
    } catch (err) {
      return alert(err);
    }
  }


  const getUser = async () => {
    try {
      const result = await client.get(`/users/${id}`);
      setUser(result.data);
    } catch (err) {
      return alert(err);
    }
  }


  const getFollowStatus = async () => {
    try {
      const result = await client.get(`/users/${id}/isFollowing`);
      if (result.data == -1) {
        id = 0; // the profile is current user's profile
      }
      setIsFollowing(result.data);
    } catch (err) {
      return alert(err);
    }
  }


  const deleteAccount = () =>
    Alert.alert('Are you sure you want to delete your account?',
      'Your account and all posts will be deleted', [
      {
        text: 'Continue',
        onPress: async () => {
          onLogout();
          await client.delete("/users");
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);


  const Item = ({ item }) => (
    <View style={{ flex: 1, marginTop: 5, marginBottom: 10 }}>
      <View style={{ borderRadius: 0, backgroundColor: '#232323' }}>

        {item.image && (
          <Image
            source={{ uri: `${client.defaults.baseURL}/images/${item.image}` }}
            style={{ width: 500, height: 500, alignSelf: 'center' }}
          />
        )}

        <Text style={styles.title}>{item.title} </Text>
        {item.body && <Text style={styles.body}>{item.body} </Text>}

      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={styles.info}>Posted on {item.createdAt.substring(0, 10)} at {item.createdAt.substring(11, 16)} </Text>

        {!id && <TouchableOpacity onPress={() => {
          Alert.alert('Are you sure you want to delete this post?', '',
            [{
              text: 'Continue',
              onPress: async () => {
                await client.delete(`/posts/${item._id}`);
                setPosts(posts.filter(post => post._id !== item._id));
                getUser();
              },
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },])
        }
        } style={styles.button}>
          <Text style={{ color: "#AD4D4D" }}>Delete</Text>
        </TouchableOpacity>}

      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.containerProfile}>

        {!id ?
          <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
            <TouchableOpacity onPress={deleteAccount} style={styles.profileButton}>
              <Text style={{ color: '#AD4D4D' }}>Delete Account</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onLogout} style={styles.profileButton}>
              <Text style={{ color: "#D1D1D1" }}>Log Out</Text>
            </TouchableOpacity>
          </View>
          :
          <TouchableOpacity onPress={() => {
            navigation.navigate('Profile', { id: 0 })
            setRefresh(true)
          }} style={{
            alignItems: "center",
            backgroundColor: "#181818",
            padding: 6,
            marginHorizontal: 35,
            marginBottom: 10,
            marginTop: 10,
            width: 150,
            borderWidth: 1,
            borderColor: "#505050",
            borderRadius: 30
          }}>
            <Text style={{ color: "#D1D1D1" }}>Back</Text>
          </TouchableOpacity>}

        <Text style={{
          marginTop: 5,
          fontSize: 25,
          color: '#D1D1D1',
          fontWeight: 'bold',
          alignSelf: 'center',
          marginBottom: 7,
        }}>{user.username}</Text>

        <Text style={{
          fontSize: 18,
          color: '#A9A9A9',
          alignSelf: 'center',
          marginBottom: -10,
        }}>{user.postCount} {user.postCount == 1 ? "post" : "posts"}</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
          <TouchableOpacity onPress={() =>
            navigation.navigate('Follow', { mode: 'following', id: id })
          } style={styles.profileButton}>
            <Text style={{ color: '#D1D1D1' }}>Following</Text>
            <Text style={{ color: "#D1D1D1" }}>{user.following ? user.following.length : 0}</Text>

          </TouchableOpacity>

          <TouchableOpacity onPress={() =>
            navigation.navigate('Follow', { mode: 'followers', id: id })
          } style={styles.profileButton}>
            <Text style={{ color: "#D1D1D1" }}>Followers</Text>
            <Text style={{ color: "#D1D1D1" }}>{user.followers ? user.followers.length : 0}</Text>
          </TouchableOpacity>

          {isFollowing != -1 &&
            <TouchableOpacity onPress={async () => {
              if (isFollowing) { await client.post(`/users/unfollow/${id}`); }
              else { await client.post(`/users/follow/${id}`); }
              setIsFollowing(!isFollowing);
              setRefresh(true);
            }} style={styles.profileButton}>
              <Text style={{ color: isFollowing == 1 ? "#3C9614" : "#D1D1D1" }}>{isFollowing == 1 ? "Following" : "Follow"}</Text>

            </TouchableOpacity>}
        </View>
        <View
          style={{
            borderBottomColor: '#A9A9A9',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />

      </View>

      {posts && (
        <FlatList style={{ marginTop: 0 }}
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
    marginBottom: 85,
  },
  containerProfile: {
    backgroundColor: '#181818',
    justifyContent: 'center',
  },
  button: {
    alignItems: "center",
    padding: 3,
    width: 80,
    backgroundColor: '#292929'

  },
  profileButton: {
    alignItems: "center",
    backgroundColor: "#181818",
    padding: 6,
    marginHorizontal: 5,
    marginBottom: 10,
    marginTop: 25,
    width: 120,
    borderWidth: 1,
    borderColor: "#505050",
    borderRadius: 30

  },
  title: {
    padding: 20,
    paddingVertical: 4,
    backgroundColor: '#232323',
    fontSize: 15,
    color: '#B7B7B7',
    marginTop: 4,

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
    fontSize: 13,
    color: '#979797',
    flex: 1
  },
});

export default Profile;