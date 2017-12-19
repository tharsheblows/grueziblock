<?php
/**
 * Recipes plugin for Health Lab Online.
 *
 * @author    JJ Jay <jjjay@mac.com>
 * @license   MIT
 * @link      https://tharshetests.wordpress.com
 * @copyright 2017 JJ Jay
 * 
 * Plugin Name:  Hello Gutenberg!
 * Description:  Cheap and cheerful examples of postmeta as I understand it.
 * Version:      0.1.0
 * Author:       JJ Jay 
 * License:      MIT
 * License URI:  https://opensource.org/licenses/MIT
 */

// this is the action you use to add scripts and styles to the editor. It doesn't add to the front end, just the editor.
add_action( 'enqueue_block_editor_assets', 'grueziblock_scripts_and_styles' );
function grueziblock_scripts_and_styles() {
	wp_enqueue_script(
		'grueziblock-content-block-js',
		plugin_dir_url( __FILE__ ) . 'blocks/postcontent-block.js',
		array( 'wp-blocks', 'wp-element' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'blocks/postcontent-block.js' )
	);
	wp_enqueue_script(
		'grueziblock-meta-block-js',
		plugin_dir_url( __FILE__ ) . 'blocks/postmeta-block.js',
		array( 'wp-blocks', 'wp-element' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'blocks/postmeta-block.js' )
	);
	wp_enqueue_style(
		'grueziblock-css',
		plugin_dir_url( __FILE__ ) . 'grueziblock-editor.css',
		filemtime( plugin_dir_path( __FILE__ ) . 'grueziblock-editor.css' )
	);
}

// to use the source: meta in registerBlockType, the meta needs to be registered via register_meta which puts it in the meta object in the post json
add_action( 'init', 'grueziblock_register_the_meta' );
function grueziblock_register_the_meta() {
	register_meta( 
		'post', // this is the object type so for cpts, it's still 'post'
		'grueziblock_sometext', // metakey
		array(
			'show_in_rest' => true,
		)
	);
}