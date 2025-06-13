import React, { createContext } from "react";
import { Alert } from "react-native";
import axios from "axios";

export const TicketContext = createContext();

export const TicketProvider = ({ children, router }) => {

  const handleBooking = async (eventId, email, token) => {
    console.log("event book log", eventId, email, token);
    if (!eventId) return;

    // if (event.ticketPrice > 0) {
    //   // Redirect to payment screen with params
    //   // router.push({
    //   //   pathname: "/services/PaymentPage",
    //   //   params: {
    //   //     eventName: event.title,
    //   //     ticketPrice: event.ticketPrice,
    //   //     userEmail: email,
    //   //     eventId: event._id,
    //   //   },
    //   // });

    // } else {
      try {
        const response = await axios.post(
          "/user/book-event",
          { eventId: eventId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          router.push("/screens/SuccessPaymentScreen");
        } 
      } catch (error) {
        console.error("Booking error:", error.message);

        const errorMsg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to book ticket. Try again.";

        router.push({
          pathname: "/screens/FailurePaymentScreen",
          params: { message: errorMsg },
        });
      }
    // }
  };

  return (
    <TicketContext.Provider value={{ handleBooking }}>
      {children}
    </TicketContext.Provider>
  );
};
