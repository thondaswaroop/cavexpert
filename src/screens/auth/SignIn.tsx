import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput as PaperTextInput, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setIsUserLoggedIn } from '../../redux/slice/AuthSlice';
import { imagesBucket, globalStyles, authenticationStyles } from '../../Resources';
import { isEmpty } from '../../utils/common/Validation';
import { useToast } from 'react-native-toast-notifications';
import { showToast } from '../../utils/common/ToastUtil';
import { AppEnvironment } from '../../constants/Global';
import { httpService } from '../../services/api/Api';
import { useLoader } from '../../utils/common/LoaderContext';
import { useNavigation } from '@react-navigation/native';
import { loggerService } from '../../utils/CommonUtils';
import { GlobalColors } from '../../styles/Colors';
import CustomTextInput from '../../components/UIComponents/CustomTextInput';
import { ScrollView } from 'react-native';

const SignIn = () => {
  const navigation: any = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const toast = useToast();
  const { showLoader, hideLoader } = useLoader();


  const successLogin = async (userResponse: any) => {

    const UserId = userResponse.id;
    await AsyncStorage.setItem('UserId', UserId);
    dispatch(setIsUserLoggedIn(true));
  }

  const signInClick = async () => {
    showLoader();

    if (isEmpty(username)) {
      showToast('warning', toast, 'Please Enter Username');
      hideLoader();
      return;
    }
    if (isEmpty(password)) {
      showToast('warning', toast, 'Please Enter Password');
      hideLoader();
      return;
    }

    const data = {
      email: username,
      password: password
    };

    try {
      const response: any = await httpService.post('signin', data);
      loggerService('default', 'Sigin Response', data);
      showToast('warning', toast, response.message);
      if (response.status) {
        successLogin(response.userinfo);
      }
    } catch (error) {

      loggerService('error', 'Sigin Response Catch', error);
      showToast('error', toast, 'Login failed, please try again.');
    } finally {
      hideLoader(); // Ensure loader is hidden in all cases

      loggerService('default', 'Sigin Response Finaly', 'hideLoader called in finally block');
    }
  };


  // return (
  //   <View style={globalStyles.introBg}>
  //     <View style={authenticationStyles.logoContainer}>
  //       <Image
  //         source={imagesBucket.logo}
  //         resizeMode='center'
  //         style={authenticationStyles.logoImage}
  //       />
  //     </View>
  //     {/* <View>
  //       <Text style={[globalStyles.textCenter, globalStyles.h1, globalStyles.caps, globalStyles.mTop20, globalStyles.mBottom20, globalStyles.themeTextColor]}>
  //         {AppEnvironment.AppName}
  //       </Text>
  //     </View> */}
  //     <View>
  //       <Text style={[globalStyles.textCenter, globalStyles.h2, globalStyles.caps, globalStyles.mBottom20, globalStyles.themeTextColor]}>
  //         SIGN IN
  //       </Text>
  //     </View>
  //     <View style={globalStyles.inputContainer}>
  //       <PaperTextInput
  //         style={authenticationStyles.inputText}
  //         label="Email Address"
  //         onChangeText={setUsername}
  //         placeholder='Email Address'
  //         value={username}
  //       />
  //       <PaperTextInput
  //         style={authenticationStyles.inputText}
  //         label="Password"
  //         onChangeText={setPassword}
  //         secureTextEntry={true}
  //         placeholder='Password'
  //         // right={<PaperTextInput.Icon icon="eye" />}
  //         value={password}
  //       />
  //       <Button
  //         style={authenticationStyles.loginButton}
  //         mode="contained"
  //         onPress={signInClick}
  //       >
  //         Sign In
  //       </Button>
  //       <View style={{ marginTop: 10 }}>
          // <Text style={[globalStyles.textCenter, globalStyles.p, globalStyles.bold, globalStyles.themeTextColor]}>
          //   Don't have an Account? <Text style={globalStyles.bold} onPress={() => navigation.navigate('SignUp')}>Sign Up</Text>
          // </Text>
  //       </View>
  //     </View>
  //   </View>
  // );

  // New Design Gokulesh(01-11-2024)

  // return (
  //   <View style={styles.container}>
  //     <View style={styles.logoContainer}>
  //       <Image
  //         source={imagesBucket.logo}
  //         resizeMode="center"
  //         style={styles.logoImage}
  //       />
  //     </View>

  //     <View style={styles.inputContainer}>
  //       <CustomTextInput
  //         name={username}
  //         placeHolder="Email Address"
  //         setName={setUsername}
  //         style={styles.input}
  //       />
  //       <CustomTextInput
  //         name={password}
  //         placeHolder="Password"
  //         setName={setPassword}
  //         style={styles.input}
  //       />
  //     </View>

  //     <View style={styles.buttonContainer}>
  //       <Button
  //         style={[authenticationStyles.loginButton,{borderRadius:50}]}
  //         mode="contained"
  //         onPress={signInClick}
  //       >
  //         Sign In
  //       </Button>
  //     </View>

  //     <View style={{marginTop: 20}}>
  //       <Text style={[globalStyles.textCenter, globalStyles.p, {color:GlobalColors.colors.black}]}>
  //         Don't have an Account? <Text style={globalStyles.bold} onPress={() => navigation.navigate('SignUp')}>Sign Up</Text>
  //       </Text>
  //     </View>
  //   </View>
  // );
  
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
            name={username}
            placeHolder="Email Address"
            setName={setUsername}
            style={globalStyles.input}
          />
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
            onPress={signInClick}
          >
            Sign In
          </Button>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={[globalStyles.textCenter, globalStyles.p, { color: GlobalColors.colors.black }]}>
            Don't have an Account?{' '}
            <Text style={globalStyles.bold} onPress={() => navigation.navigate('SignUp')}>
              Sign Up
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
  
};

export default SignIn;