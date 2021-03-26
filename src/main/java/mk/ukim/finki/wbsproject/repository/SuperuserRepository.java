package mk.ukim.finki.wbsproject.repository;

import mk.ukim.finki.wbsproject.model.Superuser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SuperuserRepository extends JpaRepository<Superuser, Long> {

    Superuser findByUsername(String username);

}
