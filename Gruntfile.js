module.exports = function( grunt ) {

	'use strict';
	var banner = '/**\n * <%= pkg.homepage %>\n * Copyright (c) <%= grunt.template.today("yyyy") %>\n * This file is generated automatically. Do not edit.\n */\n';

	// Project configuration
	grunt.initConfig( {

		pkg: grunt.file.readJSON( 'package.json' ),

		babel: {
			options: {
				sourceMap: true,
				presets: ['env'],
				plugins: ['transform-react-jsx', 'transform-object-rest-spread']
			},
			dist: {
				files: {
					'blocks/postmeta-block.js': 'blocks/postmeta-block.jsx',
					'blocks/postcontent-block.js': 'blocks/postcontent-block.jsx'
				}
			}
		},

		watch:  {
			babel: {
				files: ['blocks/*.jsx'],
				tasks: ['babel'],
			},
		}
	} );

	grunt.loadNpmTasks( 'grunt-babel');
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	
	grunt.registerTask( 'default', ['babel'] );

	grunt.util.linefeed = '\n';

};
