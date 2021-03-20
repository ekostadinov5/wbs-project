package mk.ukim.finki.wbsproject.repository.impl;

import mk.ukim.finki.wbsproject.model.dto.PersonDto;
import mk.ukim.finki.wbsproject.repository.FoafProfileRepository;
import org.apache.commons.io.IOUtils;
import org.apache.jena.query.*;
import org.apache.jena.rdf.model.*;
import org.apache.jena.rdf.model.impl.PropertyImpl;
import org.apache.jena.rdf.model.impl.ResourceImpl;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.riot.RDFFormat;
import org.apache.jena.riot.RDFParser;
import org.apache.jena.tdb.TDBFactory;
import org.apache.jena.vocabulary.RDF;
import org.springframework.stereotype.Repository;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Repository
public class JenaFoafProfileRepository implements FoafProfileRepository {
    private static final String FOAF_NS = "http://xmlns.com/foaf/0.1/";
    private static final String DIRECTORY  = "db/dataset";

    private final Dataset dataset;

    public JenaFoafProfileRepository() {
        this.dataset = TDBFactory.createDataset(DIRECTORY);
    }

    private PersonDto mapRdfToPerson(ResultSet rs) {
        PersonDto personDto = new PersonDto();
        while (rs.hasNext()) {
            QuerySolution querySolution = rs.nextSolution();
            String predicate = querySolution.get("p").toString();
            String object = querySolution.get("o").toString();
            if (predicate.equals(FOAF_NS + "title")) {
                personDto.setTitle(object);
            }
            if (predicate.equals(FOAF_NS + "firstName")) {
                personDto.setFirstName(object);
            }
            if (predicate.equals(FOAF_NS + "lastName")) {
                personDto.setLastName(object);
            }
            if (predicate.equals(FOAF_NS + "nickname")) {
                personDto.setNickname(object);
            }
            if (predicate.equals(FOAF_NS + "gender")) {
                personDto.setGender(object);
            }
            if (predicate.equals(FOAF_NS + "based_near")) {
                personDto.setBasedNear(object);
            }
            if (predicate.equals(FOAF_NS + "img")) {
                personDto.setImage(object);
            }
            if (predicate.equals(FOAF_NS + "mbox")) {
                personDto.setEmail(object);
            }
            if (predicate.equals(FOAF_NS + "mbox_sha1sum")) {
                personDto.setHashedEmail(object);
            }
            if (predicate.equals(FOAF_NS + "homepage")) {
                personDto.setHomepage(object);
            }
            if (predicate.equals(FOAF_NS + "phone")) {
                personDto.setPhone(object);
            }
            if (predicate.equals(FOAF_NS + "schoolHomepage")) {
                personDto.getSchools().add(object);
            }
            if (predicate.equals(FOAF_NS + "workplaceHomepage")) {
                personDto.setWorkplaceHomepage(object);
            }
            if (predicate.equals(FOAF_NS + "workInfoHomepage")) {
                personDto.setWorkInfoHomepage(object);
            }
            if (predicate.equals(FOAF_NS + "publications")) {
                personDto.getPublications().add(object);
            }
            if (predicate.equals(FOAF_NS + "account")) {
                personDto.getAccounts().add(object);
            }
            if (predicate.equals(FOAF_NS + "knows")) {
                Resource resource = querySolution.get("o").asResource();
                Statement statement = resource.getProperty(
                        new PropertyImpl("http://www.w3.org/2000/01/rdf-schema#seeAlso")
                );
                String friendProfileUri = statement.getObject().toString();
                personDto.getPeopleYouKnow().add(friendProfileUri);
            }
        }
        return personDto;
    }

    private Statement getFirstNameStatement(Resource friend) {
        Statement firstNameStatement = friend.getProperty(new PropertyImpl(FOAF_NS + "firstName"));
        if (firstNameStatement == null) {
            firstNameStatement = friend.getProperty(new PropertyImpl(FOAF_NS + "givenName"));
        }
        if (firstNameStatement == null) {
            firstNameStatement = friend.getProperty(new PropertyImpl(FOAF_NS + "givenname"));
        }
        return firstNameStatement;
    }

