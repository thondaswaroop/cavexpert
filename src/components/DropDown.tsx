// DropdownComponent.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { GlobalColors } from '../styles/Colors';
import { globalStyles } from '../Resources';

const DropdownComponent = ({ data, label, placeholder, onValueChange }: any) => {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [dropdDownData, setDropdDownData] = useState([{ label: 'Select Age Range', value: '' }, ...data]);

    const handleChange = (item: any) => {
        setValue(item.value);
        setIsFocus(false);
        onValueChange(item.value); // Send the selected value back to the parent component
    };

    useEffect(() => {
        // Update dropdown data if the prop changes
        setDropdDownData([{ label: 'Select Age Range', value: '' }, ...data]);
    }, [data]);

    return (
        <View style={[globalStyles.fullWidth, globalStyles.mBottom20]}>
            {/* <Text style={{ color: GlobalColors.colors.white,alignItems:'flex-start' }}>{label}</Text> */}
            <Dropdown
                style={[styles.dropdown, isFocus ? { borderColor: GlobalColors.colors.primaryColor }:{borderColor: GlobalColors.colors.lightGrey}]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={dropdDownData}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? placeholder : '...'}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={handleChange}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        width: '100%',
        backgroundColor: '#eee',
        borderColor: GlobalColors.colors.black,
        borderWidth: 0.5,
        borderRadius: 3,
        paddingHorizontal: 8,
    },
    placeholderStyle: {
        fontSize: 16,
        color: GlobalColors.colors.black
    },
    selectedTextStyle: {
        fontSize: 16,
        color: GlobalColors.colors.black
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});

export default DropdownComponent;
