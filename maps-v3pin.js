/*global window */
(function ($, google) {
    var allPins = [];

    // create maps namespace if doesn't exist
    $.maps = $.maps || {};

    // add info window functions
    $.extend($.maps, {
        v3pin: function (map, latlng, pinClass) {

            // Now initialize all properties.
            this.map_ = map;
            this.latlng_ = latlng;
            this.pinClass_ = pinClass;

            // We define a property to hold the image's
            // div. We'll actually create this div
            // upon receipt of the add() method so we'll
            // leave it null for now.
            this.div_ = null;
            this.divContents_ = document.createElement('DIV');

            // Explicitly call setMap on this overlay
            this.setMap(map);
            allPins.push(this);
        }
    });
    $.maps.v3pin.prototype = new google.maps.OverlayView();
    $.maps.v3pin.prototype.onAdd = function () {
        var self_ = this;
        // Note: an overlay's receipt of add() indicates that
        // the map's panes are now available for attaching
        // the overlay to the map via the DOM.

        // Create the DIV and set some basic attributes.
        var div = document.createElement('DIV');
        div.className = 'cp-map-pin ' + this.pinClass_;
        div.style.position = "absolute";

        // create inner element and attach it to the DIV.
        var divInner = document.createElement('DIV');
        divInner.className = 'cp-map-pin-inner';
        div.appendChild(divInner);

        // create content element and attach it to the inner DIV.
        var divContents = this.divContents_;
        divContents.className = 'cp-map-pin-contents';
        divInner.appendChild(divContents);

        // Set the overlay's div properties
        this.div_ = div;

        // We add an overlay to a map via one of the map's panes.
        // We'll add this overlay to the overlayImage pane.
        var panes = this.getPanes();
        panes.overlayImage.appendChild(this.div_);

        this.div_.onclick = function () {
            google.maps.event.trigger(self_, 'click');
            return false;
        };

    };
    $.maps.v3pin.prototype.draw = function () {

        // Size and position the overlay. We use a southwest and northeast
        // position of the overlay to peg it to the correct position and size.
        // We need to retrieve the projection from this overlay to do this.
        var overlayProjection = this.getProjection();

        // Retrieve coordinates of this overlay
        // in latlngs and convert them to pixels coordinates.
        var coords = overlayProjection.fromLatLngToDivPixel(this.latlng_);

        // position the DIV to fit the indicated dimensions.
        var div = this.div_;
        div.style.left = coords.x + 'px';
        div.style.top = coords.y + 'px';
    };

    $.maps.v3pin.prototype.onRemove = function () {
        this.div_.parentNode.removeChild(this.div_);
    };
    // Note that the visibility property must be a string enclosed in quotes
    $.maps.v3pin.prototype.hide = function () {
        if (this.div_) {
            this.div_.style.visibility = "hidden";
        }
    };
    $.maps.v3pin.prototype.show = function () {
        $.maps.hideAllWindows();
        if (this.div_) {
            this.div_.style.visibility = "visible";
        }
    };
    $.maps.v3pin.prototype.toggle = function () {
        if (this.div_) {
            if (this.div_.style.visibility == "hidden") {
                this.show();

            } else {
                this.hide();
            }
        }
    };
    $.maps.v3pin.prototype.toggleDOM = function () {
        if (this.getMap()) {
            this.setMap(null);
        } else {
            this.setMap(this.map_);
        }
    };
    $.maps.v3pin.prototype.getPosition = function () {
        return this.latlng_;
    };
    $.maps.v3pin.prototype.setContent = function (content) {
        if (typeof content !== 'object') {
            this.divContents_.innerHTML = content;
        } else {
            this.divContents_.innerHTML = '';
            this.divContents_.appendChild(content);
        }
    };
    $.maps.v3pin.prototype.centerOnMap = function () {
        this.map_.panTo(this.latlng_);
    };
    $.maps.v3pin.prototype.moveTo = function (lat, lng) {
	    this.latlng_ = new google.maps.LatLng(lat,lng);
			
		var overlayProjection = this.getProjection();
        var coords = overlayProjection.fromLatLngToDivPixel(this.latlng_);

        // position the DIV to fit the indicated dimensions.
        var div = this.div_;
        div.style.left = coords.x + 'px';
        div.style.top = coords.y + 'px';
    };
	
})(window.jQuery, window.google);