import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const InputBoxWithInnerLabel = ({ label, value, unit, width, height, onChange, onFocus, placeholder, keyboardType, autoFocus }) => {

  const inputRef = useRef(null);
  
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  const handlePress = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1}>
      <View style={[styles.boxContainer, { width: width }]}>
        <View style={[styles.valueContainer, {height: height}]}>
          <View>
            <Text style={styles.boxLabel}>{label}</Text>
            <TextInput
              ref={inputRef}
              style={styles.boxField}
              value={value}
              onChangeText={onChange}
              placeholder={placeholder}
              keyboardType={keyboardType}
              onFocus={onFocus}
            />
          </View>
          <Text style={styles.unit}>{unit}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  boxContainer: {
    marginBottom: 10,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#7C7C7C',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingTop: 5,    
  },
  boxLabel: {
    fontSize: 15,
    fontWeight: '300',
    marginBottom: 5,
  },
  boxField: {
    fontSize: 20,
  },
  unit: {
    fontSize: 20,
    alignSelf: 'center',
    marginTop: 18,
  },
});


export default InputBoxWithInnerLabel;
