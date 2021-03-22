package mk.ukim.finki.wbsproject.service;

import org.springframework.mail.SimpleMailMessage;

public interface EmailSenderService {

    SimpleMailMessage composeEmail(String to, String from, String subject, String text);

    void sendEmail(SimpleMailMessage email);

    void composeAndSendEmail(String to, String from, String subject, String text);

}
