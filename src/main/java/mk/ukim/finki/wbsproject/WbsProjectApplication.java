package mk.ukim.finki.wbsproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class WbsProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(WbsProjectApplication.class, args);
    }

}
