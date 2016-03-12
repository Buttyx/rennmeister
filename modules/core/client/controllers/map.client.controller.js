'use strict';

angular.module('core').controller('MapController', ['$scope', '$stateParams', 'Authentication', 'TrackinginfosService', 'RacesParticipationsService', 'RacesService', '$timeout',
    function($scope, $stateParams, Authentication, TrackinginfosService, RacesParticipationsService, RacesService, $timeout) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
        var googleMapService = {},
            map,
            participantMarkers = [];

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

        function setParticipantMarker(map) {
            for (var i = 0; i < participantMarkers.length; i++) {
                participantMarkers[i].setMap(null);
            }
            participantMarkers = [];
            var raceParticipants = RacesParticipationsService.query({ race: $stateParams.raceId }, function() {
                for (var i in raceParticipants) {
                    var raceParticipant = raceParticipants[i];
                    var trackingInfo = raceParticipant.trackingInfo;
                    if (trackingInfo) {
                        if (trackingInfo.lng && trackingInfo.lat) {
                            var marker = new google.maps.Marker({
                                map: map,
                                draggable: false,
                                optimized: false,
                                position: { lat: trackingInfo.lat, lng: trackingInfo.lng },
                                icon: "http://www.willamettevalleynorml.org/images/bullet6.gif",
                                icon: "http://www.teknotrack.lk/wp-content/uploads/2015/12/positionFlash_icon.gif",
                                //icon: "http://herschel.esac.esa.int/hcss-doc-13.0/load/hipeowner/images/Run.gif",
                                title: raceParticipant.firstName + ' ' + raceParticipant.lastName + ' \n Puls: ' + trackingInfo.pulse,
                                zIndex: 100
                            });
                            participantMarkers.push(marker);
                            //var mapInfo = new google.maps.InfoWindow({ content: trackingInfo.participant + ' <br>Puls: ' + trackingInfo.pulse }).open(map, marker);
                        }

                    }

                }
            });
        }

        function setMessageMarker(map) {
            var marker = new google.maps.Marker({
                map: map,
                draggable: false,
                optimized: false,
                animation: google.maps.Animation.DROP,
                position: { lat: 47.403839, lng: 8.510123 },
                //icon: "http://prteamwork.com/styles/default/xenforo/smilies/poop.png" //18
                icon: "http://downloadicons.net/sites/default/files/shit-icon-9880.png" //32
                    //icon: "http://emojisaurus.com/images/emoji/poop.png"//64
                    //icon: "https://33.media.tumblr.com/avatar_5fcb9c36335a_128.png" //128
            });

            marker.addListener('click', function() {
                new google.maps.InfoWindow({ content: "This Dogshit was reported by <b>Matthias Fitzi</b>.<br>THANKS!" }).open(map, marker);
            });
        }

        function calculateAndDisplayRoute(directionsService, directionsDisplay) {
            var races = RacesService.get({ raceId: $stateParams.raceId }, function() {
                var waypts = [];
                var origin = {
                    lat: 47.050973,
                    lng: 8.309290
                }
                var destination = {
                    lat: 47.050973,
                    lng: 8.309290
                };
                var waypointsArray = races.waypoints;

                for (var i in waypointsArray) {
                    var waypoint = waypointsArray[i];
                    if (waypoint.type == "eat") {
                        var marker = new google.maps.Marker({
                            map: directionsDisplay.getMap(),
                            draggable: false,
                            optimized: false,
                            animation: google.maps.Animation.DROP,
                            position: { lat: waypoint.lat, lng: waypoint.lng },
                            icon: "http://d1zwyexo3ug1ac.cloudfront.net/revision-3b0d653/images/markers/icon_round_restaurant.png",
                            zIndex: 50
                        });
                    } else if (waypoint.type == "medi") {
                        var marker = new google.maps.Marker({
                            map: directionsDisplay.getMap(),
                            draggable: false,
                            optimized: false,
                            animation: google.maps.Animation.DROP,
                            position: { lat: waypoint.lat, lng: waypoint.lng },
                            icon: "http://www.tupalo.pl/images/markers/icon_round_health.png",
                            zIndex: 50
                        });
                    } else if (waypoint.type == "start") {
                        var marker = new google.maps.Marker({
                            map: directionsDisplay.getMap(),
                            draggable: false,
                            optimized: false,
                            animation: google.maps.Animation.DROP,
                            position: { lat: waypoint.lat, lng: waypoint.lng },
                            icon: "http://www.tupalo.at/images/markers/icon_round_education.png",
                            zIndex: 50
                        });
                    } else if (waypoint.type == "end") {
                        var marker = new google.maps.Marker({
                            map: directionsDisplay.getMap(),
                            draggable: false,
                            optimized: false,
                            animation: google.maps.Animation.DROP,
                            position: { lat: waypoint.lat, lng: waypoint.lng },
                            icon: "http://d1zwyexo3ug1ac.cloudfront.net/revision-fec650c/images/markers/icon_round_misc.png",
                            zIndex: 50
                        });
                    }
                    if (i == 0) {
                        origin.lat = waypoint.lat;
                        origin.lng = waypoint.lng;
                    } else if (i == waypointsArray.length - 1) {
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
                    optimizeWaypoints: false,
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

        function refreshLocation() {
            setParticipantMarker(map);

            $timeout(refreshLocation, 3000);
        };



        googleMapService.initMap = function() {
            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 18,
                center: {
                    lat: 47.384752,
                    lng: 8.521083
                }
            });
            /* //not needed anymore, shoud come from trackingInfo/raceParticipant
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
            }*/
            setMessageMarker(map);
            directionsDisplay.setMap(map);
            calculateAndDisplayRoute(directionsService, directionsDisplay);
            refreshLocation();
        }

        google.maps.event.addDomListener(window, 'load', googleMapService.initMap());



    }
]);
