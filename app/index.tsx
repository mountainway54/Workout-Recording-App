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
const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwqFFZoa9eahTH-8QADn2AZkXtRwTIOWltwej1QrLjO0nb8wmZ8BZj4b3dDjqShOZVA/exec";

// ===== 每個訓練項目的狀態 =====
interface ExerciseEntry {
  weight: string; // 當前輸入的重量
  reps: string; // 當前輸入的次數
  totalVolume: number; // 累積訓練量
  totalReps: number; // 累積次數（用於儲存平均重量）
  sets: { weight: number; reps: number }[]; // 已記錄的每組資料
}

const makeEmptyEntry = (): ExerciseEntry => ({
  weight: "",
  reps: "",
  totalVolume: 0,
  totalReps: 0,
  sets: [],
});

export default function Index() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState("選擇訓練日");
  const [entries, setEntries] = useState<ExerciseEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const days = Object.keys(workoutData);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  // ===== 選擇訓練日 =====
  const showDayPicker = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [...days, "取消"],
        cancelButtonIndex: days.length,
        userInterfaceStyle: "dark",
      },
      (buttonIndex) => {
        if (buttonIndex !== days.length) {
          handleDaySelect(days[buttonIndex]);
        }
      },
    );
  };

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    const count = workoutData[day as keyof typeof workoutData].length;
    setEntries([...Array(count)].map(makeEmptyEntry));
  };

  // ===== 更新輸入欄位 =====
  const updateField = (
    index: number,
    field: "weight" | "reps",
    value: string,
  ) => {
    if (field === "weight" && !/^\d*\.?\d*$/.test(value)) return;
    if (field === "reps" && !/^\d*$/.test(value)) return;

    setEntries((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // ===== 按「計算」：累加本組，清空輸入 =====
  const handleAddSet = (index: number) => {
    const entry = entries[index];
    const w = parseFloat(entry.weight);
    const r = parseInt(entry.reps, 10);

    if (!w || !r) {
      Alert.alert("提醒", "請輸入重量和次數");
      return;
    }

    const setVolume = w * r;

    setEntries((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        weight: "",
        reps: "",
        totalVolume: next[index].totalVolume + setVolume,
        totalReps: next[index].totalReps + r,
        sets: [...next[index].sets, { weight: w, reps: r }],
      };
      return next;
    });
  };

  // ===== 重置單個項目 =====
  const handleResetEntry = (index: number) => {
    setEntries((prev) => {
      const next = [...prev];
      next[index] = makeEmptyEntry();
      return next;
    });
  };

  // ===== 儲存到 Google Sheets =====
  const handleSave = async () => {
    if (selectedDay === "選擇訓練日") {
      Alert.alert("提醒", "請先選擇訓練日");
      return;
    }

    const hasData = entries.some(
      (e) => e.sets.length > 0 || e.weight || e.reps,
    );
    if (!hasData) {
      Alert.alert("提醒", "請至少輸入一項訓練資料");
      return;
    }

    setIsSaving(true);

    try {
      const exercises = workoutData[selectedDay as keyof typeof workoutData];

      // 計算每個項目的 volume，過濾掉 volume === 0 的項目
      const filtered = exercises.reduce<{ name: string; volume: number }[]>(
        (acc, name, idx) => {
          const entry = entries[idx];
          let volume = 0;
          if (entry.sets.length > 0) {
            volume = entry.totalVolume;
          } else {
            const w = parseFloat(entry.weight) || 0;
            const r = parseInt(entry.reps, 10) || 0;
            volume = w * r;
          }
          if (volume > 0) acc.push({ name, volume });
          return acc;
        },
        [],
      );

      const workoutPayload = {
        date: formatDate(selectedDate),
        day: selectedDay,
        exercises: filtered.map((f) => f.name),
        sets: filtered.map((f) => ({ volume: String(f.volume) })),
      };

      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workoutPayload),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert("成功", "訓練記錄已儲存到 Google Sheets！");
        setEntries([...Array(entries.length)].map(makeEmptyEntry));
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
            <Text style={[styles.cell, styles.header]}></Text>
            <Text style={[styles.cell, styles.header]}>累積量</Text>
          </View>

          {/* 訓練項目 */}
          {workoutData[selectedDay as keyof typeof workoutData].map(
            (exerciseName, idx) => {
              const entry = entries[idx];
              if (!entry) return null;

              const previewVolume =
                (parseFloat(entry.weight) || 0) *
                (parseInt(entry.reps, 10) || 0);

              return (
                <View key={idx}>
                  {/* 主輸入列 */}
                  <View style={styles.row}>
                    {/* 項目名稱 */}
                    <Text style={[styles.cell, styles.exerciseText]}>
                      {exerciseName}
                    </Text>

                    {/* 重量輸入 */}
                    <TextInput
                      style={[styles.cell, styles.inputCell]}
                      placeholder="kg"
                      keyboardType="decimal-pad"
                      value={entry.weight}
                      onChangeText={(val) => updateField(idx, "weight", val)}
                      editable={!isSaving}
                    />

                    {/* 次數輸入 */}
                    <TextInput
                      style={[styles.cell, styles.inputCell]}
                      placeholder="次"
                      keyboardType="number-pad"
                      value={entry.reps}
                      onChangeText={(val) => updateField(idx, "reps", val)}
                      editable={!isSaving}
                    />

                    {/* 計算按鈕 */}
                    <TouchableOpacity
                      style={styles.addSetButton}
                      onPress={() => handleAddSet(idx)}
                      disabled={isSaving}
                    >
                      <Text style={styles.addSetButtonText}>+</Text>
                    </TouchableOpacity>

                    {/* 累積訓練量 */}
                    <TouchableOpacity
                      style={[styles.cell, { alignItems: "center" }]}
                      onLongPress={() => handleResetEntry(idx)}
                    >
                      <Text style={styles.volumeText}>
                        {entry.totalVolume > 0
                          ? entry.totalVolume.toFixed(0)
                          : previewVolume > 0
                            ? previewVolume.toFixed(0)
                            : "-"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* 已累積的組數標籤 */}
                  {entry.sets.length > 0 && (
                    <View style={styles.setsTagRow}>
                      {entry.sets.map((s, si) => (
                        <View key={si} style={styles.setTag}>
                          <Text style={styles.setTagText}>
                            {s.weight}×{s.reps}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
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

      {/* 連線狀態 */}
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
