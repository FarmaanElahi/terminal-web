 
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const com = $root.com = (() => {

    /**
     * Namespace com.
     * @exports com
     * @namespace
     */
    const com = {};

    com.upstox = (function() {

        /**
         * Namespace upstox.
         * @memberof com
         * @namespace
         */
        const upstox = {};

        upstox.marketdatafeeder = (function() {

            /**
             * Namespace marketdatafeeder.
             * @memberof com.upstox
             * @namespace
             */
            const marketdatafeeder = {};

            marketdatafeeder.rpc = (function() {

                /**
                 * Namespace rpc.
                 * @memberof com.upstox.marketdatafeeder
                 * @namespace
                 */
                const rpc = {};

                rpc.proto = (function() {

                    /**
                     * Namespace proto.
                     * @memberof com.upstox.marketdatafeeder.rpc
                     * @namespace
                     */
                    const proto = {};

                    proto.LTPC = (function() {

                        /**
                         * Properties of a LTPC.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @interface ILTPC
                         * @property {number|null} [ltp] LTPC ltp
                         * @property {number|Long|null} [ltt] LTPC ltt
                         * @property {number|Long|null} [ltq] LTPC ltq
                         * @property {number|null} [cp] LTPC cp
                         */

                        /**
                         * Constructs a new LTPC.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @classdesc Represents a LTPC.
                         * @implements ILTPC
                         * @constructor
                         * @param {com.upstox.marketdatafeeder.rpc.proto.ILTPC=} [properties] Properties to set
                         */
                        function LTPC(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        /**
                         * LTPC ltp.
                         * @member {number} ltp
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.LTPC
                         * @instance
                         */
                        LTPC.prototype.ltp = 0;

                        /**
                         * LTPC ltt.
                         * @member {number|Long} ltt
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.LTPC
                         * @instance
                         */
                        LTPC.prototype.ltt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * LTPC ltq.
                         * @member {number|Long} ltq
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.LTPC
                         * @instance
                         */
                        LTPC.prototype.ltq = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * LTPC cp.
                         * @member {number} cp
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.LTPC
                         * @instance
                         */
                        LTPC.prototype.cp = 0;

                        /**
                         * Creates a new LTPC instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.LTPC
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.ILTPC=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.LTPC} LTPC instance
                         */
                        LTPC.create = function create(properties) {
                            return new LTPC(properties);
                        };

                        /**
                         * Encodes the specified LTPC message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.LTPC.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.LTPC
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.ILTPC} message LTPC message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        LTPC.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.ltp != null && Object.hasOwnProperty.call(message, "ltp"))
                                writer.uint32(/* id 1, wireType 1 =*/9).double(message.ltp);
                            if (message.ltt != null && Object.hasOwnProperty.call(message, "ltt"))
                                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.ltt);
                            if (message.ltq != null && Object.hasOwnProperty.call(message, "ltq"))
                                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.ltq);
                            if (message.cp != null && Object.hasOwnProperty.call(message, "cp"))
                                writer.uint32(/* id 4, wireType 1 =*/33).double(message.cp);
                            return writer;
                        };

                        /**
                         * Encodes the specified LTPC message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.LTPC.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.LTPC
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.ILTPC} message LTPC message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        LTPC.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes a LTPC message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.LTPC
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.LTPC} LTPC
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        LTPC.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeeder.rpc.proto.LTPC();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        message.ltp = reader.double();
                                        break;
                                    }
                                case 2: {
                                        message.ltt = reader.int64();
                                        break;
                                    }
                                case 3: {
                                        message.ltq = reader.int64();
                                        break;
                                    }
                                case 4: {
                                        message.cp = reader.double();
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        /**
                         * Decodes a LTPC message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.LTPC
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.LTPC} LTPC
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        LTPC.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };

                        /**
                         * Verifies a LTPC message.
                         * @function verify
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.LTPC
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        LTPC.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.ltp != null && message.hasOwnProperty("ltp"))
                                if (typeof message.ltp !== "number")
                                    return "ltp: number expected";
                            if (message.ltt != null && message.hasOwnProperty("ltt"))
                                if (!$util.isInteger(message.ltt) && !(message.ltt && $util.isInteger(message.ltt.low) && $util.isInteger(message.ltt.high)))
                                    return "ltt: integer|Long expected";
                            if (message.ltq != null && message.hasOwnProperty("ltq"))
                                if (!$util.isInteger(message.ltq) && !(message.ltq && $util.isInteger(message.ltq.low) && $util.isInteger(message.ltq.high)))
                                    return "ltq: integer|Long expected";
                            if (message.cp != null && message.hasOwnProperty("cp"))
                                if (typeof message.cp !== "number")
                                    return "cp: number expected";
                            return null;
                        };

                        /**
                         * Creates a LTPC message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.LTPC
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.LTPC} LTPC
                         */
                        LTPC.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeeder.rpc.proto.LTPC)
                                return object;
                            let message = new $root.com.upstox.marketdatafeeder.rpc.proto.LTPC();
                            if (object.ltp != null)
                                message.ltp = Number(object.ltp);
                            if (object.ltt != null)
                                if ($util.Long)
                                    (message.ltt = $util.Long.fromValue(object.ltt)).unsigned = false;
                                else if (typeof object.ltt === "string")
                                    message.ltt = parseInt(object.ltt, 10);
                                else if (typeof object.ltt === "number")
                                    message.ltt = object.ltt;
                                else if (typeof object.ltt === "object")
                                    message.ltt = new $util.LongBits(object.ltt.low >>> 0, object.ltt.high >>> 0).toNumber();
                            if (object.ltq != null)
                                if ($util.Long)
                                    (message.ltq = $util.Long.fromValue(object.ltq)).unsigned = false;
                                else if (typeof object.ltq === "string")
                                    message.ltq = parseInt(object.ltq, 10);
                                else if (typeof object.ltq === "number")
                                    message.ltq = object.ltq;
                                else if (typeof object.ltq === "object")
                                    message.ltq = new $util.LongBits(object.ltq.low >>> 0, object.ltq.high >>> 0).toNumber();
                            if (object.cp != null)
                                message.cp = Number(object.cp);
                            return message;
                        };

                        /**
                         * Creates a plain object from a LTPC message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.LTPC
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.LTPC} message LTPC
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        LTPC.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.defaults) {
                                object.ltp = 0;
                                if ($util.Long) {
                                    let long = new $util.Long(0, 0, false);
                                    object.ltt = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.ltt = options.longs === String ? "0" : 0;
                                if ($util.Long) {
                                    let long = new $util.Long(0, 0, false);
                                    object.ltq = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.ltq = options.longs === String ? "0" : 0;
                                object.cp = 0;
                            }
                            if (message.ltp != null && message.hasOwnProperty("ltp"))
                                object.ltp = options.json && !isFinite(message.ltp) ? String(message.ltp) : message.ltp;
                            if (message.ltt != null && message.hasOwnProperty("ltt"))
                                if (typeof message.ltt === "number")
                                    object.ltt = options.longs === String ? String(message.ltt) : message.ltt;
                                else
                                    object.ltt = options.longs === String ? $util.Long.prototype.toString.call(message.ltt) : options.longs === Number ? new $util.LongBits(message.ltt.low >>> 0, message.ltt.high >>> 0).toNumber() : message.ltt;
                            if (message.ltq != null && message.hasOwnProperty("ltq"))
                                if (typeof message.ltq === "number")
                                    object.ltq = options.longs === String ? String(message.ltq) : message.ltq;
                                else
                                    object.ltq = options.longs === String ? $util.Long.prototype.toString.call(message.ltq) : options.longs === Number ? new $util.LongBits(message.ltq.low >>> 0, message.ltq.high >>> 0).toNumber() : message.ltq;
                            if (message.cp != null && message.hasOwnProperty("cp"))
                                object.cp = options.json && !isFinite(message.cp) ? String(message.cp) : message.cp;
                            return object;
                        };

                        /**
                         * Converts this LTPC to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.LTPC
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        LTPC.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for LTPC
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.LTPC
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        LTPC.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeeder.rpc.proto.LTPC";
                        };

                        return LTPC;
                    })();

                    proto.MarketLevel = (function() {

                        /**
                         * Properties of a MarketLevel.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @interface IMarketLevel
                         * @property {Array.<com.upstox.marketdatafeeder.rpc.proto.IQuote>|null} [bidAskQuote] MarketLevel bidAskQuote
                         * @property {number|Long|null} [lut] MarketLevel lut
                         */

                        /**
                         * Constructs a new MarketLevel.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @classdesc Represents a MarketLevel.
                         * @implements IMarketLevel
                         * @constructor
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IMarketLevel=} [properties] Properties to set
                         */
                        function MarketLevel(properties) {
                            this.bidAskQuote = [];
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        /**
                         * MarketLevel bidAskQuote.
                         * @member {Array.<com.upstox.marketdatafeeder.rpc.proto.IQuote>} bidAskQuote
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketLevel
                         * @instance
                         */
                        MarketLevel.prototype.bidAskQuote = $util.emptyArray;

                        /**
                         * MarketLevel lut.
                         * @member {number|Long} lut
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketLevel
                         * @instance
                         */
                        MarketLevel.prototype.lut = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * Creates a new MarketLevel instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketLevel
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IMarketLevel=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.MarketLevel} MarketLevel instance
                         */
                        MarketLevel.create = function create(properties) {
                            return new MarketLevel(properties);
                        };

                        /**
                         * Encodes the specified MarketLevel message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.MarketLevel.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketLevel
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IMarketLevel} message MarketLevel message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        MarketLevel.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.bidAskQuote != null && message.bidAskQuote.length)
                                for (let i = 0; i < message.bidAskQuote.length; ++i)
                                    $root.com.upstox.marketdatafeeder.rpc.proto.Quote.encode(message.bidAskQuote[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                            if (message.lut != null && Object.hasOwnProperty.call(message, "lut"))
                                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.lut);
                            return writer;
                        };

                        /**
                         * Encodes the specified MarketLevel message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.MarketLevel.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketLevel
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IMarketLevel} message MarketLevel message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        MarketLevel.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes a MarketLevel message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketLevel
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.MarketLevel} MarketLevel
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        MarketLevel.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeeder.rpc.proto.MarketLevel();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        if (!(message.bidAskQuote && message.bidAskQuote.length))
                                            message.bidAskQuote = [];
                                        message.bidAskQuote.push($root.com.upstox.marketdatafeeder.rpc.proto.Quote.decode(reader, reader.uint32()));
                                        break;
                                    }
                                case 2: {
                                        message.lut = reader.int64();
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        /**
                         * Decodes a MarketLevel message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketLevel
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.MarketLevel} MarketLevel
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        MarketLevel.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };

                        /**
                         * Verifies a MarketLevel message.
                         * @function verify
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketLevel
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        MarketLevel.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.bidAskQuote != null && message.hasOwnProperty("bidAskQuote")) {
                                if (!Array.isArray(message.bidAskQuote))
                                    return "bidAskQuote: array expected";
                                for (let i = 0; i < message.bidAskQuote.length; ++i) {
                                    let error = $root.com.upstox.marketdatafeeder.rpc.proto.Quote.verify(message.bidAskQuote[i]);
                                    if (error)
                                        return "bidAskQuote." + error;
                                }
                            }
                            if (message.lut != null && message.hasOwnProperty("lut"))
                                if (!$util.isInteger(message.lut) && !(message.lut && $util.isInteger(message.lut.low) && $util.isInteger(message.lut.high)))
                                    return "lut: integer|Long expected";
                            return null;
                        };

                        /**
                         * Creates a MarketLevel message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketLevel
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.MarketLevel} MarketLevel
                         */
                        MarketLevel.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeeder.rpc.proto.MarketLevel)
                                return object;
                            let message = new $root.com.upstox.marketdatafeeder.rpc.proto.MarketLevel();
                            if (object.bidAskQuote) {
                                if (!Array.isArray(object.bidAskQuote))
                                    throw TypeError(".com.upstox.marketdatafeeder.rpc.proto.MarketLevel.bidAskQuote: array expected");
                                message.bidAskQuote = [];
                                for (let i = 0; i < object.bidAskQuote.length; ++i) {
                                    if (typeof object.bidAskQuote[i] !== "object")
                                        throw TypeError(".com.upstox.marketdatafeeder.rpc.proto.MarketLevel.bidAskQuote: object expected");
                                    message.bidAskQuote[i] = $root.com.upstox.marketdatafeeder.rpc.proto.Quote.fromObject(object.bidAskQuote[i]);
                                }
                            }
                            if (object.lut != null)
                                if ($util.Long)
                                    (message.lut = $util.Long.fromValue(object.lut)).unsigned = false;
                                else if (typeof object.lut === "string")
                                    message.lut = parseInt(object.lut, 10);
                                else if (typeof object.lut === "number")
                                    message.lut = object.lut;
                                else if (typeof object.lut === "object")
                                    message.lut = new $util.LongBits(object.lut.low >>> 0, object.lut.high >>> 0).toNumber();
                            return message;
                        };

                        /**
                         * Creates a plain object from a MarketLevel message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketLevel
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.MarketLevel} message MarketLevel
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        MarketLevel.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.arrays || options.defaults)
                                object.bidAskQuote = [];
                            if (options.defaults)
                                if ($util.Long) {
                                    let long = new $util.Long(0, 0, false);
                                    object.lut = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.lut = options.longs === String ? "0" : 0;
                            if (message.bidAskQuote && message.bidAskQuote.length) {
                                object.bidAskQuote = [];
                                for (let j = 0; j < message.bidAskQuote.length; ++j)
                                    object.bidAskQuote[j] = $root.com.upstox.marketdatafeeder.rpc.proto.Quote.toObject(message.bidAskQuote[j], options);
                            }
                            if (message.lut != null && message.hasOwnProperty("lut"))
                                if (typeof message.lut === "number")
                                    object.lut = options.longs === String ? String(message.lut) : message.lut;
                                else
                                    object.lut = options.longs === String ? $util.Long.prototype.toString.call(message.lut) : options.longs === Number ? new $util.LongBits(message.lut.low >>> 0, message.lut.high >>> 0).toNumber() : message.lut;
                            return object;
                        };

                        /**
                         * Converts this MarketLevel to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketLevel
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        MarketLevel.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for MarketLevel
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketLevel
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        MarketLevel.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeeder.rpc.proto.MarketLevel";
                        };

                        return MarketLevel;
                    })();

                    proto.MarketOHLC = (function() {

                        /**
                         * Properties of a MarketOHLC.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @interface IMarketOHLC
                         * @property {Array.<com.upstox.marketdatafeeder.rpc.proto.IOHLC>|null} [ohlc] MarketOHLC ohlc
                         */

                        /**
                         * Constructs a new MarketOHLC.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @classdesc Represents a MarketOHLC.
                         * @implements IMarketOHLC
                         * @constructor
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IMarketOHLC=} [properties] Properties to set
                         */
                        function MarketOHLC(properties) {
                            this.ohlc = [];
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        /**
                         * MarketOHLC ohlc.
                         * @member {Array.<com.upstox.marketdatafeeder.rpc.proto.IOHLC>} ohlc
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketOHLC
                         * @instance
                         */
                        MarketOHLC.prototype.ohlc = $util.emptyArray;

                        /**
                         * Creates a new MarketOHLC instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketOHLC
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IMarketOHLC=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.MarketOHLC} MarketOHLC instance
                         */
                        MarketOHLC.create = function create(properties) {
                            return new MarketOHLC(properties);
                        };

                        /**
                         * Encodes the specified MarketOHLC message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.MarketOHLC.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketOHLC
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IMarketOHLC} message MarketOHLC message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        MarketOHLC.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.ohlc != null && message.ohlc.length)
                                for (let i = 0; i < message.ohlc.length; ++i)
                                    $root.com.upstox.marketdatafeeder.rpc.proto.OHLC.encode(message.ohlc[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                            return writer;
                        };

                        /**
                         * Encodes the specified MarketOHLC message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.MarketOHLC.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketOHLC
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IMarketOHLC} message MarketOHLC message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        MarketOHLC.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes a MarketOHLC message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketOHLC
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.MarketOHLC} MarketOHLC
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        MarketOHLC.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeeder.rpc.proto.MarketOHLC();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        if (!(message.ohlc && message.ohlc.length))
                                            message.ohlc = [];
                                        message.ohlc.push($root.com.upstox.marketdatafeeder.rpc.proto.OHLC.decode(reader, reader.uint32()));
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        /**
                         * Decodes a MarketOHLC message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketOHLC
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.MarketOHLC} MarketOHLC
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        MarketOHLC.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };

                        /**
                         * Verifies a MarketOHLC message.
                         * @function verify
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketOHLC
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        MarketOHLC.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.ohlc != null && message.hasOwnProperty("ohlc")) {
                                if (!Array.isArray(message.ohlc))
                                    return "ohlc: array expected";
                                for (let i = 0; i < message.ohlc.length; ++i) {
                                    let error = $root.com.upstox.marketdatafeeder.rpc.proto.OHLC.verify(message.ohlc[i]);
                                    if (error)
                                        return "ohlc." + error;
                                }
                            }
                            return null;
                        };

                        /**
                         * Creates a MarketOHLC message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketOHLC
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.MarketOHLC} MarketOHLC
                         */
                        MarketOHLC.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeeder.rpc.proto.MarketOHLC)
                                return object;
                            let message = new $root.com.upstox.marketdatafeeder.rpc.proto.MarketOHLC();
                            if (object.ohlc) {
                                if (!Array.isArray(object.ohlc))
                                    throw TypeError(".com.upstox.marketdatafeeder.rpc.proto.MarketOHLC.ohlc: array expected");
                                message.ohlc = [];
                                for (let i = 0; i < object.ohlc.length; ++i) {
                                    if (typeof object.ohlc[i] !== "object")
                                        throw TypeError(".com.upstox.marketdatafeeder.rpc.proto.MarketOHLC.ohlc: object expected");
                                    message.ohlc[i] = $root.com.upstox.marketdatafeeder.rpc.proto.OHLC.fromObject(object.ohlc[i]);
                                }
                            }
                            return message;
                        };

                        /**
                         * Creates a plain object from a MarketOHLC message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketOHLC
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.MarketOHLC} message MarketOHLC
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        MarketOHLC.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.arrays || options.defaults)
                                object.ohlc = [];
                            if (message.ohlc && message.ohlc.length) {
                                object.ohlc = [];
                                for (let j = 0; j < message.ohlc.length; ++j)
                                    object.ohlc[j] = $root.com.upstox.marketdatafeeder.rpc.proto.OHLC.toObject(message.ohlc[j], options);
                            }
                            return object;
                        };

                        /**
                         * Converts this MarketOHLC to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketOHLC
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        MarketOHLC.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for MarketOHLC
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketOHLC
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        MarketOHLC.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeeder.rpc.proto.MarketOHLC";
                        };

                        return MarketOHLC;
                    })();

                    proto.Quote = (function() {

                        /**
                         * Properties of a Quote.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @interface IQuote
                         * @property {number|null} [bq] Quote bq
                         * @property {number|null} [bp] Quote bp
                         * @property {number|null} [bno] Quote bno
                         * @property {number|null} [aq] Quote aq
                         * @property {number|null} [ap] Quote ap
                         * @property {number|null} [ano] Quote ano
                         * @property {number|Long|null} [bidQ] Quote bidQ
                         * @property {number|Long|null} [askQ] Quote askQ
                         */

                        /**
                         * Constructs a new Quote.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @classdesc Represents a Quote.
                         * @implements IQuote
                         * @constructor
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IQuote=} [properties] Properties to set
                         */
                        function Quote(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        /**
                         * Quote bq.
                         * @member {number} bq
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Quote
                         * @instance
                         */
                        Quote.prototype.bq = 0;

                        /**
                         * Quote bp.
                         * @member {number} bp
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Quote
                         * @instance
                         */
                        Quote.prototype.bp = 0;

                        /**
                         * Quote bno.
                         * @member {number} bno
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Quote
                         * @instance
                         */
                        Quote.prototype.bno = 0;

                        /**
                         * Quote aq.
                         * @member {number} aq
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Quote
                         * @instance
                         */
                        Quote.prototype.aq = 0;

                        /**
                         * Quote ap.
                         * @member {number} ap
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Quote
                         * @instance
                         */
                        Quote.prototype.ap = 0;

                        /**
                         * Quote ano.
                         * @member {number} ano
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Quote
                         * @instance
                         */
                        Quote.prototype.ano = 0;

                        /**
                         * Quote bidQ.
                         * @member {number|Long} bidQ
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Quote
                         * @instance
                         */
                        Quote.prototype.bidQ = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * Quote askQ.
                         * @member {number|Long} askQ
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Quote
                         * @instance
                         */
                        Quote.prototype.askQ = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * Creates a new Quote instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Quote
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IQuote=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.Quote} Quote instance
                         */
                        Quote.create = function create(properties) {
                            return new Quote(properties);
                        };

                        /**
                         * Encodes the specified Quote message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.Quote.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Quote
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IQuote} message Quote message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Quote.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.bq != null && Object.hasOwnProperty.call(message, "bq"))
                                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.bq);
                            if (message.bp != null && Object.hasOwnProperty.call(message, "bp"))
                                writer.uint32(/* id 2, wireType 1 =*/17).double(message.bp);
                            if (message.bno != null && Object.hasOwnProperty.call(message, "bno"))
                                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.bno);
                            if (message.aq != null && Object.hasOwnProperty.call(message, "aq"))
                                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.aq);
                            if (message.ap != null && Object.hasOwnProperty.call(message, "ap"))
                                writer.uint32(/* id 5, wireType 1 =*/41).double(message.ap);
                            if (message.ano != null && Object.hasOwnProperty.call(message, "ano"))
                                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.ano);
                            if (message.bidQ != null && Object.hasOwnProperty.call(message, "bidQ"))
                                writer.uint32(/* id 7, wireType 0 =*/56).int64(message.bidQ);
                            if (message.askQ != null && Object.hasOwnProperty.call(message, "askQ"))
                                writer.uint32(/* id 8, wireType 0 =*/64).int64(message.askQ);
                            return writer;
                        };

                        /**
                         * Encodes the specified Quote message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.Quote.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Quote
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IQuote} message Quote message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Quote.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes a Quote message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Quote
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.Quote} Quote
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Quote.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeeder.rpc.proto.Quote();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        message.bq = reader.int32();
                                        break;
                                    }
                                case 2: {
                                        message.bp = reader.double();
                                        break;
                                    }
                                case 3: {
                                        message.bno = reader.int32();
                                        break;
                                    }
                                case 4: {
                                        message.aq = reader.int32();
                                        break;
                                    }
                                case 5: {
                                        message.ap = reader.double();
                                        break;
                                    }
                                case 6: {
                                        message.ano = reader.int32();
                                        break;
                                    }
                                case 7: {
                                        message.bidQ = reader.int64();
                                        break;
                                    }
                                case 8: {
                                        message.askQ = reader.int64();
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        /**
                         * Decodes a Quote message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Quote
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.Quote} Quote
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Quote.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };

                        /**
                         * Verifies a Quote message.
                         * @function verify
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Quote
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        Quote.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.bq != null && message.hasOwnProperty("bq"))
                                if (!$util.isInteger(message.bq))
                                    return "bq: integer expected";
                            if (message.bp != null && message.hasOwnProperty("bp"))
                                if (typeof message.bp !== "number")
                                    return "bp: number expected";
                            if (message.bno != null && message.hasOwnProperty("bno"))
                                if (!$util.isInteger(message.bno))
                                    return "bno: integer expected";
                            if (message.aq != null && message.hasOwnProperty("aq"))
                                if (!$util.isInteger(message.aq))
                                    return "aq: integer expected";
                            if (message.ap != null && message.hasOwnProperty("ap"))
                                if (typeof message.ap !== "number")
                                    return "ap: number expected";
                            if (message.ano != null && message.hasOwnProperty("ano"))
                                if (!$util.isInteger(message.ano))
                                    return "ano: integer expected";
                            if (message.bidQ != null && message.hasOwnProperty("bidQ"))
                                if (!$util.isInteger(message.bidQ) && !(message.bidQ && $util.isInteger(message.bidQ.low) && $util.isInteger(message.bidQ.high)))
                                    return "bidQ: integer|Long expected";
                            if (message.askQ != null && message.hasOwnProperty("askQ"))
                                if (!$util.isInteger(message.askQ) && !(message.askQ && $util.isInteger(message.askQ.low) && $util.isInteger(message.askQ.high)))
                                    return "askQ: integer|Long expected";
                            return null;
                        };

                        /**
                         * Creates a Quote message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Quote
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.Quote} Quote
                         */
                        Quote.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeeder.rpc.proto.Quote)
                                return object;
                            let message = new $root.com.upstox.marketdatafeeder.rpc.proto.Quote();
                            if (object.bq != null)
                                message.bq = object.bq | 0;
                            if (object.bp != null)
                                message.bp = Number(object.bp);
                            if (object.bno != null)
                                message.bno = object.bno | 0;
                            if (object.aq != null)
                                message.aq = object.aq | 0;
                            if (object.ap != null)
                                message.ap = Number(object.ap);
                            if (object.ano != null)
                                message.ano = object.ano | 0;
                            if (object.bidQ != null)
                                if ($util.Long)
                                    (message.bidQ = $util.Long.fromValue(object.bidQ)).unsigned = false;
                                else if (typeof object.bidQ === "string")
                                    message.bidQ = parseInt(object.bidQ, 10);
                                else if (typeof object.bidQ === "number")
                                    message.bidQ = object.bidQ;
                                else if (typeof object.bidQ === "object")
                                    message.bidQ = new $util.LongBits(object.bidQ.low >>> 0, object.bidQ.high >>> 0).toNumber();
                            if (object.askQ != null)
                                if ($util.Long)
                                    (message.askQ = $util.Long.fromValue(object.askQ)).unsigned = false;
                                else if (typeof object.askQ === "string")
                                    message.askQ = parseInt(object.askQ, 10);
                                else if (typeof object.askQ === "number")
                                    message.askQ = object.askQ;
                                else if (typeof object.askQ === "object")
                                    message.askQ = new $util.LongBits(object.askQ.low >>> 0, object.askQ.high >>> 0).toNumber();
                            return message;
                        };

                        /**
                         * Creates a plain object from a Quote message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Quote
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.Quote} message Quote
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        Quote.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.defaults) {
                                object.bq = 0;
                                object.bp = 0;
                                object.bno = 0;
                                object.aq = 0;
                                object.ap = 0;
                                object.ano = 0;
                                if ($util.Long) {
                                    let long = new $util.Long(0, 0, false);
                                    object.bidQ = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.bidQ = options.longs === String ? "0" : 0;
                                if ($util.Long) {
                                    let long = new $util.Long(0, 0, false);
                                    object.askQ = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.askQ = options.longs === String ? "0" : 0;
                            }
                            if (message.bq != null && message.hasOwnProperty("bq"))
                                object.bq = message.bq;
                            if (message.bp != null && message.hasOwnProperty("bp"))
                                object.bp = options.json && !isFinite(message.bp) ? String(message.bp) : message.bp;
                            if (message.bno != null && message.hasOwnProperty("bno"))
                                object.bno = message.bno;
                            if (message.aq != null && message.hasOwnProperty("aq"))
                                object.aq = message.aq;
                            if (message.ap != null && message.hasOwnProperty("ap"))
                                object.ap = options.json && !isFinite(message.ap) ? String(message.ap) : message.ap;
                            if (message.ano != null && message.hasOwnProperty("ano"))
                                object.ano = message.ano;
                            if (message.bidQ != null && message.hasOwnProperty("bidQ"))
                                if (typeof message.bidQ === "number")
                                    object.bidQ = options.longs === String ? String(message.bidQ) : message.bidQ;
                                else
                                    object.bidQ = options.longs === String ? $util.Long.prototype.toString.call(message.bidQ) : options.longs === Number ? new $util.LongBits(message.bidQ.low >>> 0, message.bidQ.high >>> 0).toNumber() : message.bidQ;
                            if (message.askQ != null && message.hasOwnProperty("askQ"))
                                if (typeof message.askQ === "number")
                                    object.askQ = options.longs === String ? String(message.askQ) : message.askQ;
                                else
                                    object.askQ = options.longs === String ? $util.Long.prototype.toString.call(message.askQ) : options.longs === Number ? new $util.LongBits(message.askQ.low >>> 0, message.askQ.high >>> 0).toNumber() : message.askQ;
                            return object;
                        };

                        /**
                         * Converts this Quote to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Quote
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        Quote.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for Quote
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Quote
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        Quote.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeeder.rpc.proto.Quote";
                        };

                        return Quote;
                    })();

                    proto.OptionGreeks = (function() {

                        /**
                         * Properties of an OptionGreeks.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @interface IOptionGreeks
                         * @property {number|null} [op] OptionGreeks op
                         * @property {number|null} [up] OptionGreeks up
                         * @property {number|null} [iv] OptionGreeks iv
                         * @property {number|null} [delta] OptionGreeks delta
                         * @property {number|null} [theta] OptionGreeks theta
                         * @property {number|null} [gamma] OptionGreeks gamma
                         * @property {number|null} [vega] OptionGreeks vega
                         * @property {number|null} [rho] OptionGreeks rho
                         */

                        /**
                         * Constructs a new OptionGreeks.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @classdesc Represents an OptionGreeks.
                         * @implements IOptionGreeks
                         * @constructor
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IOptionGreeks=} [properties] Properties to set
                         */
                        function OptionGreeks(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        /**
                         * OptionGreeks op.
                         * @member {number} op
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionGreeks
                         * @instance
                         */
                        OptionGreeks.prototype.op = 0;

                        /**
                         * OptionGreeks up.
                         * @member {number} up
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionGreeks
                         * @instance
                         */
                        OptionGreeks.prototype.up = 0;

                        /**
                         * OptionGreeks iv.
                         * @member {number} iv
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionGreeks
                         * @instance
                         */
                        OptionGreeks.prototype.iv = 0;

                        /**
                         * OptionGreeks delta.
                         * @member {number} delta
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionGreeks
                         * @instance
                         */
                        OptionGreeks.prototype.delta = 0;

                        /**
                         * OptionGreeks theta.
                         * @member {number} theta
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionGreeks
                         * @instance
                         */
                        OptionGreeks.prototype.theta = 0;

                        /**
                         * OptionGreeks gamma.
                         * @member {number} gamma
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionGreeks
                         * @instance
                         */
                        OptionGreeks.prototype.gamma = 0;

                        /**
                         * OptionGreeks vega.
                         * @member {number} vega
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionGreeks
                         * @instance
                         */
                        OptionGreeks.prototype.vega = 0;

                        /**
                         * OptionGreeks rho.
                         * @member {number} rho
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionGreeks
                         * @instance
                         */
                        OptionGreeks.prototype.rho = 0;

                        /**
                         * Creates a new OptionGreeks instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionGreeks
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IOptionGreeks=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.OptionGreeks} OptionGreeks instance
                         */
                        OptionGreeks.create = function create(properties) {
                            return new OptionGreeks(properties);
                        };

                        /**
                         * Encodes the specified OptionGreeks message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.OptionGreeks.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionGreeks
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IOptionGreeks} message OptionGreeks message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        OptionGreeks.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.op != null && Object.hasOwnProperty.call(message, "op"))
                                writer.uint32(/* id 1, wireType 1 =*/9).double(message.op);
                            if (message.up != null && Object.hasOwnProperty.call(message, "up"))
                                writer.uint32(/* id 2, wireType 1 =*/17).double(message.up);
                            if (message.iv != null && Object.hasOwnProperty.call(message, "iv"))
                                writer.uint32(/* id 3, wireType 1 =*/25).double(message.iv);
                            if (message.delta != null && Object.hasOwnProperty.call(message, "delta"))
                                writer.uint32(/* id 4, wireType 1 =*/33).double(message.delta);
                            if (message.theta != null && Object.hasOwnProperty.call(message, "theta"))
                                writer.uint32(/* id 5, wireType 1 =*/41).double(message.theta);
                            if (message.gamma != null && Object.hasOwnProperty.call(message, "gamma"))
                                writer.uint32(/* id 6, wireType 1 =*/49).double(message.gamma);
                            if (message.vega != null && Object.hasOwnProperty.call(message, "vega"))
                                writer.uint32(/* id 7, wireType 1 =*/57).double(message.vega);
                            if (message.rho != null && Object.hasOwnProperty.call(message, "rho"))
                                writer.uint32(/* id 8, wireType 1 =*/65).double(message.rho);
                            return writer;
                        };

                        /**
                         * Encodes the specified OptionGreeks message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.OptionGreeks.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionGreeks
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IOptionGreeks} message OptionGreeks message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        OptionGreeks.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes an OptionGreeks message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionGreeks
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.OptionGreeks} OptionGreeks
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        OptionGreeks.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeeder.rpc.proto.OptionGreeks();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        message.op = reader.double();
                                        break;
                                    }
                                case 2: {
                                        message.up = reader.double();
                                        break;
                                    }
                                case 3: {
                                        message.iv = reader.double();
                                        break;
                                    }
                                case 4: {
                                        message.delta = reader.double();
                                        break;
                                    }
                                case 5: {
                                        message.theta = reader.double();
                                        break;
                                    }
                                case 6: {
                                        message.gamma = reader.double();
                                        break;
                                    }
                                case 7: {
                                        message.vega = reader.double();
                                        break;
                                    }
                                case 8: {
                                        message.rho = reader.double();
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        /**
                         * Decodes an OptionGreeks message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionGreeks
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.OptionGreeks} OptionGreeks
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        OptionGreeks.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };

                        /**
                         * Verifies an OptionGreeks message.
                         * @function verify
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionGreeks
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        OptionGreeks.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.op != null && message.hasOwnProperty("op"))
                                if (typeof message.op !== "number")
                                    return "op: number expected";
                            if (message.up != null && message.hasOwnProperty("up"))
                                if (typeof message.up !== "number")
                                    return "up: number expected";
                            if (message.iv != null && message.hasOwnProperty("iv"))
                                if (typeof message.iv !== "number")
                                    return "iv: number expected";
                            if (message.delta != null && message.hasOwnProperty("delta"))
                                if (typeof message.delta !== "number")
                                    return "delta: number expected";
                            if (message.theta != null && message.hasOwnProperty("theta"))
                                if (typeof message.theta !== "number")
                                    return "theta: number expected";
                            if (message.gamma != null && message.hasOwnProperty("gamma"))
                                if (typeof message.gamma !== "number")
                                    return "gamma: number expected";
                            if (message.vega != null && message.hasOwnProperty("vega"))
                                if (typeof message.vega !== "number")
                                    return "vega: number expected";
                            if (message.rho != null && message.hasOwnProperty("rho"))
                                if (typeof message.rho !== "number")
                                    return "rho: number expected";
                            return null;
                        };

                        /**
                         * Creates an OptionGreeks message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionGreeks
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.OptionGreeks} OptionGreeks
                         */
                        OptionGreeks.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeeder.rpc.proto.OptionGreeks)
                                return object;
                            let message = new $root.com.upstox.marketdatafeeder.rpc.proto.OptionGreeks();
                            if (object.op != null)
                                message.op = Number(object.op);
                            if (object.up != null)
                                message.up = Number(object.up);
                            if (object.iv != null)
                                message.iv = Number(object.iv);
                            if (object.delta != null)
                                message.delta = Number(object.delta);
                            if (object.theta != null)
                                message.theta = Number(object.theta);
                            if (object.gamma != null)
                                message.gamma = Number(object.gamma);
                            if (object.vega != null)
                                message.vega = Number(object.vega);
                            if (object.rho != null)
                                message.rho = Number(object.rho);
                            return message;
                        };

                        /**
                         * Creates a plain object from an OptionGreeks message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionGreeks
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.OptionGreeks} message OptionGreeks
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        OptionGreeks.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.defaults) {
                                object.op = 0;
                                object.up = 0;
                                object.iv = 0;
                                object.delta = 0;
                                object.theta = 0;
                                object.gamma = 0;
                                object.vega = 0;
                                object.rho = 0;
                            }
                            if (message.op != null && message.hasOwnProperty("op"))
                                object.op = options.json && !isFinite(message.op) ? String(message.op) : message.op;
                            if (message.up != null && message.hasOwnProperty("up"))
                                object.up = options.json && !isFinite(message.up) ? String(message.up) : message.up;
                            if (message.iv != null && message.hasOwnProperty("iv"))
                                object.iv = options.json && !isFinite(message.iv) ? String(message.iv) : message.iv;
                            if (message.delta != null && message.hasOwnProperty("delta"))
                                object.delta = options.json && !isFinite(message.delta) ? String(message.delta) : message.delta;
                            if (message.theta != null && message.hasOwnProperty("theta"))
                                object.theta = options.json && !isFinite(message.theta) ? String(message.theta) : message.theta;
                            if (message.gamma != null && message.hasOwnProperty("gamma"))
                                object.gamma = options.json && !isFinite(message.gamma) ? String(message.gamma) : message.gamma;
                            if (message.vega != null && message.hasOwnProperty("vega"))
                                object.vega = options.json && !isFinite(message.vega) ? String(message.vega) : message.vega;
                            if (message.rho != null && message.hasOwnProperty("rho"))
                                object.rho = options.json && !isFinite(message.rho) ? String(message.rho) : message.rho;
                            return object;
                        };

                        /**
                         * Converts this OptionGreeks to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionGreeks
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        OptionGreeks.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for OptionGreeks
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionGreeks
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        OptionGreeks.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeeder.rpc.proto.OptionGreeks";
                        };

                        return OptionGreeks;
                    })();

                    proto.ExtendedFeedDetails = (function() {

                        /**
                         * Properties of an ExtendedFeedDetails.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @interface IExtendedFeedDetails
                         * @property {number|null} [atp] ExtendedFeedDetails atp
                         * @property {number|null} [cp] ExtendedFeedDetails cp
                         * @property {number|Long|null} [vtt] ExtendedFeedDetails vtt
                         * @property {number|null} [oi] ExtendedFeedDetails oi
                         * @property {number|null} [changeOi] ExtendedFeedDetails changeOi
                         * @property {number|null} [lastClose] ExtendedFeedDetails lastClose
                         * @property {number|null} [tbq] ExtendedFeedDetails tbq
                         * @property {number|null} [tsq] ExtendedFeedDetails tsq
                         * @property {number|null} [close] ExtendedFeedDetails close
                         * @property {number|null} [lc] ExtendedFeedDetails lc
                         * @property {number|null} [uc] ExtendedFeedDetails uc
                         * @property {number|null} [yh] ExtendedFeedDetails yh
                         * @property {number|null} [yl] ExtendedFeedDetails yl
                         * @property {number|null} [fp] ExtendedFeedDetails fp
                         * @property {number|null} [fv] ExtendedFeedDetails fv
                         * @property {number|Long|null} [mbpBuy] ExtendedFeedDetails mbpBuy
                         * @property {number|Long|null} [mbpSell] ExtendedFeedDetails mbpSell
                         * @property {number|Long|null} [tv] ExtendedFeedDetails tv
                         * @property {number|null} [dhoi] ExtendedFeedDetails dhoi
                         * @property {number|null} [dloi] ExtendedFeedDetails dloi
                         * @property {number|null} [sp] ExtendedFeedDetails sp
                         * @property {number|null} [poi] ExtendedFeedDetails poi
                         */

                        /**
                         * Constructs a new ExtendedFeedDetails.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @classdesc Represents an ExtendedFeedDetails.
                         * @implements IExtendedFeedDetails
                         * @constructor
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IExtendedFeedDetails=} [properties] Properties to set
                         */
                        function ExtendedFeedDetails(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        /**
                         * ExtendedFeedDetails atp.
                         * @member {number} atp
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         */
                        ExtendedFeedDetails.prototype.atp = 0;

                        /**
                         * ExtendedFeedDetails cp.
                         * @member {number} cp
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         */
                        ExtendedFeedDetails.prototype.cp = 0;

                        /**
                         * ExtendedFeedDetails vtt.
                         * @member {number|Long} vtt
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         */
                        ExtendedFeedDetails.prototype.vtt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * ExtendedFeedDetails oi.
                         * @member {number} oi
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         */
                        ExtendedFeedDetails.prototype.oi = 0;

                        /**
                         * ExtendedFeedDetails changeOi.
                         * @member {number} changeOi
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         */
                        ExtendedFeedDetails.prototype.changeOi = 0;

                        /**
                         * ExtendedFeedDetails lastClose.
                         * @member {number} lastClose
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         */
                        ExtendedFeedDetails.prototype.lastClose = 0;

                        /**
                         * ExtendedFeedDetails tbq.
                         * @member {number} tbq
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         */
                        ExtendedFeedDetails.prototype.tbq = 0;

                        /**
                         * ExtendedFeedDetails tsq.
                         * @member {number} tsq
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         */
                        ExtendedFeedDetails.prototype.tsq = 0;

                        /**
                         * ExtendedFeedDetails close.
                         * @member {number} close
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         */
                        ExtendedFeedDetails.prototype.close = 0;

                        /**
                         * ExtendedFeedDetails lc.
                         * @member {number} lc
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         */
                        ExtendedFeedDetails.prototype.lc = 0;

                        /**
                         * ExtendedFeedDetails uc.
                         * @member {number} uc
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         */
                        ExtendedFeedDetails.prototype.uc = 0;

                        /**
                         * ExtendedFeedDetails yh.
                         * @member {number} yh
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         */
                        ExtendedFeedDetails.prototype.yh = 0;

                        /**
                         * ExtendedFeedDetails yl.
                         * @member {number} yl
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         */
                        ExtendedFeedDetails.prototype.yl = 0;

                        /**
                         * ExtendedFeedDetails fp.
                         * @member {number} fp
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         */
                        ExtendedFeedDetails.prototype.fp = 0;

                        /**
                         * ExtendedFeedDetails fv.
                         * @member {number} fv
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         */
                        ExtendedFeedDetails.prototype.fv = 0;

                        /**
                         * ExtendedFeedDetails mbpBuy.
                         * @member {number|Long} mbpBuy
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         */
                        ExtendedFeedDetails.prototype.mbpBuy = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * ExtendedFeedDetails mbpSell.
                         * @member {number|Long} mbpSell
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         */
                        ExtendedFeedDetails.prototype.mbpSell = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * ExtendedFeedDetails tv.
                         * @member {number|Long} tv
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         */
                        ExtendedFeedDetails.prototype.tv = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * ExtendedFeedDetails dhoi.
                         * @member {number} dhoi
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         */
                        ExtendedFeedDetails.prototype.dhoi = 0;

                        /**
                         * ExtendedFeedDetails dloi.
                         * @member {number} dloi
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         */
                        ExtendedFeedDetails.prototype.dloi = 0;

                        /**
                         * ExtendedFeedDetails sp.
                         * @member {number} sp
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         */
                        ExtendedFeedDetails.prototype.sp = 0;

                        /**
                         * ExtendedFeedDetails poi.
                         * @member {number} poi
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         */
                        ExtendedFeedDetails.prototype.poi = 0;

                        /**
                         * Creates a new ExtendedFeedDetails instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IExtendedFeedDetails=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails} ExtendedFeedDetails instance
                         */
                        ExtendedFeedDetails.create = function create(properties) {
                            return new ExtendedFeedDetails(properties);
                        };

                        /**
                         * Encodes the specified ExtendedFeedDetails message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IExtendedFeedDetails} message ExtendedFeedDetails message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        ExtendedFeedDetails.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.atp != null && Object.hasOwnProperty.call(message, "atp"))
                                writer.uint32(/* id 1, wireType 1 =*/9).double(message.atp);
                            if (message.cp != null && Object.hasOwnProperty.call(message, "cp"))
                                writer.uint32(/* id 2, wireType 1 =*/17).double(message.cp);
                            if (message.vtt != null && Object.hasOwnProperty.call(message, "vtt"))
                                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.vtt);
                            if (message.oi != null && Object.hasOwnProperty.call(message, "oi"))
                                writer.uint32(/* id 4, wireType 1 =*/33).double(message.oi);
                            if (message.changeOi != null && Object.hasOwnProperty.call(message, "changeOi"))
                                writer.uint32(/* id 5, wireType 1 =*/41).double(message.changeOi);
                            if (message.lastClose != null && Object.hasOwnProperty.call(message, "lastClose"))
                                writer.uint32(/* id 6, wireType 1 =*/49).double(message.lastClose);
                            if (message.tbq != null && Object.hasOwnProperty.call(message, "tbq"))
                                writer.uint32(/* id 7, wireType 1 =*/57).double(message.tbq);
                            if (message.tsq != null && Object.hasOwnProperty.call(message, "tsq"))
                                writer.uint32(/* id 8, wireType 1 =*/65).double(message.tsq);
                            if (message.close != null && Object.hasOwnProperty.call(message, "close"))
                                writer.uint32(/* id 9, wireType 1 =*/73).double(message.close);
                            if (message.lc != null && Object.hasOwnProperty.call(message, "lc"))
                                writer.uint32(/* id 10, wireType 1 =*/81).double(message.lc);
                            if (message.uc != null && Object.hasOwnProperty.call(message, "uc"))
                                writer.uint32(/* id 11, wireType 1 =*/89).double(message.uc);
                            if (message.yh != null && Object.hasOwnProperty.call(message, "yh"))
                                writer.uint32(/* id 12, wireType 1 =*/97).double(message.yh);
                            if (message.yl != null && Object.hasOwnProperty.call(message, "yl"))
                                writer.uint32(/* id 13, wireType 1 =*/105).double(message.yl);
                            if (message.fp != null && Object.hasOwnProperty.call(message, "fp"))
                                writer.uint32(/* id 14, wireType 1 =*/113).double(message.fp);
                            if (message.fv != null && Object.hasOwnProperty.call(message, "fv"))
                                writer.uint32(/* id 15, wireType 0 =*/120).int32(message.fv);
                            if (message.mbpBuy != null && Object.hasOwnProperty.call(message, "mbpBuy"))
                                writer.uint32(/* id 16, wireType 0 =*/128).int64(message.mbpBuy);
                            if (message.mbpSell != null && Object.hasOwnProperty.call(message, "mbpSell"))
                                writer.uint32(/* id 17, wireType 0 =*/136).int64(message.mbpSell);
                            if (message.tv != null && Object.hasOwnProperty.call(message, "tv"))
                                writer.uint32(/* id 18, wireType 0 =*/144).int64(message.tv);
                            if (message.dhoi != null && Object.hasOwnProperty.call(message, "dhoi"))
                                writer.uint32(/* id 19, wireType 1 =*/153).double(message.dhoi);
                            if (message.dloi != null && Object.hasOwnProperty.call(message, "dloi"))
                                writer.uint32(/* id 20, wireType 1 =*/161).double(message.dloi);
                            if (message.sp != null && Object.hasOwnProperty.call(message, "sp"))
                                writer.uint32(/* id 21, wireType 1 =*/169).double(message.sp);
                            if (message.poi != null && Object.hasOwnProperty.call(message, "poi"))
                                writer.uint32(/* id 22, wireType 1 =*/177).double(message.poi);
                            return writer;
                        };

                        /**
                         * Encodes the specified ExtendedFeedDetails message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IExtendedFeedDetails} message ExtendedFeedDetails message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        ExtendedFeedDetails.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes an ExtendedFeedDetails message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails} ExtendedFeedDetails
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        ExtendedFeedDetails.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        message.atp = reader.double();
                                        break;
                                    }
                                case 2: {
                                        message.cp = reader.double();
                                        break;
                                    }
                                case 3: {
                                        message.vtt = reader.int64();
                                        break;
                                    }
                                case 4: {
                                        message.oi = reader.double();
                                        break;
                                    }
                                case 5: {
                                        message.changeOi = reader.double();
                                        break;
                                    }
                                case 6: {
                                        message.lastClose = reader.double();
                                        break;
                                    }
                                case 7: {
                                        message.tbq = reader.double();
                                        break;
                                    }
                                case 8: {
                                        message.tsq = reader.double();
                                        break;
                                    }
                                case 9: {
                                        message.close = reader.double();
                                        break;
                                    }
                                case 10: {
                                        message.lc = reader.double();
                                        break;
                                    }
                                case 11: {
                                        message.uc = reader.double();
                                        break;
                                    }
                                case 12: {
                                        message.yh = reader.double();
                                        break;
                                    }
                                case 13: {
                                        message.yl = reader.double();
                                        break;
                                    }
                                case 14: {
                                        message.fp = reader.double();
                                        break;
                                    }
                                case 15: {
                                        message.fv = reader.int32();
                                        break;
                                    }
                                case 16: {
                                        message.mbpBuy = reader.int64();
                                        break;
                                    }
                                case 17: {
                                        message.mbpSell = reader.int64();
                                        break;
                                    }
                                case 18: {
                                        message.tv = reader.int64();
                                        break;
                                    }
                                case 19: {
                                        message.dhoi = reader.double();
                                        break;
                                    }
                                case 20: {
                                        message.dloi = reader.double();
                                        break;
                                    }
                                case 21: {
                                        message.sp = reader.double();
                                        break;
                                    }
                                case 22: {
                                        message.poi = reader.double();
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        /**
                         * Decodes an ExtendedFeedDetails message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails} ExtendedFeedDetails
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        ExtendedFeedDetails.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };

                        /**
                         * Verifies an ExtendedFeedDetails message.
                         * @function verify
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        ExtendedFeedDetails.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.atp != null && message.hasOwnProperty("atp"))
                                if (typeof message.atp !== "number")
                                    return "atp: number expected";
                            if (message.cp != null && message.hasOwnProperty("cp"))
                                if (typeof message.cp !== "number")
                                    return "cp: number expected";
                            if (message.vtt != null && message.hasOwnProperty("vtt"))
                                if (!$util.isInteger(message.vtt) && !(message.vtt && $util.isInteger(message.vtt.low) && $util.isInteger(message.vtt.high)))
                                    return "vtt: integer|Long expected";
                            if (message.oi != null && message.hasOwnProperty("oi"))
                                if (typeof message.oi !== "number")
                                    return "oi: number expected";
                            if (message.changeOi != null && message.hasOwnProperty("changeOi"))
                                if (typeof message.changeOi !== "number")
                                    return "changeOi: number expected";
                            if (message.lastClose != null && message.hasOwnProperty("lastClose"))
                                if (typeof message.lastClose !== "number")
                                    return "lastClose: number expected";
                            if (message.tbq != null && message.hasOwnProperty("tbq"))
                                if (typeof message.tbq !== "number")
                                    return "tbq: number expected";
                            if (message.tsq != null && message.hasOwnProperty("tsq"))
                                if (typeof message.tsq !== "number")
                                    return "tsq: number expected";
                            if (message.close != null && message.hasOwnProperty("close"))
                                if (typeof message.close !== "number")
                                    return "close: number expected";
                            if (message.lc != null && message.hasOwnProperty("lc"))
                                if (typeof message.lc !== "number")
                                    return "lc: number expected";
                            if (message.uc != null && message.hasOwnProperty("uc"))
                                if (typeof message.uc !== "number")
                                    return "uc: number expected";
                            if (message.yh != null && message.hasOwnProperty("yh"))
                                if (typeof message.yh !== "number")
                                    return "yh: number expected";
                            if (message.yl != null && message.hasOwnProperty("yl"))
                                if (typeof message.yl !== "number")
                                    return "yl: number expected";
                            if (message.fp != null && message.hasOwnProperty("fp"))
                                if (typeof message.fp !== "number")
                                    return "fp: number expected";
                            if (message.fv != null && message.hasOwnProperty("fv"))
                                if (!$util.isInteger(message.fv))
                                    return "fv: integer expected";
                            if (message.mbpBuy != null && message.hasOwnProperty("mbpBuy"))
                                if (!$util.isInteger(message.mbpBuy) && !(message.mbpBuy && $util.isInteger(message.mbpBuy.low) && $util.isInteger(message.mbpBuy.high)))
                                    return "mbpBuy: integer|Long expected";
                            if (message.mbpSell != null && message.hasOwnProperty("mbpSell"))
                                if (!$util.isInteger(message.mbpSell) && !(message.mbpSell && $util.isInteger(message.mbpSell.low) && $util.isInteger(message.mbpSell.high)))
                                    return "mbpSell: integer|Long expected";
                            if (message.tv != null && message.hasOwnProperty("tv"))
                                if (!$util.isInteger(message.tv) && !(message.tv && $util.isInteger(message.tv.low) && $util.isInteger(message.tv.high)))
                                    return "tv: integer|Long expected";
                            if (message.dhoi != null && message.hasOwnProperty("dhoi"))
                                if (typeof message.dhoi !== "number")
                                    return "dhoi: number expected";
                            if (message.dloi != null && message.hasOwnProperty("dloi"))
                                if (typeof message.dloi !== "number")
                                    return "dloi: number expected";
                            if (message.sp != null && message.hasOwnProperty("sp"))
                                if (typeof message.sp !== "number")
                                    return "sp: number expected";
                            if (message.poi != null && message.hasOwnProperty("poi"))
                                if (typeof message.poi !== "number")
                                    return "poi: number expected";
                            return null;
                        };

                        /**
                         * Creates an ExtendedFeedDetails message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails} ExtendedFeedDetails
                         */
                        ExtendedFeedDetails.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails)
                                return object;
                            let message = new $root.com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails();
                            if (object.atp != null)
                                message.atp = Number(object.atp);
                            if (object.cp != null)
                                message.cp = Number(object.cp);
                            if (object.vtt != null)
                                if ($util.Long)
                                    (message.vtt = $util.Long.fromValue(object.vtt)).unsigned = false;
                                else if (typeof object.vtt === "string")
                                    message.vtt = parseInt(object.vtt, 10);
                                else if (typeof object.vtt === "number")
                                    message.vtt = object.vtt;
                                else if (typeof object.vtt === "object")
                                    message.vtt = new $util.LongBits(object.vtt.low >>> 0, object.vtt.high >>> 0).toNumber();
                            if (object.oi != null)
                                message.oi = Number(object.oi);
                            if (object.changeOi != null)
                                message.changeOi = Number(object.changeOi);
                            if (object.lastClose != null)
                                message.lastClose = Number(object.lastClose);
                            if (object.tbq != null)
                                message.tbq = Number(object.tbq);
                            if (object.tsq != null)
                                message.tsq = Number(object.tsq);
                            if (object.close != null)
                                message.close = Number(object.close);
                            if (object.lc != null)
                                message.lc = Number(object.lc);
                            if (object.uc != null)
                                message.uc = Number(object.uc);
                            if (object.yh != null)
                                message.yh = Number(object.yh);
                            if (object.yl != null)
                                message.yl = Number(object.yl);
                            if (object.fp != null)
                                message.fp = Number(object.fp);
                            if (object.fv != null)
                                message.fv = object.fv | 0;
                            if (object.mbpBuy != null)
                                if ($util.Long)
                                    (message.mbpBuy = $util.Long.fromValue(object.mbpBuy)).unsigned = false;
                                else if (typeof object.mbpBuy === "string")
                                    message.mbpBuy = parseInt(object.mbpBuy, 10);
                                else if (typeof object.mbpBuy === "number")
                                    message.mbpBuy = object.mbpBuy;
                                else if (typeof object.mbpBuy === "object")
                                    message.mbpBuy = new $util.LongBits(object.mbpBuy.low >>> 0, object.mbpBuy.high >>> 0).toNumber();
                            if (object.mbpSell != null)
                                if ($util.Long)
                                    (message.mbpSell = $util.Long.fromValue(object.mbpSell)).unsigned = false;
                                else if (typeof object.mbpSell === "string")
                                    message.mbpSell = parseInt(object.mbpSell, 10);
                                else if (typeof object.mbpSell === "number")
                                    message.mbpSell = object.mbpSell;
                                else if (typeof object.mbpSell === "object")
                                    message.mbpSell = new $util.LongBits(object.mbpSell.low >>> 0, object.mbpSell.high >>> 0).toNumber();
                            if (object.tv != null)
                                if ($util.Long)
                                    (message.tv = $util.Long.fromValue(object.tv)).unsigned = false;
                                else if (typeof object.tv === "string")
                                    message.tv = parseInt(object.tv, 10);
                                else if (typeof object.tv === "number")
                                    message.tv = object.tv;
                                else if (typeof object.tv === "object")
                                    message.tv = new $util.LongBits(object.tv.low >>> 0, object.tv.high >>> 0).toNumber();
                            if (object.dhoi != null)
                                message.dhoi = Number(object.dhoi);
                            if (object.dloi != null)
                                message.dloi = Number(object.dloi);
                            if (object.sp != null)
                                message.sp = Number(object.sp);
                            if (object.poi != null)
                                message.poi = Number(object.poi);
                            return message;
                        };

                        /**
                         * Creates a plain object from an ExtendedFeedDetails message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails} message ExtendedFeedDetails
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        ExtendedFeedDetails.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.defaults) {
                                object.atp = 0;
                                object.cp = 0;
                                if ($util.Long) {
                                    let long = new $util.Long(0, 0, false);
                                    object.vtt = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.vtt = options.longs === String ? "0" : 0;
                                object.oi = 0;
                                object.changeOi = 0;
                                object.lastClose = 0;
                                object.tbq = 0;
                                object.tsq = 0;
                                object.close = 0;
                                object.lc = 0;
                                object.uc = 0;
                                object.yh = 0;
                                object.yl = 0;
                                object.fp = 0;
                                object.fv = 0;
                                if ($util.Long) {
                                    let long = new $util.Long(0, 0, false);
                                    object.mbpBuy = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.mbpBuy = options.longs === String ? "0" : 0;
                                if ($util.Long) {
                                    let long = new $util.Long(0, 0, false);
                                    object.mbpSell = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.mbpSell = options.longs === String ? "0" : 0;
                                if ($util.Long) {
                                    let long = new $util.Long(0, 0, false);
                                    object.tv = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.tv = options.longs === String ? "0" : 0;
                                object.dhoi = 0;
                                object.dloi = 0;
                                object.sp = 0;
                                object.poi = 0;
                            }
                            if (message.atp != null && message.hasOwnProperty("atp"))
                                object.atp = options.json && !isFinite(message.atp) ? String(message.atp) : message.atp;
                            if (message.cp != null && message.hasOwnProperty("cp"))
                                object.cp = options.json && !isFinite(message.cp) ? String(message.cp) : message.cp;
                            if (message.vtt != null && message.hasOwnProperty("vtt"))
                                if (typeof message.vtt === "number")
                                    object.vtt = options.longs === String ? String(message.vtt) : message.vtt;
                                else
                                    object.vtt = options.longs === String ? $util.Long.prototype.toString.call(message.vtt) : options.longs === Number ? new $util.LongBits(message.vtt.low >>> 0, message.vtt.high >>> 0).toNumber() : message.vtt;
                            if (message.oi != null && message.hasOwnProperty("oi"))
                                object.oi = options.json && !isFinite(message.oi) ? String(message.oi) : message.oi;
                            if (message.changeOi != null && message.hasOwnProperty("changeOi"))
                                object.changeOi = options.json && !isFinite(message.changeOi) ? String(message.changeOi) : message.changeOi;
                            if (message.lastClose != null && message.hasOwnProperty("lastClose"))
                                object.lastClose = options.json && !isFinite(message.lastClose) ? String(message.lastClose) : message.lastClose;
                            if (message.tbq != null && message.hasOwnProperty("tbq"))
                                object.tbq = options.json && !isFinite(message.tbq) ? String(message.tbq) : message.tbq;
                            if (message.tsq != null && message.hasOwnProperty("tsq"))
                                object.tsq = options.json && !isFinite(message.tsq) ? String(message.tsq) : message.tsq;
                            if (message.close != null && message.hasOwnProperty("close"))
                                object.close = options.json && !isFinite(message.close) ? String(message.close) : message.close;
                            if (message.lc != null && message.hasOwnProperty("lc"))
                                object.lc = options.json && !isFinite(message.lc) ? String(message.lc) : message.lc;
                            if (message.uc != null && message.hasOwnProperty("uc"))
                                object.uc = options.json && !isFinite(message.uc) ? String(message.uc) : message.uc;
                            if (message.yh != null && message.hasOwnProperty("yh"))
                                object.yh = options.json && !isFinite(message.yh) ? String(message.yh) : message.yh;
                            if (message.yl != null && message.hasOwnProperty("yl"))
                                object.yl = options.json && !isFinite(message.yl) ? String(message.yl) : message.yl;
                            if (message.fp != null && message.hasOwnProperty("fp"))
                                object.fp = options.json && !isFinite(message.fp) ? String(message.fp) : message.fp;
                            if (message.fv != null && message.hasOwnProperty("fv"))
                                object.fv = message.fv;
                            if (message.mbpBuy != null && message.hasOwnProperty("mbpBuy"))
                                if (typeof message.mbpBuy === "number")
                                    object.mbpBuy = options.longs === String ? String(message.mbpBuy) : message.mbpBuy;
                                else
                                    object.mbpBuy = options.longs === String ? $util.Long.prototype.toString.call(message.mbpBuy) : options.longs === Number ? new $util.LongBits(message.mbpBuy.low >>> 0, message.mbpBuy.high >>> 0).toNumber() : message.mbpBuy;
                            if (message.mbpSell != null && message.hasOwnProperty("mbpSell"))
                                if (typeof message.mbpSell === "number")
                                    object.mbpSell = options.longs === String ? String(message.mbpSell) : message.mbpSell;
                                else
                                    object.mbpSell = options.longs === String ? $util.Long.prototype.toString.call(message.mbpSell) : options.longs === Number ? new $util.LongBits(message.mbpSell.low >>> 0, message.mbpSell.high >>> 0).toNumber() : message.mbpSell;
                            if (message.tv != null && message.hasOwnProperty("tv"))
                                if (typeof message.tv === "number")
                                    object.tv = options.longs === String ? String(message.tv) : message.tv;
                                else
                                    object.tv = options.longs === String ? $util.Long.prototype.toString.call(message.tv) : options.longs === Number ? new $util.LongBits(message.tv.low >>> 0, message.tv.high >>> 0).toNumber() : message.tv;
                            if (message.dhoi != null && message.hasOwnProperty("dhoi"))
                                object.dhoi = options.json && !isFinite(message.dhoi) ? String(message.dhoi) : message.dhoi;
                            if (message.dloi != null && message.hasOwnProperty("dloi"))
                                object.dloi = options.json && !isFinite(message.dloi) ? String(message.dloi) : message.dloi;
                            if (message.sp != null && message.hasOwnProperty("sp"))
                                object.sp = options.json && !isFinite(message.sp) ? String(message.sp) : message.sp;
                            if (message.poi != null && message.hasOwnProperty("poi"))
                                object.poi = options.json && !isFinite(message.poi) ? String(message.poi) : message.poi;
                            return object;
                        };

                        /**
                         * Converts this ExtendedFeedDetails to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        ExtendedFeedDetails.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for ExtendedFeedDetails
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        ExtendedFeedDetails.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails";
                        };

                        return ExtendedFeedDetails;
                    })();

                    proto.OHLC = (function() {

                        /**
                         * Properties of a OHLC.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @interface IOHLC
                         * @property {string|null} [interval] OHLC interval
                         * @property {number|null} [open] OHLC open
                         * @property {number|null} [high] OHLC high
                         * @property {number|null} [low] OHLC low
                         * @property {number|null} [close] OHLC close
                         * @property {number|null} [volume] OHLC volume
                         * @property {number|Long|null} [ts] OHLC ts
                         * @property {number|Long|null} [vol] OHLC vol
                         */

                        /**
                         * Constructs a new OHLC.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @classdesc Represents a OHLC.
                         * @implements IOHLC
                         * @constructor
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IOHLC=} [properties] Properties to set
                         */
                        function OHLC(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        /**
                         * OHLC interval.
                         * @member {string} interval
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OHLC
                         * @instance
                         */
                        OHLC.prototype.interval = "";

                        /**
                         * OHLC open.
                         * @member {number} open
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OHLC
                         * @instance
                         */
                        OHLC.prototype.open = 0;

                        /**
                         * OHLC high.
                         * @member {number} high
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OHLC
                         * @instance
                         */
                        OHLC.prototype.high = 0;

                        /**
                         * OHLC low.
                         * @member {number} low
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OHLC
                         * @instance
                         */
                        OHLC.prototype.low = 0;

                        /**
                         * OHLC close.
                         * @member {number} close
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OHLC
                         * @instance
                         */
                        OHLC.prototype.close = 0;

                        /**
                         * OHLC volume.
                         * @member {number} volume
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OHLC
                         * @instance
                         */
                        OHLC.prototype.volume = 0;

                        /**
                         * OHLC ts.
                         * @member {number|Long} ts
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OHLC
                         * @instance
                         */
                        OHLC.prototype.ts = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * OHLC vol.
                         * @member {number|Long} vol
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OHLC
                         * @instance
                         */
                        OHLC.prototype.vol = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * Creates a new OHLC instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OHLC
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IOHLC=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.OHLC} OHLC instance
                         */
                        OHLC.create = function create(properties) {
                            return new OHLC(properties);
                        };

                        /**
                         * Encodes the specified OHLC message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.OHLC.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OHLC
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IOHLC} message OHLC message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        OHLC.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.interval != null && Object.hasOwnProperty.call(message, "interval"))
                                writer.uint32(/* id 1, wireType 2 =*/10).string(message.interval);
                            if (message.open != null && Object.hasOwnProperty.call(message, "open"))
                                writer.uint32(/* id 2, wireType 1 =*/17).double(message.open);
                            if (message.high != null && Object.hasOwnProperty.call(message, "high"))
                                writer.uint32(/* id 3, wireType 1 =*/25).double(message.high);
                            if (message.low != null && Object.hasOwnProperty.call(message, "low"))
                                writer.uint32(/* id 4, wireType 1 =*/33).double(message.low);
                            if (message.close != null && Object.hasOwnProperty.call(message, "close"))
                                writer.uint32(/* id 5, wireType 1 =*/41).double(message.close);
                            if (message.volume != null && Object.hasOwnProperty.call(message, "volume"))
                                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.volume);
                            if (message.ts != null && Object.hasOwnProperty.call(message, "ts"))
                                writer.uint32(/* id 7, wireType 0 =*/56).int64(message.ts);
                            if (message.vol != null && Object.hasOwnProperty.call(message, "vol"))
                                writer.uint32(/* id 9, wireType 0 =*/72).int64(message.vol);
                            return writer;
                        };

                        /**
                         * Encodes the specified OHLC message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.OHLC.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OHLC
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IOHLC} message OHLC message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        OHLC.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes a OHLC message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OHLC
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.OHLC} OHLC
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        OHLC.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeeder.rpc.proto.OHLC();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        message.interval = reader.string();
                                        break;
                                    }
                                case 2: {
                                        message.open = reader.double();
                                        break;
                                    }
                                case 3: {
                                        message.high = reader.double();
                                        break;
                                    }
                                case 4: {
                                        message.low = reader.double();
                                        break;
                                    }
                                case 5: {
                                        message.close = reader.double();
                                        break;
                                    }
                                case 6: {
                                        message.volume = reader.int32();
                                        break;
                                    }
                                case 7: {
                                        message.ts = reader.int64();
                                        break;
                                    }
                                case 9: {
                                        message.vol = reader.int64();
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        /**
                         * Decodes a OHLC message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OHLC
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.OHLC} OHLC
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        OHLC.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };

                        /**
                         * Verifies a OHLC message.
                         * @function verify
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OHLC
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        OHLC.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.interval != null && message.hasOwnProperty("interval"))
                                if (!$util.isString(message.interval))
                                    return "interval: string expected";
                            if (message.open != null && message.hasOwnProperty("open"))
                                if (typeof message.open !== "number")
                                    return "open: number expected";
                            if (message.high != null && message.hasOwnProperty("high"))
                                if (typeof message.high !== "number")
                                    return "high: number expected";
                            if (message.low != null && message.hasOwnProperty("low"))
                                if (typeof message.low !== "number")
                                    return "low: number expected";
                            if (message.close != null && message.hasOwnProperty("close"))
                                if (typeof message.close !== "number")
                                    return "close: number expected";
                            if (message.volume != null && message.hasOwnProperty("volume"))
                                if (!$util.isInteger(message.volume))
                                    return "volume: integer expected";
                            if (message.ts != null && message.hasOwnProperty("ts"))
                                if (!$util.isInteger(message.ts) && !(message.ts && $util.isInteger(message.ts.low) && $util.isInteger(message.ts.high)))
                                    return "ts: integer|Long expected";
                            if (message.vol != null && message.hasOwnProperty("vol"))
                                if (!$util.isInteger(message.vol) && !(message.vol && $util.isInteger(message.vol.low) && $util.isInteger(message.vol.high)))
                                    return "vol: integer|Long expected";
                            return null;
                        };

                        /**
                         * Creates a OHLC message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OHLC
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.OHLC} OHLC
                         */
                        OHLC.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeeder.rpc.proto.OHLC)
                                return object;
                            let message = new $root.com.upstox.marketdatafeeder.rpc.proto.OHLC();
                            if (object.interval != null)
                                message.interval = String(object.interval);
                            if (object.open != null)
                                message.open = Number(object.open);
                            if (object.high != null)
                                message.high = Number(object.high);
                            if (object.low != null)
                                message.low = Number(object.low);
                            if (object.close != null)
                                message.close = Number(object.close);
                            if (object.volume != null)
                                message.volume = object.volume | 0;
                            if (object.ts != null)
                                if ($util.Long)
                                    (message.ts = $util.Long.fromValue(object.ts)).unsigned = false;
                                else if (typeof object.ts === "string")
                                    message.ts = parseInt(object.ts, 10);
                                else if (typeof object.ts === "number")
                                    message.ts = object.ts;
                                else if (typeof object.ts === "object")
                                    message.ts = new $util.LongBits(object.ts.low >>> 0, object.ts.high >>> 0).toNumber();
                            if (object.vol != null)
                                if ($util.Long)
                                    (message.vol = $util.Long.fromValue(object.vol)).unsigned = false;
                                else if (typeof object.vol === "string")
                                    message.vol = parseInt(object.vol, 10);
                                else if (typeof object.vol === "number")
                                    message.vol = object.vol;
                                else if (typeof object.vol === "object")
                                    message.vol = new $util.LongBits(object.vol.low >>> 0, object.vol.high >>> 0).toNumber();
                            return message;
                        };

                        /**
                         * Creates a plain object from a OHLC message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OHLC
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.OHLC} message OHLC
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        OHLC.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.defaults) {
                                object.interval = "";
                                object.open = 0;
                                object.high = 0;
                                object.low = 0;
                                object.close = 0;
                                object.volume = 0;
                                if ($util.Long) {
                                    let long = new $util.Long(0, 0, false);
                                    object.ts = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.ts = options.longs === String ? "0" : 0;
                                if ($util.Long) {
                                    let long = new $util.Long(0, 0, false);
                                    object.vol = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.vol = options.longs === String ? "0" : 0;
                            }
                            if (message.interval != null && message.hasOwnProperty("interval"))
                                object.interval = message.interval;
                            if (message.open != null && message.hasOwnProperty("open"))
                                object.open = options.json && !isFinite(message.open) ? String(message.open) : message.open;
                            if (message.high != null && message.hasOwnProperty("high"))
                                object.high = options.json && !isFinite(message.high) ? String(message.high) : message.high;
                            if (message.low != null && message.hasOwnProperty("low"))
                                object.low = options.json && !isFinite(message.low) ? String(message.low) : message.low;
                            if (message.close != null && message.hasOwnProperty("close"))
                                object.close = options.json && !isFinite(message.close) ? String(message.close) : message.close;
                            if (message.volume != null && message.hasOwnProperty("volume"))
                                object.volume = message.volume;
                            if (message.ts != null && message.hasOwnProperty("ts"))
                                if (typeof message.ts === "number")
                                    object.ts = options.longs === String ? String(message.ts) : message.ts;
                                else
                                    object.ts = options.longs === String ? $util.Long.prototype.toString.call(message.ts) : options.longs === Number ? new $util.LongBits(message.ts.low >>> 0, message.ts.high >>> 0).toNumber() : message.ts;
                            if (message.vol != null && message.hasOwnProperty("vol"))
                                if (typeof message.vol === "number")
                                    object.vol = options.longs === String ? String(message.vol) : message.vol;
                                else
                                    object.vol = options.longs === String ? $util.Long.prototype.toString.call(message.vol) : options.longs === Number ? new $util.LongBits(message.vol.low >>> 0, message.vol.high >>> 0).toNumber() : message.vol;
                            return object;
                        };

                        /**
                         * Converts this OHLC to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OHLC
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        OHLC.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for OHLC
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OHLC
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        OHLC.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeeder.rpc.proto.OHLC";
                        };

                        return OHLC;
                    })();

                    /**
                     * Type enum.
                     * @name com.upstox.marketdatafeeder.rpc.proto.Type
                     * @enum {number}
                     * @property {number} initial_feed=0 initial_feed value
                     * @property {number} live_feed=1 live_feed value
                     */
                    proto.Type = (function() {
                        const valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "initial_feed"] = 0;
                        values[valuesById[1] = "live_feed"] = 1;
                        return values;
                    })();

                    proto.MarketFullFeed = (function() {

                        /**
                         * Properties of a MarketFullFeed.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @interface IMarketFullFeed
                         * @property {com.upstox.marketdatafeeder.rpc.proto.ILTPC|null} [ltpc] MarketFullFeed ltpc
                         * @property {com.upstox.marketdatafeeder.rpc.proto.IMarketLevel|null} [marketLevel] MarketFullFeed marketLevel
                         * @property {com.upstox.marketdatafeeder.rpc.proto.IOptionGreeks|null} [optionGreeks] MarketFullFeed optionGreeks
                         * @property {com.upstox.marketdatafeeder.rpc.proto.IMarketOHLC|null} [marketOHLC] MarketFullFeed marketOHLC
                         * @property {com.upstox.marketdatafeeder.rpc.proto.IExtendedFeedDetails|null} [eFeedDetails] MarketFullFeed eFeedDetails
                         */

                        /**
                         * Constructs a new MarketFullFeed.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @classdesc Represents a MarketFullFeed.
                         * @implements IMarketFullFeed
                         * @constructor
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IMarketFullFeed=} [properties] Properties to set
                         */
                        function MarketFullFeed(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        /**
                         * MarketFullFeed ltpc.
                         * @member {com.upstox.marketdatafeeder.rpc.proto.ILTPC|null|undefined} ltpc
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed
                         * @instance
                         */
                        MarketFullFeed.prototype.ltpc = null;

                        /**
                         * MarketFullFeed marketLevel.
                         * @member {com.upstox.marketdatafeeder.rpc.proto.IMarketLevel|null|undefined} marketLevel
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed
                         * @instance
                         */
                        MarketFullFeed.prototype.marketLevel = null;

                        /**
                         * MarketFullFeed optionGreeks.
                         * @member {com.upstox.marketdatafeeder.rpc.proto.IOptionGreeks|null|undefined} optionGreeks
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed
                         * @instance
                         */
                        MarketFullFeed.prototype.optionGreeks = null;

                        /**
                         * MarketFullFeed marketOHLC.
                         * @member {com.upstox.marketdatafeeder.rpc.proto.IMarketOHLC|null|undefined} marketOHLC
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed
                         * @instance
                         */
                        MarketFullFeed.prototype.marketOHLC = null;

                        /**
                         * MarketFullFeed eFeedDetails.
                         * @member {com.upstox.marketdatafeeder.rpc.proto.IExtendedFeedDetails|null|undefined} eFeedDetails
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed
                         * @instance
                         */
                        MarketFullFeed.prototype.eFeedDetails = null;

                        /**
                         * Creates a new MarketFullFeed instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IMarketFullFeed=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed} MarketFullFeed instance
                         */
                        MarketFullFeed.create = function create(properties) {
                            return new MarketFullFeed(properties);
                        };

                        /**
                         * Encodes the specified MarketFullFeed message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IMarketFullFeed} message MarketFullFeed message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        MarketFullFeed.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.ltpc != null && Object.hasOwnProperty.call(message, "ltpc"))
                                $root.com.upstox.marketdatafeeder.rpc.proto.LTPC.encode(message.ltpc, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                            if (message.marketLevel != null && Object.hasOwnProperty.call(message, "marketLevel"))
                                $root.com.upstox.marketdatafeeder.rpc.proto.MarketLevel.encode(message.marketLevel, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                            if (message.optionGreeks != null && Object.hasOwnProperty.call(message, "optionGreeks"))
                                $root.com.upstox.marketdatafeeder.rpc.proto.OptionGreeks.encode(message.optionGreeks, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                            if (message.marketOHLC != null && Object.hasOwnProperty.call(message, "marketOHLC"))
                                $root.com.upstox.marketdatafeeder.rpc.proto.MarketOHLC.encode(message.marketOHLC, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                            if (message.eFeedDetails != null && Object.hasOwnProperty.call(message, "eFeedDetails"))
                                $root.com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails.encode(message.eFeedDetails, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                            return writer;
                        };

                        /**
                         * Encodes the specified MarketFullFeed message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IMarketFullFeed} message MarketFullFeed message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        MarketFullFeed.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes a MarketFullFeed message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed} MarketFullFeed
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        MarketFullFeed.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        message.ltpc = $root.com.upstox.marketdatafeeder.rpc.proto.LTPC.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 2: {
                                        message.marketLevel = $root.com.upstox.marketdatafeeder.rpc.proto.MarketLevel.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 3: {
                                        message.optionGreeks = $root.com.upstox.marketdatafeeder.rpc.proto.OptionGreeks.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 4: {
                                        message.marketOHLC = $root.com.upstox.marketdatafeeder.rpc.proto.MarketOHLC.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 5: {
                                        message.eFeedDetails = $root.com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails.decode(reader, reader.uint32());
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        /**
                         * Decodes a MarketFullFeed message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed} MarketFullFeed
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        MarketFullFeed.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };

                        /**
                         * Verifies a MarketFullFeed message.
                         * @function verify
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        MarketFullFeed.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.ltpc != null && message.hasOwnProperty("ltpc")) {
                                let error = $root.com.upstox.marketdatafeeder.rpc.proto.LTPC.verify(message.ltpc);
                                if (error)
                                    return "ltpc." + error;
                            }
                            if (message.marketLevel != null && message.hasOwnProperty("marketLevel")) {
                                let error = $root.com.upstox.marketdatafeeder.rpc.proto.MarketLevel.verify(message.marketLevel);
                                if (error)
                                    return "marketLevel." + error;
                            }
                            if (message.optionGreeks != null && message.hasOwnProperty("optionGreeks")) {
                                let error = $root.com.upstox.marketdatafeeder.rpc.proto.OptionGreeks.verify(message.optionGreeks);
                                if (error)
                                    return "optionGreeks." + error;
                            }
                            if (message.marketOHLC != null && message.hasOwnProperty("marketOHLC")) {
                                let error = $root.com.upstox.marketdatafeeder.rpc.proto.MarketOHLC.verify(message.marketOHLC);
                                if (error)
                                    return "marketOHLC." + error;
                            }
                            if (message.eFeedDetails != null && message.hasOwnProperty("eFeedDetails")) {
                                let error = $root.com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails.verify(message.eFeedDetails);
                                if (error)
                                    return "eFeedDetails." + error;
                            }
                            return null;
                        };

                        /**
                         * Creates a MarketFullFeed message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed} MarketFullFeed
                         */
                        MarketFullFeed.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed)
                                return object;
                            let message = new $root.com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed();
                            if (object.ltpc != null) {
                                if (typeof object.ltpc !== "object")
                                    throw TypeError(".com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed.ltpc: object expected");
                                message.ltpc = $root.com.upstox.marketdatafeeder.rpc.proto.LTPC.fromObject(object.ltpc);
                            }
                            if (object.marketLevel != null) {
                                if (typeof object.marketLevel !== "object")
                                    throw TypeError(".com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed.marketLevel: object expected");
                                message.marketLevel = $root.com.upstox.marketdatafeeder.rpc.proto.MarketLevel.fromObject(object.marketLevel);
                            }
                            if (object.optionGreeks != null) {
                                if (typeof object.optionGreeks !== "object")
                                    throw TypeError(".com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed.optionGreeks: object expected");
                                message.optionGreeks = $root.com.upstox.marketdatafeeder.rpc.proto.OptionGreeks.fromObject(object.optionGreeks);
                            }
                            if (object.marketOHLC != null) {
                                if (typeof object.marketOHLC !== "object")
                                    throw TypeError(".com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed.marketOHLC: object expected");
                                message.marketOHLC = $root.com.upstox.marketdatafeeder.rpc.proto.MarketOHLC.fromObject(object.marketOHLC);
                            }
                            if (object.eFeedDetails != null) {
                                if (typeof object.eFeedDetails !== "object")
                                    throw TypeError(".com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed.eFeedDetails: object expected");
                                message.eFeedDetails = $root.com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails.fromObject(object.eFeedDetails);
                            }
                            return message;
                        };

                        /**
                         * Creates a plain object from a MarketFullFeed message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed} message MarketFullFeed
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        MarketFullFeed.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.defaults) {
                                object.ltpc = null;
                                object.marketLevel = null;
                                object.optionGreeks = null;
                                object.marketOHLC = null;
                                object.eFeedDetails = null;
                            }
                            if (message.ltpc != null && message.hasOwnProperty("ltpc"))
                                object.ltpc = $root.com.upstox.marketdatafeeder.rpc.proto.LTPC.toObject(message.ltpc, options);
                            if (message.marketLevel != null && message.hasOwnProperty("marketLevel"))
                                object.marketLevel = $root.com.upstox.marketdatafeeder.rpc.proto.MarketLevel.toObject(message.marketLevel, options);
                            if (message.optionGreeks != null && message.hasOwnProperty("optionGreeks"))
                                object.optionGreeks = $root.com.upstox.marketdatafeeder.rpc.proto.OptionGreeks.toObject(message.optionGreeks, options);
                            if (message.marketOHLC != null && message.hasOwnProperty("marketOHLC"))
                                object.marketOHLC = $root.com.upstox.marketdatafeeder.rpc.proto.MarketOHLC.toObject(message.marketOHLC, options);
                            if (message.eFeedDetails != null && message.hasOwnProperty("eFeedDetails"))
                                object.eFeedDetails = $root.com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails.toObject(message.eFeedDetails, options);
                            return object;
                        };

                        /**
                         * Converts this MarketFullFeed to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        MarketFullFeed.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for MarketFullFeed
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        MarketFullFeed.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed";
                        };

                        return MarketFullFeed;
                    })();

                    proto.IndexFullFeed = (function() {

                        /**
                         * Properties of an IndexFullFeed.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @interface IIndexFullFeed
                         * @property {com.upstox.marketdatafeeder.rpc.proto.ILTPC|null} [ltpc] IndexFullFeed ltpc
                         * @property {com.upstox.marketdatafeeder.rpc.proto.IMarketOHLC|null} [marketOHLC] IndexFullFeed marketOHLC
                         * @property {number|null} [lastClose] IndexFullFeed lastClose
                         * @property {number|null} [yh] IndexFullFeed yh
                         * @property {number|null} [yl] IndexFullFeed yl
                         */

                        /**
                         * Constructs a new IndexFullFeed.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @classdesc Represents an IndexFullFeed.
                         * @implements IIndexFullFeed
                         * @constructor
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IIndexFullFeed=} [properties] Properties to set
                         */
                        function IndexFullFeed(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        /**
                         * IndexFullFeed ltpc.
                         * @member {com.upstox.marketdatafeeder.rpc.proto.ILTPC|null|undefined} ltpc
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed
                         * @instance
                         */
                        IndexFullFeed.prototype.ltpc = null;

                        /**
                         * IndexFullFeed marketOHLC.
                         * @member {com.upstox.marketdatafeeder.rpc.proto.IMarketOHLC|null|undefined} marketOHLC
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed
                         * @instance
                         */
                        IndexFullFeed.prototype.marketOHLC = null;

                        /**
                         * IndexFullFeed lastClose.
                         * @member {number} lastClose
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed
                         * @instance
                         */
                        IndexFullFeed.prototype.lastClose = 0;

                        /**
                         * IndexFullFeed yh.
                         * @member {number} yh
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed
                         * @instance
                         */
                        IndexFullFeed.prototype.yh = 0;

                        /**
                         * IndexFullFeed yl.
                         * @member {number} yl
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed
                         * @instance
                         */
                        IndexFullFeed.prototype.yl = 0;

                        /**
                         * Creates a new IndexFullFeed instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IIndexFullFeed=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed} IndexFullFeed instance
                         */
                        IndexFullFeed.create = function create(properties) {
                            return new IndexFullFeed(properties);
                        };

                        /**
                         * Encodes the specified IndexFullFeed message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IIndexFullFeed} message IndexFullFeed message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        IndexFullFeed.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.ltpc != null && Object.hasOwnProperty.call(message, "ltpc"))
                                $root.com.upstox.marketdatafeeder.rpc.proto.LTPC.encode(message.ltpc, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                            if (message.marketOHLC != null && Object.hasOwnProperty.call(message, "marketOHLC"))
                                $root.com.upstox.marketdatafeeder.rpc.proto.MarketOHLC.encode(message.marketOHLC, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                            if (message.lastClose != null && Object.hasOwnProperty.call(message, "lastClose"))
                                writer.uint32(/* id 3, wireType 1 =*/25).double(message.lastClose);
                            if (message.yh != null && Object.hasOwnProperty.call(message, "yh"))
                                writer.uint32(/* id 4, wireType 1 =*/33).double(message.yh);
                            if (message.yl != null && Object.hasOwnProperty.call(message, "yl"))
                                writer.uint32(/* id 5, wireType 1 =*/41).double(message.yl);
                            return writer;
                        };

                        /**
                         * Encodes the specified IndexFullFeed message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IIndexFullFeed} message IndexFullFeed message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        IndexFullFeed.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes an IndexFullFeed message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed} IndexFullFeed
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        IndexFullFeed.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        message.ltpc = $root.com.upstox.marketdatafeeder.rpc.proto.LTPC.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 2: {
                                        message.marketOHLC = $root.com.upstox.marketdatafeeder.rpc.proto.MarketOHLC.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 3: {
                                        message.lastClose = reader.double();
                                        break;
                                    }
                                case 4: {
                                        message.yh = reader.double();
                                        break;
                                    }
                                case 5: {
                                        message.yl = reader.double();
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        /**
                         * Decodes an IndexFullFeed message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed} IndexFullFeed
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        IndexFullFeed.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };

                        /**
                         * Verifies an IndexFullFeed message.
                         * @function verify
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        IndexFullFeed.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.ltpc != null && message.hasOwnProperty("ltpc")) {
                                let error = $root.com.upstox.marketdatafeeder.rpc.proto.LTPC.verify(message.ltpc);
                                if (error)
                                    return "ltpc." + error;
                            }
                            if (message.marketOHLC != null && message.hasOwnProperty("marketOHLC")) {
                                let error = $root.com.upstox.marketdatafeeder.rpc.proto.MarketOHLC.verify(message.marketOHLC);
                                if (error)
                                    return "marketOHLC." + error;
                            }
                            if (message.lastClose != null && message.hasOwnProperty("lastClose"))
                                if (typeof message.lastClose !== "number")
                                    return "lastClose: number expected";
                            if (message.yh != null && message.hasOwnProperty("yh"))
                                if (typeof message.yh !== "number")
                                    return "yh: number expected";
                            if (message.yl != null && message.hasOwnProperty("yl"))
                                if (typeof message.yl !== "number")
                                    return "yl: number expected";
                            return null;
                        };

                        /**
                         * Creates an IndexFullFeed message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed} IndexFullFeed
                         */
                        IndexFullFeed.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed)
                                return object;
                            let message = new $root.com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed();
                            if (object.ltpc != null) {
                                if (typeof object.ltpc !== "object")
                                    throw TypeError(".com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed.ltpc: object expected");
                                message.ltpc = $root.com.upstox.marketdatafeeder.rpc.proto.LTPC.fromObject(object.ltpc);
                            }
                            if (object.marketOHLC != null) {
                                if (typeof object.marketOHLC !== "object")
                                    throw TypeError(".com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed.marketOHLC: object expected");
                                message.marketOHLC = $root.com.upstox.marketdatafeeder.rpc.proto.MarketOHLC.fromObject(object.marketOHLC);
                            }
                            if (object.lastClose != null)
                                message.lastClose = Number(object.lastClose);
                            if (object.yh != null)
                                message.yh = Number(object.yh);
                            if (object.yl != null)
                                message.yl = Number(object.yl);
                            return message;
                        };

                        /**
                         * Creates a plain object from an IndexFullFeed message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed} message IndexFullFeed
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        IndexFullFeed.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.defaults) {
                                object.ltpc = null;
                                object.marketOHLC = null;
                                object.lastClose = 0;
                                object.yh = 0;
                                object.yl = 0;
                            }
                            if (message.ltpc != null && message.hasOwnProperty("ltpc"))
                                object.ltpc = $root.com.upstox.marketdatafeeder.rpc.proto.LTPC.toObject(message.ltpc, options);
                            if (message.marketOHLC != null && message.hasOwnProperty("marketOHLC"))
                                object.marketOHLC = $root.com.upstox.marketdatafeeder.rpc.proto.MarketOHLC.toObject(message.marketOHLC, options);
                            if (message.lastClose != null && message.hasOwnProperty("lastClose"))
                                object.lastClose = options.json && !isFinite(message.lastClose) ? String(message.lastClose) : message.lastClose;
                            if (message.yh != null && message.hasOwnProperty("yh"))
                                object.yh = options.json && !isFinite(message.yh) ? String(message.yh) : message.yh;
                            if (message.yl != null && message.hasOwnProperty("yl"))
                                object.yl = options.json && !isFinite(message.yl) ? String(message.yl) : message.yl;
                            return object;
                        };

                        /**
                         * Converts this IndexFullFeed to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        IndexFullFeed.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for IndexFullFeed
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        IndexFullFeed.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed";
                        };

                        return IndexFullFeed;
                    })();

                    proto.FullFeed = (function() {

                        /**
                         * Properties of a FullFeed.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @interface IFullFeed
                         * @property {com.upstox.marketdatafeeder.rpc.proto.IMarketFullFeed|null} [marketFF] FullFeed marketFF
                         * @property {com.upstox.marketdatafeeder.rpc.proto.IIndexFullFeed|null} [indexFF] FullFeed indexFF
                         */

                        /**
                         * Constructs a new FullFeed.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @classdesc Represents a FullFeed.
                         * @implements IFullFeed
                         * @constructor
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IFullFeed=} [properties] Properties to set
                         */
                        function FullFeed(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        /**
                         * FullFeed marketFF.
                         * @member {com.upstox.marketdatafeeder.rpc.proto.IMarketFullFeed|null|undefined} marketFF
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FullFeed
                         * @instance
                         */
                        FullFeed.prototype.marketFF = null;

                        /**
                         * FullFeed indexFF.
                         * @member {com.upstox.marketdatafeeder.rpc.proto.IIndexFullFeed|null|undefined} indexFF
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FullFeed
                         * @instance
                         */
                        FullFeed.prototype.indexFF = null;

                        // OneOf field names bound to virtual getters and setters
                        let $oneOfFields;

                        /**
                         * FullFeed FullFeedUnion.
                         * @member {"marketFF"|"indexFF"|undefined} FullFeedUnion
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FullFeed
                         * @instance
                         */
                        Object.defineProperty(FullFeed.prototype, "FullFeedUnion", {
                            get: $util.oneOfGetter($oneOfFields = ["marketFF", "indexFF"]),
                            set: $util.oneOfSetter($oneOfFields)
                        });

                        /**
                         * Creates a new FullFeed instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FullFeed
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IFullFeed=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.FullFeed} FullFeed instance
                         */
                        FullFeed.create = function create(properties) {
                            return new FullFeed(properties);
                        };

                        /**
                         * Encodes the specified FullFeed message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.FullFeed.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FullFeed
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IFullFeed} message FullFeed message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        FullFeed.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.marketFF != null && Object.hasOwnProperty.call(message, "marketFF"))
                                $root.com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed.encode(message.marketFF, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                            if (message.indexFF != null && Object.hasOwnProperty.call(message, "indexFF"))
                                $root.com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed.encode(message.indexFF, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                            return writer;
                        };

                        /**
                         * Encodes the specified FullFeed message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.FullFeed.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FullFeed
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IFullFeed} message FullFeed message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        FullFeed.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes a FullFeed message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FullFeed
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.FullFeed} FullFeed
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        FullFeed.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeeder.rpc.proto.FullFeed();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        message.marketFF = $root.com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 2: {
                                        message.indexFF = $root.com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed.decode(reader, reader.uint32());
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        /**
                         * Decodes a FullFeed message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FullFeed
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.FullFeed} FullFeed
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        FullFeed.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };

                        /**
                         * Verifies a FullFeed message.
                         * @function verify
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FullFeed
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        FullFeed.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            let properties = {};
                            if (message.marketFF != null && message.hasOwnProperty("marketFF")) {
                                properties.FullFeedUnion = 1;
                                {
                                    let error = $root.com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed.verify(message.marketFF);
                                    if (error)
                                        return "marketFF." + error;
                                }
                            }
                            if (message.indexFF != null && message.hasOwnProperty("indexFF")) {
                                if (properties.FullFeedUnion === 1)
                                    return "FullFeedUnion: multiple values";
                                properties.FullFeedUnion = 1;
                                {
                                    let error = $root.com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed.verify(message.indexFF);
                                    if (error)
                                        return "indexFF." + error;
                                }
                            }
                            return null;
                        };

                        /**
                         * Creates a FullFeed message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FullFeed
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.FullFeed} FullFeed
                         */
                        FullFeed.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeeder.rpc.proto.FullFeed)
                                return object;
                            let message = new $root.com.upstox.marketdatafeeder.rpc.proto.FullFeed();
                            if (object.marketFF != null) {
                                if (typeof object.marketFF !== "object")
                                    throw TypeError(".com.upstox.marketdatafeeder.rpc.proto.FullFeed.marketFF: object expected");
                                message.marketFF = $root.com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed.fromObject(object.marketFF);
                            }
                            if (object.indexFF != null) {
                                if (typeof object.indexFF !== "object")
                                    throw TypeError(".com.upstox.marketdatafeeder.rpc.proto.FullFeed.indexFF: object expected");
                                message.indexFF = $root.com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed.fromObject(object.indexFF);
                            }
                            return message;
                        };

                        /**
                         * Creates a plain object from a FullFeed message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FullFeed
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.FullFeed} message FullFeed
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        FullFeed.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (message.marketFF != null && message.hasOwnProperty("marketFF")) {
                                object.marketFF = $root.com.upstox.marketdatafeeder.rpc.proto.MarketFullFeed.toObject(message.marketFF, options);
                                if (options.oneofs)
                                    object.FullFeedUnion = "marketFF";
                            }
                            if (message.indexFF != null && message.hasOwnProperty("indexFF")) {
                                object.indexFF = $root.com.upstox.marketdatafeeder.rpc.proto.IndexFullFeed.toObject(message.indexFF, options);
                                if (options.oneofs)
                                    object.FullFeedUnion = "indexFF";
                            }
                            return object;
                        };

                        /**
                         * Converts this FullFeed to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FullFeed
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        FullFeed.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for FullFeed
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FullFeed
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        FullFeed.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeeder.rpc.proto.FullFeed";
                        };

                        return FullFeed;
                    })();

                    proto.OptionChain = (function() {

                        /**
                         * Properties of an OptionChain.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @interface IOptionChain
                         * @property {com.upstox.marketdatafeeder.rpc.proto.ILTPC|null} [ltpc] OptionChain ltpc
                         * @property {com.upstox.marketdatafeeder.rpc.proto.IQuote|null} [bidAskQuote] OptionChain bidAskQuote
                         * @property {com.upstox.marketdatafeeder.rpc.proto.IOptionGreeks|null} [optionGreeks] OptionChain optionGreeks
                         * @property {com.upstox.marketdatafeeder.rpc.proto.IExtendedFeedDetails|null} [eFeedDetails] OptionChain eFeedDetails
                         */

                        /**
                         * Constructs a new OptionChain.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @classdesc Represents an OptionChain.
                         * @implements IOptionChain
                         * @constructor
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IOptionChain=} [properties] Properties to set
                         */
                        function OptionChain(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        /**
                         * OptionChain ltpc.
                         * @member {com.upstox.marketdatafeeder.rpc.proto.ILTPC|null|undefined} ltpc
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionChain
                         * @instance
                         */
                        OptionChain.prototype.ltpc = null;

                        /**
                         * OptionChain bidAskQuote.
                         * @member {com.upstox.marketdatafeeder.rpc.proto.IQuote|null|undefined} bidAskQuote
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionChain
                         * @instance
                         */
                        OptionChain.prototype.bidAskQuote = null;

                        /**
                         * OptionChain optionGreeks.
                         * @member {com.upstox.marketdatafeeder.rpc.proto.IOptionGreeks|null|undefined} optionGreeks
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionChain
                         * @instance
                         */
                        OptionChain.prototype.optionGreeks = null;

                        /**
                         * OptionChain eFeedDetails.
                         * @member {com.upstox.marketdatafeeder.rpc.proto.IExtendedFeedDetails|null|undefined} eFeedDetails
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionChain
                         * @instance
                         */
                        OptionChain.prototype.eFeedDetails = null;

                        /**
                         * Creates a new OptionChain instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionChain
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IOptionChain=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.OptionChain} OptionChain instance
                         */
                        OptionChain.create = function create(properties) {
                            return new OptionChain(properties);
                        };

                        /**
                         * Encodes the specified OptionChain message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.OptionChain.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionChain
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IOptionChain} message OptionChain message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        OptionChain.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.ltpc != null && Object.hasOwnProperty.call(message, "ltpc"))
                                $root.com.upstox.marketdatafeeder.rpc.proto.LTPC.encode(message.ltpc, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                            if (message.bidAskQuote != null && Object.hasOwnProperty.call(message, "bidAskQuote"))
                                $root.com.upstox.marketdatafeeder.rpc.proto.Quote.encode(message.bidAskQuote, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                            if (message.optionGreeks != null && Object.hasOwnProperty.call(message, "optionGreeks"))
                                $root.com.upstox.marketdatafeeder.rpc.proto.OptionGreeks.encode(message.optionGreeks, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                            if (message.eFeedDetails != null && Object.hasOwnProperty.call(message, "eFeedDetails"))
                                $root.com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails.encode(message.eFeedDetails, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                            return writer;
                        };

                        /**
                         * Encodes the specified OptionChain message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.OptionChain.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionChain
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IOptionChain} message OptionChain message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        OptionChain.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes an OptionChain message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionChain
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.OptionChain} OptionChain
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        OptionChain.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeeder.rpc.proto.OptionChain();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        message.ltpc = $root.com.upstox.marketdatafeeder.rpc.proto.LTPC.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 2: {
                                        message.bidAskQuote = $root.com.upstox.marketdatafeeder.rpc.proto.Quote.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 3: {
                                        message.optionGreeks = $root.com.upstox.marketdatafeeder.rpc.proto.OptionGreeks.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 4: {
                                        message.eFeedDetails = $root.com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails.decode(reader, reader.uint32());
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        /**
                         * Decodes an OptionChain message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionChain
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.OptionChain} OptionChain
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        OptionChain.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };

                        /**
                         * Verifies an OptionChain message.
                         * @function verify
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionChain
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        OptionChain.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.ltpc != null && message.hasOwnProperty("ltpc")) {
                                let error = $root.com.upstox.marketdatafeeder.rpc.proto.LTPC.verify(message.ltpc);
                                if (error)
                                    return "ltpc." + error;
                            }
                            if (message.bidAskQuote != null && message.hasOwnProperty("bidAskQuote")) {
                                let error = $root.com.upstox.marketdatafeeder.rpc.proto.Quote.verify(message.bidAskQuote);
                                if (error)
                                    return "bidAskQuote." + error;
                            }
                            if (message.optionGreeks != null && message.hasOwnProperty("optionGreeks")) {
                                let error = $root.com.upstox.marketdatafeeder.rpc.proto.OptionGreeks.verify(message.optionGreeks);
                                if (error)
                                    return "optionGreeks." + error;
                            }
                            if (message.eFeedDetails != null && message.hasOwnProperty("eFeedDetails")) {
                                let error = $root.com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails.verify(message.eFeedDetails);
                                if (error)
                                    return "eFeedDetails." + error;
                            }
                            return null;
                        };

                        /**
                         * Creates an OptionChain message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionChain
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.OptionChain} OptionChain
                         */
                        OptionChain.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeeder.rpc.proto.OptionChain)
                                return object;
                            let message = new $root.com.upstox.marketdatafeeder.rpc.proto.OptionChain();
                            if (object.ltpc != null) {
                                if (typeof object.ltpc !== "object")
                                    throw TypeError(".com.upstox.marketdatafeeder.rpc.proto.OptionChain.ltpc: object expected");
                                message.ltpc = $root.com.upstox.marketdatafeeder.rpc.proto.LTPC.fromObject(object.ltpc);
                            }
                            if (object.bidAskQuote != null) {
                                if (typeof object.bidAskQuote !== "object")
                                    throw TypeError(".com.upstox.marketdatafeeder.rpc.proto.OptionChain.bidAskQuote: object expected");
                                message.bidAskQuote = $root.com.upstox.marketdatafeeder.rpc.proto.Quote.fromObject(object.bidAskQuote);
                            }
                            if (object.optionGreeks != null) {
                                if (typeof object.optionGreeks !== "object")
                                    throw TypeError(".com.upstox.marketdatafeeder.rpc.proto.OptionChain.optionGreeks: object expected");
                                message.optionGreeks = $root.com.upstox.marketdatafeeder.rpc.proto.OptionGreeks.fromObject(object.optionGreeks);
                            }
                            if (object.eFeedDetails != null) {
                                if (typeof object.eFeedDetails !== "object")
                                    throw TypeError(".com.upstox.marketdatafeeder.rpc.proto.OptionChain.eFeedDetails: object expected");
                                message.eFeedDetails = $root.com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails.fromObject(object.eFeedDetails);
                            }
                            return message;
                        };

                        /**
                         * Creates a plain object from an OptionChain message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionChain
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.OptionChain} message OptionChain
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        OptionChain.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.defaults) {
                                object.ltpc = null;
                                object.bidAskQuote = null;
                                object.optionGreeks = null;
                                object.eFeedDetails = null;
                            }
                            if (message.ltpc != null && message.hasOwnProperty("ltpc"))
                                object.ltpc = $root.com.upstox.marketdatafeeder.rpc.proto.LTPC.toObject(message.ltpc, options);
                            if (message.bidAskQuote != null && message.hasOwnProperty("bidAskQuote"))
                                object.bidAskQuote = $root.com.upstox.marketdatafeeder.rpc.proto.Quote.toObject(message.bidAskQuote, options);
                            if (message.optionGreeks != null && message.hasOwnProperty("optionGreeks"))
                                object.optionGreeks = $root.com.upstox.marketdatafeeder.rpc.proto.OptionGreeks.toObject(message.optionGreeks, options);
                            if (message.eFeedDetails != null && message.hasOwnProperty("eFeedDetails"))
                                object.eFeedDetails = $root.com.upstox.marketdatafeeder.rpc.proto.ExtendedFeedDetails.toObject(message.eFeedDetails, options);
                            return object;
                        };

                        /**
                         * Converts this OptionChain to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionChain
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        OptionChain.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for OptionChain
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.OptionChain
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        OptionChain.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeeder.rpc.proto.OptionChain";
                        };

                        return OptionChain;
                    })();

                    proto.Feed = (function() {

                        /**
                         * Properties of a Feed.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @interface IFeed
                         * @property {com.upstox.marketdatafeeder.rpc.proto.ILTPC|null} [ltpc] Feed ltpc
                         * @property {com.upstox.marketdatafeeder.rpc.proto.IFullFeed|null} [ff] Feed ff
                         * @property {com.upstox.marketdatafeeder.rpc.proto.IOptionChain|null} [oc] Feed oc
                         */

                        /**
                         * Constructs a new Feed.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @classdesc Represents a Feed.
                         * @implements IFeed
                         * @constructor
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IFeed=} [properties] Properties to set
                         */
                        function Feed(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        /**
                         * Feed ltpc.
                         * @member {com.upstox.marketdatafeeder.rpc.proto.ILTPC|null|undefined} ltpc
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Feed
                         * @instance
                         */
                        Feed.prototype.ltpc = null;

                        /**
                         * Feed ff.
                         * @member {com.upstox.marketdatafeeder.rpc.proto.IFullFeed|null|undefined} ff
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Feed
                         * @instance
                         */
                        Feed.prototype.ff = null;

                        /**
                         * Feed oc.
                         * @member {com.upstox.marketdatafeeder.rpc.proto.IOptionChain|null|undefined} oc
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Feed
                         * @instance
                         */
                        Feed.prototype.oc = null;

                        // OneOf field names bound to virtual getters and setters
                        let $oneOfFields;

                        /**
                         * Feed FeedUnion.
                         * @member {"ltpc"|"ff"|"oc"|undefined} FeedUnion
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Feed
                         * @instance
                         */
                        Object.defineProperty(Feed.prototype, "FeedUnion", {
                            get: $util.oneOfGetter($oneOfFields = ["ltpc", "ff", "oc"]),
                            set: $util.oneOfSetter($oneOfFields)
                        });

                        /**
                         * Creates a new Feed instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Feed
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IFeed=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.Feed} Feed instance
                         */
                        Feed.create = function create(properties) {
                            return new Feed(properties);
                        };

                        /**
                         * Encodes the specified Feed message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.Feed.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Feed
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IFeed} message Feed message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Feed.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.ltpc != null && Object.hasOwnProperty.call(message, "ltpc"))
                                $root.com.upstox.marketdatafeeder.rpc.proto.LTPC.encode(message.ltpc, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                            if (message.ff != null && Object.hasOwnProperty.call(message, "ff"))
                                $root.com.upstox.marketdatafeeder.rpc.proto.FullFeed.encode(message.ff, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                            if (message.oc != null && Object.hasOwnProperty.call(message, "oc"))
                                $root.com.upstox.marketdatafeeder.rpc.proto.OptionChain.encode(message.oc, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                            return writer;
                        };

                        /**
                         * Encodes the specified Feed message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.Feed.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Feed
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IFeed} message Feed message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Feed.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes a Feed message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Feed
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.Feed} Feed
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Feed.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeeder.rpc.proto.Feed();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        message.ltpc = $root.com.upstox.marketdatafeeder.rpc.proto.LTPC.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 2: {
                                        message.ff = $root.com.upstox.marketdatafeeder.rpc.proto.FullFeed.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 3: {
                                        message.oc = $root.com.upstox.marketdatafeeder.rpc.proto.OptionChain.decode(reader, reader.uint32());
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        /**
                         * Decodes a Feed message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Feed
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.Feed} Feed
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Feed.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };

                        /**
                         * Verifies a Feed message.
                         * @function verify
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Feed
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        Feed.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            let properties = {};
                            if (message.ltpc != null && message.hasOwnProperty("ltpc")) {
                                properties.FeedUnion = 1;
                                {
                                    let error = $root.com.upstox.marketdatafeeder.rpc.proto.LTPC.verify(message.ltpc);
                                    if (error)
                                        return "ltpc." + error;
                                }
                            }
                            if (message.ff != null && message.hasOwnProperty("ff")) {
                                if (properties.FeedUnion === 1)
                                    return "FeedUnion: multiple values";
                                properties.FeedUnion = 1;
                                {
                                    let error = $root.com.upstox.marketdatafeeder.rpc.proto.FullFeed.verify(message.ff);
                                    if (error)
                                        return "ff." + error;
                                }
                            }
                            if (message.oc != null && message.hasOwnProperty("oc")) {
                                if (properties.FeedUnion === 1)
                                    return "FeedUnion: multiple values";
                                properties.FeedUnion = 1;
                                {
                                    let error = $root.com.upstox.marketdatafeeder.rpc.proto.OptionChain.verify(message.oc);
                                    if (error)
                                        return "oc." + error;
                                }
                            }
                            return null;
                        };

                        /**
                         * Creates a Feed message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Feed
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.Feed} Feed
                         */
                        Feed.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeeder.rpc.proto.Feed)
                                return object;
                            let message = new $root.com.upstox.marketdatafeeder.rpc.proto.Feed();
                            if (object.ltpc != null) {
                                if (typeof object.ltpc !== "object")
                                    throw TypeError(".com.upstox.marketdatafeeder.rpc.proto.Feed.ltpc: object expected");
                                message.ltpc = $root.com.upstox.marketdatafeeder.rpc.proto.LTPC.fromObject(object.ltpc);
                            }
                            if (object.ff != null) {
                                if (typeof object.ff !== "object")
                                    throw TypeError(".com.upstox.marketdatafeeder.rpc.proto.Feed.ff: object expected");
                                message.ff = $root.com.upstox.marketdatafeeder.rpc.proto.FullFeed.fromObject(object.ff);
                            }
                            if (object.oc != null) {
                                if (typeof object.oc !== "object")
                                    throw TypeError(".com.upstox.marketdatafeeder.rpc.proto.Feed.oc: object expected");
                                message.oc = $root.com.upstox.marketdatafeeder.rpc.proto.OptionChain.fromObject(object.oc);
                            }
                            return message;
                        };

                        /**
                         * Creates a plain object from a Feed message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Feed
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.Feed} message Feed
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        Feed.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (message.ltpc != null && message.hasOwnProperty("ltpc")) {
                                object.ltpc = $root.com.upstox.marketdatafeeder.rpc.proto.LTPC.toObject(message.ltpc, options);
                                if (options.oneofs)
                                    object.FeedUnion = "ltpc";
                            }
                            if (message.ff != null && message.hasOwnProperty("ff")) {
                                object.ff = $root.com.upstox.marketdatafeeder.rpc.proto.FullFeed.toObject(message.ff, options);
                                if (options.oneofs)
                                    object.FeedUnion = "ff";
                            }
                            if (message.oc != null && message.hasOwnProperty("oc")) {
                                object.oc = $root.com.upstox.marketdatafeeder.rpc.proto.OptionChain.toObject(message.oc, options);
                                if (options.oneofs)
                                    object.FeedUnion = "oc";
                            }
                            return object;
                        };

                        /**
                         * Converts this Feed to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Feed
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        Feed.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for Feed
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.Feed
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        Feed.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeeder.rpc.proto.Feed";
                        };

                        return Feed;
                    })();

                    proto.FeedResponse = (function() {

                        /**
                         * Properties of a FeedResponse.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @interface IFeedResponse
                         * @property {com.upstox.marketdatafeeder.rpc.proto.Type|null} [type] FeedResponse type
                         * @property {Object.<string,com.upstox.marketdatafeeder.rpc.proto.IFeed>|null} [feeds] FeedResponse feeds
                         * @property {number|Long|null} [currentTs] FeedResponse currentTs
                         */

                        /**
                         * Constructs a new FeedResponse.
                         * @memberof com.upstox.marketdatafeeder.rpc.proto
                         * @classdesc Represents a FeedResponse.
                         * @implements IFeedResponse
                         * @constructor
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IFeedResponse=} [properties] Properties to set
                         */
                        function FeedResponse(properties) {
                            this.feeds = {};
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        /**
                         * FeedResponse type.
                         * @member {com.upstox.marketdatafeeder.rpc.proto.Type} type
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FeedResponse
                         * @instance
                         */
                        FeedResponse.prototype.type = 0;

                        /**
                         * FeedResponse feeds.
                         * @member {Object.<string,com.upstox.marketdatafeeder.rpc.proto.IFeed>} feeds
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FeedResponse
                         * @instance
                         */
                        FeedResponse.prototype.feeds = $util.emptyObject;

                        /**
                         * FeedResponse currentTs.
                         * @member {number|Long} currentTs
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FeedResponse
                         * @instance
                         */
                        FeedResponse.prototype.currentTs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * Creates a new FeedResponse instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FeedResponse
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IFeedResponse=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.FeedResponse} FeedResponse instance
                         */
                        FeedResponse.create = function create(properties) {
                            return new FeedResponse(properties);
                        };

                        /**
                         * Encodes the specified FeedResponse message. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.FeedResponse.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FeedResponse
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IFeedResponse} message FeedResponse message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        FeedResponse.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                            if (message.feeds != null && Object.hasOwnProperty.call(message, "feeds"))
                                for (let keys = Object.keys(message.feeds), i = 0; i < keys.length; ++i) {
                                    writer.uint32(/* id 2, wireType 2 =*/18).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                                    $root.com.upstox.marketdatafeeder.rpc.proto.Feed.encode(message.feeds[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                                }
                            if (message.currentTs != null && Object.hasOwnProperty.call(message, "currentTs"))
                                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.currentTs);
                            return writer;
                        };

                        /**
                         * Encodes the specified FeedResponse message, length delimited. Does not implicitly {@link com.upstox.marketdatafeeder.rpc.proto.FeedResponse.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FeedResponse
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.IFeedResponse} message FeedResponse message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        FeedResponse.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes a FeedResponse message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FeedResponse
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.FeedResponse} FeedResponse
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        FeedResponse.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeeder.rpc.proto.FeedResponse(), key, value;
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        message.type = reader.int32();
                                        break;
                                    }
                                case 2: {
                                        if (message.feeds === $util.emptyObject)
                                            message.feeds = {};
                                        let end2 = reader.uint32() + reader.pos;
                                        key = "";
                                        value = null;
                                        while (reader.pos < end2) {
                                            let tag2 = reader.uint32();
                                            switch (tag2 >>> 3) {
                                            case 1:
                                                key = reader.string();
                                                break;
                                            case 2:
                                                value = $root.com.upstox.marketdatafeeder.rpc.proto.Feed.decode(reader, reader.uint32());
                                                break;
                                            default:
                                                reader.skipType(tag2 & 7);
                                                break;
                                            }
                                        }
                                        message.feeds[key] = value;
                                        break;
                                    }
                                case 3: {
                                        message.currentTs = reader.int64();
                                        break;
                                    }
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        /**
                         * Decodes a FeedResponse message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FeedResponse
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.FeedResponse} FeedResponse
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        FeedResponse.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };

                        /**
                         * Verifies a FeedResponse message.
                         * @function verify
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FeedResponse
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        FeedResponse.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.type != null && message.hasOwnProperty("type"))
                                switch (message.type) {
                                default:
                                    return "type: enum value expected";
                                case 0:
                                case 1:
                                    break;
                                }
                            if (message.feeds != null && message.hasOwnProperty("feeds")) {
                                if (!$util.isObject(message.feeds))
                                    return "feeds: object expected";
                                let key = Object.keys(message.feeds);
                                for (let i = 0; i < key.length; ++i) {
                                    let error = $root.com.upstox.marketdatafeeder.rpc.proto.Feed.verify(message.feeds[key[i]]);
                                    if (error)
                                        return "feeds." + error;
                                }
                            }
                            if (message.currentTs != null && message.hasOwnProperty("currentTs"))
                                if (!$util.isInteger(message.currentTs) && !(message.currentTs && $util.isInteger(message.currentTs.low) && $util.isInteger(message.currentTs.high)))
                                    return "currentTs: integer|Long expected";
                            return null;
                        };

                        /**
                         * Creates a FeedResponse message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FeedResponse
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeeder.rpc.proto.FeedResponse} FeedResponse
                         */
                        FeedResponse.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeeder.rpc.proto.FeedResponse)
                                return object;
                            let message = new $root.com.upstox.marketdatafeeder.rpc.proto.FeedResponse();
                            switch (object.type) {
                            default:
                                if (typeof object.type === "number") {
                                    message.type = object.type;
                                    break;
                                }
                                break;
                            case "initial_feed":
                            case 0:
                                message.type = 0;
                                break;
                            case "live_feed":
                            case 1:
                                message.type = 1;
                                break;
                            }
                            if (object.feeds) {
                                if (typeof object.feeds !== "object")
                                    throw TypeError(".com.upstox.marketdatafeeder.rpc.proto.FeedResponse.feeds: object expected");
                                message.feeds = {};
                                for (let keys = Object.keys(object.feeds), i = 0; i < keys.length; ++i) {
                                    if (typeof object.feeds[keys[i]] !== "object")
                                        throw TypeError(".com.upstox.marketdatafeeder.rpc.proto.FeedResponse.feeds: object expected");
                                    message.feeds[keys[i]] = $root.com.upstox.marketdatafeeder.rpc.proto.Feed.fromObject(object.feeds[keys[i]]);
                                }
                            }
                            if (object.currentTs != null)
                                if ($util.Long)
                                    (message.currentTs = $util.Long.fromValue(object.currentTs)).unsigned = false;
                                else if (typeof object.currentTs === "string")
                                    message.currentTs = parseInt(object.currentTs, 10);
                                else if (typeof object.currentTs === "number")
                                    message.currentTs = object.currentTs;
                                else if (typeof object.currentTs === "object")
                                    message.currentTs = new $util.LongBits(object.currentTs.low >>> 0, object.currentTs.high >>> 0).toNumber();
                            return message;
                        };

                        /**
                         * Creates a plain object from a FeedResponse message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FeedResponse
                         * @static
                         * @param {com.upstox.marketdatafeeder.rpc.proto.FeedResponse} message FeedResponse
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        FeedResponse.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.objects || options.defaults)
                                object.feeds = {};
                            if (options.defaults) {
                                object.type = options.enums === String ? "initial_feed" : 0;
                                if ($util.Long) {
                                    let long = new $util.Long(0, 0, false);
                                    object.currentTs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.currentTs = options.longs === String ? "0" : 0;
                            }
                            if (message.type != null && message.hasOwnProperty("type"))
                                object.type = options.enums === String ? $root.com.upstox.marketdatafeeder.rpc.proto.Type[message.type] === undefined ? message.type : $root.com.upstox.marketdatafeeder.rpc.proto.Type[message.type] : message.type;
                            let keys2;
                            if (message.feeds && (keys2 = Object.keys(message.feeds)).length) {
                                object.feeds = {};
                                for (let j = 0; j < keys2.length; ++j)
                                    object.feeds[keys2[j]] = $root.com.upstox.marketdatafeeder.rpc.proto.Feed.toObject(message.feeds[keys2[j]], options);
                            }
                            if (message.currentTs != null && message.hasOwnProperty("currentTs"))
                                if (typeof message.currentTs === "number")
                                    object.currentTs = options.longs === String ? String(message.currentTs) : message.currentTs;
                                else
                                    object.currentTs = options.longs === String ? $util.Long.prototype.toString.call(message.currentTs) : options.longs === Number ? new $util.LongBits(message.currentTs.low >>> 0, message.currentTs.high >>> 0).toNumber() : message.currentTs;
                            return object;
                        };

                        /**
                         * Converts this FeedResponse to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FeedResponse
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        FeedResponse.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for FeedResponse
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeeder.rpc.proto.FeedResponse
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        FeedResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeeder.rpc.proto.FeedResponse";
                        };

                        return FeedResponse;
                    })();

                    return proto;
                })();

                return rpc;
            })();

            return marketdatafeeder;
        })();

        return upstox;
    })();

    return com;
})();

export { $root as default };
