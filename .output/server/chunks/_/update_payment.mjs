const UPDATE_PAYMENT = `
    mutation UpdatePayment($bookingCode: String!, $paymentStatus: PaymentStatus!){
        updatePaymentStatus(bookingCode: $bookingCode, paymentStatus: $paymentStatus){
            bookingCode
        }
    }
`;

export { UPDATE_PAYMENT as U };
//# sourceMappingURL=update_payment.mjs.map
