import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center flex-col gap-4">
      <h1 className="text-2xl font-bold">Doctor Appointment Booking</h1>
      <Link
        href="/calendar"
        className="text-blue-500 underline hover:text-blue-700"
      >
        Go to Calendar
      </Link>
    </main>
  );
}
