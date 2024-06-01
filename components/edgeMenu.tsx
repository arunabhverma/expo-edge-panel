import { Dimensions, StyleSheet, View, useColorScheme } from "react-native";
import React, { useCallback } from "react";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EdgeRender from "./edgeRender";
import {
  PaginationRenderType,
  edgeMenuItemType,
  edgeMenuType,
  viewableItemsType,
} from "@/types";
import { useTheme } from "@react-navigation/native";

const HEIGHT = Dimensions.get("window").height;

const RenderItemContainer = ({
  item,
  index,
  translationX,
  itemWidth,
  gap,
  data,
}: edgeMenuItemType) => {
  const { top, bottom } = useSafeAreaInsets();
  const LIST_ITEM_HEIGHT = HEIGHT - 2 * top - 2 * bottom;
  const tint = useColorScheme();
  const ItemAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      translationX.value,
      [
        itemWidth * (index + 0),
        itemWidth * (index + 1),
        itemWidth * (index + 2),
      ],
      [itemWidth * 0, itemWidth * 1, itemWidth * 2],
      Extrapolation.CLAMP
    );

    return {
      opacity: interpolate(
        translateX,
        [0, itemWidth],
        [1, 0],
        Extrapolation.CLAMP
      ),
      marginRight:
        data.length === index + 1
          ? gap / 2
          : interpolate(
              translateX,
              [itemWidth, 0],
              [0, gap / 2],
              Extrapolation.CLAMP
            ),
      transform: [
        { translateX },
        {
          scale: interpolate(
            translateX,
            [0, 2 * itemWidth],
            [1, 0.8],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        styles.edgePanelContainer,
        {
          width: itemWidth,
          height: LIST_ITEM_HEIGHT,
        },
        ItemAnimatedStyle,
      ]}
    >
      <BlurView
        tint={
          tint === "light"
            ? "systemThinMaterialLight"
            : "systemThinMaterialDark"
        }
        intensity={80}
        style={StyleSheet.absoluteFillObject}
      />
      <EdgeRender item={item} />
    </Animated.View>
  );
};

const PaginationRender = ({ index, currentIndex }: PaginationRenderType) => {
  const animatedDot = useAnimatedStyle(() => {
    return {
      opacity: withTiming(currentIndex.value === index ? 1 : 0.6),
      transform: [{ scale: currentIndex.value === index ? 1.2 : 1 }],
    };
  });

  return <Animated.View key={index} style={[styles.dot, animatedDot]} />;
};

const EdgeMenu = ({ listWidth, itemWidth, gap, data }: edgeMenuType) => {
  const { top } = useSafeAreaInsets();
  const tint = useColorScheme();
  const translationX = useSharedValue<number>(0);
  const currentIndex = useSharedValue<number | null>(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    translationX.value = event.contentOffset.x;
  });

  const handleOnViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: viewableItemsType }) => {
      if (viewableItems?.[0]?.index === undefined) {
        return;
      }
      currentIndex.value = viewableItems?.[0]?.index;
    },
    [data]
  );

  return (
    <View
      style={{
        top: top,
        width: listWidth,
      }}
    >
      <Animated.FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate={0}
        renderToHardwareTextureAndroid
        snapToInterval={itemWidth}
        snapToAlignment="start"
        scrollEventThrottle={16}
        style={{
          width: listWidth,
        }}
        onViewableItemsChanged={handleOnViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 70,
        }}
        contentContainerStyle={{
          paddingHorizontal: gap / 2,
        }}
        onScroll={scrollHandler}
        data={data}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <RenderItemContainer
            item={item}
            index={index}
            translationX={translationX}
            itemWidth={itemWidth}
            gap={gap}
            data={data}
          />
        )}
      />
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: itemWidth / 1.8,
            borderRadius: 100,
            overflow: "hidden",
            marginTop: 20,
            flexDirection: "row",
            paddingVertical: 10,
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <BlurView
            tint={
              tint === "light"
                ? "systemUltraThinMaterialLight"
                : "systemUltraThinMaterialDark"
            }
            intensity={80}
            style={StyleSheet.absoluteFillObject}
          />
          {data.map((_, id) => (
            <PaginationRender
              key={id.toString()}
              index={id}
              currentIndex={currentIndex}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default EdgeMenu;

const styles = StyleSheet.create({
  edgePanelContainer: {
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  dot: {
    width: 5,
    aspectRatio: 1,
    backgroundColor: "white",
    borderRadius: 10,
  },
});
