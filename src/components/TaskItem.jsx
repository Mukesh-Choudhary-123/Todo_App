import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import colors from '../styles/colors';

export default function TaskItem({ id, title, done, onToggle, onDelete }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 , paddingHorizontal:14}}>
      <TouchableOpacity onPress={() => onToggle(id, done ? 1 : 0)}>
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.primary,
            backgroundColor: done ? colors.primary : 'transparent',
            marginRight: 12,
          }}
        />
      </TouchableOpacity>
      <Text style={{ flex: 1, textDecorationLine: done ? 'line-through' : 'none', color: done ? colors.grey : colors.text }}>
        {title}
      </Text>
      <TouchableOpacity onPress={() => onDelete(id)} style={{padding:10}}>
        <Text style={{ color: colors.primary, fontWeight: 'bold' }}>X</Text>
      </TouchableOpacity>
    </View>
  );
}