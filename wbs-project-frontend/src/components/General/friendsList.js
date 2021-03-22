import React from "react";
import Friend from "./friend";
import LoadingAnimation from "./loadingAnimation";

const FriendsList = (props) => {

    const loadingFriends = () => {
        return props.friendsLoading ? (
            <div className="col-12 my-5">
                <LoadingAnimation />
            </div>
        ) : null;
    }

    return (
        <div className="col-12 col-md-10 col-xl-8 mx-auto text-center">
            <h5 className="mb-4" title="foaf:knows">Friends</h5>
            <div className="row">
                {props.friends.map(f => <Friend key={f.friendUri} friend={f}/>)}
                {loadingFriends()}
            </div>
        </div>
    );
}

export default FriendsList;
