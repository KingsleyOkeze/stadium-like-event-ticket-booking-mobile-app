import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { TicketContext } from "../../contexts/TicketContext";

function EventDetailsScreen() {
    const route = useLocalSearchParams();
    const { eventId } = route;

    const { user } = useContext(AuthContext);
    const { handleBooking } = useContext(TicketContext);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {
        if (user) {
            setUserEmail(user.email);
            setToken(user.token);
        }
    }, [user]);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(
                    `/user/fetch-event-details/${eventId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                if (response.status === 200) {
                    console.log('Fetched event:', response.data.event);
                    setEvent(response.data.event);
                }
            } catch (err) {
                console.error("Error loading event:", err.message);
            } finally {
                setLoading(false);
            }
        };

        if (eventId && token) fetchEvent();
    }, [eventId, token]);

    const bookEventFunction = () => {
        if (event.status !== "Completed") {
            handleBooking(event._id, userEmail, token);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#E94E4E" />
            </View>
        );
    }

    if (!event) {
        return (
            <View style={styles.centerContainer}>
                <Text style={{ fontSize: 16, color: "#555" }}>Event not found.</Text>
            </View>
        );
    }

    const isCompleted = event.status === "Completed";

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Image
                source={{
                    uri: event.eventImage || "https://placehold.co/600x300?text=No+Image"
                }}
                style={styles.banner}
            />
            <Text style={styles.title}>{event.title}</Text>

            <View style={styles.infoBox}>
                <Text style={styles.detail}>
                    <Text style={styles.detailLabel}>📍 Venue:</Text> {event.venue}
                </Text>
                <Text style={styles.detail}>
                    <Text style={styles.detailLabel}>📅 Date:</Text>{" "}
                    {new Date(event.date).toDateString()}
                </Text>
                <Text style={styles.detail}>
                    <Text style={styles.detailLabel}>🕒 Time:</Text> {event.time}
                </Text>
                <Text style={styles.detail}>
                    <Text style={styles.detailLabel}>🎟 Price:</Text>{" "}
                    {event.ticketPrice > 0 ? `₦${event.ticketPrice}` : "Free"}
                </Text>
                <Text style={styles.detail}>
                    <Text style={styles.detailLabel}>📌 Status:</Text> {event.status}
                </Text>
            </View>

            <Text style={styles.desc}>
                {event.description || "No description provided."}
            </Text>

            <TouchableOpacity
                style={[
                    styles.button,
                    isCompleted && styles.disabledButton
                ]}
                onPress={bookEventFunction}
                disabled={isCompleted}
            >
                <Text style={styles.buttonText}>
                    {isCompleted
                        ? "This event can no longer be booked"
                        : event.ticketPrice > 0
                        ? "Pay & Book Ticket"
                        : "Book Free Ticket"}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: "#fff",
        paddingBottom: 40
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 20
    },
    banner: {
        width: "100%",
        height: 220,
        borderRadius: 12,
        marginBottom: 16,
        backgroundColor: "#f0f0f0"
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#2c3e50"
    },
    infoBox: {
        backgroundColor: "#f9f9f9",
        padding: 14,
        borderRadius: 8,
        marginBottom: 16
    },
    detail: {
        fontSize: 15,
        color: "#555",
        marginBottom: 10,
        lineHeight: 22
    },
    detailLabel: {
        fontWeight: "bold",
        color: "#2c3e50"
    },
    desc: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
        marginBottom: 20
    },
    button: {
        backgroundColor: "#E94E4E",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center"
    },
    disabledButton: {
        backgroundColor: "#ccc"
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16
    }
});

export default EventDetailsScreen;
