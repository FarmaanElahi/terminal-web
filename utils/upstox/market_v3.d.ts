/* eslint-disable @typescript-eslint/no-unused-vars */
import * as $protobuf from "protobufjs";
import Long from "long";

/** Namespace com. */
export namespace com {
  /** Namespace upstox. */
  namespace upstox {
    /** Namespace marketdatafeeder. */
    namespace marketdatafeeder {
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
              properties?: com.upstox.marketdatafeeder.rpc.proto.ILTPC,
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
              properties?: com.upstox.marketdatafeeder.rpc.proto.ILTPC,
            ): com.upstox.marketdatafeeder.rpc.proto.LTPC;

            /**
             * Encodes the specified LTPC message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.LTPC.verify|verify} messages.
             * @param message LTPC message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeeder.rpc.proto.ILTPC,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified LTPC message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.LTPC.verify|verify} messages.
             * @param message LTPC message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeeder.rpc.proto.ILTPC,
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
            ): com.upstox.marketdatafeeder.rpc.proto.LTPC;

            /**
             * Decodes a LTPC message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LTPC
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeeder.rpc.proto.LTPC;

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
            }): com.upstox.marketdatafeeder.rpc.proto.LTPC;

            /**
             * Creates a plain object from a LTPC message. Also converts values to other types if specified.
             * @param message LTPC
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeeder.rpc.proto.LTPC,
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
            bidAskQuote?: com.upstox.marketdatafeeder.rpc.proto.IQuote[] | null;

            /** MarketLevel lut */
            lut?: number | Long | null;
          }

          /** Represents a MarketLevel. */
          class MarketLevel implements IMarketLevel {
            /**
             * Constructs a new MarketLevel.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeeder.rpc.proto.IMarketLevel,
            );

            /** MarketLevel bidAskQuote. */
            public bidAskQuote: com.upstox.marketdatafeeder.rpc.proto.IQuote[];

            /** MarketLevel lut. */
            public lut: number | Long;

            /**
             * Creates a new MarketLevel instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MarketLevel instance
             */
            public static create(
              properties?: com.upstox.marketdatafeeder.rpc.proto.IMarketLevel,
            ): com.upstox.marketdatafeeder.rpc.proto.MarketLevel;

            /**
             * Encodes the specified MarketLevel message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.MarketLevel.verify|verify} messages.
             * @param message MarketLevel message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeeder.rpc.proto.IMarketLevel,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified MarketLevel message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.MarketLevel.verify|verify} messages.
             * @param message MarketLevel message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeeder.rpc.proto.IMarketLevel,
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
            ): com.upstox.marketdatafeeder.rpc.proto.MarketLevel;

            /**
             * Decodes a MarketLevel message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MarketLevel
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeeder.rpc.proto.MarketLevel;

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
            }): com.upstox.marketdatafeeder.rpc.proto.MarketLevel;

            /**
             * Creates a plain object from a MarketLevel message. Also converts values to other types if specified.
             * @param message MarketLevel
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeeder.rpc.proto.MarketLevel,
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
            ohlc?: com.upstox.marketdatafeeder.rpc.proto.IOHLC[] | null;
          }

          /** Represents a MarketOHLC. */
          class MarketOHLC implements IMarketOHLC {
            /**
             * Constructs a new MarketOHLC.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeeder.rpc.proto.IMarketOHLC,
            );

            /** MarketOHLC ohlc. */
            public ohlc: com.upstox.marketdatafeeder.rpc.proto.IOHLC[];

            /**
             * Creates a new MarketOHLC instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MarketOHLC instance
             */
            public static create(
              properties?: com.upstox.marketdatafeeder.rpc.proto.IMarketOHLC,
            ): com.upstox.marketdatafeeder.rpc.proto.MarketOHLC;

