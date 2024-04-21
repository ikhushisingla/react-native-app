import { ScrollView, Text, View ,Image, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { router } from 'expo-router';
import CustonButton from "../../components/CustomButton";
import { images } from '../../constants';
import FormField from '../../components/FormField';
import { Link } from 'expo-router';
import { getCurrentUser, signIn } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';

const SignIn = () => {
  
  const [form, setForm] = useState({
    email: "",
    password:""
  })
  const {setUser,setIsLogged} = useGlobalContext()

  const [isSubmitting, setisSubmitting] = useState(false)
  const submit = async() => {
    if (form.email==="" || form.password==="") {
      Alert.alert('Error',"Please fill in all the fields")
    }

    setisSubmitting(true);

    try {
      await signIn(form.email, form.password);
      //set it to global statue using context
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);
      Alert.alert("Success","User signed in successfully")
      router.replace('/home')
    } catch (err) {
      console.log(err)
    } finally {
      setisSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full min-h-[83vh] justify-center px-4 my-6">
          <Image
            source={images.logo}
            resizeMode='contain'
            className="w-[115px] h-[35px]"
          />

          <Text className="text-2xl text-white mt-10 font-psemibold text-semibold">Log in to Auro
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustonButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg font-pregular text-gray-100">Dont have an account?</Text>
            <Link href="/sign-up" className='font-psemibold text-lg text-secondary'>Sign up</Link>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn
