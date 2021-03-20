package mk.ukim.finki.wbsproject.repository;

import mk.ukim.finki.wbsproject.model.dto.PersonDto;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface FoafProfileRepository {

    Optional<String> getPersonalProfileDocumentModel(String personalProfileDocumentUri);

    Optional<PersonDto> getPersonByUri(String personUri);

    Optional<PersonDto> getPerson(String email, String hashedEmail);

    Set<PersonDto.Friend> getFriends(List<String> friendProfileUris);

    void createFoafProfile(String rdf);

    void updatePerson(String personUri, String rdf);

    void deletePerson(String personUri);

}
