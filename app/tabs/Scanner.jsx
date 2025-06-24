import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { AuthContext } from '../../contexts/AuthContext';
import { TicketContext } from '../../contexts/TicketContext';

export default function ScannerScreen() {
    const { user } = useContext(AuthContext);
    const { handleBooking } = useContext(TicketContext);
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState('');

    // Update email and token when user changes
    useEffect(() => {
        if (user) {
            setEmail(user.email);
            setToken(user.token);
        }
    }, [user]);

    // When scannedData, token, and email are available, trigger booking
    useEffect(() => {
        if (scannedData && token && email) {
            handleBooking(scannedData, email, token);
        }
    }, [scannedData, token, email]);

    // Handle barcode scanned event
    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setScannedData(data);
        Alert.alert('QR Scanned', `Scanned QR content: ${data}`);
    };

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>
                    We need your permission to show the camera
                </Text>
                <Button
                    title="Grant Permission"
                    onPress={requestPermission}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.scannerWrapper}>
                <CameraView
                    style={StyleSheet.absoluteFill}
                    facing={facing}
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                    }}
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
        justifyContent: 'center',
    },
    scannerWrapper: {
        flex: 1,
        margin: 20,
        borderRadius: 12,
        overflow: 'hidden',
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