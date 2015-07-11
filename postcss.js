var autoprefixer = require('autoprefixer-core');
var postcssNested = require('postcss-nested');
var postcss = require('postcss');
var fs = require('fs');
var path = require('path');
module.exports = function(dron) {

	dron.registerTask('postcss', function(dron) {
		this.dron = dron;
		var self = this;
		dron.watchLocal('*.post.css', function(files) {
			if (files.length===0) {
				self.dron.warn('No postCSS files found');
			} else {
				self.process(files);
			}
		});
	}, {
		process: function(files) {
			var self = this;
			files.forEach(function(file) {
				
				fs.readFile(file, 'utf-8', function(err, content) {
					if (err) {
						self.dron.warn('The file is not readable', file, err);
					} else {

						var tar = file.replace(/\.post\.css$/, '.css');

						postcss([ postcssNested, autoprefixer ]).process(content, {
							from: file,
							to: tar
						}).then(function (result) {
							
						    result.warnings().forEach(function (warn) {
						        self.dron.warn(warn.toString());
						    });
						    fs.writeFile(tar, result.css, function() {
						    	if (!err) {
						    		self.dron.log('Processed', path.basename(tar));
						    	}
						    });
						}).catch(function(error) {
							self.dron.warn('Error', error);
						});
					}
				});
				/**/
				
			});
		}
	})
	
}