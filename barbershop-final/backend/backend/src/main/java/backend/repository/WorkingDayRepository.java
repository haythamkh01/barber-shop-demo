package backend.repository;

import backend.entity.WorkingDay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.Optional;

public interface WorkingDayRepository extends JpaRepository<WorkingDay, Long> {
    Optional<WorkingDay> findByDayOfWeek(DayOfWeek dayOfWeek);
}