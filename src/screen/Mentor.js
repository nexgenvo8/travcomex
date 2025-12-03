import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

const Mentor = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <Text style={{fontSize: 25, fontWeight: '500'}}>Comming Soon!</Text>
      </View>
    </SafeAreaView>
  );
};

export default Mentor;
