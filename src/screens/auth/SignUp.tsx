import React, { useState } from 'react';
import { Image, Text, View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput as PaperTextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setIsUserLoggedIn } from '../../redux/slice/AuthSlice';
import { imagesBucket, globalStyles, authenticationStyles } from '../../Resources';
import { isEmpty, isValidEmail } from '../../utils/common/Validation';
import { useToast } from 'react-native-toast-notifications';
import { showToast } from '../../utils/common/ToastUtil';
import { httpService } from '../../services/api/Api';
import { useLoader } from '../../utils/common/LoaderContext';
import { useNavigation } from '@react-navigation/native';
import DropdownComponent from '../../components/DropDown';
import { loggerService } from '../../utils/CommonUtils';
import { TextInput } from 'react-native';
import { GlobalColors } from '../../styles/Colors';
import CustomTextInput from '../../components/UIComponents/CustomTextInput';

const SignUp = () => {
  const navigation: any = useNavigation();
  const [fullname, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const dispatch = useDispatch();
  const toast = useToast();
  const { showLoader, hideLoader } = useLoader();

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

  const successSignUp = async () => {
    const UserId = '1';
    await AsyncStorage.setItem('UserId', UserId);
    dispatch(setIsUserLoggedIn(true));
  };

  const signUpClick = async () => {
    showLoader();
    if (isEmpty(fullname)) {
      showToast('warning', toast, 'Please Enter Full Name');
      hideLoader();
      return;
    } else if (isEmpty(nickname)) {
      showToast('warning', toast, 'Please Enter Your Nick Name');
      hideLoader();
      return;
    } else if (isEmpty(email)) {
      showToast('warning', toast, 'Please enter Email Address');
      hideLoader();
      return;
    }
    else if (!isValidEmail(email)) {
      showToast('warning', toast, 'Please enter Valid Email Address');
      hideLoader();
      return;
    }
    else if (isEmpty(ageGroup)) {
      showToast('warning', toast, 'Please Select Your Age Group');
      hideLoader();
      return;
    }
    else if (isEmpty(relationship)) {
      showToast('warning', toast, 'Please Select Your Relationship Status');
      hideLoader();
      return;
    }
    else if (isEmpty(password)) {
      showToast('warning', toast, 'Please enter Password');
      hideLoader();
      return;
    } else {
      const data = {
        'fullname': fullname,
        'email': email,
        'age': ageGroup,
        'nickname': nickname,
        'relationship': relationship,
        'password': password
      }
      httpService.post('signup', data).then((response: any) => {
        hideLoader();
        loggerService('default', 'Signup Response', response);
        showToast('warning', toast, response.message);
        if (response.status) {
          successSignUp();
        }
      }).catch((error: any) => {
        loggerService('error', 'Signup Error Response', error);
        hideLoader();
      });
    }
  };

  // return (
  //   <View style={{ backgroundColor: GlobalColors.colors.secondaryBlack, flex: 1, }}>
  //     <KeyboardAvoidingView style={styles.container}
  //       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  //       keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
  //       <ScrollView style={{ flexGrow: 1 }}>

  //         <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' ,}}>
  //           <Image
  //             source={imagesBucket.logo}
  //             resizeMode='center'
  //             style={authenticationStyles.logoImage}

  //           />
            
  //           <Text style={[globalStyles.textCenter, globalStyles.h2, globalStyles.caps, globalStyles.mBottom20, globalStyles.themeTextColor]}>
  //             SIGN UP
  //           </Text>

  //           <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', marginHorizontal: 10 }}>
  //             <PaperTextInput
  //               style={authenticationStyles.inputText}
  //               label="First Name"
  //               onChangeText={setFullName}
  //               placeholder='First Name'
  //               value={fullname}
  //             />
  //             <PaperTextInput
  //               style={authenticationStyles.inputText}
  //               label="Nick Name"
  //               onChangeText={setNickName}
  //               placeholder='Nick Name'
  //               value={nickname}
  //             />
  //             <PaperTextInput
  //               style={authenticationStyles.inputText}
  //               label="Email Address"
  //               onChangeText={setEmail}
  //               placeholder='Email Address'
  //               value={email}
  //             />
  //           </View>

            // <View style={{ width: '95%' }}>
            //   <DropdownComponent
            //     data={ageSelectionData}
            //     label="Age"
            //     placeholder="Select Age Group"
            //     onValueChange={(value: string) => setAgeGroup(value)} // Get the selected value back
            //   />
            //   <DropdownComponent
            //     data={relationSelectionData}
            //     label="RelationShip Status"
            //     placeholder="Select RelationShip Status"
            //     onValueChange={(value: string) => setRelationship(value)} // Get the selected value back
            //   />
            // </View>

  //           <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', marginHorizontal: 10 }}>
  //             <PaperTextInput
  //               style={authenticationStyles.inputText}
  //               label="Password"
  //               onChangeText={setPassword}
  //               secureTextEntry={true}
  //               placeholder='Password'
  //               value={password}
  //             />

  //           </View>

  //         </View>

  //         <Button style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5, marginTop: 5 }} mode="contained"
  //           onPress={signUpClick}>Sign Up</Button>

  //         <Text style={[globalStyles.textCenter, globalStyles.p, globalStyles.bold, globalStyles.themeTextColor,{marginTop:10}]}>
  //           Go Back to <Text style={globalStyles.bold} onPress={() => navigation.navigate('SignIn')}> Sign In</Text>
  //         </Text>

  //       </ScrollView>
  //     </KeyboardAvoidingView>
  //   </View>
  // );

  
  // New code design (01-11-2024)r

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Adjust offset as needed
    >
      <ScrollView contentContainerStyle={globalStyles.innerContainer} showsVerticalScrollIndicator={false}>
        <View style={globalStyles.imageContainer}>
          <Image
            source={imagesBucket.logo}
            style={globalStyles.image}
          />
        </View>

        <View style={globalStyles.newInputContainer}>
          <CustomTextInput
            name={fullname}
            placeHolder="First Name"
            setName={setFullName}
            style={globalStyles.input}
          />
          <CustomTextInput
            name={nickname}
            placeHolder="Nice Name"
            setName={setNickName}
            style={globalStyles.input}
          />

          <CustomTextInput
            name={email}
            placeHolder="Email Address"
            setName={setEmail}
            style={globalStyles.input}
          />
        </View>

        <View style={{ width: '100%' }}>
          <DropdownComponent
            data={ageSelectionData}
            label="Age"
            placeholder="Select Age Group"
            onValueChange={(value: string) => setAgeGroup(value)} // Get the selected value back
          />
          <View style={{marginTop:10}}>
          <DropdownComponent
            data={relationSelectionData}
            label="RelationShip Status"
            placeholder="Select RelationShip Status"
            onValueChange={(value: string) => setRelationship(value)} // Get the selected value back
          />
          </View>
        </View>

        <View style={globalStyles.newInputContainer}>
          <CustomTextInput
            name={password}
            placeHolder="Password"
            setName={setPassword}
            style={globalStyles.input}
          />
        </View>

        <View style={globalStyles.buttonContainer}>
          <Button
            style={[authenticationStyles.loginButton, { borderRadius: 50 }]}
            mode="contained"
            onPress={signUpClick}
          >
            Sign In
          </Button>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={[globalStyles.textCenter, globalStyles.p, { color: GlobalColors.colors.black }]}>
            Don't have an Account?{' '}
            <Text style={globalStyles.bold} onPress={() => navigation.navigate('SignIn')}> Sign In
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

};

export default SignUp;

