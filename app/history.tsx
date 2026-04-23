import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { historyStyles } from "../components/historyStyles";

// ===== Google Apps Script 設定 =====
const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwqFFZoa9eahTH-8QADn2AZkXtRwTIOWltwej1QrLjO0nb8wmZ8BZj4b3dDjqShOZVA/exec";

// ===== 訓練紀錄介面 =====
interface WorkoutRecord {
  date: string;
  day: string;
  exerciseName: string;
  weight: number;
  reps: number;
  volume: number;
}

interface DayData {
  date: string;
  records: WorkoutRecord[];
  hasWorkout: boolean;
}

export default function HistoryScreen() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [workoutDays, setWorkoutDays] = useState<DayData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedRecords, setSelectedRecords] = useState<WorkoutRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // 從 Google Sheets 獲取該月的訓練紀錄
  const fetchMonthRecords = async () => {
    setLoading(true);
    try {
      const year = currentMonth.getFullYear();
      const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-${new Date(year, currentMonth.getMonth() + 1, 0).getDate()}`;

      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getMonthRecords", startDate, endDate }),
      });

      const result = await response.json();

      if (result.success && result.records) {
        const recordsByDate = new Map<string, WorkoutRecord[]>();

        result.records.forEach((record: WorkoutRecord) => {
          if (!recordsByDate.has(record.date)) {
            recordsByDate.set(record.date, []);
          }
          recordsByDate.get(record.date)!.push(record);
        });

        const days: DayData[] = Array.from(recordsByDate.entries())
          .map(([date, records]) => ({ date, records, hasWorkout: true }))
          .sort((a, b) => a.date.localeCompare(b.date));

        setWorkoutDays(days);
      } else {
        setWorkoutDays([]);
      }
    } catch (error) {
      console.error("獲取訓練紀錄失敗:", error);
      Alert.alert("錯誤", "無法獲取訓練紀錄");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedDate(null);
    setSelectedRecords([]);
    fetchMonthRecords();
  }, [currentMonth]);

  const handleDateSelect = (dayData: DayData) => {
    if (selectedDate === dayData.date) {
      setSelectedDate(null);
      setSelectedRecords([]);
    } else {
      setSelectedDate(dayData.date);
      setSelectedRecords(dayData.records);
    }
  };

  const goToPreviousMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );

  const goToNextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );

  const monthYearString = currentMonth.toLocaleString("zh-TW", {
    year: "numeric",
    month: "long",
  });

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
    return `${d.getMonth() + 1}月${d.getDate()}日（週${weekDays[d.getDay()]}）`;
  };

  return (
    <ScrollView style={historyStyles.container}>
      {/* 標題 */}
      <View style={historyStyles.titleSection}>
        <Text style={historyStyles.title}>訓練紀錄歷史</Text>
      </View>

      {/* 月份導航 */}
      <View style={historyStyles.navigationContainer}>
        <TouchableOpacity
          onPress={goToPreviousMonth}
          style={historyStyles.navigationButton}
        >
          <Text style={historyStyles.navigationButtonText}>← 前月</Text>
        </TouchableOpacity>
        <Text style={historyStyles.monthYearText}>{monthYearString}</Text>
        <TouchableOpacity
          onPress={goToNextMonth}
          style={historyStyles.navigationButton}
        >
          <Text style={historyStyles.navigationButtonText}>後月 →</Text>
        </TouchableOpacity>
      </View>

      {/* 訓練日期列表 */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4285F4"
          style={historyStyles.loadingContainer}
        />
      ) : workoutDays.length === 0 ? (
        <View style={historyStyles.emptyStateContainer}>
          <Text style={historyStyles.emptyStateText}>本月尚無訓練紀錄</Text>
        </View>
      ) : (
        <View style={historyStyles.listContainer}>
          {workoutDays.map((dayData) => {
            const isSelected = selectedDate === dayData.date;
            const totalVolume = dayData.records.reduce(
              (sum, r) => sum + r.volume,
              0,
            );

            return (
              <View key={dayData.date}>
                {/* 日期選擇列 */}
                <TouchableOpacity
                  onPress={() => handleDateSelect(dayData)}
                  style={
                    isSelected
                      ? historyStyles.dateRowSelected
                      : historyStyles.dateRow
                  }
                >
                  <View>
                    <Text
                      style={
                        isSelected
                          ? historyStyles.dateLabelSelected
                          : historyStyles.dateLabel
                      }
                    >
                      {formatDateLabel(dayData.date)}
                    </Text>
                    <Text
                      style={
                        isSelected
                          ? historyStyles.dateSummarySelected
                          : historyStyles.dateSummary
                      }
                    >
                      {dayData.records.length} 個項目・總量{" "}
                      {totalVolume.toFixed(0)} kg
                    </Text>
                  </View>
                  <Text
                    style={
                      isSelected
                        ? historyStyles.dateArrowSelected
                        : historyStyles.dateArrow
                    }
                  >
                    {isSelected ? "▲" : "▼"}
                  </Text>
                </TouchableOpacity>

                {/* 展開的訓練詳情 */}
                {isSelected && (
                  <View style={historyStyles.detailPanel}>
                    {/* 表頭 */}
                    <View style={historyStyles.tableHeader}>
                      <Text
                        style={[
                          historyStyles.tableHeaderCell,
                          historyStyles.tableHeaderCellFlex2,
                        ]}
                      >
                        項目
                      </Text>
                      <Text
                        style={[
                          historyStyles.tableHeaderCell,
                          historyStyles.tableHeaderCellFlex1,
                        ]}
                      >
                        重量(kg)
                      </Text>
                      <Text
                        style={[
                          historyStyles.tableHeaderCell,
                          historyStyles.tableHeaderCellFlex1,
                        ]}
                      >
                        次數
                      </Text>
                      <Text
                        style={[
                          historyStyles.tableHeaderCell,
                          historyStyles.tableHeaderCellFlex1,
                        ]}
                      >
                        訓練量
                      </Text>
                    </View>

                    {/* 訓練項目 */}
                    <FlatList
                      scrollEnabled={false}
                      data={selectedRecords}
                      keyExtractor={(_, index) => index.toString()}
                      renderItem={({ item, index }) => (
                        <View
                          style={[
                            historyStyles.tableRow,
                            index % 2 === 0
                              ? historyStyles.tableRowOdd
                              : historyStyles.tableRowEven,
                          ]}
                        >
                          <Text
                            style={[
                              historyStyles.tableCell,
                              historyStyles.tableHeaderCellFlex2,
                            ]}
                          >
                            {item.exerciseName}
                          </Text>
                          <Text
                            style={[
                              historyStyles.tableCellSecondary,
                              historyStyles.tableHeaderCellFlex1,
                            ]}
                          >
                            {item.weight}
                          </Text>
                          <Text
                            style={[
                              historyStyles.tableCellSecondary,
                              historyStyles.tableHeaderCellFlex1,
                            ]}
                          >
                            {item.reps}
                          </Text>
                          <Text
                            style={[
                              historyStyles.tableCellHighlight,
                              historyStyles.tableHeaderCellFlex1,
                            ]}
                          >
                            {item.volume.toFixed(0)}
                          </Text>
                        </View>
                      )}
                    />

                    {/* 統計 */}
                    <View style={historyStyles.statsContainer}>
                      <Text style={historyStyles.statsText}>
                        本次訓練: {selectedRecords.length} 個項目 • 總訓練量:{" "}
                        {totalVolume.toFixed(0)} kg
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}

      <View style={historyStyles.bottomSpacer} />
    </ScrollView>
  );
}
