import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';


axios.defaults.baseURL = process.env.EXPO_PUBLIC_SERVER_URL;

function Index() {

  //  useEffect(() => {
  //   console.log("log effect")
  //   console.log("Base server url is", process.env.EXPO_PUBLIC_SERVER_URL)
  // }, [])

  return (
    <Redirect href="/screens/LoginScreen" />
  );
}


export default Index;