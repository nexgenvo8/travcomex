import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';



const Icon = ({ name, size = 20, color = "#000", type = "Entypo" ,style}) => {
  const IconComponent = {
    Entypo,
    MaterialIcons,
    Octicons,
    MaterialCommunityIcons,
    AntDesign,
    FontAwesome,
    Ionicons
  }[type];

  return <IconComponent name={name} size={size} color={color} style={style}  />;
};

export default Icon;
