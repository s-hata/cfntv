const path = require('path');
const through = require('through2');
const gutil = require('gulp-util');
const chalk = require('chalk');
const AWS = require('aws-sdk');

const PLUGIN_NAME = 'cfntv';

module.exports = options => {
  const _options = Object.assign({}, {apiVersion: '2010-05-15'}, options);

  const transform = (file, encoding, callback) => {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      callback(new gutil.PluginError(PLUGIN_NAME, 'streams not supported!'));
    }

    if (file.isBuffer()) {
      const params = {
        TemplateBody: file.contents.toString(encoding)
      };
      const client = new AWS.CloudFormation(_options);
      client.validateTemplate(params).promise()
        .catch(error => {
          console.group(PLUGIN_NAME);
          console.error('\n ', chalk.underline(path.relative(file.cwd, file.path)));
          console.error('  time: ', error.time);
          console.error('  code: ', error.code);
          console.error('  message: ', error.message);
          console.error(error);
          console.groupEnd();
        });
    }

    callback(null, file);
  };

  return through.obj(transform);
};
