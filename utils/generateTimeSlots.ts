interface Slot {
  start: string
  end: string
  hour: number
  status: 'Available' | 'Booked'
  price: number
  previousPrice?: number | null
  highlight?: boolean
}

export function generateTimeSlots(
  startHour = 6,
  endHour = 22,
  pricePerHour = 0,
  bookedSlots: number[] = []
): Slot[] {
  const slots: Slot[] = []
  for (let hour = startHour; hour < endHour; hour++) {
    const start = `${hour.toString().padStart(2, '0')}:00`
    const end = `${(hour + 1).toString().padStart(2, '0')}:00`
    const isBooked = bookedSlots.includes(hour)
    slots.push({
      start: start,
      end: end,
      hour,
      price: pricePerHour,
      previousPrice: null,
      highlight: Math.random() > 0.8,
      status: isBooked ? 'Booked' : 'Available'
    })
  }
  return slots
}

export type {Slot}