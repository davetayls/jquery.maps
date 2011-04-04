/*
    v3 info window for jquery.maps plugin
----------------------------------------------------------*/
/*jslint undef: true */
/*global window */
(function ($, google) {

    var allWindows = [];

    // create maps namespace if doesn't exist
    $.maps = $.maps || {};

    // add info window functions
    $.extend($.maps, {
        v3infoWindow: function (map, marker) {

            // Now initialize all properties.
            this.map_ = map;
            this.marker_ = marker;

            // We define a property to hold the image's
            // div. We'll actually create this div
            // upon receipt of the add() method so we'll
            // leave it null for now.
            this.div_ = null;
            this.divContents_ = document.createElement('DIV');

            // Explicitly call setMap on this overlay
            this.setMap(map);
            allWindows.push(this);
        },
        allWindows: allWindows,
        hideAllWindows: function () {
            for (var i = 0; i < allWindows.length; i += 1) {
                allWindows[i].hide();
            }
        }
    });
    // inherit from OverlayView
    $.maps.v3infoWindow.prototype = new google.maps.OverlayView();

    $.maps.v3infoWindow.prototype.onAdd = function () {
        var self_ = this;
        // Note: an overlay's receipt of add() indicates that
        // the map's panes are now available for attaching
        // the overlay to the map via the DOM.

        // Create the DIV and set some basic attributes.
        var div = document.createElement('DIV');
        div.className = 'cp-map-infoWindow';
        div.style.border = "none";
        div.style.borderWidth = "0px";
        div.style.position = "absolute";

        // create inner element and attach it to the DIV.
        var divInner = document.createElement('DIV');
        divInner.className = 'cp-map-infoWindow-inner';
        var infoWindowHtml = '<div class="cp-map-infoWindow_tl"></div>' +
                             '<div class="cp-map-infoWindow_t"></div>' +
                             '<div class="cp-map-infoWindow_tr"></div>' +
                             '<div class="cp-map-infoWindow_l"></div>' +
                             '<div class="cp-map-infoWindow_r"></div>' +
                             '<div class="cp-map-infoWindow_bl"></div>' +
                             '<div class="cp-map-infoWindow_b"></div>' +
                             '<div class="cp-map-infoWindow_br"></div>' +
                             '<div class="cp-map-infoWindow_close"><img id="closeButton" src="/images/x-button.gif" /> </div>' +
                             '';
        divInner.innerHTML = infoWindowHtml;
        div.innerHTML = '<div class="cp-map-infoWindow_beak"></div>';
        div.appendChild(divInner);

        // create content element and attach it to the inner DIV.
        var divContents = this.divContents_;
        divContents.className = 'cp-map-infoWindow_contents';
        divInner.appendChild(divContents);

        // Set the overlay's div properties
        this.div_ = div;

        // We add an overlay to a map via one of the map's panes.
        // We'll add this overlay to the overlayImage pane.
        var panes = this.getPanes();
        panes.floatPane.appendChild(this.div_);
        this.hide();

        // add events
        google.maps.event.addListener(this.marker_, 'click', function () {
            self_.toggle();
        });



        this.marker_.showInfoWindow = function () {
            self_.show();

        };
        this.marker_.hideInfoWindow = function () {
            self_.hide();
        };
        this.marker_.toggleInfoWindow = function () {
            self_.toggle();
        };

        $('.cp-map-infoWindow_close').click(function () {
            // alert('Handler for .click() called.');
            self_.hide();
        });
    };
    $.maps.v3infoWindow.prototype.draw = function () {

        // Size and position the overlay. We use a southwest and northeast
        // position of the overlay to peg it to the correct position and size.
        // We need to retrieve the projection from this overlay to do this.
        var overlayProjection = this.getProjection();

        // Retrieve coordinates of this overlay
        // in latlngs and convert them to pixels coordinates.
        var coords = overlayProjection.fromLatLngToDivPixel(this.marker_.getPosition());
        //var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

        // position the DIV to fit the indicated dimensions.
        var div = this.div_;
        div.style.left = coords.x + 'px';
        div.style.top = coords.y + 'px';
    };

    $.maps.v3infoWindow.prototype.onRemove = function () {
        this.div_.parentNode.removeChild(this.div_);
    };
    // Note that the visibility property must be a string enclosed in quotes
    $.maps.v3infoWindow.prototype.hide = function () {
        if (this.div_) {
            this.div_.style.visibility = "hidden";
        }
    };
    $.maps.v3infoWindow.prototype.show = function () {
        $.maps.hideAllWindows();
        if (this.div_) {
            this.div_.style.visibility = "visible";
        }

    };
    $.maps.v3infoWindow.prototype.toggle = function () {
        if (this.div_) {
            if (this.div_.style.visibility === "hidden") {
                this.show();
                var cords = this.marker_.getPosition();
                this.map_.panTo(cords);
            } else {
                this.hide();
            }
        }
    };
    $.maps.v3infoWindow.prototype.toggleDOM = function () {
        if (this.getMap()) {
            this.setMap(null);
        } else {
            this.setMap(this.map_);
        }
    };
    $.maps.v3infoWindow.prototype.setContent = function (content) {
        if (typeof content === 'string') {
            this.divContents_.innerHTML = content;
        } else {
            this.divContents_.innerHTML = '';
            this.divContents_.appendChild(content);
        }
    };

})(window.jQuery, window.google);