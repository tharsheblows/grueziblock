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
	wp_enqueue_script(
		'grueziblock-metafromregisterrestfield-block-js',
		plugin_dir_url( __FILE__ ) . 'blocks/metafromregisterrestfield-block.js',
		array( 'wp-blocks', 'wp-element', 'jquery', 'wp-api' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'blocks/metafromregisterrestfield-block.js' )
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

	// this is for the grueziblock/faqmeta block in postmeta-block.jsx which uses source: 'meta'
	// and hey, this cannot be single => 'true' because Editable REALLY wants an array
	register_meta(
		'post', // this is the object type so for cpts, it's still 'post'
		'grueziblock_sometext', // metakey
		array(
			'show_in_rest' => true,
		)
	);

	// the next bit, culminating in register_rest_field, is for the grueziblock/faqrestfield block in metafromregisterrestfield-block.jsx
	// but I've commented out register_block_type because I don't want it on the front end. it still works
	$schema = array(
		'required' => false,
		'description' => 'The place where the faq is applicable', // I don't know, whatever
		'type' => 'string',
	);

	$args = array(
		'object' 	=> 'post', // the object type
		'attribute' => 'grueziblock_somewhere', // the meta key
		'args' 		=> array( 	// yeah yeah $args['args']
			'get_callback' => 'grueziblock_somewhere_get', // populate the field
			'update_callback' => 'grueziblock_somewhere_update', // update the field
			'schema' => $schema
		)
	);

	register_rest_field(
		$args['object'],
		$args['attribute'],
		$args['args']
	);

	// for use withAPIData
	// This determines what is saved to post_content and therefore shown on the front end.
	// In this case, I don't want it to save to post_content so I am commenting it out. 

	// register_block_type( 'grueziblock/faqrestfield', array(
	// 	'render_callback' => 'grueziblock_faqrestfield_render',
	// ) );

}

// Again this can't be single => true because Editable only likes arrays
function grueziblock_somewhere_get( $post_array ){

	$metakey = 'grueziblock_somewhere';
	$somewhere = get_post_meta( $post_array['id'], $metakey, true );
	return strip_tags( $somewhere );
}

function grueziblock_somewhere_update( $value, $post_object ){
	$metakey = 'grueziblock_somewhere';
	$somewhere = update_post_meta( $post_object->ID, $metakey, $value );

	return $somewhere; // returns meta ID if the key didn't exist, true on successful update, false on failure
}

function grueziblock_faqrestfield_render( $attributes ) {
	return 'the server side render can be completely different to the editor';
}
