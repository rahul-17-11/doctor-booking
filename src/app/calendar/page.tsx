// src/app/calendar/page.tsx

"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { addDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [appointments, setAppointments] = useState<
    { date: Date; name: string; time: string }[]
  >([]);
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [open, setOpen] = useState(false);

  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const days = eachDayOfInterval({ start, end });

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setOpen(true);
  };

  const handleBook = () => {
    if (selectedDate && name && time) {
      setAppointments([...appointments, { date: selectedDate, name, time }]);
      setOpen(false);
      setName("");
      setTime("");
    }
  };

  const renderAppointments = (date: Date) => {
    return appointments
      .filter(
        (a) => format(a.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      )
      .map((a, i) => (
        <div
          key={i}
          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-1 truncate"
        >
          {a.name} - {a.time}
        </div>
      ));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Appointments - {format(today, "MMMM yyyy")}
      </h1>
      <div className="grid grid-cols-7 gap-2 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-medium text-sm text-gray-600">
            {day}
          </div>
        ))}
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className="border h-24 p-1 cursor-pointer rounded hover:bg-gray-100 flex flex-col text-sm"
            onClick={() => handleDayClick(day)}
          >
            <span className="font-medium">{format(day, "d")}</span>
            {renderAppointments(day)}
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              {selectedDate && format(selectedDate, "MMMM do, yyyy")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Patient Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBook}>Book</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
