/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest;
    let url;
    let method;
    let data;

    if (options.method) {
        data = Object.entries(options.data);
        method = options.method;
        url = options.url;
        if (method === 'GET') {
            for ([key, value] of data) {
                url += key + '=' + value + '&';
            }
        } 
        if (method !== 'GET') {
            this.formData = new FormData;
            for ([key, value] of data) {
                formData.append(key, value);
            }
        }
    }

    xhr.responseType = 'json';

    try {
        xhr.open(method, url);
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState == xhr.DONE) {
                options.callback(xhr.response.error, xhr.response);
            }
        })
    } catch (error) {
        console.error(error);
    }

    // if (options.method == 'GET') {
    //     xhr.open( options.method, options.url + '?mail=' + options.data.mail + '&password=' + options.data.password );
    //     xhr.responseType = 'json';
    //     xhr.send();
    // } else {
    //     const formData = new FormData();

    //     formData.append( 'mail', options.data.mail );
    //     formData.append( 'password', options.data.password );
        
    //     xhr.open( options.method, options.url );
    //     xhr.responseType = 'json';
    //     xhr.send( formData );
    // }

    // xhr.addEventListener('readystatechange', () => {
    //     if (xhr.readyState == xhr.DONE) {
    //         const res = xhr.response;
    //         options.callback(res.error, res.user);
    //     }
    // })


}
