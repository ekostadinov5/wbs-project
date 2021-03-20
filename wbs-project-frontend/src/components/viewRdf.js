import React, {useEffect} from "react";
import {useHistory} from "react-router-dom";

const ViewRdf = (props) => {
    const history = useHistory();

    useEffect(() => {
        if (props.rdf === "") {
            history.goBack();
            history.goBack();
        }
    }, [props, history]);

    const copy = () => {
        navigator.clipboard.writeText(props.rdf);
    }

    const createFoafProfile = () => {
        props.createFoafProfile(null, props.rdf);
        history.push("/");
    }

    return (
        <div className="container d-flex h-100">
            <div className="row mx-auto align-self-center w-100">
                <div className="col-md-12 col-lg-10 col-xl-8 mx-auto">
                    <div className="text-right">
                        <button className="btn btn-outline-dark mb-2 ml-2" title="Copy" onClick={copy}>
                            <i className="fa fa-copy"/>
                        </button>
                        <button className="btn btn-outline-dark mb-2 ml-2" title="Back" onClick={history.goBack}>
                            <i className="fa fa-arrow-left"/>
                        </button>
                    </div>
                    <textarea id="rdf-textarea" defaultValue={props.rdf}
                              className="form-control mb-4" rows="17"
                              disabled/>
                    <button className="btn btn-block btn-success"
                            onClick={createFoafProfile}>
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ViewRdf;
