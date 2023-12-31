import { useState } from 'react';

function useFetch(url, method, body, token) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
  
    const options = {
        method: method,
        headers: {}
    };
    if(method === "POST" || method === "PATCH") {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
    }
    if(token !== null) {
        options.headers["Authorization"] = "Basic " + token;
    }

    const fetchMethod = () => {
        console.log(options);
        fetch(url, options).then(data => {
            data.json().then(json => {
                setLoading(false);
                if(json.error !== undefined) {
                    setData(null)
                    setError(json);
                } else {
                    setData(json);
                    setError(null);
                }
            });
        });
    };
  
    return { fetchMethod, loading, data, error };
}

export default useFetch;