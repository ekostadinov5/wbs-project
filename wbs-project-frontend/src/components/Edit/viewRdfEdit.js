import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import ShowRdf from "../General/showRdf";
import {generateRdf} from "../General/utils";
import FoafProfileRepository from "../../repository/axiosFoafProfileRepository";

const ViewRdfEdit = (props) => {
    const [rdf, setRdf] = useState();

    const {base64Email} = useParams();

    const history = useHistory();

    useEffect(() => {
        const sha1 = require('sha1');

        if (!props.currentEditedPerson || !props.currentEditedPerson.firstName) {
            let email = "";
            try {
                email = atob(base64Email);
            } catch (e) {
                history.push("/");
            }
            const hashedEmail = sha1(email);
            const personUri = process.env.REACT_APP_BACKEND_ENDPOINT + "/foaf/profile/rdf/" + hashedEmail + "#me";
            FoafProfileRepository.getPerson(personUri).then(promise => {
                setRdf(generateRdf({
                    ...promise.data,
                    personalProfileDocumentUri: promise.data.uri.slice(0, promise.data.uri.length - 3)
                }));
            }).catch(() => {
                history.push("/");
            });
        } else {
            setRdf(generateRdf(props.currentEditedPerson));
        }
    }, [props]);

    const editFoafProfile = () => {
        props.editFoafProfile(rdf);
        history.push("/");
    }

    return (
        <div className="container d-flex h-100">
            <div className="row mx-auto align-self-center w-100">
                <div className="col-md-12 col-lg-10 mx-auto">
                    <ShowRdf rdf={rdf} />
                    <button className="btn btn-block btn-primary" onClick={editFoafProfile}>
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ViewRdfEdit;
