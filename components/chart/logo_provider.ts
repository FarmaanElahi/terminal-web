export class LogoProvider {
  constructor(
    private readonly logoBaseUrl = process.env
      .NEXT_PUBLIC_LOGO_BASE_URL as string,
  ) {}

  forLogo(key: unknown, defaultValue?: string | string[]) {
    if (Array.isArray(defaultValue)) {
      if (!key || key === "nan") return [];
      return [[this.logoBaseUrl, `${key}.svg`].join("/")];
    }

    if (!key || key === "nan") {
      return undefined;
    }
    return [this.logoBaseUrl, `${key}.svg`].join("/");
  }
}