            /**
             * Encodes the specified MarketOHLC message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.MarketOHLC.verify|verify} messages.
             * @param message MarketOHLC message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeeder.rpc.proto.IMarketOHLC,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified MarketOHLC message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.MarketOHLC.verify|verify} messages.
             * @param message MarketOHLC message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeeder.rpc.proto.IMarketOHLC,
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
            ): com.upstox.marketdatafeeder.rpc.proto.MarketOHLC;

            /**
             * Decodes a MarketOHLC message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MarketOHLC
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeeder.rpc.proto.MarketOHLC;

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
            }): com.upstox.marketdatafeeder.rpc.proto.MarketOHLC;

            /**
             * Creates a plain object from a MarketOHLC message. Also converts values to other types if specified.
             * @param message MarketOHLC
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeeder.rpc.proto.MarketOHLC,
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
            /** Quote bq */
            bq?: number | null;

            /** Quote bp */
            bp?: number | null;

            /** Quote bno */
            bno?: number | null;

            /** Quote aq */
            aq?: number | null;

            /** Quote ap */
            ap?: number | null;

            /** Quote ano */
            ano?: number | null;

            /** Quote bidQ */
            bidQ?: number | Long | null;

            /** Quote askQ */
            askQ?: number | Long | null;
          }

          /** Represents a Quote. */
          class Quote implements IQuote {
            /**
             * Constructs a new Quote.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeeder.rpc.proto.IQuote,
            );

            /** Quote bq. */
            public bq: number;

            /** Quote bp. */
            public bp: number;

            /** Quote bno. */
            public bno: number;

            /** Quote aq. */
            public aq: number;

            /** Quote ap. */
            public ap: number;

            /** Quote ano. */
            public ano: number;

            /** Quote bidQ. */
            public bidQ: number | Long;

            /** Quote askQ. */
            public askQ: number | Long;

            /**
             * Creates a new Quote instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Quote instance
             */
            public static create(
              properties?: com.upstox.marketdatafeeder.rpc.proto.IQuote,
            ): com.upstox.marketdatafeeder.rpc.proto.Quote;

            /**
             * Encodes the specified Quote message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.Quote.verify|verify} messages.
             * @param message Quote message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeeder.rpc.proto.IQuote,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified Quote message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.Quote.verify|verify} messages.
             * @param message Quote message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeeder.rpc.proto.IQuote,
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
            ): com.upstox.marketdatafeeder.rpc.proto.Quote;

            /**
             * Decodes a Quote message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Quote
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeeder.rpc.proto.Quote;

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
            }): com.upstox.marketdatafeeder.rpc.proto.Quote;

            /**
             * Creates a plain object from a Quote message. Also converts values to other types if specified.
             * @param message Quote
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeeder.rpc.proto.Quote,
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
            /** OptionGreeks op */
            op?: number | null;

            /** OptionGreeks up */
            up?: number | null;

            /** OptionGreeks iv */
            iv?: number | null;

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
              properties?: com.upstox.marketdatafeeder.rpc.proto.IOptionGreeks,
            );

            /** OptionGreeks op. */
            public op: number;

            /** OptionGreeks up. */
            public up: number;

            /** OptionGreeks iv. */
            public iv: number;

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
              properties?: com.upstox.marketdatafeeder.rpc.proto.IOptionGreeks,
            ): com.upstox.marketdatafeeder.rpc.proto.OptionGreeks;

            /**
             * Encodes the specified OptionGreeks message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.OptionGreeks.verify|verify} messages.
             * @param message OptionGreeks message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeeder.rpc.proto.IOptionGreeks,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified OptionGreeks message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.OptionGreeks.verify|verify} messages.
             * @param message OptionGreeks message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeeder.rpc.proto.IOptionGreeks,
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
            ): com.upstox.marketdatafeeder.rpc.proto.OptionGreeks;

            /**
             * Decodes an OptionGreeks message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns OptionGreeks
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeeder.rpc.proto.OptionGreeks;

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
            }): com.upstox.marketdatafeeder.rpc.proto.OptionGreeks;

            /**
             * Creates a plain object from an OptionGreeks message. Also converts values to other types if specified.
             * @param message OptionGreeks
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeeder.rpc.proto.OptionGreeks,
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

          /** Properties of an ExtendedFeedDetails. */
          interface IExtendedFeedDetails {
            /** ExtendedFeedDetails atp */
            atp?: number | null;

            /** ExtendedFeedDetails cp */
            cp?: number | null;

