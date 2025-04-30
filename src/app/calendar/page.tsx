"use client";

import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Appointment = {
  id: number;
  date: string;
  name: string;
  time: string;
};
type ViewMode = "month" | "week" | "day";

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    setIsDialogOpen(true);
    setEditingId(null);
    setName("");
    setTime("");
  };

  const handleBookOrUpdate = () => {
    if (!selectedDate || !name || !time) return;

    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    if (editingId !== null) {
      setAppointments((prev) =>
        prev.map((app) => (app.id === editingId ? { ...app, name, time } : app))
      );
    } else {
      const newAppointment: Appointment = {
        id: Date.now(),
        date: formattedDate,
        name,
        time,
      };
      setAppointments((prev) => [...prev, newAppointment]);
    }

    setIsDialogOpen(false);
    setName("");
    setTime("");
    setEditingId(null);
  };

  const handleEdit = (app: Appointment) => {
    setEditingId(app.id);
    setName(app.name);
    setTime(app.time);
  };

  const handleDelete = (id: number) => {
    setAppointments((prev) => prev.filter((app) => app.id !== id));
  };

  const renderAppointments = (date: Date) => {
    return appointments
      .filter((a) => a.date === format(date, "yyyy-MM-dd"))
      .map((a, i) => (
        <div
          key={a.id}
          className="text-xs bg-blue-100 text-blue-800 rounded px-1 mt-1 truncate"
        >
          {a.name} @ {a.time}
        </div>
      ));
  };

  const renderMonthCells = () => {
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        days.push(
          <div
            key={cloneDay.toString()}
            className={`h-28 border p-2 text-sm cursor-pointer hover:bg-muted transition-all overflow-hidden ${
              !isSameMonth(cloneDay, monthStart) ? "text-muted-foreground" : ""
            } ${
              isSameDay(cloneDay, selectedDate ?? new Date())
                ? "bg-primary text-white"
                : ""
            }`}
            onClick={() => handleDateClick(cloneDay)}
          >
            <div>{format(cloneDay, "d")}</div>
            {renderAppointments(cloneDay)}
          </div>
        );
        day = addDays(day, 1);
      }
    }

    return <div className="grid grid-cols-7 gap-px bg-border">{days}</div>;
  };

  const appointmentsForSelectedDate = appointments.filter(
    (a) => a.date === format(selectedDate ?? new Date(), "yyyy-MM-dd")
  );

  const renderWeekView = () => {
    const start = startOfWeek(currentMonth, { weekStartsOn: 0 }); // Sunday
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

    return (
      <div className="grid grid-cols-8 border-t border-l text-sm">
        {/* Top Row */}
        <div className="border-b border-r bg-muted h-10 flex items-center justify-center font-medium">
          Time
        </div>
        {Array.from({ length: 7 }).map((_, i) => {
          const date = addDays(start, i);
          return (
            <div
              key={i}
              className="border-b border-r bg-muted h-10 flex items-center justify-center font-medium"
            >
              {format(date, "EEE d")}
            </div>
          );
        })}

        {/* Time Rows */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="border-r border-b h-20 flex items-start justify-center pt-1 text-muted-foreground">
              {`${hour}:00`}
            </div>
            {Array.from({ length: 7 }).map((_, i) => {
              const day = addDays(start, i);
              const dateStr = format(day, "yyyy-MM-dd");
              const appointment = appointments.find(
                (a) =>
                  a.date === dateStr &&
                  a.time.startsWith(`${hour.toString().padStart(2, "0")}`)
              );

              return (
                <div
                  key={i}
                  className="border-r border-b h-20 p-1 hover:bg-muted transition cursor-pointer relative"
                  onClick={() => handleDateClick(day)}
                >
                  {appointment && (
                    <div className="absolute inset-1 bg-blue-100 text-blue-800 text-xs p-1 rounded overflow-hidden">
                      {appointment.name} @ {appointment.time}
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex gap-2">
          <Button onClick={handlePrevMonth}>Previous</Button>
          <Button onClick={handleNextMonth}>Next</Button>
        </div>
        <h2 className="text-xl font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "month" ? "default" : "outline"}
            onClick={() => setViewMode("month")}
          >
            Month
          </Button>
          <Button
            variant={viewMode === "week" ? "default" : "outline"}
            onClick={() => setViewMode("week")}
          >
            Week
          </Button>
          <Button
            variant={viewMode === "day" ? "default" : "outline"}
            onClick={() => setViewMode("day")}
          >
            Day
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center font-medium text-muted-foreground mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      {viewMode === "month" && renderMonthCells()}
      {viewMode === "week" && renderWeekView()}
      {viewMode === "day" && renderDayView()}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Appointment" : "Book Appointment"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="text-sm text-muted-foreground">
              {selectedDate && format(selectedDate, "PPP")}
            </div>
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
            <div className="mt-4 space-y-2">
              {appointmentsForSelectedDate.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between text-sm bg-muted p-2 rounded"
                >
                  <span>
                    {app.name} @ {app.time}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(app)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(app.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookOrUpdate}>
              {editingId ? "Update" : "Book"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
