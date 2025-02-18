"use client";
import { ReactNode, useEffect, useState } from "react";

export function GridLicensePatcher({ children }: { children: ReactNode }) {
  const [patched, setPatch] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      const originalLicenseManager = await import("ag-grid-enterprise");

      if (originalLicenseManager.LicenseManager) {
        // Override validateLicense
        originalLicenseManager.LicenseManager.prototype.validateLicense =
          function () {};

        originalLicenseManager.LicenseManager.prototype.isDisplayWatermark =
          function () {
            return false;
          };
      }
      setPatch(true);
    })();
  });

  return patched ? children : null;
}
