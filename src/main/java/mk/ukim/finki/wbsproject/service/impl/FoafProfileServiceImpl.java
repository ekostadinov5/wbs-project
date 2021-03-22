package mk.ukim.finki.wbsproject.service.impl;

import mk.ukim.finki.wbsproject.model.ConfirmationToken;
import mk.ukim.finki.wbsproject.model.dto.PersonDto;
import mk.ukim.finki.wbsproject.model.exception.InvalidTokenException;
import mk.ukim.finki.wbsproject.model.exception.PersonNotFoundException;
import mk.ukim.finki.wbsproject.model.exception.PersonalProfileDocumentNotFoundException;
import mk.ukim.finki.wbsproject.repository.ConfirmationTokenRepository;
import mk.ukim.finki.wbsproject.repository.FoafProfileRepository;
import mk.ukim.finki.wbsproject.service.EmailSenderService;
import mk.ukim.finki.wbsproject.service.FoafProfileService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailMessage;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;
import java.util.List;
import java.util.Set;

@Service
public class FoafProfileServiceImpl implements FoafProfileService {
    @Value("${app.wbs-project.backend-endpoint}")
    private String BACKEND_ENDPOINT;
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
    public String getPersonalProfileDocument(String personalProfileDocumentUri) {
        return this.foafProfileRepository.getPersonalProfileDocument(personalProfileDocumentUri)
                .orElseThrow(PersonalProfileDocumentNotFoundException::new);
    }

    @Override
    public PersonDto getPerson(String personUri) {
        return foafProfileRepository.getPerson(personUri).orElseThrow(PersonNotFoundException::new);
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
    @Transactional
    @Async
    public void requestEmailConfirmation(String email, String personUri, String rdf) {
        ConfirmationToken confirmationToken = new ConfirmationToken(personUri, rdf);
        String from = "ekostadinov5@gmail.com";
        String subject = null;
        String text;

        StringBuilder sb = new StringBuilder();
        if (confirmationToken.getType() == ConfirmationToken.Type.CREATE) {
            subject = "Create your FOAF profile";
            String base64Email = Base64.getEncoder().encodeToString(("mailto:" + email).getBytes());
            sb.append("To create your FOAF profile, click on the following link:\n")
                    .append(BACKEND_ENDPOINT)
                    .append("/api/foaf/profile/confirm?token=")
                    .append(confirmationToken.getToken())
                    .append("&b64e=")
                    .append(base64Email);
        } else if (confirmationToken.getType() == ConfirmationToken.Type.UPDATE) {
            subject = "Update your FOAF profile";
            String base64Email = Base64.getEncoder().encodeToString(("mailto:" + email).getBytes());
            sb.append("To update your FOAF profile, click on the following link:\n")
                    .append(BACKEND_ENDPOINT)
                    .append("/api/foaf/profile/confirm?token=")
                    .append(confirmationToken.getToken())
                    .append("&b64e=")
                    .append(base64Email);;
        } else if (confirmationToken.getType() == ConfirmationToken.Type.DELETE) {
            subject = "Delete your FOAF profile";
            sb.append("To delete your FOAF profile, click on the following link:\n")
                    .append(BACKEND_ENDPOINT)
                    .append("/api/foaf/profile/confirm?token=")
                    .append(confirmationToken.getToken())
                    .append("&b64e=");
        }
        text = sb.toString();
        this.confirmationTokenRepository.save(confirmationToken);
        this.emailSenderService.composeAndSendEmail(email, from, subject, text);
    }

    @Override
    @Transactional
    public void confirm(String token) {
        ConfirmationToken confirmationToken =
                this.confirmationTokenRepository.findByToken(token).orElseThrow(InvalidTokenException::new);

        if (!confirmationToken.isValid()) {
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
