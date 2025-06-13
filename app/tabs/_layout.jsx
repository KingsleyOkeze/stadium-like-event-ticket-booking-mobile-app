// app/tabs/_layout.jsx
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';

function TabsLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color }) => <Feather name="home" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Scanner"
        options={{
          tabBarIcon: ({ color }) => <Feather name="camera" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="MyTickets"
        options={{
          tabBarIcon: ({ color }) => <Feather name="list" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}


export default TabsLayout;