package mk.ukim.finki.wbsproject.service;

import mk.ukim.finki.wbsproject.model.dto.PersonDto;

import java.util.List;
import java.util.Set;

public interface FoafProfileService {

    String getPersonalProfileDocument(String personalProfileDocumentUri);

    PersonDto getPerson(String personUri);

    Set<PersonDto.Friend> getFriends(List<String> friendProfileUris);

    void createFoafProfile(String rdf);

    void updatePerson(String personUri, String rdf);

    void deletePerson(String personUri);

    void requestEmailConfirmation(String email, String personUri, String rdf);

    void confirm(String token);

}
