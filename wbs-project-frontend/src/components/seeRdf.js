import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";

const SeeRdf = (props) => {
    const [rdf, setRdf] = useState();

    const history = useHistory();

    useEffect(() => {
        if (!props.person.firstName) {
            history.goBack();
            history.goBack();
        } else {
            setRdf(generateRdf(props.person));
        }
    }, [props]);

    const generateRdf = (currentFoafProfile) => {
        const N3 = require('n3');
        const sha1 = require('sha1');

        const {DataFactory} = N3;
        const {namedNode, literal} = DataFactory;
        const writer = new N3.Writer(
            {
                prefixes: {
                    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
                    foaf: "http://xmlns.com/foaf/0.1/"
                }
            });
        let personalProfileDocumentUri;
        if (currentFoafProfile.hashedEmail) {
            personalProfileDocumentUri = "http://localhost:8080/foaf/profile/rdf/" + currentFoafProfile.hashedEmail;
        } else {
            personalProfileDocumentUri = "http://localhost:8080/foaf/profile/rdf/" + sha1(currentFoafProfile.email);
        }
        const personUri = personalProfileDocumentUri + "#me";

        writer.addQuad(
            namedNode(personalProfileDocumentUri),
            namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
            namedNode("http://xmlns.com/foaf/0.1/PersonalProfileDocument")
        );
        writer.addQuad(
            namedNode(personalProfileDocumentUri),
            namedNode("http://xmlns.com/foaf/0.1/maker"),
            namedNode(personUri)
        );
        writer.addQuad(
            namedNode(personalProfileDocumentUri),
            namedNode("http://xmlns.com/foaf/0.1/primaryTopic"),
            namedNode(personUri)
        );
        writer.addQuad(
            namedNode(personUri),
            namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
            namedNode("http://xmlns.com/foaf/0.1/Person")
        );
        if (currentFoafProfile.title) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/title"),
                literal(currentFoafProfile.title)
            );
        }
        writer.addQuad(
            namedNode(personUri),
            namedNode("http://xmlns.com/foaf/0.1/firstName"),
            literal(currentFoafProfile.firstName)
        );
        writer.addQuad(
            namedNode(personUri),
            namedNode("http://xmlns.com/foaf/0.1/lastName"),
            literal(currentFoafProfile.lastName)
        );
        if (currentFoafProfile.nickname) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/nickname"),
                literal(currentFoafProfile.nickname)
            );
        }
        if (currentFoafProfile.gender) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/gender"),
                literal(currentFoafProfile.gender)
            );
        }
        if (currentFoafProfile.basedNear) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/based_near"),
                namedNode(currentFoafProfile.basedNear)
            );
        }
        if (currentFoafProfile.image) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/img"),
                namedNode(currentFoafProfile.image)
            );
        }
        if (currentFoafProfile.email) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/mbox"),
                namedNode(currentFoafProfile.email)
            );
        }
        if (currentFoafProfile.hashedEmail) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/mbox_sha1sum"),
                literal(currentFoafProfile.hashedEmail)
            );
        }
        if (currentFoafProfile.homepage) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/homepage"),
                namedNode(currentFoafProfile.homepage)
            );
        }
        if (currentFoafProfile.phone) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/phone"),
                namedNode(currentFoafProfile.phone)
            );
        }
        for (let i = 0; i < currentFoafProfile.schools.length; i++) {
            if (currentFoafProfile.schools[i]) {
                writer.addQuad(
                    namedNode(personUri),
                    namedNode("http://xmlns.com/foaf/0.1/schoolHomepage"),
                    namedNode(currentFoafProfile.schools[i])
                );
            }
        }
        if (currentFoafProfile.workplaceHomepage) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/workplaceHomepage"),
                namedNode(currentFoafProfile.workplaceHomepage)
            );
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/workInfoHomepage"),
                namedNode(currentFoafProfile.workInfoHomepage)
            );
        }
        for (let i = 0; i < currentFoafProfile.publications.length; i++) {
            if (currentFoafProfile.publications[i]) {
                writer.addQuad(
                    namedNode(personUri),
                    namedNode("http://xmlns.com/foaf/0.1/publications"),
                    namedNode(currentFoafProfile.publications[i])
                );
            }
        }
        for (let i = 0; i < currentFoafProfile.accounts.length; i++) {
            if (currentFoafProfile.accounts[i]) {
                writer.addQuad(
                    namedNode(personUri),
                    namedNode("http://xmlns.com/foaf/0.1/account"),
                    namedNode(currentFoafProfile.accounts[i])
                );
            }
        }
        for (let i = 0; i < currentFoafProfile.peopleYouKnow.length; i++) {
            if (currentFoafProfile.peopleYouKnow[i]) {
                writer.addQuad(
                    namedNode(personUri),
                    namedNode("http://xmlns.com/foaf/0.1/knows"),
                    writer.blank([{
                        predicate: namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
                        object: namedNode("http://xmlns.com/foaf/0.1/Person"),
                    }, {
                        predicate: namedNode("http://www.w3.org/2000/01/rdf-schema#seeAlso"),
                        object: namedNode(currentFoafProfile.peopleYouKnow[i]),
                    }])
                );
            }
        }

        let rdf = null;
        writer.end((error, result) => {
            rdf = result;
        });
        return rdf;
    }

    const copy = () => {
        navigator.clipboard.writeText(rdf);
    }

    return (
        <div className="container d-flex h-100">
            <div className="row mx-auto align-self-center w-100">
                <div className="col-md-12 col-lg-10 col-xl-8 mx-auto">
                    <div className="text-right">
                        <button className="btn btn-outline-dark mb-2 ml-2" title="Copy" onClick={copy}>
                            <i className="fa fa-copy"/>
                        </button>
                        <button className="btn btn-outline-dark mb-2 ml-2" title="Back" onClick={history.goBack}>
                            <i className="fa fa-arrow-left"/>
                        </button>
                    </div>
                    <textarea id="rdf-textarea" defaultValue={rdf}
                              className="form-control mb-4" rows="17"
                              disabled/>
                </div>
            </div>
        </div>
    );
}

export default SeeRdf;
