import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { router, usePathname } from 'expo-router';
import { SymbolView } from 'expo-symbols';

export default function BottomMenu() {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {/* 每日紀錄 按鈕 */}
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => router.replace('/')}
      >
        <SymbolView 
          name="plus.circle.fill" 
          size={24} 
          tintColor={pathname === '/' ? '#fff' : '#666'} 
        />
        <Text style={[styles.text, { color: pathname === '/' ? '#fff' : '#666' }]}>每日紀錄</Text>
      </TouchableOpacity>

      {/* 歷史紀錄 按鈕 */}
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => router.replace('/history')}
      >
        <SymbolView 
          name="calendar.badge.clock" 
          size={24} 
          tintColor={pathname === '/history' ? '#fff' : '#666'} 
        />
        <Text style={[styles.text, { color: pathname === '/history' ? '#fff' : '#666' }]}>歷史紀錄</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#000',
    borderTopWidth: 0.5,
    borderTopColor: '#333',
    paddingBottom: 30, // 預留給 iOS 底部的安全距離
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 10,
    marginTop: 4,
  },
});