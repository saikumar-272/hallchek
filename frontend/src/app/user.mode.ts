export interface UserData {
  confirmPassword: string;
  fullName: string;
  gender: string;
  hallAddress: string;
  hallCapacity: string;
  hallType: string;
  hallname: string;
  id: string;
  mobileNumber: string;
  parkingArea: string;
  password: string;
  pincode: string;
  status: string;
  signed_datetime: string;
  isEdit: boolean;
  hall_image: string;
}

export interface HallAvailabilityModel {
  hallname: string;
  hallAddress: string;
  fullName: string;
  mobileNumber: string;
  hall_image: string;
  pincode: string;
  week_slots: { date: string; slots: Slot[] }[];
}
interface Slot {
  slot_id: string;
  slot_status: string;
}
