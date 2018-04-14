/**
 * Camera.
 *
 * UI element representing a single image from any source.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const API = require('./api');
const Thing = require('./thing');
const ThingDetailLayout = require('./thing-detail-layout');
const ImageDetail = require('./image-detail');
const LabelDetail = require('./label-detail');
const ChoiceDetail = require('./choice-detail');
const Utils = require('./utils');

/**
 * Camera Constructor (extends Thing).
 *
 * @param Object description Thing description object.
 * @param {String} format 'svg' or 'html'.
 */
var Camera = function(description, format) {

  this.useImageDetail = false;
  this.displayedProperties = this.displayedProperties || {};

  for (const name in description.properties) {
    const prop = description.properties[name];
    const href = prop.href;
    if (href) {
      let detail;
      switch (prop.type) {
        case 'label':
          detail = new LabelDetail(this, name, name, prop.unit);
          break;
        case 'stillImage':
          // temporary build time switch to disable the image detail, since the
          // still image is also shown in the center view of the Thing itself
          if (this.useImageDetail) {
            detail = new ImageDetail(this, name, "Still Image");
          }
          break;
        case 'choice': {
          // temporary hack until properties can have a "choices" and "friendlyName"
          // or equivalent keys
          let tempChoices = [];
          let tempFriendlyName = '';
          switch (name) {
            case 'resolution':
              tempFriendlyName = 'Resolution';
              tempChoices = ['320x240',
                             '640x480',
                             '800x600',
                             '1024x768',
                             '1296x972',
                             '1640x1232',
                             '3280x2464'];
              break;
            case 'framerate':
              tempFriendlyName = 'Framerate';
              tempChoices = ["0.0",
                             "0.1",
                             "0.5",
                             "1.0",
                             "2.0",
                             "3.0",
                             "4.0",
                             "5.0",
                             "6.0",
                             "7.0",
                             "8.0",
                             "9.0",
                             "10.0",
                             "15.0",
                             "20.0",
                             "30.0"];
              break;
            case 'exposureMode':
              tempFriendlyName = 'Exposure';
              tempChoices = ['off',
                             'auto',
                             'night',
                             'nightpreview',
                             'backlight',
                             'spotlight',
                             'sports',
                             'snow',
                             'beach',
                             'verylong',
                             'fixedfps',
                             'antishake',
                             'fireworks'];
              break;
            default:
              break;
          }
          const choices = prop.hasOwnProperty('choices') ? prop.choices : tempChoices;
          const friendlyName = prop.hasOwnProperty('friendlyName') ? prop.friendlyName : tempFriendlyName;
          detail = new ChoiceDetail(this, name, friendlyName, prop.unit, choices);
          break;
        }
        default:
          continue;
      }

      const obj = {href, detail, type: prop.type, unit: prop.unit};
      this.displayedProperties[name] = obj;
    }
  }

  this.base = Thing;
  this.base(description, format, {  pngBaseIcon: '/images/camera.png',
                                    thingCssClass: 'camera-thing',
                                    addIconToView: false});
  if (format === 'svg') {
    console.log("Creating Camera for svg");
    // For now the SVG view is just a link.
    return this;
  }

  this.image = this.element.querySelector(`#camera-image-${Utils.escapeHtml(this.id).replace(/[.: ]/g,'_')}-${this.name.replace(/[.: ]/g,'_')}`);

  console.log("Creating Camera");

  if (format === 'htmlDetail') {
    for (const prop of Object.values(this.displayedProperties)) {
      if (prop.type === 'stillImage' && !this.useImageDetail) {
        // temporary build time switch to disable the image detail, since the
        // still image is also shown in the center view of the Thing itself
        continue;
      }
      prop.detail.attach();
    }

    this.layout = new ThingDetailLayout(
        this.element.querySelectorAll('.thing-detail-container')
    );
  }

  this.updateStatus();

  return this;
};

Camera.prototype = Object.create(Thing.prototype);

Camera.prototype.iconView = function() {
  console.log("Rendering Camera iconView");

  return `<div class="camera camera-container">` +
         `  <div class="camera-icon">` +
         `    <svg version="1.1"` +
         `         id="Capa_1"` +
         `         xmlns="http://www.w3.org/2000/svg"` +
         `         xmlns:xlink="http://www.w3.org/1999/xlink"` +
         `         x="0px"` +
         `         y="0px"` +
         `         viewBox="0 0 32 32"` +
         `         height="64"` +
         `         width="64"` +
         `         xml:space="preserve">` +
         `      <g>` +
         `        <g id="camera">` +
         `          <path style="fill:#fff;"` +
         `                d="M16,9.501c-4.419,0-8,3.581-8,8c0,4.418,3.581,8,8,8c4.418,0,8-3.582,8-8S20.418,9.501,16,9.501z M20.555,21.406c-2.156,2.516-5.943,2.807-8.459,0.65c-2.517-2.156-2.807-5.944-0.65-8.459c2.155-2.517,5.943-2.807,8.459-0.65 C22.42,15.102,22.711,18.891,20.555,21.406z"/>` +
         `         <path style="fill:#fff;" ` +
         `               d="M16,13.501c-2.209,0-3.999,1.791-4,3.999v0.002c0,0.275,0.224,0.5,0.5,0.5s0.5-0.225,0.5-0.5V17.5 c0.001-1.656,1.343-2.999,3-2.999c0.276,0,0.5-0.224,0.5-0.5S16.276,13.501,16,13.501z"/>` +
         `         <path style="fill:#fff;" ` +
         `               d="M29.492,8.542l-4.334-0.723l-1.373-3.434C23.326,3.24,22.232,2.5,21,2.5H11 c-1.232,0-2.326,0.74-2.786,1.886L6.842,7.819L2.509,8.542C1.055,8.783,0,10.027,0,11.5v15c0,1.654,1.346,3,3,3h26 c1.654,0,3-1.346,3-3v-15C32,10.027,30.945,8.783,29.492,8.542z M30,26.5c0,0.553-0.447,1-1,1H3c-0.553,0-1-0.447-1-1v-15 c0-0.489,0.354-0.906,0.836-0.986L8.28,9.607l1.791-4.478C10.224,4.75,10.591,4.5,11,4.5h10c0.408,0,0.775,0.249,0.928,0.629 l1.791,4.478l5.445,0.907C29.646,10.594,30,11.011,30,11.5V26.5z"/>` +
         `        </g>` +
         `      </g>` +
         `    </svg>` +
         `  </div>` +
         `</div>`;
};

