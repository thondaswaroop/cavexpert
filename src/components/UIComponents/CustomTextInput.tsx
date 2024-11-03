import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import { TextInput as PaperTextInput } from 'react-native-paper';

interface Props {
    name: string;
    placeHolder: string;
    setName: (text: string) => void;
    style?: StyleProp<ViewStyle>;
}

const CustomTextInput: React.FC<Props> = ({ name, placeHolder, setName, style }) => {
  return (
    <View style={[styles.container, style]}>
      <PaperTextInput
        mode="outlined"
        label={placeHolder} // Ensure this is a string
        value={name}
        onChangeText={text => setName(text)}
        placeholder={placeHolder} // Ensure this is a string
        outlineStyle={{
          borderRadius: 2,
          height: 50
        }}
        outlineColor="#BCBCBC"
        activeOutlineColor="#f38039"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingVertical: 8,
  },
});

export default CustomTextInput;
