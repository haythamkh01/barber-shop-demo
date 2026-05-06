package backend.repository;

import backend.entity.OffDay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface OffDayRepository extends JpaRepository<OffDay, Long> {
    boolean existsByDate(LocalDate date);
}