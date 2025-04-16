// types.ts
export interface Offer {
  id: number;
  title: string;
  price: string;
  clinic: string;
  duration: string;
  rating: string;
  distance: string;
  date: string;
  time: string;
  patient: string;
  accepted: boolean;
}

export interface Appointment {
  id: number;
  date: string;
  displayDate: string;
  time: string;
  patient: string;
  procedure: string;
}

