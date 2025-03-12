 
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

        upstox.marketdatafeederv3udapi = (function() {

            /**
             * Namespace marketdatafeederv3udapi.
             * @memberof com.upstox
             * @namespace
             */
            const marketdatafeederv3udapi = {};

            marketdatafeederv3udapi.rpc = (function() {

                /**
                 * Namespace rpc.
                 * @memberof com.upstox.marketdatafeederv3udapi
                 * @namespace
                 */
                const rpc = {};

                rpc.proto = (function() {

                    /**
                     * Namespace proto.
                     * @memberof com.upstox.marketdatafeederv3udapi.rpc
                     * @namespace
                     */
                    const proto = {};

                    proto.LTPC = (function() {

                        /**
                         * Properties of a LTPC.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @interface ILTPC
                         * @property {number|null} [ltp] LTPC ltp
                         * @property {number|Long|null} [ltt] LTPC ltt
                         * @property {number|Long|null} [ltq] LTPC ltq
                         * @property {number|null} [cp] LTPC cp
                         */

                        /**
                         * Constructs a new LTPC.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @classdesc Represents a LTPC.
                         * @implements ILTPC
                         * @constructor
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC=} [properties] Properties to set
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC
                         * @instance
                         */
                        LTPC.prototype.ltp = 0;

                        /**
                         * LTPC ltt.
                         * @member {number|Long} ltt
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC
                         * @instance
                         */
                        LTPC.prototype.ltt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * LTPC ltq.
                         * @member {number|Long} ltq
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC
                         * @instance
                         */
                        LTPC.prototype.ltq = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * LTPC cp.
                         * @member {number} cp
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC
                         * @instance
                         */
                        LTPC.prototype.cp = 0;

                        /**
                         * Creates a new LTPC instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC} LTPC instance
                         */
                        LTPC.create = function create(properties) {
                            return new LTPC(properties);
                        };

                        /**
                         * Encodes the specified LTPC message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC} message LTPC message or plain object to encode
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
                         * Encodes the specified LTPC message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC} message LTPC message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        LTPC.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes a LTPC message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC} LTPC
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        LTPC.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC();
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC} LTPC
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC} LTPC
                         */
                        LTPC.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC)
                                return object;
                            let message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC();
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC} message LTPC
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        LTPC.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for LTPC
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        LTPC.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC";
                        };

                        return LTPC;
                    })();

                    proto.MarketLevel = (function() {

                        /**
                         * Properties of a MarketLevel.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @interface IMarketLevel
                         * @property {Array.<com.upstox.marketdatafeederv3udapi.rpc.proto.IQuote>|null} [bidAskQuote] MarketLevel bidAskQuote
                         */

                        /**
                         * Constructs a new MarketLevel.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @classdesc Represents a MarketLevel.
                         * @implements IMarketLevel
                         * @constructor
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketLevel=} [properties] Properties to set
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
                         * @member {Array.<com.upstox.marketdatafeederv3udapi.rpc.proto.IQuote>} bidAskQuote
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel
                         * @instance
                         */
                        MarketLevel.prototype.bidAskQuote = $util.emptyArray;

                        /**
                         * Creates a new MarketLevel instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketLevel=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel} MarketLevel instance
                         */
                        MarketLevel.create = function create(properties) {
                            return new MarketLevel(properties);
                        };

                        /**
                         * Encodes the specified MarketLevel message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketLevel} message MarketLevel message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        MarketLevel.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.bidAskQuote != null && message.bidAskQuote.length)
                                for (let i = 0; i < message.bidAskQuote.length; ++i)
                                    $root.com.upstox.marketdatafeederv3udapi.rpc.proto.Quote.encode(message.bidAskQuote[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                            return writer;
                        };

                        /**
                         * Encodes the specified MarketLevel message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketLevel} message MarketLevel message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        MarketLevel.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes a MarketLevel message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel} MarketLevel
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        MarketLevel.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        if (!(message.bidAskQuote && message.bidAskQuote.length))
                                            message.bidAskQuote = [];
                                        message.bidAskQuote.push($root.com.upstox.marketdatafeederv3udapi.rpc.proto.Quote.decode(reader, reader.uint32()));
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel} MarketLevel
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel
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
                                    let error = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.Quote.verify(message.bidAskQuote[i]);
                                    if (error)
                                        return "bidAskQuote." + error;
                                }
                            }
                            return null;
                        };

                        /**
                         * Creates a MarketLevel message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel} MarketLevel
                         */
                        MarketLevel.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel)
                                return object;
                            let message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel();
                            if (object.bidAskQuote) {
                                if (!Array.isArray(object.bidAskQuote))
                                    throw TypeError(".com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel.bidAskQuote: array expected");
                                message.bidAskQuote = [];
                                for (let i = 0; i < object.bidAskQuote.length; ++i) {
                                    if (typeof object.bidAskQuote[i] !== "object")
                                        throw TypeError(".com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel.bidAskQuote: object expected");
                                    message.bidAskQuote[i] = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.Quote.fromObject(object.bidAskQuote[i]);
                                }
                            }
                            return message;
                        };

                        /**
                         * Creates a plain object from a MarketLevel message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel} message MarketLevel
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        MarketLevel.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.arrays || options.defaults)
                                object.bidAskQuote = [];
                            if (message.bidAskQuote && message.bidAskQuote.length) {
                                object.bidAskQuote = [];
                                for (let j = 0; j < message.bidAskQuote.length; ++j)
                                    object.bidAskQuote[j] = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.Quote.toObject(message.bidAskQuote[j], options);
                            }
                            return object;
                        };

                        /**
                         * Converts this MarketLevel to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        MarketLevel.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for MarketLevel
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        MarketLevel.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel";
                        };

                        return MarketLevel;
                    })();

                    proto.MarketOHLC = (function() {

                        /**
                         * Properties of a MarketOHLC.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @interface IMarketOHLC
                         * @property {Array.<com.upstox.marketdatafeederv3udapi.rpc.proto.IOHLC>|null} [ohlc] MarketOHLC ohlc
                         */

                        /**
                         * Constructs a new MarketOHLC.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @classdesc Represents a MarketOHLC.
                         * @implements IMarketOHLC
                         * @constructor
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketOHLC=} [properties] Properties to set
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
                         * @member {Array.<com.upstox.marketdatafeederv3udapi.rpc.proto.IOHLC>} ohlc
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC
                         * @instance
                         */
                        MarketOHLC.prototype.ohlc = $util.emptyArray;

                        /**
                         * Creates a new MarketOHLC instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketOHLC=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC} MarketOHLC instance
                         */
                        MarketOHLC.create = function create(properties) {
                            return new MarketOHLC(properties);
                        };

                        /**
                         * Encodes the specified MarketOHLC message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketOHLC} message MarketOHLC message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        MarketOHLC.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.ohlc != null && message.ohlc.length)
                                for (let i = 0; i < message.ohlc.length; ++i)
                                    $root.com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC.encode(message.ohlc[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                            return writer;
                        };

                        /**
                         * Encodes the specified MarketOHLC message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketOHLC} message MarketOHLC message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        MarketOHLC.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes a MarketOHLC message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC} MarketOHLC
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        MarketOHLC.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        if (!(message.ohlc && message.ohlc.length))
                                            message.ohlc = [];
                                        message.ohlc.push($root.com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC.decode(reader, reader.uint32()));
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC} MarketOHLC
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC
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
                                    let error = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC.verify(message.ohlc[i]);
                                    if (error)
                                        return "ohlc." + error;
                                }
                            }
                            return null;
                        };

                        /**
                         * Creates a MarketOHLC message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC} MarketOHLC
                         */
                        MarketOHLC.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC)
                                return object;
                            let message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC();
                            if (object.ohlc) {
                                if (!Array.isArray(object.ohlc))
                                    throw TypeError(".com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC.ohlc: array expected");
                                message.ohlc = [];
                                for (let i = 0; i < object.ohlc.length; ++i) {
                                    if (typeof object.ohlc[i] !== "object")
                                        throw TypeError(".com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC.ohlc: object expected");
                                    message.ohlc[i] = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC.fromObject(object.ohlc[i]);
                                }
                            }
                            return message;
                        };

                        /**
                         * Creates a plain object from a MarketOHLC message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC} message MarketOHLC
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
                                    object.ohlc[j] = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC.toObject(message.ohlc[j], options);
                            }
                            return object;
                        };

                        /**
                         * Converts this MarketOHLC to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        MarketOHLC.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for MarketOHLC
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        MarketOHLC.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC";
                        };

                        return MarketOHLC;
                    })();

                    proto.Quote = (function() {

                        /**
                         * Properties of a Quote.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @interface IQuote
                         * @property {number|Long|null} [bidQ] Quote bidQ
                         * @property {number|null} [bidP] Quote bidP
                         * @property {number|Long|null} [askQ] Quote askQ
                         * @property {number|null} [askP] Quote askP
                         */

                        /**
                         * Constructs a new Quote.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @classdesc Represents a Quote.
                         * @implements IQuote
                         * @constructor
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IQuote=} [properties] Properties to set
                         */
                        function Quote(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        /**
                         * Quote bidQ.
                         * @member {number|Long} bidQ
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Quote
                         * @instance
                         */
                        Quote.prototype.bidQ = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * Quote bidP.
                         * @member {number} bidP
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Quote
                         * @instance
                         */
                        Quote.prototype.bidP = 0;

                        /**
                         * Quote askQ.
                         * @member {number|Long} askQ
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Quote
                         * @instance
                         */
                        Quote.prototype.askQ = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * Quote askP.
                         * @member {number} askP
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Quote
                         * @instance
                         */
                        Quote.prototype.askP = 0;

                        /**
                         * Creates a new Quote instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Quote
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IQuote=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.Quote} Quote instance
                         */
                        Quote.create = function create(properties) {
                            return new Quote(properties);
                        };

                        /**
                         * Encodes the specified Quote message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.Quote.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Quote
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IQuote} message Quote message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Quote.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.bidQ != null && Object.hasOwnProperty.call(message, "bidQ"))
                                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.bidQ);
                            if (message.bidP != null && Object.hasOwnProperty.call(message, "bidP"))
                                writer.uint32(/* id 2, wireType 1 =*/17).double(message.bidP);
                            if (message.askQ != null && Object.hasOwnProperty.call(message, "askQ"))
                                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.askQ);
                            if (message.askP != null && Object.hasOwnProperty.call(message, "askP"))
                                writer.uint32(/* id 4, wireType 1 =*/33).double(message.askP);
                            return writer;
                        };

                        /**
                         * Encodes the specified Quote message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.Quote.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Quote
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IQuote} message Quote message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Quote.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes a Quote message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Quote
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.Quote} Quote
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Quote.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.Quote();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        message.bidQ = reader.int64();
                                        break;
                                    }
                                case 2: {
                                        message.bidP = reader.double();
                                        break;
                                    }
                                case 3: {
                                        message.askQ = reader.int64();
                                        break;
                                    }
                                case 4: {
                                        message.askP = reader.double();
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Quote
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.Quote} Quote
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Quote
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        Quote.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.bidQ != null && message.hasOwnProperty("bidQ"))
                                if (!$util.isInteger(message.bidQ) && !(message.bidQ && $util.isInteger(message.bidQ.low) && $util.isInteger(message.bidQ.high)))
                                    return "bidQ: integer|Long expected";
                            if (message.bidP != null && message.hasOwnProperty("bidP"))
                                if (typeof message.bidP !== "number")
                                    return "bidP: number expected";
                            if (message.askQ != null && message.hasOwnProperty("askQ"))
                                if (!$util.isInteger(message.askQ) && !(message.askQ && $util.isInteger(message.askQ.low) && $util.isInteger(message.askQ.high)))
                                    return "askQ: integer|Long expected";
                            if (message.askP != null && message.hasOwnProperty("askP"))
                                if (typeof message.askP !== "number")
                                    return "askP: number expected";
                            return null;
                        };

                        /**
                         * Creates a Quote message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Quote
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.Quote} Quote
                         */
                        Quote.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeederv3udapi.rpc.proto.Quote)
                                return object;
                            let message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.Quote();
                            if (object.bidQ != null)
                                if ($util.Long)
                                    (message.bidQ = $util.Long.fromValue(object.bidQ)).unsigned = false;
                                else if (typeof object.bidQ === "string")
                                    message.bidQ = parseInt(object.bidQ, 10);
                                else if (typeof object.bidQ === "number")
                                    message.bidQ = object.bidQ;
                                else if (typeof object.bidQ === "object")
                                    message.bidQ = new $util.LongBits(object.bidQ.low >>> 0, object.bidQ.high >>> 0).toNumber();
                            if (object.bidP != null)
                                message.bidP = Number(object.bidP);
                            if (object.askQ != null)
                                if ($util.Long)
                                    (message.askQ = $util.Long.fromValue(object.askQ)).unsigned = false;
                                else if (typeof object.askQ === "string")
                                    message.askQ = parseInt(object.askQ, 10);
                                else if (typeof object.askQ === "number")
                                    message.askQ = object.askQ;
                                else if (typeof object.askQ === "object")
                                    message.askQ = new $util.LongBits(object.askQ.low >>> 0, object.askQ.high >>> 0).toNumber();
                            if (object.askP != null)
                                message.askP = Number(object.askP);
                            return message;
                        };

                        /**
                         * Creates a plain object from a Quote message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Quote
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.Quote} message Quote
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        Quote.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.defaults) {
                                if ($util.Long) {
                                    let long = new $util.Long(0, 0, false);
                                    object.bidQ = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.bidQ = options.longs === String ? "0" : 0;
                                object.bidP = 0;
                                if ($util.Long) {
                                    let long = new $util.Long(0, 0, false);
                                    object.askQ = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.askQ = options.longs === String ? "0" : 0;
                                object.askP = 0;
                            }
                            if (message.bidQ != null && message.hasOwnProperty("bidQ"))
                                if (typeof message.bidQ === "number")
                                    object.bidQ = options.longs === String ? String(message.bidQ) : message.bidQ;
                                else
                                    object.bidQ = options.longs === String ? $util.Long.prototype.toString.call(message.bidQ) : options.longs === Number ? new $util.LongBits(message.bidQ.low >>> 0, message.bidQ.high >>> 0).toNumber() : message.bidQ;
                            if (message.bidP != null && message.hasOwnProperty("bidP"))
                                object.bidP = options.json && !isFinite(message.bidP) ? String(message.bidP) : message.bidP;
                            if (message.askQ != null && message.hasOwnProperty("askQ"))
                                if (typeof message.askQ === "number")
                                    object.askQ = options.longs === String ? String(message.askQ) : message.askQ;
                                else
                                    object.askQ = options.longs === String ? $util.Long.prototype.toString.call(message.askQ) : options.longs === Number ? new $util.LongBits(message.askQ.low >>> 0, message.askQ.high >>> 0).toNumber() : message.askQ;
                            if (message.askP != null && message.hasOwnProperty("askP"))
                                object.askP = options.json && !isFinite(message.askP) ? String(message.askP) : message.askP;
                            return object;
                        };

                        /**
                         * Converts this Quote to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Quote
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        Quote.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for Quote
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Quote
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        Quote.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeederv3udapi.rpc.proto.Quote";
                        };

                        return Quote;
                    })();

                    proto.OptionGreeks = (function() {

                        /**
                         * Properties of an OptionGreeks.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @interface IOptionGreeks
                         * @property {number|null} [delta] OptionGreeks delta
                         * @property {number|null} [theta] OptionGreeks theta
                         * @property {number|null} [gamma] OptionGreeks gamma
                         * @property {number|null} [vega] OptionGreeks vega
                         * @property {number|null} [rho] OptionGreeks rho
                         */

                        /**
                         * Constructs a new OptionGreeks.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @classdesc Represents an OptionGreeks.
                         * @implements IOptionGreeks
                         * @constructor
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IOptionGreeks=} [properties] Properties to set
                         */
                        function OptionGreeks(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        /**
                         * OptionGreeks delta.
                         * @member {number} delta
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks
                         * @instance
                         */
                        OptionGreeks.prototype.delta = 0;

                        /**
                         * OptionGreeks theta.
                         * @member {number} theta
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks
                         * @instance
                         */
                        OptionGreeks.prototype.theta = 0;

                        /**
                         * OptionGreeks gamma.
                         * @member {number} gamma
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks
                         * @instance
                         */
                        OptionGreeks.prototype.gamma = 0;

                        /**
                         * OptionGreeks vega.
                         * @member {number} vega
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks
                         * @instance
                         */
                        OptionGreeks.prototype.vega = 0;

                        /**
                         * OptionGreeks rho.
                         * @member {number} rho
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks
                         * @instance
                         */
                        OptionGreeks.prototype.rho = 0;

                        /**
                         * Creates a new OptionGreeks instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IOptionGreeks=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks} OptionGreeks instance
                         */
                        OptionGreeks.create = function create(properties) {
                            return new OptionGreeks(properties);
                        };

                        /**
                         * Encodes the specified OptionGreeks message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IOptionGreeks} message OptionGreeks message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        OptionGreeks.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.delta != null && Object.hasOwnProperty.call(message, "delta"))
                                writer.uint32(/* id 1, wireType 1 =*/9).double(message.delta);
                            if (message.theta != null && Object.hasOwnProperty.call(message, "theta"))
                                writer.uint32(/* id 2, wireType 1 =*/17).double(message.theta);
                            if (message.gamma != null && Object.hasOwnProperty.call(message, "gamma"))
                                writer.uint32(/* id 3, wireType 1 =*/25).double(message.gamma);
                            if (message.vega != null && Object.hasOwnProperty.call(message, "vega"))
                                writer.uint32(/* id 4, wireType 1 =*/33).double(message.vega);
                            if (message.rho != null && Object.hasOwnProperty.call(message, "rho"))
                                writer.uint32(/* id 5, wireType 1 =*/41).double(message.rho);
                            return writer;
                        };

                        /**
                         * Encodes the specified OptionGreeks message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IOptionGreeks} message OptionGreeks message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        OptionGreeks.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes an OptionGreeks message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks} OptionGreeks
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        OptionGreeks.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        message.delta = reader.double();
                                        break;
                                    }
                                case 2: {
                                        message.theta = reader.double();
                                        break;
                                    }
                                case 3: {
                                        message.gamma = reader.double();
                                        break;
                                    }
                                case 4: {
                                        message.vega = reader.double();
                                        break;
                                    }
                                case 5: {
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks} OptionGreeks
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        OptionGreeks.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks} OptionGreeks
                         */
                        OptionGreeks.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks)
                                return object;
                            let message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks();
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks} message OptionGreeks
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        OptionGreeks.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.defaults) {
                                object.delta = 0;
                                object.theta = 0;
                                object.gamma = 0;
                                object.vega = 0;
                                object.rho = 0;
                            }
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        OptionGreeks.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for OptionGreeks
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        OptionGreeks.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks";
                        };

                        return OptionGreeks;
                    })();

                    proto.OHLC = (function() {

                        /**
                         * Properties of a OHLC.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @interface IOHLC
                         * @property {string|null} [interval] OHLC interval
                         * @property {number|null} [open] OHLC open
                         * @property {number|null} [high] OHLC high
                         * @property {number|null} [low] OHLC low
                         * @property {number|null} [close] OHLC close
                         * @property {number|Long|null} [vol] OHLC vol
                         * @property {number|Long|null} [ts] OHLC ts
                         */

                        /**
                         * Constructs a new OHLC.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @classdesc Represents a OHLC.
                         * @implements IOHLC
                         * @constructor
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IOHLC=} [properties] Properties to set
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC
                         * @instance
                         */
                        OHLC.prototype.interval = "";

                        /**
                         * OHLC open.
                         * @member {number} open
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC
                         * @instance
                         */
                        OHLC.prototype.open = 0;

                        /**
                         * OHLC high.
                         * @member {number} high
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC
                         * @instance
                         */
                        OHLC.prototype.high = 0;

                        /**
                         * OHLC low.
                         * @member {number} low
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC
                         * @instance
                         */
                        OHLC.prototype.low = 0;

                        /**
                         * OHLC close.
                         * @member {number} close
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC
                         * @instance
                         */
                        OHLC.prototype.close = 0;

                        /**
                         * OHLC vol.
                         * @member {number|Long} vol
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC
                         * @instance
                         */
                        OHLC.prototype.vol = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * OHLC ts.
                         * @member {number|Long} ts
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC
                         * @instance
                         */
                        OHLC.prototype.ts = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * Creates a new OHLC instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IOHLC=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC} OHLC instance
                         */
                        OHLC.create = function create(properties) {
                            return new OHLC(properties);
                        };

                        /**
                         * Encodes the specified OHLC message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IOHLC} message OHLC message or plain object to encode
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
                            if (message.vol != null && Object.hasOwnProperty.call(message, "vol"))
                                writer.uint32(/* id 6, wireType 0 =*/48).int64(message.vol);
                            if (message.ts != null && Object.hasOwnProperty.call(message, "ts"))
                                writer.uint32(/* id 7, wireType 0 =*/56).int64(message.ts);
                            return writer;
                        };

                        /**
                         * Encodes the specified OHLC message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IOHLC} message OHLC message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        OHLC.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes a OHLC message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC} OHLC
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        OHLC.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC();
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
                                        message.vol = reader.int64();
                                        break;
                                    }
                                case 7: {
                                        message.ts = reader.int64();
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC} OHLC
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC
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
                            if (message.vol != null && message.hasOwnProperty("vol"))
                                if (!$util.isInteger(message.vol) && !(message.vol && $util.isInteger(message.vol.low) && $util.isInteger(message.vol.high)))
                                    return "vol: integer|Long expected";
                            if (message.ts != null && message.hasOwnProperty("ts"))
                                if (!$util.isInteger(message.ts) && !(message.ts && $util.isInteger(message.ts.low) && $util.isInteger(message.ts.high)))
                                    return "ts: integer|Long expected";
                            return null;
                        };

                        /**
                         * Creates a OHLC message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC} OHLC
                         */
                        OHLC.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC)
                                return object;
                            let message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC();
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
                            if (object.vol != null)
                                if ($util.Long)
                                    (message.vol = $util.Long.fromValue(object.vol)).unsigned = false;
                                else if (typeof object.vol === "string")
                                    message.vol = parseInt(object.vol, 10);
                                else if (typeof object.vol === "number")
                                    message.vol = object.vol;
                                else if (typeof object.vol === "object")
                                    message.vol = new $util.LongBits(object.vol.low >>> 0, object.vol.high >>> 0).toNumber();
                            if (object.ts != null)
                                if ($util.Long)
                                    (message.ts = $util.Long.fromValue(object.ts)).unsigned = false;
                                else if (typeof object.ts === "string")
                                    message.ts = parseInt(object.ts, 10);
                                else if (typeof object.ts === "number")
                                    message.ts = object.ts;
                                else if (typeof object.ts === "object")
                                    message.ts = new $util.LongBits(object.ts.low >>> 0, object.ts.high >>> 0).toNumber();
                            return message;
                        };

                        /**
                         * Creates a plain object from a OHLC message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC} message OHLC
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
                                if ($util.Long) {
                                    let long = new $util.Long(0, 0, false);
                                    object.vol = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.vol = options.longs === String ? "0" : 0;
                                if ($util.Long) {
                                    let long = new $util.Long(0, 0, false);
                                    object.ts = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.ts = options.longs === String ? "0" : 0;
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
                            if (message.vol != null && message.hasOwnProperty("vol"))
                                if (typeof message.vol === "number")
                                    object.vol = options.longs === String ? String(message.vol) : message.vol;
                                else
                                    object.vol = options.longs === String ? $util.Long.prototype.toString.call(message.vol) : options.longs === Number ? new $util.LongBits(message.vol.low >>> 0, message.vol.high >>> 0).toNumber() : message.vol;
                            if (message.ts != null && message.hasOwnProperty("ts"))
                                if (typeof message.ts === "number")
                                    object.ts = options.longs === String ? String(message.ts) : message.ts;
                                else
                                    object.ts = options.longs === String ? $util.Long.prototype.toString.call(message.ts) : options.longs === Number ? new $util.LongBits(message.ts.low >>> 0, message.ts.high >>> 0).toNumber() : message.ts;
                            return object;
                        };

                        /**
                         * Converts this OHLC to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        OHLC.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for OHLC
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        OHLC.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeederv3udapi.rpc.proto.OHLC";
                        };

                        return OHLC;
                    })();

                    /**
                     * Type enum.
                     * @name com.upstox.marketdatafeederv3udapi.rpc.proto.Type
                     * @enum {number}
                     * @property {number} initial_feed=0 initial_feed value
                     * @property {number} live_feed=1 live_feed value
                     * @property {number} market_info=2 market_info value
                     */
                    proto.Type = (function() {
                        const valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "initial_feed"] = 0;
                        values[valuesById[1] = "live_feed"] = 1;
                        values[valuesById[2] = "market_info"] = 2;
                        return values;
                    })();

                    proto.MarketFullFeed = (function() {

                        /**
                         * Properties of a MarketFullFeed.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @interface IMarketFullFeed
                         * @property {com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC|null} [ltpc] MarketFullFeed ltpc
                         * @property {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketLevel|null} [marketLevel] MarketFullFeed marketLevel
                         * @property {com.upstox.marketdatafeederv3udapi.rpc.proto.IOptionGreeks|null} [optionGreeks] MarketFullFeed optionGreeks
                         * @property {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketOHLC|null} [marketOHLC] MarketFullFeed marketOHLC
                         * @property {number|null} [atp] MarketFullFeed atp
                         * @property {number|Long|null} [vtt] MarketFullFeed vtt
                         * @property {number|null} [oi] MarketFullFeed oi
                         * @property {number|null} [iv] MarketFullFeed iv
                         * @property {number|null} [tbq] MarketFullFeed tbq
                         * @property {number|null} [tsq] MarketFullFeed tsq
                         */

                        /**
                         * Constructs a new MarketFullFeed.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @classdesc Represents a MarketFullFeed.
                         * @implements IMarketFullFeed
                         * @constructor
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketFullFeed=} [properties] Properties to set
                         */
                        function MarketFullFeed(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        /**
                         * MarketFullFeed ltpc.
                         * @member {com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC|null|undefined} ltpc
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed
                         * @instance
                         */
                        MarketFullFeed.prototype.ltpc = null;

                        /**
                         * MarketFullFeed marketLevel.
                         * @member {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketLevel|null|undefined} marketLevel
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed
                         * @instance
                         */
                        MarketFullFeed.prototype.marketLevel = null;

                        /**
                         * MarketFullFeed optionGreeks.
                         * @member {com.upstox.marketdatafeederv3udapi.rpc.proto.IOptionGreeks|null|undefined} optionGreeks
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed
                         * @instance
                         */
                        MarketFullFeed.prototype.optionGreeks = null;

                        /**
                         * MarketFullFeed marketOHLC.
                         * @member {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketOHLC|null|undefined} marketOHLC
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed
                         * @instance
                         */
                        MarketFullFeed.prototype.marketOHLC = null;

                        /**
                         * MarketFullFeed atp.
                         * @member {number} atp
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed
                         * @instance
                         */
                        MarketFullFeed.prototype.atp = 0;

                        /**
                         * MarketFullFeed vtt.
                         * @member {number|Long} vtt
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed
                         * @instance
                         */
                        MarketFullFeed.prototype.vtt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * MarketFullFeed oi.
                         * @member {number} oi
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed
                         * @instance
                         */
                        MarketFullFeed.prototype.oi = 0;

                        /**
                         * MarketFullFeed iv.
                         * @member {number} iv
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed
                         * @instance
                         */
                        MarketFullFeed.prototype.iv = 0;

                        /**
                         * MarketFullFeed tbq.
                         * @member {number} tbq
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed
                         * @instance
                         */
                        MarketFullFeed.prototype.tbq = 0;

                        /**
                         * MarketFullFeed tsq.
                         * @member {number} tsq
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed
                         * @instance
                         */
                        MarketFullFeed.prototype.tsq = 0;

                        /**
                         * Creates a new MarketFullFeed instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketFullFeed=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed} MarketFullFeed instance
                         */
                        MarketFullFeed.create = function create(properties) {
                            return new MarketFullFeed(properties);
                        };

                        /**
                         * Encodes the specified MarketFullFeed message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketFullFeed} message MarketFullFeed message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        MarketFullFeed.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.ltpc != null && Object.hasOwnProperty.call(message, "ltpc"))
                                $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.encode(message.ltpc, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                            if (message.marketLevel != null && Object.hasOwnProperty.call(message, "marketLevel"))
                                $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel.encode(message.marketLevel, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                            if (message.optionGreeks != null && Object.hasOwnProperty.call(message, "optionGreeks"))
                                $root.com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks.encode(message.optionGreeks, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                            if (message.marketOHLC != null && Object.hasOwnProperty.call(message, "marketOHLC"))
                                $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC.encode(message.marketOHLC, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                            if (message.atp != null && Object.hasOwnProperty.call(message, "atp"))
                                writer.uint32(/* id 5, wireType 1 =*/41).double(message.atp);
                            if (message.vtt != null && Object.hasOwnProperty.call(message, "vtt"))
                                writer.uint32(/* id 6, wireType 0 =*/48).int64(message.vtt);
                            if (message.oi != null && Object.hasOwnProperty.call(message, "oi"))
                                writer.uint32(/* id 7, wireType 1 =*/57).double(message.oi);
                            if (message.iv != null && Object.hasOwnProperty.call(message, "iv"))
                                writer.uint32(/* id 8, wireType 1 =*/65).double(message.iv);
                            if (message.tbq != null && Object.hasOwnProperty.call(message, "tbq"))
                                writer.uint32(/* id 9, wireType 1 =*/73).double(message.tbq);
                            if (message.tsq != null && Object.hasOwnProperty.call(message, "tsq"))
                                writer.uint32(/* id 10, wireType 1 =*/81).double(message.tsq);
                            return writer;
                        };

                        /**
                         * Encodes the specified MarketFullFeed message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketFullFeed} message MarketFullFeed message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        MarketFullFeed.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes a MarketFullFeed message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed} MarketFullFeed
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        MarketFullFeed.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        message.ltpc = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 2: {
                                        message.marketLevel = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 3: {
                                        message.optionGreeks = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 4: {
                                        message.marketOHLC = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 5: {
                                        message.atp = reader.double();
                                        break;
                                    }
                                case 6: {
                                        message.vtt = reader.int64();
                                        break;
                                    }
                                case 7: {
                                        message.oi = reader.double();
                                        break;
                                    }
                                case 8: {
                                        message.iv = reader.double();
                                        break;
                                    }
                                case 9: {
                                        message.tbq = reader.double();
                                        break;
                                    }
                                case 10: {
                                        message.tsq = reader.double();
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed} MarketFullFeed
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        MarketFullFeed.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.ltpc != null && message.hasOwnProperty("ltpc")) {
                                let error = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.verify(message.ltpc);
                                if (error)
                                    return "ltpc." + error;
                            }
                            if (message.marketLevel != null && message.hasOwnProperty("marketLevel")) {
                                let error = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel.verify(message.marketLevel);
                                if (error)
                                    return "marketLevel." + error;
                            }
                            if (message.optionGreeks != null && message.hasOwnProperty("optionGreeks")) {
                                let error = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks.verify(message.optionGreeks);
                                if (error)
                                    return "optionGreeks." + error;
                            }
                            if (message.marketOHLC != null && message.hasOwnProperty("marketOHLC")) {
                                let error = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC.verify(message.marketOHLC);
                                if (error)
                                    return "marketOHLC." + error;
                            }
                            if (message.atp != null && message.hasOwnProperty("atp"))
                                if (typeof message.atp !== "number")
                                    return "atp: number expected";
                            if (message.vtt != null && message.hasOwnProperty("vtt"))
                                if (!$util.isInteger(message.vtt) && !(message.vtt && $util.isInteger(message.vtt.low) && $util.isInteger(message.vtt.high)))
                                    return "vtt: integer|Long expected";
                            if (message.oi != null && message.hasOwnProperty("oi"))
                                if (typeof message.oi !== "number")
                                    return "oi: number expected";
                            if (message.iv != null && message.hasOwnProperty("iv"))
                                if (typeof message.iv !== "number")
                                    return "iv: number expected";
                            if (message.tbq != null && message.hasOwnProperty("tbq"))
                                if (typeof message.tbq !== "number")
                                    return "tbq: number expected";
                            if (message.tsq != null && message.hasOwnProperty("tsq"))
                                if (typeof message.tsq !== "number")
                                    return "tsq: number expected";
                            return null;
                        };

                        /**
                         * Creates a MarketFullFeed message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed} MarketFullFeed
                         */
                        MarketFullFeed.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed)
                                return object;
                            let message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed();
                            if (object.ltpc != null) {
                                if (typeof object.ltpc !== "object")
                                    throw TypeError(".com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed.ltpc: object expected");
                                message.ltpc = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.fromObject(object.ltpc);
                            }
                            if (object.marketLevel != null) {
                                if (typeof object.marketLevel !== "object")
                                    throw TypeError(".com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed.marketLevel: object expected");
                                message.marketLevel = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel.fromObject(object.marketLevel);
                            }
                            if (object.optionGreeks != null) {
                                if (typeof object.optionGreeks !== "object")
                                    throw TypeError(".com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed.optionGreeks: object expected");
                                message.optionGreeks = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks.fromObject(object.optionGreeks);
                            }
                            if (object.marketOHLC != null) {
                                if (typeof object.marketOHLC !== "object")
                                    throw TypeError(".com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed.marketOHLC: object expected");
                                message.marketOHLC = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC.fromObject(object.marketOHLC);
                            }
                            if (object.atp != null)
                                message.atp = Number(object.atp);
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
                            if (object.iv != null)
                                message.iv = Number(object.iv);
                            if (object.tbq != null)
                                message.tbq = Number(object.tbq);
                            if (object.tsq != null)
                                message.tsq = Number(object.tsq);
                            return message;
                        };

                        /**
                         * Creates a plain object from a MarketFullFeed message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed} message MarketFullFeed
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
                                object.atp = 0;
                                if ($util.Long) {
                                    let long = new $util.Long(0, 0, false);
                                    object.vtt = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.vtt = options.longs === String ? "0" : 0;
                                object.oi = 0;
                                object.iv = 0;
                                object.tbq = 0;
                                object.tsq = 0;
                            }
                            if (message.ltpc != null && message.hasOwnProperty("ltpc"))
                                object.ltpc = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.toObject(message.ltpc, options);
                            if (message.marketLevel != null && message.hasOwnProperty("marketLevel"))
                                object.marketLevel = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketLevel.toObject(message.marketLevel, options);
                            if (message.optionGreeks != null && message.hasOwnProperty("optionGreeks"))
                                object.optionGreeks = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks.toObject(message.optionGreeks, options);
                            if (message.marketOHLC != null && message.hasOwnProperty("marketOHLC"))
                                object.marketOHLC = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC.toObject(message.marketOHLC, options);
                            if (message.atp != null && message.hasOwnProperty("atp"))
                                object.atp = options.json && !isFinite(message.atp) ? String(message.atp) : message.atp;
                            if (message.vtt != null && message.hasOwnProperty("vtt"))
                                if (typeof message.vtt === "number")
                                    object.vtt = options.longs === String ? String(message.vtt) : message.vtt;
                                else
                                    object.vtt = options.longs === String ? $util.Long.prototype.toString.call(message.vtt) : options.longs === Number ? new $util.LongBits(message.vtt.low >>> 0, message.vtt.high >>> 0).toNumber() : message.vtt;
                            if (message.oi != null && message.hasOwnProperty("oi"))
                                object.oi = options.json && !isFinite(message.oi) ? String(message.oi) : message.oi;
                            if (message.iv != null && message.hasOwnProperty("iv"))
                                object.iv = options.json && !isFinite(message.iv) ? String(message.iv) : message.iv;
                            if (message.tbq != null && message.hasOwnProperty("tbq"))
                                object.tbq = options.json && !isFinite(message.tbq) ? String(message.tbq) : message.tbq;
                            if (message.tsq != null && message.hasOwnProperty("tsq"))
                                object.tsq = options.json && !isFinite(message.tsq) ? String(message.tsq) : message.tsq;
                            return object;
                        };

                        /**
                         * Converts this MarketFullFeed to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        MarketFullFeed.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for MarketFullFeed
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        MarketFullFeed.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed";
                        };

                        return MarketFullFeed;
                    })();

                    proto.IndexFullFeed = (function() {

                        /**
                         * Properties of an IndexFullFeed.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @interface IIndexFullFeed
                         * @property {com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC|null} [ltpc] IndexFullFeed ltpc
                         * @property {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketOHLC|null} [marketOHLC] IndexFullFeed marketOHLC
                         */

                        /**
                         * Constructs a new IndexFullFeed.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @classdesc Represents an IndexFullFeed.
                         * @implements IIndexFullFeed
                         * @constructor
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IIndexFullFeed=} [properties] Properties to set
                         */
                        function IndexFullFeed(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        /**
                         * IndexFullFeed ltpc.
                         * @member {com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC|null|undefined} ltpc
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed
                         * @instance
                         */
                        IndexFullFeed.prototype.ltpc = null;

                        /**
                         * IndexFullFeed marketOHLC.
                         * @member {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketOHLC|null|undefined} marketOHLC
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed
                         * @instance
                         */
                        IndexFullFeed.prototype.marketOHLC = null;

                        /**
                         * Creates a new IndexFullFeed instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IIndexFullFeed=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed} IndexFullFeed instance
                         */
                        IndexFullFeed.create = function create(properties) {
                            return new IndexFullFeed(properties);
                        };

                        /**
                         * Encodes the specified IndexFullFeed message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IIndexFullFeed} message IndexFullFeed message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        IndexFullFeed.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.ltpc != null && Object.hasOwnProperty.call(message, "ltpc"))
                                $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.encode(message.ltpc, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                            if (message.marketOHLC != null && Object.hasOwnProperty.call(message, "marketOHLC"))
                                $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC.encode(message.marketOHLC, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                            return writer;
                        };

                        /**
                         * Encodes the specified IndexFullFeed message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IIndexFullFeed} message IndexFullFeed message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        IndexFullFeed.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes an IndexFullFeed message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed} IndexFullFeed
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        IndexFullFeed.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        message.ltpc = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 2: {
                                        message.marketOHLC = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC.decode(reader, reader.uint32());
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed} IndexFullFeed
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        IndexFullFeed.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.ltpc != null && message.hasOwnProperty("ltpc")) {
                                let error = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.verify(message.ltpc);
                                if (error)
                                    return "ltpc." + error;
                            }
                            if (message.marketOHLC != null && message.hasOwnProperty("marketOHLC")) {
                                let error = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC.verify(message.marketOHLC);
                                if (error)
                                    return "marketOHLC." + error;
                            }
                            return null;
                        };

                        /**
                         * Creates an IndexFullFeed message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed} IndexFullFeed
                         */
                        IndexFullFeed.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed)
                                return object;
                            let message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed();
                            if (object.ltpc != null) {
                                if (typeof object.ltpc !== "object")
                                    throw TypeError(".com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed.ltpc: object expected");
                                message.ltpc = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.fromObject(object.ltpc);
                            }
                            if (object.marketOHLC != null) {
                                if (typeof object.marketOHLC !== "object")
                                    throw TypeError(".com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed.marketOHLC: object expected");
                                message.marketOHLC = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC.fromObject(object.marketOHLC);
                            }
                            return message;
                        };

                        /**
                         * Creates a plain object from an IndexFullFeed message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed} message IndexFullFeed
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
                            }
                            if (message.ltpc != null && message.hasOwnProperty("ltpc"))
                                object.ltpc = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.toObject(message.ltpc, options);
                            if (message.marketOHLC != null && message.hasOwnProperty("marketOHLC"))
                                object.marketOHLC = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketOHLC.toObject(message.marketOHLC, options);
                            return object;
                        };

                        /**
                         * Converts this IndexFullFeed to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        IndexFullFeed.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for IndexFullFeed
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        IndexFullFeed.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed";
                        };

                        return IndexFullFeed;
                    })();

                    proto.FullFeed = (function() {

                        /**
                         * Properties of a FullFeed.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @interface IFullFeed
                         * @property {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketFullFeed|null} [marketFF] FullFeed marketFF
                         * @property {com.upstox.marketdatafeederv3udapi.rpc.proto.IIndexFullFeed|null} [indexFF] FullFeed indexFF
                         */

                        /**
                         * Constructs a new FullFeed.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @classdesc Represents a FullFeed.
                         * @implements IFullFeed
                         * @constructor
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IFullFeed=} [properties] Properties to set
                         */
                        function FullFeed(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        /**
                         * FullFeed marketFF.
                         * @member {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketFullFeed|null|undefined} marketFF
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed
                         * @instance
                         */
                        FullFeed.prototype.marketFF = null;

                        /**
                         * FullFeed indexFF.
                         * @member {com.upstox.marketdatafeederv3udapi.rpc.proto.IIndexFullFeed|null|undefined} indexFF
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed
                         * @instance
                         */
                        FullFeed.prototype.indexFF = null;

                        // OneOf field names bound to virtual getters and setters
                        let $oneOfFields;

                        /**
                         * FullFeed FullFeedUnion.
                         * @member {"marketFF"|"indexFF"|undefined} FullFeedUnion
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed
                         * @instance
                         */
                        Object.defineProperty(FullFeed.prototype, "FullFeedUnion", {
                            get: $util.oneOfGetter($oneOfFields = ["marketFF", "indexFF"]),
                            set: $util.oneOfSetter($oneOfFields)
                        });

                        /**
                         * Creates a new FullFeed instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IFullFeed=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed} FullFeed instance
                         */
                        FullFeed.create = function create(properties) {
                            return new FullFeed(properties);
                        };

                        /**
                         * Encodes the specified FullFeed message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IFullFeed} message FullFeed message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        FullFeed.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.marketFF != null && Object.hasOwnProperty.call(message, "marketFF"))
                                $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed.encode(message.marketFF, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                            if (message.indexFF != null && Object.hasOwnProperty.call(message, "indexFF"))
                                $root.com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed.encode(message.indexFF, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                            return writer;
                        };

                        /**
                         * Encodes the specified FullFeed message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IFullFeed} message FullFeed message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        FullFeed.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes a FullFeed message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed} FullFeed
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        FullFeed.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        message.marketFF = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 2: {
                                        message.indexFF = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed.decode(reader, reader.uint32());
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed} FullFeed
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed
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
                                    let error = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed.verify(message.marketFF);
                                    if (error)
                                        return "marketFF." + error;
                                }
                            }
                            if (message.indexFF != null && message.hasOwnProperty("indexFF")) {
                                if (properties.FullFeedUnion === 1)
                                    return "FullFeedUnion: multiple values";
                                properties.FullFeedUnion = 1;
                                {
                                    let error = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed.verify(message.indexFF);
                                    if (error)
                                        return "indexFF." + error;
                                }
                            }
                            return null;
                        };

                        /**
                         * Creates a FullFeed message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed} FullFeed
                         */
                        FullFeed.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed)
                                return object;
                            let message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed();
                            if (object.marketFF != null) {
                                if (typeof object.marketFF !== "object")
                                    throw TypeError(".com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed.marketFF: object expected");
                                message.marketFF = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed.fromObject(object.marketFF);
                            }
                            if (object.indexFF != null) {
                                if (typeof object.indexFF !== "object")
                                    throw TypeError(".com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed.indexFF: object expected");
                                message.indexFF = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed.fromObject(object.indexFF);
                            }
                            return message;
                        };

                        /**
                         * Creates a plain object from a FullFeed message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed} message FullFeed
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        FullFeed.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (message.marketFF != null && message.hasOwnProperty("marketFF")) {
                                object.marketFF = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketFullFeed.toObject(message.marketFF, options);
                                if (options.oneofs)
                                    object.FullFeedUnion = "marketFF";
                            }
                            if (message.indexFF != null && message.hasOwnProperty("indexFF")) {
                                object.indexFF = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.IndexFullFeed.toObject(message.indexFF, options);
                                if (options.oneofs)
                                    object.FullFeedUnion = "indexFF";
                            }
                            return object;
                        };

                        /**
                         * Converts this FullFeed to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        FullFeed.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for FullFeed
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        FullFeed.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed";
                        };

                        return FullFeed;
                    })();

                    proto.FirstLevelWithGreeks = (function() {

                        /**
                         * Properties of a FirstLevelWithGreeks.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @interface IFirstLevelWithGreeks
                         * @property {com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC|null} [ltpc] FirstLevelWithGreeks ltpc
                         * @property {com.upstox.marketdatafeederv3udapi.rpc.proto.IQuote|null} [firstDepth] FirstLevelWithGreeks firstDepth
                         * @property {com.upstox.marketdatafeederv3udapi.rpc.proto.IOptionGreeks|null} [optionGreeks] FirstLevelWithGreeks optionGreeks
                         * @property {number|Long|null} [vtt] FirstLevelWithGreeks vtt
                         * @property {number|null} [oi] FirstLevelWithGreeks oi
                         * @property {number|null} [iv] FirstLevelWithGreeks iv
                         */

                        /**
                         * Constructs a new FirstLevelWithGreeks.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @classdesc Represents a FirstLevelWithGreeks.
                         * @implements IFirstLevelWithGreeks
                         * @constructor
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IFirstLevelWithGreeks=} [properties] Properties to set
                         */
                        function FirstLevelWithGreeks(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        /**
                         * FirstLevelWithGreeks ltpc.
                         * @member {com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC|null|undefined} ltpc
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks
                         * @instance
                         */
                        FirstLevelWithGreeks.prototype.ltpc = null;

                        /**
                         * FirstLevelWithGreeks firstDepth.
                         * @member {com.upstox.marketdatafeederv3udapi.rpc.proto.IQuote|null|undefined} firstDepth
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks
                         * @instance
                         */
                        FirstLevelWithGreeks.prototype.firstDepth = null;

                        /**
                         * FirstLevelWithGreeks optionGreeks.
                         * @member {com.upstox.marketdatafeederv3udapi.rpc.proto.IOptionGreeks|null|undefined} optionGreeks
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks
                         * @instance
                         */
                        FirstLevelWithGreeks.prototype.optionGreeks = null;

                        /**
                         * FirstLevelWithGreeks vtt.
                         * @member {number|Long} vtt
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks
                         * @instance
                         */
                        FirstLevelWithGreeks.prototype.vtt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * FirstLevelWithGreeks oi.
                         * @member {number} oi
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks
                         * @instance
                         */
                        FirstLevelWithGreeks.prototype.oi = 0;

                        /**
                         * FirstLevelWithGreeks iv.
                         * @member {number} iv
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks
                         * @instance
                         */
                        FirstLevelWithGreeks.prototype.iv = 0;

                        /**
                         * Creates a new FirstLevelWithGreeks instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IFirstLevelWithGreeks=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks} FirstLevelWithGreeks instance
                         */
                        FirstLevelWithGreeks.create = function create(properties) {
                            return new FirstLevelWithGreeks(properties);
                        };

                        /**
                         * Encodes the specified FirstLevelWithGreeks message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IFirstLevelWithGreeks} message FirstLevelWithGreeks message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        FirstLevelWithGreeks.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.ltpc != null && Object.hasOwnProperty.call(message, "ltpc"))
                                $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.encode(message.ltpc, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                            if (message.firstDepth != null && Object.hasOwnProperty.call(message, "firstDepth"))
                                $root.com.upstox.marketdatafeederv3udapi.rpc.proto.Quote.encode(message.firstDepth, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                            if (message.optionGreeks != null && Object.hasOwnProperty.call(message, "optionGreeks"))
                                $root.com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks.encode(message.optionGreeks, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                            if (message.vtt != null && Object.hasOwnProperty.call(message, "vtt"))
                                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.vtt);
                            if (message.oi != null && Object.hasOwnProperty.call(message, "oi"))
                                writer.uint32(/* id 5, wireType 1 =*/41).double(message.oi);
                            if (message.iv != null && Object.hasOwnProperty.call(message, "iv"))
                                writer.uint32(/* id 6, wireType 1 =*/49).double(message.iv);
                            return writer;
                        };

                        /**
                         * Encodes the specified FirstLevelWithGreeks message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IFirstLevelWithGreeks} message FirstLevelWithGreeks message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        FirstLevelWithGreeks.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes a FirstLevelWithGreeks message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks} FirstLevelWithGreeks
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        FirstLevelWithGreeks.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        message.ltpc = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 2: {
                                        message.firstDepth = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.Quote.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 3: {
                                        message.optionGreeks = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 4: {
                                        message.vtt = reader.int64();
                                        break;
                                    }
                                case 5: {
                                        message.oi = reader.double();
                                        break;
                                    }
                                case 6: {
                                        message.iv = reader.double();
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
                         * Decodes a FirstLevelWithGreeks message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks} FirstLevelWithGreeks
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        FirstLevelWithGreeks.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };

                        /**
                         * Verifies a FirstLevelWithGreeks message.
                         * @function verify
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        FirstLevelWithGreeks.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.ltpc != null && message.hasOwnProperty("ltpc")) {
                                let error = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.verify(message.ltpc);
                                if (error)
                                    return "ltpc." + error;
                            }
                            if (message.firstDepth != null && message.hasOwnProperty("firstDepth")) {
                                let error = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.Quote.verify(message.firstDepth);
                                if (error)
                                    return "firstDepth." + error;
                            }
                            if (message.optionGreeks != null && message.hasOwnProperty("optionGreeks")) {
                                let error = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks.verify(message.optionGreeks);
                                if (error)
                                    return "optionGreeks." + error;
                            }
                            if (message.vtt != null && message.hasOwnProperty("vtt"))
                                if (!$util.isInteger(message.vtt) && !(message.vtt && $util.isInteger(message.vtt.low) && $util.isInteger(message.vtt.high)))
                                    return "vtt: integer|Long expected";
                            if (message.oi != null && message.hasOwnProperty("oi"))
                                if (typeof message.oi !== "number")
                                    return "oi: number expected";
                            if (message.iv != null && message.hasOwnProperty("iv"))
                                if (typeof message.iv !== "number")
                                    return "iv: number expected";
                            return null;
                        };

                        /**
                         * Creates a FirstLevelWithGreeks message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks} FirstLevelWithGreeks
                         */
                        FirstLevelWithGreeks.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks)
                                return object;
                            let message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks();
                            if (object.ltpc != null) {
                                if (typeof object.ltpc !== "object")
                                    throw TypeError(".com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks.ltpc: object expected");
                                message.ltpc = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.fromObject(object.ltpc);
                            }
                            if (object.firstDepth != null) {
                                if (typeof object.firstDepth !== "object")
                                    throw TypeError(".com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks.firstDepth: object expected");
                                message.firstDepth = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.Quote.fromObject(object.firstDepth);
                            }
                            if (object.optionGreeks != null) {
                                if (typeof object.optionGreeks !== "object")
                                    throw TypeError(".com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks.optionGreeks: object expected");
                                message.optionGreeks = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks.fromObject(object.optionGreeks);
                            }
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
                            if (object.iv != null)
                                message.iv = Number(object.iv);
                            return message;
                        };

                        /**
                         * Creates a plain object from a FirstLevelWithGreeks message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks} message FirstLevelWithGreeks
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        FirstLevelWithGreeks.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.defaults) {
                                object.ltpc = null;
                                object.firstDepth = null;
                                object.optionGreeks = null;
                                if ($util.Long) {
                                    let long = new $util.Long(0, 0, false);
                                    object.vtt = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.vtt = options.longs === String ? "0" : 0;
                                object.oi = 0;
                                object.iv = 0;
                            }
                            if (message.ltpc != null && message.hasOwnProperty("ltpc"))
                                object.ltpc = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.toObject(message.ltpc, options);
                            if (message.firstDepth != null && message.hasOwnProperty("firstDepth"))
                                object.firstDepth = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.Quote.toObject(message.firstDepth, options);
                            if (message.optionGreeks != null && message.hasOwnProperty("optionGreeks"))
                                object.optionGreeks = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.OptionGreeks.toObject(message.optionGreeks, options);
                            if (message.vtt != null && message.hasOwnProperty("vtt"))
                                if (typeof message.vtt === "number")
                                    object.vtt = options.longs === String ? String(message.vtt) : message.vtt;
                                else
                                    object.vtt = options.longs === String ? $util.Long.prototype.toString.call(message.vtt) : options.longs === Number ? new $util.LongBits(message.vtt.low >>> 0, message.vtt.high >>> 0).toNumber() : message.vtt;
                            if (message.oi != null && message.hasOwnProperty("oi"))
                                object.oi = options.json && !isFinite(message.oi) ? String(message.oi) : message.oi;
                            if (message.iv != null && message.hasOwnProperty("iv"))
                                object.iv = options.json && !isFinite(message.iv) ? String(message.iv) : message.iv;
                            return object;
                        };

                        /**
                         * Converts this FirstLevelWithGreeks to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        FirstLevelWithGreeks.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for FirstLevelWithGreeks
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        FirstLevelWithGreeks.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks";
                        };

                        return FirstLevelWithGreeks;
                    })();

                    proto.Feed = (function() {

                        /**
                         * Properties of a Feed.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @interface IFeed
                         * @property {com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC|null} [ltpc] Feed ltpc
                         * @property {com.upstox.marketdatafeederv3udapi.rpc.proto.IFullFeed|null} [fullFeed] Feed fullFeed
                         * @property {com.upstox.marketdatafeederv3udapi.rpc.proto.IFirstLevelWithGreeks|null} [firstLevelWithGreeks] Feed firstLevelWithGreeks
                         * @property {com.upstox.marketdatafeederv3udapi.rpc.proto.RequestMode|null} [requestMode] Feed requestMode
                         */

                        /**
                         * Constructs a new Feed.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @classdesc Represents a Feed.
                         * @implements IFeed
                         * @constructor
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IFeed=} [properties] Properties to set
                         */
                        function Feed(properties) {
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        /**
                         * Feed ltpc.
                         * @member {com.upstox.marketdatafeederv3udapi.rpc.proto.ILTPC|null|undefined} ltpc
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Feed
                         * @instance
                         */
                        Feed.prototype.ltpc = null;

                        /**
                         * Feed fullFeed.
                         * @member {com.upstox.marketdatafeederv3udapi.rpc.proto.IFullFeed|null|undefined} fullFeed
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Feed
                         * @instance
                         */
                        Feed.prototype.fullFeed = null;

                        /**
                         * Feed firstLevelWithGreeks.
                         * @member {com.upstox.marketdatafeederv3udapi.rpc.proto.IFirstLevelWithGreeks|null|undefined} firstLevelWithGreeks
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Feed
                         * @instance
                         */
                        Feed.prototype.firstLevelWithGreeks = null;

                        /**
                         * Feed requestMode.
                         * @member {com.upstox.marketdatafeederv3udapi.rpc.proto.RequestMode} requestMode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Feed
                         * @instance
                         */
                        Feed.prototype.requestMode = 0;

                        // OneOf field names bound to virtual getters and setters
                        let $oneOfFields;

                        /**
                         * Feed FeedUnion.
                         * @member {"ltpc"|"fullFeed"|"firstLevelWithGreeks"|undefined} FeedUnion
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Feed
                         * @instance
                         */
                        Object.defineProperty(Feed.prototype, "FeedUnion", {
                            get: $util.oneOfGetter($oneOfFields = ["ltpc", "fullFeed", "firstLevelWithGreeks"]),
                            set: $util.oneOfSetter($oneOfFields)
                        });

                        /**
                         * Creates a new Feed instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Feed
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IFeed=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.Feed} Feed instance
                         */
                        Feed.create = function create(properties) {
                            return new Feed(properties);
                        };

                        /**
                         * Encodes the specified Feed message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.Feed.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Feed
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IFeed} message Feed message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Feed.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.ltpc != null && Object.hasOwnProperty.call(message, "ltpc"))
                                $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.encode(message.ltpc, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                            if (message.fullFeed != null && Object.hasOwnProperty.call(message, "fullFeed"))
                                $root.com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed.encode(message.fullFeed, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                            if (message.firstLevelWithGreeks != null && Object.hasOwnProperty.call(message, "firstLevelWithGreeks"))
                                $root.com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks.encode(message.firstLevelWithGreeks, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                            if (message.requestMode != null && Object.hasOwnProperty.call(message, "requestMode"))
                                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.requestMode);
                            return writer;
                        };

                        /**
                         * Encodes the specified Feed message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.Feed.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Feed
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IFeed} message Feed message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Feed.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes a Feed message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Feed
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.Feed} Feed
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Feed.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.Feed();
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        message.ltpc = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 2: {
                                        message.fullFeed = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 3: {
                                        message.firstLevelWithGreeks = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks.decode(reader, reader.uint32());
                                        break;
                                    }
                                case 4: {
                                        message.requestMode = reader.int32();
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Feed
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.Feed} Feed
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Feed
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
                                    let error = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.verify(message.ltpc);
                                    if (error)
                                        return "ltpc." + error;
                                }
                            }
                            if (message.fullFeed != null && message.hasOwnProperty("fullFeed")) {
                                if (properties.FeedUnion === 1)
                                    return "FeedUnion: multiple values";
                                properties.FeedUnion = 1;
                                {
                                    let error = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed.verify(message.fullFeed);
                                    if (error)
                                        return "fullFeed." + error;
                                }
                            }
                            if (message.firstLevelWithGreeks != null && message.hasOwnProperty("firstLevelWithGreeks")) {
                                if (properties.FeedUnion === 1)
                                    return "FeedUnion: multiple values";
                                properties.FeedUnion = 1;
                                {
                                    let error = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks.verify(message.firstLevelWithGreeks);
                                    if (error)
                                        return "firstLevelWithGreeks." + error;
                                }
                            }
                            if (message.requestMode != null && message.hasOwnProperty("requestMode"))
                                switch (message.requestMode) {
                                default:
                                    return "requestMode: enum value expected";
                                case 0:
                                case 1:
                                case 2:
                                case 3:
                                    break;
                                }
                            return null;
                        };

                        /**
                         * Creates a Feed message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Feed
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.Feed} Feed
                         */
                        Feed.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeederv3udapi.rpc.proto.Feed)
                                return object;
                            let message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.Feed();
                            if (object.ltpc != null) {
                                if (typeof object.ltpc !== "object")
                                    throw TypeError(".com.upstox.marketdatafeederv3udapi.rpc.proto.Feed.ltpc: object expected");
                                message.ltpc = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.fromObject(object.ltpc);
                            }
                            if (object.fullFeed != null) {
                                if (typeof object.fullFeed !== "object")
                                    throw TypeError(".com.upstox.marketdatafeederv3udapi.rpc.proto.Feed.fullFeed: object expected");
                                message.fullFeed = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed.fromObject(object.fullFeed);
                            }
                            if (object.firstLevelWithGreeks != null) {
                                if (typeof object.firstLevelWithGreeks !== "object")
                                    throw TypeError(".com.upstox.marketdatafeederv3udapi.rpc.proto.Feed.firstLevelWithGreeks: object expected");
                                message.firstLevelWithGreeks = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks.fromObject(object.firstLevelWithGreeks);
                            }
                            switch (object.requestMode) {
                            default:
                                if (typeof object.requestMode === "number") {
                                    message.requestMode = object.requestMode;
                                    break;
                                }
                                break;
                            case "ltpc":
                            case 0:
                                message.requestMode = 0;
                                break;
                            case "full_d5":
                            case 1:
                                message.requestMode = 1;
                                break;
                            case "option_greeks":
                            case 2:
                                message.requestMode = 2;
                                break;
                            case "full_d30":
                            case 3:
                                message.requestMode = 3;
                                break;
                            }
                            return message;
                        };

                        /**
                         * Creates a plain object from a Feed message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Feed
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.Feed} message Feed
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        Feed.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.defaults)
                                object.requestMode = options.enums === String ? "ltpc" : 0;
                            if (message.ltpc != null && message.hasOwnProperty("ltpc")) {
                                object.ltpc = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.LTPC.toObject(message.ltpc, options);
                                if (options.oneofs)
                                    object.FeedUnion = "ltpc";
                            }
                            if (message.fullFeed != null && message.hasOwnProperty("fullFeed")) {
                                object.fullFeed = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.FullFeed.toObject(message.fullFeed, options);
                                if (options.oneofs)
                                    object.FeedUnion = "fullFeed";
                            }
                            if (message.firstLevelWithGreeks != null && message.hasOwnProperty("firstLevelWithGreeks")) {
                                object.firstLevelWithGreeks = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.FirstLevelWithGreeks.toObject(message.firstLevelWithGreeks, options);
                                if (options.oneofs)
                                    object.FeedUnion = "firstLevelWithGreeks";
                            }
                            if (message.requestMode != null && message.hasOwnProperty("requestMode"))
                                object.requestMode = options.enums === String ? $root.com.upstox.marketdatafeederv3udapi.rpc.proto.RequestMode[message.requestMode] === undefined ? message.requestMode : $root.com.upstox.marketdatafeederv3udapi.rpc.proto.RequestMode[message.requestMode] : message.requestMode;
                            return object;
                        };

                        /**
                         * Converts this Feed to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Feed
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        Feed.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for Feed
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.Feed
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        Feed.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeederv3udapi.rpc.proto.Feed";
                        };

                        return Feed;
                    })();

                    /**
                     * RequestMode enum.
                     * @name com.upstox.marketdatafeederv3udapi.rpc.proto.RequestMode
                     * @enum {number}
                     * @property {number} ltpc=0 ltpc value
                     * @property {number} full_d5=1 full_d5 value
                     * @property {number} option_greeks=2 option_greeks value
                     * @property {number} full_d30=3 full_d30 value
                     */
                    proto.RequestMode = (function() {
                        const valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "ltpc"] = 0;
                        values[valuesById[1] = "full_d5"] = 1;
                        values[valuesById[2] = "option_greeks"] = 2;
                        values[valuesById[3] = "full_d30"] = 3;
                        return values;
                    })();

                    /**
                     * MarketStatus enum.
                     * @name com.upstox.marketdatafeederv3udapi.rpc.proto.MarketStatus
                     * @enum {number}
                     * @property {number} PRE_OPEN_START=0 PRE_OPEN_START value
                     * @property {number} PRE_OPEN_END=1 PRE_OPEN_END value
                     * @property {number} NORMAL_OPEN=2 NORMAL_OPEN value
                     * @property {number} NORMAL_CLOSE=3 NORMAL_CLOSE value
                     * @property {number} CLOSING_START=4 CLOSING_START value
                     * @property {number} CLOSING_END=5 CLOSING_END value
                     */
                    proto.MarketStatus = (function() {
                        const valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "PRE_OPEN_START"] = 0;
                        values[valuesById[1] = "PRE_OPEN_END"] = 1;
                        values[valuesById[2] = "NORMAL_OPEN"] = 2;
                        values[valuesById[3] = "NORMAL_CLOSE"] = 3;
                        values[valuesById[4] = "CLOSING_START"] = 4;
                        values[valuesById[5] = "CLOSING_END"] = 5;
                        return values;
                    })();

                    proto.MarketInfo = (function() {

                        /**
                         * Properties of a MarketInfo.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @interface IMarketInfo
                         * @property {Object.<string,com.upstox.marketdatafeederv3udapi.rpc.proto.MarketStatus>|null} [segmentStatus] MarketInfo segmentStatus
                         */

                        /**
                         * Constructs a new MarketInfo.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @classdesc Represents a MarketInfo.
                         * @implements IMarketInfo
                         * @constructor
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketInfo=} [properties] Properties to set
                         */
                        function MarketInfo(properties) {
                            this.segmentStatus = {};
                            if (properties)
                                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        /**
                         * MarketInfo segmentStatus.
                         * @member {Object.<string,com.upstox.marketdatafeederv3udapi.rpc.proto.MarketStatus>} segmentStatus
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo
                         * @instance
                         */
                        MarketInfo.prototype.segmentStatus = $util.emptyObject;

                        /**
                         * Creates a new MarketInfo instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketInfo=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo} MarketInfo instance
                         */
                        MarketInfo.create = function create(properties) {
                            return new MarketInfo(properties);
                        };

                        /**
                         * Encodes the specified MarketInfo message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketInfo} message MarketInfo message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        MarketInfo.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.segmentStatus != null && Object.hasOwnProperty.call(message, "segmentStatus"))
                                for (let keys = Object.keys(message.segmentStatus), i = 0; i < keys.length; ++i)
                                    writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 0 =*/16).int32(message.segmentStatus[keys[i]]).ldelim();
                            return writer;
                        };

                        /**
                         * Encodes the specified MarketInfo message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketInfo} message MarketInfo message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        MarketInfo.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes a MarketInfo message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo} MarketInfo
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        MarketInfo.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo(), key, value;
                            while (reader.pos < end) {
                                let tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1: {
                                        if (message.segmentStatus === $util.emptyObject)
                                            message.segmentStatus = {};
                                        let end2 = reader.uint32() + reader.pos;
                                        key = "";
                                        value = 0;
                                        while (reader.pos < end2) {
                                            let tag2 = reader.uint32();
                                            switch (tag2 >>> 3) {
                                            case 1:
                                                key = reader.string();
                                                break;
                                            case 2:
                                                value = reader.int32();
                                                break;
                                            default:
                                                reader.skipType(tag2 & 7);
                                                break;
                                            }
                                        }
                                        message.segmentStatus[key] = value;
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
                         * Decodes a MarketInfo message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo} MarketInfo
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        MarketInfo.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };

                        /**
                         * Verifies a MarketInfo message.
                         * @function verify
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        MarketInfo.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.segmentStatus != null && message.hasOwnProperty("segmentStatus")) {
                                if (!$util.isObject(message.segmentStatus))
                                    return "segmentStatus: object expected";
                                let key = Object.keys(message.segmentStatus);
                                for (let i = 0; i < key.length; ++i)
                                    switch (message.segmentStatus[key[i]]) {
                                    default:
                                        return "segmentStatus: enum value{k:string} expected";
                                    case 0:
                                    case 1:
                                    case 2:
                                    case 3:
                                    case 4:
                                    case 5:
                                        break;
                                    }
                            }
                            return null;
                        };

                        /**
                         * Creates a MarketInfo message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo} MarketInfo
                         */
                        MarketInfo.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo)
                                return object;
                            let message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo();
                            if (object.segmentStatus) {
                                if (typeof object.segmentStatus !== "object")
                                    throw TypeError(".com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo.segmentStatus: object expected");
                                message.segmentStatus = {};
                                for (let keys = Object.keys(object.segmentStatus), i = 0; i < keys.length; ++i)
                                    switch (object.segmentStatus[keys[i]]) {
                                    default:
                                        if (typeof object.segmentStatus[keys[i]] === "number") {
                                            message.segmentStatus[keys[i]] = object.segmentStatus[keys[i]];
                                            break;
                                        }
                                        break;
                                    case "PRE_OPEN_START":
                                    case 0:
                                        message.segmentStatus[keys[i]] = 0;
                                        break;
                                    case "PRE_OPEN_END":
                                    case 1:
                                        message.segmentStatus[keys[i]] = 1;
                                        break;
                                    case "NORMAL_OPEN":
                                    case 2:
                                        message.segmentStatus[keys[i]] = 2;
                                        break;
                                    case "NORMAL_CLOSE":
                                    case 3:
                                        message.segmentStatus[keys[i]] = 3;
                                        break;
                                    case "CLOSING_START":
                                    case 4:
                                        message.segmentStatus[keys[i]] = 4;
                                        break;
                                    case "CLOSING_END":
                                    case 5:
                                        message.segmentStatus[keys[i]] = 5;
                                        break;
                                    }
                            }
                            return message;
                        };

                        /**
                         * Creates a plain object from a MarketInfo message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo} message MarketInfo
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        MarketInfo.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            let object = {};
                            if (options.objects || options.defaults)
                                object.segmentStatus = {};
                            let keys2;
                            if (message.segmentStatus && (keys2 = Object.keys(message.segmentStatus)).length) {
                                object.segmentStatus = {};
                                for (let j = 0; j < keys2.length; ++j)
                                    object.segmentStatus[keys2[j]] = options.enums === String ? $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketStatus[message.segmentStatus[keys2[j]]] === undefined ? message.segmentStatus[keys2[j]] : $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketStatus[message.segmentStatus[keys2[j]]] : message.segmentStatus[keys2[j]];
                            }
                            return object;
                        };

                        /**
                         * Converts this MarketInfo to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        MarketInfo.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for MarketInfo
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        MarketInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo";
                        };

                        return MarketInfo;
                    })();

                    proto.FeedResponse = (function() {

                        /**
                         * Properties of a FeedResponse.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @interface IFeedResponse
                         * @property {com.upstox.marketdatafeederv3udapi.rpc.proto.Type|null} [type] FeedResponse type
                         * @property {Object.<string,com.upstox.marketdatafeederv3udapi.rpc.proto.IFeed>|null} [feeds] FeedResponse feeds
                         * @property {number|Long|null} [currentTs] FeedResponse currentTs
                         * @property {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketInfo|null} [marketInfo] FeedResponse marketInfo
                         */

                        /**
                         * Constructs a new FeedResponse.
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto
                         * @classdesc Represents a FeedResponse.
                         * @implements IFeedResponse
                         * @constructor
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IFeedResponse=} [properties] Properties to set
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
                         * @member {com.upstox.marketdatafeederv3udapi.rpc.proto.Type} type
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse
                         * @instance
                         */
                        FeedResponse.prototype.type = 0;

                        /**
                         * FeedResponse feeds.
                         * @member {Object.<string,com.upstox.marketdatafeederv3udapi.rpc.proto.IFeed>} feeds
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse
                         * @instance
                         */
                        FeedResponse.prototype.feeds = $util.emptyObject;

                        /**
                         * FeedResponse currentTs.
                         * @member {number|Long} currentTs
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse
                         * @instance
                         */
                        FeedResponse.prototype.currentTs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        /**
                         * FeedResponse marketInfo.
                         * @member {com.upstox.marketdatafeederv3udapi.rpc.proto.IMarketInfo|null|undefined} marketInfo
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse
                         * @instance
                         */
                        FeedResponse.prototype.marketInfo = null;

                        /**
                         * Creates a new FeedResponse instance using the specified properties.
                         * @function create
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IFeedResponse=} [properties] Properties to set
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse} FeedResponse instance
                         */
                        FeedResponse.create = function create(properties) {
                            return new FeedResponse(properties);
                        };

                        /**
                         * Encodes the specified FeedResponse message. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse.verify|verify} messages.
                         * @function encode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IFeedResponse} message FeedResponse message or plain object to encode
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
                                    $root.com.upstox.marketdatafeederv3udapi.rpc.proto.Feed.encode(message.feeds[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                                }
                            if (message.currentTs != null && Object.hasOwnProperty.call(message, "currentTs"))
                                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.currentTs);
                            if (message.marketInfo != null && Object.hasOwnProperty.call(message, "marketInfo"))
                                $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo.encode(message.marketInfo, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                            return writer;
                        };

                        /**
                         * Encodes the specified FeedResponse message, length delimited. Does not implicitly {@link com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.IFeedResponse} message FeedResponse message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        FeedResponse.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes a FeedResponse message from the specified reader or buffer.
                         * @function decode
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse} FeedResponse
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        FeedResponse.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse(), key, value;
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
                                                value = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.Feed.decode(reader, reader.uint32());
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
                                case 4: {
                                        message.marketInfo = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo.decode(reader, reader.uint32());
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse} FeedResponse
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
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse
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
                                case 2:
                                    break;
                                }
                            if (message.feeds != null && message.hasOwnProperty("feeds")) {
                                if (!$util.isObject(message.feeds))
                                    return "feeds: object expected";
                                let key = Object.keys(message.feeds);
                                for (let i = 0; i < key.length; ++i) {
                                    let error = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.Feed.verify(message.feeds[key[i]]);
                                    if (error)
                                        return "feeds." + error;
                                }
                            }
                            if (message.currentTs != null && message.hasOwnProperty("currentTs"))
                                if (!$util.isInteger(message.currentTs) && !(message.currentTs && $util.isInteger(message.currentTs.low) && $util.isInteger(message.currentTs.high)))
                                    return "currentTs: integer|Long expected";
                            if (message.marketInfo != null && message.hasOwnProperty("marketInfo")) {
                                let error = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo.verify(message.marketInfo);
                                if (error)
                                    return "marketInfo." + error;
                            }
                            return null;
                        };

                        /**
                         * Creates a FeedResponse message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse} FeedResponse
                         */
                        FeedResponse.fromObject = function fromObject(object) {
                            if (object instanceof $root.com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse)
                                return object;
                            let message = new $root.com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse();
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
                            case "market_info":
                            case 2:
                                message.type = 2;
                                break;
                            }
                            if (object.feeds) {
                                if (typeof object.feeds !== "object")
                                    throw TypeError(".com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse.feeds: object expected");
                                message.feeds = {};
                                for (let keys = Object.keys(object.feeds), i = 0; i < keys.length; ++i) {
                                    if (typeof object.feeds[keys[i]] !== "object")
                                        throw TypeError(".com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse.feeds: object expected");
                                    message.feeds[keys[i]] = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.Feed.fromObject(object.feeds[keys[i]]);
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
                            if (object.marketInfo != null) {
                                if (typeof object.marketInfo !== "object")
                                    throw TypeError(".com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse.marketInfo: object expected");
                                message.marketInfo = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo.fromObject(object.marketInfo);
                            }
                            return message;
                        };

                        /**
                         * Creates a plain object from a FeedResponse message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse
                         * @static
                         * @param {com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse} message FeedResponse
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
                                object.marketInfo = null;
                            }
                            if (message.type != null && message.hasOwnProperty("type"))
                                object.type = options.enums === String ? $root.com.upstox.marketdatafeederv3udapi.rpc.proto.Type[message.type] === undefined ? message.type : $root.com.upstox.marketdatafeederv3udapi.rpc.proto.Type[message.type] : message.type;
                            let keys2;
                            if (message.feeds && (keys2 = Object.keys(message.feeds)).length) {
                                object.feeds = {};
                                for (let j = 0; j < keys2.length; ++j)
                                    object.feeds[keys2[j]] = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.Feed.toObject(message.feeds[keys2[j]], options);
                            }
                            if (message.currentTs != null && message.hasOwnProperty("currentTs"))
                                if (typeof message.currentTs === "number")
                                    object.currentTs = options.longs === String ? String(message.currentTs) : message.currentTs;
                                else
                                    object.currentTs = options.longs === String ? $util.Long.prototype.toString.call(message.currentTs) : options.longs === Number ? new $util.LongBits(message.currentTs.low >>> 0, message.currentTs.high >>> 0).toNumber() : message.currentTs;
                            if (message.marketInfo != null && message.hasOwnProperty("marketInfo"))
                                object.marketInfo = $root.com.upstox.marketdatafeederv3udapi.rpc.proto.MarketInfo.toObject(message.marketInfo, options);
                            return object;
                        };

                        /**
                         * Converts this FeedResponse to JSON.
                         * @function toJSON
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        FeedResponse.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        /**
                         * Gets the default type url for FeedResponse
                         * @function getTypeUrl
                         * @memberof com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse
                         * @static
                         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                         * @returns {string} The default type url
                         */
                        FeedResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                            if (typeUrlPrefix === undefined) {
                                typeUrlPrefix = "type.googleapis.com";
                            }
                            return typeUrlPrefix + "/com.upstox.marketdatafeederv3udapi.rpc.proto.FeedResponse";
                        };

                        return FeedResponse;
                    })();

                    return proto;
                })();

                return rpc;
            })();

            return marketdatafeederv3udapi;
        })();

        return upstox;
    })();

    return com;
})();

export { $root as default };
