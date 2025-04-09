// components/AttendanceHistory.tsx
"use client";
import { Subject } from '../utils/types';

export default function AttendanceHistory({ subject }: { subject: Subject }) {
  const attendancesByDate = subject.attendances.reduce((acc, attendance) => {
    if (!acc[attendance.date]) {
      acc[attendance.date] = [];
    }
    acc[attendance.date].push(attendance);
    return acc;
  }, {} as Record<string, typeof subject.attendances>);

  return (
    <div className="space-y-6">
      {Object.entries(attendancesByDate).map(([date, attendances]) => (
        <div key={date} className="bg-gray-700 p-4 rounded-lg shadow border">
          <h3 className="font-bold text-lg mb-2">{new Date(date).toLocaleDateString()}</h3>
          <ul className="space-y-2">
            {attendances.map(attendance => {
              const student = subject.students.find(e => e.id === attendance.studentId);
              return (
                <li key={`${date}-${attendance.studentId}`} className="flex justify-between">
                  <span>{student?.name || 'Unknown'}</span>
                  <span className={attendance.present ? 'text-green-500' : 'text-red-500'}>
                    {attendance.present ? 'Present' : 'Absent'}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}