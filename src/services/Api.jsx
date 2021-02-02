export default class Api {

    constructor(endpoint) {
        this.endpoint = endpoint;
        this.base_url = "https://localhost:5001/api/v2.0/";
    }

    Get(pageSize = 25, page = 0) {
        let url = this.base_url + this.endpoint + '?'
        url += '&PageSize=' + pageSize;
        url += '&PageNo=' + (page + 1);        
        return fetch(url)
            .then(response => this._isOk(response))
            .then(response => response.json())
            .catch(err => { throw new Error(err) });
    }

    Login(data) {
        let url = this.base_url + 'Account/Login'
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify(data);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        return fetch(url, requestOptions)
            .then(response => this._isOk(response))
            .then(result => result.text())
            .catch(error => { throw new Error(error) });
    }

    Post(data) {
        let url = this.base_url + this.endpoint
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + localStorage['token']);

        var raw = JSON.stringify(data);

        return fetch(url, {
            method: 'Post',
            headers: myHeaders,
            body: raw
        })
            .then(res => this._isOk(res))
            .then(response => response.json())
            .catch(err => { throw new Error(err) });
    }

    Put(data) {
        let url = this.base_url + this.endpoint
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + localStorage['token']);

        var raw = JSON.stringify(data);

        return fetch(url, {
            method: 'Put',
            headers: myHeaders,
            body: raw
        })
            .then(res => this._isOk(res))
            .then(response => response.json())
            .catch(err => { throw new Error(err) });
    }

    _isOk(response) {          
        if (response !== null && response.ok) {
            return response;
        } else {
            throw new Error(response.statusText);
        }
    }
}