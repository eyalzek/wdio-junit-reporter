'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _junitReportBuilder = require('junit-report-builder');

var _junitReportBuilder2 = _interopRequireDefault(_junitReportBuilder);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

/**
 * Initialize a new `Junit` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

var JunitReporter = (function (_events$EventEmitter) {
    _inherits(JunitReporter, _events$EventEmitter);

    function JunitReporter(baseReporter, config) {
        var _this = this;

        var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        _classCallCheck(this, JunitReporter);

        _get(Object.getPrototypeOf(JunitReporter.prototype), 'constructor', this).call(this);

        this.baseReporter = baseReporter;
        this.config = config;
        this.options = options;

        var epilogue = this.baseReporter.epilogue;

        this.on('end', function () {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _getIterator(_Object$keys(_this.baseReporter.stats.runners)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var cid = _step.value;

                    var capabilities = _this.baseReporter.stats.runners[cid];
                    var xml = _this.prepareXml(capabilities);
                    _this.write(capabilities, cid, xml);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            epilogue.call(baseReporter);
        });
    }

    _createClass(JunitReporter, [{
        key: 'prepareXml',
        value: function prepareXml(capabilities) {
            var builder = _junitReportBuilder2['default'].newBuilder();
            var packageName = capabilities.sanitizedCapabilities;

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = _getIterator(_Object$keys(capabilities.specs)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var specId = _step2.value;

                    var spec = capabilities.specs[specId];

                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = _getIterator(_Object$keys(spec.suites)), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var suiteName = _step3.value;

                            var suite = spec.suites[suiteName];
                            var testSuite = builder.testSuite().name(suiteName.toLowerCase().split(/[^a-z0-9]+/).filter(function (item) {
                                return item && item.length;
                            }).join('_')).timestamp(spec.suites[suiteName].start).time(spec.suites[suiteName].duration / 1000).property('specId', specId).property('suiteName', suiteName).property('capabilities', capabilities.sanitizedCapabilities);

                            var _iteratorNormalCompletion4 = true;
                            var _didIteratorError4 = false;
                            var _iteratorError4 = undefined;

                            try {
                                for (var _iterator4 = _getIterator(_Object$keys(suite.tests)), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                    var testName = _step4.value;

                                    var test = suite.tests[testName];
                                    var testCase = testSuite.testCase().className(packageName + '.' + suiteName).name(testName).time(suite.tests[testName].duration / 1000);

                                    if (test.state === 'pending') {
                                        testCase.skipped();
                                    }

                                    if (test.error) {
                                        if (test.error.message) testCase.error('\n' + test.error.message + '\n');
                                        if (test.error.stack) testCase.standardError('\n' + test.error.stack + '\n');
                                    }

                                    var output = this.getStandardOutput(test);
                                    if (output) testCase.standardOutput('\n' + output + '\n');
                                }
                            } catch (err) {
                                _didIteratorError4 = true;
                                _iteratorError4 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion4 && _iterator4['return']) {
                                        _iterator4['return']();
                                    }
                                } finally {
                                    if (_didIteratorError4) {
                                        throw _iteratorError4;
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                                _iterator3['return']();
                            }
                        } finally {
                            if (_didIteratorError3) {
                                throw _iteratorError3;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                        _iterator2['return']();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return builder.build();
        }
    }, {
        key: 'getStandardOutput',
        value: function getStandardOutput(test) {
            var _this2 = this;

            var standardOutput = [];
            test.output.forEach(function (data) {
                switch (data.type) {
                    case 'command':
                        standardOutput.push('COMMAND: ' + data.payload.method.toUpperCase() + ' ' + data.payload.uri.href + ' - ' + _this2.format(data.payload.data));
                        break;
                    case 'result':
                        standardOutput.push('RESULT: ' + _this2.format(data.payload.body));
                        break;
                    case 'screenshot':
                        // TODO: need to write raw attachment now
                        // standardOutput.push(`[[ATTACHMENT|${data.payload.path}]]`)
                        break;
                }
            });
            return standardOutput.length ? standardOutput.join('\n') : '';
        }
    }, {
        key: 'write',
        value: function write(capabilities, cid, xml) {
            if (!this.options || typeof this.options.outputDir !== 'string') {
                return console.log('Cannot write xunit report: empty or invalid \'outputDir\'.');
            }

            try {
                var filename = undefined;
                if (this.options.namingConvention === 'spec') {
                    var specName = _path2['default'].basename(capabilities.config.specs[0]).replace('.js', '');
                    filename = 'WDIO.xunit.' + capabilities.sanitizedCapabilities + '.' + specName + '.xml';
                } else {
                    filename = 'WDIO.xunit.' + capabilities.sanitizedCapabilities + '.' + cid + '.xml';
                }
                var dir = _path2['default'].resolve(this.options.outputDir);
                var filepath = _path2['default'].join(dir, filename);
                _mkdirp2['default'].sync(dir);
                _fs2['default'].writeFileSync(filepath, xml);
                console.log('Wrote xunit report to [' + this.options.outputDir + '].');
            } catch (e) {
                console.log('Failed to write xunit report to [' + this.options.outputDir + ']. Error: ' + e);
            }
        }
    }, {
        key: 'format',
        value: function format(val) {
            return JSON.stringify(this.baseReporter.limit(val));
        }
    }]);

    return JunitReporter;
})(_events2['default'].EventEmitter);

exports['default'] = JunitReporter;
module.exports = exports['default'];
