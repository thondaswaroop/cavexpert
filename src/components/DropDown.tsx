// DropdownComponent.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { GlobalColors } from '../styles/Colors';
import { globalStyles } from '../Resources';

const DropdownComponent = ({ data, label, placeholder, onValueChange, value }: any) => {
    const [selectedValue, setSelectedValue] = useState(value || null);
    const [isFocus, setIsFocus] = useState(false);
    const [dropdownData, setDropdownData] = useState([{ label: 'Select Age Range', value: '' }, ...data]);

    useEffect(() => {
        setDropdownData([{ label: 'Select Age Range', value: '' }, ...data]);
        setSelectedValue(value);  // Update selected value when prop changes
    }, [data, value]);

    const handleChange = (item: any) => {
        setSelectedValue(item.value);
        setIsFocus(false);
        onValueChange(item.value); // Send the selected value back to the parent component
    };

    return (
        <View style={[globalStyles.fullWidth, globalStyles.mBottom20]}>
            <Dropdown
                style={[
                    styles.dropdown,
                    isFocus ? { borderColor: GlobalColors.colors.primaryColor } : { borderColor: GlobalColors.colors.lightGrey }
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={dropdownData}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? placeholder : '...'}
                searchPlaceholder="Search..."
                value={selectedValue}  // Set the initial value for the dropdown
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={handleChange}
                dropdownPosition="auto"
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
