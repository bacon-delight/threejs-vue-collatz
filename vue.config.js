module.exports = {
	chainWebpack: (config) => {
		config.plugin("html").tap((args) => {
			args[0].title = process.env.NAME || "Collatz Conjecture";
			return args;
		});
	},
};
