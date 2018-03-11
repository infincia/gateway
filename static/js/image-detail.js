/**
 * ImageDetail
 *
 * A bubble showing an arbitrary JPEG image
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

/* globals Utils */

function ImageDetail(thing, name, friendlyName, unit) {
  this.thing = thing;
  this.name = name;
  this.friendlyName = friendlyName;
  this.unit = unit;
  this.image_css_id = `image-${Utils.escapeHtml(this.thing.id).replace(/[.:]/g,'_')}-${this.name}`;
}

ImageDetail.prototype.attach = function() {
  this.image = this.thing.element.querySelector(`#${this.image_css_id}`);
};

ImageDetail.prototype.view = function() {
  return `<div class="thing-detail-container">
    <div class="thing-detail image-detail">
      <div class="thing-detail-contents">
        <img id="${this.image_css_id}" src=""/>
      </div>
    </div>
    <div class="thing-detail-label">${Utils.escapeHtml(this.friendlyName)}</div>
  </div>`;
};

ImageDetail.prototype.update = function() {
  if (this.image && this.thing.properties[this.name]) {
    if (this.unit === 'bytes') {
      var urlCreator = window.URL || window.webkitURL;
      urlCreator.revokeObjectURL(this.image.src);
      var blob = new Blob([this.thing.properties[this.name]], { type: 'image/jpeg' });
      var imageUrl = urlCreator.createObjectURL(blob);
      this.image.src = imageUrl;
    } else if (this.unit === 'base64') {
      this.image.src = "data:image/jpeg;base64, " + this.thing.properties[this.name];
    }
  }
};
