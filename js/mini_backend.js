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