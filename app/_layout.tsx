import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import BottomMenu from "../components/BottomMenu";

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#000" },
          animation: "fade", // 建議改成 fade，切換時底部選單才不會有奇怪的滑動感
        }}
      >
        <Stack.Screen name="index" options={{ title: "每日記錄" }} />
        <Stack.Screen name="history" options={{ title: "歷史紀錄" }} />
      </Stack>

      {/* 將底部選單固定在最外層 */}
      <BottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
