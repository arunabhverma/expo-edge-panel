import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { edgeMenuItem, edgeRenderData } from "@/types";

const EdgeRender = ({ item: data }: { item: edgeRenderData }) => {
  const theme = useTheme();
  const renderMiddleItem = (val: edgeMenuItem) => {
    return (
      <View key={val.id} style={styles.renderContainer}>
        <View
          style={[
            styles.subRenderContainer,
            val.bg ? { backgroundColor: val.bg } : {},
          ]}
        >
          {val.icon && (
            <val.icon.component
              name={val.icon.name}
              size={28}
              color={val.icon.color || theme.colors.text}
            />
          )}
        </View>
        {val.title && (
          <Text style={[styles.textStyle, { color: theme.colors.text }]}>
            {val.title}
          </Text>
        )}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {data.middle && (
        <View style={styles.wrapper}>{data.middle.map(renderMiddleItem)}</View>
      )}
    </View>
  );
};

export default EdgeRender;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
  },
  renderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  subRenderContainer: {
    aspectRatio: 1,
    width: 56,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  textStyle: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },
});
