import "../App.css";
import {React, useState} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom"
import Home from "./home";
import Footer from "./footer";
import Create from "./create";
import ViewRdf from "./viewRdf";
import FoafProfileRepository from "../repository/axiosFoafProfileRepository";
import Profile from "./profile";
import BackToTop from "./backToTop";
import SeeRdf from "./seeRdf";
import Edit from "./edit";
import ViewEditedRdf from "./viewEditedRdf";
import FriendProfile from "./friendProfile";
import {Modal} from "react-bootstrap";

const App = () => {
    const [currentPerson, setCurrentPerson] = useState();
    const [currentPersonFriends, setCurrentPersonFriends] = useState([]);
    const [currentPersonFriendsLoading, setCurrentPersonFriendsLoading] = useState(false);
    const [currentEditedFoafProfile, setCurrentEditedFoafProfile] = useState();
    const [editedRdf, setEditedRdf] = useState("");
    const [currentFoafProfile, setCurrentFoafProfile] = useState({hashEmail: true});
    const [rdf, setRdf] = useState("");
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);

    const resetCurrentPerson = () => {
        setCurrentPerson(null);
        setCurrentPersonFriends([]);
        resetCurrentEditedFoafProfile();
    }

    const resetCurrentEditedFoafProfile = () => {
        setCurrentEditedFoafProfile(null);
        setEditedRdf("");
    }

    const resetCurrentFoafProfile = () => {
        setCurrentFoafProfile({hashEmail: true});
        setRdf("");
    }

    const createFoafProfile = (email, rdf) => {
        email = email ? email : currentFoafProfile.email;
        email = email.slice(7);
        FoafProfileRepository.createFoafProfile(email, rdf).then(() => {});
        setMessage("An email will be sent to " + email + " for confirmation.");
        handleShowMessage();
        resetCurrentFoafProfile();
    }

    const editFoafProfile = (rdf) => {
        const email = currentPerson.email.slice(7);
        FoafProfileRepository.editFoafProfile(email, currentPerson.uri, rdf).then(() => {});
        setMessage("An email will be sent to " + email + " for confirmation.");
        handleShowMessage();
        resetCurrentPerson();
    }

    const deleteFoafProfile = () => {
        const email = currentPerson.email.slice(7);
        FoafProfileRepository.deleteFoafProfile(email, currentPerson.uri).then(() => {});
        setMessage("An email will be sent to " + email + " for confirmation.");
        handleShowMessage();
        resetCurrentPerson();
    }

    const handleCloseMessage = () => setShowMessage(false);
    const handleShowMessage = () => setShowMessage(true);
    const messageModal = () => {
        return (
            <Modal show={showMessage} onHide={handleCloseMessage} animation={false}>
                <Modal.Body>
                    <div className="my-4">
                        {message}
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
            <BackToTop/>
            <Router>
                <Route path="/" exact render={() =>
                    <Home/>}/>
                <Route path="/create" exact render={() =>
                    <Create currentFoafProfile={currentFoafProfile}
                            saveCurrentFoafProfile={setCurrentFoafProfile}
                            generateRdf={setRdf}
                            reset={resetCurrentFoafProfile}
                            createFoafProfile={createFoafProfile}/>}/>
                <Route path="/view-rdf" exact render={() =>
                    <ViewRdf rdf={rdf}
                             createFoafProfile={createFoafProfile}/>}/>
                <Route path="/profile/:email" exact render={() =>
                    <Profile person={currentPerson}
                             personFriends={currentPersonFriends}
                             currentPersonFriendsLoading={currentPersonFriendsLoading}
                             loadCurrentPerson={setCurrentPerson}
                             loadCurrentPersonFriends={setCurrentPersonFriends}
                             setCurrentPersonFriendsLoading={setCurrentPersonFriendsLoading}
                             reset={resetCurrentPerson}
                             deleteFoafProfile={deleteFoafProfile}/>}/>
                <Route path="/edit" exact render={() =>
                    <Edit person={currentPerson}
                          currentEditedFoafProfile={currentEditedFoafProfile}
                          saveCurrentEditedFoafProfile={setCurrentEditedFoafProfile}
                          generateRdf={setEditedRdf}
                          reset={resetCurrentEditedFoafProfile}
                          editFoafProfile={editFoafProfile}/>}/>
                <Route path="/view-edited-rdf" exact render={() =>
                    <ViewEditedRdf rdf={editedRdf}
                                   editFoafProfile={editFoafProfile}
                                   clearRdf={() => setEditedRdf("")}/>}/>
                <Route path="/see-rdf" exact render={() =>
                    <SeeRdf person={currentPerson}/>}/>
                <Route path="/friend/profile/:hashedEmail" exact render={() =>
                    <FriendProfile />}/>
            </Router>
            <Footer/>
            {messageModal()}
        </>
    );
}

export default App;