    private Statement getLastNameStatement(Resource friend) {
        Statement lastNameStatement = friend.getProperty(new PropertyImpl(FOAF_NS + "lastName"));
        if (lastNameStatement == null) {
            lastNameStatement = friend.getProperty(new PropertyImpl(FOAF_NS + "familyName"));
        }
        if (lastNameStatement == null) {
            lastNameStatement = friend.getProperty(new PropertyImpl(FOAF_NS + "family_name"));
        }
        return lastNameStatement;
    }

    private PersonDto.Friend mapRdfToFriend(String friendProfileUri) {
        Model friendModel = ModelFactory.createDefaultModel();
        try {
            RDFParser.source(friendProfileUri)
                    .httpAccept("text/turtle")
                    .parse(friendModel.getGraph());
        } catch (Exception e1) {
            e1.printStackTrace();
            try {
                friendModel.read(friendProfileUri, "", "TTL");
            } catch (Exception e2) {
                e2.printStackTrace();
            }
        }

//        String queryString = String.format(
//                "SELECT DISTINCT ?f WHERE { <%s> <%s> ?f . }",
//                friendProfileUri,
//                FOAF_NS + "primaryTopic"
//        );
//        Query query = QueryFactory.create(queryString);
//        Resource friend = null;
//        try {
//            QueryExecution execution = QueryExecutionFactory.create(query, friendModel);
//            ResultSet rs = execution.execSelect();
//            friend = rs.nextSolution().getResource("f");
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
        StmtIterator iterator = friendModel.listStatements(
                new SimpleSelector(
                        null,
                        new PropertyImpl(FOAF_NS + "primaryTopic"),
                        (RDFNode) null
                )
        );
        Resource friend = null;
        if (iterator.hasNext()) {
            friend = iterator.nextStatement().getResource();
        } else {
            iterator = friendModel.listStatements(
                    new SimpleSelector(null, RDF.type, new ResourceImpl(FOAF_NS + "Person"))
            );
            if (iterator.hasNext()) {
                friend = iterator.nextStatement().getSubject();
            }
        }

        Statement firstNameStatement = null, lastNameStatement = null, imageStatement = null;
        if (friend != null) {
            firstNameStatement = getFirstNameStatement(friend);
            lastNameStatement = getLastNameStatement(friend);
            imageStatement = friend.getProperty(new PropertyImpl(FOAF_NS + "img"));
        }
        String firstName = firstNameStatement != null ? firstNameStatement.getObject().toString() : null;
        String lastName = lastNameStatement != null ? lastNameStatement.getObject().toString() : null;
        String image = imageStatement != null ? imageStatement.getObject().toString() : null;
        return new PersonDto.Friend(friendProfileUri, firstName, lastName, image);
    }

    @Override
    public Optional<String> getPersonalProfileDocumentModel(String personalProfileDocumentUri) {
        Model model;
        String result = null;
        String personUri = personalProfileDocumentUri + "#me";
        String queryString = String.format("DESCRIBE <%s> <%s>", personalProfileDocumentUri, personUri);
        Query query = QueryFactory.create(queryString);
        this.dataset.begin(ReadWrite.READ);
        try (final ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            QueryExecution execution = QueryExecutionFactory.create(query, this.dataset);
            model = execution.execDescribe();
            RDFDataMgr.write(os, model, RDFFormat.TURTLE_PRETTY);
            result = os.toString();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.dataset.end();
        }
        return Optional.ofNullable(result);
    }

