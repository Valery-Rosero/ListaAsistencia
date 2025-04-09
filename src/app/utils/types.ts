export type Student = {
  id: string;
  name: string;
};

export type Attendance = {
  studentId: string;
  date: string; // Format: 'YYYY-MM-DD'
  present: boolean;
};

export type Subject = {
  id: string;
  name: string;
  students: Student[];
  attendances: Attendance[];
};
