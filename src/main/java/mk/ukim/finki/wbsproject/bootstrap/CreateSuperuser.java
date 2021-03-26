package mk.ukim.finki.wbsproject.bootstrap;

import mk.ukim.finki.wbsproject.model.Superuser;
import mk.ukim.finki.wbsproject.repository.SuperuserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
public class CreateSuperuser {
    private final SuperuserRepository superuserRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public CreateSuperuser(SuperuserRepository superuserRepository) {
        this.superuserRepository = superuserRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @PostConstruct
    public void createSuperuser() {
        if (this.superuserRepository.count() == 0) {
            Superuser superuser = new Superuser();
            superuser.setUsername("superuser");
            superuser.setPassword(this.passwordEncoder.encode("superuser123$"));
            this.superuserRepository.save(superuser);
        }
    }

}
