import React from "react";
import {useHistory} from "react-router-dom";

const Friend = (props) => {
    const history = useHistory();

    const redirect = (e) => {
        e.preventDefault();
        const localUriPrefix = process.env.REACT_APP_BACKEND_ENDPOINT + "/foaf/profile/rdf/";
        if (props.friend.friendUri.startsWith(localUriPrefix)) {
            const hashedEmail = props.friend.friendUri.slice(props.friend.friendUri.length - 40);
            history.push("/friend/profile/" + hashedEmail);
        } else {
            window.open(props.friend.friendUri, "_blank");
        }
    }

    return props.friend.firstName ? (
        <div className="col-6 col-sm-4 col-lg-3 mb-4">
            <a href={props.friend.friendUri} className="text-decoration-none" onClick={redirect}>
                <div className="card">
                    <div className="bg-light">
                        <img src={props.friend.image ? props.friend.image : "/pp.png"} alt="foaf:img"
                             className="card-img-top" />
                    </div>
                    <div className="card-body px-1 py-3">
                        <div className="overflow-hidden friend-card-body">
                            {props.friend.firstName}
                        </div>
                        <div className="overflow-hidden friend-card-body">
                            {props.friend.lastName}
                        </div>
                    </div>
                </div>
            </a>
        </div>
    ) : null;
}

export default Friend;
