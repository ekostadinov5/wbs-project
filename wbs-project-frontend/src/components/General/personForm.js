import React from "react";
import {addField} from "./utils";

const PersonForm = (props) => {

    return props.person ? (
        <div className="row mb-5">
            <div className="col-12 col-lg-6 col-xl-4 mx-auto">
                <h5 className="mt-4">Personal info</h5>
                <hr/>
                <div className="form-group mb-4">
                    <label htmlFor="title">Title</label>
                    <input id="title" type="text" className="form-control"
                           placeholder="Mr, Ms, Miss, Dr., etc" defaultValue={props.person.title}/>
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="firstName">
                        First name
                        <span className="text-danger ml-1" title="Required">*</span>
                    </label>
                    <input id="firstName" type="text" className="form-control" placeholder="John"
                           defaultValue={props.person.firstName}/>
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="lastName">
                        Last name
                        <span className="text-danger ml-1" title="Required">*</span>
                    </label>
                    <input id="lastName" type="text" className="form-control" placeholder="Smith"
                           defaultValue={props.person.lastName}/>
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="nickname">Nickname</label>
                    <input id="nickname" type="text" className="form-control" placeholder="Johnny"
                           defaultValue={props.person.nickname}/>
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="gender">Gender</label>
                    <input id="gender" type="text" className="form-control"
                           placeholder="Male, Female, Prefer not to say, etc"
                           defaultValue={props.person.gender}/>
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="basedNear">Based near</label>
                    <input id="basedNear" type="url" className="form-control"
                           placeholder="https://dbpedia.org/resource/London"
                           defaultValue={props.person.basedNear}/>
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="image">Image</label>
                    <input id="image" type="url" className="form-control"
                           placeholder="https://example.com/image.jpg"
                           defaultValue={props.person.image}/>
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="email">
                        Email address
                        <span className="text-danger ml-1" title="Required">*</span>
                    </label>
                    <input id="email" type="email" className="form-control mb-1"
                           placeholder="mailto:john.smith@example.com" defaultValue={props.person.email}/>
                    <label>
                        <input id="hashEmail" type="checkbox"
                               defaultChecked={props.person.hashEmail}
                               className="mr-1"/>
                        Protect email address from spammers
                    </label>
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="homepage">Homepage</label>
                    <input id="homepage" type="url" className="form-control" placeholder="https://jsmith.com"
                           defaultValue={props.person.homepage}/>
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="phone">Phone number</label>
                    <input id="phone" type="tel" className="form-control" placeholder="tel:0038970123456"
                           defaultValue={props.person.phone}/>
                </div>
            </div>
            <div className="col-12 col-lg-6 col-xl-4 mx-auto">
                <h5 className="mt-4">Schools</h5>
                <hr/>
                <div id="schools" className="form-group mb-4">
                    {(() => {
                        if (!props.person.schools
                            || props.person.schools.length === 0) {
                            return <input id="schoolHomepage0" type="url" className="form-control mb-2"
                                          placeholder="Link to school's homepage"/>
                        } else {
                            let i = 0;
                            return props.person.schools.map(s =>
                                <input key={"schoolHomepage" + i} id={"schoolHomepage" + i++} type="url"
                                       className="form-control mb-2" placeholder="Link to school's homepage"
                                       defaultValue={s}/>
                            );
                        }
                    })()}

                    <div className="text-right">
                        <button className="btn btn-sm btn-outline-success" title="Add field"
                                onClick={() => addField("schools", "schoolHomepage",
                                    "Link to school's homepage")}>
                            <i className="fa fa-plus"/>
                        </button>
                    </div>
                </div>

                <h5 className="mt-5">Work</h5>
                <hr/>
                <div className="form-group mb-4">
                    <label htmlFor="workplaceHomepage">Workplace homepage</label>
                    <input id="workplaceHomepage" type="url" className="form-control"
                           placeholder="https://workplace.com"
                           defaultValue={props.person.workplaceHomepage}/>
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="workInfoHomepage">Work info homepage (What do you do at work?)</label>
                    <input id="workInfoHomepage" type="url" className="form-control"
                           placeholder="https://workinfo.com"
                           defaultValue={props.person.workInfoHomepage}/>
                </div>

                <h5 className="mt-5">Publications</h5>
                <hr/>
                <div id="publications" className="form-group mb-4">
                    {(() => {
                        if (!props.person.publications
                            || props.person.publications.length === 0) {
                            return <input id="publication0" type="url" className="form-control mb-2"
                                          placeholder="Link to published document"/>
                        } else {
                            let i = 0;
                            return props.person.publications.map(p =>
                                <input key={"publication" + i} id={"publication" + i++} type="url"
                                       className="form-control mb-2" placeholder="Link to published document"
                                       defaultValue={p}/>
                            );
                        }
                    })()}

                    <div className="text-right">
                        <button className="btn btn-sm btn-outline-success" title="Add field"
                                onClick={() => addField("publications", "publication",
                                    "Link to published document")}>
                            <i className="fa fa-plus"/>
                        </button>
                    </div>
                </div>
            </div>
            <div className="col-12 col-lg-6 col-xl-4 mx-auto">
                <h5 className="mt-4">Accounts</h5>
                <hr/>
                <div id="accounts" className="form-group mb-4">
                    {(() => {
                        if (!props.person.accounts
                            || props.person.accounts.length === 0) {
                            return <input id="account0" type="url" className="form-control mb-2"
                                          placeholder="Link to social media or other online accounts"/>
                        } else {
                            let i = 0;
                            return props.person.accounts.map(a =>
                                <input key={"account" + i} id={"account" + i++} type="url"
                                       className="form-control mb-2"
                                       placeholder="Link to social media or other online accounts"
                                       defaultValue={a}/>
                            );
                        }
                    })()}

                    <div className="text-right">
                        <button className="btn btn-sm btn-outline-success" title="Add field"
                                onClick={() => addField("accounts", "account",
                                    "Link to social media or other online accounts")}>
                            <i className="fa fa-plus"/>
                        </button>
                    </div>
                </div>

                <h5 className="mt-5">People you know</h5>
                <hr/>
                <div id="peopleYouKnow" className="form-group mb-4">
                    {(() => {
                        if (!props.person.peopleYouKnow
                            || props.person.peopleYouKnow.length === 0) {
                            return (
                                <>
                                    <input id="person0" type="url" className="form-control mb-2"
                                           placeholder="Link to FOAF description"/>

                                    <input id="person1" type="url" className="form-control mb-2"
                                           placeholder="Link to FOAF description"/>

                                    <input id="person2" type="url" className="form-control mb-2"
                                           placeholder="Link to FOAF description"/>
                                </>
                            )
                        } else {
                            let i = 0;
                            return props.person.peopleYouKnow.map(p =>
                                <input key={"person" + i} id={"person" + i++} type="url"
                                       className="form-control mb-2" placeholder="Link to FOAF description"
                                       defaultValue={p}/>
                            );
                        }
                    })()}

                    <div className="text-right">
                        <button className="btn btn-sm btn-outline-success" title="Add field"
                                onClick={() => addField("peopleYouKnow", "person",
                                    "Link to FOAF description")}>
                            <i className="fa fa-plus"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}

export default PersonForm;
