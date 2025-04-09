"use client";
import { Subject } from '../utils/types';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function AttendanceTable({ 
  subject,
  onToggleAttendance,
  onSaveAttendance
}: {
  subject: Subject;
  onToggleAttendance: (studentId: string) => void;
  onSaveAttendance: () => void;
}) {
  const today = new Date().toISOString().split('T')[0];

  // Calculate quick statistics
  const totalStudents = subject.students.length;
  const todaysAttendances = subject.attendances.filter(
    a => a.date === today && a.present
  ).length;

  return (
    <div className="space-y-4">
      {/* Informative header - MODIFIED AS REQUESTED */}
      <div className="flex justify-between items-center bg-blue-100 p-4 rounded-lg border border-blue-200 shadow-sm">
        <div>
          <h3 className="text-lg font-semibold text-blue-800">Daily Attendance</h3>
          <p className="text-sm text-blue-700">
            {new Date(today).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-blue-800">
            <span className="text-green-600">{todaysAttendances}</span> out of 
            <span> {totalStudents}</span> present
          </p>
          <p className="text-xs text-blue-600">
            ({Math.round((todaysAttendances / totalStudents) * 100)}%)
          </p>
        </div>
      </div>

      {/* Students table - MAINTAINED EXACTLY THE SAME */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Attendance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {subject.students.map((student) => {
              const attendance = subject.attendances.find(
                (a) => a.studentId === student.id && a.date === today
              );
              const present = attendance?.present ?? false;

              return (
                <tr 
                  key={student.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {student.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {student.id.slice(-6)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {present ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                        Present
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200">
                        Absent
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => onToggleAttendance(student.id)}
                      className={`p-1 rounded-full ${present ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'}`}
                    >
                      {present ? (
                        <CheckCircleIcon className="h-6 w-6" />
                      ) : (
                        <XCircleIcon className="h-6 w-6" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Action button - MAINTAINED EXACTLY THE SAME */}
      <div className="flex justify-end">
        <button
          onClick={onSaveAttendance}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Save Attendance
        </button>
      </div>
    </div>
  );
}