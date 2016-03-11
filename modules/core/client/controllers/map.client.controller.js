'use strict';

angular.module('core').controller('MapController', ['$scope', '$stateParams','Authentication', 'TrackinginfosService', 'RacesService',
    function($scope, $stateParams, Authentication, TrackinginfosService, RacesService) {
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

        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
        }

        function calculateAndDisplayRoute(directionsService, directionsDisplay) {
            var races = RacesService.get({raceId: $stateParams.raceId }, function() {
                var waypts = [];
                var origin = {
                        lat: 47.050973,
                        lng: 8.309290
                    }
                var destination = {
                        lat: 47.050973,
                        lng: 8.309290
                    };
                
                for (var i in races.waypoints){
                    var waypoint = races.waypoints[i];
                    if (i == 0){
                        origin.lat = waypoint.lat;
                        origin.lng = waypoint.lng;
                    } else if (i == races.waypoints.length-1){
                        destination.lat = waypoint.lat;
                        destination.lng = waypoint.lng;
                    } else {
                        //alert("test: " + JSON.stringify(waypoint));
                        waypts.push(getWayPointObj(waypoint.lat, waypoint.lng));
                    }
                    
                }

                directionsService.route({
                    origin: origin,
                    destination: destination,
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
            });
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
                    infoWindow.setContent('Xavier Butty <br>Position: 1<br>Puls: 120');
                    map.setCenter(pos);
                }, function() {
                    handleLocationError(true, infoWindow, map.getCenter());
                });
            } else {
                // Browser doesn't support Geolocation
                handleLocationError(false, infoWindow, map.getCenter());
            }

            new google.maps.Marker({
                map: map,
                draggable: false,
                optimized: false,
                animation: google.maps.Animation.DROP,
                position: { lat: 47.396955, lng: 8.500628 },
                icon: "http://downloadicons.net/sites/default/files/shit-icon-9880.png"
            });
            var marker = new google.maps.Marker({
                map: map,
                draggable: false,
                optimized: false,
                animation: google.maps.Animation.DROP,
                position: { lat: 47.403839, lng: 8.510123 },
                //icon: "http://prteamwork.com/styles/default/xenforo/smilies/poop.png" //18
                icon: "http://downloadicons.net/sites/default/files/shit-icon-9880.png"//32
                //icon: "http://emojisaurus.com/images/emoji/poop.png"//64
                //icon: "https://33.media.tumblr.com/avatar_5fcb9c36335a_128.png" //128
            });

            marker.addListener('click', function() {
                new google.maps.InfoWindow({ content: "This Dogshit was reported by <b>Matthias Fitzi</b>.<br>THANKS!" }).open(map, marker);
            });

            directionsDisplay.setMap(map);
            calculateAndDisplayRoute(directionsService, directionsDisplay);
        }

        google.maps.event.addDomListener(window, 'load', googleMapService.initMap());

    }
]);
