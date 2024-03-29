/**
 * WordPress dependencies
 */
import {
	__
} from '@wordpress/i18n';
import {
	registerBlockType
} from '@wordpress/blocks';
import {
	InnerBlocks,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import icon from './icon';
import edit from './edit';

//  Import CSS.
import './editor.scss';
import './style.scss';

/**
 * Register: a Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType('bengal-studio/testimonials', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __('testimonials-block - Gutenberg Block'), // Block title.
	description: __('The Testimonial Block lets you easily share your social proof by letting your site visitors know what other people say about you.'),
	icon, // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'widgets', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__('testimonials-block — Gutenberg Testimonials'),
		__('create-guten-block'),
	],
	edit,
	save: () => null,
});
