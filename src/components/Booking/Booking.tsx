import React from 'react';
import './Booking.css';
import { Booking } from '../../models/Booking';
import { Room } from '../../models/Room';

interface BookingProps {
  booking: Booking;
  rooms: Room[];
}

const BookingComponent: React.FC<BookingProps> = ({ booking, rooms }) => {
  const room = rooms.find((r) => r.id === booking.roomId);

  return (
    <div className="booking-card">
      <h3>Booking for Room: {room ? room.name : 'Unknown Room'}</h3>
      <p>Date: {booking.bookingDate}</p>
      <p>Time: {booking.startTime} - {booking.endTime}</p>
      <p>Number of Persons: {booking.numberOfPersons}</p>
    </div>
  );
};

export default BookingComponent;