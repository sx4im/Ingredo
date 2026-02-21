import {
  __commonJS
} from "./chunk-G3PMV62Z.js";

// node_modules/exif-js/exif.js
var require_exif = __commonJS({
  "node_modules/exif-js/exif.js"(exports, module) {
    (function() {
      var debug = false;
      var root = this;
      var EXIF = function(obj) {
        if (obj instanceof EXIF) return obj;
        if (!(this instanceof EXIF)) return new EXIF(obj);
        this.EXIFwrapped = obj;
      };
      if (typeof exports !== "undefined") {
        if (typeof module !== "undefined" && module.exports) {
          exports = module.exports = EXIF;
        }
        exports.EXIF = EXIF;
      } else {
        root.EXIF = EXIF;
      }
      var ExifTags = EXIF.Tags = {
        // version tags
        36864: "ExifVersion",
        // EXIF version
        40960: "FlashpixVersion",
        // Flashpix format version
        // colorspace tags
        40961: "ColorSpace",
        // Color space information tag
        // image configuration
        40962: "PixelXDimension",
        // Valid width of meaningful image
        40963: "PixelYDimension",
        // Valid height of meaningful image
        37121: "ComponentsConfiguration",
        // Information about channels
        37122: "CompressedBitsPerPixel",
        // Compressed bits per pixel
        // user information
        37500: "MakerNote",
        // Any desired information written by the manufacturer
        37510: "UserComment",
        // Comments by user
        // related file
        40964: "RelatedSoundFile",
        // Name of related sound file
        // date and time
        36867: "DateTimeOriginal",
        // Date and time when the original image was generated
        36868: "DateTimeDigitized",
        // Date and time when the image was stored digitally
        37520: "SubsecTime",
        // Fractions of seconds for DateTime
        37521: "SubsecTimeOriginal",
        // Fractions of seconds for DateTimeOriginal
        37522: "SubsecTimeDigitized",
        // Fractions of seconds for DateTimeDigitized
        // picture-taking conditions
        33434: "ExposureTime",
        // Exposure time (in seconds)
        33437: "FNumber",
        // F number
        34850: "ExposureProgram",
        // Exposure program
        34852: "SpectralSensitivity",
        // Spectral sensitivity
        34855: "ISOSpeedRatings",
        // ISO speed rating
        34856: "OECF",
        // Optoelectric conversion factor
        37377: "ShutterSpeedValue",
        // Shutter speed
        37378: "ApertureValue",
        // Lens aperture
        37379: "BrightnessValue",
        // Value of brightness
        37380: "ExposureBias",
        // Exposure bias
        37381: "MaxApertureValue",
        // Smallest F number of lens
        37382: "SubjectDistance",
        // Distance to subject in meters
        37383: "MeteringMode",
        // Metering mode
        37384: "LightSource",
        // Kind of light source
        37385: "Flash",
        // Flash status
        37396: "SubjectArea",
        // Location and area of main subject
        37386: "FocalLength",
        // Focal length of the lens in mm
        41483: "FlashEnergy",
        // Strobe energy in BCPS
        41484: "SpatialFrequencyResponse",
        //
        41486: "FocalPlaneXResolution",
        // Number of pixels in width direction per FocalPlaneResolutionUnit
        41487: "FocalPlaneYResolution",
        // Number of pixels in height direction per FocalPlaneResolutionUnit
        41488: "FocalPlaneResolutionUnit",
        // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
        41492: "SubjectLocation",
        // Location of subject in image
        41493: "ExposureIndex",
        // Exposure index selected on camera
        41495: "SensingMethod",
        // Image sensor type
        41728: "FileSource",
        // Image source (3 == DSC)
        41729: "SceneType",
        // Scene type (1 == directly photographed)
        41730: "CFAPattern",
        // Color filter array geometric pattern
        41985: "CustomRendered",
        // Special processing
        41986: "ExposureMode",
        // Exposure mode
        41987: "WhiteBalance",
        // 1 = auto white balance, 2 = manual
        41988: "DigitalZoomRation",
        // Digital zoom ratio
        41989: "FocalLengthIn35mmFilm",
        // Equivalent foacl length assuming 35mm film camera (in mm)
        41990: "SceneCaptureType",
        // Type of scene
        41991: "GainControl",
        // Degree of overall image gain adjustment
        41992: "Contrast",
        // Direction of contrast processing applied by camera
        41993: "Saturation",
        // Direction of saturation processing applied by camera
        41994: "Sharpness",
        // Direction of sharpness processing applied by camera
        41995: "DeviceSettingDescription",
        //
        41996: "SubjectDistanceRange",
        // Distance to subject
        // other tags
        40965: "InteroperabilityIFDPointer",
        42016: "ImageUniqueID"
        // Identifier assigned uniquely to each image
      };
      var TiffTags = EXIF.TiffTags = {
        256: "ImageWidth",
        257: "ImageHeight",
        34665: "ExifIFDPointer",
        34853: "GPSInfoIFDPointer",
        40965: "InteroperabilityIFDPointer",
        258: "BitsPerSample",
        259: "Compression",
        262: "PhotometricInterpretation",
        274: "Orientation",
        277: "SamplesPerPixel",
        284: "PlanarConfiguration",
        530: "YCbCrSubSampling",
        531: "YCbCrPositioning",
        282: "XResolution",
        283: "YResolution",
        296: "ResolutionUnit",
        273: "StripOffsets",
        278: "RowsPerStrip",
        279: "StripByteCounts",
        513: "JPEGInterchangeFormat",
        514: "JPEGInterchangeFormatLength",
        301: "TransferFunction",
        318: "WhitePoint",
        319: "PrimaryChromaticities",
        529: "YCbCrCoefficients",
        532: "ReferenceBlackWhite",
        306: "DateTime",
        270: "ImageDescription",
        271: "Make",
        272: "Model",
        305: "Software",
        315: "Artist",
        33432: "Copyright"
      };
      var GPSTags = EXIF.GPSTags = {
        0: "GPSVersionID",
        1: "GPSLatitudeRef",
        2: "GPSLatitude",
        3: "GPSLongitudeRef",
        4: "GPSLongitude",
        5: "GPSAltitudeRef",
        6: "GPSAltitude",
        7: "GPSTimeStamp",
        8: "GPSSatellites",
        9: "GPSStatus",
        10: "GPSMeasureMode",
        11: "GPSDOP",
        12: "GPSSpeedRef",
        13: "GPSSpeed",
        14: "GPSTrackRef",
        15: "GPSTrack",
        16: "GPSImgDirectionRef",
        17: "GPSImgDirection",
        18: "GPSMapDatum",
        19: "GPSDestLatitudeRef",
        20: "GPSDestLatitude",
        21: "GPSDestLongitudeRef",
        22: "GPSDestLongitude",
        23: "GPSDestBearingRef",
        24: "GPSDestBearing",
        25: "GPSDestDistanceRef",
        26: "GPSDestDistance",
        27: "GPSProcessingMethod",
        28: "GPSAreaInformation",
        29: "GPSDateStamp",
        30: "GPSDifferential"
      };
      var IFD1Tags = EXIF.IFD1Tags = {
        256: "ImageWidth",
        257: "ImageHeight",
        258: "BitsPerSample",
        259: "Compression",
        262: "PhotometricInterpretation",
        273: "StripOffsets",
        274: "Orientation",
        277: "SamplesPerPixel",
        278: "RowsPerStrip",
        279: "StripByteCounts",
        282: "XResolution",
        283: "YResolution",
        284: "PlanarConfiguration",
        296: "ResolutionUnit",
        513: "JpegIFOffset",
        // When image format is JPEG, this value show offset to JPEG data stored.(aka "ThumbnailOffset" or "JPEGInterchangeFormat")
        514: "JpegIFByteCount",
        // When image format is JPEG, this value shows data size of JPEG image (aka "ThumbnailLength" or "JPEGInterchangeFormatLength")
        529: "YCbCrCoefficients",
        530: "YCbCrSubSampling",
        531: "YCbCrPositioning",
        532: "ReferenceBlackWhite"
      };
      var StringValues = EXIF.StringValues = {
        ExposureProgram: {
          0: "Not defined",
          1: "Manual",
          2: "Normal program",
          3: "Aperture priority",
          4: "Shutter priority",
          5: "Creative program",
          6: "Action program",
          7: "Portrait mode",
          8: "Landscape mode"
        },
        MeteringMode: {
          0: "Unknown",
          1: "Average",
          2: "CenterWeightedAverage",
          3: "Spot",
          4: "MultiSpot",
          5: "Pattern",
          6: "Partial",
          255: "Other"
        },
        LightSource: {
          0: "Unknown",
          1: "Daylight",
          2: "Fluorescent",
          3: "Tungsten (incandescent light)",
          4: "Flash",
          9: "Fine weather",
          10: "Cloudy weather",
          11: "Shade",
          12: "Daylight fluorescent (D 5700 - 7100K)",
          13: "Day white fluorescent (N 4600 - 5400K)",
          14: "Cool white fluorescent (W 3900 - 4500K)",
          15: "White fluorescent (WW 3200 - 3700K)",
          17: "Standard light A",
          18: "Standard light B",
          19: "Standard light C",
          20: "D55",
          21: "D65",
          22: "D75",
          23: "D50",
          24: "ISO studio tungsten",
          255: "Other"
        },
        Flash: {
          0: "Flash did not fire",
          1: "Flash fired",
          5: "Strobe return light not detected",
          7: "Strobe return light detected",
          9: "Flash fired, compulsory flash mode",
          13: "Flash fired, compulsory flash mode, return light not detected",
          15: "Flash fired, compulsory flash mode, return light detected",
          16: "Flash did not fire, compulsory flash mode",
          24: "Flash did not fire, auto mode",
          25: "Flash fired, auto mode",
          29: "Flash fired, auto mode, return light not detected",
          31: "Flash fired, auto mode, return light detected",
          32: "No flash function",
          65: "Flash fired, red-eye reduction mode",
          69: "Flash fired, red-eye reduction mode, return light not detected",
          71: "Flash fired, red-eye reduction mode, return light detected",
          73: "Flash fired, compulsory flash mode, red-eye reduction mode",
          77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
          79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
          89: "Flash fired, auto mode, red-eye reduction mode",
          93: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
          95: "Flash fired, auto mode, return light detected, red-eye reduction mode"
        },
        SensingMethod: {
          1: "Not defined",
          2: "One-chip color area sensor",
          3: "Two-chip color area sensor",
          4: "Three-chip color area sensor",
          5: "Color sequential area sensor",
          7: "Trilinear sensor",
          8: "Color sequential linear sensor"
        },
        SceneCaptureType: {
          0: "Standard",
          1: "Landscape",
          2: "Portrait",
          3: "Night scene"
        },
        SceneType: {
          1: "Directly photographed"
        },
        CustomRendered: {
          0: "Normal process",
          1: "Custom process"
        },
        WhiteBalance: {
          0: "Auto white balance",
          1: "Manual white balance"
        },
        GainControl: {
          0: "None",
          1: "Low gain up",
          2: "High gain up",
          3: "Low gain down",
          4: "High gain down"
        },
        Contrast: {
          0: "Normal",
          1: "Soft",
          2: "Hard"
        },
        Saturation: {
          0: "Normal",
          1: "Low saturation",
          2: "High saturation"
        },
        Sharpness: {
          0: "Normal",
          1: "Soft",
          2: "Hard"
        },
        SubjectDistanceRange: {
          0: "Unknown",
          1: "Macro",
          2: "Close view",
          3: "Distant view"
        },
        FileSource: {
          3: "DSC"
        },
        Components: {
          0: "",
          1: "Y",
          2: "Cb",
          3: "Cr",
          4: "R",
          5: "G",
          6: "B"
        }
      };
      function addEvent(element, event, handler) {
        if (element.addEventListener) {
          element.addEventListener(event, handler, false);
        } else if (element.attachEvent) {
          element.attachEvent("on" + event, handler);
        }
      }
      function imageHasData(img) {
        return !!img.exifdata;
      }
      function base64ToArrayBuffer(base64, contentType) {
        contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || "";
        base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, "");
        var binary = atob(base64);
        var len = binary.length;
        var buffer = new ArrayBuffer(len);
        var view = new Uint8Array(buffer);
        for (var i = 0; i < len; i++) {
          view[i] = binary.charCodeAt(i);
        }
        return buffer;
      }
      function objectURLToBlob(url, callback) {
        var http = new XMLHttpRequest();
        http.open("GET", url, true);
        http.responseType = "blob";
        http.onload = function(e) {
          if (this.status == 200 || this.status === 0) {
            callback(this.response);
          }
        };
        http.send();
      }
      function getImageData(img, callback) {
        function handleBinaryFile(binFile) {
          var data = findEXIFinJPEG(binFile);
          img.exifdata = data || {};
          var iptcdata = findIPTCinJPEG(binFile);
          img.iptcdata = iptcdata || {};
          if (EXIF.isXmpEnabled) {
            var xmpdata = findXMPinJPEG(binFile);
            img.xmpdata = xmpdata || {};
          }
          if (callback) {
            callback.call(img);
          }
        }
        if (img.src) {
          if (/^data\:/i.test(img.src)) {
            var arrayBuffer = base64ToArrayBuffer(img.src);
            handleBinaryFile(arrayBuffer);
          } else if (/^blob\:/i.test(img.src)) {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
              handleBinaryFile(e.target.result);
            };
            objectURLToBlob(img.src, function(blob) {
              fileReader.readAsArrayBuffer(blob);
            });
          } else {
            var http = new XMLHttpRequest();
            http.onload = function() {
              if (this.status == 200 || this.status === 0) {
                handleBinaryFile(http.response);
              } else {
                throw "Could not load image";
              }
              http = null;
            };
            http.open("GET", img.src, true);
            http.responseType = "arraybuffer";
            http.send(null);
          }
        } else if (self.FileReader && (img instanceof self.Blob || img instanceof self.File)) {
          var fileReader = new FileReader();
          fileReader.onload = function(e) {
            if (debug) console.log("Got file of length " + e.target.result.byteLength);
            handleBinaryFile(e.target.result);
          };
          fileReader.readAsArrayBuffer(img);
        }
      }
      function findEXIFinJPEG(file) {
        var dataView = new DataView(file);
        if (debug) console.log("Got file of length " + file.byteLength);
        if (dataView.getUint8(0) != 255 || dataView.getUint8(1) != 216) {
          if (debug) console.log("Not a valid JPEG");
          return false;
        }
        var offset = 2, length = file.byteLength, marker;
        while (offset < length) {
          if (dataView.getUint8(offset) != 255) {
            if (debug) console.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
            return false;
          }
          marker = dataView.getUint8(offset + 1);
          if (debug) console.log(marker);
          if (marker == 225) {
            if (debug) console.log("Found 0xFFE1 marker");
            return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);
          } else {
            offset += 2 + dataView.getUint16(offset + 2);
          }
        }
      }
      function findIPTCinJPEG(file) {
        var dataView = new DataView(file);
        if (debug) console.log("Got file of length " + file.byteLength);
        if (dataView.getUint8(0) != 255 || dataView.getUint8(1) != 216) {
          if (debug) console.log("Not a valid JPEG");
          return false;
        }
        var offset = 2, length = file.byteLength;
        var isFieldSegmentStart = function(dataView2, offset2) {
          return dataView2.getUint8(offset2) === 56 && dataView2.getUint8(offset2 + 1) === 66 && dataView2.getUint8(offset2 + 2) === 73 && dataView2.getUint8(offset2 + 3) === 77 && dataView2.getUint8(offset2 + 4) === 4 && dataView2.getUint8(offset2 + 5) === 4;
        };
        while (offset < length) {
          if (isFieldSegmentStart(dataView, offset)) {
            var nameHeaderLength = dataView.getUint8(offset + 7);
            if (nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
            if (nameHeaderLength === 0) {
              nameHeaderLength = 4;
            }
            var startOffset = offset + 8 + nameHeaderLength;
            var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);
            return readIPTCData(file, startOffset, sectionLength);
            break;
          }
          offset++;
        }
      }
      var IptcFieldMap = {
        120: "caption",
        110: "credit",
        25: "keywords",
        55: "dateCreated",
        80: "byline",
        85: "bylineTitle",
        122: "captionWriter",
        105: "headline",
        116: "copyright",
        15: "category"
      };
      function readIPTCData(file, startOffset, sectionLength) {
        var dataView = new DataView(file);
        var data = {};
        var fieldValue, fieldName, dataSize, segmentType, segmentSize;
        var segmentStartPos = startOffset;
        while (segmentStartPos < startOffset + sectionLength) {
          if (dataView.getUint8(segmentStartPos) === 28 && dataView.getUint8(segmentStartPos + 1) === 2) {
            segmentType = dataView.getUint8(segmentStartPos + 2);
            if (segmentType in IptcFieldMap) {
              dataSize = dataView.getInt16(segmentStartPos + 3);
              segmentSize = dataSize + 5;
              fieldName = IptcFieldMap[segmentType];
              fieldValue = getStringFromDB(dataView, segmentStartPos + 5, dataSize);
              if (data.hasOwnProperty(fieldName)) {
                if (data[fieldName] instanceof Array) {
                  data[fieldName].push(fieldValue);
                } else {
                  data[fieldName] = [data[fieldName], fieldValue];
                }
              } else {
                data[fieldName] = fieldValue;
              }
            }
          }
          segmentStartPos++;
        }
        return data;
      }
      function readTags(file, tiffStart, dirStart, strings, bigEnd) {
        var entries = file.getUint16(dirStart, !bigEnd), tags = {}, entryOffset, tag, i;
        for (i = 0; i < entries; i++) {
          entryOffset = dirStart + i * 12 + 2;
          tag = strings[file.getUint16(entryOffset, !bigEnd)];
          if (!tag && debug) console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
          tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
        }
        return tags;
      }
      function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
        var type = file.getUint16(entryOffset + 2, !bigEnd), numValues = file.getUint32(entryOffset + 4, !bigEnd), valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart, offset, vals, val, n2, numerator, denominator;
        switch (type) {
          case 1:
          // byte, 8-bit unsigned int
          case 7:
            if (numValues == 1) {
              return file.getUint8(entryOffset + 8, !bigEnd);
            } else {
              offset = numValues > 4 ? valueOffset : entryOffset + 8;
              vals = [];
              for (n2 = 0; n2 < numValues; n2++) {
                vals[n2] = file.getUint8(offset + n2);
              }
              return vals;
            }
          case 2:
            offset = numValues > 4 ? valueOffset : entryOffset + 8;
            return getStringFromDB(file, offset, numValues - 1);
          case 3:
            if (numValues == 1) {
              return file.getUint16(entryOffset + 8, !bigEnd);
            } else {
              offset = numValues > 2 ? valueOffset : entryOffset + 8;
              vals = [];
              for (n2 = 0; n2 < numValues; n2++) {
                vals[n2] = file.getUint16(offset + 2 * n2, !bigEnd);
              }
              return vals;
            }
          case 4:
            if (numValues == 1) {
              return file.getUint32(entryOffset + 8, !bigEnd);
            } else {
              vals = [];
              for (n2 = 0; n2 < numValues; n2++) {
                vals[n2] = file.getUint32(valueOffset + 4 * n2, !bigEnd);
              }
              return vals;
            }
          case 5:
            if (numValues == 1) {
              numerator = file.getUint32(valueOffset, !bigEnd);
              denominator = file.getUint32(valueOffset + 4, !bigEnd);
              val = new Number(numerator / denominator);
              val.numerator = numerator;
              val.denominator = denominator;
              return val;
            } else {
              vals = [];
              for (n2 = 0; n2 < numValues; n2++) {
                numerator = file.getUint32(valueOffset + 8 * n2, !bigEnd);
                denominator = file.getUint32(valueOffset + 4 + 8 * n2, !bigEnd);
                vals[n2] = new Number(numerator / denominator);
                vals[n2].numerator = numerator;
                vals[n2].denominator = denominator;
              }
              return vals;
            }
          case 9:
            if (numValues == 1) {
              return file.getInt32(entryOffset + 8, !bigEnd);
            } else {
              vals = [];
              for (n2 = 0; n2 < numValues; n2++) {
                vals[n2] = file.getInt32(valueOffset + 4 * n2, !bigEnd);
              }
              return vals;
            }
          case 10:
            if (numValues == 1) {
              return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset + 4, !bigEnd);
            } else {
              vals = [];
              for (n2 = 0; n2 < numValues; n2++) {
                vals[n2] = file.getInt32(valueOffset + 8 * n2, !bigEnd) / file.getInt32(valueOffset + 4 + 8 * n2, !bigEnd);
              }
              return vals;
            }
        }
      }
      function getNextIFDOffset(dataView, dirStart, bigEnd) {
        var entries = dataView.getUint16(dirStart, !bigEnd);
        return dataView.getUint32(dirStart + 2 + entries * 12, !bigEnd);
      }
      function readThumbnailImage(dataView, tiffStart, firstIFDOffset, bigEnd) {
        var IFD1OffsetPointer = getNextIFDOffset(dataView, tiffStart + firstIFDOffset, bigEnd);
        if (!IFD1OffsetPointer) {
          return {};
        } else if (IFD1OffsetPointer > dataView.byteLength) {
          return {};
        }
        var thumbTags = readTags(dataView, tiffStart, tiffStart + IFD1OffsetPointer, IFD1Tags, bigEnd);
        if (thumbTags["Compression"]) {
          switch (thumbTags["Compression"]) {
            case 6:
              if (thumbTags.JpegIFOffset && thumbTags.JpegIFByteCount) {
                var tOffset = tiffStart + thumbTags.JpegIFOffset;
                var tLength = thumbTags.JpegIFByteCount;
                thumbTags["blob"] = new Blob([new Uint8Array(dataView.buffer, tOffset, tLength)], {
                  type: "image/jpeg"
                });
              }
              break;
            case 1:
              console.log("Thumbnail image format is TIFF, which is not implemented.");
              break;
            default:
              console.log("Unknown thumbnail image format '%s'", thumbTags["Compression"]);
          }
        } else if (thumbTags["PhotometricInterpretation"] == 2) {
          console.log("Thumbnail image format is RGB, which is not implemented.");
        }
        return thumbTags;
      }
      function getStringFromDB(buffer, start, length) {
        var outstr = "";
        for (n = start; n < start + length; n++) {
          outstr += String.fromCharCode(buffer.getUint8(n));
        }
        return outstr;
      }
      function readEXIFData(file, start) {
        if (getStringFromDB(file, start, 4) != "Exif") {
          if (debug) console.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
          return false;
        }
        var bigEnd, tags, tag, exifData, gpsData, tiffOffset = start + 6;
        if (file.getUint16(tiffOffset) == 18761) {
          bigEnd = false;
        } else if (file.getUint16(tiffOffset) == 19789) {
          bigEnd = true;
        } else {
          if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
          return false;
        }
        if (file.getUint16(tiffOffset + 2, !bigEnd) != 42) {
          if (debug) console.log("Not valid TIFF data! (no 0x002A)");
          return false;
        }
        var firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);
        if (firstIFDOffset < 8) {
          if (debug) console.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset + 4, !bigEnd));
          return false;
        }
        tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);
        if (tags.ExifIFDPointer) {
          exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
          for (tag in exifData) {
            switch (tag) {
              case "LightSource":
              case "Flash":
              case "MeteringMode":
              case "ExposureProgram":
              case "SensingMethod":
              case "SceneCaptureType":
              case "SceneType":
              case "CustomRendered":
              case "WhiteBalance":
              case "GainControl":
              case "Contrast":
              case "Saturation":
              case "Sharpness":
              case "SubjectDistanceRange":
              case "FileSource":
                exifData[tag] = StringValues[tag][exifData[tag]];
                break;
              case "ExifVersion":
              case "FlashpixVersion":
                exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
                break;
              case "ComponentsConfiguration":
                exifData[tag] = StringValues.Components[exifData[tag][0]] + StringValues.Components[exifData[tag][1]] + StringValues.Components[exifData[tag][2]] + StringValues.Components[exifData[tag][3]];
                break;
            }
            tags[tag] = exifData[tag];
          }
        }
        if (tags.GPSInfoIFDPointer) {
          gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
          for (tag in gpsData) {
            switch (tag) {
              case "GPSVersionID":
                gpsData[tag] = gpsData[tag][0] + "." + gpsData[tag][1] + "." + gpsData[tag][2] + "." + gpsData[tag][3];
                break;
            }
            tags[tag] = gpsData[tag];
          }
        }
        tags["thumbnail"] = readThumbnailImage(file, tiffOffset, firstIFDOffset, bigEnd);
        return tags;
      }
      function findXMPinJPEG(file) {
        if (!("DOMParser" in self)) {
          return;
        }
        var dataView = new DataView(file);
        if (debug) console.log("Got file of length " + file.byteLength);
        if (dataView.getUint8(0) != 255 || dataView.getUint8(1) != 216) {
          if (debug) console.log("Not a valid JPEG");
          return false;
        }
        var offset = 2, length = file.byteLength, dom = new DOMParser();
        while (offset < length - 4) {
          if (getStringFromDB(dataView, offset, 4) == "http") {
            var startOffset = offset - 1;
            var sectionLength = dataView.getUint16(offset - 2) - 1;
            var xmpString = getStringFromDB(dataView, startOffset, sectionLength);
            var xmpEndIndex = xmpString.indexOf("xmpmeta>") + 8;
            xmpString = xmpString.substring(xmpString.indexOf("<x:xmpmeta"), xmpEndIndex);
            var indexOfXmp = xmpString.indexOf("x:xmpmeta") + 10;
            xmpString = xmpString.slice(0, indexOfXmp) + 'xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:tiff="http://ns.adobe.com/tiff/1.0/" xmlns:plus="http://schemas.android.com/apk/lib/com.google.android.gms.plus" xmlns:ext="http://www.gettyimages.com/xsltExtension/1.0" xmlns:exif="http://ns.adobe.com/exif/1.0/" xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#" xmlns:stRef="http://ns.adobe.com/xap/1.0/sType/ResourceRef#" xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/" xmlns:xapGImg="http://ns.adobe.com/xap/1.0/g/img/" xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" ' + xmpString.slice(indexOfXmp);
            var domDocument = dom.parseFromString(xmpString, "text/xml");
            return xml2Object(domDocument);
          } else {
            offset++;
          }
        }
      }
      function xml2json(xml) {
        var json = {};
        if (xml.nodeType == 1) {
          if (xml.attributes.length > 0) {
            json["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
              var attribute = xml.attributes.item(j);
              json["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
          }
        } else if (xml.nodeType == 3) {
          return xml.nodeValue;
        }
        if (xml.hasChildNodes()) {
          for (var i = 0; i < xml.childNodes.length; i++) {
            var child = xml.childNodes.item(i);
            var nodeName = child.nodeName;
            if (json[nodeName] == null) {
              json[nodeName] = xml2json(child);
            } else {
              if (json[nodeName].push == null) {
                var old = json[nodeName];
                json[nodeName] = [];
                json[nodeName].push(old);
              }
              json[nodeName].push(xml2json(child));
            }
          }
        }
        return json;
      }
      function xml2Object(xml) {
        try {
          var obj = {};
          if (xml.children.length > 0) {
            for (var i = 0; i < xml.children.length; i++) {
              var item = xml.children.item(i);
              var attributes = item.attributes;
              for (var idx in attributes) {
                var itemAtt = attributes[idx];
                var dataKey = itemAtt.nodeName;
                var dataValue = itemAtt.nodeValue;
                if (dataKey !== void 0) {
                  obj[dataKey] = dataValue;
                }
              }
              var nodeName = item.nodeName;
              if (typeof obj[nodeName] == "undefined") {
                obj[nodeName] = xml2json(item);
              } else {
                if (typeof obj[nodeName].push == "undefined") {
                  var old = obj[nodeName];
                  obj[nodeName] = [];
                  obj[nodeName].push(old);
                }
                obj[nodeName].push(xml2json(item));
              }
            }
          } else {
            obj = xml.textContent;
          }
          return obj;
        } catch (e) {
          console.log(e.message);
        }
      }
      EXIF.enableXmp = function() {
        EXIF.isXmpEnabled = true;
      };
      EXIF.disableXmp = function() {
        EXIF.isXmpEnabled = false;
      };
      EXIF.getData = function(img, callback) {
        if ((self.Image && img instanceof self.Image || self.HTMLImageElement && img instanceof self.HTMLImageElement) && !img.complete)
          return false;
        if (!imageHasData(img)) {
          getImageData(img, callback);
        } else {
          if (callback) {
            callback.call(img);
          }
        }
        return true;
      };
      EXIF.getTag = function(img, tag) {
        if (!imageHasData(img)) return;
        return img.exifdata[tag];
      };
      EXIF.getIptcTag = function(img, tag) {
        if (!imageHasData(img)) return;
        return img.iptcdata[tag];
      };
      EXIF.getAllTags = function(img) {
        if (!imageHasData(img)) return {};
        var a, data = img.exifdata, tags = {};
        for (a in data) {
          if (data.hasOwnProperty(a)) {
            tags[a] = data[a];
          }
        }
        return tags;
      };
      EXIF.getAllIptcTags = function(img) {
        if (!imageHasData(img)) return {};
        var a, data = img.iptcdata, tags = {};
        for (a in data) {
          if (data.hasOwnProperty(a)) {
            tags[a] = data[a];
          }
        }
        return tags;
      };
      EXIF.pretty = function(img) {
        if (!imageHasData(img)) return "";
        var a, data = img.exifdata, strPretty = "";
        for (a in data) {
          if (data.hasOwnProperty(a)) {
            if (typeof data[a] == "object") {
              if (data[a] instanceof Number) {
                strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
              } else {
                strPretty += a + " : [" + data[a].length + " values]\r\n";
              }
            } else {
              strPretty += a + " : " + data[a] + "\r\n";
            }
          }
        }
        return strPretty;
      };
      EXIF.readFromBinaryFile = function(file) {
        return findEXIFinJPEG(file);
      };
      if (typeof define === "function" && define.amd) {
        define("exif-js", [], function() {
          return EXIF;
        });
      }
    }).call(exports);
  }
});
export default require_exif();
//# sourceMappingURL=exif-js.js.map
