import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  forwardRef,
} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useTheme} from '../../theme/ThemeContext';

const CommonBottomSheet = forwardRef(({onChange, children}, ref) => {
  const bottomSheetRef = useRef(null);
  const {isDark, colors, toggleTheme} = useTheme();
  const styles = createStyles(colors);
  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.snapToIndex(0),
    close: () => bottomSheetRef.current?.close(),
  }));
  const handleSheetChanges = useCallback(
    index => {
      console.log('Sheet changed to:', index);
      if (onChange) onChange(index);
    },
    [onChange],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      snapPoints={['50%', '100%']}
      index={-1}
      enablePanDownToClose
      backgroundStyle={{backgroundColor: colors.modelBackground}}>
      {/* <BottomSheetView
        style={{flex: 1, backgroundColor: colors.modelBackground}}>
        {children || <Text>Default Content</Text>}
      </BottomSheetView> */}
      <BottomSheetScrollView style={{backgroundColor: colors.modelBackground}}>
        {children}
      </BottomSheetScrollView>
      {/* <View style={{flexGrow: 1, backgroundColor: colors.modelBackground}}>
        {children}
      </View> */}
    </BottomSheet>
  );
});

const createStyles = colors => StyleSheet.create({});

export default CommonBottomSheet;
