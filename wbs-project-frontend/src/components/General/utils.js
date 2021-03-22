
const isValidUrl = (url) => {
    try {
        new URL(url);
    } catch (e) {
        return false;
    }
    return true;
}

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

const getPerson = () => {
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

const generateRdf = (foafProfile) => {
    const N3 = require('n3');

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

    const personalProfileDocumentUri = foafProfile.personalProfileDocumentUri;
    const personUri = foafProfile.uri;

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
    if (foafProfile.title) {
        writer.addQuad(
            namedNode(personUri),
            namedNode("http://xmlns.com/foaf/0.1/title"),
            literal(foafProfile.title)
        );
    }
    writer.addQuad(
        namedNode(personUri),
        namedNode("http://xmlns.com/foaf/0.1/firstName"),
        literal(foafProfile.firstName)
    );
    writer.addQuad(
        namedNode(personUri),
        namedNode("http://xmlns.com/foaf/0.1/lastName"),
        literal(foafProfile.lastName)
    );
    if (foafProfile.nickname) {
        writer.addQuad(
            namedNode(personUri),
            namedNode("http://xmlns.com/foaf/0.1/nickname"),
            literal(foafProfile.nickname)
        );
    }
    if (foafProfile.gender) {
        writer.addQuad(
            namedNode(personUri),
            namedNode("http://xmlns.com/foaf/0.1/gender"),
            literal(foafProfile.gender)
        );
    }
    if (foafProfile.basedNear) {
        if (isValidUrl(foafProfile.basedNear)) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/based_near"),
                namedNode(foafProfile.basedNear)
            );
        } else {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/based_near"),
                literal(foafProfile.basedNear)
            );
        }
    }
    if (foafProfile.image) {
        writer.addQuad(
            namedNode(personUri),
            namedNode("http://xmlns.com/foaf/0.1/img"),
            namedNode(foafProfile.image)
        );
    }
    if (foafProfile.hashedEmail) {
        writer.addQuad(
            namedNode(personUri),
            namedNode("http://xmlns.com/foaf/0.1/mbox_sha1sum"),
            literal(foafProfile.hashedEmail)
        );
    } else {
        writer.addQuad(
            namedNode(personUri),
            namedNode("http://xmlns.com/foaf/0.1/mbox"),
            namedNode(foafProfile.email)
        );
    }
    if (foafProfile.homepage) {
        writer.addQuad(
            namedNode(personUri),
            namedNode("http://xmlns.com/foaf/0.1/homepage"),
            namedNode(foafProfile.homepage)
        );
    }
    if (foafProfile.phone) {
        writer.addQuad(
            namedNode(personUri),
            namedNode("http://xmlns.com/foaf/0.1/phone"),
            namedNode(foafProfile.phone)
        );
    }
    for (let i = 0; i < foafProfile.schools.length; i++) {
        if (foafProfile.schools[i]) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/schoolHomepage"),
                namedNode(foafProfile.schools[i])
            );
        }
    }
    if (foafProfile.workplaceHomepage) {
        writer.addQuad(
            namedNode(personUri),
            namedNode("http://xmlns.com/foaf/0.1/workplaceHomepage"),
            namedNode(foafProfile.workplaceHomepage)
        );
    }
    if (foafProfile.workInfoHomepage) {
        writer.addQuad(
            namedNode(personUri),
            namedNode("http://xmlns.com/foaf/0.1/workInfoHomepage"),
            namedNode(foafProfile.workInfoHomepage)
        );
    }
    for (let i = 0; i < foafProfile.publications.length; i++) {
        if (foafProfile.publications[i]) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/publications"),
                namedNode(foafProfile.publications[i])
            );
        }
    }
    for (let i = 0; i < foafProfile.accounts.length; i++) {
        if (foafProfile.accounts[i]) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/account"),
                namedNode(foafProfile.accounts[i])
            );
        }
    }
    for (let i = 0; i < foafProfile.peopleYouKnow.length; i++) {
        if (foafProfile.peopleYouKnow[i]) {
            writer.addQuad(
                namedNode(personUri),
                namedNode("http://xmlns.com/foaf/0.1/knows"),
                writer.blank([{
                    predicate: namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
                    object: namedNode("http://xmlns.com/foaf/0.1/Person"),
                }, {
                    predicate: namedNode("http://www.w3.org/2000/01/rdf-schema#seeAlso"),
                    object: namedNode(foafProfile.peopleYouKnow[i]),
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

const personValidationMessage = (person) => {
    let message = ""
    if (person.firstName === "" || person.lastName === "" || person.email === "") {
        message += "You must enter your first name, last name and email address.\n";
    }
    if (!person.email.startsWith("mailto:")) {
        message += "Your email address must have the prefix 'mailto:'.\n";
    }
    if (person.phone && !person.phone.startsWith("tel:")) {
        message += "Your phone number must have the prefix 'tel:'.\n";
    }
    if (person.image && !isValidUrl(person.image)) {
        message += "The link to your image must be a valid URL.\n";
    }
    if (person.homepage && !isValidUrl(person.homepage)) {
        message += "The link to your homepage must be a valid URL.\n";
    }
    if (person.workplaceHomepage && !isValidUrl(person.workplaceHomepage)) {
        message += "The link to your workplace homepage must be a valid URL.\n";
    }
    if (person.workInfoHomepage && !isValidUrl(person.workInfoHomepage)) {
        message += "The link to your work info homepage must be a valid URL.\n";
    }
    for (let i = 0; i < person.schools.length; i++) {
        if (person.schools[i] && !isValidUrl(person.schools[i])) {
            message += "The link to your school's homepage - '" + person.schools[i] + "' is not a valid URL.\n";
        }
    }
    for (let i = 0; i < person.publications.length; i++) {
        if (person.publications[i] && !isValidUrl(person.publications[i])) {
            message += "The link to your publication - '" + person.publications[i] + "' is not a valid URL.\n";
        }
    }
    for (let i = 0; i < person.accounts.length; i++) {
        if (person.accounts[i] && !isValidUrl(person.accounts[i])) {
            message += "The link to your account - '" + person.accounts[i] + "' is not a valid URL.\n";
        }
    }
    for (let i = 0; i < person.peopleYouKnow.length; i++) {
        if (person.peopleYouKnow[i] && !isValidUrl(person.peopleYouKnow[i])) {
            message += "The link to your friend - '" + person.peopleYouKnow[i] + "' is not a valid URL.\n";
        }
    }
    return message;
}

export {isValidUrl, addField, getPerson, generateRdf, personValidationMessage};
