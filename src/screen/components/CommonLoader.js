import React, {useEffect, useRef} from 'react';
import {Animated, View, StyleSheet} from 'react-native';
import Colors from '../color';
import {useTheme} from '../../theme/ThemeContext';

const CommonLoader = ({size = 40, color = Colors.main_primary}) => {
  const {isDark, colors, toggleTheme} = useTheme();
  const scale1 = useRef(new Animated.Value(1)).current;
  const scale2 = useRef(new Animated.Value(1)).current;
  const scale3 = useRef(new Animated.Value(1)).current;

  const animate = (animatedValue, delay) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0.3,
          duration: 300,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  useEffect(() => {
    animate(scale1, 0);
    animate(scale2, 100);
    animate(scale3, 200);
  }, []);

  return (
    <View style={{...styles.container, backgroundColor: colors.background}}>
      {[scale1, scale2, scale3].map((scale, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              transform: [{scaleY: scale}],
              backgroundColor: colors.AppmainColor,
              width: size / 6,
              height: size,
              marginHorizontal: size / 12,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    borderRadius: 4,
  },
});

export default CommonLoader;