            /** ExtendedFeedDetails vtt */
            vtt?: number | Long | null;

            /** ExtendedFeedDetails oi */
            oi?: number | null;

            /** ExtendedFeedDetails changeOi */
            changeOi?: number | null;

            /** ExtendedFeedDetails lastClose */
            lastClose?: number | null;

            /** ExtendedFeedDetails tbq */
            tbq?: number | null;

            /** ExtendedFeedDetails tsq */
            tsq?: number | null;

            /** ExtendedFeedDetails close */
            close?: number | null;

            /** ExtendedFeedDetails lc */
            lc?: number | null;

            /** ExtendedFeedDetails uc */
            uc?: number | null;

            /** ExtendedFeedDetails yh */
            yh?: number | null;

            /** ExtendedFeedDetails yl */
            yl?: number | null;

            /** ExtendedFeedDetails fp */
            fp?: number | null;

            /** ExtendedFeedDetails fv */
            fv?: number | null;

            /** ExtendedFeedDetails mbpBuy */
            mbpBuy?: number | Long | null;

            /** ExtendedFeedDetails mbpSell */
            mbpSell?: number | Long | null;

            /** ExtendedFeedDetails tv */
            tv?: number | Long | null;

            /** ExtendedFeedDetails dhoi */
            dhoi?: number | null;

            /** ExtendedFeedDetails dloi */
            dloi?: number | null;

            /** ExtendedFeedDetails sp */
            sp?: number | null;

            /** ExtendedFeedDetails poi */
            poi?: number | null;
          }

          /** Represents an ExtendedFeedDetails. */
          class ExtendedFeedDetails implements IExtendedFeedDetails {
            /**
             * Constructs a new ExtendedFeedDetails.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeeder.rpc.proto.IExtendedFeedDetails,
            );

            /** ExtendedFeedDetails atp. */
            public atp: number;

            /** ExtendedFeedDetails cp. */
            public cp: number;

            /** ExtendedFeedDetails vtt. */
            public vtt: number | Long;

            /** ExtendedFeedDetails oi. */
            public oi: number;

            /** ExtendedFeedDetails changeOi. */
            public changeOi: number;

            /** ExtendedFeedDetails lastClose. */
            public lastClose: number;

            /** ExtendedFeedDetails tbq. */
            public tbq: number;

            /** ExtendedFeedDetails tsq. */
            public tsq: number;

            /** ExtendedFeedDetails close. */
            public close: number;

            /** ExtendedFeedDetails lc. */
            public lc: number;

            /** ExtendedFeedDetails uc. */
            public uc: number;

            /** ExtendedFeedDetails yh. */
            public yh: number;

            /** ExtendedFeedDetails yl. */
            public yl: number;

            /** ExtendedFeedDetails fp. */
            public fp: number;

            /** ExtendedFeedDetails fv. */
            public fv: number;

            /** ExtendedFeedDetails mbpBuy. */
            public mbpBuy: number | Long;

            /** ExtendedFeedDetails mbpSell. */
            public mbpSell: number | Long;

            /** ExtendedFeedDetails tv. */
            public tv: number | Long;

            /** ExtendedFeedDetails dhoi. */
            public dhoi: number;

            /** ExtendedFeedDetails dloi. */
            public dloi: number;

            /** ExtendedFeedDetails sp. */
            public sp: number;

            /** ExtendedFeedDetails poi. */
            public poi: number;

            /**
             * Creates a new ExtendedFeedDetails instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ExtendedFeedDetails instance
             */
            public static create(
              properties?: com.upstox.marketdatafeeder.rpc.proto.IExtendedFeedDetails,
            ): com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails;

            /**
             * Encodes the specified ExtendedFeedDetails message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails.verify|verify} messages.
             * @param message ExtendedFeedDetails message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeeder.rpc.proto.IExtendedFeedDetails,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified ExtendedFeedDetails message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails.verify|verify} messages.
             * @param message ExtendedFeedDetails message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeeder.rpc.proto.IExtendedFeedDetails,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Decodes an ExtendedFeedDetails message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ExtendedFeedDetails
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(
              reader: $protobuf.Reader | Uint8Array,
              length?: number,
            ): com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails;

            /**
             * Decodes an ExtendedFeedDetails message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ExtendedFeedDetails
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails;

            /**
             * Verifies an ExtendedFeedDetails message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: {
              [k: string]: unknown;
            }): string | null;

            /**
             * Creates an ExtendedFeedDetails message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ExtendedFeedDetails
             */
            public static fromObject(object: {
              [k: string]: unknown;
            }): com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails;

