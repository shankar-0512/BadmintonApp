import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatScreen from "./screens/ChatScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { GlobalStyles } from "./constants/styles";
import { Ionicons } from "@expo/vector-icons";
import IconButton from "./components/UI/IconButton";
import CourtScreen from "./screens/CourtScreen";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function CourtOverview() {
  return (
    <BottomTabs.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: "white",
        tabBarStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        tabBarActiveTintColor: GlobalStyles.colors.accent500,
        headerRight: ({ tintColor }) => (
          <IconButton
            icon="person-outline"
            size={24}
            color={tintColor}
            onPress={() => {
              navigation.navigate("ProfileScreen");
            }}
          />
        ),
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
      />
      <BottomTabs.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          title: "Chat",
          tabBarLabel: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
            headerTintColor: "white",
          }}
        >
          <Stack.Screen
            name="CourtOverview"
            component={CourtOverview}
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
      </NavigationContainer>
    </>
  );
}
