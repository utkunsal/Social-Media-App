import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableHighlight } from 'react-native'
import { SearchBar } from 'react-native-elements';
import React, { useEffect, useState } from 'react'
import client from '../../api/client'


const SearchUser = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const result = await client.get(`/users`);
      setUsers(result.data);
      setFilteredUsers(result.data);
    } catch (err) {
      return alert(err);
    }
  }

  const searchFilter = (text) => {
    if (text) {
      setFilteredUsers(users.filter((user) => {
        const userData = user.username.toUpperCase();
        const textData = text.toUpperCase();
        return userData.indexOf(textData) > -1;
      }));
    } else {
      setFilteredUsers(users);
    }
    setSearch(text);
  };


  const Item = ({ item }) => (

    <TouchableHighlight onPress={() =>
      navigation.navigate('Profile', { id: item._id })
    }>
      <View style={{
        flexDirection: 'row',
        borderColor: '#454545',
        borderBottomWidth: 0.3,
        marginTop: 15,
        marginBottom: 7,
      }}>
        <Text style={styles.title}>{item.username} </Text>
      </View>
    </TouchableHighlight >
  );


  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        style={{
          fontSize: 15,
          backgroundColor: "#181818",
          borderRadius: 8
        }}
        containerStyle={{
          color: '#252525',
          fontSize: 15,
          backgroundColor: "#181818",
          borderColor: "#292929",
        }}
        inputStyle={{
          paddingHorizontal: 20,
          marginRight: 10,
        }}
        autoCapitalize='none'
        autoCorrect={false}
        round
        searchIcon={{ size: 18 }}
        onChangeText={(text) => searchFilter(text)}
        onClear={() => searchFilter('')}
        placeholder="Search users..."
        placeholderTextColor={'#909090'}
        value={search}
      />

      <View
        style={{
          borderBottomColor: '#A9A9A9',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />

      {users && (
        <FlatList style={{ marginTop: 0 }}
          data={filteredUsers}
          renderItem={({ item }) => (
            <Item item={item} />
          )}
          keyExtractor={(item) => item._id}
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
    paddingVertical: 8,
    fontSize: 17,
    color: '#D1D1D1',
    flex: 1,
    alignSelf: 'center',
    marginLeft: 40,
  },
});

export default SearchUser