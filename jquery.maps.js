/**
 * jQuery Maps v0.2 - http://the-taylors.org/jquery.maps
 * Requires jQuery 1.4.2
 *
 * Created by Dave Taylor http://the-taylors.org
 *
 *  The MIT License (MIT)
 *  Copyright (c) <2011> <Dave Taylor http://the-taylors.org>
 */
/*jslint browser: true, vars: true, white: true, forin: true, indent: 4 */
/*global google */
(function ($) {
    "use strict";

    var maps = {},
        infoWindow,
        maxNumberedPin = 100,
		DEFAULTS = {
		    gmapsUrl: 'http://maps.google.com/maps/api/js?sensor=false&async=2&callback=jQuery.maps.googleCallback',
		    centerPin: 'auto',
		    customPins: false,
		    customWindows: false
		},
        loadMapsApiXHR,
        loadingMapsApi = false,
        mapsApiLoaded = false,
        ON_MAPS_API_LOADED = 'onMapsApiLoaded',
        ON_PIN_CENTERED = 'onPinCentered';

    var log = function () {
        if (typeof window.console !== 'undefined') {
            window.console.log(arguments);
        }
    };

    var placeIcon = function (map, latlng, cssClass, settings) {
        var genericIcon;
        if (settings && settings.customPins) {
            genericIcon = new $.maps.v3pin(map, latlng, cssClass);
        } else {
            genericIcon = new google.maps.Marker({
                position: latlng,
                map: map
            });
        }
        return genericIcon;
    };

    var buildMap = function (mapElement, centerLatLng, zoom) {
        var map = new google.maps.Map(mapElement, {
            zoom: zoom,
            center: centerLatLng,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        return map;
    };

    var getGeoMicroFormatValues = function (geo) {
        var geo$ = $(geo);
        var values = {};
        values.lat = geo$.find(">.latitude").text();
        values.lng = geo$.find(">.longitude").text();
        values.zoom = parseInt(geo$.find(">.zoom").text(), 10);
        values.latlng = new google.maps.LatLng(values.lat, values.lng);
        return values;
    };

    var attachExternalInteractions = function () {
        $('body').delegate("a[href^='#']", 'click', function (ev) {
            var this$ = $(this),
                mapKey,
                pinID = this$.attr('href').replace('#', '');

            for (mapKey in maps) {
                var map = maps[mapKey];
                var pinDetails = map.pins[pinID];
                if (pinDetails) {
                    // if we want to show the info bubble
                    if (pinDetails.windowContents) {
                        if (pinDetails.pin.showInfoWindow) {
                            pinDetails.pin.showInfoWindow();
                        } else {
                            infoWindow.setContent(pinDetails.windowContents);
                            infoWindow.open(map.map, pinDetails.pin);
                        }
                    } else {
                        if (pinDetails.pin.centerOnMap) {
                            pinDetails.pin.centerOnMap();
                        } else {
                            map.map.panTo(pinDetails.pin.getPosition());
                        }
                    }
                    if (typeof map.settings.pinCentered === 'function') {
                        map.settings.pinCentered.call(map, pinDetails);
                    }
                    $.maps.pinCentered(map, pinDetails);
                    return false;
                }
            }
        });
    };

    /** 
    initialises the maps within the jQuery object (this)
    once the google api has been loaded
    */
    var initialiseMaps = function (settings) {
        this.each(function () {
            var self = $(this),
                mapHolder = self.find("> .maps-container").get(0),
                mapPinList$ = self.find(">.maps-pins"),
                mapPins$ = mapPinList$.find(">li");

            self.addClass("maps-loading");

            var mainGeo = getGeoMicroFormatValues(self.find('>.geo').get(0)),
                map = buildMap(mapHolder, mainGeo.latlng, mainGeo.zoom);

            var mapKey = self.attr('id') || 'mapinstance-' + (Math.floor((Math.random() * 1000)) + 100),
                pins = {};
            maps[mapKey] = { 'map': map, 'pins': pins, '$holder': self, 'settings': settings };

            if (mapPins$.length > 0) {
                // get pins
                mapPins$.each(function (i) {
                    var pin$ = $(this),
                        pinGeo,
                        newPin,
                        newInfoWindow,
                        windowContents;

                    pin$.find(".maps-pinLink").remove();
                    pinGeo = getGeoMicroFormatValues(pin$.find('>.geo').get(0));
                    if (pinGeo) {
                        newPin = placeIcon(map, pinGeo.latlng, pin$.attr("class"), settings);
                        if (newPin.setContent) {
                            newPin.setContent(i + 1);
                        }
                        if (pin$.children().filter(':not(.geo):not(.maps-pinLink)').length > 0) {
                            windowContents = pin$.html();
                        }
                        if (windowContents) {
                            if (settings.customWindows) {
                                newInfoWindow = new $.maps.v3infoWindow(map, newPin);
                                newInfoWindow.setContent(windowContents);
                            } else {
                                if (!infoWindow) {
                                    infoWindow = new google.maps.InfoWindow();
                                }
                                google.maps.event.addListener(newPin, 'click', function () {
                                    infoWindow.setContent(windowContents);
                                    infoWindow.open(map, newPin);
                                });
                            }
                        }
                        if (pin$.attr('id')) {
                            pins[pin$.attr('id')] = { pin: newPin, index: i, windowContents: windowContents };
                        } else {
                            pins[i + 1] = { pin: newPin, index: i };
                        }
                    }
                });

            }
            if (settings.centerPin === true || (settings.centerPin === 'auto' && mapPins$.length === 0)) {
                var centrePin = placeIcon(map, mainGeo.latlng, '', settings);
            }

            attachExternalInteractions();

            $(mapHolder).addClass("maps-container-applied");
            self.removeClass("maps-loading")
                .addClass("maps-loaded")
                .addClass("maps-applied");

        });
    };

    /** static functionality */
    $.maps = $.maps || {};
    $.extend($.maps, {
        getMapDetails: function (mapid) { return maps[mapid]; },
        placePin: function (mapid, lat, lng, pinClass) {
            var mapDet = this.getMapDetails(mapid),
				latlng = new google.maps.LatLng(lat, lng),
				newPin = placeIcon(mapDet.map, latlng, pinClass, mapDet.settings);
            return newPin;
        },
        setCenter: function (mapid, lat, lon) {
            var latlng = new google.maps.LatLng(lat, lon);
            maps[mapid].map.panTo(latlng);
        },
        loadGMapsApi: function (gmapsUrl) {
            if (!loadingMapsApi && !mapsApiLoaded) {
                log('loading api: ' + gmapsUrl);
                loadingMapsApi = true;
                $.maps.googleCallback = function () {
                    log('loaded api: ' + gmapsUrl);
                    if ($.maps.createV3Pin) {
                        $.maps.createV3Pin();
                    }
                    if ($.maps.createV3InfoWindow) {
                        $.maps.createV3InfoWindow();
                    }
                    $.maps.mapsApiLoaded();
                    mapsApiLoaded = true;
                    loadingMapsApi = false;
                };
                loadMapsApiXHR = $.getScript(gmapsUrl);
            }
            return loadMapsApiXHR;
        },
        mapsApiLoaded: function (listener) {
            if (listener) {
                $($.maps).bind(ON_MAPS_API_LOADED, listener);
            } else {
                $($.maps).trigger(ON_MAPS_API_LOADED);
            }
        },
        pinCentered: function (listener) {
            if (listener) {
                $($.maps).bind(ON_PIN_CENTERED, listener);
            } else {
                $($.maps).trigger(ON_PIN_CENTERED, arguments);
            }
        }
    });

    /** the main plugin function */
    $.fn.maps = function (options) {
        var self = this,
            settings = $.extend({}, DEFAULTS, options);
        if (this.length > 0) {
            if (window.google && window.google.maps) {
                initialiseMaps.call(self, settings);
            } else {
                $.maps.mapsApiLoaded(function () {
                    initialiseMaps.call(self, settings);
                });
                $.maps.loadGMapsApi(settings.gmapsUrl);
            }
        }
    };


} (window.jQuery));
