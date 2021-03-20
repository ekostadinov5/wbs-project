import React, {useEffect, useState} from "react";
import {Link, useParams, useHistory} from "react-router-dom";
import Friend from "./friend";
import FoafProfileRepository from "../repository/axiosFoafProfileRepository";

const FriendProfile = () => {
    const [currentPerson, setCurrentPerson] = useState();
    const [currentPersonFriends, setCurrentPersonFriends] = useState([]);
    const [currentPersonFriendsLoading, setCurrentPersonFriendsLoading] = useState(false);
    const [loadingPerson, setLoadingPerson] = useState(true);

    const {hashedEmail} = useParams();

    const history = useHistory();

    useEffect(() => {
        const personUri = "http://localhost:8080/foaf/profile/rdf/" + hashedEmail + "#me";
        FoafProfileRepository.getPersonByUri(personUri).then(promise => {
            setCurrentPerson(promise.data);
            setCurrentPersonFriendsLoading(true);
            FoafProfileRepository.getFriends(promise.data.peopleYouKnow).then(promise => {
                setCurrentPersonFriends(promise.data);
            }).finally(() => {
                setCurrentPersonFriendsLoading(false);
            });
        }).finally(() => {
            setLoadingPerson(false);
        });
        return () => {
            setCurrentPerson(null);
            setCurrentPersonFriends([]);
        }
    }, [hashedEmail]);

    const copyPersonalProfileDocumentUri = () => {
        const personalProfileDocumentUri = currentPerson.uri.slice(0, currentPerson.uri.length - 3);
        navigator.clipboard.writeText(personalProfileDocumentUri);
    }

    const loadingAnimation = () => {
        return currentPersonFriendsLoading ? (
            <div className="col-12 my-5">
                <div className="mx-auto loader"/>
            </div>
        ) : null;
    }

    return loadingPerson ? null : !currentPerson ?
        (
            <div id="main">
                <div className="fof">
                    <h1>Error 404</h1>
                    <div className="mt-4">
                        <button className="btn btn-outline-dark" onClick={history.goBack}>
                            Go back
                        </button>
                    </div>
                </div>
            </div>
        )
        :
        (
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
                        <button className="btn btn-outline-dark mb-2 ml-2" title="Back" onClick={history.goBack}>
                            <i className="fa fa-arrow-left"/>
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-10 col-xl-8 mx-auto text-center">
                        <img id="image" src={currentPerson.image ? currentPerson.image : "/pp.png"} alt="foaf:img"
                             className="rounded-circle border border-dark p-1" width="250" height="250"/>
                        <h3 className="mt-3">
                            {(() => {
                                if (currentPerson.title) {
                                    return <span title="foaf:title">{currentPerson.title} </span>
                                }
                            })()}
                            <span title="foaf:firstName">{currentPerson.firstName} </span>
                            <span title="foaf:lastName">{currentPerson.lastName}</span>
                        </h3>
                        {(() => {
                            if (currentPerson.nickname) {
                                return <h5 className="text-muted" title="foaf:nickname">({currentPerson.nickname})</h5>
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
                                        if (currentPerson.gender) {
                                            return currentPerson.gender;
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
                                        if (currentPerson.basedNear) {
                                            return (
                                                <a href={currentPerson.basedNear}>
                                                    {currentPerson.basedNear}
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
                            if (!currentPerson.hashedEmail) {
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
                                                {currentPerson.email ? currentPerson.email.slice(7) : null}
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
                                                {currentPerson.hashedEmail}
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
                                        if (currentPerson.homepage) {
                                            return (
                                                <a href={currentPerson.homepage}>
                                                    {currentPerson.homepage}
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
                                        if (currentPerson.phone) {
                                            return (
                                                <a href={currentPerson.phone}>
                                                    {currentPerson.phone.slice(4)}
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
                                        if (currentPerson.schools && currentPerson.schools[0]) {
                                            return currentPerson.schools.map(s => {
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
                                        if (currentPerson.workplaceHomepage) {
                                            return (
                                                <a href={currentPerson.workplaceHomepage}>
                                                    {currentPerson.workplaceHomepage}
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
                                        if (currentPerson.workInfoHomepage) {
                                            return (
                                                <a href={currentPerson.workInfoHomepage}>
                                                    {currentPerson.workInfoHomepage}
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
                                        if (currentPerson.publications && currentPerson.publications[0]) {
                                            return currentPerson.publications.map(p => {
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
                                            if (currentPerson.accounts && currentPerson.accounts[0]) {
                                                return currentPerson.accounts.map(a => {
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
                            {currentPersonFriends.map(f => <Friend key={f.friendUri} friend={f}/>)}
                            {loadingAnimation()}
                        </div>
                    </div>
                </div>
            </div>
        );
}

export default FriendProfile;