            /**
             * Creates a plain object from an ExtendedFeedDetails message. Also converts values to other types if specified.
             * @param message ExtendedFeedDetails
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails,
              options?: $protobuf.IConversionOptions,
            ): {
              [k: string]: unknown;
            };

            /**
             * Converts this ExtendedFeedDetails to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: unknown };

            /**
             * Gets the default type url for ExtendedFeedDetails
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

            /** OHLC volume */
            volume?: number | null;

            /** OHLC ts */
            ts?: number | Long | null;

            /** OHLC vol */
            vol?: number | Long | null;
          }

          /** Represents a OHLC. */
          class OHLC implements IOHLC {
            /**
             * Constructs a new OHLC.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeeder.rpc.proto.IOHLC,
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

            /** OHLC volume. */
            public volume: number;

            /** OHLC ts. */
            public ts: number | Long;

            /** OHLC vol. */
            public vol: number | Long;

            /**
             * Creates a new OHLC instance using the specified properties.
             * @param [properties] Properties to set
             * @returns OHLC instance
             */
            public static create(
              properties?: com.upstox.marketdatafeeder.rpc.proto.IOHLC,
            ): com.upstox.marketdatafeeder.rpc.proto.OHLC;

            /**
             * Encodes the specified OHLC message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.OHLC.verify|verify} messages.
             * @param message OHLC message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeeder.rpc.proto.IOHLC,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified OHLC message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.OHLC.verify|verify} messages.
             * @param message OHLC message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeeder.rpc.proto.IOHLC,
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
            ): com.upstox.marketdatafeeder.rpc.proto.OHLC;

            /**
             * Decodes a OHLC message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns OHLC
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeeder.rpc.proto.OHLC;

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
            }): com.upstox.marketdatafeeder.rpc.proto.OHLC;

            /**
             * Creates a plain object from a OHLC message. Also converts values to other types if specified.
             * @param message OHLC
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeeder.rpc.proto.OHLC,
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
          }

          /** Properties of a MarketFullFeed. */
          interface IMarketFullFeed {
            /** MarketFullFeed ltpc */
            ltpc?: com.upstox.marketdatafeeder.rpc.proto.ILTPC | null;

            /** MarketFullFeed marketLevel */
            marketLevel?: com.upstox.marketdatafeeder.rpc.proto.IMarketLevel | null;

            /** MarketFullFeed optionGreeks */
            optionGreeks?: com.upstox.marketdatafeeder.rpc.proto.IOptionGreeks | null;

            /** MarketFullFeed marketOHLC */
            marketOHLC?: com.upstox.marketdatafeeder.rpc.proto.IMarketOHLC | null;

            /** MarketFullFeed eFeedDetails */
            eFeedDetails?: com.upstox.marketdatafeeder.rpc.proto.IExtendedFeedDetails | null;
          }

          /** Represents a MarketFullFeed. */
          class MarketFullFeed implements IMarketFullFeed {
            /**
             * Constructs a new MarketFullFeed.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeeder.rpc.proto.IMarketFullFeed,
            );

            /** MarketFullFeed ltpc. */
            public ltpc?: com.upstox.marketdatafeeder.rpc.proto.ILTPC | null;

            /** MarketFullFeed marketLevel. */
            public marketLevel?: com.upstox.marketdatafeeder.rpc.proto.IMarketLevel | null;

            /** MarketFullFeed optionGreeks. */
            public optionGreeks?: com.upstox.marketdatafeeder.rpc.proto.IOptionGreeks | null;

            /** MarketFullFeed marketOHLC. */
            public marketOHLC?: com.upstox.marketdatafeeder.rpc.proto.IMarketOHLC | null;

