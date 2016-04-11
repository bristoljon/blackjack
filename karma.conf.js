module.exports = function(config) {
    config.set({

        basePath: '.',

        files: [
            'blackjack.js',
            'blackjack.spec.js'
        ],

        exclude: [
        ],

        hostname: 'localhost',
        port: 9876,

        reporters: ['nyan', 'coverage'],

        preprocessors: {
            'blackjack.js': ['coverage']
        },

        autoWatch: false,
        singleRun: true,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        plugins: [
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-coverage',
            'karma-nyan-reporter'
        ],

        coverageReporter: {
          type : 'html',
          dir : 'coverage/'
        }
    })
}
