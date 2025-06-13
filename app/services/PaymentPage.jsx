import React, { useState, useEffect, useRef } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert, TouchableOpacity, Platform, Button } from "react-native";
import  { Paystack, usePaystack }  from 'react-native-paystack-webview';
import { useLocalSearchParams, useRouter } from "expo-router"; // Use expo-router hooks
import axios from "axios";
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Not needed for direct param passing

function PaymentPage() {
    const router = useRouter();
    const { ticketPrice, eventName, userEmail, eventId } = useLocalSearchParams();
    console.log("payment page log", ticketPrice, eventName, userEmail, eventId)
    // State to hold the amount, defaulting to 0 or a sensible value if not passed
    const [amountToPay, setAmountToPay] = useState(parseFloat(ticketPrice) || 0);

    // In a real app, you'd fetch the user's email from your authentication context
    // For this example, we're getting it from route params.
    const [billingEmail, setBillingEmail] = useState(userEmail); // Fallback email

    // Check if essential parameters are available
    if (!ticketPrice || !userEmail || !eventId) {
        // You might want to navigate back or show an error
        return (
            <View style={styles.container}>
                <Text>Missing payment details. Please go back and try again.</Text>
                <TouchableOpacity style={styles.errorButton} onPress={() => router.back()}>
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }



    if (Platform.OS === "web") {
        return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Payments are only supported on Android/iOS.</Text>
        </View>
        );
    }





    const handlePaymentSuccess = async (transactionRef) => {
        console.log('Paystack Success Response:', transactionRef);
        Alert.alert("Payment Successful!", `Transaction Reference: ${transactionRef.transactionRef}`);

        try {
            // 1. Verify payment on your backend
            // This is CRUCIAL for security. Never trust client-side payment success.
            const verificationResponse = await axios.post('/user/verify-payment', {
                reference: transactionRef.transactionRef,
                eventId: eventId,
                // Include userId here, normally fetched from auth context
            });

            if (verificationResponse.status === 200 && verificationResponse.data.success) {
                Alert.alert("Booking Confirmed", "Your ticket has been booked successfully!");
                router.replace("/screens/SuccessPaymentScreen"); // Replace to prevent going back to payment
            } else {
                Alert.alert(
                  "Payment Verification Failed", 
                  verificationResponse.data.message || "Please contact support."
                );
                // router.back(); // Or navigate to an error screen
                router.replace("/screens/FailurePaymentScreen");
            }

        } catch (error) {
            console.error("Error verifying payment or booking ticket:", error);
            Alert.alert("Error", "There was an issue processing your booking. Please contact support.");
            router.back();
        }
    };

    const handlePaymentCancel = (e) => {
        console.log('Paystack Payment Canceled/Error:', e);
        Alert.alert("Payment Canceled", "Your payment was not completed.");
        router.back(); // Go back to the previous screen (EventDetailsScreen)
    };


    const { popup } = usePaystack();
    const payNow = () => {
    popup.checkout({
      email: 'jane.doe@example.com',
      amount: 5000, // 5000 represents 5000 in kobo (Paystack's smallest unit)
      reference: 'TXN_123456', // Generate a unique reference for each transaction
      onSuccess: (res) => {
        console.log('Payment Successful:', res);
        // Handle successful payment (e.g., update database, display success message)
      },
      onCancel: (res) => {
        console.log('Payment Cancelled:', res);
        // Handle cancelled payment (e.g., display a message)
      },
    });
  };

    return (
        <View style={{ flex: 1 }}>
            {amountToPay > 0 ? ( // Only show Paystack if amount is positive
            <>
                 
                <Text onPress={payNow}>PAY NOW</Text>
            </>
            ) : (
                <View style={styles.loadingContainer}>
                    <Text>Invalid amount for payment.</Text>
                    <TouchableOpacity style={styles.errorButton} onPress={() => router.back()}>
                        <Text style={styles.buttonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorButton: {
        backgroundColor: '#E94E4E',
        padding: 10,
        borderRadius: 6,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default PaymentPage;


