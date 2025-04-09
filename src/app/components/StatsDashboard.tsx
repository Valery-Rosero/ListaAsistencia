// components/StatsDashboard.tsx
"use client";
import { Subject } from '../utils/types';

export default function StatsDashboard({ subject }: { subject: Subject }) {
  const totalStudents = subject.students.length;
  const todaysAttendances = subject.attendances.filter(a => a.date === new Date().toISOString().split('T')[0]).length;
  const attendancePercentage = totalStudents > 0 ? Math.round((todaysAttendances / totalStudents) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow border">
        <h3 className="text-gray-700">Total Students</h3>
        <p className="text-2xl font-bold text-green-600">{totalStudents}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border">
        <h3 className="text-gray-700">Todays Attendances</h3>
        <p className="text-2xl font-bold text-green-600">{todaysAttendances}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow border">
        <h3 className="text-gray-100">Attendance Rate</h3>
        <p className="text-2xl font-bold text-gray-300">{attendancePercentage}%</p>
      </div>
    </div>
  );
}