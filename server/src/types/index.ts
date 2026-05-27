export type User = {
  id: number;
  email: string;
  role: 'PATIENT' | 'DOCTOR';
};

export type PatientProfile = {
  id: number;
  name: string;
  birthday: Date;
  weight?: number;
  height?: number;
};