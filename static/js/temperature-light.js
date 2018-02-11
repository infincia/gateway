/**
 * Temperature Bulb.
 *
 * UI element representing a bulb with control over its temperature
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

/* globals TemperatureDetail, OnOffDetail, OnOffSwitch, Thing, ThingDetailLayout */

/**
 * TemperatureLight Constructor (extends OnOffSwitch).
 *
 * @param Object description Thing description object.
 * @param {String} format 'svg', 'html', or 'htmlDetail'.
 */
function TemperatureLight(description, format) {
  if (format === 'htmlDetail') {
    this.details = this.details || {};
    this.details.on = new OnOffDetail(this);
    this.details.temperature = new TemperatureDetail(this);
  }

  this.base = Thing;
  this.base(description, format, {svgBaseIcon: '/images/bulb.svg',
                                  pngBaseIcon: '/images/bulb.png',
                                  thingCssClass: 'temperature-light-container',
                                  addIconToView: false});

  if (format == 'svg') {
    // For now the SVG view is just a link.
    return this;
  }
  this.onPropertyUrl = new URL(this.propertyDescriptions.on.href, this.href);
  this.temperaturePropertyUrl = new URL(this.propertyDescriptions.temperature.href,
                                  this.href);

  this.updateStatus();
  this.temperatureLight = this.element.querySelector('.temperature-light');
  this.temperatureLightLabel = this.element.querySelector('.temperature-light-label');
  this.temperatureLightIconPath =
    this.element.querySelector('.temperature-light-icon-path');

  if (format === 'htmlDetail') {
    for (let prop in this.details) {
      this.details[prop].attach();
    }

    this.temperatureInput = this.element.querySelector('.temperature-light-temperature');
    this.temperatureInput.addEventListener('change', () => {
      this.setTemperature(this.temperatureInput.value);
    });

    this.layout = new ThingDetailLayout(
      this.element.querySelectorAll('.thing-detail-container'));
  } else {
    this.temperatureLight.addEventListener('click', this.handleClick.bind(this));
  }
  return this;
}

TemperatureLight.prototype = Object.create(OnOffSwitch.prototype);

TemperatureLight.prototype.iconView = function() {
  let temperatureStyle = '';
  if (this.properties.on) {
    let t = parseInt(temperature, 16);

    if (t < 3000) {
      temperatureStyle = `background: red`;
    } else {
      temperatureStyle = `background: blue`;
    }
  }
  return `<div class="temperature-light" style="${temperatureStyle}">
    <div class="temperature-light-icon">
      <svg
         xmlns:dc="http://purl.org/dc/elements/1.1/"
         xmlns:cc="http://creativecommons.org/ns#"
         xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:svg="http://www.w3.org/2000/svg"
         xmlns="http://www.w3.org/2000/svg"
         version="1.1"
         viewBox="0 0 64 66"
         height="66"
         width="64">
        <defs
           id="defs16980" />
        <metadata
           id="metadata16983">
          <rdf:RDF>
            <cc:Work
               rdf:about="">
              <dc:format>image/svg+xml</dc:format>
              <dc:type
                 rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
              <dc:title></dc:title>
            </cc:Work>
          </rdf:RDF>
        </metadata>
        <g transform="translate(0,-987.36216)">
          <path
             d="m 41.6997,1041.6985 c 0,1.0723 -0.8727,1.9367 -1.9366,1.9367 l
             -15.5179,0 c -1.0722,0 -1.9366,-0.8727 -1.9366,-1.9367 0,-1.0722
             0.8727,-1.9366 1.9366,-1.9366 l 15.5179,0 c 1.0639,-0.01
             1.9366,0.8644 1.9366,1.9366 z m -1.9449,2.9091 -15.5096,0 c
             -1.28,0 -2.2608,1.2302 -1.8369,2.5683 0.2577,0.8063 1.0722,1.305
             1.92,1.305 l 0.033,0 c 1.1221,0 2.1444,0.6317 2.6431,1.6374 l
             0.017,0.041 c 0.6732,1.3465 2.053,2.2026 3.5657,2.2026 l 2.826,0 c
             1.5127,0 2.8925,-0.8561 3.5657,-2.2026 l 0.017,-0.041 c
             0.4987,-1.0057 1.5294,-1.6374 2.6432,-1.6374 l 0.033,0 c 0.8478,0
             1.6623,-0.4987 1.92,-1.305 0.4322,-1.3381 -0.5569,-2.5683
             -1.8369,-2.5683 z m 1.9449,-7.7631 c 0,1.0722 -0.8727,1.9366
             -1.9366,1.9366 l -15.5179,0 c -1.0722,0 -1.9366,-0.8727
             -1.9366,-1.9366 0,-1.0306 0.8062,-1.8701 1.8285,-1.9283
             -1.2135,-10.9132 -12.5008,-13.3403 -12.5008,-26.19 0,-11.24577
             9.118,-20.36377 20.3637,-20.36377 11.2457,0 20.3637,9.118
             20.3637,20.36377 0,12.8497 -11.2873,15.2768 -12.4925,26.19
             1.014,0.058 1.8285,0.8977 1.8285,1.9283 z"
             class="temperature-light-icon-path"/>
        </g>
      </svg>
      <div class="temperature-light-label">
        ON
      </div>
    </div>
  </div>`;
};

