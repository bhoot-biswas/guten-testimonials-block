<?php
/**
 * Server-side rendering of the `core/latest-posts` block.
 * @param  [type] $attributes [description]
 * @return [type]             [description]
 */
function testimonials_block_cgb_render_callback( $attributes ) {
	$args = array(
		'posts_per_page'   => $attributes['postsToShow'],
		'post_type'        => 'jetpack-testimonial',
		'post_status'      => 'publish',
		'order'            => $attributes['order'],
		'orderby'          => $attributes['orderBy'],
		'suppress_filters' => false,
	);

	$recent_posts = get_posts( $args );
	ob_start();
	?>
	<div class="wp-block-bengal-studio-testimonials">
		<div class="container">
			<div class="row align-items-center">
				<div class="col-md-4">
					<div class="wp-block-bengal-studio-testimonials__headline">
						<h2>What My Clients Say Sbout My Consultancy Services</h2>
					</div>
				</div>
				<div class="col-md-8">
					<div class="row">
						<?php foreach ( $recent_posts as $post ) : ?>
							<?php
							$title = get_the_title( $post );
							if ( ! $title ) {
								$title = __( '(no title)' );
							}

							$featured_img_url = get_the_post_thumbnail_url( $post->ID, 'thumbnail' );
							?>
							<div class="col-md-6">
								<div class="wp-block-bengal-studio-testimonial">
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
				</div>
			</div>
			<div class="row justify-content-end">
				<div class="col-md-8">
					<div class="wp-block-bengal-studio-testimonial__bottom">
						<a class="btn btn-outline-light" href="#">More Client Success Stories</a>
					</div>
				</div>
			</div>
		</div>
	</div>
	<?php
	return ob_get_clean();
}
