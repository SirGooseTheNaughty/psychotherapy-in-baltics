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