package mk.ukim.finki.wbsproject.service.impl;

import mk.ukim.finki.wbsproject.model.ConfirmationToken;
import mk.ukim.finki.wbsproject.model.dto.PersonDto;
import mk.ukim.finki.wbsproject.model.exception.InvalidTokenException;
import mk.ukim.finki.wbsproject.model.exception.PersonNotFoundException;
import mk.ukim.finki.wbsproject.model.exception.TokenNotFoundException;
import mk.ukim.finki.wbsproject.repository.ConfirmationTokenRepository;
import mk.ukim.finki.wbsproject.repository.FoafProfileRepository;
import mk.ukim.finki.wbsproject.service.EmailSenderService;
import mk.ukim.finki.wbsproject.service.FoafProfileService;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class FoafProfileServiceImpl implements FoafProfileService {
    private final FoafProfileRepository foafProfileRepository;
    private final ConfirmationTokenRepository confirmationTokenRepository;
    private final EmailSenderService emailSenderService;

    public FoafProfileServiceImpl(FoafProfileRepository foafProfileRepository,
                                  ConfirmationTokenRepository confirmationTokenRepository,
                                  EmailSenderService emailSenderService) {
        this.foafProfileRepository = foafProfileRepository;
        this.confirmationTokenRepository = confirmationTokenRepository;
        this.emailSenderService = emailSenderService;
    }

    @Override
    public String getPersonalProfileDocumentModel(String personalProfileDocumentUri) {
        return this.foafProfileRepository.getPersonalProfileDocumentModel(personalProfileDocumentUri)
                .orElseThrow(PersonNotFoundException::new);
    }

    @Override
    public PersonDto getPersonByUri(String personUri) {
        return foafProfileRepository.getPersonByUri(personUri).orElseThrow(PersonNotFoundException::new);
    }

    @Override
    public PersonDto getPerson(String email, String hashedEmail) {
        return this.foafProfileRepository.getPerson(email, hashedEmail).orElseThrow(PersonNotFoundException::new);
    }

    @Override
    public Set<PersonDto.Friend> getFriends(List<String> friendProfileUris) {
        return this.foafProfileRepository.getFriends(friendProfileUris);
    }

    @Override
    public void createFoafProfile(String rdf) {
        this.foafProfileRepository.createFoafProfile(rdf);
    }

    @Override
    public void updatePerson(String personUri, String rdf) {
        this.foafProfileRepository.updatePerson(personUri, rdf);
    }

    @Override
    public void deletePerson(String personUri) {
        this.foafProfileRepository.deletePerson(personUri);
    }

    @Override
    public void requestEmailConfirmation(String email, String personUri, String rdf) {
        ConfirmationToken confirmationToken = new ConfirmationToken(personUri, rdf);
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(email);
        mailMessage.setFrom("ekostadinov5@gmail.com");

        StringBuilder sb = new StringBuilder();
        if (confirmationToken.getType() == ConfirmationToken.Type.CREATE) {
            mailMessage.setSubject("Create your FOAF profile");
            sb.append("To create your FOAF profile, click on the following link:\n")
                    .append("http://localhost:8080/api/foaf/profile/confirm?token=")
                    .append(confirmationToken.getToken())
                    .append("&email=")
                    .append(email);
        } else if (confirmationToken.getType() == ConfirmationToken.Type.UPDATE) {
            mailMessage.setSubject("Update your FOAF profile");
            sb.append("To update your FOAF profile, click on the following link:\n")
                    .append("http://localhost:8080/api/foaf/profile/confirm?token=")
                    .append(confirmationToken.getToken())
                    .append("&email=")
                    .append(email);;
        } else if (confirmationToken.getType() == ConfirmationToken.Type.DELETE) {
            mailMessage.setSubject("Delete your FOAF profile");
            sb.append("To delete your FOAF profile, click on the following link:\n")
                    .append("http://localhost:8080/api/foaf/profile/confirm?token=")
                    .append(confirmationToken.getToken())
                    .append("&email=");
        }
        mailMessage.setText(sb.toString());
        this.emailSenderService.sendEmail(mailMessage);
        this.confirmationTokenRepository.save(confirmationToken);
    }

    @Override
    @Transactional
    public void confirm(String token) {
        ConfirmationToken confirmationToken =
                this.confirmationTokenRepository.findByToken(token).orElseThrow(TokenNotFoundException::new);
        if (!confirmationToken.getValid()) {
            throw new InvalidTokenException();
        }
        if (confirmationToken.getType() == ConfirmationToken.Type.CREATE) {
            this.createFoafProfile(confirmationToken.getRdf());
        } else if (confirmationToken.getType() == ConfirmationToken.Type.UPDATE) {
            this.updatePerson(confirmationToken.getPersonUri(), confirmationToken.getRdf());
        } else if (confirmationToken.getType() == ConfirmationToken.Type.DELETE) {
            this.deletePerson(confirmationToken.getPersonUri());
        }
        confirmationToken.invalidate();
        this.confirmationTokenRepository.save(confirmationToken);
    }

}
