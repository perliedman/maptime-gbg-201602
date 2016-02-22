window.brokenMap = (function() {
    var map;

    return {
        start: function() {
            map = L.map('broken-map');
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
        },
        stop: function() {
            map.remove();
        }
    };
})();

window.workingMap = (function() {
    var map;

    return {
        start: function() {
            map = L.map('working-map');
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            map.setView([57.7, 11.96], 13);
        },
        stop: function() {
            map.remove();
        }
    };
})();