    @Override
    public Optional<PersonDto> getPersonByUri(String personUri) {
        PersonDto personDto = null;
        this.dataset.begin(ReadWrite.READ);
        try {
            String queryString = String.format("SELECT ?p ?o WHERE { <%s> ?p ?o . }", personUri);
            Query query = QueryFactory.create(queryString);
            QueryExecution execution = QueryExecutionFactory.create(query, this.dataset);
            ResultSet rs = execution.execSelect();
            if (rs.hasNext()) {
                personDto = mapRdfToPerson(rs);
                personDto.setUri(personUri);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.dataset.end();
        }
        return Optional.ofNullable(personDto);
    }

    @Override
    public Optional<PersonDto> getPerson(String email, String hashedEmail) {
        PersonDto personDto = null;
        String queryString1 = String.format(
                "SELECT ?s WHERE { ?s <%s> <%s> . }",
                FOAF_NS + "mbox",
                email
        );
        String queryString2 = String.format(
                "SELECT ?s WHERE { ?s <%s> \"%s\" . }",
                FOAF_NS + "mbox_sha1sum",
                hashedEmail
        );
        Query query1 = QueryFactory.create(queryString1);
        Query query2 = QueryFactory.create(queryString2);
        this.dataset.begin(ReadWrite.READ);
        try {
            QueryExecution execution = QueryExecutionFactory.create(query1, this.dataset);
            ResultSet rs = execution.execSelect();
            String personUri = "";
            if (rs.hasNext()) {
                personUri = rs.nextSolution().get("s").toString();
            }
            if (personUri.isEmpty()) {
                execution = QueryExecutionFactory.create(query2, this.dataset);
                rs = execution.execSelect();
                if (rs.hasNext()) {
                    personUri = rs.nextSolution().get("s").toString();
                }
            }
            String queryString3 = String.format("SELECT ?p ?o WHERE { <%s> ?p ?o . }", personUri);
            Query query3 = QueryFactory.create(queryString3);
            execution = QueryExecutionFactory.create(query3, this.dataset);
            rs = execution.execSelect();
            if (rs.hasNext()) {
                personDto = mapRdfToPerson(rs);
                personDto.setUri(personUri);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.dataset.end();
        }
        return Optional.ofNullable(personDto);
    }

    @Override
    public Set<PersonDto.Friend> getFriends(List<String> friendProfileUris) {
        return friendProfileUris.stream()
                .map(this::mapRdfToFriend)
                .collect(Collectors.toSet());
    }

    @Override
    public void createFoafProfile(String rdf) {
        this.dataset.begin(ReadWrite.WRITE);
        try {
            Model datasetModel = this.dataset.getDefaultModel();
            InputStream in = IOUtils.toInputStream(rdf,"UTF-8");
            Model model = ModelFactory.createDefaultModel();
            model.read(in, "", "TTL");
            datasetModel.add(model);
            this.dataset.commit();
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            this.dataset.end();
        }
    }

    @Override
    public void updatePerson(String personUri, String rdf) {
        Resource personUriResource = new ResourceImpl(personUri);
        this.dataset.begin(ReadWrite.WRITE);
        try {
            Model datasetModel = dataset.getDefaultModel();
            datasetModel.listStatements(
                    new SimpleSelector(
                            personUriResource,
                            new PropertyImpl(FOAF_NS + "knows"),
                            (RDFNode) null
                    )
            ).forEachRemaining(s -> datasetModel.removeAll(s.getResource(), null, null));
            datasetModel.removeAll(personUriResource, null, null);
            InputStream in = IOUtils.toInputStream(rdf,"UTF-8");
            Model model = ModelFactory.createDefaultModel();
            model.read(in, "", "TTL");
            datasetModel.add(model);
            dataset.commit();
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            dataset.end();
        }
    }

    @Override
    public void deletePerson(String personUri) {
        Resource personUriResource = new ResourceImpl(personUri);
        Resource personalProfileDocumentUriResource = new ResourceImpl(personUri.substring(0, personUri.length() - 3));
        this.dataset.begin(ReadWrite.WRITE);
        try {
            Model datasetModel = dataset.getDefaultModel();
            datasetModel.listStatements(
                    new SimpleSelector(
                            personUriResource,
                            new PropertyImpl(FOAF_NS + "knows"),
                            (RDFNode) null
                    )
            ).forEachRemaining(s -> datasetModel.removeAll(s.getResource(), null, null));
            datasetModel.removeAll(personUriResource, null, null);
            datasetModel.removeAll(personalProfileDocumentUriResource, null, null);
            dataset.commit();
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            dataset.end();
        }
    }

}
