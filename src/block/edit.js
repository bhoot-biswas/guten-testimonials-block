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
} from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';

/**
 * Module Constants
 */
const CATEGORIES_LIST_QUERY = {
	per_page: -1,
};
const MAX_POSTS_COLUMNS = 6;

class TestimonialsEdit extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			categoriesList: [],
		};
	}

	componentDidMount() {
		this.isStillMounted = true;
		this.fetchRequest = apiFetch( {
			path: addQueryArgs( `/wp/v2/categories`, CATEGORIES_LIST_QUERY ),
		} ).then(
			( categoriesList ) => {
				if ( this.isStillMounted ) {
					this.setState( { categoriesList } );
				}
			}
		).catch(
			() => {
				if ( this.isStillMounted ) {
					this.setState( { categoriesList: [] } );
				}
			}
		);
	}

	componentWillUnmount() {
		this.isStillMounted = false;
	}

	render() {
		const { attributes, setAttributes, latestPosts } = this.props;
		const { categoriesList } = this.state;
		const { displayPostContentRadio, displayPostContent, displayPostDate, postLayout, columns, order, orderBy, categories, postsToShow, excerptLength } = attributes;

		const inspectorControls = (
			<InspectorControls>
				<PanelBody title={ __( 'Post Content Settings' ) }>
					<ToggleControl
						label={ __( 'Post Content' ) }
						checked={ displayPostContent }
						onChange={ ( value ) => setAttributes( { displayPostContent: value } ) }
					/>
					{ displayPostContent &&
					<RadioControl
						label="Show:"
						selected={ displayPostContentRadio }
						options={ [
							{ label: 'Excerpt', value: 'excerpt' },
							{ label: 'Full Post', value: 'full_post' },
						] }
						onChange={ ( value ) => setAttributes( { displayPostContentRadio: value } ) }
					/>
					}
					{ displayPostContent && displayPostContentRadio === 'excerpt' &&
						<RangeControl
							label={ __( 'Max number of words in excerpt' ) }
							value={ excerptLength }
							onChange={ ( value ) => setAttributes( { excerptLength: value } ) }
							min={ 10 }
							max={ 100 }
						/>
					}
				</PanelBody>

				<PanelBody title={ __( 'Post Meta Settings' ) }>
					<ToggleControl
						label={ __( 'Display post date' ) }
						checked={ displayPostDate }
						onChange={ ( value ) => setAttributes( { displayPostDate: value } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Sorting and Filtering' ) }>
					<QueryControls
						{ ...{ order, orderBy } }
						numberOfItems={ postsToShow }
						categoriesList={ categoriesList }
						selectedCategoryId={ categories }
						onOrderChange={ ( value ) => setAttributes( { order: value } ) }
						onOrderByChange={ ( value ) => setAttributes( { orderBy: value } ) }
						onCategoryChange={ ( value ) => setAttributes( { categories: '' !== value ? value : undefined } ) }
						onNumberOfItemsChange={ ( value ) => setAttributes( { postsToShow: value } ) }
					/>
					{ postLayout === 'grid' &&
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
						label={ __( 'Latest Posts' ) }
					>
						{ ! Array.isArray( latestPosts ) ?
							<Spinner /> :
							__( 'No posts found.' )
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
				onClick: () => setAttributes( { postLayout: 'list' } ),
				isActive: postLayout === 'list',
			},
			{
				icon: 'grid-view',
				title: __( 'Grid view' ),
				onClick: () => setAttributes( { postLayout: 'grid' } ),
				isActive: postLayout === 'grid',
			},
		];

		const dateFormat = __experimentalGetSettings().formats.date;

		return (
			<Fragment>
				{ inspectorControls }
				<BlockControls>
					<Toolbar controls={ layoutControls } />
				</BlockControls>
				<ul
					className={ classnames( this.props.className, {
						'wp-block-latest-posts__list': true,
						'is-grid': postLayout === 'grid',
						'has-dates': displayPostDate,
						[ `columns-${ columns }` ]: postLayout === 'grid',
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
						console.log(post.featured_image_urls);
						return (
							<div key={ i } className="wp-block-bengal-studio-testimonial">
								<div className="wp-block-bengal-studio-testimonial__media">
									{ featuredImageSrc && (
										<img
											className="wp-block-bengal-studio-testimonial__avatar"
											alt={ __( 'featured' ) }
											src={ featuredImageSrc }
										/>
									) }
									<div className="wp-block-bengal-studio-testimonial__media-body">
										<div className="wp-block-bengal-studio-testimonial__meta">
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
										<div className="wp-block-bengal-studio-testimonial__body">
											<RawHTML
												key="html"
											>
												{ post.content.raw.trim() }
											</RawHTML>
										</div>
									</div>
								</div>
							</div>
						);
					} ) }
				</ul>
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
