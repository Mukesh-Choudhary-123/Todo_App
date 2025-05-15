import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import colors from '../styles/colors';

export default function TaskInput({ onAdd }) {
  const [text, setText] = useState('');

  function handleAdd() {
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  }

  return (
    <View style={{ flexDirection: 'row', marginVertical: 16 , paddingHorizontal:15 }}>
      <TextInput
        style={{
          flex: 1,
          borderColor: colors.grey,
          borderWidth: 1,
          padding: 8,
          borderRadius: 4,
        }}
        placeholder="New task..."
        value={text}
        onChangeText={setText}
      />
      <Button title="Add" onPress={handleAdd} color={colors.primary}  />
    </View>
  );
}