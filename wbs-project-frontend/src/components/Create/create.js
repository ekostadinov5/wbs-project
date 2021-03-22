import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {Modal} from "react-bootstrap";
import PersonForm from "../General/personForm";
import {getPerson, generateRdf, personValidationMessage} from "../General/utils";

const Create = (props) => {
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);

    const history = useHistory();

    const generateAndShowRdf = () => {
        const currentPerson = getPerson();
        const message = personValidationMessage(currentPerson);
        if (message.length > 0) {
            setMessage(message);
            handleShowMessage();
            return;
        }
        const personalProfileDocumentUri =
            process.env.REACT_APP_BACKEND_ENDPOINT + "/foaf/profile/rdf/" + currentPerson.hashedEmail;
        const personUri = personalProfileDocumentUri + "#me";
        currentPerson.personalProfileDocumentUri = personalProfileDocumentUri;
        currentPerson.uri = personUri;
        props.saveCurrentCreatedPerson(currentPerson);
        history.push("/viewRdfCreate");
    }

    const createFoafProfile = () => {
        const currentPerson = getPerson();
        const message = personValidationMessage(currentPerson);
        if (message.length > 0) {
            setMessage(message);
            handleShowMessage();
            return;
        }
        const personalProfileDocumentUri =
            process.env.REACT_APP_BACKEND_ENDPOINT + "/foaf/profile/rdf/" + currentPerson.hashedEmail;
        const personUri = personalProfileDocumentUri + "#me";
        currentPerson.personalProfileDocumentUri = personalProfileDocumentUri;
        currentPerson.uri = personUri;
        const rdf = generateRdf(currentPerson);
        if (!rdf) {
            return;
        }
        props.createFoafProfile(currentPerson.email, rdf);
        history.push("/");
    }

    const reset = () => {
        document.getElementById("title").value = "";
        document.getElementById("firstName").value = "";
        document.getElementById("lastName").value = "";
        document.getElementById("nickname").value = "";
        document.getElementById("gender").value = "";
        document.getElementById("basedNear").value = "";
        document.getElementById("image").value = "";
        document.getElementById("email").value = "";
        document.getElementById("hashEmail").checked = true;
        document.getElementById("homepage").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("workplaceHomepage").value = "";
        document.getElementById("workInfoHomepage").value = "";
        const schoolsDiv = document.getElementById("schools");
        const numSchools = schoolsDiv.children.length - 1;
        for (let i = 0; i < numSchools; i++) {
            schoolsDiv.children[i].value = ""
        }
        const publicationsDiv = document.getElementById("publications");
        const numPublications = publicationsDiv.children.length - 1;
        for (let i = 0; i < numPublications; i++) {
            publicationsDiv.children[i].value = ""
        }
        const accountsDiv = document.getElementById("accounts");
        const numAccounts = accountsDiv.children.length - 1;
        for (let i = 0; i < numAccounts; i++) {
            accountsDiv.children[i].value = ""
        }
        const peopleYouKnowDiv = document.getElementById("peopleYouKnow");
        const numPeopleYouKnow = peopleYouKnowDiv.children.length - 1;
        for (let i = 0; i < numPeopleYouKnow; i++) {
            peopleYouKnowDiv.children[i].value = ""
        }
        props.reset();
    }

    const back = () => {
        const currentPerson = getPerson();
        props.saveCurrentCreatedPerson(currentPerson);
        history.push("/");
    }

    const formHeader = () => {
        return (
            <div className="row">
                <div className="col">
                    <div className="row">
                        <div className="col-9">
                            <div className="h3">
                                Create your personal FOAF profile
                            </div>
                        </div>
                        <div className="col-3 text-right">
                            <button className="btn btn-outline-dark mb-2 ml-2" title="Reset"
                                    onClick={reset}>
                                <i className="fa fa-undo"/>
                            </button>
                            <button className="btn btn-outline-dark mb-2 ml-2" title="Back" onClick={back}>
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

                    <button className="btn btn-block btn-success" onClick={createFoafProfile}>
                        Create
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
                <PersonForm person={props.currentCreatedPerson} />
                {formFooter()}
            </div>
            {messageModal()}
        </>
    );
}

export default Create;
