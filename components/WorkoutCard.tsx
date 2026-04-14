import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  text: { color: "#0a84ff", fontSize: 32 },
  header: { fontWeight: "bold", color: "#888" },
  container: {
    flex: 1,
    backgroundColor: "#000", // 全黑背景
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#1C1C1E", // 深灰色卡片
    padding: 20,
    borderRadius: 15,
  },
  label: {
    color: "#8E8E93",
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#2C2C2E",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    fontSize: 20,
    marginBottom: 20,
  },
  resultContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#38383A",
    paddingTop: 20,
    alignItems: "center",
  },
  resultLabel: {
    color: "#8E8E93",
    fontSize: 16,
  },
  resultValue: {
    color: "#0A84FF", // 經典 iPhone 藍
    fontSize: 48,
    fontWeight: "800",
    marginTop: 5,
  },

cell: { 
    flex: 1, 
    textAlign: "center", 
    color: "#fff", 
    fontSize: 12 // 字體調小以容納多欄位
},

daySelector: { 
    backgroundColor: "#333", 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 20,
    alignItems: "center" 
  },

matrixContainer: { 
    backgroundColor: "#1A1A1A", 
    borderRadius: 12, 
    padding: 10 
  },

  row: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: "#333" 
  },

  // 補在 StyleSheet.create 裡面
  exerciseText: { 
    flex: 2, 
    textAlign: "left", 
    color: "#FFA500", 
    fontSize: 14, 
    fontWeight: "600" 
  },
  
  inputCell: { 
    backgroundColor: "#2C2C2E", 
    marginHorizontal: 2, 
    borderRadius: 6, 
    paddingVertical: 8, 
    color: "#fff", 
    textAlign: "center",
    fontSize: 14,
    flex: 1, // 確保在 row 裡面平均分配
  },

  volumeText: { 
    flex: 1,
    color: "#30D158", 
    fontWeight: "700", 
    textAlign: "center",
    fontSize: 14 
  },
}
);
