import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-CA", {
    timeZone: "Asia/Jerusalem",
  });
};

export default function AppointmentForm() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [service, setService] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentDate, setAppointmentDate] = useState(
  formatDate(new Date())
  );
  const [bookedTimes, setBookedTimes] = useState([]);
  const [workingDays, setWorkingDays] = useState([]);
  const [offDays, setOffDays] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [savedAppointment, setSavedAppointment] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formattedToday = formatDate(new Date());
  const times = ["11:00", "11:30", "12:00", "12:30", "13:00" , "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

  const fetchBookedTimes = async () => {
    try {
      const response = await fetch(
        `http://https://barber-shop-demo.onrender.com/api/appointments/${appointmentDate}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch booked times");
      }

      const data = await response.json();
      const booked = data.map((appointment) => appointment.appointmentTime);
      setBookedTimes(booked);
    } catch (error) {
      console.error("Error fetching booked times:", error);
    }
  };
  useEffect(() => {
  fetch("https://barber-shop-demo.onrender.com/api/settings/working-days")
    .then((res) => res.json())
    .then((data) => setWorkingDays(data))
    .catch((err) => console.error("Error fetching working days:", err));

  fetch("https://barber-shop-demo.onrender.com/api/settings/off-days")
    .then((res) => res.json())
    .then((data) => setOffDays(data.map((item) => item.date)))
    .catch((err) => console.error("Error fetching off days:", err));
}, []);

  useEffect(() => {
    if (appointmentDate) {
      fetchBookedTimes();
    }
  }, [appointmentDate]);

  const isToday = appointmentDate === formattedToday;

  const isTimePassed = (time) => {
    if (!isToday) return false;

    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    if (hours < currentHours) return true;
    if (hours === currentHours && minutes <= currentMinutes) return true;

    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !phoneNumber || !service || !selectedTime || !appointmentDate) {
      alert("Please fill in all fields.");
      return;
    }

    const appointmentData = {
      fullName,
      phoneNumber,
      service,
      appointmentDate,
      appointmentTime: selectedTime,
    };

    try {
      const response = await fetch("https://barber-shop-demo.onrender.com/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        const savedAppointment = await response.json();
        console.log("Saved appointment:", savedAppointment);

        localStorage.setItem(
           "latestAppointment",
            JSON.stringify(savedAppointment)
);
window.dispatchEvent(new Event("appointmentUpdated"));

      setSavedAppointment(savedAppointment);
       setShowPopup(true);

        setFullName("");
        setPhoneNumber("");
        setService("");
        setSelectedTime("");
        setAppointmentDate(formattedToday);

        fetchBookedTimes();
      } else {
        const errorMessage = await response.text();
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
      alert("Something went wrong while submitting the appointment.");
    }
  };

  return (
    <section id="appointment" className="section appointment">
      <div className="section-content">
        <div className="appointment-info">
          <h2>Book Your Appointment</h2>
          <p>
            Select your service, choose an available time, and submit your
            appointment in a simple and fast way.
          </p>

          <div className="info-list">
            <div className="info-item">Choose from available time slots only</div>
            <div className="info-item">Booked times are disabled automatically</div>
            <div className="info-item">Quick and easy booking form</div>
          </div>
        </div>

        <div className="appointment-box">
          <h2>Appointment Form</h2>

          <form className="appointment-form" onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <label>Phone Number</label>
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <label>Service</label>
            <select value={service} onChange={(e) => setService(e.target.value)}>
              <option value="">Select a service</option>
              <option value="Hair + Beard">Hair + Beard</option>
              <option value="Beard">Beard</option>
              <option value="Hair">Hair</option>
            </select>

            <label>Appointment Date</label>
            <DatePicker
  selected={appointmentDate ? new Date(appointmentDate) : null}
  onChange={(date) => {
    if (!date) return;

    const formattedDate = date.toLocaleDateString("en-CA", {
      timeZone: "Asia/Jerusalem",
    });

    setAppointmentDate(formattedDate);
    setSelectedTime("");
  }}
  minDate={today}
  dateFormat="dd/MM/yyyy"
  className="custom-date-picker-input"
  calendarClassName="custom-calendar"
  filterDate={(date) => {
    const dayName = date
      .toLocaleDateString("en-US", {
        weekday: "long",
        timeZone: "Asia/Jerusalem",
      })
      .toUpperCase();

    const formattedDate = date.toLocaleDateString("en-CA", {
      timeZone: "Asia/Jerusalem",
    });

    const isWorkingDay = workingDays.some(
      (day) => day.dayOfWeek === dayName && day.enabled
    );

    const isOffDay = offDays.includes(formattedDate);

    return isWorkingDay && !isOffDay;
  }}
/>
            <label>Available Times</label>
            <div className="times-grid">
              {times.map((time) => {
                const isBooked = bookedTimes.includes(time);
                const isPassed = isTimePassed(time);

                return (
                  <button
                    type="button"
                    key={time}
                    className={`time-btn ${
                      isBooked || isPassed
                        ? "booked"
                        : selectedTime === time
                        ? "selected"
                        : ""
                    }`}
                    disabled={isBooked || isPassed}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                );
              })}
            </div>

            <button type="submit" className="submit-btn">
              Confirm Appointment
            </button>
          </form>
        </div>
      </div>
    {showPopup && savedAppointment && (
  <div className="appointment-popup-overlay">
    <div className="appointment-popup">
      <h2>Appointment Confirmed</h2>

      <p>
        <strong>Name:</strong> {savedAppointment.fullName}
      </p>

      <p>
        <strong>Service:</strong> {savedAppointment.service}
      </p>

      <p>
        <strong>Date:</strong> {savedAppointment.appointmentDate}
      </p>

      <p>
        <strong>Time:</strong> {savedAppointment.appointmentTime}
      </p>

      <p className="popup-note">
        Please take a screenshot of your appointment.
      </p>

      <button
        onClick={() => setShowPopup(false)}
        className="close-popup-btn"
      >
        Close
      </button>
    </div>
  </div>
)}

    </section>
  );
}