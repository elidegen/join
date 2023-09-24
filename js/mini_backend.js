let jsonFromServer = {};
let BASE_SERVER_URL;

const backendOld = {
    setItem: function (key, item) {
        jsonFromServer[key] = item;
        return saveJSONToServer();
    },
    getItem: function (key) {
        if (!jsonFromServer[key]) {
            return null;
        }
        return jsonFromServer[key];
    },
    deleteItem: function (key) {
        delete jsonFromServer[key];
        return saveJSONToServer();
    }
};

const backend = {
    setItem: async function (key, value) {
        const payload = { key, value, token: storageToken };
        return fetch(storageUrl, { method: 'POST', body: JSON.stringify(payload) })
            .then(res => res.json());
    },

    getItem: async function (key) {
        const url = `${storageUrl}?key=${key}&token=${storageToken}`;
        return fetch(url).then(res => res.json()).then(res => res.data.value);
    }
};

function setURL(url) {
    BASE_SERVER_URL = url;
}

/**
 * Loads a JSON or JSON Array to the Server
 * payload {JSON | Array} - The payload you want to store
 */
async function loadJSONFromServer() {
    console.log('loadjsonfromserver useless');
    let response = await fetch(BASE_SERVER_URL + '/nocors.php?json=database&noache=' + (new Date().getTime()));
    return await response.text();
}


function determineProxySettings() {
    return '';

    if (window.location.href.indexOf('.developerakademie.com') > -1) {
        return '';
    } else {
        return 'https://cors-anywhere.herokuapp.com/';
    }
}
