import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import client from '../../api/client'
import { useIsFocused } from '@react-navigation/native';


const Follow = ({ navigation, route }) => {
  const [users, setUsers] = useState([]);
  const isFocused = useIsFocused();
  const { mode, id } = route.params;

  useEffect(() => {
    getUsers();
  }, [isFocused])

  const getUsers = async () => {
    try {
      const result = await client.get(`/users/${id}`);
      if (mode == "followers") {
        setUsers(result.data.followers);
      } else {
        setUsers(result.data.following);
      }
    } catch (err) {
      return alert(err);
    }
  }

  const Item = ({ item }) => (

    <TouchableHighlight onPress={() =>
      navigation.navigate('Profile', { id: item.id })
    }>

      <View style={{
        flexDirection: 'row',
        borderColor: '#454545',
        borderBottomWidth: 0.3,
        marginTop: 15,
        marginBottom: 7,

      }}>

        <Text style={styles.title}>{item.username} </Text>

        {mode == "following" && (

          <View style={{
            flexDirection: "row",
          }}>

            {!id && <TouchableOpacity onPress={async () => {
              await client.post(`/users/unfollow/${item.id}`);
              getUsers();
            }}
              style={styles.button}>
              <Text style={{ color: "#D1D1D1" }}>unfollow</Text>
            </TouchableOpacity>}
          </View>)}

      </View>
    </TouchableHighlight >
  );


  return (
    <SafeAreaView style={styles.container}>

      <TouchableOpacity onPress={() =>
        navigation.navigate('Profile', { id: id })
      } style={styles.profileButton}>
        <Text style={{ color: "#D1D1D1" }}>Back</Text>
      </TouchableOpacity>

      <Text style={{
        marginTop: 10,
        fontSize: 25,
        color: '#D1D1D1',
        alignSelf: 'center',
        marginBottom: 20,
      }}>{mode}</Text>

      <View
        style={{
          borderBottomColor: '#A9A9A9',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />

      {users && (
        <FlatList style={{ marginTop: 0 }}
          data={users}
          renderItem={({ item }) => (
            <Item item={item} />
          )}
          keyExtractor={(item) => item.id}
        />
      )}

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 21,
    backgroundColor: '#181818',

  },
  title: {
    padding: 15,
    paddingVertical: 10,
    color: '#20232a',
    fontSize: 17,
    color: '#D1D1D1',
    flex: 1,
    alignSelf: 'center',

  },
  button: {
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#181818",
    width: 120,
    borderWidth: 1,
    borderColor: "#505050",
    borderRadius: 30,
    padding: 5

  },
  profileButton: {
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

  },

});

export default Follow