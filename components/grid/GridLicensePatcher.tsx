"use client";

import { LicenseManager } from "ag-grid-enterprise";

LicenseManager.prototype.validateLicense = function () {};

LicenseManager.prototype.isDisplayWatermark = function () {
  return false;
};
