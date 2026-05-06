package backend.service;

import backend.entity.Appointment;
import backend.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final ScheduleService scheduleService;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              ScheduleService scheduleService) {
        this.appointmentRepository = appointmentRepository;
        this.scheduleService = scheduleService;
    }
    public Appointment createAppointment(Appointment appointment) {

        // 🔥 1. منع الحجز في أيام مغلقة / OFF
        scheduleService.validateDate(
                LocalDate.parse(appointment.getAppointmentDate())
        );

        // 🔥 2. منع تكرار نفس الوقت
        Optional<Appointment> existingAppointment =
                appointmentRepository.findByAppointmentDateAndAppointmentTime(
                        appointment.getAppointmentDate(),
                        appointment.getAppointmentTime()
                );

        if (existingAppointment.isPresent()) {
            throw new RuntimeException("This time slot is already booked.");
        }

        // 🔥 3. حفظ الحجز
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointmentsByDate(String appointmentDate) {
        return appointmentRepository.findByAppointmentDate(appointmentDate);
    }
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAllByOrderByAppointmentDateAscAppointmentTimeAsc();
    }
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}