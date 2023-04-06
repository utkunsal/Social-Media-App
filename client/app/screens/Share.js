import { View, Text, StyleSheet, Alert, TouchableOpacity, TextInput, Image, Platform, SafeAreaView, StatusBar } from 'react-native'
import React, { useState } from 'react'
import InputScrollView from 'react-native-input-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import client from '../../api/client'


const Share = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null)


  const share = async () => {
    try {
      const result = await client.post("/posts", {
        body,
        title,
      });

      if (result.data.postId) {

        if (image) {
          const data = new FormData();
          let fileName = image.uri.split('/').pop();
          data.append('image', {
            name: fileName,
            type: image.type,
            uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
          });
          const result0 = await client.post(`posts/${result.data.postId}/image`, data);
        }
      }

      setBody("");
      setTitle("");
      setImage(null);
      this.titleInput.clear();
      this.bodyInput.clear();

      if (result) {
        Alert.alert(result.data.message, '')
      }
    } catch (err) {
      return alert(err);
    }
  }


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    setImage(result.assets[0])
  };


  return (
    <SafeAreaView style={styles.container}>

      <TouchableOpacity onPress={share} style={styles.button}>
        <Text style={{ color: "#D1D1D1" }}>Share</Text>
      </TouchableOpacity>

      <InputScrollView contentContainerStyle={{ flexGrow: 1 }}>

        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {image && (
            <Image
              source={{ uri: image.uri }}
              style={{ width: 500, height: 500 }}
            />
          )}
          <TouchableOpacity onPress={pickImage} style={styles.button}>
            <Text style={{ color: "#D1D1D1" }}>Choose Image</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          autoCorrect={false}
          ref={input => { this.titleInput = input }}
          style={styles.title}
          placeholder='Title'
          onChangeText={text => setTitle(text)}
          placeholderTextColor="#757575"
          autoCapitalize='none'
          maxLength={50}
        />
        <TextInput
          multiline={true}
          autoCorrect={false}
          placeholder='Body text'
          ref={input => { this.bodyInput = input }}
          style={styles.body}
          onChangeText={text => setBody(text)}
          placeholderTextColor="#757575"
          autoCapitalize='none'
          maxLength={1500}
        />

      </InputScrollView>
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
    backgroundColor: '#181818',
  },
  title: {
    padding: 15,
    marginTop: 7,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#20232a',
    borderRadius: 1,
    backgroundColor: '#292929',
    color: '#20232a',
    fontSize: 20,
    color: '#D1D1D1',
  },
  body: {
    padding: 10,
    marginTop: 5,
    paddingVertical: 80,
    borderWidth: 1,
    borderColor: '#20232a',
    borderRadius: 1,
    backgroundColor: '#292929',
    color: '#20232a',
    fontSize: 15,
    textAlignVertical: 'top',
    color: '#D1D1D1',
  },
  button: {
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#181818",
    padding: 6,
    marginTop: 10,
    marginBottom: 10,
    width: 170,
    borderWidth: 1,
    borderColor: "#505050",
    borderRadius: 30
  },
});

export default Share