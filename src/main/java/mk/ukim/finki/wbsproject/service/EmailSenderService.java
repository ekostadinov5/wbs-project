package mk.ukim.finki.wbsproject.service;

import org.springframework.mail.SimpleMailMessage;

public interface EmailSenderService {

    void sendEmail(SimpleMailMessage email);

}
