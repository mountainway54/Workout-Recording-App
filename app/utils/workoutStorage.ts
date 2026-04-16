import AsyncStorage from "@react-native-async-storage/async-storage";

export type SetData = { weight: string; reps: string };

export type WorkoutRecord = {
  date: string; // "2025-04-14"
  day: string; // "DayA"
  exercises: string[];
  sets: SetData[];
};

// 產生 key
const makeKey = (date: string, day: string) => `workout_${date}_${day}`;

// 儲存
export async function saveWorkout(record: WorkoutRecord) {
  const key = makeKey(record.date, record.day);
  await AsyncStorage.setItem(key, JSON.stringify(record));
}

// 讀取單筆
export async function loadWorkout(date: string, day: string) {
  const key = makeKey(date, day);
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as WorkoutRecord) : null;
}

// 讀取全部（歷史紀錄用）
export async function loadAllWorkouts(): Promise<WorkoutRecord[]> {
  const keys = await AsyncStorage.getAllKeys();
  const workoutKeys = keys.filter((k) => k.startsWith("workout_"));
  const pairs = await AsyncStorage.multiGet(workoutKeys);
  return pairs
    .map(([, val]) => (val ? JSON.parse(val) : null))
    .filter(Boolean) as WorkoutRecord[];
}
 