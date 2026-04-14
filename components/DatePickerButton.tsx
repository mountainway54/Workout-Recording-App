import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View, StyleSheet } from "react-native";

interface Props {
  date: Date;
  onChange: (date: Date) => void;
}

export default function DatePickerButton({ date, onChange }: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(date); // 暫存選到的日期，按確認才正式更新

  const handleConfirm = () => {
    onChange(tempDate); // 正式更新日期
    setShowPicker(false);
  };

  const handleCancel = () => {
    setTempDate(date); // 捨棄變更，還原成原本日期
    setShowPicker(false);
  };

  return (
    <View>
      <Text style={styles.label}>訓練日期</Text>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={styles.daySelector}
      >
        <Text style={{ color: "#fff" }}>
          {date.toLocaleDateString("zh-TW", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </Text>
      </TouchableOpacity>

      <Modal visible={showPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* 確認／取消按鈕列 */}
            <View style={styles.toolbar}>
              <TouchableOpacity onPress={handleCancel}>
                <Text style={styles.cancelBtn}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm}>
                <Text style={styles.confirmBtn}>確認</Text>
              </TouchableOpacity>
            </View>

            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              themeVariant="dark"
              onChange={(event, selected) => {
                if (selected) setTempDate(selected); // 只暫存，不關閉
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "#ffffff",
    marginBottom: 4,
    fontSize: 14,
  },
  daySelector: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#222",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cancelBtn: {
    color: "#aaa",
    fontSize: 16,
  },
  confirmBtn: {
    color: "#4da6ff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
