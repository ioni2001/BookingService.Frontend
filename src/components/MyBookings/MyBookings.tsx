import React from 'react';
import './MyBookings.css';
import { Booking } from '../../models/Booking';
import { Room } from '../../models/Room';
import BookingComponent from '../Booking/Booking';

interface MyBookingsProps {
    bookings: Booking[];
    rooms: Room[];
}

const MyBookings: React.FC<MyBookingsProps> = ({ bookings, rooms }) => {
    
    return (
        <section className="my-bookings">
            <h2>My Bookings</h2>
            <div className="bookings-grid">
                {bookings.map((booking) => (
                    <BookingComponent key={booking.id} booking={booking} rooms={rooms} />
                ))}
            </div>
        </section>
    );
};

export default MyBookings;