
jQuery Google Maps Plugin
=========================
Created by Dave Taylor http://the-taylors.org/jquery.maps

This is an attempt at creating accessible mapping functionality based on the Google maps api.

It will turn markup like the following in to a full blown Google map.

	<div id="map">
        <h2 class="maps-title">Map Details: <a href="#map-skip">skip</a></h2>
        <div class="geo">
			<span class="latitude">13.251</span>, <span class="longitude">123.684</span>.
			Zoom: <span class="zoom">10</span>
		</div>
        <div class="maps-container"></div>
        <ul class="maps-pins">
            <li>
                <div class="geo"><span class="latitude">13.251</span>, <span class="longitude">123.684</span>.</div>
                <a target="_blank" class="maps-pinLink" href="http://maps.google.co.uk/maps?q=13.251,123.684">View this pin on a map</a>
                <h3>Map Pin Information</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </li>
            <li>
                <div class="geo">Location Name: <span class="latitude">13.373</span>, <span class="longitude">123.807</span>.</div>
                <a target="_blank" class="maps-pinLink" href="http://maps.google.co.uk/maps?q=13.251,123.684">View this pin on a map</a>
                <h3>Map Pin Information</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </li>
        </ul>
        <div id="map-skip"></div>
	</div>


License
-------
Copyright Software Freedom Conservancy, Inc.
Dual licensed under the MIT or GPL Version 2 licenses.
http://jquery.org/license

