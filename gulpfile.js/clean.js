const rimraf = require("rimraf");
const fs = require("fs");
const { info, error } = require("./logs");

function clean(cb) {
	const outputPath = "./dist";
	const inputPath = "./src";

	const deleteDist = () => {
		rimraf(outputPath, (err) => {
			if (err) error("Error deleting ./dist folder :", err);
		});
		info("Deleted dist folder");
	};

	if (fs.existsSync(outputPath)) deleteDist();

	cb();
}

module.exports = clean;
