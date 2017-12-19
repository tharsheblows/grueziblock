'use strict';

var __ = wp.i18n.__;
var _wp$blocks = wp.blocks,
    registerBlockType = _wp$blocks.registerBlockType,
    Editable = _wp$blocks.Editable,
    BlockDescription = _wp$blocks.BlockDescription,
    children = _wp$blocks.source.children;


registerBlockType('grueziblock/faq', {
	title: __('Hello faq'), // this is what shows in the blocks list
	icon: 'index-card', // you can pick different icons. there must be a list somewhere.
	category: 'common', // where do you want this to show up? this will be under "common" in the blocks
	attributes: {
		// our faq, like many faqs, will have questions and answers
		// the question attribute is going to be an h4 element even though I am fairly sure this isn't good
		question: {
			type: 'array',
			source: 'children',
			selector: 'h4'
		},
		// the answer attribute will be in a div with class="answer". 
		answer: {
			type: 'array',
			source: 'children',
			selector: '.answer'
		}
	},

	// this is responsible for the editor side of things in wp-admin when you're making a post
	edit: function edit(props) {

		// focus on the question bit as default
		var focusedEditable = props.focus ? props.focus.editable || null : null;

		var attributes = props.attributes;

		// the function which handles what happens when the question is changed
		var onChangeQuestion = function onChangeQuestion(value) {
			props.setAttributes({ question: value });
		};
		// the function which handles what happens when the answer is changed
		var onChangeAnswer = function onChangeAnswer(value) {
			props.setAttributes({ answer: value });
		};

		// the function which handles what happens when focus is on something
		var onFocusQuestion = function onFocusQuestion(focus) {
			props.setFocus(_.extend({}, focus, { editable: 'question' }));
		};
		// the function which handles what happens when focus is on something
		var onFocusAnswer = function onFocusAnswer(focus) {
			props.setFocus(_.extend({}, focus, { editable: 'answer' }));
		};

		// This is the bit that handles rendering in the editor
		// In the Gutenberg plugin, they return an array but I'm going to do it like the Gutenberg examples plugin and wrap it all in a div to return one node
		// 
		// The Editable component's docs are here: https://wordpress.org/gutenberg/handbook/blocks/introducing-attributes-and-editable-fields/
		// but you see that I'm putting the question in an h4 and the answer in a div with class="answer". In React you need to use className instead of class for reasons I forget.
		// 
		// So for each editable field, I use an Editable compontent which handles the editableness of that bit. I can put html all around everything
		return React.createElement(
			'div',
			{ className: props.className, key: 'editor' },
			React.createElement(Editable, {
				tagName: 'h4',
				placeholder: __('Please add a question here'),
				value: attributes.question,
				onChange: onChangeQuestion,
				focus: focusedEditable === 'question',
				onFocus: onFocusQuestion
			}),
			React.createElement(Editable, {
				tagName: 'p',
				className: 'answer',
				placeholder: __('Please add an answer here'),
				value: attributes.answer,
				onChange: onChangeAnswer,
				focus: focusedEditable === 'answer',
				onFocus: onFocusAnswer
			})
		);
	},

	// Now this is what will save in your database and it's what will be displayed like normal 
	// except that this will be in between html comments like <!-- wp:grueziblock/faq --> <!-- /wp:grueziblock/faq -->
	save: function save(props) {
		var className = props.className,
		    _props$attributes = props.attributes,
		    question = _props$attributes.question,
		    answer = _props$attributes.answer;

		// This is so you can see when it runs. :) 

		console.log('Hey! The save function in registerBlockType in the postcontent block just ran. :) ');

		// this is what gets saved. Anything returned here will go into post_content.
		// this is what it will look like on the front end:
		// <div class="wp-block-grueziblock-faq">
		// 		<div class="question">
		//    		<h4>Question?</h4>
		// 		</div>
		// 		<div class="answer">
		//    		<p>This is the answer</p>
		//  	</div>
		// </div>

		return React.createElement(
			'div',
			{ className: className },
			React.createElement(
				'h4',
				null,
				question
			),
			React.createElement(
				'p',
				{ className: 'answer' },
				answer
			)
		);
	}
});
//# sourceMappingURL=postcontent-block.js.map
