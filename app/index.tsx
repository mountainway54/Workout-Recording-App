import React, { useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DatePickerButton from "../components/DatePickerButton";

import { styles } from "../components/WorkoutCard";
import workoutData from "./constants/workoutData.json";

// ===== Google Apps Script 設定 =====
// 將此 URL 替換為你部署的 Google Apps Script Web App URL
const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxCtwipfqjVLKdo5eIHS6b3xL-VOUhuBUoGrG4q-jKmEp5xM6FAPJhjy_w7hocxluVg/exec";

export default function Index() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState("選擇訓練日");
  const [sets, setSets] = useState(
    [...Array(5)].map(() => ({ weight: "", reps: "" })),
  );
  const [isSaving, setIsSaving] = useState(false); // 新增: 儲存狀態

  const days = Object.keys(workoutData);

  // 日期格式化輔助
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  /**
   * 改進: 使用 Google Apps Script 儲存資料
   */
  const handleSave = async () => {
    // 驗證
    if (selectedDay === "選擇訓練日") {
      Alert.alert("提醒", "請先選擇訓練日");
      return;
    }

    // 檢查是否有輸入任何資料
    const hasData = sets.some(
      (set) => set.weight.trim() !== "" || set.reps.trim() !== "",
    );

    if (!hasData) {
      Alert.alert("提醒", "請至少輸入一項訓練資料");
      return;
    }

    setIsSaving(true);

    try {
      // 準備要發送的資料
      const workoutPayload = {
        date: formatDate(selectedDate),
        day: selectedDay,
        exercises: workoutData[selectedDay as keyof typeof workoutData],
        sets: sets.map((set) => ({
          weight: set.weight || "0",
          reps: set.reps || "0",
        })),
      };

      // 發送到 Google Apps Script
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workoutPayload),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert("成功", "訓練記錄已儲存到 Google Sheets！");
        // 清空表單
        setSets([...Array(5)].map(() => ({ weight: "", reps: "" })));
        setSelectedDay("選擇訓練日");
      } else {
        Alert.alert("錯誤", result.message || "儲存失敗");
      }
    } catch (error) {
      console.error("儲存錯誤:", error);
      Alert.alert(
        "錯誤",
        `無法連線到伺服器: ${error instanceof Error ? error.message : "未知錯誤"}`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  // 選擇訓練日的 ActionSheet
  const showDayPicker = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [...days, "取消"],
        cancelButtonIndex: days.length,
        userInterfaceStyle: "dark",
      },
      (buttonIndex) => {
        if (buttonIndex !== days.length) {
          const selectedDayName = days[buttonIndex];
          handleDaySelect(selectedDayName);
        }
      },
    );
  };

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    const count = workoutData[day as keyof typeof workoutData].length;
    // 新選擇訓練日時，重置表單
    setSets([...Array(count)].map(() => ({ weight: "", reps: "" })));
  };

  // 更新特定項目的數據
  const updateSet = (
    index: number,
    field: "weight" | "reps",
    value: string,
  ) => {
    // 驗證: 只允許數字和一個小數點
    if (field === "weight") {
      if (!/^\d*\.?\d*$/.test(value)) return;
    } else if (field === "reps") {
      if (!/^\d*$/.test(value)) return;
    }

    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setSets(newSets);
  };

  return (
    <ScrollView style={styles.container}>
      {/* 日期選擇器 */}
      <DatePickerButton
        date={selectedDate}
        onChange={(date) => setSelectedDate(date)}
      />

      <Text style={styles.label}>訓練日</Text>
      <TouchableOpacity onPress={showDayPicker} style={styles.daySelector}>
        <Text style={{ color: "#fff" }}>{selectedDay}</Text>
      </TouchableOpacity>

      {selectedDay !== "選擇訓練日" && (
        <View style={styles.matrixContainer}>
          {/* 表頭 */}
          <View style={styles.row}>
            <Text style={[styles.cell, styles.header, { flex: 2 }]}>項目</Text>
            <Text style={[styles.cell, styles.header]}>重量</Text>
            <Text style={[styles.cell, styles.header]}>次數</Text>
            <Text style={[styles.cell, styles.header]}>訓練量</Text>
          </View>

          {/* 訓練項目表格 */}
          {workoutData[selectedDay as keyof typeof workoutData].map(
            (exerciseName, idx) => {
              const w = parseFloat(sets[idx].weight) || 0;
              const r = parseInt(sets[idx].reps, 10) || 0;
              const volume = w * r;

              return (
                <View key={idx} style={styles.row}>
                  <Text style={[styles.cell, styles.exerciseText]}>
                    {exerciseName}
                  </Text>

                  <TextInput
                    style={[styles.cell, styles.inputCell]}
                    placeholder="kg"
                    keyboardType="decimal-pad"
                    value={sets[idx].weight}
                    onChangeText={(val) => updateSet(idx, "weight", val)}
                    editable={!isSaving}
                  />

                  <TextInput
                    style={[styles.cell, styles.inputCell]}
                    placeholder="次"
                    keyboardType="number-pad"
                    value={sets[idx].reps}
                    onChangeText={(val) => updateSet(idx, "reps", val)}
                    editable={!isSaving}
                  />

                  <Text style={[styles.cell, styles.volumeText]}>
                    {volume.toFixed(1)}
                  </Text>
                </View>
              );
            },
          )}
        </View>
      )}

      {/* 儲存按鈕 */}
      <TouchableOpacity
        onPress={handleSave}
        style={[styles.saveButton, isSaving && { opacity: 0.6 }]}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "500" }}>儲存訓練</Text>
        )}
      </TouchableOpacity>

      {/* 連線狀態提示 */}
      <Text style={styles.infoText}>
        {GOOGLE_APPS_SCRIPT_URL?.includes("/exec")
          ? "✓ 已連線到 Google Sheets"
          : "⚠️  Google Apps Script URL 格式不正確"}
      </Text>
    </ScrollView>
  );
}

// 執行伺服器
//  npx expo start
