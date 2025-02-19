export interface BookingCreatedMessage {
    roomName: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    numberOfPersons: number;
    userName: string;
  }