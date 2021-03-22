import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import ShowRdf from "../General/showRdf";
import {generateRdf} from "../General/utils";

const ViewRdfEdit = (props) => {
    const [rdf, setRdf] = useState();

    const history = useHistory();

    useEffect(() => {
        if (!props.currentEditedPerson || !props.currentEditedPerson.firstName) {
            history.push("/");
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
