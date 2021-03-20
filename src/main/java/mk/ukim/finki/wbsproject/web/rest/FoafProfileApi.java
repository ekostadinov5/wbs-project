package mk.ukim.finki.wbsproject.web.rest;

import mk.ukim.finki.wbsproject.model.dto.PersonDto;
import mk.ukim.finki.wbsproject.service.EmailSenderService;
import mk.ukim.finki.wbsproject.service.FoafProfileService;
import org.apache.jena.query.*;
import org.apache.jena.tdb.TDBFactory;
import org.springframework.http.HttpStatus;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(path = "/api/foaf/profile", produces = MimeTypeUtils.APPLICATION_JSON_VALUE)
public class FoafProfileApi {
    private final FoafProfileService foafProfileService;

    public FoafProfileApi(FoafProfileService foafProfileService) {
        this.foafProfileService = foafProfileService;
    }

    @GetMapping(path = "/uri")
    public PersonDto getPerson(@RequestHeader String personUri) {
        return this.foafProfileService.getPersonByUri(personUri);
    }

    @GetMapping
    public PersonDto getPerson(@RequestHeader String email,
                               @RequestHeader String hashedEmail) {
        return this.foafProfileService.getPerson(email, hashedEmail);
    }

    @GetMapping("/friend")
    public Set<PersonDto.Friend> getFriend(@RequestHeader List<String> friendProfileUris) {
        return this.foafProfileService.getFriends(friendProfileUris);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createFoafProfile(@RequestHeader String email,
                                  @RequestBody String rdf) {
        this.foafProfileService.requestEmailConfirmation(email, null, rdf);
    }

    @PatchMapping
    public void updatePerson(@RequestHeader String email,
                             @RequestHeader String personUri,
                                  @RequestBody String rdf) {
        this.foafProfileService.requestEmailConfirmation(email, personUri, rdf);
    }

    @DeleteMapping
    public void deletePerson(@RequestHeader String email,
                             @RequestHeader String personUri) {
        this.foafProfileService.requestEmailConfirmation(email, personUri, null);
    }

    @GetMapping(path = "/confirm")
    public void confirm(@RequestParam String token,
                        @RequestParam String email,
                        HttpServletResponse response) {
        this.foafProfileService.confirm(token);
        String locationHeader = "http://localhost:3000";
        if (!email.isEmpty()) {
            locationHeader += "/profile/mailto:" + email;
        }
        response.setHeader("Location", locationHeader);
        response.setStatus(302);
    }

    // For testing
    @GetMapping(path = "/print")
    public void printDatasetModel() {
        Dataset dataset = TDBFactory.createDataset("db/dataset");
        dataset.begin(ReadWrite.READ);
        try {
            dataset.getDefaultModel().write(System.out, "TTL");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            dataset.end();
        }
    }

}
