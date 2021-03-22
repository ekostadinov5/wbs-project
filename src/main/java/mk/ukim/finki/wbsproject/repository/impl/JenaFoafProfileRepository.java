package mk.ukim.finki.wbsproject.repository.impl;

import mk.ukim.finki.wbsproject.model.dto.PersonDto;
import mk.ukim.finki.wbsproject.model.exception.PersonalProfileDocumentNotFoundException;
import mk.ukim.finki.wbsproject.repository.FoafProfileRepository;
import org.apache.commons.io.IOUtils;
import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.params.HttpParams;
import org.apache.jena.query.*;
import org.apache.jena.rdf.model.*;
import org.apache.jena.rdf.model.impl.PropertyImpl;
import org.apache.jena.rdf.model.impl.ResourceImpl;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.riot.RDFFormat;
import org.apache.jena.riot.RDFParser;
import org.apache.jena.riot.web.HttpOp;
import org.apache.jena.tdb.TDBFactory;
import org.apache.jena.vocabulary.RDF;
import org.springframework.stereotype.Repository;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
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

    private String getFirstName(Resource friend) {
        Statement firstNameStatement = null;
        if (friend.hasProperty(new PropertyImpl(FOAF_NS + "firstName"))) {
            firstNameStatement = friend.getProperty(new PropertyImpl(FOAF_NS + "firstName"));
        } else if (friend.hasProperty(new PropertyImpl(FOAF_NS + "givenName"))) {
            firstNameStatement = friend.getProperty(new PropertyImpl(FOAF_NS + "givenName"));
        } else if (friend.hasProperty(new PropertyImpl(FOAF_NS + "givenname"))) {
            firstNameStatement = friend.getProperty(new PropertyImpl(FOAF_NS + "givenname"));
        }
        return firstNameStatement != null ? firstNameStatement.getObject().toString() : null;
    }

    private String getLastName(Resource friend) {
        Statement lastNameStatement = null;
        if (friend.hasProperty(new PropertyImpl(FOAF_NS + "lastName"))) {
            lastNameStatement = friend.getProperty(new PropertyImpl(FOAF_NS + "lastName"));
        } else if (friend.hasProperty(new PropertyImpl(FOAF_NS + "familyName"))) {
            lastNameStatement = friend.getProperty(new PropertyImpl(FOAF_NS + "familyName"));
        } else if (friend.hasProperty(new PropertyImpl(FOAF_NS + "family_name"))) {
            lastNameStatement = friend.getProperty(new PropertyImpl(FOAF_NS + "family_name"));
        }
        return lastNameStatement != null ? lastNameStatement.getObject().toString() : null;
    }

    private String getImage(Resource friend) {
        Statement imageStatement = null;
        if (friend.hasProperty(new PropertyImpl(FOAF_NS + "img"))) {
            imageStatement = friend.getProperty(new PropertyImpl(FOAF_NS + "img"));
        } else if (friend.hasProperty(new PropertyImpl(FOAF_NS + "depiction"))) {
            imageStatement = friend.getProperty(new PropertyImpl(FOAF_NS + "depiction"));
        }
        return imageStatement != null ? imageStatement.getObject().toString() : null;
    }

    private PersonDto.Friend mapRdfToFriend(String friendProfileUri) {
        Model friendModel = ModelFactory.createDefaultModel();
        try {
            friendModel.read(friendProfileUri, "", "TTL");
        } catch (Exception e) {
            e.printStackTrace();
        }
        Resource friend = null;
        NodeIterator nodeIterator = friendModel.listObjectsOfProperty(new PropertyImpl(FOAF_NS + "primaryTopic"));
        if (nodeIterator.hasNext()) {
            friend = nodeIterator.nextNode().asResource();
        } else {
            ResIterator resIterator = friendModel
                    .listSubjectsWithProperty(RDF.type, new ResourceImpl(FOAF_NS + "Person"));
            if (resIterator.hasNext()) {
                friend = resIterator.nextResource();
            }
        }
        String firstName = null, lastName = null, image = null;
        if (friend != null) {
            firstName = getFirstName(friend);
            lastName = getLastName(friend);
            image = getImage(friend);
        }
        return new PersonDto.Friend(friendProfileUri, firstName, lastName, image);
    }

    private void insertRdfIntoModel(String rdf, Model datasetModel) throws IOException {
        InputStream in = IOUtils.toInputStream(rdf,"UTF-8");
        Model model = ModelFactory.createDefaultModel();
        model.read(in, "", "TTL");
        datasetModel.add(model);
    }

    private void deletePersonFromModel(Resource personUriResource, Resource personalProfileDocumentUriResource,
                                       Model datasetModel) {
        datasetModel.listStatements(
                new SimpleSelector(
                        personUriResource,
                        new PropertyImpl(FOAF_NS + "knows"),
                        (RDFNode) null
                )
        ).forEachRemaining(s -> datasetModel.removeAll(s.getResource(), null, null));
        datasetModel.removeAll(personUriResource, null, null);
        datasetModel.removeAll(personalProfileDocumentUriResource, null, null);
    }

    @Override
    public Optional<String> getPersonalProfileDocument(String personalProfileDocumentUri) {
        String result = null;
        String personUri = personalProfileDocumentUri + "#me";
        String queryString = String.format("DESCRIBE <%s> <%s>", personalProfileDocumentUri, personUri);
        Query query = QueryFactory.create(queryString);
        this.dataset.begin(ReadWrite.READ);
        try (final ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            QueryExecution execution = QueryExecutionFactory.create(query, this.dataset);
            Model model = execution.execDescribe();
            if (model.isEmpty()) {
                throw new PersonalProfileDocumentNotFoundException();
            }
            RDFDataMgr.write(os, model, RDFFormat.TURTLE_PRETTY);
            result = os.toString();
        } catch (PersonalProfileDocumentNotFoundException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.dataset.end();
        }
        return Optional.ofNullable(result);
    }

    @Override
    public Optional<PersonDto> getPerson(String personUri) {
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
            this.insertRdfIntoModel(rdf, datasetModel);
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
        Resource personalProfileDocumentUriResource = new ResourceImpl(personUri.substring(0, personUri.length() - 3));
        this.dataset.begin(ReadWrite.WRITE);
        try {
            Model datasetModel = dataset.getDefaultModel();
            this.deletePersonFromModel(personUriResource, personalProfileDocumentUriResource, datasetModel);
            this.insertRdfIntoModel(rdf, datasetModel);
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
            this.deletePersonFromModel(personUriResource, personalProfileDocumentUriResource, datasetModel);
            dataset.commit();
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            dataset.end();
        }
    }

}
