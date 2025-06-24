import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import axios from 'axios';

function MyTicketsScreen() {
    const { user } = useContext(AuthContext);
    const [token, setToken] = useState('');
    const [tickets, setTickets] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setToken(user.token);
        }
    }, [user]);

    const fetchTickets = async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const response = await axios.get(
                `/user/tickets?page=${page}&limit=10`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                const newTickets = response.data.tickets;
                setTickets(prev => [...prev, ...newTickets]);
                setPage(prev => prev + 1);
                if (page >= response.data.totalPages) setHasMore(false);
            }
        } catch (err) {
            console.error("Failed to fetch tickets:", err);
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchTickets();
        }
    }, [token]);

    const renderTicket = ({ item }) => (
        <View style={styles.ticketCard}>
            <View style={styles.ticketHeader}>
                <Text style={styles.eventTitle}>{item.event?.title || "Untitled Event"}</Text>
                <Text style={[styles.statusBadge, item.isVerified ? styles.verified : styles.unverified]}>
                    {item.isVerified ? "Verified" : "Unverified"}
                </Text>
            </View>
            <Text style={styles.detail}>📍 {item.event?.venue || "Venue TBA"}</Text>
            <Text style={styles.detail}>
                📅 {item.event?.date ? new Date(item.event.date).toDateString() : "Date TBA"}  🕒 {item.event?.time || "TBA"}
            </Text>
            <Text style={styles.detail}>💵 ₦{item.price}</Text>
            <Text style={styles.detail}>
                📥 Booked on {new Date(item.bookedAt).toDateString()}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Tickets</Text>
            {initialLoading ? (
                <ActivityIndicator size="large" color="#E94E4E" />
            ) : (
                <FlatList
                    data={tickets}
                    keyExtractor={(item) => item._id}
                    renderItem={renderTicket}
                    contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
                    onEndReached={fetchTickets}
                    onEndReachedThreshold={0.6}
                    ListFooterComponent={loading ? <ActivityIndicator color="#E94E4E" /> : null}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyEmoji}>🎟️</Text>
                            <Text style={styles.emptyText}>No tickets booked yet</Text>
                            <Text style={styles.emptySubText}>Your booked tickets will appear here</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#2c3e50'
    },
    ticketCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2
    },
    ticketHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50'
    },
    statusBadge: {
        fontSize: 12,
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 6,
        overflow: 'hidden',
        color: 'white'
    },
    verified: {
        backgroundColor: '#2ecc71'
    },
    unverified: {
        backgroundColor: '#e74c3c'
    },
    detail: {
        fontSize: 14,
        marginVertical: 2,
        color: '#34495e'
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    emptyEmoji: {
        fontSize: 60,
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#2c3e50",
        marginBottom: 4,
    },
    emptySubText: {
        fontSize: 14,
        color: "#888",
        textAlign: "center",
    }
});



export default MyTicketsScreen;