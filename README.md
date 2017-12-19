# grueziblock

This makes two WordPress Gutenberg blocks: "Hello faq" and "Hello faq meta!". There are a lot of comments which aim to show how to save and use postmeta in a block.

The normal block which saves to post_content is in blocks/jsx/postcontent-block.jsx. The block which uses and saves to postmeta is in blocks/jsx/postmeta-block.jsx

I think I've done it so that you can just use the plugin; copy it to your plugins folder and you're good to go.

If you want to edit the blocks, edit the jsx files. These use [the Editable component](https://wordpress.org/gutenberg/handbook/blocks/introducing-attributes-and-editable-fields/). 

To play around with it:
- clone the repo
- run "npm install"
- build using "grunt"
- watch the jsx files with "grunt watch"
