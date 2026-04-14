import React, { useState } from "react"; // 引入狀態管理工具
import {
  ActionSheetIOS,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"; // 引入 UI 元件
import DatePickerButton from "../components/DatePickerButton";

import { styles } from "../components/WorkoutCard"; // 引入零件
import workoutData from "./constants/workoutData.json"; // 匯入剛剛的 JSON
import { loadWorkout, saveWorkout } from "./utils/workoutStorage";

export default function Index() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 1. 項目狀態，預設為「請選擇項目」
  const [selectedDay, setSelectedDay] = useState("選擇訓練日");

  // 建立一個狀態來儲存 5 個項目的重量與次數
  // 結構：[{ weight: "", reps: "" }, { weight: "", reps: "" }, ...]
  // 這樣每一格才是獨立的物件
  const [sets, setSets] = useState(
    [...Array(5)].map(() => ({ weight: "", reps: "" })),
  );

  const days = Object.keys(workoutData);

  // 日期格式化輔助
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const handleSave = async () => {
    await saveWorkout({
      date: formatDate(selectedDate),
      day: selectedDay,
      exercises: workoutData[selectedDay as keyof typeof workoutData],
      sets,
    });
    alert("已儲存！");
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
        // if (buttonIndex !== days.length) {
        //   setSelectedDay(days[buttonIndex]);
        // }
        const selectedDayName = days[buttonIndex];
        handleDaySelect(selectedDayName);
        // 直接導向 handleDaySelect，
        // 這樣它會同時執行 setSelectedDay(day) 與 loadWorkout(...)
      },
    );
  };

  const handleDaySelect = async (day: string) => {
    setSelectedDay(day);
    const count = workoutData[day as keyof typeof workoutData].length;
    const existing = await loadWorkout(formatDate(selectedDate), day);
    if (existing) {
      setSets(existing.sets); // 有紀錄就還原
    } else {
      setSets([...Array(count)].map(() => ({ weight: "", reps: "" })));
    }
  };

  // 更新特定項目的數據
  const updateSet = (
    index: number,
    field: "weight" | "reps",
    value: string,
  ) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setSets(newSets);
  };

  return (
    <ScrollView style={styles.container}>
      {/* 日期選擇器放最上方 */}
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
            <Text style={[styles.cell, styles.header]}>總量</Text>
          </View>

          {/* 根據 JSON 渲染該日五個項目 */}
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
                    keyboardType="numeric"
                    value={sets[idx].weight}
                    onChangeText={(val) => updateSet(idx, "weight", val)}
                  />

                  <TextInput
                    style={[styles.cell, styles.inputCell]}
                    placeholder="次"
                    keyboardType="numeric"
                    value={sets[idx].reps}
                    onChangeText={(val) => updateSet(idx, "reps", val)}
                  />

                  <Text style={[styles.cell, styles.volumeText]}>{volume}</Text>
                </View>
              );
            },
          )}
        </View>
      )}
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={{ color: "#fff", fontWeight: "500" }}>儲存訓練</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// 執行伺服器
//  npx expo start