/**
 * HTML view for Temperature bulb
 */
TemperatureLight.prototype.htmlView = function() {
  return `<div class="thing ${this.thingCssClass}">
    <a href="${this.href}" class="thing-details-link"></a>
    ${this.iconView()}
    <span class="thing-name">${this.name}</span>
  </div>`;
};

/**
 * HTML detail view for Temperature bulb
 */
TemperatureLight.prototype.htmlDetailView = function() {
  let detailsHTML = '';
  for (let prop in this.details) {
    detailsHTML += this.details[prop].view();
  }

  return `<div class="temperature-light-container">
    <div class="thing">
      ${this.iconView()}
    </div>
    ${detailsHTML}
  </div>`;
};

/**
 * Update the status of the light.
 */
TemperatureLight.prototype.updateStatus = function() {
  var opts = {
    headers: {
      'Authorization': `Bearer ${window.API.jwt}`,
      'Accept': 'application/json'
    }
  };

  fetch(this.onPropertyUrl, opts).then(response => {
    return response.json();
  }).then(response => {
    this.onPropertyStatus(response);
    return fetch(this.temperaturePropertyUrl, opts);
  }).then(response => {
    return response.json();
  }).then(response => {
    this.onPropertyStatus(response);
  }).catch(error => {
    console.error('Error fetching on/off switch status ' + error);
  });
};

/**
 * Handle a 'propertyStatus' message
 * @param {Object} properties - property data
 */
TemperatureLight.prototype.onPropertyStatus = function(data) {
  if (data.hasOwnProperty('on')) {
    this.updateOn(data.on);
  }
  if (data.hasOwnProperty('temperature')) {
    this.updateTemperature(data.temperature);
  }
};

TemperatureLight.prototype.updateOn = function(on) {
  this.properties.on = on;
  if (on === null) {
    return;
  }

  let onoff = on ? 'on' : 'off';
  this.temperatureLightLabel.textContent = onoff;

  if (this.details) {
    this.details.on.update();
  }

  this.temperatureLight.style.background = on ? 'white' : '';

  if (on) {
    this.showOn();
  } else {
    this.showOff();
  }
};

TemperatureLight.prototype.updateTemperature = function(temperature) {
  if (!temperature) {
    return;
  }
  this.properties.temperature = temperature;
  if (!this.temperatureLight) {
    return;
  }
  this.temperatureLightIconPath.style.fill = temperature;

  if (this.details) {
    this.details.temperature.update();
  }

  let t = parseInt(temperature, 16);

  // From https://stackoverflow.com/questions/3942878/
  if (t < 3000) {
    this.temperatureLight.classList.add('warm-temperature');
  } else {
    this.temperatureLight.classList.remove('warm-temperature');
  }
};

TemperatureLight.prototype.setTemperature = function(temperature) {
  const payload = {
   temperature: temperature
  };
  fetch(this.temperaturePropertyUrl, {
   method: 'PUT',
   body: JSON.stringify(payload),
   headers: Object.assign(window.API.headers(), {
     'Content-Type': 'application/json'
   })
  }).then(response => {
   if (response.status === 200) {
     this.updateTemperature(temperature);
   } else {
     console.error('Status ' + response.status + ' trying to set temperature');
   }
  }).catch(function(error) {
   console.error('Error trying to set temperature: ' + error);
  });

};
