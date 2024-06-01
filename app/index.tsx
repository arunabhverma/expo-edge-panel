import React from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  useColorScheme,
} from "react-native";
import EdgeMenu from "@/components/edgeMenu";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { DATA } from "@/mock/EdgeData";

const GAP = 30;
const WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = WIDTH * 0.25;
const LIST_ITEM_WIDTH = ITEM_WIDTH + GAP;

const Main = () => {
  const offset = useSharedValue(LIST_ITEM_WIDTH);
  const tint = useColorScheme();

  const pan = Gesture.Pan()
    .onBegin(() => {})
    .onChange((event) => {
      if (-event.translationX < LIST_ITEM_WIDTH / 4) {
        offset.value += event.changeX * 0.2;
        return false;
      }
      if (offset.value < -10) {
        return false;
      }
      offset.value += event.changeX;
    })
    .onFinalize(() => {
      if (offset.value < LIST_ITEM_WIDTH) {
        offset.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      right: -offset.value,
    };
  });

  const bgAnimatedStyle = useAnimatedStyle(() => {
    const left = interpolate(
      offset.value,
      [LIST_ITEM_WIDTH, 0],
      [WIDTH, 0],
      Extrapolation.CLAMP
    );

    return {
      left: left,
    };
  });

  const animatedHandleStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(offset.value === LIST_ITEM_WIDTH ? 1 : 0, {
        duration: 100,
      }),
    };
  });

  return (
    <ImageBackground
      source={{
        uri: "https://i.pinimg.com/originals/e2/39/df/e239dfdc523c0bef7d634420e88ad8ec.jpg",
      }}
      style={styles.container}
    >
      <Animated.View
        style={[styles.backgroundContainer, bgAnimatedStyle]}
        onTouchStart={() => (offset.value = withTiming(LIST_ITEM_WIDTH))}
      />
      <Animated.View style={[styles.gestureBackground, animatedStyle]}>
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.draggableHandle, animatedHandleStyle]}>
            <BlurView
              tint={
                tint === "light"
                  ? "systemThinMaterialLight"
                  : "systemThinMaterialDark"
              }
              intensity={80}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>
        </GestureDetector>
        <EdgeMenu
          data={DATA}
          listWidth={LIST_ITEM_WIDTH}
          itemWidth={ITEM_WIDTH}
          gap={GAP}
        />
      </Animated.View>
    </ImageBackground>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "purple",
    flexDirection: "row",
  },
  gestureBackground: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  draggableHandle: {
    width: 5,
    height: 150,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    overflow: "hidden",
  },
  backgroundContainer: {
    position: "absolute",
    right: 0,
    bottom: 0,
    top: 0,
  },
});
