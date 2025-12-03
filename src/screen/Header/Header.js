// Header.js
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Colors from '../../screen/color'; // Adjust the import path based on your project structure
import {useTheme} from '../../theme/ThemeContext';

const Header = ({title, navigation}) => {
  const {isDark, colors, toggleTheme} = useTheme();
  return (
    <View
      style={{
        ...styles.headerView,
        backgroundColor: colors.textinputBackgroundcolor,
        borderColor: colors.textinputbordercolor,
      }}>
      <TouchableOpacity
        // hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        onPress={() => navigation.goBack()}>
        <Icon
          name="left"
          size={25}
          color={colors.backIconColor}
          style={{paddingLeft: 10}}
        />
      </TouchableOpacity>
      <Text style={{...styles.title, color: colors.textColor}}>{title}</Text>
      <View style={{flex: 0.1}}></View>
    </View>
  );
};

const styles = {
  headerView: {
    // flex: 0.09,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 4,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
};

export default Header;
