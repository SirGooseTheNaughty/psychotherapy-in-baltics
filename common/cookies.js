function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {
    options = {
        path: '/',
        'max-age': 30000000,
        ...options
    };
    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }
    document.cookie = updatedCookie;
}

function deleteCookie(name) {
    setCookie(name, "", {
        'max-age': -1
    })
}

// function getLanguageCookie() {
//     return getCookie('lang');
// }
// function setLanguageCookie(lang) {
//     return setCookie('lang', lang);
// }
// function getLocationCookie() {
//     return getCookie('loc');
// }
// function setLocationCookie(loc) {
//     return setCookie('loc', loc);
// }
function getLanguageCookie() {
    return localStorage.getItem('lang');
}
function setLanguageCookie(lang) {
    return localStorage.setItem('lang', lang);
}
function getLocationCookie() {
    return localStorage.getItem('loc');
}
function setLocationCookie(loc) {
    return localStorage.setItem('loc', loc);
}