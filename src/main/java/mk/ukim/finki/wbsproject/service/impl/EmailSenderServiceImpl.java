package mk.ukim.finki.wbsproject.service.impl;

import mk.ukim.finki.wbsproject.service.EmailSenderService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderServiceImpl implements EmailSenderService {
    private final JavaMailSender javaMailSender;

    public EmailSenderServiceImpl(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Override
    public SimpleMailMessage composeEmail(String to, String from, String subject, String text) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(to);
        mailMessage.setFrom(from);
        mailMessage.setSubject(subject);
        mailMessage.setText(text);
        return mailMessage;
    }

    @Override
    public void sendEmail(SimpleMailMessage email) {
        javaMailSender.send(email);
    }

    @Override
    public void composeAndSendEmail(String to, String from, String subject, String text) {
        SimpleMailMessage mailMessage = composeEmail(to, from, subject, text);
        this.sendEmail(mailMessage);
    }

}
