import axios from '../custom-axios/axios';

const FoafProfileRepository = {
    getPerson: (personUri) => {
        return axios.get("/api/foaf/profile", {
            headers: {
                personUri: personUri
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
