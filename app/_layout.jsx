import { Stack } from 'expo-router';
import { AuthProvider } from './contexts/AuthContext';
import { TicketProvider } from './contexts/TicketContext';
import { useRouter } from "expo-router";

export default function Layout() {
  const router = useRouter();
  return (
    <AuthProvider router={router}>
      <TicketProvider router={router}>
          <Stack screenOptions={{ headerShown: false }}/>
      </TicketProvider>
    </AuthProvider>
  );
}

