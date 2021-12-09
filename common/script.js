const gridSizes = [
    { v: 200, h: 193 },
    { v: 163, h: 157 },
    { v: 107, h: 103 },
    { v: 119, h: 115 },
    { v: 155, h: 150 },
];

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

async function getLocationRequest() {
    let location = 'LV';
    const possibleLocations = ['LV', 'LT', 'EST'];
    await fetch("https://ipinfo.io/json?token=7d5e135dc72ae9")
        .then(res => res.json())
        .then(res => location = res.country)
        .catch(console.log);
    if (!possibleLocations.includes(location)) {
        location = 'LV';
    }
    return location;
}