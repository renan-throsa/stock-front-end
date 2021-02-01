export default class Api {

    constructor(endpoint) {
        this.endpoint = endpoint;
        this.base_url = "https://localhost:5001/api/v2.0/";
    }

    Get(query) {
        let url = this.base_url + this.endpoint + '?'
        console.log(url);
        url += '&PageSize=' + query.pageSize;
        url += '&PageNo=' + (query.page + 1);
        return fetch(url)
            .then(response => this._isOk(response))
            .then(response => response.json())
            .catch(err => console.log(err))
    }

    Post() { }

    Puu() { }

    _isOk(response) {

        if (response !== null && response.ok) {
            return response;
        } else {
            throw new Error(response.statusText);
        }
    }
}