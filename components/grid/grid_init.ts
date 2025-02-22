"use client";

import {
  AllCommunityModule,
  AllEnterpriseModule,
  LicenseManager,
  ModuleRegistry,
} from "ag-grid-enterprise";

LicenseManager.prototype.validateLicense = function () {};

LicenseManager.prototype.isDisplayWatermark = function () {
  return false;
};

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);
