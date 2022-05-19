const { merge } = require('webpack-merge');

module.exports = (config, context) => {
  return merge(config, {
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: "babel-loader",
          options: { presets: ["@babel/env", "@babel/preset-typescript", ["@babel/preset-react", {"runtime": "automatic"}]] }
        },
        {test: /\.css$/, use: [{loader: "css-loader"}, {loader: "style-loader"}]},
      ],
    },
  });
};