/**
 * HTML view for camera
 */
Camera.prototype.htmlView = function() {
  console.log("Rendering Camera htmlView");

  return `<div class="thing ${this.thingCssClass}">` +
         `  <a href="${encodeURI(this.href)}" class="thing-details-link"></a>` +
         `  <div class="camera camera-container">` +
         `    <img id="camera-image-${Utils.escapeHtml(this.id).replace(/[.: ]/g,'_')}-${this.name.replace(/[.: ]/g,'_')}" src=""/>` +
         `  </div>` +
         `  <span class="thing-name">${Utils.escapeHtml(this.name)}</span>` +
         `</div>`;
}

/**
 * HTML detail view for camera
 */
Camera.prototype.htmlDetailView = function() {
  console.log("Rendering Camera htmlDetailView");

  let detailsHTML = '';
  for (const prop in this.displayedProperties) {
    if (prop === 'stillImage' && !this.useImageDetail) {
      // temporary build time switch to disable the image detail, since the
      // still image is also shown in the center view of the Thing itself
      continue;
    }
    detailsHTML += this.displayedProperties[prop].detail.view();
  }

  var centerHTML = ``;
  if (this.useImageDetail) {
    centerHTML += `${this.iconView()}`;
  } else {
    centerHTML += `<div class="camera camera-container">` +
                  `  <img id="camera-image-${Utils.escapeHtml(this.id).replace(/[.: ]/g,'_')}-${this.name.replace(/[.: ]/g,'_')}" src=""/>` +
                  `</div>`;
  }

  return `<div>
    <div class="thing ${this.thingCssClass}">
      ${centerHTML}
    </div>
    ${detailsHTML}
  </div>`;
};

/**
 * Update the properties.
 */
Camera.prototype.updateStatus = function() {
  const urls = Object.values(this.displayedProperties).map((v) => v.href);
  if (urls.length === 0) {
    return;
  }
  const opts = {
    headers: {
      Authorization: `Bearer ${API.jwt}`,
      Accept: 'application/json',
    },
  };

  const requests = urls.map((u) => fetch(u, opts));
  Promise.all(requests).then(responses => {
    return Promise.all(responses.map(response => {
      return response.json();
    }));
  }).then(responses => {
    responses.forEach(response => {
      this.onPropertyStatus(response);
    });
  }).catch(error => {
    console.error('Error fetching camera property ' + error);
  });
};

/**
 * Handle a 'propertyStatus' message
 * @param {Object} properties - property data
 */
Camera.prototype.onPropertyStatus = function(data) {
  if (data === null) {
    console.log("WARNING: data was null when updating property");
    return;
  }

  for (const prop in data) {
    if (!this.displayedProperties.hasOwnProperty(prop)) {
      continue;
    }

    const value = data[prop];
    if (typeof value === 'undefined' || value === null) {
      continue;
    }

    this.properties[prop] = value;
    this.updateProperty(prop, value);
  }
};


/**
 * Update the display for the provided property.
 * @param {string} name - name of the property
 * @param {*} value - value of the property
 */
Camera.prototype.updateProperty = function(name, value) {
  if (!this.displayedProperties.hasOwnProperty(name)) {
    return;
  }

  this.properties[name] = value;

  // temporary build time switch to draw the camera image (assuming there is only
  // one stillImage property...) in the center view of the Thing itself
  if (this.displayedProperties[name].type === 'stillImage' && !this.useImageDetail) {
    if (this.displayedProperties[name].unit === 'bytes') {
      var urlCreator = window.URL || window.webkitURL;
      urlCreator.revokeObjectURL(this.image.src);
      var blob = new Blob([this.properties.stillImage], { type: 'image/jpeg' });
      var imageUrl = urlCreator.createObjectURL(blob);
      this.image.src = imageUrl;
    } else if (this.displayedProperties[name].unit === 'base64') {
      this.image.src = "data:image/jpeg;base64, " + this.properties.stillImage;
    }
    return;
  }

  this.displayedProperties[name].detail.update();
};


/**
 * @param {string} name - name of the property to set
 * @param {*} value - new value of the property
 */
Camera.prototype.setProperty = function(name, value) {
    if (this.displayedProperties[name].type === 'number') {
      value = parseFloat(value);
    }

    const payload = {
        [name]: value
    }

    fetch(this.displayedProperties[name].href, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: Object.assign(API.headers(), {
        'Content-Type': 'application/json',
      }),
    }).then((response) => {
      if (response.status === 200) {
        this.updateProperty(name, value);
      } else {
        console.error(`Status ${response.status} trying to set ${name}`);
      }
    }).catch(function(error) {
      console.error(`Error trying to set ${name}: ${error}`);
    });
};

module.exports = Camera;
