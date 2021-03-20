import React, {useEffect, useState} from "react";
import {Link, useParams, useHistory} from "react-router-dom";
import Friend from "./friend";
import FoafProfileRepository from "../repository/axiosFoafProfileRepository";
import {Modal} from "react-bootstrap";

const Profile = (props) => {
    const [loadingPerson, setLoadingPerson] = useState(true);
    const [showDelete, setShowDelete] = useState(false);

    const {email} = useParams();

    const history = useHistory();

    useEffect(() => {
        const sha1 = require('sha1');

        const hashedEmail = sha1(email);
        FoafProfileRepository.getPerson(email, hashedEmail).then(promise => {
            props.loadCurrentPerson({...promise.data, email: email});
            props.setCurrentPersonFriendsLoading(true);
            FoafProfileRepository.getFriends(promise.data.peopleYouKnow).then(promise => {
                props.loadCurrentPersonFriends(promise.data);
            }).finally(() => {
                props.setCurrentPersonFriendsLoading(false);
            });
        }).finally(() => {
            setLoadingPerson(false);
        });
    }, [email]);

    const copyPersonalProfileDocumentUri = () => {
        const personalProfileDocumentUri = props.person.uri.slice(0, props.person.uri.length - 3);
        navigator.clipboard.writeText(personalProfileDocumentUri);
    }

    const loadingAnimation = () => {
        return props.currentPersonFriendsLoading ? (
            <div className="col-12 my-5">
                <div className="mx-auto loader"/>
            </div>
        ) : null;
    }

    const deleteFoafProfile = () => {
        props.deleteFoafProfile();
        history.push("/");
    }

    const back = () => {
        props.reset();
        history.push("/");
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

    return loadingPerson ? null : !props.person ?
        (
            <div id="main">
                <div className="fof">
                    <h1>Error 404</h1>
                    <div className="mt-4">
                        <button className="btn btn-outline-dark" onClick={() => history.push("/")}>
                            Go back
                        </button>
                    </div>
                </div>
            </div>
        )
        :
        (
            <>
                {confirmDeleteModal()}
                <div className="container my-5">
                    <div className="row">
                        <div className="col-12 col-md-10 col-xl-8 mx-auto text-center text-lg-right mb-3">
                            <button className="btn btn-outline-dark mb-2 ml-2" title="Copy FOAF document URI"
                                    onClick={copyPersonalProfileDocumentUri}>
                                <i className="fa fa-copy"/>
                            </button>
                            <Link to="/see-rdf" className="btn btn-outline-dark mb-2 ml-2" title="View RDF">
                                <i className="fa fa-code"/>
                            </Link>
                            <Link to="/edit" className="btn btn-outline-dark mb-2 ml-2" title="Edit">
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
                    <div className="row">
                        <div className="col-12 col-md-10 col-xl-8 mx-auto text-center">
                            <img id="image" src={props.person.image ? props.person.image : "/pp.png"} alt="foaf:img"
                                 className="rounded-circle border border-dark p-1" width="250" height="250"/>
                            <h3 className="mt-3">
                                {(() => {
                                    if (props.person.title) {
                                        return <span title="foaf:title">{props.person.title} </span>
                                    }
                                })()}
                                <span title="foaf:firstName">{props.person.firstName} </span>
                                <span title="foaf:lastName">{props.person.lastName}</span>
                            </h3>
                            {(() => {
                                if (props.person.nickname) {
                                    return <h5 className="text-muted" title="foaf:nickname">({props.person.nickname})</h5>
                                }
                            })()}
                            <hr/>
                        </div>
                        <div className="col-12 col-md-10 col-xl-8 mx-auto text-center">
                            <div className="row mb-4">
                                <div className="col-12 col-md-6">
                                    <div className="font-weight-bold text-center text-md-right" title="foaf:gender">
                                        Gender
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="text-center text-md-left overflow-wrap-break-word">
                                        {(() => {
                                            if (props.person.gender) {
                                                return props.person.gender;
                                            } else {
                                                return "/";
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col-12 col-md-6">
                                    <div className="font-weight-bold text-center text-md-right" title="foaf:based_near">
                                        Based near
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="text-center text-md-left overflow-wrap-break-word">
                                        {(() => {
                                            if (props.person.basedNear) {
                                                return (
                                                    <a href={props.person.basedNear}>
                                                        {props.person.basedNear}
                                                    </a>
                                                );
                                            } else {
                                                return "/";
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>
                            {(() => {
                                if (!props.person.hashedEmail) {
                                    return (
                                        <div className="row mb-4">
                                            <div className="col-12 col-md-6">
                                                <div className="font-weight-bold text-center text-md-right"
                                                     title="foaf:mbox">
                                                    Email
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <div className="text-center text-md-left overflow-wrap-break-word">
                                                    {props.person.email.slice(7)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div className="row mb-4">
                                            <div className="col-12 col-md-6">
                                                <div className="font-weight-bold text-center text-md-right"
                                                     title="foaf:mbox_sha1sum">
                                                    Hashed email
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <div className="text-center text-md-left overflow-wrap-break-word">
                                                    {props.person.hashedEmail}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            })()}
                            <div className="row mb-4">
                                <div className="col-12 col-md-6">
                                    <div className="font-weight-bold text-center text-md-right" title="foaf:homepage">
                                        Homepage
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="text-center text-md-left overflow-wrap-break-word">
                                        {(() => {
                                            if (props.person.homepage) {
                                                return (
                                                    <a href={props.person.homepage}>
                                                        {props.person.homepage}
                                                    </a>
                                                );
                                            } else {
                                                return "/";
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col-12 col-md-6">
                                    <div className="font-weight-bold text-center text-md-right" title="foaf:phone">
                                        Phone
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="text-center text-md-left overflow-wrap-break-word">
                                        {(() => {
                                            if (props.person.phone) {
                                                return (
                                                    <a href={props.person.phone}>
                                                        {props.person.phone.slice(4)}
                                                    </a>
                                                );
                                            } else {
                                                return "/";
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col-12 col-md-6">
                                    <div className="font-weight-bold text-center text-md-right" title="foaf:schoolHomepage">
                                        Schools
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="text-center text-md-left overflow-wrap-break-word">
                                        {(() => {
                                            if (props.person.schools && props.person.schools[0]) {
                                                return props.person.schools.map(s => {
                                                    return (
                                                        <div key={s}>
                                                            <a href={s}>
                                                                {s}
                                                            </a>
                                                        </div>
                                                    );
                                                })
                                            } else {
                                                return "/";
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col-12 col-md-6">
                                    <div className="font-weight-bold text-center text-md-right"
                                         title="foaf:workplaceHomepage">
                                        Workplace homepage
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="text-center text-md-left overflow-wrap-break-word">
                                        {(() => {
                                            if (props.person.workplaceHomepage) {
                                                return (
                                                    <a href={props.person.workplaceHomepage}>
                                                        {props.person.workplaceHomepage}
                                                    </a>
                                                );
                                            } else {
                                                return "/";
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col-12 col-md-6">
                                    <div className="font-weight-bold text-center text-md-right"
                                         title="foaf:workInfoHomepage">
                                        Work info homepage
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="text-center text-md-left overflow-wrap-break-word">
                                        {(() => {
                                            if (props.person.workInfoHomepage) {
                                                return (
                                                    <a href={props.person.workInfoHomepage}>
                                                        {props.person.workInfoHomepage}
                                                    </a>
                                                );
                                            } else {
                                                return "/";
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col-12 col-md-6">
                                    <div className="font-weight-bold text-center text-md-right" title="foaf:publications">
                                        Publications
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="text-center text-md-left overflow-wrap-break-word">
                                        {(() => {
                                            if (props.person.publications && props.person.publications[0]) {
                                                return props.person.publications.map(p => {
                                                    return (
                                                        <div key={p}>
                                                            <a href={p}>
                                                                {p}
                                                            </a>
                                                        </div>
                                                    );
                                                })
                                            } else {
                                                return "/";
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col-12 col-md-6">
                                    <div className="font-weight-bold text-center text-md-right" title="foaf:account">
                                        Accounts
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="text-center text-md-left overflow-wrap-break-word">
                                        <div>
                                            {(() => {
                                                if (props.person.accounts && props.person.accounts[0]) {
                                                    return props.person.accounts.map(a => {
                                                        return (
                                                            <div key={a}>
                                                                <a href={a}>
                                                                    {a}
                                                                </a>
                                                            </div>
                                                        );
                                                    })
                                                } else {
                                                    return "/";
                                                }
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                        </div>
                        <div className="col-12 col-md-10 col-xl-8 mx-auto text-center">
                            <h5 className="mb-4" title="foaf:knows">Friends</h5>
                            <div className="row">
                                {props.personFriends.map(f => <Friend key={f.friendUri} friend={f}/>)}
                                {loadingAnimation()}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
}

export default Profile;
