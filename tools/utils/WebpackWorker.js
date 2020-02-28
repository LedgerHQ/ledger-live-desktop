const webpack = require("webpack");
const winston = require("winston");
const express = require("express");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpackDevMiddleware = require("webpack-dev-middleware");
const path = require("path");

class WebpackWorker {
  constructor(name, config) {
    this.compiler = webpack(config);
    this.config = config;
    this.name = name;
    this.running = false;
    this.logger = winston.createLogger({
      format: winston.format.simple(),
      transports: [
        new winston.transports.File({
          filename: path.resolve(config.output.path, `${name}.log`),
        }),
      ],
    });
  }

  bundle() {
    return new Promise((resolve, reject) => {
      this.compiler.run((err, stats) => {
        if (err) {
          this.logger.error(err);
        } else if (stats.hasErrors()) {
          this.logger.error(stats.toString());
        } else {
          this.logger.info(stats.toString());
        }

        if (err || stats.hasErrors()) {
          return reject(err || stats);
        }
        return resolve();
      });
    });
  }

  watch(onReload) {
    return new Promise((resolve, reject) => {
      this.compiler.watch({}, (err, stats) => {
        if (err) {
          this.logger.error(err);
        } else if (stats.hasErrors()) {
          this.logger.error(stats.toString());
        } else {
          this.logger.info(stats.toString());
        }

        if (!this.running) {
          this.running = true;
          if (err || stats.hasErrors()) {
            return reject(err || stats);
          }
          return resolve();
        } else {
          if (onReload) {
            onReload();
          }
        }
      });
    });
  }

  serve(port) {
    return new Promise((resolve, reject) => {
      const devServer = webpackDevMiddleware(this.compiler, {
        publicPath: this.config.output.publicPath,
        logger: {
          debug: this.logger.debug.bind(this.logger),
          log: this.logger.log.bind(this.logger),
          info: this.logger.info.bind(this.logger),
          error: this.logger.error.bind(this.logger),
          warn: this.logger.warn.bind(this.logger),
        },
      });

      const server = express();
      server.use(devServer);
      server.use(webpackHotMiddleware(this.compiler));

      server.listen(port, err => {
        if (err) {
          return reject(err);
        }
        this.running = true;
        return resolve();
      });
    });
  }
}

module.exports = WebpackWorker;
