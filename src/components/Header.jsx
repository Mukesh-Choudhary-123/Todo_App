import React from 'react';
import { View, Text } from 'react-native';
import colors from '../styles/colors';

export default function Header() {
  return (
    <View style={{ padding: 16, backgroundColor: colors.primary }}>
      <Text style={{ fontSize: 20, color: colors.white, fontWeight: 'bold' }}>
        My To-Do List
      </Text>
    </View>
  );
}