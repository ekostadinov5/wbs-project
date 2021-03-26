package mk.ukim.finki.wbsproject.service.impl;

import mk.ukim.finki.wbsproject.repository.SuperuserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class SuperuserDetailsService implements UserDetailsService {
    private final SuperuserRepository superuserRepository;

    public SuperuserDetailsService(SuperuserRepository superuserRepository) {
        this.superuserRepository = superuserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        return superuserRepository.findByUsername(s);
    }

}
