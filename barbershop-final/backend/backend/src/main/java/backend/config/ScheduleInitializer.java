package backend.config;

import backend.entity.WorkingDay;
import backend.repository.WorkingDayRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.DayOfWeek;

@Configuration
public class ScheduleInitializer {

    @Bean
    public CommandLineRunner initWorkingDays(WorkingDayRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                for (DayOfWeek day : DayOfWeek.values()) {
                    WorkingDay wd = new WorkingDay();
                    wd.setDayOfWeek(day);

                    // الجمعة والسبت مغلق
                    wd.setEnabled(day != DayOfWeek.FRIDAY && day != DayOfWeek.SATURDAY);

                    repo.save(wd);
                }
            }
        };
    }
}