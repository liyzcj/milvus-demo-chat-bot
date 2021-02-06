declare global {
    interface Window {
        _env_: any;
    }
}
let endpoint = `http://40.117.75.127:5005`;
if (window._env_ && window._env_.API_URL) {
    endpoint = window._env_.API_URL;
}

export const Load = `${endpoint}/qa/load`;
export const Search = `${endpoint}/qa/search`;
export const Answer = `${endpoint}/qa/answer`;

export const ClearAll = `${endpoint}/api/v1/delete`;
