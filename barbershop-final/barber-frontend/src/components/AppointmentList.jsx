import { useEffect, useState } from "react";
import Navbar from "./Navbar";


const getIsraelToday = () => {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Jerusalem",
  });
};

export default function AppointmentsList({
  isLoggedIn,
  role,
  setIsLoggedIn,
  setRole
}) {
  const [appointments, setAppointments] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [workingDays, setWorkingDays] = useState([]);
  const [offDays, setOffDays] = useState([]);
  const [newOffDay, setNewOffDay] = useState("");

  const filteredAppointments = [...appointments]
    .filter((appt) => {
      if (!filterDate) return true;
      return appt.appointmentDate === filterDate;
    })
    .sort((a, b) => {
      if (a.appointmentDate !== b.appointmentDate) {
        return a.appointmentDate.localeCompare(b.appointmentDate);
      }
      return a.appointmentTime.localeCompare(b.appointmentTime);
    });

    const today = getIsraelToday();

const totalAppointments = appointments.length;

const todayAppointmentsCount = appointments.filter(
  (a) => a.appointmentDate === today
).length;

const getAppointmentStatus = (date, time) => {
  const now = new Date();
  const appointmentDateTime = new Date(`${date}T${time}`);

  return appointmentDateTime < now ? "Completed" : "Upcoming";
};

const upcomingAppointmentsCount = appointments.filter(
  (a) => getAppointmentStatus(a.appointmentDate, a.appointmentTime) === "Upcoming"
).length;

const completedAppointmentsCount = appointments.filter(
  (a) => getAppointmentStatus(a.appointmentDate, a.appointmentTime) === "Completed"
).length;

const fetchScheduleSettings = async () => {
  try {
    const workingRes = await fetch("https://barber-shop-demo.onrender.com/api/settings/working-days");
    const workingData = await workingRes.json();
    setWorkingDays(workingData);

    const offRes = await fetch("https://barber-shop-demo.onrender.com/api/settings/off-days");
    const offData = await offRes.json();
    setOffDays(offData);
  } catch (error) {
    console.error("Error fetching schedule settings:", error);
  }
};






  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://barber-shop-demo.onrender.com/api/appointments", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchScheduleSettings();
  }, []);


const handleToggleWorkingDay = async (id, enabled) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "https://barber-shop-demo.onrender.com/api/settings/working-days/" + id + "?enabled=" + !enabled,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (response.ok) {
      fetchScheduleSettings();
    } else {
      alert("Failed to update working day");
    }
  } catch (error) {
    console.error(error);
  }
};


const handleAddOffDay = async () => {
  if (!newOffDay) return;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "https://barber-shop-demo.onrender.com/api/settings/off-days?date=" + newOffDay,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (response.ok) {
      setNewOffDay("");
      fetchScheduleSettings();
    } else {
      const error = await response.text();
      alert(error);
    }
  } catch (error) {
    console.error(error);
  }
};

const handleDeleteOffDay = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "https://barber-shop-demo.onrender.com/api/settings/off-days/" + id,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (response.ok) {
      fetchScheduleSettings();
    } else {
      alert("Failed to delete off day");
    }
  } catch (error) {
    console.error(error);
  }
};


  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

const response = await fetch(
  `https://barber-shop-demo.onrender.com/api/appointments/${id}`,
  {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  }
);
      if (response.ok) {
        setAppointments(appointments.filter((item) => item.id !== id));
      } else {
        alert("Failed to delete appointment");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        role={role}
        setIsLoggedIn={setIsLoggedIn}
        setRole={setRole}
      />

      <section className="section appointments-list">
        <div className="section-content">
          <h2>All Appointments</h2>

        <div className="filter-bar">
  <label>Filter by date</label>
  <input
    type="date"
    className="filter-date-input"
    value={filterDate}
    onChange={(e) => setFilterDate(e.target.value)}
  />
  <button type="button" onClick={() => setFilterDate("")}>
    Clear
  </button>
</div>
<div className="summary-cards">
  <div className="summary-card">
    <h3>Total</h3>
    <p>{totalAppointments}</p>
  </div>

  <div className="summary-card">
    <h3>Today</h3>
    <p>{todayAppointmentsCount}</p>
  </div>

  <div className="summary-card">
    <h3>Upcoming</h3>
    <p>{upcomingAppointmentsCount}</p>
  </div>

  <div className="summary-card">
    <h3>Completed</h3>
    <p>{completedAppointmentsCount}</p>
  </div>
</div>


<div className="schedule-settings">
  <h3>Working Days Settings</h3>

  <div className="working-days-grid">
    {workingDays.map((day) => (
      <label key={day.id} className="working-day-card">
        <input
          type="checkbox"
          checked={day.enabled}
          onChange={() => handleToggleWorkingDay(day.id, day.enabled)}
        />
        <span>{day.dayOfWeek}</span>
      </label>
    ))}
  </div>

  <h3>Off Days</h3>

  <div className="off-day-form">
    <input
      type="date"
      value={newOffDay}
      onChange={(e) => setNewOffDay(e.target.value)}
    />
    <button type="button" onClick={handleAddOffDay}>
      Add Off Day
    </button>
  </div>

  <div className="off-days-list">
    {offDays.length === 0 ? (
      <p>No off days yet</p>
    ) : (
      offDays.map((off) => (
        <div key={off.id} className="off-day-item">
          <span>{off.date}</span>
          <button type="button" onClick={() => handleDeleteOffDay(off.id)}>
            Delete
          </button>
        </div>
      ))
    )}
  </div>
</div>




          <table className="appointments-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

           <tbody>
  {filteredAppointments.length === 0 ? (
    <tr>
      <td colSpan="7" style={{ textAlign: "center" }}>
        No appointments found
      </td>
    </tr>
  ) : (
    filteredAppointments.map((appt, index) => (
    <tr key={appt.id}>
  <td>{index + 1}</td>
  <td>{appt.fullName}</td>
  <td>{appt.phoneNumber}</td>
  <td>{appt.service}</td>
  <td>{appt.appointmentDate}</td>
  <td>{appt.appointmentTime}</td>

  <td>
    <span
      className={
        getAppointmentStatus(appt.appointmentDate, appt.appointmentTime) === "Completed"
          ? "status completed"
          : "status upcoming"
      }
    >
      {getAppointmentStatus(appt.appointmentDate, appt.appointmentTime)}
    </span>
  </td>

  <td>
    <button
      className="action-btn delete-btn"
      onClick={() => handleDelete(appt.id)}
    >
      Delete
    </button>
  </td>
</tr>
    ))
  )}
</tbody>
          </table>
        </div>
      </section>
    </>
  );
}