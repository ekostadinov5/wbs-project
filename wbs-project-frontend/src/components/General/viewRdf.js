import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import ShowRdf from "./showRdf";
import {generateRdf} from "./utils";
import FoafProfileRepository from "../../repository/axiosFoafProfileRepository";

const ViewRdf = (props) => {
    const [rdf, setRdf] = useState();

    const {base64Email, hashedEmail} = useParams();

    const history = useHistory();

    useEffect(() => {
        const sha1 = require('sha1');

        if (!props.person || !props.person.firstName) {
            let personUri = "", hashedEmailLocal = hashedEmail;
            if (!hashedEmailLocal) {
                let email = "";
                try {
                    email = atob(base64Email);
                } catch (e) {
                    history.push("/");
                }
                hashedEmailLocal = sha1(email);
            }
            personUri = process.env.REACT_APP_BACKEND_ENDPOINT + "/foaf/profile/rdf/" + hashedEmailLocal + "#me";
            FoafProfileRepository.getPerson(personUri).then(promise => {
                setRdf(generateRdf({
                    ...promise.data,
                    personalProfileDocumentUri: promise.data.uri.slice(0, promise.data.uri.length - 3)
                }));
            }).catch(() => {
                history.push("/");
            });
        } else {
            setRdf(generateRdf(props.person));
        }
    }, [props]);

    return (
        <div className="container d-flex h-100">
            <div className="row mx-auto align-self-center w-100">
                <div className="col-md-12 col-lg-10 mx-auto">
                    <ShowRdf rdf={rdf} />
                </div>
            </div>
        </div>
    );
}

export default ViewRdf;
