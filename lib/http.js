class Http {
  static fetchData(url) {
    return new Promise((resolve, reject) => {
        const HTTP = new XMLHttpRequest();
        HTTP.open('GET', url);
        HTTP.onreadystatechange = function() {
          if(HTTP.readyState == XMLHttpRequest.DONE) {
            const RESPONSE_DATA = JSON.parse(HTTP.responseText);
            
            HTTP.status == 200 
              ? resolve(RESPONSE_DATA)
              : reject(RESPONSE_DATA);
          }
        }
        HTTP.send();
    });
  }
}

export default Http;