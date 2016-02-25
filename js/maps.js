function formatFunction(fn, codeDiv) {
    codeDiv.innerText = fn.toString()
        .replace(/^            \}$/gm, '')
        .replace(/                (\S)/gm, '$1')
        .replace(/^function \(\) \{$/gm, '')
        .replace(/^(.{75}).+$/gm, '$1 ...')
        .trim();
    hljs.highlightBlock(codeDiv);
}

L.Map.addInitHook(function() {
    var slides = document.querySelector('.slides'),
        zoom = Number(slides.style.zoom);

    if (!zoom) {
        zoom = Number(slides.style.transform.replace(/.*scale\(([0-9\.]+)\).*/, '$1'));
    }

    this._container.style.zoom = 1/zoom;
    this.invalidateSize();
});

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

window.coordinatesMap = (function() {
    var map;

    return {
        start: function() {
            map = L.map('coordinates-map');
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            map.setView([0, 0], 1);
        },
        stop: function() {
            map.remove();
        }
    };
})();

window.layersMap = (function() {
    var steps = [
            function() {
                L.marker([57.6991, 11.9321]).addTo(map);
            },
            function() {
                L.marker([57.6991, 11.9321], {draggable: true}).addTo(map);
            },
            function() {
                var coords = [[57.6991, 11.9320],[57.6986, 11.9325],[57.6995, 11.9366],[57.6992, 11.9411],[57.7003, 11.9520],[57.6998, 11.9609],[57.7012, 11.9691],[57.7049, 11.9772],[57.7074, 11.9776]],
                    line = L.polyline(coords.slice(0, 2)).addTo(map),
                    counter = 2,
                    timer = setInterval(function() {
                        if (counter < coords.length) {
                            line.spliceLatLngs(counter, 0, coords[counter++]);
                        } else {
                            clearInterval(timer);
                        }
                    }, 1000);
            },
            function() {
                var coords = [[57.6991, 11.9320],[57.6986, 11.9325],[57.6995, 11.9366],[57.6992, 11.9411],[57.7003, 11.9520],[57.6998, 11.9609],[57.7012, 11.9691],[57.7049, 11.9772],[57.7074, 11.9776]];

                outline = L.polyline(coords, {color: 'black', opacity: 0.4, weight: 13}).addTo(map);
                L.polyline(coords, {color: 'white', opacity: 1.0, weight: 11}).addTo(map);
                L.polyline(coords, {color: 'blue',  opacity: 1.0, weight:  5}).addTo(map);
            },
            function() {
                outline.bringToFront();
            },
            function() {
                outline.bringToBack();
            },
            function() {
                var coords = [[[57.6858, 11.9276],[57.6869, 11.9281],[57.6873, 11.9320],[57.6928, 11.9381],[57.6935, 11.9455],[57.6902, 11.9462],[57.6901, 11.9525],[57.6852, 11.9517],[57.6807, 11.9458],[57.6809, 11.9440],[57.6798, 11.9359],[57.6833, 11.9323],[57.6858, 11.9276]]];
                L.polygon(coords).addTo(map);
            },
            function() {
                L.circle([57.7010, 11.9759], 200).addTo(map);
            },
            function() {
                L.circleMarker([57.7010, 11.9759], {className: 'pulse-marker'}).addTo(map);
                /* 
                .pulse-marker {
                    stroke: red;
                    stroke-width: 2;
                    stroke-opacity: .5;
                    fill: red;
                    fill-opacity: .9;
                    animation: pulse 2s ease-out;
                    animation-iteration-count: infinite;
                }

                @keyframes pulse {
                    from {
                        stroke-width: 15;
                        stroke-opacity: 1
                    }

                    to {
                        stroke-width: 50;
                        stroke-opacity: 0
                    }
                }
                */
            },
            function() {
                L.marker([57.6946, 11.9920])
                    .addTo(map)
                    .bindPopup('<h3>Liseberg</h3>');
            },
            function() {
                L.popup()
                    .setLatLng([57.6983, 11.9712])
                    .setContent('<h3>Vasaparken</h3>')
                    .openOn(map);
            }
        ],
        step = 0,
        codeDiv = document.querySelector('#layers-map-code'),
        outline,
        map;

    return {
        start: function() {
            map = L.map('layers-map');
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            map.setView([57.694, 11.96], 13);

            map.on('click', function() {
                var fn = steps[step++];
                if (!fn) return;
                fn();
                formatFunction(fn, codeDiv);
            });
        },
        stop: function() {
            step = 0;
            map.eachLayer(function(l) { map.removeLayer(l); });
            map.remove();
            codeDiv.innerHTML = '';
        }
    };
})();

window.interactionMap = (function() {
    var map;
    var codeDiv = document.querySelector('#interaction-code');

    return {
        start: function() {
            var interactionFn = function() {
                map.on('click', function(e) {
                    var c = e.latlng;
                    L.popup()
                        .setLatLng(c)
                        .setContent('<h3>You clicked ' + c.lat.toPrecision(6) + ', ' + c.lng.toPrecision(6) + '</h3>')
                        .openOn(map);
                });
            }

            map = L.map('interaction-map');
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            map.setView([57.7, 11.96], 13);

            interactionFn();

            formatFunction(interactionFn, codeDiv);
        },
        stop: function() {
            map.remove();
        }
    };
})();
