import React, {useEffect, useState} from "react";
import {Link, useParams, useHistory} from "react-router-dom";
import {Modal} from "react-bootstrap";
import FoafProfileRepository from "../../repository/axiosFoafProfileRepository";
import PersonInfo from "../General/personInfo";
import FriendsList from "../General/friendsList";
import LoadingAnimation from "../General/loadingAnimation";
import Error from "../General/error";

const PersonProfile = (props) => {
    const [loadingPerson, setLoadingPerson] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const {base64Email} = useParams();

    const history = useHistory();

    useEffect(() => {
        const sha1 = require('sha1');

        if (!props.person) {
            let email = "";
            try {
                email = atob(base64Email);
            } catch (e) {
                history.push("/");
            }
            const hashedEmail = sha1(email);
            const personUri =
                process.env.REACT_APP_BACKEND_ENDPOINT + "/foaf/profile/rdf/" + hashedEmail + "#me";
            setLoadingPerson(true);
            FoafProfileRepository.getPerson(personUri).then(promise => {
                props.loadCurrentPerson({
                    ...promise.data,
                    email: email,
                    personalProfileDocumentUri: promise.data.uri.slice(0, promise.data.uri.length - 3),
                    hashEmail: !!promise.data.hashedEmail
                });
                if (props.personFriends.length === 0) {
                    props.setCurrentPersonFriendsLoading(true);
                    FoafProfileRepository.getFriends(promise.data.peopleYouKnow).then(promise => {
                        props.loadCurrentPersonFriends(promise.data);
                    }).finally(() => {
                        props.setCurrentPersonFriendsLoading(false);
                    });
                }
            }).catch(error => {
                let errorMessage = "Error";
                if (error.response && error.response.status) {
                    errorMessage += " " + error.response.status;
                }
                setErrorMessage(errorMessage);
            }).finally(() => {
                setLoadingPerson(false);
            });
        }
    }, [base64Email]);

    const copyPersonalProfileDocumentUri = () => {
        const personalProfileDocumentUri = props.person.uri.slice(0, props.person.uri.length - 3);
        navigator.clipboard.writeText(personalProfileDocumentUri);
    }

    const deleteFoafProfile = () => {
        props.deleteFoafProfile();
        history.push("/");
    }

    const back = () => {
        props.reset();
        history.push("/");
    }

    const profileHeader = () => {
        return (
            <div className="row">
                <div className="col-12 col-md-10 col-xl-8 mx-auto text-center text-lg-right mb-3">
                    <button className="btn btn-outline-dark mb-2 ml-2" title="Copy FOAF document URI"
                            onClick={copyPersonalProfileDocumentUri}>
                        <i className="fa fa-copy"/>
                    </button>
                    <Link to={"/" + base64Email + "/viewPersonRdf"} className="btn btn-outline-dark mb-2 ml-2"
                          title="View RDF">
                        <i className="fa fa-code"/>
                    </Link>
                    <Link to={"/" + base64Email + "/edit"} className="btn btn-outline-dark mb-2 ml-2"
                          title="Edit">
                        <i className="fa fa-edit"/>
                    </Link>
                    <button className="btn btn-outline-dark mb-2 ml-2" title="Delete"
                            onClick={handleShowDelete}>
                        <i className="fa fa-trash"/>
                    </button>
                    <button className="btn btn-outline-dark mb-2 ml-2" title="Back" onClick={back}>
                        <i className="fa fa-arrow-left"/>
                    </button>
                </div>
            </div>
        );
    }

    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);
    const confirmDeleteModal = () => {
        return (
            <Modal show={showDelete} onHide={handleCloseDelete} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete FOAF profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this FOAF profile?</Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-outline-danger" onClick={() => {
                        handleCloseDelete();
                        deleteFoafProfile();
                    }}>
                        Delete
                    </button>
                    <button className="btn btn-outline-secondary" onClick={handleCloseDelete}>
                        Cancel
                    </button>
                </Modal.Footer>
            </Modal>
        );
    };

    if (loadingPerson) {
        return (
            <div className="d-flex h-100">
                <div className="mx-auto align-self-center">
                    <LoadingAnimation />
                </div>
            </div>
        );
    } else if (!props.person) {
        return (
            <Error errorMessage={errorMessage} />
        );
    } else {
        return (
            <>
                <div className="container my-5">
                    {profileHeader()}
                    <div className="row">
                        <PersonInfo person={props.person} />
                        <FriendsList friends={props.personFriends}
                                     friendsLoading={props.personFriendsLoading} />
                    </div>
                </div>
                {confirmDeleteModal()}
            </>
        );
    }
}

export default PersonProfile;
