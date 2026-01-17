export const MUTATION_CREATE_BOOKING = `
  mutation CreateBooking(
    $name: String!, 
    $contact: String!, 
    $email: String!, 
    $institution: String, 
    $suratFile: Upload, 
    $sptjmFile: Upload,
    $renterType: RenterType!,
    $details: [BookingDetailInput!]!
    $status: BookingStatus
    $paymentStatus: PaymentStatus
  ) {
    createBooking(
      name: $name, 
      contact: $contact, 
      email: $email, 
      institution: $institution,
      suratFile: $suratFile, 
      sptjmFile: $sptjmFile,
      renterType: $renterType,
      details: $details,
      status: $status,
      paymentStatus: $paymentStatus
    ) {
      bookingCode
    }
  }
`