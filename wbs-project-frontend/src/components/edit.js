import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {Modal} from "react-bootstrap";

const Edit = (props) => {
    const [person, setPerson] = useState();
    const [showMessage, setShowMessage] = useState(false);

    const history = useHistory();

    useEffect(() => {
        if (!props.person) {
            history.goBack();
        }
        setPerson(props.currentEditedFoafProfile ? props.currentEditedFoafProfile : props.person);
    }, [props]);

    // const removeField = (parentId) => {
    //     const parent = document.getElementById(parentId);
    //     const numInputs = parent.children.length - 1;
    //     if (numInputs > 1) {
    //         let lastInput = parent.children.item(numInputs - 1);
    //         lastInput.remove();
    //     }
    // }

    const addField = (parentId, id, placeholder) => {
        const parent = document.getElementById(parentId);
        const numInputs = parent.children.length - 1;
        const newInput = document.createElement("input");
        newInput.setAttribute("id", id + numInputs.toString());
        newInput.setAttribute("type", "url");
        newInput.setAttribute("class", "form-control mb-2");
        newInput.setAttribute("placeholder", placeholder);
        parent.insertBefore(newInput, parent.children[numInputs]);
    }

    const getCurrentFoafProfile = () => {
        const sha1 = require('sha1');

        const title = document.getElementById("title").value;
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const nickname = document.getElementById("nickname").value;
        const gender = document.getElementById("gender").value;
        const basedNear = document.getElementById("basedNear").value;
        const image = document.getElementById("image").value;
        const email = document.getElementById("email").value;
        const hashedEmail = sha1(email);
        const hashEmail = document.getElementById("hashEmail").checked;
        const homepage = document.getElementById("homepage").value;
        const phone = document.getElementById("phone").value;
        const schools = [];
        const schoolsDiv = document.getElementById("schools");
        const numSchools = schoolsDiv.children.length - 1;
        for (let i = 0; i < numSchools; i++) {
            schools.push(schoolsDiv.children[i].value);
        }
        const workplaceHomepage = document.getElementById("workplaceHomepage").value;
        const workInfoHomepage = document.getElementById("workInfoHomepage").value;
        const publications = []
        const publicationsDiv = document.getElementById("publications");
        const numPublications = publicationsDiv.children.length - 1;
        for (let i = 0; i < numPublications; i++) {
            publications.push(publicationsDiv.children[i].value);
        }
        const accounts = []
        const accountsDiv = document.getElementById("accounts");
        const numAccounts = accountsDiv.children.length - 1;
        for (let i = 0; i < numAccounts; i++) {
            accounts.push(accountsDiv.children[i].value);
        }
        const peopleYouKnow = []
        const peopleYouKnowDiv = document.getElementById("peopleYouKnow");
        const numPeopleYouKnow = peopleYouKnowDiv.children.length - 1;
        for (let i = 0; i < numPeopleYouKnow; i++) {
            peopleYouKnow.push(peopleYouKnowDiv.children[i].value);
        }

        return {
            title: title,
            firstName: firstName,
            lastName: lastName,
            nickname: nickname,
            gender: gender,
            basedNear: basedNear,
            image: image,
            hashEmail: hashEmail,
            email: email,
            hashedEmail: hashedEmail,
            homepage: homepage,
            phone: phone,
            schools: schools,
            workplaceHomepage: workplaceHomepage,
            workInfoHomepage: workInfoHomepage,
            publications: publications,
            accounts: accounts,
            peopleYouKnow: peopleYouKnow
        };
    }

    const generateRdf = (currentFoafProfile) => {
        const N3 = require("n3");
        const sha1 = require("sha1");

        const {DataFactory} = N3;
        const {namedNode, literal} = DataFactory;
        const writer = new N3.Writer(
            {
                prefixes: {
                    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
                    foaf: "http://xmlns.com/foaf/0.1/"
                }
            });

        if (currentFoafProfile.firstName === "" || currentFoafProfile.lastName === ""
            || currentFoafProfile.email === "") {
            handleShowMessage();
            return false;
        }

        let hashedEmail = props.person.hashedEmail;
        if (props.person.email) {
            hashedEmail = sha1(props.person.email);
        }
        const personalProfileDocumentUri = "http://localhost:8080/foaf/profile/rdf/" + hashedEmail;
        const personUri = personalProfileDocumentUri + "#me";

        writer.addQuad(
            namedNode(personalProfileDocumentUri),
            namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
            namedNode("http://xmlns.com/foaf/0.1/PersonalProfileDocument")
        );
        writer.addQuad(
            namedNode(personalProfileDocumentUri),
            namedNode("http://xmlns.com/foaf/0.1/maker"),
            namedNode(personUri)
        );
        writer.addQuad(
            namedNode(personalProfileDocumentUri),
            namedNode("http://xmlns.com/foaf/0.1/primaryTopic"),
            namedNode(personUri)
        );
        writer.addQuad(
            namedNode(personUri),
            namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
            namedNode("http://xmlns.com/foaf/0.1/Person")
        );
        if (currentFoafProfile.title) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/title"),
                literal(currentFoafProfile.title)
            );
        }
        writer.addQuad(
            namedNode(personUri),
            namedNode("http://xmlns.com/foaf/0.1/firstName"),
            literal(currentFoafProfile.firstName)
        );
        writer.addQuad(
            namedNode(personUri),
            namedNode("http://xmlns.com/foaf/0.1/lastName"),
            literal(currentFoafProfile.lastName)
        );
        if (currentFoafProfile.nickname) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/nickname"),
                literal(currentFoafProfile.nickname)
            );
        }
        if (currentFoafProfile.gender) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/gender"),
                literal(currentFoafProfile.gender)
            );
        }
        if (currentFoafProfile.basedNear) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/based_near"),
                namedNode(currentFoafProfile.basedNear)
            );
        }
        if (currentFoafProfile.image) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/img"),
                namedNode(currentFoafProfile.image)
            );
        }
        if (currentFoafProfile.hashEmail) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/mbox_sha1sum"),
                literal(currentFoafProfile.hashedEmail)
            );
        } else {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/mbox"),
                namedNode(currentFoafProfile.email)
            );
        }
        if (currentFoafProfile.homepage) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/homepage"),
                namedNode(currentFoafProfile.homepage)
            );
        }
        if (currentFoafProfile.phone) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/phone"),
                namedNode(currentFoafProfile.phone)
            );
        }
        for (let i = 0; i < currentFoafProfile.schools.length; i++) {
            if (currentFoafProfile.schools[i]) {
                writer.addQuad(
                    namedNode(personUri),
                    namedNode("http://xmlns.com/foaf/0.1/schoolHomepage"),
                    namedNode(currentFoafProfile.schools[i])
                );
            }
        }
        if (currentFoafProfile.workplaceHomepage) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/workplaceHomepage"),
                namedNode(currentFoafProfile.workplaceHomepage)
            );
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/workInfoHomepage"),
                namedNode(currentFoafProfile.workInfoHomepage)
            );
        }
        for (let i = 0; i < currentFoafProfile.publications.length; i++) {
            if (currentFoafProfile.publications[i]) {
                writer.addQuad(
                    namedNode(personUri),
                    namedNode("http://xmlns.com/foaf/0.1/publications"),
                    namedNode(currentFoafProfile.publications[i])
                );
            }
        }
        for (let i = 0; i < currentFoafProfile.accounts.length; i++) {
            if (currentFoafProfile.accounts[i]) {
                writer.addQuad(
                    namedNode(personUri),
                    namedNode("http://xmlns.com/foaf/0.1/account"),
                    namedNode(currentFoafProfile.accounts[i])
                );
            }
        }
        for (let i = 0; i < currentFoafProfile.peopleYouKnow.length; i++) {
            if (currentFoafProfile.peopleYouKnow[i]) {
                writer.addQuad(
                    namedNode(personUri),
                    namedNode("http://xmlns.com/foaf/0.1/knows"),
                    writer.blank([{
                        predicate: namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
                        object: namedNode("http://xmlns.com/foaf/0.1/Person"),
                    }, {
                        predicate: namedNode("http://www.w3.org/2000/01/rdf-schema#seeAlso"),
                        object: namedNode(currentFoafProfile.peopleYouKnow[i]),
                    }])
                );
            }
        }

        let rdf = null;
        writer.end((error, result) => {
            rdf = result;
        });
        return rdf;
    }

    const generateAndShowRdf = () => {
        const currentFoafProfile = getCurrentFoafProfile();
        props.saveCurrentEditedFoafProfile(currentFoafProfile);
        const rdf = generateRdf(currentFoafProfile);
        props.generateRdf(rdf);
        if (!rdf) {
            return;
        }
        history.push("/view-edited-rdf");
    }

    const editFoafProfile = () => {
        const currentFoafProfile = getCurrentFoafProfile();
        const rdf = generateRdf(currentFoafProfile);
        if (!rdf) {
            return;
        }
        props.editFoafProfile(rdf);
        history.push("/");
    }

    const reset = () => {
        document.getElementById("title").value = props.person.title;
        document.getElementById("firstName").value = props.person.firstName;
        document.getElementById("lastName").value = props.person.lastName;
        document.getElementById("nickname").value = props.person.nickname;
        document.getElementById("gender").value = props.person.gender;
        document.getElementById("basedNear").value = props.person.basedNear;
        document.getElementById("image").value = props.person.image;
        document.getElementById("email").value = props.person.email
        document.getElementById("hashEmail").checked = !!props.person.hashedEmail;
        document.getElementById("homepage").value = props.person.homepage;
        document.getElementById("phone").value = props.person.phone;
        document.getElementById("workplaceHomepage").value = props.person.workplaceHomepage;
        document.getElementById("workInfoHomepage").value = props.person.workInfoHomepage;
        const schoolsDiv = document.getElementById("schools");
        const numSchools = schoolsDiv.children.length - 1;
        for (let i = 0; i < numSchools; i++) {
            if (i < props.person.schools.length) {
                schoolsDiv.children[i].value = props.person.schools[i]
            } else {
                schoolsDiv.children[i].value = ""
            }
        }
        const publicationsDiv = document.getElementById("publications");
        const numPublications = publicationsDiv.children.length - 1;
        for (let i = 0; i < numPublications; i++) {
            if (i < props.person.publications.length) {
                publicationsDiv.children[i].value = props.person.publications[i]
            } else {
                publicationsDiv.children[i].value = ""
            }
        }
        const accountsDiv = document.getElementById("accounts");
        const numAccounts = accountsDiv.children.length - 1;
        for (let i = 0; i < numAccounts; i++) {
            if (i < props.person.accounts.length) {
                accountsDiv.children[i].value = props.person.accounts[i]
            } else {
                accountsDiv.children[i].value = ""
            }
        }
        const peopleYouKnowDiv = document.getElementById("peopleYouKnow");
        const numPeopleYouKnow = peopleYouKnowDiv.children.length - 1;
        for (let i = 0; i < numPeopleYouKnow; i++) {
            if (i < props.person.peopleYouKnow.length) {
                peopleYouKnowDiv.children[i].value = props.person.peopleYouKnow[i]
            } else {
                peopleYouKnowDiv.children[i].value = ""
            }
        }

        setPerson(props.person);
    }

    const back = () => {
        props.reset();
        history.goBack();
    }

    const handleCloseMessage = () => setShowMessage(false);
    const handleShowMessage = () => setShowMessage(true);
    const messageModal = () => {
        return (
            <Modal show={showMessage} onHide={handleCloseMessage} animation={false}>
                <Modal.Body>
                    <div className="my-4">
                        You must enter your first name, last name and email address.
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

    return person ? (
        <>
            <div className="container mt-5">
                <div className="row">
                    <div className="col">
                        <div className="row">
                            <div className="col-9">
                                <div className="h3">
                                    Edit your personal FOAF profile
                                </div>
                            </div>
                            <div className="col-3 text-right">
                                <button className="btn btn-outline-dark mb-2 ml-2" title="Reset"
                                        onClick={reset}>
                                    <i className="fa fa-undo"/>
                                </button>
                                <button className="btn btn-outline-dark mb-2 ml-2" title="Back"
                                        onClick={back}>
                                    <i className="fa fa-arrow-left"/>
                                </button>
                            </div>
                        </div>
                        <hr/>
                    </div>
                </div>
                <div className="row mb-5">
                    <div className="col-12 col-lg-6 col-xl-4 mx-auto">
                        <h5 className="mt-4">Personal info</h5>
                        <hr/>
                        <div className="form-group mb-4">
                            <label htmlFor="title">Title</label>
                            <input id="title" type="text" className="form-control"
                                   placeholder="Mr, Ms, Miss, Dr., etc" defaultValue={person.title}/>
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="firstName">
                                First name
                                <span className="text-danger ml-1" title="Required">*</span>
                            </label>
                            <input id="firstName" type="text" className="form-control" placeholder="John"
                                   defaultValue={person.firstName}/>
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="lastName">
                                Last name
                                <span className="text-danger ml-1" title="Required">*</span>
                            </label>
                            <input id="lastName" type="text" className="form-control" placeholder="Smith"
                                   defaultValue={person.lastName}/>
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="nickname">Nickname</label>
                            <input id="nickname" type="text" className="form-control" placeholder="Johnny"
                                   defaultValue={person.nickname}/>
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="gender">Gender</label>
                            <input id="gender" type="text" className="form-control"
                                   placeholder="Male, Female, Prefer not to say, etc"
                                   defaultValue={person.gender}/>
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="basedNear">Based near</label>
                            <input id="basedNear" type="url" className="form-control"
                                   placeholder="https://dbpedia.org/resource/London"
                                   defaultValue={person.basedNear}/>
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="image">Image</label>
                            <input id="image" type="url" className="form-control"
                                   placeholder="https://example.com/image.jpg"
                                   defaultValue={person.image}/>
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
                                       defaultChecked={!!props.person.hashedEmail}
                                       className="mr-1"/>
                                Protect email address from spammers
                            </label>
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="homepage">Homepage</label>
                            <input id="homepage" type="url" className="form-control" placeholder="https://jsmith.com"
                                   defaultValue={person.homepage}/>
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="phone">Phone number</label>
                            <input id="phone" type="tel" className="form-control" placeholder="tel:0038970123456"
                                   defaultValue={person.phone}/>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6 col-xl-4 mx-auto">
                        <h5 className="mt-4">Schools</h5>
                        <hr/>
                        <div id="schools" className="form-group mb-4">
                            {(() => {
                                if (!person.schools
                                    || person.schools.length === 0) {
                                    return <input id="schoolHomepage0" type="url" className="form-control mb-2"
                                                  placeholder="Link to school's homepage"/>
                                } else {
                                    let i = 0;
                                    return person.schools.map(s =>
                                        <input key={"schoolHomepage" + i} id={"schoolHomepage" + i++} type="url"
                                               className="form-control mb-2" placeholder="Link to school's homepage"
                                               defaultValue={s}/>
                                    );
                                }
                            })()}

                            <div className="text-right">
                                {/*<button className="btn btn-sm btn-outline-danger mr-1" title="Remove field"*/}
                                {/*        onClick={() => removeField("schools")}>*/}
                                {/*    <i className="fa fa-minus"/>*/}
                                {/*</button>*/}
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
                                   defaultValue={person.workplaceHomepage}/>
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="workInfoHomepage">Work info homepage (What do you do at work?)</label>
                            <input id="workInfoHomepage" type="url" className="form-control"
                                   placeholder="https://workinfo.com"
                                   defaultValue={person.workInfoHomepage}/>
                        </div>

                        <h5 className="mt-5">Publications</h5>
                        <hr/>
                        <div id="publications" className="form-group mb-4">
                            {(() => {
                                if (!person.publications
                                    || person.publications.length === 0) {
                                    return <input id="publication0" type="url" className="form-control mb-2"
                                                  placeholder="Link to published document"/>
                                } else {
                                    let i = 0;
                                    return person.publications.map(p =>
                                        <input key={"publication" + i} id={"publication" + i++} type="url"
                                               className="form-control mb-2" placeholder="Link to published document"
                                               defaultValue={p}/>
                                    );
                                }
                            })()}

                            <div className="text-right">
                                {/*<button className="btn btn-sm btn-outline-danger mr-1" title="Remove field"*/}
                                {/*        onClick={() => removeField("publications")}>*/}
                                {/*    <i className="fa fa-minus"/>*/}
                                {/*</button>*/}
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
                                if (!person.accounts
                                    || person.accounts.length === 0) {
                                    return <input id="account0" type="url" className="form-control mb-2"
                                                  placeholder="Link to social media or other online accounts"/>
                                } else {
                                    let i = 0;
                                    return person.accounts.map(a =>
                                        <input key={"account" + i} id={"account" + i++} type="url"
                                               className="form-control mb-2"
                                               placeholder="Link to social media or other online accounts"
                                               defaultValue={a}/>
                                    );
                                }
                            })()}

                            <div className="text-right">
                                {/*<button className="btn btn-sm btn-outline-danger mr-1" title="Remove field"*/}
                                {/*        onClick={() => removeField("accounts")}>*/}
                                {/*    <i className="fa fa-minus"/>*/}
                                {/*</button>*/}
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
                                if (!person.peopleYouKnow
                                    || person.peopleYouKnow.length === 0) {
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
                                    return person.peopleYouKnow.map(p =>
                                        <input key={"person" + i} id={"person" + i++} type="url"
                                               className="form-control mb-2" placeholder="Link to FOAF description"
                                               defaultValue={p}/>
                                    );
                                }
                            })()}

                            <div className="text-right">
                                {/*<button className="btn btn-sm btn-outline-danger mr-1" title="Remove field"*/}
                                {/*        onClick={() => removeField("peopleYouKnow")}>*/}
                                {/*    <i className="fa fa-minus"/>*/}
                                {/*</button>*/}
                                <button className="btn btn-sm btn-outline-success" title="Add field"
                                        onClick={() => addField("peopleYouKnow", "person",
                                            "Link to FOAF description")}>
                                    <i className="fa fa-plus"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mb-5">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-4 mx-auto">
                        <button className="btn btn-block btn-primary mb-4" onClick={generateAndShowRdf}>
                            Generate RDF
                        </button>

                        <button className="btn btn-block btn-success" onClick={editFoafProfile}>
                            Edit
                        </button>
                    </div>
                </div>
            </div>
            {messageModal()}
        </>
    ) : null;
}

export default Edit;
