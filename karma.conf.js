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
    frameworks: ['mocha', 'chai-jquery', 'jquery-1.8.3', 'sinon-chai', 'chai'],
    basePath: '.',
    colors: true,
    reporters: ['spec'],
    // browsers: ['PhantomJS', 'Chrome', 'Firefox'],
    browsers: ['PhantomJS'],
    logLevel: config.LOG_ERROR
  });
};
