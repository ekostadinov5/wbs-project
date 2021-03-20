import axios from '../custom-axios/axios';

const FoafProfileRepository = {
    getPersonByUri: (personUri) => {
        return axios.get("/api/foaf/profile/uri", {
            headers: {
                personUri: personUri
            }
        });
    },
    getPerson: (email, hashedEmail) => {
        return axios.get("/api/foaf/profile", {
            headers: {
                email: email,
                hashedEmail: hashedEmail
            }
        });
    },
    getFriends: (friendProfileUris) => {
        return axios.get("/api/foaf/profile/friend", {
            headers: {
                friendProfileUris: friendProfileUris
            }
        });
    },
    createFoafProfile: (email, rdf) => {
        return axios.post("/api/foaf/profile", rdf, {
            headers: {
                'Content-Type': 'application/json',
                email: email
            }
        });
    },
    editFoafProfile: (email, personUri, rdf) => {
        return axios.patch("/api/foaf/profile", rdf, {
            headers: {
                'Content-Type': 'application/json',
                email: email,
                personUri: personUri
            }
        });
    },
    deleteFoafProfile: (email, personUri) => {
        return axios.delete("/api/foaf/profile", {
            headers: {
                'Content-Type': 'application/json',
                email: email,
                personUri: personUri
            }
        });
    }
};

export default FoafProfileRepository;
