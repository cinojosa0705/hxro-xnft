import React, { useState } from 'react';
import { TextInput, View } from 'react-native';

// This defines the prop types for the component, specifically that it expects to receive 
// a function called onChange which takes an amount parameter.
//
type AmmountInputProps = {
    onChange: (amount: number) => void;
  }
  
// This file exports a functional component called AmmountInput. The component is a 
// simple view that contains a TextInput element. The component expects to receive a 
// prop onChange, which is a function that will be called whenever the value of the 
// TextInput changes.
//
const AmmountInput = ({ onChange }: AmmountInputProps) => {
  const [value, setValue] = useState('');

//This is a helper function that is called whenever the text input value changes. 
//The function takes in the text as a parameter, it converts the text to a number using 
//parseInt() and sets it to numericValue, updates the component's state value with the 
//entered text and calls the onChange prop function with the numericValue as an argument.
//
  const handleChange = (text:string) => {
    const numericValue = text ? parseInt(text) : 0;
    setValue(text);
    onChange(numericValue);
};

  return (
    <View>
      <TextInput
        keyboardType="number-pad"
        onChangeText={handleChange}
        placeholder='Amount: ex. 10'
        placeholderTextColor='#6C6C6C'
        value={value}
        style={{
          borderColor: 'white',
          borderWidth: 1,
          color: 'white',
          fontSize: 20,
          borderRadius: "5px"
        }}
      />
    </View>
  );
};

export default AmmountInput;
