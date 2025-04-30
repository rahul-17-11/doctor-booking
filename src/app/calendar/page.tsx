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
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  Trash2,
  Edit2,
  Plus,
} from "lucide-react";

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

  const getAppointmentColor = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-amber-100 text-amber-800",
    ];
    return colors[index % colors.length];
  };

  const renderAppointments = (date: Date) => {
    const appsForDate = appointments.filter(
      (a) => a.date === format(date, "yyyy-MM-dd")
    );

    const maxToShow = 2;
    const remaining = appsForDate.length - maxToShow;

    return (
      <>
        {appsForDate.slice(0, maxToShow).map((a, i) => (
          <div
            key={a.id}
            className={`text-xs ${getAppointmentColor(
              i
            )} rounded px-2 py-1 mt-1 truncate flex items-center space-x-1`}
          >
            <Clock size={10} />
            <span className="truncate">
              {a.time} - {a.name}
            </span>
          </div>
        ))}
        {remaining > 0 && (
          <div className="text-xs text-blue-600 font-medium mt-1">
            +{remaining} more
          </div>
        )}
      </>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM
    const dateStr = format(currentMonth, "yyyy-MM-dd"); // Use currentMonth as current day

    return (
      <div className="grid grid-cols-2 border rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-r bg-slate-50 h-12 flex items-center justify-center font-medium">
          Time
        </div>
        <div className="border-b border-r bg-slate-50 h-12 flex items-center justify-center font-medium">
          {format(currentMonth, "EEEE, MMM d")}
        </div>

        {hours.map((hour) => {
          const appsThisHour = appointments.filter(
            (a) => a.date === dateStr && parseInt(a.time.split(":")[0]) === hour
          );

          return (
            <React.Fragment key={hour}>
              <div className="border-b border-r h-20 flex items-start justify-center pt-2 text-slate-500 font-medium">
                {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
              </div>
              <div
                className="border-b border-r h-20 p-1 hover:bg-slate-50 transition cursor-pointer relative"
                onClick={() => {
                  const newDate = new Date(currentMonth);
                  newDate.setHours(hour);
                  handleDateClick(newDate);
                }}
              >
                {appsThisHour.map((app, i) => (
                  <div
                    key={app.id}
                    className={`${getAppointmentColor(
                      i
                    )} text-xs p-1 rounded mb-1 flex items-center`}
                  >
                    <Clock size={12} className="mr-1" />
                    <span className="truncate mr-1">{app.time}</span>
                    <User size={12} className="mr-1" />
                    <span className="truncate">{app.name}</span>
                  </div>
                ))}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const renderMonthCells = () => {
    const days = [];
    let day = startDate;
    const today = new Date();

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isToday = isSameDay(cloneDay, today);
        const isSelected = selectedDate
          ? isSameDay(cloneDay, selectedDate)
          : false;
        const isCurrentMonth = isSameMonth(cloneDay, monthStart);

        days.push(
          <div
            key={cloneDay.toString()}
            className={`min-h-32 border p-1 text-sm cursor-pointer transition-all overflow-hidden
              ${!isCurrentMonth ? "bg-slate-50 text-slate-400" : "bg-white"}
              ${isToday ? "border-blue-400 border-2" : ""}
              ${
                isSelected
                  ? "ring-2 ring-blue-500 ring-inset"
                  : "hover:bg-slate-50"
              }`}
            onClick={() => handleDateClick(cloneDay)}
          >
            <div className="flex justify-between items-center">
              <span
                className={`h-6 w-6 flex items-center justify-center rounded-full
                ${isToday ? "bg-blue-500 text-white" : ""}`}
              >
                {format(cloneDay, "d")}
              </span>

              {isCurrentMonth && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDateClick(cloneDay);
                  }}
                >
                  <Plus size={14} />
                </Button>
              )}
            </div>
            {renderAppointments(cloneDay)}
          </div>
        );
        day = addDays(day, 1);
      }
    }

    return (
      <div className="grid grid-cols-7 rounded-lg overflow-hidden shadow-sm">
        {days}
      </div>
    );
  };

  const appointmentsForSelectedDate = appointments.filter(
    (a) => a.date === format(selectedDate ?? new Date(), "yyyy-MM-dd")
  );

  const renderWeekView = () => {
    const start = startOfWeek(currentMonth, { weekStartsOn: 0 }); // Sunday
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM
    const today = new Date();

    return (
      <div className="grid grid-cols-8 border rounded-lg shadow-sm overflow-hidden">
        {/* Top Row */}
        <div className="border-b border-r bg-slate-50 h-12 flex items-center justify-center font-medium">
          Time
        </div>
        {Array.from({ length: 7 }).map((_, i) => {
          const date = addDays(start, i);
          const isToday = isSameDay(date, today);

          return (
            <div
              key={i}
              className={`border-b border-r bg-slate-50 h-12 flex flex-col items-center justify-center
                ${isToday ? "bg-blue-50 text-blue-700" : ""}`}
            >
              <div className="font-medium">{format(date, "EEE")}</div>
              <div
                className={`text-xs ${
                  isToday
                    ? "bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center"
                    : ""
                }`}
              >
                {format(date, "d")}
              </div>
            </div>
          );
        })}

        {/* Time Rows */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="border-r border-b h-20 flex items-start justify-center pt-2 text-slate-500 font-medium">
              {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
            </div>
            {Array.from({ length: 7 }).map((_, i) => {
              const day = addDays(start, i);
              const dateStr = format(day, "yyyy-MM-dd");
              const appsThisHour = appointments.filter(
                (a) =>
                  a.date === dateStr && parseInt(a.time.split(":")[0]) === hour
              );

              return (
                <div
                  key={i}
                  className="border-r border-b h-20 p-1 hover:bg-slate-50 transition cursor-pointer relative"
                  onClick={() => {
                    const newDate = new Date(day);
                    newDate.setHours(hour);
                    handleDateClick(newDate);
                  }}
                >
                  {appsThisHour.map((app, idx) => (
                    <div
                      key={app.id}
                      className={`${getAppointmentColor(
                        idx
                      )} text-xs p-1 rounded mb-1 flex items-center`}
                    >
                      <Clock size={12} className="mr-1" />
                      <span className="truncate">
                        {app.time} - {app.name}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Appointment Calendar
        </h1>
        <p className="text-slate-500">Manage your schedule and appointments</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevMonth}
            className="rounded-full h-10 w-10"
          >
            <ChevronLeft size={20} />
          </Button>

          <h2 className="text-xl font-semibold text-slate-800">
            {format(currentMonth, "MMMM yyyy")}
          </h2>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="rounded-full h-10 w-10"
          >
            <ChevronRight size={20} />
          </Button>
        </div>

        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
          <Button
            variant={viewMode === "month" ? "default" : "ghost"}
            onClick={() => setViewMode("month")}
            size="sm"
            className={viewMode === "month" ? "shadow-sm" : ""}
          >
            Month
          </Button>
          <Button
            variant={viewMode === "week" ? "default" : "ghost"}
            onClick={() => setViewMode("week")}
            size="sm"
            className={viewMode === "week" ? "shadow-sm" : ""}
          >
            Week
          </Button>
          <Button
            variant={viewMode === "day" ? "default" : "ghost"}
            onClick={() => setViewMode("day")}
            size="sm"
            className={viewMode === "day" ? "shadow-sm" : ""}
          >
            Day
          </Button>
        </div>
      </div>

      {viewMode === "month" && (
        <div className="mb-8">
          <div className="grid grid-cols-7 text-center font-medium text-slate-500 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>
          {renderMonthCells()}
        </div>
      )}

      {viewMode === "week" && <div className="mb-8">{renderWeekView()}</div>}

      {viewMode === "day" && <div className="mb-8">{renderDayView()}</div>}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CalendarIcon className="h-5 w-5" />
              {editingId ? "Edit Appointment" : "Book Appointment"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 p-2 rounded-md">
              <CalendarIcon className="h-4 w-4" />
              {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Patient Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <Input
                  placeholder="Enter patient name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Appointment Time
              </label>
              <div className="relative">
                <Clock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {appointmentsForSelectedDate.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-slate-700 mb-2">
                  Existing Appointments ({appointmentsForSelectedDate.length})
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {appointmentsForSelectedDate.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between text-sm border border-slate-200 p-3 rounded-md hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-500" />
                        <span className="font-medium">{app.time}</span>
                        <span className="text-slate-500">-</span>
                        <span>{app.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEdit(app)}
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(app.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookOrUpdate} disabled={!name || !time}>
              {editingId ? "Update" : "Book"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
