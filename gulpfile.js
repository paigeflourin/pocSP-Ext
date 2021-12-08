// 'use strict';

// const build = require('@microsoft/sp-build-web');

// build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// var getTasks = build.rig.getTasks;
// build.rig.getTasks = function () {
//   var result = getTasks.call(build.rig);

//   result.set('serve', result.get('serve-deprecated'));

//   return result;
// };



'use strict';

// check if gulp dist was called
if (process.argv.indexOf('dist') !== -1) {
    // add ship options to command call
    process.argv.push('--ship');
}

const path = require('path');
const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const gulpSequence = require('gulp-sequence');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// Create clean distrubution package
gulp.task('dist', gulpSequence('clean', 'bundle', 'package-solution'));
// Create clean development package
gulp.task('dev', gulpSequence('clean', 'bundle', 'package-solution'));

const webpack = require("webpack");
const getClientEnvironment = require("./process-env");
 
build.configureWebpack.mergeConfig({
  additionalConfiguration: cfg => {
    let pluginDefine = null;
    for (var i = 0; i < cfg.plugins.length; i++) {
      var plugin = cfg.plugins[i];
      if (plugin instanceof webpack.DefinePlugin) {
        pluginDefine = plugin;
      }
    }
 
    const currentEnv = getClientEnvironment().stringified;
 
    if (pluginDefine) {
      pluginDefine.definitions = { ...pluginDefine.definitions, ...currentEnv };
    } else {
      cfg.plugins.push(new webpack.DefinePlugin(currentEnv));
    }
 
    return cfg;
  }
});

build.initialize(gulp);
