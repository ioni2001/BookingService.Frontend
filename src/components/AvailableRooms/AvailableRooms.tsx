import React, { useState, useEffect } from 'react';
import './AvailableRooms.css';
import { Room } from '../../models/Room';
import RoomComponent from '../Room/Room';
import BookingModal from '../BookingModal/BookingModal';
import { fetchWithAuth } from '../../utils/api';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { showToast } from '../../utils/toast';

interface RoomAvailability {
  start: string;
  end: string;
}

interface AvailableRoomsProps {
  rooms: Room[];
}

const AvailableRooms: React.FC<AvailableRoomsProps> = ({ rooms }) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(new Date());
  const [roomAvailability, setRoomAvailability] = useState<{ [roomId: string]: RoomAvailability[] }>({});
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Fetch room availability when the datetime changes
  useEffect(() => {
    const fetchAllRoomsAvailability = async () => {
      const localRoomsAvailability: { [roomId: string]: RoomAvailability[] } = {};

      // Fetch availability for each room
      for (const room of rooms) {
        try {
          const availabilityResponse = await fetchWithAuth(
            `http://acme.com/api/Rooms/room-availability/${room.id}/${selectedDateTime?.toISOString().split('T')[0]}`
          );
          localRoomsAvailability[room.id] = availabilityResponse;
        } catch (err) {
          console.error(`Failed to fetch availability for room ${room.id}:`, err);
          localRoomsAvailability[room.id] = []; // Set empty availability if the fetch fails
        }
      }

      // Update the state with the aggregated availability data
      setRoomAvailability(localRoomsAvailability);
    };

    fetchAllRoomsAvailability();
  }, [selectedDateTime, rooms, refreshFlag]);

  const handleCreateBooking = (roomId: string) => {
    setSelectedRoomId(roomId);
    setIsModalOpen(true);
  };

  const handleSubmitBooking = async (bookingData: {
    bookingDate: string;
    startTime: string;
    endTime: string;
    numberOfPersons: number;
  }) => {
    try {
      const requestBody = {
        RoomId: selectedRoomId,
        BookingDate: bookingData.bookingDate,
        StartTime: bookingData.startTime,
        EndTime: bookingData.endTime,
        NumberOfPersons: bookingData.numberOfPersons,
        UserId: localStorage.getItem('userId'),
      };

      const response = await fetchWithAuth('http://acme.com/api/Bookings/create-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response == null) {
        throw new Error('Failed to create booking');
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error('Error creating booking:', err);
      alert('Failed to create booking. Please try again.');
    }
  };

  return (
    <section className="available-rooms">
      <h2>Available Rooms</h2>
      <div className="datetime-picker">
        <label>Select Date and Time:</label>
        <DateTimePicker
          onChange={(date) => setSelectedDateTime(date)} // The onChange event returns a Date object
          value={selectedDateTime}
          format="yyyy-MM-dd"
          clearIcon={null}
        />
      </div>
      <div className="rooms-grid">
        {rooms.map((room) => (
          <RoomComponent
            key={room.id}
            room={room}
            availability={roomAvailability[room.id] || []}
            onCreateBooking={handleCreateBooking}
          />
        ))}
      </div>
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitBooking}
      />
    </section>
  );
};

export default AvailableRooms;