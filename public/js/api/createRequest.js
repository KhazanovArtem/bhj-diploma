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
        if (options.data) {
            data = Object.entries(options.data);
        }
        method = options.method;
        url = options.url;
        if (method === 'GET') {
            if (options.data) {
                this.formData = new FormData();
                for ([key, value] of data) {
                    url += '?' + key + '=' + value;
                    this.formData.append(key, value);
                }
            }
        } 
        if (method !== 'GET') {
            if (options.data) {
                this.formData = new FormData();
                for ([key, value] of data) {
                    this.formData.append(key, value);
                }
            }
        
        }
    }

    try {
        xhr.open(method, url);
        xhr.responseType = 'json';
        if (options.data) {
            xhr.send(formData);
        } else {
            xhr.send();
        }
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState == xhr.DONE) {
                options.callback(xhr.response.error, xhr.response);
            }
        })
    } catch (error) {
        console.error(error);
    }

}
