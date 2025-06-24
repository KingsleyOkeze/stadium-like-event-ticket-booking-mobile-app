import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";

const TABS = ["Upcoming", "Ongoing", "Completed"];

function HomeScreen() {
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const [token, setToken] = useState(null);
    const [events, setEvents] = useState([]);
    const [statusFilter, setStatusFilter] = useState("Upcoming");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setToken(user.token);
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            if (token) {
                resetAndFetch();
            }
        }, [token, statusFilter])
    );

    const resetAndFetch = () => {
        setEvents([]);
        setPage(1);
        setHasMore(true);
        fetchEvents(1, true);
    };

    const fetchEvents = async (targetPage = page, isReset = false) => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const response = await axios.get(
                `/user/events-by-status?status=${statusFilter}&page=${targetPage}&limit=7`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                const fetched = response.data.events;
                console.log("fetched events", fetched)
                if (fetched.length > 0) {
                    setEvents(prev => isReset ? fetched : [...prev, ...fetched]);
                    setPage(targetPage + 1);
                    if (targetPage >= response.data.totalPages) setHasMore(false);
                } else {
                    setHasMore(false);
                }
            }
        } catch (err) {
            console.error("Error fetching events:", err.message);
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            {item.eventImage ? (
                <Image source={{ uri: item?.eventImage }} style={styles.image} />
            ) : (
                <Image
                    source={{ uri: 'https://via.placeholder.com/400x200?text=No+Image' }}
                    style={styles.image}
                />
            )}
            <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>{new Date(item.date).toDateString()}</Text>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={() =>
                        router.push({
                            pathname: "/screens/EventDetailsScreen",
                            params: { eventId: item._id },
                        })
                    }
                >
                    <Text style={styles.btnText}>View Details</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Events</Text>

            <View style={styles.tabBar}>
                {TABS.map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tabItem,
                            statusFilter === tab && styles.tabItemActive
                        ]}
                        onPress={() => setStatusFilter(tab)}
                    >
                        <Text style={[
                            styles.tabText,
                            statusFilter === tab && styles.tabTextActive
                        ]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {initialLoading ? (
                <ActivityIndicator size="large" color="#E94E4E" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={item => item._id}
                    renderItem={renderItem}
                    onEndReached={() => fetchEvents()}
                    onEndReachedThreshold={0.6}
                    ListFooterComponent={loading ? <ActivityIndicator color="#E94E4E" /> : null}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyEmoji}>📭</Text>
                            <Text style={styles.emptyText}>No {statusFilter.toLowerCase()} events found</Text>
                            <Text style={styles.emptySubText}>Please check back later!</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    heading: { fontSize: 22, fontWeight: "bold", marginBottom: 12, color: "#2c3e50" },
    tabBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd"
    },
    tabItem: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    tabItemActive: {
        borderBottomWidth: 2,
        borderBottomColor: "#E94E4E"
    },
    tabText: {
        fontSize: 14,
        color: "#888"
    },
    tabTextActive: {
        color: "#E94E4E",
        fontWeight: "bold"
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        height: 320,
        justifyContent: "space-between"
    },
    image: { height: 180, width: "100%" },
    info: { padding: 12 },
    title: { fontSize: 18, fontWeight: "600", marginBottom: 6 },
    date: { fontSize: 14, color: "#888", marginBottom: 8 },
    btn: {
        backgroundColor: "#E94E4E",
        padding: 10,
        borderRadius: 6,
        alignItems: "center",
    },
    btnText: { color: "#fff", fontWeight: "bold" },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 40,
        marginTop: 100,
    },
    emptyEmoji: { fontSize: 60, marginBottom: 10 },
    emptyText: { fontSize: 18, fontWeight: "600", color: "#2c3e50", marginBottom: 4 },
    emptySubText: { fontSize: 14, color: "#888", textAlign: "center" },
});

export default HomeScreen;

