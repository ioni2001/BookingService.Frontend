import React, { useEffect, useState } from 'react';
import './DashboardPage.css';
import { Room } from '../models/Room';
import { Booking } from '../models/Booking';
import AvailableRooms from '../components/AvailableRooms/AvailableRooms';
import MyBookings from '../components/MyBookings/MyBookings';
import { fetchWithAuth } from '../utils/api';
import { useSignalR } from '../contexts/SignalRContext';
import { BookingCreatedMessage } from '../models/BookingCreatedMessage';
import { showToast } from '../utils/toast';

const DashboardPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { connection } = useSignalR();
  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    if (!connection) return;

    // Listen for "BookingCreated" events
    connection.on('BookingCreated', async (message: BookingCreatedMessage) => {
      console.log(`Received notification: ${message}`);  
      showToast(
        `User ${message.userName} has created a booking for room ${message.roomName} on ${message.bookingDate} from ${message.startTime} to ${message.endTime}. Number of persons: ${message.numberOfPersons}`
      );
      
      setRefreshFlag(prev => !prev);
    });

    return () => {
      connection.off('BookingCreated');
    };
  }, [connection]);

  useEffect(() => {
    const fetchData = async () => {
        try {
          // Fetch rooms
          const roomsResponse = await fetchWithAuth('http://acme.com/api/Rooms');
          setRooms(roomsResponse);
  
          // Fetch bookings for the logged-in user
          const userId = localStorage.getItem('userId');
          const bookingsResponse = await fetchWithAuth(`http://acme.com/api/Bookings/user/${userId}`);
          setBookings(bookingsResponse);
        } catch (err) {
          setError('Failed to fetch data. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

    fetchData();
  }, [refreshFlag]);

  if (loading) {
    return (
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <AvailableRooms rooms={rooms} />
      <MyBookings bookings={bookings} rooms={rooms} />
    </div>
  );
};

export default DashboardPage;
