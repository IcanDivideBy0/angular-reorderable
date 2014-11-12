'use strict';

module.exports = function (config) {
  config.set({
    plugins: [
      'karma-mocha',
      'karma-chai',
      'karma-jquery',
      'karma-sinon-chai',
      'karma-chai-jquery',
      'karma-spec-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher'
    ],
    frameworks: ['mocha', 'sinon-chai', 'chai-jquery', 'chai', 'jquery-2.1.0'],
    basePath: '.',
    colors: true,
    reporters: ['spec'],
    // browsers: ['PhantomJS', 'Chrome', 'Firefox'],
    browsers: ['PhantomJS'],
    logLevel: config.LOG_ERROR
  });
};
