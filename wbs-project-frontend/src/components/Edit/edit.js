import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {Modal} from "react-bootstrap";
import PersonForm from "../General/personForm";
import {getPerson, generateRdf, personValidationMessage} from "../General/utils";

const Edit = (props) => {
    const [person, setPerson] = useState();
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);

    const history = useHistory();

    useEffect(() => {
        if (!props.person) {
            history.push("/");
        }
        setPerson(props.currentEditedPerson ? props.currentEditedPerson : props.person);
    }, [props]);

    const generateAndShowRdf = () => {
        const currentPerson = getPerson();
        const message = personValidationMessage(currentPerson);
        if (message.length > 0) {
            setMessage(message);
            handleShowMessage();
            return;
        }
        const personalProfileDocumentUri = props.person.uri.slice(0, props.person.uri.length - 3);
        const personUri = props.person.uri;
        currentPerson.personalProfileDocumentUri = personalProfileDocumentUri;
        currentPerson.uri = personUri;
        props.saveCurrentEditedPerson(currentPerson);
        history.push("/viewRdfEdit");
    }

    const editFoafProfile = () => {
        const currentPerson = getPerson();
        const message = personValidationMessage(currentPerson);
        if (message.length > 0) {
            setMessage(message);
            handleShowMessage();
            return;
        }
        const personalProfileDocumentUri = props.person.uri.slice(0, props.person.uri.length - 3);
        const personUri = props.person.uri;
        currentPerson.personalProfileDocumentUri = personalProfileDocumentUri;
        currentPerson.uri = personUri;
        const rdf = generateRdf(currentPerson);
        if (!rdf) {
            return;
        }
        props.editFoafProfile(rdf);
        history.push("/");
    }

    const reset = () => {
        document.getElementById("title").value = props.person.title;
        document.getElementById("firstName").value = props.person.firstName;
        document.getElementById("lastName").value = props.person.lastName;
        document.getElementById("nickname").value = props.person.nickname;
        document.getElementById("gender").value = props.person.gender;
        document.getElementById("basedNear").value = props.person.basedNear;
        document.getElementById("image").value = props.person.image;
        document.getElementById("email").value = props.person.email
        document.getElementById("hashEmail").checked = !!props.person.hashedEmail;
        document.getElementById("homepage").value = props.person.homepage;
        document.getElementById("phone").value = props.person.phone;
        document.getElementById("workplaceHomepage").value = props.person.workplaceHomepage;
        document.getElementById("workInfoHomepage").value = props.person.workInfoHomepage;
        const schoolsDiv = document.getElementById("schools");
        const numSchools = schoolsDiv.children.length - 1;
        for (let i = 0; i < numSchools; i++) {
            if (i < props.person.schools.length) {
                schoolsDiv.children[i].value = props.person.schools[i]
            } else {
                schoolsDiv.children[i].value = ""
            }
        }
        const publicationsDiv = document.getElementById("publications");
        const numPublications = publicationsDiv.children.length - 1;
        for (let i = 0; i < numPublications; i++) {
            if (i < props.person.publications.length) {
                publicationsDiv.children[i].value = props.person.publications[i]
            } else {
                publicationsDiv.children[i].value = ""
            }
        }
        const accountsDiv = document.getElementById("accounts");
        const numAccounts = accountsDiv.children.length - 1;
        for (let i = 0; i < numAccounts; i++) {
            if (i < props.person.accounts.length) {
                accountsDiv.children[i].value = props.person.accounts[i]
            } else {
                accountsDiv.children[i].value = ""
            }
        }
        const peopleYouKnowDiv = document.getElementById("peopleYouKnow");
        const numPeopleYouKnow = peopleYouKnowDiv.children.length - 1;
        for (let i = 0; i < numPeopleYouKnow; i++) {
            if (i < props.person.peopleYouKnow.length) {
                peopleYouKnowDiv.children[i].value = props.person.peopleYouKnow[i]
            } else {
                peopleYouKnowDiv.children[i].value = ""
            }
        }
        setPerson(props.person);
    }

    const back = () => {
        props.reset();
        history.goBack();
    }

    const formHeader = () => {
        return (
            <div className="row">
                <div className="col">
                    <div className="row">
                        <div className="col-9">
                            <div className="h3">
                                Edit your personal FOAF profile
                            </div>
                        </div>
                        <div className="col-3 text-right">
                            <button className="btn btn-outline-dark mb-2 ml-2" title="Reset"
                                    onClick={reset}>
                                <i className="fa fa-undo"/>
                            </button>
                            <button className="btn btn-outline-dark mb-2 ml-2" title="Back"
                                    onClick={back}>
                                <i className="fa fa-arrow-left"/>
                            </button>
                        </div>
                    </div>
                    <hr/>
                </div>
            </div>
        );
    }

    const formFooter = () => {
        return (
            <div className="row mb-5">
                <div className="col-12 col-md-8 col-lg-6 col-xl-4 mx-auto">
                    <button className="btn btn-block btn-secondary mb-4" onClick={generateAndShowRdf}>
                        Generate RDF
                    </button>

                    <button className="btn btn-block btn-primary" onClick={editFoafProfile}>
                        Edit
                    </button>
                </div>
            </div>
        );
    }

    const handleCloseMessage = () => setShowMessage(false);
    const handleShowMessage = () => setShowMessage(true);
    const messageModal = () => {
        return (
            <Modal show={showMessage} onHide={handleCloseMessage} animation={false}>
                <Modal.Body>
                    <div className="my-4 text-break">
                        {message.split("\n").map(line => <p key={line}>{line}</p>)}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-outline-dark" onClick={handleCloseMessage}>
                        Okay
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <>
            <div className="container mt-5">
                {formHeader()}
                <PersonForm person={person} />
                {formFooter()}
            </div>
            {messageModal()}
        </>
    );
}

export default Edit;