            /** MarketFullFeed eFeedDetails. */
            public eFeedDetails?: com.upstox.marketdatafeeder.rpc.proto.IExtendedFeedDetails | null;

            /**
             * Creates a new MarketFullFeed instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MarketFullFeed instance
             */
            public static create(
              properties?: com.upstox.marketdatafeeder.rpc.proto.IMarketFullFeed,
            ): com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed;

            /**
             * Encodes the specified MarketFullFeed message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed.verify|verify} messages.
             * @param message MarketFullFeed message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeeder.rpc.proto.IMarketFullFeed,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified MarketFullFeed message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed.verify|verify} messages.
             * @param message MarketFullFeed message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeeder.rpc.proto.IMarketFullFeed,
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
            ): com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed;

            /**
             * Decodes a MarketFullFeed message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MarketFullFeed
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed;

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
            }): com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed;

            /**
             * Creates a plain object from a MarketFullFeed message. Also converts values to other types if specified.
             * @param message MarketFullFeed
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed,
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
            ltpc?: com.upstox.marketdatafeeder.rpc.proto.ILTPC | null;

            /** IndexFullFeed marketOHLC */
            marketOHLC?: com.upstox.marketdatafeeder.rpc.proto.IMarketOHLC | null;

            /** IndexFullFeed lastClose */
            lastClose?: number | null;

            /** IndexFullFeed yh */
            yh?: number | null;

            /** IndexFullFeed yl */
            yl?: number | null;
          }

          /** Represents an IndexFullFeed. */
          class IndexFullFeed implements IIndexFullFeed {
            /**
             * Constructs a new IndexFullFeed.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeeder.rpc.proto.IIndexFullFeed,
            );

            /** IndexFullFeed ltpc. */
            public ltpc?: com.upstox.marketdatafeeder.rpc.proto.ILTPC | null;

            /** IndexFullFeed marketOHLC. */
            public marketOHLC?: com.upstox.marketdatafeeder.rpc.proto.IMarketOHLC | null;

            /** IndexFullFeed lastClose. */
            public lastClose: number;

            /** IndexFullFeed yh. */
            public yh: number;

            /** IndexFullFeed yl. */
            public yl: number;

            /**
             * Creates a new IndexFullFeed instance using the specified properties.
             * @param [properties] Properties to set
             * @returns IndexFullFeed instance
             */
            public static create(
              properties?: com.upstox.marketdatafeeder.rpc.proto.IIndexFullFeed,
            ): com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed;

            /**
             * Encodes the specified IndexFullFeed message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed.verify|verify} messages.
             * @param message IndexFullFeed message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeeder.rpc.proto.IIndexFullFeed,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified IndexFullFeed message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed.verify|verify} messages.
             * @param message IndexFullFeed message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeeder.rpc.proto.IIndexFullFeed,
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
            ): com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed;

            /**
             * Decodes an IndexFullFeed message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns IndexFullFeed
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed;

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
            }): com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed;

            /**
             * Creates a plain object from an IndexFullFeed message. Also converts values to other types if specified.
             * @param message IndexFullFeed
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed,
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
            marketFF?: com.upstox.marketdatafeeder.rpc.proto.IMarketFullFeed | null;

            /** FullFeed indexFF */
            indexFF?: com.upstox.marketdatafeeder.rpc.proto.IIndexFullFeed | null;
          }

          /** Represents a FullFeed. */
          class FullFeed implements IFullFeed {
            /**
             * Constructs a new FullFeed.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeeder.rpc.proto.IFullFeed,
            );

            /** FullFeed marketFF. */
            public marketFF?: com.upstox.marketdatafeeder.rpc.proto.IMarketFullFeed | null;

            /** FullFeed indexFF. */
            public indexFF?: com.upstox.marketdatafeeder.rpc.proto.IIndexFullFeed | null;

            /** FullFeed FullFeedUnion. */
            public FullFeedUnion?: "marketFF" | "indexFF";

            /**
             * Creates a new FullFeed instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FullFeed instance
             */
            public static create(
              properties?: com.upstox.marketdatafeeder.rpc.proto.IFullFeed,
            ): com.upstox.marketdatafeeder.rpc.proto.FullFeed;

