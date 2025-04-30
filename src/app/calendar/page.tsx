"use client";

import { useState } from "react";
import {
  startOfMonth,
  startOfWeek,
  addDays,
  format,
  isSameMonth,
} from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function CalendarPage() {
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
  const days = Array.from({ length: 35 }, (_, i) => addDays(startDate, i));

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Appointment Calendar</h1>

      <div className="grid grid-cols-7 gap-1 border rounded-lg overflow-hidden">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-medium bg-gray-100 dark:bg-gray-800 p-2"
          >
            {day}
          </div>
        ))}

        {days.map((day, i) => (
          <div
            key={i}
            onClick={() => handleDateClick(day)}
            className={`h-24 border border-gray-200 dark:border-gray-700 p-2 text-sm cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 ${
              isSameMonth(day, currentDate) ? "" : "text-gray-400"
            }`}
          >
            <div className="text-right text-xs">{format(day, "d")}</div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Book Appointment
            </DialogTitle>
            <DialogDescription>
              {selectedDate ? format(selectedDate, "PPP") : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <input
                id="name"
                placeholder="Patient Name"
                className="col-span-3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="time" className="text-right">
                Time
              </label>
              <input
                id="time"
                type="time"
                className="col-span-3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDialogOpen(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => setDialogOpen(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Book
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
