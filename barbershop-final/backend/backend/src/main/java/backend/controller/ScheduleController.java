package backend.controller;

import backend.entity.WorkingDay;
import backend.entity.OffDay;
import backend.service.ScheduleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "http://localhost:5173")
public class ScheduleController {

    private final ScheduleService service;

    public ScheduleController(ScheduleService service) {
        this.service = service;
    }

    @GetMapping("/working-days")
    public List<WorkingDay> getWorkingDays() {
        return service.getWorkingDays();
    }

    @GetMapping("/off-days")
    public List<OffDay> getOffDays() {
        return service.getOffDays();
    }

    @PutMapping("/working-days/{id}")
    public WorkingDay updateWorkingDay(
            @PathVariable Long id,
            @RequestParam boolean enabled
    ) {
        return service.updateWorkingDay(id, enabled);
    }

    @PostMapping("/off-days")
    public OffDay addOffDay(@RequestParam String date) {
        return service.addOffDay(java.time.LocalDate.parse(date));
    }

    @DeleteMapping("/off-days/{id}")
    public void deleteOffDay(@PathVariable Long id) {
        service.deleteOffDay(id);
    }
}