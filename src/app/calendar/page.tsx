export default function CalendarPage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Appointment Calendar</h1>

      <div className="grid grid-cols-7 gap-1 border rounded-lg overflow-hidden">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-medium bg-gray-100 dark:bg-gray-800 p-2"
          >
            {day}
          </div>
        ))}

        {/* 35 placeholders (5 weeks * 7 days) */}
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="h-24 border border-gray-200 dark:border-gray-700 p-2 text-sm"
          >
            {i + 1}
          </div>
        ))}
      </div>
    </main>
  );
}
