
const LocalStorageService = (() => {

    let _service;

    const _getService = () => {
        if (_service) {
            _service = this;
        }
        return _service
    };

    const _setToken = (token) => {
        localStorage.setItem("access_token", token);
    };

    const _getToken = () => {
        return localStorage.getItem("access_token");
    };

    const _clearToken = () => {
        localStorage.removeItem("access_token");
    };

    const _setIdentifier = (identifier) => {
        localStorage.setItem("identifier", identifier);
    };

    const _getIdentifier = () => {
        return localStorage.getItem("identifier");
    };

    const _clearIdentifier = () => {
        localStorage.removeItem("identifier");
    };

    return {
        getService: _getService,
        setToken: _setToken,
        getToken: _getToken,
        clearToken: _clearToken,
        setIdentifier: _setIdentifier,
        getIdentifier: _getIdentifier,
        clearIdentifier: _clearIdentifier
    };

})();

export default LocalStorageService;
