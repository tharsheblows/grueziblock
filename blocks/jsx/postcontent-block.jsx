const { __ } = wp.i18n;
const {
	registerBlockType,
	Editable,
	// I'm not using the InspectorControls or BlockControl but you can see the docs here https://wordpress.org/gutenberg/handbook/blocks/block-controls-toolbars-and-inspector/
	BlockDescription, // and the BlockDescription
	source: {
		children
	}
} = wp.blocks;

registerBlockType( 'grueziblock/faq', {
	title: __( 'Hello faq' ), // this is what shows in the blocks list
	icon: 'index-card', // you can pick different icons. there must be a list somewhere.
	category: 'common', // where do you want this to show up? this will be under "common" in the blocks
	attributes: {
		// this is a faq with only questions. It's frequently asked *questions*, it says nothing about answers.
		question: {            
			type: 'array',
			source: 'children',
			selector: 'h4'
		}
	},

	// this is responsible for the editor side of things in wp-admin when you're making a post
	edit: props => {

		// focus on the question bit as default
		const focusedEditable = props.focus ? props.focus.editable || null : null;

		const attributes = props.attributes;

		if ( attributes.length > 0 && attributes.frequentlyAskedQuestion.length > 0 ) {
			props.setAttributes( { question: attributes.frequentlyAskedQuestion[0].q } );
			props.setAttributes( { answer: attributes.frequentlyAskedQuestion[0].a } );
		}

		// the function which handles what happens when the question is changed
		const onChangeQuestion = value => {
			props.setAttributes( { question: value } );
		};
		// the function which handles what happens when the answer is changed
		const onChangeAnswer = value => {
			props.setAttributes( { answer: value } );
		};

		// the function which handles what happens when focus is on something
		const onFocusQuestion = focus => {
			props.setFocus( _.extend( {}, focus, { editable: 'question'} ) );
		};
		// the function which handles what happens when focus is on something
		const onFocusAnswer = focus => {
			props.setFocus( _.extend( {}, focus, { editable: 'answer'} ) );
		};

		// This is the bit that handles rendering in the editor
		// In the Gutenberg plugin, they return an array but I'm going to do it like the Gutenberg examples plugin and wrap it all in a div to return one node
		// 
		// The Editable component's docs are here: https://wordpress.org/gutenberg/handbook/blocks/introducing-attributes-and-editable-fields/
		// but you see that I'm putting the question in an h4 and the answer in a div with class="answer". In React you need to use className instead of class for reasons I forget.
		// 
		// So for each editable field, I use an Editable compontent which handles the editableness of that bit. I can put html all around everything
		return (
			<Editable
				tagName="h4"
				className={ props.className }
				placeholder={ __( 'Please add a question here' ) }
				value={ attributes.question }
				onChange={ onChangeQuestion }
				focus={ focusedEditable === 'question' }
				onFocus={ onFocusQuestion }
			/>
		);
	},


	// Now this is what will save in your database and it's what will be displayed like normal 
	// except that this will be in between html comments like <!-- wp:grueziblock/faq --> <!-- /wp:grueziblock/faq -->
	save: props => {
		const {
			className,
			attributes: {
				// the question
				question,
				// the answer
				answer
			}
		} = props;

		// This is so you can see when it runs. :) 
		console.log( 'Hey! the save function in registerBlockType just ran. :) ');

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

		return (
			<h4 className={ className }>{ question }</h4>
		);
	}
} );