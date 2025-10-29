'use client';

import React, { useState } from 'react';
import { PlusCircle, CalendarDays, CalendarRange, Clock, CloudSun, Moon, Sun, CircleMinus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { UpdateMedication } from '@/Redux/action';

type MedicationEntry = {
  hour: string;
  minute: string;
  ampm: 'AM' | 'PM';
  medication: string;
  dose: string;
  remark: string;
  days: { [key: string]: boolean };
  date: string;
};

type WeekSchedule = {
  weekNumber: number;
  entries: MedicationEntry[];
};

const daysList = [
  { key: 'M', label: 'M' },
  { key: 'T1', label: 'T' },
  { key: 'W', label: 'W' },
  { key: 'T2', label: 'T' },
  { key: 'F', label: 'F' },
  { key: 'S1', label: 'S' },
  { key: 'S2', label: 'S' },
];


const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

const initialWeeks: WeekSchedule[] = Array.from({ length: 3 }, (_, i) => ({
  weekNumber: i + 1,
  entries: [
    {
      hour: '08',
      minute: '00',
      ampm: 'AM',
      medication: '',
      dose: '',
      remark: '',
      days: Object.fromEntries(daysList.map((d) => [d.key, false])),
      date: '',
    },
  ],
}));

export default function MedicationSchedule() {
  const [weeks, setWeeks] = useState<WeekSchedule[]>(initialWeeks);
const dispatch=useDispatch()
  const handleChange = (
    weekIndex: number,
    entryIndex: number,
    field: keyof MedicationEntry,
    value: string | boolean,
    dayKey?: string
  ) => {
    const updatedWeeks = [...weeks];
    const entry = updatedWeeks[weekIndex].entries[entryIndex];

    if (field === 'days' && dayKey) {
      entry.days[dayKey] = value as boolean;
    } else {
      (entry[field] as string) = value as string;
    }

    setWeeks(updatedWeeks);
  };

  const addNewRow = (weekIndex: number) => {
    const newEntry: MedicationEntry = {
      hour: '08',
      minute: '00',
      ampm: 'AM',
      medication: '',
      dose: '',
      remark: '',
      days: Object.fromEntries(daysList.map((d) => [d.key, false])),
      date: '',
    };

    const updatedWeeks = [...weeks];
    updatedWeeks[weekIndex].entries.push(newEntry);
    setWeeks(updatedWeeks);
  };

  const selectWholeWeekForEntry = (weekIndex: number, entryIndex: number) => {
    const updatedWeeks = [...weeks];
    const entry = updatedWeeks[weekIndex].entries[entryIndex];
    daysList.forEach((day) => (entry.days[day.key] = true));
    setWeeks(updatedWeeks);
  };

  const selectWholeMonth = () => {
    const updatedWeeks = weeks.map((week) => ({
      ...week,
      entries: week.entries.map((entry) => ({
        ...entry,
        days: Object.fromEntries(daysList.map((d) => [d.key, true])),
      })),
    }));
    setWeeks(updatedWeeks);
  };


  const removeRow = (weekIndex: number, entryIndex: number) => {
    const updatedWeeks = [...weeks];
    updatedWeeks[weekIndex].entries.splice(entryIndex, 1); // remove the entry at entryIndex
    setWeeks(updatedWeeks);
  };


  const formatTime = (entry: MedicationEntry) => {
    const hourNum = parseInt(entry.hour, 10);
    const isAM = entry.ampm === 'AM';
    let period = '';
    let Icon = Sun;

    if (isAM) {
      if (hourNum === 12) {
        period = 'Midnight';
        Icon = Moon;
      } else if (hourNum < 12 && hourNum >= 5) {
        period = 'Morning';
        Icon = Sun;
      } else {
        period = 'Early Morning';
        Icon = CloudSun;
      }
    } else {
      if (hourNum === 12) {
        period = 'Noon';
        Icon = CloudSun;
      } else if (hourNum < 6) {
        period = 'Afternoon';
        Icon = CloudSun;
      } else {
        period = 'Evening';
        Icon = Moon;
      }
    }

    return (
      <div className="flex items-center justify-center gap-1 text-gray-700">
        <Icon className="w-4 h-4 text-yellow-500" />
        <span>
          {entry.hour}:{entry.minute} {entry.ampm} ({period})
        </span>
      </div>
    );
  };



  const handleSave = () => {
    dispatch(UpdateMedication(weeks))
    console.log('Medication Data to Post in DB:', weeks);
  };

  return (
    <div className="hidden md:flex flex-col space-y-6 px-2 sm:px-4 md:px-8 lg:px-16 py-4">

      <div className="flex justify-between items-center gap-4">
        <button
          onClick={selectWholeMonth}
          className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 transition"
        >
          <CalendarRange className="w-4 h-4" /> Select Whole Month
        </button>


        {/* <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save & Log Data
        </button> */}
      </div>

      {weeks.map((week, weekIndex) => (
        <div
          key={week.weekNumber}
          className="border rounded-lg p-4 shadow-lg bg-white"
        >
          <div className="flex justify-between items-center">
            <h2 className="bg-blue-500 text-white px-3 py-2 text-lg font-semibold rounded-md">
              Week {week.weekNumber}
            </h2>


          </div>


          <div className="overflow-x-auto mt-3">
            <table className="w-full border-collapse border border-gray-300 text-sm md:text-base min-w-[1050px]">
              <thead>
                <tr className="bg-blue-100 text-center">
                  <th>Date</th>
                  <th>Time</th>
                  <th>Medication</th>
                  {daysList.map((day) => (
                    <th key={day.key} className="border p-2">
                      {day.label}
                    </th>
                  ))}
                  <th>Dose</th>
                  <th>Remark</th>
                  <th>Action</th>
                </tr>
              </thead>


              <tbody>
                {week.entries.map((entry, entryIndex) => (
                  <tr key={entryIndex} className="text-center">

                    <td className="border p-2">
                      <input
                        type="date"
                        value={entry.date || ''}
                        onChange={(e) =>
                          handleChange(
                            weekIndex,
                            entryIndex,
                            'date',
                            e.target.value
                          )
                        }
                        className="border rounded-md p-1 text-xs md:text-sm focus:ring-2 focus:ring-blue-400"
                      />
                    </td>


                    <td className="border p-2">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <select
                            value={entry.hour || ''}
                            onChange={(e) =>
                              handleChange(
                                weekIndex,
                                entryIndex,
                                'hour',
                                e.target.value
                              )
                            }
                            className="border rounded-md p-1 text-xs md:text-sm focus:ring-2 focus:ring-blue-400"
                          >
                            {hours.map((h) => (
                              <option key={h} value={h || ''}>
                                {h}
                              </option>
                            ))}
                          </select>
                          <span>:</span>
                          <select
                            value={entry.minute || ''}
                            onChange={(e) =>
                              handleChange(
                                weekIndex,
                                entryIndex,
                                'minute',
                                e.target.value
                              )
                            }
                            className="border rounded-md p-1 text-xs md:text-sm focus:ring-2 focus:ring-blue-400"
                          >
                            {minutes.map((m) => (
                              <option key={m} value={m || ''}>
                                {m}
                              </option>
                            ))}
                          </select>
                          <select
                            value={entry.ampm || ''}
                            onChange={(e) =>
                              handleChange(
                                weekIndex,
                                entryIndex,
                                'ampm',
                                e.target.value
                              )
                            }
                            className="border rounded-md p-1 text-xs md:text-sm focus:ring-2 focus:ring-blue-400"
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTime(entry)}
                        </div>
                      </div>
                    </td>


                    <td className="border p-2">
                      <input
                        type="text"
                        placeholder="Enter medication"
                        value={entry.medication || ''}
                        onChange={(e) =>
                          handleChange(
                            weekIndex,
                            entryIndex,
                            'medication',
                            e.target.value
                          )
                        }
                        className="border rounded-md p-1 w-full text-xs md:text-sm focus:ring-2 focus:ring-blue-400"
                      />
                    </td>


                    {daysList.map((day) => (
                      <td key={day.key} className="border p-2 text-center">
                        <input
                          type="checkbox"
                          checked={entry.days[day.key]}
                          onChange={(e) =>
                            handleChange(
                              weekIndex,
                              entryIndex,
                              'days',
                              e.target.checked,
                              day.key
                            )
                          }
                          className="w-4 h-4 cursor-pointer accent-blue-500"
                        />
                      </td>
                    ))}


                    <td className="border p-2">
                      <input
                        type="text"
                        placeholder="Dose"
                        value={entry.dose || ''}
                        onChange={(e) =>
                          handleChange(
                            weekIndex,
                            entryIndex,
                            'dose',
                            e.target.value
                          )
                        }
                        className="border rounded-md p-1 w-full text-xs md:text-sm focus:ring-2 focus:ring-blue-400"
                      />
                    </td>


                    <td className="border p-2">
                      <input
                        type="text"
                        placeholder="Remark"
                        value={entry.remark || ''}
                        onChange={(e) =>
                          handleChange(
                            weekIndex,
                            entryIndex,
                            'remark',
                            e.target.value
                          )
                        }
                        className="border rounded-md p-1 w-full text-xs md:text-sm focus:ring-2 focus:ring-blue-400"
                      />
                    </td>


                    <td className="border p-2 flex flex-col gap-1 items-center">
                      <button
                        onClick={() => selectWholeWeekForEntry(weekIndex, entryIndex)}
                        className="flex w-[160px] items-center gap-1 cursor-pointer bg-teal-500 text-white px-2 py-1 rounded-md text-xs hover:bg-green-600 transition"
                      >
                        <CalendarDays /> select Whole Week
                      </button>

                      <button
                        onClick={() => removeRow(weekIndex, entryIndex)}
                        className="flex items-center gap-1 cursor-pointer bg-red-500 text-white px-2 py-1 rounded-md text-xs hover:bg-red-600 transition"
                      >
                        <CircleMinus className="w-4 h-4" /> Remove Row
                      </button>
                    </td>


                  </tr>

                ))}
              </tbody>
            </table>

          </div>
          <div className='flex justify-end'>
            <button
              onClick={() => addNewRow(weekIndex)}
              className="mt-2 gap-1 flex  items-center text-green-600 hover:text-green-700 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Add Row</span>
            </button>
          </div>

        </div>
      ))}
      <div className='flex items-center justify-center'>
<button
type='button'
  className=" hover:bg-gray-200 cursor-pointer w-[200px] text-green-600 border border-green-600 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-1"
  onClick={handleSave}
>
  Save Medication
</button>
 </div>
    </div>
  );
}
