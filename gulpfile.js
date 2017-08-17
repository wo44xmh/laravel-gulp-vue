const elixir = require('laravel-elixir');

require('laravel-elixir-vue-2');

elixir.ready(function () {
    elixir.webpack.mergeConfig({
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loader: "style-loader!css-loader"
                },
            ]
        }
    })
})

elixir(mix => {
    mix.webpack('app.js');
});