import React from 'react';
import {BottomTabBar} from '@react-navigation/bottom-tabs';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {StyleSheet} from 'react-native';

const AnimatedTabBar = ({tabBarVisible, ...rest}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(tabBarVisible.value ? 0 : 100, {
          duration: 200,
        }),
      },
    ],
    opacity: withTiming(tabBarVisible.value ? 1 : 0, {duration: 200}),
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <BottomTabBar {...rest} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 10,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
});

export default AnimatedTabBar;
