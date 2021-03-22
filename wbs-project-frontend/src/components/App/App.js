import "./App.css";
import {React, useState} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import {Modal} from "react-bootstrap";
import FoafProfileRepository from "../../repository/axiosFoafProfileRepository";
import Home from "../Home/home";
import Create from "../Create/create";
import ViewRdfCreate from "../Create/viewRdfCreate";
import PersonProfile from "../PersonProfile/personProfile";
import ViewRdf from "../General/viewRdf";
import Edit from "../Edit/edit";
import ViewRdfEdit from "../Edit/viewRdfEdit";
import FriendProfile from "../FriendProfile/friendProfile";
import Footer from "../Footer/footer";
import BackToTop from "../General/backToTop";
import LoadingAnimation from "../General/loadingAnimation";

const App = () => {
    const [currentLoadedPerson, setCurrentLoadedPerson] = useState();
    const [currentPersonFriends, setCurrentPersonFriends] = useState([]);
    const [currentPersonFriendsLoading, setCurrentPersonFriendsLoading] = useState(false);
    const [currentFriend, setCurrentFriend] = useState();
    const [currentEditedPerson, setCurrentEditedPerson] = useState();
    const [currentCreatedPerson, setCurrentCreatedPerson] = useState({hashEmail: true});
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [loading, setLoading] = useState(false);

    const resetCurrentPerson = () => {
        setCurrentLoadedPerson(null);
        setCurrentPersonFriends([]);
        resetCurrentEditedPerson();
    }

    const resetCurrentEditedPerson = () => {
        setCurrentEditedPerson(null);
    }

    const resetCurrentCreatedPerson = () => {
        setCurrentCreatedPerson({hashEmail: true});
    }

    const createFoafProfile = (email, rdf) => {
        email = email ? email : currentCreatedPerson.email;
        email = email.slice(7);
        setLoading(true);
        FoafProfileRepository.createFoafProfile(email, rdf).then(() => {
            setMessage("An email will be sent to " + email + " for confirmation.");
            handleShowMessage();
            resetCurrentCreatedPerson();
        }).catch(error => {
            setMessage("An error has occurred. Your profile has not been created.");
            handleShowMessage();
        }).finally(() => {
            setLoading(false);
        });
    }

    const editFoafProfile = (rdf) => {
        const email = currentLoadedPerson.email.slice(7);
        FoafProfileRepository.editFoafProfile(email, currentLoadedPerson.uri, rdf).then(() => {
            setMessage("An email will be sent to " + email + " for confirmation.");
            handleShowMessage();
            resetCurrentPerson();
        }).catch(error => {
            setMessage("An error has occurred. Your profile has not been updated.");
            handleShowMessage();
        }).finally(() => {
            setLoading(false);
        });
    }

    const deleteFoafProfile = () => {
        const email = currentLoadedPerson.email.slice(7);
        FoafProfileRepository.deleteFoafProfile(email, currentLoadedPerson.uri).then(() => {
            setMessage("An email will be sent to " + email + " for confirmation.");
            handleShowMessage();
            resetCurrentPerson();
        }).catch(error => {
            setMessage("An error has occurred. Your profile has not been deleted.");
            handleShowMessage();
        }).finally(() => {
            setLoading(false);
        });
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

    if (loading) {
        return (
            <div className="d-flex h-100">
                <div className="mx-auto align-self-center">
                    <LoadingAnimation />
                </div>
            </div>
        );
    } else {
        return (
            <>
                <BackToTop/>
                <Router>
                    <Route path="/" exact render={() =>
                        <Home/>}/>
                    <Route path="/create" exact render={() =>
                        <Create currentCreatedPerson={currentCreatedPerson}
                                saveCurrentCreatedPerson={setCurrentCreatedPerson}
                                reset={resetCurrentCreatedPerson}
                                createFoafProfile={createFoafProfile}/>}/>
                    <Route path="/viewRdfCreate" exact render={() =>
                        <ViewRdfCreate currentCreatedPerson={currentCreatedPerson}
                                       createFoafProfile={createFoafProfile}/>}/>
                    <Route path="/profile/:base64Email" exact render={() =>
                        <PersonProfile person={currentLoadedPerson}
                                 personFriends={currentPersonFriends}
                                 personFriendsLoading={currentPersonFriendsLoading}
                                 loadCurrentPerson={setCurrentLoadedPerson}
                                 loadCurrentPersonFriends={setCurrentPersonFriends}
                                 setCurrentPersonFriendsLoading={setCurrentPersonFriendsLoading}
                                 reset={resetCurrentPerson}
                                 deleteFoafProfile={deleteFoafProfile}/>}/>
                    <Route path="/viewPersonRdf" exact render={() =>
                        <ViewRdf person={currentLoadedPerson}/>}/>
                    <Route path="/edit" exact render={() =>
                        <Edit person={currentLoadedPerson}
                              currentEditedPerson={currentEditedPerson}
                              saveCurrentEditedPerson={setCurrentEditedPerson}
                              reset={resetCurrentEditedPerson}
                              editFoafProfile={editFoafProfile}/>}/>
                    <Route path="/viewRdfEdit" exact render={() =>
                        <ViewRdfEdit currentEditedPerson={currentEditedPerson}
                                       editFoafProfile={editFoafProfile}/>}/>
                    <Route path="/friend/profile/:hashedEmail" exact render={() =>
                        <FriendProfile friend={currentFriend}
                                       loadCurrentFriend={setCurrentFriend} />}/>
                    <Route path="/viewFriendRdf" exact render={() =>
                        <ViewRdf person={currentFriend}/>}/>
                </Router>
                <Footer/>
                {messageModal()}
            </>
        );
    }
}

export default App;
