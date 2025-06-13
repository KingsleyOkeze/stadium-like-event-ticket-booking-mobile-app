import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'; // Correct import!
import { AuthContext } from '../contexts/AuthContext';
import { TicketContext } from '../contexts/TicketContext';

export default function ScannerScreen() {
    const { user } = useContext(AuthContext);
    const { handleBooking } = useContext(TicketContext);
    const [email, setEmail] = useState("")
    const [token, setToken] = useState("")
    // Use useCameraPermissions hook for a cleaner way to handle permissions
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState(''); // To store scanned data

    // No need for useEffect just for permissions with useCameraPermissions,
    // you can trigger it based on UI interaction if permission is not granted.
    // However, keeping it here for initial request is fine too.
    useEffect(() => {
        if (!cameraPermission?.granted) {
            requestCameraPermission(); // Request on mount if not granted
        }
    }, [cameraPermission]);

    useEffect(() => {
        if (user) {
            const { token, userId, email } = user;
            setEmail(email)
            setToken(token);
        }
    }, [user]);

    useEffect(() => {
        if (scannedData && token && email) {
            handleBooking(scannedData, email, token);
        }
    }, [scannedData, token, email]);

    const handleBarCodeScanned = ({ type, data }) => { // type is also available here
        setScanned(true);
        setScannedData(data); // Store the data
        Alert.alert("QR Scanned", `Scanned QR content: ${data}`);
        // TODO: decode data (eventId) and make ticket booking API call
    };


    if (!cameraPermission) {
        // Camera permissions are still loading
        return <Text>Requesting camera permission...</Text>;
    }

    if (!cameraPermission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestCameraPermission} title="Grant Permission" />
            </View>
        );
    }

    

    return (
        <View style={styles.container}>
            <View style={styles.scannerWrapper}>
                <CameraView // Use CameraView instead of Camera
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ['qr'], // Only scan QR codes
                    }}
                    style={StyleSheet.absoluteFillObject}
                />
            </View>
            {scanned && (
                <View style={styles.scanResultOverlay}>
                    <Text style={styles.scanResultText}>Scanned: {scannedData}</Text>
                    <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    scannerWrapper: {
        flex: 1,
        overflow: 'hidden',
        margin: 20,
        borderRadius: 12
    },
    scanResultOverlay: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    scanResultText: {
        color: 'white',
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
});