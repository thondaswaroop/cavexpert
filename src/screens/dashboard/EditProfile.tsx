import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { GlobalColors } from '../../styles/Colors'
import { Button, TextInput as PaperTextInput } from 'react-native-paper';
import { authenticationStyles } from '../../Resources';
import DropdownComponent from '../../components/DropDown';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const EditProfile = () => {
  const navigation: any = useNavigation();
  const [fullname, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [ageGroup, setAgeGroup] = useState('');

  const ageSelectionData = [
    { label: '18-30', value: '18-30' },
    { label: '31-40', value: '31-40' },
    { label: '40+', value: '40+' }
  ];

  const relationSelectionData = [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'Divorce', value: 'Divorce' }
  ];

  return (
    <View style={{ backgroundColor: GlobalColors.colors.secondaryBlack, flex: 1, }}>
      <View style={styles.header} >
        <MaterialIcons
          name="arrow-back"
          size={28}
          color="#fff"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>{`Edit Profile`}</Text>
      </View >

      <KeyboardAvoidingView style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
        <ScrollView style={{ flexGrow: 1 }}>

          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start',  }}>
              <PaperTextInput
                style={authenticationStyles.inputText}
                label="Enter Full Name"
                onChangeText={setFullName}
                placeholder='Enter Full Name'
                value={fullname}
              />
              <PaperTextInput
                style={authenticationStyles.inputText}
                label="Enter Nick Name"
                onChangeText={setNickName}
                placeholder='Enter Nick Name'
                value={nickname}
              />
              <PaperTextInput
                style={authenticationStyles.inputText}
                label="Enter Your EmailID"
                onChangeText={setEmail}
                placeholder='Enter Your EmailID'
                value={email}
              />
            </View>

            <View style={{ width: '100%' }}>
              <DropdownComponent
                data={ageSelectionData}
                label="Age"
                placeholder="Select Age Group"
                onValueChange={(value: string) => setAgeGroup(value)} // Get the selected value back
              />
              <DropdownComponent
                data={relationSelectionData}
                label="RelationShip Status"
                placeholder="Select RelationShip Status"
                onValueChange={(value: string) => setRelationship(value)} // Get the selected value back
              />
            </View>

            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <PaperTextInput
                style={authenticationStyles.inputText}
                label="Enter Password"
                onChangeText={setPassword}
                secureTextEntry={true}
                placeholder='Enter Password'
                value={password}
              />

            </View>

          </View>

          <Button
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}
            mode="contained"
            onPress={() => { }}
          >
            Done
          </Button>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333', // Adjust as per your design
    height: 70,
    paddingHorizontal: 10,
    zIndex: 1000,
    elevation: 5,
  },
  logo: {
    width: 60,
    height: 50,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
})