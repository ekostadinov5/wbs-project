package mk.ukim.finki.wbsproject.model;

import lombok.Data;
import mk.ukim.finki.wbsproject.model.exception.InvalidTokenException;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Data
public class ConfirmationToken {
    public enum Type {
        CREATE, UPDATE, DELETE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(unique = true)
    private String token;

    private String personUri;

    @Lob
    private String rdf;

    private Boolean valid;

    public ConfirmationToken() {}

    public ConfirmationToken(String personUri, String rdf) {
        this.token = UUID.randomUUID().toString();
        this.personUri = personUri;
        this.rdf = rdf;
        this.valid = true;
    }

    public Type getType() {
        if (this.personUri == null && this.rdf == null) {
            throw new InvalidTokenException();
        } else if (this.personUri == null) {
            return Type.CREATE;
        } else if (this.rdf == null) {
            return Type.DELETE;
        } else {
            return Type.UPDATE;
        }
    }

    public void invalidate() {
        this.valid = false;
    }

}
