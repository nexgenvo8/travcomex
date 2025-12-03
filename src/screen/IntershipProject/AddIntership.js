import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import globalStyles from '../GlobalCSS';
import Header from '../Header/Header';
import InternshipHeader from '../Header/InternshipHeader';

const AddIntership = ({navigation}) => {
  const [number, onChangeNumber] = useState('');
  return (
    <SafeAreaView style={globalStyles.SafeAreaView}>
      <InternshipHeader />
      <View style={{flex: 1, paddingHorizontal: 12}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={globalStyles.ViewINter}>
            <Text style={globalStyles.headlineText}>POST A INTERNSHIPS</Text>
          </View>

          <View style={globalStyles.JobfiledSection}>
            <Text
              style={{
                ...styles.JobfiledSectionText,
                //   color: errorJob ? Colors.error : Colors.gray,
              }}>
              Industry category
            </Text>

            <TextInput
              style={{
                ...styles.textInput,
                //   borderColor: errorJob ? Colors.error : Colors.gray,
              }}
              onChangeText={value => {
                onChangeNumber(value);
                //   setErrorJov(value.trim().length === 0);
              }}
              value={number}
              placeholder="Write your Industry category"
              keyboardType="default"
              multiline
              placeholderTextColor="#aaa"
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    paddingRight: 10,
    color: '#888',
  },

  JobfiledSectionText: {fontSize: 13, paddingBottom: 10},
  textInput: {
    paddingTop: 12,
    paddingHorizontal: 10,
    fontSize: 14,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 5,
    height: 40,
  },
});

export default AddIntership;
