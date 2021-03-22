import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import ShowRdf from "./showRdf";
import {generateRdf} from "./utils";

const ViewRdf = (props) => {
    const [rdf, setRdf] = useState();

    const history = useHistory();

    useEffect(() => {
        if (!props.person || !props.person.firstName) {
            history.push("/");
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
