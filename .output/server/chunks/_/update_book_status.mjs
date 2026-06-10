const UPDATE_BOOK_STATUS = `
    mutation UpdateBookingStatus($bookingCode: String!, $status: BookingStatus!){
        updateStatusBooking(bookingCode: $bookingCode, status: $status){
            bookingCode,
            status
        }
    }
`;

export { UPDATE_BOOK_STATUS as U };
//# sourceMappingURL=update_book_status.mjs.map
