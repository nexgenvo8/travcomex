import React from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "../Icons/Icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import globalStyles from "../GlobalCSS";// Import global styles
import Colors from "../color"; // Import Colors file if used

const InternshipHeader = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Get the current route

  // Function to check if the screen is active
  const isActive = (screenName) => route.name === screenName;

  return (
    <View style={globalStyles.HeadeViewIcon}>
      {/* Home Icon */}
      <View style={globalStyles.HeadeViewIcon2}>
        <TouchableOpacity
          style={[
            globalStyles.HeadeViewTouch,
            { backgroundColor: isActive("IntershipProject") ? Colors.secondGreen : "#bdbdbd" },
          ]}
          onPress={() => navigation.navigate("IntershipProject")}
        >
          <Icon name="home" size={18} color="white" type="FontAwesome" />
        </TouchableOpacity>
      </View>

      {/* Add Internship Icon */}
      <View style={globalStyles.HeadeViewIcon2}>
        <TouchableOpacity
          style={[
            globalStyles.HeadeViewTouch,
            { backgroundColor: isActive("AddIntership") ? Colors.secondGreen : "#bdbdbd" },
          ]}
          onPress={() => navigation.navigate("AddIntership")}
        >
          <Icon name="plus" size={18} color="white" type="FontAwesome" />
        </TouchableOpacity>
      </View>

      {/* Search Icon */}
      <View style={globalStyles.HeadeViewIcon2}>
        <TouchableOpacity
          style={[
            globalStyles.HeadeViewTouch,
            { backgroundColor: isActive("SearchScreen") ? Colors.secondGreen : "#bdbdbd" },
          ]}
          onPress={() => navigation.navigate("SearchScreen")}
        >
          <Icon name="search" size={18} color="white" type="FontAwesome" />
        </TouchableOpacity>
      </View>

      {/* Database Icon */}
      <View style={globalStyles.HeadeViewIcon2}>
        <TouchableOpacity
          style={[
            globalStyles.HeadeViewTouch,
            { backgroundColor: isActive("DatabaseScreen") ? Colors.secondGreen : "#bdbdbd" },
          ]}
          onPress={() => navigation.navigate("DatabaseScreen")}
        >
          <Icon name="database" size={18} color="white" type="AntDesign" />
        </TouchableOpacity>
      </View>

      {/* Profile Icon */}
      <View style={{ ...globalStyles.HeadeViewIcon2, borderRightWidth: 0 }}>
        <TouchableOpacity
          style={[
            globalStyles.HeadeViewTouch,
            { backgroundColor: isActive("ProfileScreen") ? Colors.secondGreen : "#bdbdbd" },
          ]}
          onPress={() => navigation.navigate("ProfileScreen")}
        >
          <Icon name="person" size={18} color="white" type="Ionicons" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InternshipHeader;

