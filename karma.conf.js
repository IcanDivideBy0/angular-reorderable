'use strict';

module.exports = function (config) {
  config.set({
    plugins: [
      'karma-mocha',
      'karma-sinon-chai',
      'karma-spec-reporter',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher'
    ],
    frameworks: ['mocha', 'sinon-chai'],
    basePath: '.',
    colors: true,
    reporters: ['spec'],
    // browsers: ['PhantomJS', 'Chrome', 'Firefox'],
    browsers: ['PhantomJS'],
    logLevel: config.LOG_ERROR
  });
};
