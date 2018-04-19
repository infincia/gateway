/**
 * Garage door opener
 *
 * UI element representing a garage door opener
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const API = require('./api');
const OnOffDetail = require('./on-off-detail');
const OnOffSwitch = require('./on-off-switch');
const Thing = require('./thing');
const ThingDetailLayout = require('./thing-detail-layout');
const Utils = require('./utils');

/**
 * GarageDoor Constructor (extends OnOffSwitch).
 *
 * @param Object description Thing description object.
 * @param {String} format 'svg', 'html', or 'htmlDetail'.
 */
function GarageDoor(description, format, options) {
  if (format === 'htmlDetail') {
    this.details = this.details || {};
    this.details.open = new OnOffDetail(this);
  }

  const opts = options || {svgBaseIcon: '/images/garage.svg',
                           pngBaseIcon: '/images/garage.png',
                           thingCssClass: '',
                           addIconToView: false};

  this.base = Thing;
  this.base(description, format, opts);
  if (format == 'svg') {
    // For now the SVG view is just a link.
    return this;
  }
  this.openPropertyUrl = new URL(this.propertyDescriptions.open.href, this.href);

  this.updateStatus();

  this.doorImage = this.element.querySelector('.garage-door-image');

  if (format === 'htmlDetail') {
    this.details.open.attach();

    this.layout = new ThingDetailLayout(
      this.element.querySelectorAll('.thing-detail-container'));
  } else {
    this.element.querySelector('.garage-door-container')
      .addEventListener('click', this.handleClick.bind(this));
  }
  return this;
}

GarageDoor.prototype = Object.create(OnOffSwitch.prototype);

GarageDoor.prototype.iconView = function() {
  return `<div class="garage-door-container">` +
         `  <div class="garage-door"> ` +
         `    <img class="garage-door-image" src="/images/garage.svg"/> ` +
         `  </div>` +
         `</div>`;
};

/**
 * HTML view for garage door opener
 */
GarageDoor.prototype.htmlView = function() {
  return `<div class="thing ${this.thingCssClass}">` +
         `  <a href="${encodeURI(this.href)}" class="thing-details-link"></a>` +
         `  ${this.iconView()}` +
         `  <span class="thing-name">${Utils.escapeHtml(this.name)}</span>` +
         `</div>`;
};

/**
 * HTML detail view for garage door opener
 */
GarageDoor.prototype.htmlDetailView = function() {
  let details = '';
  if (this.details) {
    details = this.details.open.view();
  }

  return `<div>` +
         `  <div class="thing ${this.thingCssClass}">` +
         `    ${this.iconView()}` +
         `    ${details}` +
         `  </div>` +
         `</div>`;
};

/**
 * Update the status of the garage door.
 */
GarageDoor.prototype.updateStatus = function() {
  const opts = {
    headers: {
      Authorization: `Bearer ${API.jwt}`,
      Accept: 'application/json',
    },
  };

  fetch(this.openPropertyUrl, opts).then((response) => {
    return response.json();
  }).then((response) => {
    this.openPropertyStatus(response);
  }).catch((error) => {
    console.error(`Error fetching garage door status ${error}`);
  });
};

/**
 * Handle a 'propertyStatus' message
 * @param {Object} properties - property data
 */
GarageDoor.prototype.openPropertyStatus = function(data) {
  if (data.hasOwnProperty('open')) {
    this.updateOpen(data.open);
  }
};

GarageDoor.prototype.updateOpen = function(open) {
  this.properties.open = open;
  if (open === null) {
    return;
  }

  if (open) {
    this.doorImage.src = '/images/garage-open.svg';
  } else {
    this.doorImage.src = '/images/garage.svg';
  }

  if (this.details) {
    this.details.open.update();
  }
};

module.exports = GarageDoor;
