/**
 * External dependencies
 */
import { isUndefined, pickBy } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Component, RawHTML, Fragment } from '@wordpress/element';
import {
	PanelBody,
	Placeholder,
	QueryControls,
	RangeControl,
	Spinner,
	ToggleControl,
	Toolbar,
	RadioControl,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';
import { dateI18n, format, __experimentalGetSettings } from '@wordpress/date';
import {
	InspectorControls,
	BlockControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';

/**
 * Module Constants
 */
const MAX_POSTS_COLUMNS = 6;

class TestimonialsEdit extends Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		const { attributes, setAttributes, latestPosts } = this.props;
		const { testimonialLayout, columns, order, orderBy, postsToShow } = attributes;

		const inspectorControls = (
			<InspectorControls>
				<PanelBody title={ __( 'Sorting and Filtering' ) }>
					<QueryControls
						{ ...{ order, orderBy } }
						numberOfItems={ postsToShow }
						onOrderChange={ ( value ) => setAttributes( { order: value } ) }
						onOrderByChange={ ( value ) => setAttributes( { orderBy: value } ) }
						onNumberOfItemsChange={ ( value ) => setAttributes( { postsToShow: value } ) }
					/>
					{ testimonialLayout === 'grid' &&
						<RangeControl
							label={ __( 'Columns' ) }
							value={ columns }
							onChange={ ( value ) => setAttributes( { columns: value } ) }
							min={ 2 }
							max={ ! hasPosts ? MAX_POSTS_COLUMNS : Math.min( MAX_POSTS_COLUMNS, latestPosts.length ) }
							required
						/>
					}
				</PanelBody>
			</InspectorControls>
		);

		const hasPosts = Array.isArray( latestPosts ) && latestPosts.length;
		if ( ! hasPosts ) {
			return (
				<Fragment>
					{ inspectorControls }
					<Placeholder
						icon="admin-post"
						label={ __( 'Testimonials' ) }
					>
						{ ! Array.isArray( latestPosts ) ?
							<Spinner /> :
							__( 'No testimonials found.' )
						}
					</Placeholder>
				</Fragment>
			);
		}

		// Removing posts from display should be instant.
		const displayPosts = latestPosts.length > postsToShow ?
			latestPosts.slice( 0, postsToShow ) :
			latestPosts;

		const layoutControls = [
			{
				icon: 'list-view',
				title: __( 'List view' ),
				onClick: () => setAttributes( { testimonialLayout: 'list' } ),
				isActive: testimonialLayout === 'list',
			},
			{
				icon: 'grid-view',
				title: __( 'Grid view' ),
				onClick: () => setAttributes( { testimonialLayout: 'grid' } ),
				isActive: testimonialLayout === 'grid',
			},
		];

		const testimonials = (
			<div
				className={ classnames( this.props.className, {
					'wp-block-bengal-studio-testimonials__list': true,
					'is-grid': testimonialLayout === 'grid',
					[ `columns-${ columns }` ]: testimonialLayout === 'grid',
				} ) }
			>
				{ displayPosts.map( ( post, i ) => {
					const titleTrimmed = post.title.rendered.trim();
					let excerpt = post.excerpt.rendered;
					if ( post.excerpt.raw === '' ) {
						excerpt = post.content.raw;
					}
					const excerptElement = document.createElement( 'div' );
					excerptElement.innerHTML = excerpt;
					excerpt = excerptElement.textContent || excerptElement.innerText || '';
					const featuredImageSrc = post.thumbnail_url || '';
					return (
						<div key={ i } className="wp-block-bengal-studio-testimonial">
							<div className="wp-block-bengal-studio-testimonial__inner">
								<div className="wp-block-bengal-studio-testimonial__media">
									{ featuredImageSrc && (
										<img
											className="wp-block-bengal-studio-testimonial__avatar"
											alt={ __( 'featured' ) }
											src={ featuredImageSrc }
										/>
									) }
									<div className="wp-block-bengal-studio-testimonial__media-body">
										<h4 className="wp-block-bengal-studio-testimonial__name">
											{ titleTrimmed ? (
												<RawHTML>
													{ titleTrimmed }
												</RawHTML>
											) :
												__( '(no title)' )
											}
										</h4>
										<span className="wp-block-bengal-studio-testimonial__position">Company CEO</span>
									</div>
								</div>
								<div className="wp-block-bengal-studio-testimonial__body">
									<RawHTML
										key="html"
									>
										{ post.content.raw.trim() }
									</RawHTML>
								</div>
							</div>
						</div>
					);
				} ) }
			</div>
		);

		return (
			<Fragment>
				{ inspectorControls }
				<BlockControls>
					<Toolbar controls={ layoutControls } />
				</BlockControls>
				{ testimonials }
			</Fragment>
		);
	}
}

export default withSelect( ( select, props ) => {
	const { postsToShow, order, orderBy, categories } = props.attributes;
	const { getEntityRecords } = select( 'core' );
	const latestPostsQuery = pickBy( {
		categories,
		order,
		orderby: orderBy,
		per_page: postsToShow,
	}, ( value ) => ! isUndefined( value ) );
	return {
		latestPosts: getEntityRecords( 'postType', 'jetpack-testimonial', latestPostsQuery ),
	};
} )( TestimonialsEdit );
