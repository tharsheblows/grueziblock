'use strict';

var __ = wp.i18n.__;
var _wp$blocks = wp.blocks,
    registerBlockType = _wp$blocks.registerBlockType,
    Editable = _wp$blocks.Editable,
    BlockDescription = _wp$blocks.BlockDescription,
    meta = _wp$blocks.source.meta;


registerBlockType('grueziblock/faqmeta', {
	title: __('Hello faq meta!'), // this is what shows in the blocks list
	icon: 'book', // you can pick different icons. there must be a list somewhere. this one is a book.
	category: 'common', // where do you want this to show up? this will be under "common" in the blocks
	attributes: {
		// so let's store a meta so people can add some text, maybe a url or whatever to the post
		someText: {
			type: 'string', // This is going to be a string. I think using this, you are limited to what register_meta can handle.
			source: 'meta', // This is going to come from postmeta
			meta: 'grueziblock_sometext' // this is the metakey registered in grueziblock.php
		}
	},
	useOnce: true, // you can only add this once, soz

	// this is responsible for the editor side of things in wp-admin when you're making a post
	edit: function edit(props) {

		// focus on the someText bit as default
		var focusedEditable = props.focus ? props.focus.editable || null : null;

		var attributes = props.attributes;

		// the function which handles what happens when someText is changed
		var onChangeSomeText = function onChangeSomeText(value) {
			props.setAttributes({ someText: value });
		};

		// the function which handles what happens when focus is on something
		var onFocusSomeText = function onFocusSomeText(focus) {
			props.setFocus(_.extend({}, focus, { editable: 'someText' }));
		};

		// This is the bit that handles rendering in the editor
		// In the Gutenberg plugin, they return an array but I'm going to do it like the Gutenberg examples plugin and wrap it all in a div to return one node
		// 
		// The Editable component's docs are here: https://wordpress.org/gutenberg/handbook/blocks/introducing-attributes-and-editable-fields/
		// but you see that I'm putting "someText" in a p tag. It will fill the paragraph with whatever is the grueziblock_sometext meta value.
		// 
		return React.createElement(
			'div',
			null,
			React.createElement(
				'div',
				{ className: props.className, key: 'editor-meta' },
				React.createElement(
					'p',
					{ className: 'gruezi-info' },
					'Below is the Hello faq meta block. This bit won\'t save, it\'s just here fyi. I put a border around this block just for fun.'
				),
				React.createElement(Editable, {
					tagName: 'p',
					placeholder: __('Please add some text, maybe a link to your blog or a note about why you are awesome.'),
					value: attributes.someText,
					onChange: onChangeSomeText,
					focus: focusedEditable === 'someText',
					onFocus: onFocusSomeText
				})
			)
		);
	},

	// Now this is what will save in your database and it's what will be displayed like normal 
	// except that this will be in between html comments like <!-- wp:grueziblock/faq --> <!-- /wp:grueziblock/faq -->
	save: function save(props) {
		var className = props.className,
		    someText = props.attributes.someText;

		// This is so you can see when it runs. :) 

		console.log('Hey! You just saved or at least tried to save ' + someText + '  :) ');

		// This is returning nothing because registerBlockType handles saving the meta for you and you don't want to add anything to post_content
		return null;
	}
});
//# sourceMappingURL=postmeta-block.js.map
