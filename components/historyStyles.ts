import { StyleSheet } from "react-native";

export const historyStyles = StyleSheet.create({
  // ===== 容器 =====
  container: {
    flex: 1,
    backgroundColor: "#0a0a14",
  },

  // ===== 標題區 =====
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },

  // ===== 月份導航 =====
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  navigationButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#1e1e2e",
  },
  navigationButtonText: {
    color: "#4285F4",
    fontSize: 14,
    fontWeight: "600",
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },

  // ===== 日期清單區 =====
  listContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },

  // 日期列（未選取）
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: "#1e1e2e",
  },
  // 日期列（已選取）
  dateRowSelected: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 0,
    borderRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: "#4285F4",
  },

  dateLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e0e0e0",
  },
  dateLabelSelected: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  dateSummary: {
    fontSize: 13,
    marginTop: 2,
    color: "#888888",
  },
  dateSummarySelected: {
    fontSize: 13,
    marginTop: 2,
    color: "#cce0ff",
  },
  dateArrow: {
    fontSize: 18,
    color: "#4285F4",
  },
  dateArrowSelected: {
    fontSize: 18,
    color: "#ffffff",
  },

  // ===== 展開詳情面板 =====
  detailPanel: {
    backgroundColor: "#12121f",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginBottom: 8,
    overflow: "hidden",
  },

  // ===== 表格 =====
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1a1a2e",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableHeaderCell: {
    color: "#888888",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  tableHeaderCellFlex1: {
    flex: 1,
  },
  tableHeaderCellFlex2: {
    flex: 2,
    textAlign: "left",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  tableRowOdd: {
    backgroundColor: "#15151f",
  },
  tableRowEven: {
    backgroundColor: "#12121a",
  },
  tableCell: {
    color: "#e0e0e0",
    fontSize: 14,
  },
  tableCellSecondary: {
    color: "#aaaaaa",
    fontSize: 14,
    textAlign: "center",
  },
  tableCellHighlight: {
    color: "#4285F4",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  // ===== 統計列 =====
  statsContainer: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
  },
  statsText: {
    color: "#aaaaaa",
    fontSize: 13,
  },

  // ===== 空狀態 =====
  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    color: "#555555",
    fontSize: 16,
  },

  // ===== 載入中 =====
  loadingContainer: {
    marginTop: 60,
  },

  // ===== 底部空間 =====
  bottomSpacer: {
    height: 40,
  },
});
