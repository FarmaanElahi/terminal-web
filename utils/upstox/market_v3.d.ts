/* eslint-disable @typescript-eslint/no-unused-vars */
import * as $protobuf from "protobufjs";
import Long from "long";

/** Namespace com. */
export namespace com {
  /** Namespace upstox. */
  namespace upstox {
    /** Namespace marketdatafeederv3udapi. */
    namespace marketdatafeederv3udapi {
      /** Namespace rpc. */
      namespace rpc {
        /** Namespace proto. */
        namespace proto {
          /** Properties of a LTPC. */
          interface ILTPC {
            /** LTPC ltp */
            ltp?: number | null;

            /** LTPC ltt */
            ltt?: number | Long | null;

            /** LTPC ltq */
            ltq?: number | Long | null;

            /** LTPC cp */
            cp?: number | null;
          }

          /** Represents a LTPC. */
          class LTPC implements ILTPC {
            /**
             * Constructs a new LTPC.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC,
            );

            /** LTPC ltp. */
            public ltp: number;

            /** LTPC ltt. */
            public ltt: number | Long;

            /** LTPC ltq. */
            public ltq: number | Long;

            /** LTPC cp. */
            public cp: number;

            /**
             * Creates a new LTPC instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LTPC instance
             */
            public static create(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC;

            /**
             * Encodes the specified LTPC message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.verify|verify} messages.
             * @param message LTPC message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified LTPC message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.verify|verify} messages.
             * @param message LTPC message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Decodes a LTPC message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LTPC
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(
              reader: $protobuf.Reader | Uint8Array,
              length?: number,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC;

            /**
             * Decodes a LTPC message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LTPC
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC;

            /**
             * Verifies a LTPC message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: {
              [k: string]: unknown;
            }): string | null;

            /**
             * Creates a LTPC message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns LTPC
             */
            public static fromObject(object: {
              [k: string]: unknown;
            }): com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC;

            /**
             * Creates a plain object from a LTPC message. Also converts values to other types if specified.
             * @param message LTPC
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC,
              options?: $protobuf.IConversionOptions,
            ): {
              [k: string]: unknown;
            };

            /**
             * Converts this LTPC to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: unknown };

            /**
             * Gets the default type url for LTPC
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
          }

          /** Properties of a MarketLevel. */
          interface IMarketLevel {
            /** MarketLevel bidAskQuote */
            bidAskQuote?:
              | com.upstox.marketdatafeederv3udapi.rpc.proto.IQuote[]
              | null;
          }

          /** Represents a MarketLevel. */
          class MarketLevel implements IMarketLevel {
            /**
             * Constructs a new MarketLevel.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketLevel,
            );

            /** MarketLevel bidAskQuote. */
            public bidAskQuote: com.upstox.marketdatafeederv3udapi.rpc.proto.IQuote[];

            /**
             * Creates a new MarketLevel instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MarketLevel instance
             */
            public static create(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketLevel,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel;

            /**
             * Encodes the specified MarketLevel message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel.verify|verify} messages.
             * @param message MarketLevel message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketLevel,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified MarketLevel message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel.verify|verify} messages.
             * @param message MarketLevel message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketLevel,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Decodes a MarketLevel message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MarketLevel
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(
              reader: $protobuf.Reader | Uint8Array,
              length?: number,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel;

            /**
             * Decodes a MarketLevel message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MarketLevel
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel;

            /**
             * Verifies a MarketLevel message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: {
              [k: string]: unknown;
            }): string | null;

            /**
             * Creates a MarketLevel message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MarketLevel
             */
            public static fromObject(object: {
              [k: string]: unknown;
            }): com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel;

            /**
             * Creates a plain object from a MarketLevel message. Also converts values to other types if specified.
             * @param message MarketLevel
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel,
              options?: $protobuf.IConversionOptions,
            ): {
              [k: string]: unknown;
            };

            /**
             * Converts this MarketLevel to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: unknown };

            /**
             * Gets the default type url for MarketLevel
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
          }

          /** Properties of a MarketOHLC. */
          interface IMarketOHLC {
            /** MarketOHLC ohlc */
            ohlc?: com.upstox.marketdatafeederv3udapi.rpc.proto.IOHLC[] | null;
          }

          /** Represents a MarketOHLC. */
          class MarketOHLC implements IMarketOHLC {
            /**
             * Constructs a new MarketOHLC.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketOHLC,
            );

            /** MarketOHLC ohlc. */
            public ohlc: com.upstox.marketdatafeederv3udapi.rpc.proto.IOHLC[];

            /**
             * Creates a new MarketOHLC instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MarketOHLC instance
             */
            public static create(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketOHLC,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC;

            /**
             * Encodes the specified MarketOHLC message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC.verify|verify} messages.
             * @param message MarketOHLC message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketOHLC,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified MarketOHLC message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC.verify|verify} messages.
             * @param message MarketOHLC message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketOHLC,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Decodes a MarketOHLC message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MarketOHLC
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(
              reader: $protobuf.Reader | Uint8Array,
              length?: number,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC;

            /**
             * Decodes a MarketOHLC message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MarketOHLC
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC;

            /**
             * Verifies a MarketOHLC message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: {
              [k: string]: unknown;
            }): string | null;

            /**
             * Creates a MarketOHLC message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MarketOHLC
             */
            public static fromObject(object: {
              [k: string]: unknown;
            }): com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC;

            /**
             * Creates a plain object from a MarketOHLC message. Also converts values to other types if specified.
             * @param message MarketOHLC
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC,
              options?: $protobuf.IConversionOptions,
            ): {
              [k: string]: unknown;
            };

            /**
             * Converts this MarketOHLC to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: unknown };

            /**
             * Gets the default type url for MarketOHLC
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
          }

          /** Properties of a Quote. */
          interface IQuote {
            /** Quote bidQ */
            bidQ?: number | Long | null;

            /** Quote bidP */
            bidP?: number | null;

            /** Quote askQ */
            askQ?: number | Long | null;

            /** Quote askP */
            askP?: number | null;
          }

          /** Represents a Quote. */
          class Quote implements IQuote {
            /**
             * Constructs a new Quote.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IQuote,
            );

            /** Quote bidQ. */
            public bidQ: number | Long;

            /** Quote bidP. */
            public bidP: number;

            /** Quote askQ. */
            public askQ: number | Long;

            /** Quote askP. */
            public askP: number;

            /**
             * Creates a new Quote instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Quote instance
             */
            public static create(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IQuote,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.Quote;

            /**
             * Encodes the specified Quote message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.Quote.verify|verify} messages.
             * @param message Quote message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IQuote,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified Quote message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.Quote.verify|verify} messages.
             * @param message Quote message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IQuote,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Decodes a Quote message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Quote
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(
              reader: $protobuf.Reader | Uint8Array,
              length?: number,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.Quote;

            /**
             * Decodes a Quote message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Quote
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.Quote;

            /**
             * Verifies a Quote message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: {
              [k: string]: unknown;
            }): string | null;

            /**
             * Creates a Quote message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Quote
             */
            public static fromObject(object: {
              [k: string]: unknown;
            }): com.upstox.marketdatafeederv3udapi.rpc.proto.Quote;

            /**
             * Creates a plain object from a Quote message. Also converts values to other types if specified.
             * @param message Quote
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.Quote,
              options?: $protobuf.IConversionOptions,
            ): {
              [k: string]: unknown;
            };

            /**
             * Converts this Quote to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: unknown };

            /**
             * Gets the default type url for Quote
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
          }

          /** Properties of an OptionGreeks. */
          interface IOptionGreeks {
            /** OptionGreeks delta */
            delta?: number | null;

            /** OptionGreeks theta */
            theta?: number | null;

            /** OptionGreeks gamma */
            gamma?: number | null;

            /** OptionGreeks vega */
            vega?: number | null;

            /** OptionGreeks rho */
            rho?: number | null;
          }

          /** Represents an OptionGreeks. */
          class OptionGreeks implements IOptionGreeks {
            /**
             * Constructs a new OptionGreeks.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IOptionGreeks,
            );

            /** OptionGreeks delta. */
            public delta: number;

            /** OptionGreeks theta. */
            public theta: number;

            /** OptionGreeks gamma. */
            public gamma: number;

            /** OptionGreeks vega. */
            public vega: number;

            /** OptionGreeks rho. */
            public rho: number;

            /**
             * Creates a new OptionGreeks instance using the specified properties.
             * @param [properties] Properties to set
             * @returns OptionGreeks instance
             */
            public static create(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IOptionGreeks,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks;

            /**
             * Encodes the specified OptionGreeks message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks.verify|verify} messages.
             * @param message OptionGreeks message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IOptionGreeks,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified OptionGreeks message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks.verify|verify} messages.
             * @param message OptionGreeks message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IOptionGreeks,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Decodes an OptionGreeks message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns OptionGreeks
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(
              reader: $protobuf.Reader | Uint8Array,
              length?: number,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks;

            /**
             * Decodes an OptionGreeks message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns OptionGreeks
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks;

            /**
             * Verifies an OptionGreeks message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: {
              [k: string]: unknown;
            }): string | null;

            /**
             * Creates an OptionGreeks message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns OptionGreeks
             */
            public static fromObject(object: {
              [k: string]: unknown;
            }): com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks;

            /**
             * Creates a plain object from an OptionGreeks message. Also converts values to other types if specified.
             * @param message OptionGreeks
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks,
              options?: $protobuf.IConversionOptions,
            ): {
              [k: string]: unknown;
            };

            /**
             * Converts this OptionGreeks to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: unknown };

            /**
             * Gets the default type url for OptionGreeks
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
          }

          /** Properties of a OHLC. */
          interface IOHLC {
            /** OHLC interval */
            interval?: string | null;

            /** OHLC open */
            open?: number | null;

            /** OHLC high */
            high?: number | null;

            /** OHLC low */
            low?: number | null;

            /** OHLC close */
            close?: number | null;

            /** OHLC vol */
            vol?: number | Long | null;

            /** OHLC ts */
            ts?: number | Long | null;
          }

          /** Represents a OHLC. */
          class OHLC implements IOHLC {
            /**
             * Constructs a new OHLC.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IOHLC,
            );

            /** OHLC interval. */
            public interval: string;

            /** OHLC open. */
            public open: number;

            /** OHLC high. */
            public high: number;

            /** OHLC low. */
            public low: number;

            /** OHLC close. */
            public close: number;

            /** OHLC vol. */
            public vol: number | Long;

            /** OHLC ts. */
            public ts: number | Long;

            /**
             * Creates a new OHLC instance using the specified properties.
             * @param [properties] Properties to set
             * @returns OHLC instance
             */
            public static create(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IOHLC,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC;

            /**
             * Encodes the specified OHLC message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC.verify|verify} messages.
             * @param message OHLC message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IOHLC,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified OHLC message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC.verify|verify} messages.
             * @param message OHLC message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IOHLC,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Decodes a OHLC message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns OHLC
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(
              reader: $protobuf.Reader | Uint8Array,
              length?: number,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC;

            /**
             * Decodes a OHLC message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns OHLC
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC;

            /**
             * Verifies a OHLC message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: {
              [k: string]: unknown;
            }): string | null;

            /**
             * Creates a OHLC message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns OHLC
             */
            public static fromObject(object: {
              [k: string]: unknown;
            }): com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC;

            /**
             * Creates a plain object from a OHLC message. Also converts values to other types if specified.
             * @param message OHLC
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC,
              options?: $protobuf.IConversionOptions,
            ): {
              [k: string]: unknown;
            };

            /**
             * Converts this OHLC to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: unknown };

            /**
             * Gets the default type url for OHLC
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
          }

          /** Type enum. */
          enum Type {
            initial_feed = 0,
            live_feed = 1,
            market_info = 2,
          }

          /** Properties of a MarketFullFeed. */
          interface IMarketFullFeed {
            /** MarketFullFeed ltpc */
            ltpc?: com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC | null;

            /** MarketFullFeed marketLevel */
            marketLevel?: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketLevel | null;

            /** MarketFullFeed optionGreeks */
            optionGreeks?: com.upstox.marketdatafeederv3udapi.rpc.proto.IOptionGreeks | null;

            /** MarketFullFeed marketOHLC */
            marketOHLC?: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketOHLC | null;

            /** MarketFullFeed atp */
            atp?: number | null;

            /** MarketFullFeed vtt */
            vtt?: number | Long | null;

            /** MarketFullFeed oi */
            oi?: number | null;

            /** MarketFullFeed iv */
            iv?: number | null;

            /** MarketFullFeed tbq */
            tbq?: number | null;

            /** MarketFullFeed tsq */
            tsq?: number | null;
          }

          /** Represents a MarketFullFeed. */
          class MarketFullFeed implements IMarketFullFeed {
            /**
             * Constructs a new MarketFullFeed.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketFullFeed,
            );

            /** MarketFullFeed ltpc. */
            public ltpc?: com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC | null;

            /** MarketFullFeed marketLevel. */
            public marketLevel?: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketLevel | null;

            /** MarketFullFeed optionGreeks. */
            public optionGreeks?: com.upstox.marketdatafeederv3udapi.rpc.proto.IOptionGreeks | null;

            /** MarketFullFeed marketOHLC. */
            public marketOHLC?: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketOHLC | null;

            /** MarketFullFeed atp. */
            public atp: number;

            /** MarketFullFeed vtt. */
            public vtt: number | Long;

            /** MarketFullFeed oi. */
            public oi: number;

            /** MarketFullFeed iv. */
            public iv: number;

            /** MarketFullFeed tbq. */
            public tbq: number;

            /** MarketFullFeed tsq. */
            public tsq: number;

            /**
             * Creates a new MarketFullFeed instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MarketFullFeed instance
             */
            public static create(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketFullFeed,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed;

            /**
             * Encodes the specified MarketFullFeed message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed.verify|verify} messages.
             * @param message MarketFullFeed message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketFullFeed,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified MarketFullFeed message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed.verify|verify} messages.
             * @param message MarketFullFeed message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketFullFeed,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Decodes a MarketFullFeed message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MarketFullFeed
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(
              reader: $protobuf.Reader | Uint8Array,
              length?: number,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed;

            /**
             * Decodes a MarketFullFeed message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MarketFullFeed
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed;

            /**
             * Verifies a MarketFullFeed message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: {
              [k: string]: unknown;
            }): string | null;

            /**
             * Creates a MarketFullFeed message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MarketFullFeed
             */
            public static fromObject(object: {
              [k: string]: unknown;
            }): com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed;

            /**
             * Creates a plain object from a MarketFullFeed message. Also converts values to other types if specified.
             * @param message MarketFullFeed
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed,
              options?: $protobuf.IConversionOptions,
            ): {
              [k: string]: unknown;
            };

            /**
             * Converts this MarketFullFeed to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: unknown };

            /**
             * Gets the default type url for MarketFullFeed
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
          }

          /** Properties of an IndexFullFeed. */
          interface IIndexFullFeed {
            /** IndexFullFeed ltpc */
            ltpc?: com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC | null;

            /** IndexFullFeed marketOHLC */
            marketOHLC?: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketOHLC | null;
          }

          /** Represents an IndexFullFeed. */
          class IndexFullFeed implements IIndexFullFeed {
            /**
             * Constructs a new IndexFullFeed.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IIndexFullFeed,
            );

            /** IndexFullFeed ltpc. */
            public ltpc?: com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC | null;

            /** IndexFullFeed marketOHLC. */
            public marketOHLC?: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketOHLC | null;

            /**
             * Creates a new IndexFullFeed instance using the specified properties.
             * @param [properties] Properties to set
             * @returns IndexFullFeed instance
             */
            public static create(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IIndexFullFeed,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed;

            /**
             * Encodes the specified IndexFullFeed message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed.verify|verify} messages.
             * @param message IndexFullFeed message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IIndexFullFeed,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified IndexFullFeed message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed.verify|verify} messages.
             * @param message IndexFullFeed message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IIndexFullFeed,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Decodes an IndexFullFeed message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns IndexFullFeed
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(
              reader: $protobuf.Reader | Uint8Array,
              length?: number,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed;

            /**
             * Decodes an IndexFullFeed message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns IndexFullFeed
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed;

            /**
             * Verifies an IndexFullFeed message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: {
              [k: string]: unknown;
            }): string | null;

            /**
             * Creates an IndexFullFeed message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns IndexFullFeed
             */
            public static fromObject(object: {
              [k: string]: unknown;
            }): com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed;

            /**
             * Creates a plain object from an IndexFullFeed message. Also converts values to other types if specified.
             * @param message IndexFullFeed
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed,
              options?: $protobuf.IConversionOptions,
            ): {
              [k: string]: unknown;
            };

            /**
             * Converts this IndexFullFeed to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: unknown };

            /**
             * Gets the default type url for IndexFullFeed
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
          }

          /** Properties of a FullFeed. */
          interface IFullFeed {
            /** FullFeed marketFF */
            marketFF?: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketFullFeed | null;

            /** FullFeed indexFF */
            indexFF?: com.upstox.marketdatafeederv3udapi.rpc.proto.IIndexFullFeed | null;
          }

          /** Represents a FullFeed. */
          class FullFeed implements IFullFeed {
            /**
             * Constructs a new FullFeed.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IFullFeed,
            );

            /** FullFeed marketFF. */
            public marketFF?: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketFullFeed | null;

            /** FullFeed indexFF. */
            public indexFF?: com.upstox.marketdatafeederv3udapi.rpc.proto.IIndexFullFeed | null;

            /** FullFeed FullFeedUnion. */
            public FullFeedUnion?: "marketFF" | "indexFF";

            /**
             * Creates a new FullFeed instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FullFeed instance
             */
            public static create(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IFullFeed,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed;

            /**
             * Encodes the specified FullFeed message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed.verify|verify} messages.
             * @param message FullFeed message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IFullFeed,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified FullFeed message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed.verify|verify} messages.
             * @param message FullFeed message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IFullFeed,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Decodes a FullFeed message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FullFeed
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(
              reader: $protobuf.Reader | Uint8Array,
              length?: number,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed;

            /**
             * Decodes a FullFeed message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FullFeed
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed;

            /**
             * Verifies a FullFeed message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: {
              [k: string]: unknown;
            }): string | null;

            /**
             * Creates a FullFeed message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FullFeed
             */
            public static fromObject(object: {
              [k: string]: unknown;
            }): com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed;

            /**
             * Creates a plain object from a FullFeed message. Also converts values to other types if specified.
             * @param message FullFeed
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed,
              options?: $protobuf.IConversionOptions,
            ): {
              [k: string]: unknown;
            };

            /**
             * Converts this FullFeed to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: unknown };

            /**
             * Gets the default type url for FullFeed
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
          }

          /** Properties of a FirstLevelWithGreeks. */
          interface IFirstLevelWithGreeks {
            /** FirstLevelWithGreeks ltpc */
            ltpc?: com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC | null;

            /** FirstLevelWithGreeks firstDepth */
            firstDepth?: com.upstox.marketdatafeederv3udapi.rpc.proto.IQuote | null;

            /** FirstLevelWithGreeks optionGreeks */
            optionGreeks?: com.upstox.marketdatafeederv3udapi.rpc.proto.IOptionGreeks | null;

            /** FirstLevelWithGreeks vtt */
            vtt?: number | Long | null;

            /** FirstLevelWithGreeks oi */
            oi?: number | null;

            /** FirstLevelWithGreeks iv */
            iv?: number | null;
          }

          /** Represents a FirstLevelWithGreeks. */
          class FirstLevelWithGreeks implements IFirstLevelWithGreeks {
            /**
             * Constructs a new FirstLevelWithGreeks.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IFirstLevelWithGreeks,
            );

            /** FirstLevelWithGreeks ltpc. */
            public ltpc?: com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC | null;

            /** FirstLevelWithGreeks firstDepth. */
            public firstDepth?: com.upstox.marketdatafeederv3udapi.rpc.proto.IQuote | null;

            /** FirstLevelWithGreeks optionGreeks. */
            public optionGreeks?: com.upstox.marketdatafeederv3udapi.rpc.proto.IOptionGreeks | null;

            /** FirstLevelWithGreeks vtt. */
            public vtt: number | Long;

            /** FirstLevelWithGreeks oi. */
            public oi: number;

            /** FirstLevelWithGreeks iv. */
            public iv: number;

            /**
             * Creates a new FirstLevelWithGreeks instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FirstLevelWithGreeks instance
             */
            public static create(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IFirstLevelWithGreeks,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks;

            /**
             * Encodes the specified FirstLevelWithGreeks message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks.verify|verify} messages.
             * @param message FirstLevelWithGreeks message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IFirstLevelWithGreeks,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified FirstLevelWithGreeks message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks.verify|verify} messages.
             * @param message FirstLevelWithGreeks message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IFirstLevelWithGreeks,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Decodes a FirstLevelWithGreeks message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FirstLevelWithGreeks
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(
              reader: $protobuf.Reader | Uint8Array,
              length?: number,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks;

            /**
             * Decodes a FirstLevelWithGreeks message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FirstLevelWithGreeks
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks;

            /**
             * Verifies a FirstLevelWithGreeks message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: {
              [k: string]: unknown;
            }): string | null;

            /**
             * Creates a FirstLevelWithGreeks message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FirstLevelWithGreeks
             */
            public static fromObject(object: {
              [k: string]: unknown;
            }): com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks;

            /**
             * Creates a plain object from a FirstLevelWithGreeks message. Also converts values to other types if specified.
             * @param message FirstLevelWithGreeks
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks,
              options?: $protobuf.IConversionOptions,
            ): {
              [k: string]: unknown;
            };

            /**
             * Converts this FirstLevelWithGreeks to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: unknown };

            /**
             * Gets the default type url for FirstLevelWithGreeks
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
          }

          /** Properties of a Feed. */
          interface IFeed {
            /** Feed ltpc */
            ltpc?: com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC | null;

            /** Feed fullFeed */
            fullFeed?: com.upstox.marketdatafeederv3udapi.rpc.proto.IFullFeed | null;

            /** Feed firstLevelWithGreeks */
            firstLevelWithGreeks?: com.upstox.marketdatafeederv3udapi.rpc.proto.IFirstLevelWithGreeks | null;

            /** Feed requestMode */
            requestMode?: com.upstox.marketdatafeederv3udapi.rpc.proto.RequestMode | null;
          }

          /** Represents a Feed. */
          class Feed implements IFeed {
            /**
             * Constructs a new Feed.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IFeed,
            );

            /** Feed ltpc. */
            public ltpc?: com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC | null;

            /** Feed fullFeed. */
            public fullFeed?: com.upstox.marketdatafeederv3udapi.rpc.proto.IFullFeed | null;

            /** Feed firstLevelWithGreeks. */
            public firstLevelWithGreeks?: com.upstox.marketdatafeederv3udapi.rpc.proto.IFirstLevelWithGreeks | null;

            /** Feed requestMode. */
            public requestMode: com.upstox.marketdatafeederv3udapi.rpc.proto.RequestMode;

            /** Feed FeedUnion. */
            public FeedUnion?: "ltpc" | "fullFeed" | "firstLevelWithGreeks";

            /**
             * Creates a new Feed instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Feed instance
             */
            public static create(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IFeed,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.Feed;

            /**
             * Encodes the specified Feed message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.Feed.verify|verify} messages.
             * @param message Feed message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IFeed,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified Feed message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.Feed.verify|verify} messages.
             * @param message Feed message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IFeed,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Decodes a Feed message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Feed
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(
              reader: $protobuf.Reader | Uint8Array,
              length?: number,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.Feed;

            /**
             * Decodes a Feed message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Feed
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.Feed;

            /**
             * Verifies a Feed message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: {
              [k: string]: unknown;
            }): string | null;

            /**
             * Creates a Feed message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Feed
             */
            public static fromObject(object: {
              [k: string]: unknown;
            }): com.upstox.marketdatafeederv3udapi.rpc.proto.Feed;

            /**
             * Creates a plain object from a Feed message. Also converts values to other types if specified.
             * @param message Feed
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.Feed,
              options?: $protobuf.IConversionOptions,
            ): {
              [k: string]: unknown;
            };

            /**
             * Converts this Feed to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: unknown };

            /**
             * Gets the default type url for Feed
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
          }

          /** RequestMode enum. */
          enum RequestMode {
            ltpc = 0,
            full_d5 = 1,
            option_greeks = 2,
            full_d30 = 3,
          }

          /** MarketStatus enum. */
          enum MarketStatus {
            PRE_OPEN_START = 0,
            PRE_OPEN_END = 1,
            NORMAL_OPEN = 2,
            NORMAL_CLOSE = 3,
            CLOSING_START = 4,
            CLOSING_END = 5,
          }

          /** Properties of a MarketInfo. */
          interface IMarketInfo {
            /** MarketInfo segmentStatus */
            segmentStatus?: {
              [
                k: string
              ]: com.upstox.marketdatafeederv3udapi.rpc.proto.MarketStatus;
            } | null;
          }

          /** Represents a MarketInfo. */
          class MarketInfo implements IMarketInfo {
            /**
             * Constructs a new MarketInfo.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketInfo,
            );

            /** MarketInfo segmentStatus. */
            public segmentStatus: {
              [
                k: string
              ]: com.upstox.marketdatafeederv3udapi.rpc.proto.MarketStatus;
            };

            /**
             * Creates a new MarketInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MarketInfo instance
             */
            public static create(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketInfo,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo;

            /**
             * Encodes the specified MarketInfo message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo.verify|verify} messages.
             * @param message MarketInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketInfo,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified MarketInfo message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo.verify|verify} messages.
             * @param message MarketInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketInfo,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Decodes a MarketInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MarketInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(
              reader: $protobuf.Reader | Uint8Array,
              length?: number,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo;

            /**
             * Decodes a MarketInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MarketInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo;

            /**
             * Verifies a MarketInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: {
              [k: string]: unknown;
            }): string | null;

            /**
             * Creates a MarketInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MarketInfo
             */
            public static fromObject(object: {
              [k: string]: unknown;
            }): com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo;

            /**
             * Creates a plain object from a MarketInfo message. Also converts values to other types if specified.
             * @param message MarketInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo,
              options?: $protobuf.IConversionOptions,
            ): {
              [k: string]: unknown;
            };

            /**
             * Converts this MarketInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: unknown };

            /**
             * Gets the default type url for MarketInfo
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
          }

          /** Properties of a FeedResponse. */
          interface IFeedResponse {
            /** FeedResponse type */
            type?: com.upstox.marketdatafeederv3udapi.rpc.proto.Type | null;

            /** FeedResponse feeds */
            feeds?: {
              [k: string]: com.upstox.marketdatafeederv3udapi.rpc.proto.IFeed;
            } | null;

            /** FeedResponse currentTs */
            currentTs?: number | Long | null;

            /** FeedResponse marketInfo */
            marketInfo?: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketInfo | null;
          }

          /** Represents a FeedResponse. */
          class FeedResponse implements IFeedResponse {
            /**
             * Constructs a new FeedResponse.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IFeedResponse,
            );

            /** FeedResponse type. */
            public type: com.upstox.marketdatafeederv3udapi.rpc.proto.Type;

            /** FeedResponse feeds. */
            public feeds: {
              [k: string]: com.upstox.marketdatafeederv3udapi.rpc.proto.IFeed;
            };

            /** FeedResponse currentTs. */
            public currentTs: number | Long;

            /** FeedResponse marketInfo. */
            public marketInfo?: com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketInfo | null;

            /**
             * Creates a new FeedResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FeedResponse instance
             */
            public static create(
              properties?: com.upstox.marketdatafeederv3udapi.rpc.proto.IFeedResponse,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse;

            /**
             * Encodes the specified FeedResponse message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse.verify|verify} messages.
             * @param message FeedResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IFeedResponse,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified FeedResponse message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse.verify|verify} messages.
             * @param message FeedResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.IFeedResponse,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Decodes a FeedResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FeedResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(
              reader: $protobuf.Reader | Uint8Array,
              length?: number,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse;

            /**
             * Decodes a FeedResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FeedResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse;

            /**
             * Verifies a FeedResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: {
              [k: string]: unknown;
            }): string | null;

            /**
             * Creates a FeedResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FeedResponse
             */
            public static fromObject(object: {
              [k: string]: unknown;
            }): com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse;

            /**
             * Creates a plain object from a FeedResponse message. Also converts values to other types if specified.
             * @param message FeedResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse,
              options?: $protobuf.IConversionOptions,
            ): {
              [k: string]: unknown;
            };

            /**
             * Converts this FeedResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: unknown };

            /**
             * Gets the default type url for FeedResponse
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
          }
        }
      }
    }
  }
}
