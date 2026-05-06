package backend.service;

import backend.entity.OffDay;
import backend.entity.WorkingDay;
import backend.repository.OffDayRepository;
import backend.repository.WorkingDayRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Service
public class ScheduleService {

    private final WorkingDayRepository workingRepo;
    private final OffDayRepository offRepo;

    public ScheduleService(WorkingDayRepository workingRepo, OffDayRepository offRepo) {
        this.workingRepo = workingRepo;
        this.offRepo = offRepo;
    }

    public void validateDate(LocalDate date) {

        DayOfWeek day = date.getDayOfWeek();

        boolean isWorking = workingRepo.findByDayOfWeek(day)
                .map(WorkingDay::isEnabled)
                .orElse(false);

        if (!isWorking) {
            throw new RuntimeException("Shop is closed this day");
        }

        if (offRepo.existsByDate(date)) {
            throw new RuntimeException("This day is OFF");
        }
    }
    public List<WorkingDay> getWorkingDays() {
        return workingRepo.findAll();
    }

    public List<OffDay> getOffDays() {
        return offRepo.findAll();
    }

    public WorkingDay updateWorkingDay(Long id, boolean enabled) {
        WorkingDay day = workingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Working day not found"));

        day.setEnabled(enabled);
        return workingRepo.save(day);
    }

    public OffDay addOffDay(LocalDate date) {
        if (offRepo.existsByDate(date)) {
            throw new RuntimeException("This off day already exists");
        }

        OffDay offDay = new OffDay();
        offDay.setDate(date);

        return offRepo.save(offDay);
    }

    public void deleteOffDay(Long id) {
        offRepo.deleteById(id);
    }
}
