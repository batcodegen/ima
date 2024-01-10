import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import React, {
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
} from 'react';
import {BackHandler} from 'react-native';
const BottomSheetComponent = forwardRef((props, ref) => {
  const bottomSheetRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const snapPoints = useMemo(() => ['95%'], []);

  useImperativeHandle(ref, () => ({
    focus: () => {
      bottomSheetRef.current.snapToIndex(0);
    },
    close: () => {
      bottomSheetRef.current.close();
    },
  }));

  const onBackPress = () => {
    if (ref !== null) {
      ref.current?.close();
      return true;
    }
  };

  useEffect(() => {
    if (currentIndex !== -1) {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }
  }, [currentIndex]);

  const handleSheetChanges = useCallback(index => {
    setCurrentIndex(index);
  }, []);

  const renderBackdrop = useCallback(
    backDropProps => (
      <BottomSheetBackdrop
        {...backDropProps}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        enableTouchThrough={false}
      />
    ),
    [],
  );
  return (
    <BottomSheet
      enablePanDownToClose
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}>
      {props.children}
    </BottomSheet>
  );
});

export default BottomSheetComponent;
