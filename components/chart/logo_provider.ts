export class LogoProvider {
  constructor(private readonly logoBaseUrl: string) {}

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
