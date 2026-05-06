import { useEffect, useState } from "react";

export default function AppointmentReminder() {
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const loadAppointment = () => {
      const saved = localStorage.getItem("latestAppointment");

      if (saved) {
        setAppointment(JSON.parse(saved));
      }
    };

    loadAppointment();

    window.addEventListener("appointmentUpdated", loadAppointment);

    return () => {
      window.removeEventListener(
        "appointmentUpdated",
        loadAppointment
      );
    };
  }, []);

  if (!appointment) return null;

  return (
    <div className="appointment-reminder">
      <span>
        Your appointment: {appointment.service} —{" "}
        {appointment.appointmentDate} at{" "}
        {appointment.appointmentTime}
      </span>
    </div>
  );
}