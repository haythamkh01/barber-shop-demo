package backend.auth.config;

import backend.auth.entity.User;
import backend.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    public CommandLineRunner initAdmin(UserRepository userRepository,
                                       BCryptPasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@barber.com";

            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                User admin = new User();
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("123456"));
                admin.setRole("ADMIN");

                userRepository.save(admin);
                System.out.println("Admin user created successfully.");
            }
        };
    }
}