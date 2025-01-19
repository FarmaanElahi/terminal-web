import { CustomIndicator, PineJS } from "@/components/chart/indicators/pinejs";

export function createTVIndicator(
  name: string,
  metainfo: CustomIndicator["metainfo"],
  payload: Record<string, unknown>,
) {
  const type = metainfo.id.split("$")[0];

  return function (PineJS: PineJS) {
    return {
      name,
      metainfo: {
        ...metainfo,
        id: `${name}@tv-basicstudies-1`,
        isCustomIndicator: true,
      },
      constructor: function (this) {
        this.init = function (ctx, inputs) {
          const d = {
            name,
            ticker: name,
            id: `${type}@tv-scripting-101!`,
            payload,
          };
          ctx.new_sym(
            `#STUDY#||||${JSON.stringify(d)}`,
            PineJS.Std.period(ctx),
            PineJS.Std.currencyCode(ctx),
            PineJS.Std.unitId(ctx),
            "regular",
          );
        };
        this.main = function (ctx, inputs) {
          ctx.select_sym(1);
          const close = PineJS.Std.close(ctx);
          if (Number.isNaN(close)) {
            console.log("NANA", ctx, PineJS.Std.time(ctx));
            return [];
          }
          return close as unknown as number[];
        };
      },
    } as CustomIndicator;
  };
}
