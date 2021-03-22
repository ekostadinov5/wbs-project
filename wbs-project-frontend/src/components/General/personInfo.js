import React from "react";
import {isValidUrl} from "./utils";

const PersonInfo = (props) => {

    return (
        <>
            <div className="col-12 col-md-10 col-xl-8 mx-auto text-center">
                <img id="image" src={props.person.image ? props.person.image : "/pp.png"} alt="foaf:img"
                     className="rounded-circle border border-dark p-1" width="250" height="250"/>
                <h3 className="mt-3">
                    {(() => {
                        if (props.person.title) {
                            return <span title="foaf:title">{props.person.title} </span>
                        }
                    })()}
                    <span title="foaf:firstName">{props.person.firstName} </span>
                    <span title="foaf:lastName">{props.person.lastName}</span>
                </h3>
                {(() => {
                    if (props.person.nickname) {
                        return <h5 className="text-muted" title="foaf:nickname">({props.person.nickname})</h5>
                    }
                })()}
                <hr/>
            </div>
            <div className="col-12 col-md-10 col-xl-8 mx-auto text-center">
                <div className="row mb-4">
                    <div className="col-12 col-md-6">
                        <div className="font-weight-bold text-center text-md-right" title="foaf:gender">
                            Gender
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="text-center text-md-left overflow-wrap-break-word">
                            {(() => {
                                if (props.person.gender) {
                                    return props.person.gender;
                                } else {
                                    return "/";
                                }
                            })()}
                        </div>
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-12 col-md-6">
                        <div className="font-weight-bold text-center text-md-right" title="foaf:based_near">
                            Based near
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="text-center text-md-left overflow-wrap-break-word">
                            {(() => {
                                if (props.person.basedNear) {
                                    if (isValidUrl(props.person.basedNear)) {
                                        return (
                                            <a href={props.person.basedNear}>
                                                {props.person.basedNear}
                                            </a>
                                        );
                                    } else {
                                        return props.person.basedNear
                                    }
                                } else {
                                    return "/";
                                }
                            })()}
                        </div>
                    </div>
                </div>
                {(() => {
                    if (!props.person.hashedEmail) {
                        return (
                            <div className="row mb-4">
                                <div className="col-12 col-md-6">
                                    <div className="font-weight-bold text-center text-md-right"
                                         title="foaf:mbox">
                                        Email
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="text-center text-md-left overflow-wrap-break-word">
                                        {props.person.email.slice(7)}
                                    </div>
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div className="row mb-4">
                                <div className="col-12 col-md-6">
                                    <div className="font-weight-bold text-center text-md-right"
                                         title="foaf:mbox_sha1sum">
                                        Hashed email
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="text-center text-md-left overflow-wrap-break-word">
                                        {props.person.hashedEmail}
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })()}
                <div className="row mb-4">
                    <div className="col-12 col-md-6">
                        <div className="font-weight-bold text-center text-md-right" title="foaf:homepage">
                            Homepage
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="text-center text-md-left overflow-wrap-break-word">
                            {(() => {
                                if (props.person.homepage) {
                                    return (
                                        <a href={props.person.homepage}>
                                            {props.person.homepage}
                                        </a>
                                    );
                                } else {
                                    return "/";
                                }
                            })()}
                        </div>
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-12 col-md-6">
                        <div className="font-weight-bold text-center text-md-right" title="foaf:phone">
                            Phone
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="text-center text-md-left overflow-wrap-break-word">
                            {(() => {
                                if (props.person.phone) {
                                    return (
                                        <a href={props.person.phone}>
                                            {props.person.phone.slice(4)}
                                        </a>
                                    );
                                } else {
                                    return "/";
                                }
                            })()}
                        </div>
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-12 col-md-6">
                        <div className="font-weight-bold text-center text-md-right" title="foaf:schoolHomepage">
                            Schools
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="text-center text-md-left overflow-wrap-break-word">
                            {(() => {
                                if (props.person.schools && props.person.schools[0]) {
                                    return props.person.schools.map(s => {
                                        return (
                                            <div key={s}>
                                                <a href={s}>
                                                    {s}
                                                </a>
                                            </div>
                                        );
                                    })
                                } else {
                                    return "/";
                                }
                            })()}
                        </div>
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-12 col-md-6">
                        <div className="font-weight-bold text-center text-md-right"
                             title="foaf:workplaceHomepage">
                            Workplace homepage
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="text-center text-md-left overflow-wrap-break-word">
                            {(() => {
                                if (props.person.workplaceHomepage) {
                                    return (
                                        <a href={props.person.workplaceHomepage}>
                                            {props.person.workplaceHomepage}
                                        </a>
                                    );
                                } else {
                                    return "/";
                                }
                            })()}
                        </div>
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-12 col-md-6">
                        <div className="font-weight-bold text-center text-md-right"
                             title="foaf:workInfoHomepage">
                            Work info homepage
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="text-center text-md-left overflow-wrap-break-word">
                            {(() => {
                                if (props.person.workInfoHomepage) {
                                    return (
                                        <a href={props.person.workInfoHomepage}>
                                            {props.person.workInfoHomepage}
                                        </a>
                                    );
                                } else {
                                    return "/";
                                }
                            })()}
                        </div>
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-12 col-md-6">
                        <div className="font-weight-bold text-center text-md-right" title="foaf:publications">
                            Publications
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="text-center text-md-left overflow-wrap-break-word">
                            {(() => {
                                if (props.person.publications && props.person.publications[0]) {
                                    return props.person.publications.map(p => {
                                        return (
                                            <div key={p}>
                                                <a href={p}>
                                                    {p}
                                                </a>
                                            </div>
                                        );
                                    })
                                } else {
                                    return "/";
                                }
                            })()}
                        </div>
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-12 col-md-6">
                        <div className="font-weight-bold text-center text-md-right" title="foaf:account">
                            Accounts
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="text-center text-md-left overflow-wrap-break-word">
                            <div>
                                {(() => {
                                    if (props.person.accounts && props.person.accounts[0]) {
                                        return props.person.accounts.map(a => {
                                            return (
                                                <div key={a}>
                                                    <a href={a}>
                                                        {a}
                                                    </a>
                                                </div>
                                            );
                                        })
                                    } else {
                                        return "/";
                                    }
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
                <hr/>
            </div>
        </>
    );
}

export default PersonInfo;
