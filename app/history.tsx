import { Link } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react"; // 引入狀態管理工具
import { Text, TouchableOpacity, View } from "react-native"; // 引入 UI 元件

import { button } from "../components/MyButton"; // 引入零件
import { styles } from "../components/WorkoutCard"; // 引入零件

export default function HistoryScreen() {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>歷史訓練紀錄</Text>
        <Link href="/" asChild>
          <TouchableOpacity style={button.linkButton}>
            <SymbolView name="arrow.uturn.backward" size={100} />
            <Text style={button.linkButtonText}>返回</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}
