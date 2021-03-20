package mk.ukim.finki.wbsproject.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
public class PersonDto {

    private String uri;

    private String title;

    private String firstName;

    private String lastName;

    private String nickname;

    private String gender;

    private String basedNear;

    private String image;

    private String email;

    private String hashedEmail;

    private String homepage;

    private String phone;

    private Set<String> schools;

    private String workplaceHomepage;

    private String workInfoHomepage;

    private Set<String> publications;

    public Set<String> accounts;

    private Set<String> peopleYouKnow;

    public PersonDto() {
        this.schools = new HashSet<>();
        this.publications = new HashSet<>();
        this.accounts = new HashSet<>();
        this.peopleYouKnow = new HashSet<>();
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class Friend {

        private String friendUri;

        private String firstName;

        private String lastName;

        private String image;

    }

}
