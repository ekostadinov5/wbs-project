import React, {useEffect, useState} from "react";
import {Link, useParams, useHistory} from "react-router-dom";
import FoafProfileRepository from "../../repository/axiosFoafProfileRepository";
import PersonInfo from "../General/personInfo";
import FriendsList from "../General/friendsList";
import LoadingAnimation from "../General/loadingAnimation";
import Error from "../General/error";

const FriendProfile = (props) => {
    const [currentPersonFriends, setCurrentPersonFriends] = useState([]);
    const [currentPersonFriendsLoading, setCurrentPersonFriendsLoading] = useState(false);
    const [loadingPerson, setLoadingPerson] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const {hashedEmail} = useParams();

    const history = useHistory();

    useEffect(() => {
        const personUri =
            process.env.REACT_APP_BACKEND_ENDPOINT + "/foaf/profile/rdf/" + hashedEmail + "#me";
        FoafProfileRepository.getPerson(personUri).then(promise => {
            props.loadCurrentFriend({
                ...promise.data,
                personalProfileDocumentUri: promise.data.uri.slice(0, promise.data.uri.length - 3)
            });
            setCurrentPersonFriendsLoading(true);
            FoafProfileRepository.getFriends(promise.data.peopleYouKnow).then(promise => {
                setCurrentPersonFriends(promise.data);
            }).finally(() => {
                setCurrentPersonFriendsLoading(false);
            });
        }).catch(error => {
            let errorMessage = "Error";
            if (error.response && error.response.status) {
                errorMessage += " " + error.response.status;
            }
            setErrorMessage(errorMessage);
        }).finally(() => {
            setLoadingPerson(false);
        });
        return () => {
            setCurrentPersonFriends([]);
        }
    }, [hashedEmail]);

    const copyPersonalProfileDocumentUri = () => {
        const personalProfileDocumentUri = props.friend.uri.slice(0, props.friend.uri.length - 3);
        navigator.clipboard.writeText(personalProfileDocumentUri);
    }

    const profileHeader = () => {
        return (
            <div className="row">
                <div className="col-12 col-md-10 col-xl-8 mx-auto text-center text-lg-right mb-3">
                    <button className="btn btn-outline-dark mb-2 ml-2" title="Copy FOAF document URI"
                            onClick={copyPersonalProfileDocumentUri}>
                        <i className="fa fa-copy"/>
                    </button>
                    <Link to={"/" + hashedEmail + "/viewFriendRdf"} className="btn btn-outline-dark mb-2 ml-2"
                          title="View RDF">
                        <i className="fa fa-code"/>
                    </Link>
                    <button className="btn btn-outline-dark mb-2 ml-2" title="Back" onClick={history.goBack}>
                        <i className="fa fa-arrow-left"/>
                    </button>
                </div>
            </div>
        );
    }

    if (loadingPerson) {
        return (
            <div className="d-flex h-100">
                <div className="mx-auto align-self-center">
                    <LoadingAnimation />
                </div>
            </div>
        );
    } else if (!props.friend) {
        return <Error errorMessage={errorMessage} />
    } else {
        return (
            <div className="container my-5">
                {profileHeader()}
                <div className="row">
                    <PersonInfo person={props.friend} />
                    <FriendsList friends={currentPersonFriends}
                                 friendsLoading={currentPersonFriendsLoading} />
                </div>
            </div>
        );
    }
}

export default FriendProfile;
