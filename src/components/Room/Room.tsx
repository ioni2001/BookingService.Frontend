import React, { useState } from 'react';
import './Room.css';
import { Room } from '../../models/Room';
import { RoomAvailability } from '../../models/RoomAvailability';

interface RoomProps {
  room: Room;
  availability: RoomAvailability[];
  onCreateBooking: (roomId: string) => void;
}

const RoomComponent: React.FC<RoomProps> = ({ room, availability, onCreateBooking }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="room-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3>{room.name}</h3>
      <p>Capacity: {room.capacity} persons</p>
      <div className="availability">
        <h4>Availability:</h4>
        {availability.length > 0 ? (
          availability.map((slot, index) => (
            <p key={index}>
              {slot.start} - {slot.end}
            </p>
          ))
        ) : (
          <p>No availability for selected date and time.</p>
        )}
      </div>
      {isHovered && (
        <button
          className="create-booking-button"
          onClick={() => onCreateBooking(room.id)}
        >
          Create Booking
        </button>
      )}
    </div>
  );
};

export default RoomComponent;