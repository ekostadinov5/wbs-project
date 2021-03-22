import React from "react";
import {useHistory} from "react-router-dom";

const ShowRdf = (props) => {
    const history = useHistory();

    const copy = () => {
        navigator.clipboard.writeText(props.rdf);
    }

    return (
        <>
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
        </>
    );
}

export default ShowRdf;
