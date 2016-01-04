module.exports = function (config) {
   'use strict';

   config.set({
      // Welche Test-Frameworks sollen verwendet werden?
      frameworks: ['qunit', 'requirejs'],
      // Welche Dateien sollen für die Tests in die Browser geladen werden?
      files: [
         //REQUIRE,
         //REQUIRE_ADAPTER,
         {pattern: 'js/vendor/*.js', included: false},
         {pattern: 'js/app/**/*.js', included: false},
         {pattern: 'js/test/**/*Spec.js', included: false},
         'public_html/js/vendor/*.js',
         'public_html/js/test/*.js'
         //'public_html/js/test/*.html'
         //'test/app.test.js',
         //'test/unit/*.spec.js'
      ],
      // Welche Datein sollen nicht geladen werden?
      exclude: [],
      // Welcher "Reporter" soll verwendet werden?
      // Mögliche Werte sind: 'dots', 'progress', 'junit', 'growl', 'coverage'
      reporters: [
         'dots', // Zeigt den Fortschritt in der Konsole durch eine wachsende Anzahl von "." an.
         'coverage' // Generiert Code Coverage Reports.
      ],
      // Log Level.
      // Mögliche Werte sind: LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG
      logLevel: config.LOG_INFO,
      // Browser einbinden.
      // Möglich sind:
      // - Chrome
      // - ChromeCanary
      // - Firefox
      // - Opera
      // - Safari (nur für Mac)
      // - PhantomJS
      // - IE (nur für Windows)
      browsers: [
         //'PhantomJS',
         'Chrome',
            //'Firefox'
      ],
      // Aktiviert/deaktiviert das automatische Ausführen der Tests, wenn sich eine Datei ändert.
      autoWatch: true,
      // Aktiviert/deaktiviert Continuous Integration Modus:
      // Tests nur einmal ausführen und dann beenden.
      singleRun: false
   });
};