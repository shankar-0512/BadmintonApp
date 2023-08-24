import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileScreen from "./screens/ProfileScreen";
import CourtScreen from "./screens/CourtScreen";
import GameScreen from "./screens/GameScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import { GlobalStyles } from "./constants/styles";
import { Ionicons } from "@expo/vector-icons";
import IconButton from "./components/UI/IconButton";
import { View, Text } from "react-native";
import { CourtDataContextProvider } from "./store/CourtDataContext";
import { WebSocketProvider } from "./store/WebSocketProvider";
import { UserProvider } from "./store/UserContext";
import { Entypo } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function LoadingScreen({ navigation }) {
  useEffect(() => {
    async function initializeApp() {
      try {
        const savedUserName = await AsyncStorage.getItem("userName");

        if (savedUserName) {
          navigation.replace("CourtOverview", { userName: savedUserName });
        } else {
          navigation.replace("LoginScreen");
        }
      } catch (error) {
        console.log(error);
      }
    }

    initializeApp();
  }, [navigation]);

  return (
    // You can replace this with a proper loading view
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

function SportsClubIconCenter() {
  return <Entypo name="sports-club" size={30} color="white" />;
}

async function handleLogout(navigation) {
  await AsyncStorage.removeItem("userName");
  navigation.navigate("LoginScreen");
}

function CourtOverview({ route }) {
  return (
    <BottomTabs.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: "white",
        tabBarStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        tabBarActiveTintColor: GlobalStyles.colors.accent500,
        tabBarInactiveTintColor: GlobalStyles.colors.gray500,
        headerRight: ({ tintColor }) => (
          <IconButton
            icon="log-out-outline"
            size={28}
            color={tintColor}
            onPress={() => {
              handleLogout(navigation);
            }}
          />
        ),
        headerTitle: () => <SportsClubIconCenter />,
      })}
    >
      <BottomTabs.Screen
        name="CourtScreen"
        component={CourtScreen}
        options={{
          title: "Court",
          tabBarLabel: "Court",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
        initialParams={{ userName: route.params.userName }}
      />
      <BottomTabs.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}

export default function App() {
  return (
    <UserProvider>
      <CourtDataContextProvider>
        <StatusBar style="light" />
        <NavigationContainer>
          <WebSocketProvider>
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: GlobalStyles.colors.primary500,
                },
                headerTintColor: "white",
              }}
              initialRouteName="LoadingScreen"
            >
              <Stack.Screen
                name="LoadingScreen"
                component={LoadingScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SignupScreen"
                component={SignupScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="CourtOverview"
                component={CourtOverview}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="GameScreen"
                component={GameScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                  presentation: "modal",
                }}
              />
            </Stack.Navigator>
          </WebSocketProvider>
        </NavigationContainer>
      </CourtDataContextProvider>
    </UserProvider>
  );
}
