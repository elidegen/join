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
    let response = await fetch(BASE_SERVER_URL + '/nocors.php?json=database&noache=' + (new Date().getTime()));
    return await response.text();
}

/**
 * Saves a JSON or JSON Array to the Server
 */
function saveJSONToServer() {
    console.log('saveJSONtoserver obviously useless');
    // return new Promise(function (resolve, reject) {
    //     let xhttp = new XMLHttpRequest();
    //     let proxy = ''; // determineProxySettings();
    //     let serverURL = proxy + BASE_SERVER_URL + '/save_json.php';
    //     xhttp.open('POST', serverURL);

    //     xhttp.onreadystatechange = function (oEvent) {
    //         if (xhttp.readyState === 4) {
    //             if (xhttp.status >= 200 && xhttp.status <= 399) {
    //                 resolve(xhttp.responseText);
    //             } else {
    //                 reject(xhttp.statusText);
    //             }
    //         }
    //     };

    //     xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //     xhttp.send(JSON.stringify(jsonFromServer));

    // });
}


function determineProxySettings() {
    return '';

    if (window.location.href.indexOf('.developerakademie.com') > -1) {
        return '';
    } else {
        return 'https://cors-anywhere.herokuapp.com/';
    }
}
