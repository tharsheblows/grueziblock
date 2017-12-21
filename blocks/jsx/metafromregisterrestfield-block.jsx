const { __ } = wp.i18n;
const {
	registerBlockType,
	Editable
} = wp.blocks;
const{
	Component
} = wp.element;
const { withAPIData } = wp.components;

// What I'm trying to do here (because it is *not* obvious, I know): 
// Add a block which allows an entry in postmeta and registered via register_rest_field (rather than register_meta) to be shown and edited.
// In this version, it does not save anything to post_content, I'm not using register_block_type in grueziblock.php (well it's there, just commented out)
// It saves when save() runs and there's something in the field. Thus far this is only when I press the update button which is fine but might not be if someone relies on revisions?

registerBlockType( 'grueziblock/faqrestfield', {
	title: __( 'Hello faq rest field :)' ), // this is what shows in the blocks list
	icon: 'dashicons-admin-home', // It's a house. https://developer.wordpress.org/resource/dashicons/#admin-home
	category: 'common', // This will be in the "common" tab in the blocks lists.
	useOnce: true, // You can only use this once, soz babe

	// this is responsible for the editor side of things in wp-admin when you're making a post
	// I'm using withAPIData https://github.com/WordPress/gutenberg/blob/master/docs/blocks-dynamic.md
	// better docs: https://github.com/WordPress/gutenberg/blob/master/components/higher-order/with-api-data/README.md
	edit: withAPIData( ( props ) => {

		let postId = _wpGutenbergPost.id; // I am picking this up from _wpGutenbergPost because it's there, wheeeeeeee.

		return {
			post: '/wp/v2/posts/' + postId + '/' // get the post we're editing
		};
	} ) ( ( props ) => {

		// If there's no data yet, let people know
		if( ! props.post.data ) {
			return "loading (if you see this for too long, the endpoint is probably wrong)";
		}
		// If there's no post, then tell someone! See something say something!
		if( props.post.data.length === 0 ){
			return "no post!"
		}

		// what happens when we change the field? Well let's reset the attributes.
		const onChangeFaqField = value => {
			// why can't I use props.setAttributes here? I have it, it's right there. It's just not working.
			// why does this work?
			props.attributes.somewhere = value;
		}

		// It seems that it's entirely possible there's a race condition here with the Editable attribute trying to mount but props.attributes.somewhere hasn't been set
		// so let's check to make sure it's defined (empty is ok!), can we do it like this -- I mean this is working but I thought it was more complicated
		if( props.attributes.somewhere !== undefined ){
			let theValue = ( props.attributes.somewhere ) ? [props.attributes.somewhere] : []; // jiggery pokery so the placeholder works
			return(		
				<Editable
					tagName="p"
					className={ props.className }
					placeholder={ __( 'wait for it' ) }
					value={ theValue } // the value is an array because of Editable and just it just is ok, leave me alone. I need to make it a string SHUT UP
					onChange={ onChangeFaqField }
				/>
			);
		}

		// Ok so tell me why props.setAttributes works here? Because it does! Weird.
		// TODO: revisit this because I might be doing something stupid
		props.setAttributes({ somewhere: props.post.data.grueziblock_somewhere });
		// so if there's no props.attributes.somewhere then we're here
		return "how did we get here then?";

	} ),

	save: ( props ) => {
		// this returns null! I'm using it to save the value without everything freaking out.
		return ( 
			<GrueziblockSomewhereSave
				attributes = { props.attributes }
			/> 
		);
	} 
} );

class GrueziblockSomewhereSave extends Component {

	constructor( props ) {
		super( props );
	}

	// I know I know but there's no component to mount! Maybe this should be in the constructor?
	componentWillMount () {

		let attributes = this.props.attributes;
		// console.log( 'ok try to save the value which is this: ' + attributes.somewhere );
	
		let postId = _wpGutenbergPost.id;  // I think if I had the revision id then I could save this too? 
		// but this doesn't seem to be running for revisions? Which is ok I think because they are disabled on the host I think? I need to test this.
		// This is the published post (or the post id it will have it's published)
		// oh hey look! There's a revisions object in post data with count and last_id.
		// something to keep in mind

		let somewhere = ( attributes.somewhere ) ? attributes.somewhere.toString() : null; // Editable and register_rest_field do *not* play nicely together

		// the first time this is loaded, it's null 
		// I need to check exactly when this is running because it doesn't seem to be running on autosave which makes sense? does it make sense?
		if( somewhere ){
			let body = { grueziblock_somewhere: somewhere }; 
			// props.post.patch();
			// I'm so so so so so sorry, I'm skipping figuring out how the function above works, I am using jQuery just to move on.
			jQuery.ajax({
				method: 'PATCH',
				url: '/wp-json/wp/v2/posts/' + postId + '/',
				data: body,
				beforeSend: function ( xhr ) {
					xhr.setRequestHeader( 'X-WP-Nonce', wpApiSettings.nonce );
				},
			})
			.done( function ( data ){
				console.log( 'phew, done' );
			})
			.fail( function( data ){
				console.log( 'fail :(' );
				console.log( data.responseJSON.message );
			});
		}
	}

	render() {
		// nothing to see here
		return ( null );
	}
}