            /**
             * Encodes the specified FullFeed message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.FullFeed.verify|verify} messages.
             * @param message FullFeed message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeeder.rpc.proto.IFullFeed,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified FullFeed message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.FullFeed.verify|verify} messages.
             * @param message FullFeed message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeeder.rpc.proto.IFullFeed,
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
            ): com.upstox.marketdatafeeder.rpc.proto.FullFeed;

            /**
             * Decodes a FullFeed message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FullFeed
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeeder.rpc.proto.FullFeed;

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
            }): com.upstox.marketdatafeeder.rpc.proto.FullFeed;

            /**
             * Creates a plain object from a FullFeed message. Also converts values to other types if specified.
             * @param message FullFeed
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeeder.rpc.proto.FullFeed,
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

          /** Properties of an OptionChain. */
          interface IOptionChain {
            /** OptionChain ltpc */
            ltpc?: com.upstox.marketdatafeeder.rpc.proto.ILTPC | null;

            /** OptionChain bidAskQuote */
            bidAskQuote?: com.upstox.marketdatafeeder.rpc.proto.IQuote | null;

            /** OptionChain optionGreeks */
            optionGreeks?: com.upstox.marketdatafeeder.rpc.proto.IOptionGreeks | null;

            /** OptionChain eFeedDetails */
            eFeedDetails?: com.upstox.marketdatafeeder.rpc.proto.IExtendedFeedDetails | null;
          }

          /** Represents an OptionChain. */
          class OptionChain implements IOptionChain {
            /**
             * Constructs a new OptionChain.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeeder.rpc.proto.IOptionChain,
            );

            /** OptionChain ltpc. */
            public ltpc?: com.upstox.marketdatafeeder.rpc.proto.ILTPC | null;

            /** OptionChain bidAskQuote. */
            public bidAskQuote?: com.upstox.marketdatafeeder.rpc.proto.IQuote | null;

            /** OptionChain optionGreeks. */
            public optionGreeks?: com.upstox.marketdatafeeder.rpc.proto.IOptionGreeks | null;

            /** OptionChain eFeedDetails. */
            public eFeedDetails?: com.upstox.marketdatafeeder.rpc.proto.IExtendedFeedDetails | null;

            /**
             * Creates a new OptionChain instance using the specified properties.
             * @param [properties] Properties to set
             * @returns OptionChain instance
             */
            public static create(
              properties?: com.upstox.marketdatafeeder.rpc.proto.IOptionChain,
            ): com.upstox.marketdatafeeder.rpc.proto.OptionChain;

            /**
             * Encodes the specified OptionChain message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.OptionChain.verify|verify} messages.
             * @param message OptionChain message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeeder.rpc.proto.IOptionChain,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified OptionChain message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.OptionChain.verify|verify} messages.
             * @param message OptionChain message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeeder.rpc.proto.IOptionChain,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Decodes an OptionChain message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns OptionChain
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(
              reader: $protobuf.Reader | Uint8Array,
              length?: number,
            ): com.upstox.marketdatafeeder.rpc.proto.OptionChain;

            /**
             * Decodes an OptionChain message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns OptionChain
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeeder.rpc.proto.OptionChain;

            /**
             * Verifies an OptionChain message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: {
              [k: string]: unknown;
            }): string | null;

            /**
             * Creates an OptionChain message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns OptionChain
             */
            public static fromObject(object: {
              [k: string]: unknown;
            }): com.upstox.marketdatafeeder.rpc.proto.OptionChain;

            /**
             * Creates a plain object from an OptionChain message. Also converts values to other types if specified.
             * @param message OptionChain
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeeder.rpc.proto.OptionChain,
              options?: $protobuf.IConversionOptions,
            ): {
              [k: string]: unknown;
            };

            /**
             * Converts this OptionChain to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: unknown };

            /**
             * Gets the default type url for OptionChain
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
          }

          /** Properties of a Feed. */
          interface IFeed {
            /** Feed ltpc */
            ltpc?: com.upstox.marketdatafeeder.rpc.proto.ILTPC | null;

            /** Feed ff */
            ff?: com.upstox.marketdatafeeder.rpc.proto.IFullFeed | null;

