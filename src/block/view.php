<?php
/**
 * Server-side rendering of the `core/latest-posts` block.
 * @param  [type] $attributes [description]
 * @return [type]             [description]
 */
function testimonials_block_cgb_render_callback( $attributes, $content ) {
	$testimonials = testimonials_block_cgb_testimonials( $attributes );
	if ( isset( $attributes['align'] ) && 'full' === $attributes['align'] ) {
		return testimonials_block_cgb_testimonials_wrapper(
			[
				'testimonials' => $testimonials,
				'content'      => $content,
			]
		);
	}

	return $testimonials;

}

/**
 * [testimonials_block_cgb_testimonials_wrapper description]
 * @param  array  $args [description]
 * @return [type]       [description]
 */
function testimonials_block_cgb_testimonials_wrapper( $args = [] ) {
	ob_start();
	?>
	<div class="wp-block-bengal-studio-testimonials__wrapper">
		<div class="container">
			<div class="wp-block-bengal-studio-testimonials__wrapper-inner">
				<div class="wp-block-bengal-studio-testimonials__wrapper-left">
					<?php echo $args['content']; ?>
				</div>
				<div class="wp-block-bengal-studio-testimonials__wrapper-right">
					<?php echo $args['testimonials']; ?>
				</div>
			</div>

			<div class="wp-block-bengal-studio-testimonials__wrapper-bottom">
				<div class="wp-block-bengal-studio-testimonials__wrapper-bottom-inner">
					<a class="btn btn-outline-light" href="#">More Client Success Stories</a>
				</div>
			</div>
		</div>
	</div>
	<?php
	return ob_get_clean();
}

/**
 * [testimonials_block_cgb_testimonials description]
 * @param  [type] $args [description]
 * @return [type]       [description]
 */
function testimonials_block_cgb_testimonials( $args = [] ) {
	$defaults = [];
	// Parse incoming $args into an array and merge it with $defaults
	$args = wp_parse_args( $args, $defaults );

	$recent_posts = get_posts(
		[
			'post_type'        => 'jetpack-testimonial',
			'post_status'      => 'publish',
			'posts_per_page'   => $args['postsToShow'],
			'order'            => $args['order'],
			'orderby'          => $args['orderBy'],
			'suppress_filters' => false,
		]
	);

	$class = 'wp-block-bengal-studio-testimonials__list';
	if ( isset( $args['testimonialLayout'] ) && 'grid' === $args['testimonialLayout'] ) {
		$class .= ' is-grid';
	}

	if ( isset( $args['columns'] ) && 'grid' === $args['testimonialLayout'] ) {
		$class .= ' columns-' . $args['columns'];
	}
	ob_start();
	?>
	<div class="<?php echo $class; ?>">
		<?php foreach ( $recent_posts as $post ) : ?>
			<?php
			$title = get_the_title( $post );
			if ( ! $title ) {
				$title = __( '(no title)' );
			}

			$featured_img_url = get_the_post_thumbnail_url( $post->ID, 'thumbnail' );
			?>
			<div class="wp-block-bengal-studio-testimonial">
				<div class="wp-block-bengal-studio-testimonial__inner">
					<div class="wp-block-bengal-studio-testimonial__media">
						<?php if ( $featured_img_url ) : ?>
							<img class="wp-block-bengal-studio-testimonial__avatar" src="<?php echo $featured_img_url; ?>" alt="">
						<?php endif; ?>
						<div class="wp-block-bengal-studio-testimonial__media-body">
							<div class="wp-block-bengal-studio-testimonial__meta">
								<h4 class="wp-block-bengal-studio-testimonial__name"><?php echo $title; ?></h4>
								<span class="wp-block-bengal-studio-testimonial__position">Company CEO</span>
							</div>
							<div class="wp-block-bengal-studio-testimonial__body">
								<?php echo wp_kses_post( html_entity_decode( $post->post_content, ENT_QUOTES, get_option( 'blog_charset' ) ) ); ?>
							</div>
						</div>
					</div>
				</div>
			</div>
		<?php endforeach; ?>
	</div>
	<?php
	return ob_get_clean();
}
