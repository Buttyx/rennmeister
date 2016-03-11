'use strict';

angular.module('core').controller('MapController', ['$scope', 'Authentication',
    function($scope, Authentication) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
        var googleMapService = {};

        function getWayPointObj(lat, lng) {
            return {
                location: {
                    lat: lat,
                    lng: lng
                },
                stopover: true
            };
        }

        googleMapService.initMap = function() {
            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer();
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 13,
                center: {
                    lat: 47.384752,
                    lng: 8.521083
                }
            });
            var infoWindow = new google.maps.InfoWindow({
                map: map
            });

            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    infoWindow.setPosition(pos);
                    infoWindow.setContent('Location found.');
                    map.setCenter(pos);
                }, function() {
                    handleLocationError(true, infoWindow, map.getCenter());
                });
            } else {
                // Browser doesn't support Geolocation
                handleLocationError(false, infoWindow, map.getCenter());
            }

            var marker = new google.maps.Marker({
                map: map,
                draggable: false,
                optimized: false,
                animation: google.maps.Animation.DROP,
                position: { lat: 47.396955, lng: 8.500628 },
                icon: "http://prteamwork.com/styles/default/xenforo/smilies/poop.png"
            });

            directionsDisplay.setMap(map);
            calculateAndDisplayRoute(directionsService, directionsDisplay);
        }

        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
        }

        function calculateAndDisplayRoute(directionsService, directionsDisplay) {
            var waypts = [];
            waypts.push(getWayPointObj(47.390796, 8.523116));
            waypts.push(getWayPointObj(47.394805, 8.503804));
            waypts.push(getWayPointObj(47.398930, 8.494964));
            waypts.push(getWayPointObj(47.405379, 8.519769));
            waypts.push(getWayPointObj(47.392365, 8.524232));

            /*var checkboxArray = document.getElementById('waypoints');
            for (var i = 0; i < checkboxArray.length; i++) {
              if (checkboxArray.options[i].selected) {
                waypts.push({
                  location: checkboxArray[i].value,
                  stopover: true
                });
              }
            }*/

            directionsService.route({
                origin: {
                    lat: 47.384752,
                    lng: 8.521083
                },
                destination: {
                    lat: 47.384752,
                    lng: 8.521083
                },
                waypoints: waypts,
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.WALKING
            }, function(response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    var route = response.routes[0];
                    // For each route, display summary information.
                    for (var i = 0; i < route.legs.length; i++) {
                        var routeSegment = i + 1;
                        console.log("Segment " + routeSegment + ": " + route.legs[i].start_address + " -> " + route.legs[i].end_address + " (" + route.legs[i].distance.text + ")");
                    }
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        }
        google.maps.event.addDomListener(window, 'load', googleMapService.initMap());
    }
]);