            /** Feed oc */
            oc?: com.upstox.marketdatafeeder.rpc.proto.IOptionChain | null;
          }

          /** Represents a Feed. */
          class Feed implements IFeed {
            /**
             * Constructs a new Feed.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeeder.rpc.proto.IFeed,
            );

            /** Feed ltpc. */
            public ltpc?: com.upstox.marketdatafeeder.rpc.proto.ILTPC | null;

            /** Feed ff. */
            public ff?: com.upstox.marketdatafeeder.rpc.proto.IFullFeed | null;

            /** Feed oc. */
            public oc?: com.upstox.marketdatafeeder.rpc.proto.IOptionChain | null;

            /** Feed FeedUnion. */
            public FeedUnion?: "ltpc" | "ff" | "oc";

            /**
             * Creates a new Feed instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Feed instance
             */
            public static create(
              properties?: com.upstox.marketdatafeeder.rpc.proto.IFeed,
            ): com.upstox.marketdatafeeder.rpc.proto.Feed;

            /**
             * Encodes the specified Feed message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.Feed.verify|verify} messages.
             * @param message Feed message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeeder.rpc.proto.IFeed,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified Feed message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.Feed.verify|verify} messages.
             * @param message Feed message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeeder.rpc.proto.IFeed,
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
            ): com.upstox.marketdatafeeder.rpc.proto.Feed;

            /**
             * Decodes a Feed message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Feed
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeeder.rpc.proto.Feed;

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
            }): com.upstox.marketdatafeeder.rpc.proto.Feed;

            /**
             * Creates a plain object from a Feed message. Also converts values to other types if specified.
             * @param message Feed
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeeder.rpc.proto.Feed,
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

          /** Properties of a FeedResponse. */
          interface IFeedResponse {
            /** FeedResponse type */
            type?: com.upstox.marketdatafeeder.rpc.proto.Type | null;

            /** FeedResponse feeds */
            feeds?: {
              [k: string]: com.upstox.marketdatafeeder.rpc.proto.IFeed;
            } | null;

            /** FeedResponse currentTs */
            currentTs?: number | Long | null;
          }

          /** Represents a FeedResponse. */
          class FeedResponse implements IFeedResponse {
            /**
             * Constructs a new FeedResponse.
             * @param [properties] Properties to set
             */
            constructor(
              properties?: com.upstox.marketdatafeeder.rpc.proto.IFeedResponse,
            );

            /** FeedResponse type. */
            public type: com.upstox.marketdatafeeder.rpc.proto.Type;

            /** FeedResponse feeds. */
            public feeds: {
              [k: string]: com.upstox.marketdatafeeder.rpc.proto.IFeed;
            };

            /** FeedResponse currentTs. */
            public currentTs: number | Long;

            /**
             * Creates a new FeedResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FeedResponse instance
             */
            public static create(
              properties?: com.upstox.marketdatafeeder.rpc.proto.IFeedResponse,
            ): com.upstox.marketdatafeeder.rpc.proto.FeedResponse;

            /**
             * Encodes the specified FeedResponse message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.FeedResponse.verify|verify} messages.
             * @param message FeedResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(
              message: com.upstox.marketdatafeeder.rpc.proto.IFeedResponse,
              writer?: $protobuf.Writer,
            ): $protobuf.Writer;

            /**
             * Encodes the specified FeedResponse message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.FeedResponse.verify|verify} messages.
             * @param message FeedResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(
              message: com.upstox.marketdatafeeder.rpc.proto.IFeedResponse,
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
            ): com.upstox.marketdatafeeder.rpc.proto.FeedResponse;

            /**
             * Decodes a FeedResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FeedResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(
              reader: $protobuf.Reader | Uint8Array,
            ): com.upstox.marketdatafeeder.rpc.proto.FeedResponse;

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
            }): com.upstox.marketdatafeeder.rpc.proto.FeedResponse;

            /**
             * Creates a plain object from a FeedResponse message. Also converts values to other types if specified.
             * @param message FeedResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(
              message: com.upstox.marketdatafeeder.rpc.proto.FeedResponse,
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
