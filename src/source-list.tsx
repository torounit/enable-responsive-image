/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import {
	Button,
	PanelBody,
	// @ts-ignore: has no exported member
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { MediaUploadCheck } from '@wordpress/block-editor';
import type { BlockEditProps } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import SourceEditor from './source-editor';
import type { BlockAttributes, Source } from './types';
import { MAX_SOURCES } from './constants';

export default function ImageList( props: BlockEditProps< BlockAttributes > ) {
	const { attributes, setAttributes } = props;
	const { sources } = attributes;

	function onChange( newSource: Source, index: number ) {
		const newSources = [ ...sources ];
		newSources[ index ] = newSource;
		setAttributes( { sources: newSources } );
	}

	function onAddSource() {
		const newSources = [ ...sources ];
		newSources.push( {
			srcset: undefined,
			id: undefined,
			slug: undefined,
			mediaType: undefined,
			mediaValue: undefined,
		} );
		setAttributes( { sources: newSources } );
	}

	function onChangeOrder( direction: number, index: number ) {
		const newSources = [ ...sources ];
		const newIndex = index + direction;
		const movedSource = newSources.splice( index, 1 )[ 0 ];
		newSources.splice( newIndex, 0, movedSource );
		setAttributes( { sources: newSources } );
	}

	function onRemoveSource( index: number ) {
		const newSources = [ ...sources ];
		newSources.splice( index, 1 );
		setAttributes( { sources: newSources } );
	}

	return (
		<PanelBody
			title={ __( 'Image sources', 'enable-responsive-image' ) }
			className="enable-responsive-image"
		>
			<MediaUploadCheck
				fallback={
					<p>
						{ __(
							'To edit the image, you need permission to upload media.',
							'enable-responsive-image'
						) }
					</p>
				}
			>
				<VStack>
					{ sources.length > 0 ? (
						<>
							{ sources.map( ( source, index ) => (
								<Fragment key={ index }>
									<SourceEditor
										{ ...props }
										disableMoveUp={ index === 0 }
										disableMoveDown={ index === sources.length - 1 }
										disableActions={
											sources.length === 1 && ! sources[ 0 ].id && ! sources[ 0 ].srcset
										}
										source={ source }
										onChangeOrder={ ( direction ) => onChangeOrder( direction, index ) }
										onChange={ ( newSource ) => onChange( newSource, index ) }
										onRemove={ () => onRemoveSource( index ) }
									/>
									{ index < sources.length - 1 && <hr /> }
								</Fragment>
							) ) }
							{ ( sources.length > 1 ||
								( sources.length === 1 && sources[ 0 ].id ) ||
								sources[ 0 ].srcset ) && (
								<>
									<hr />
									<Button
										variant="primary"
										className="enable-responsive-image__add-source"
										disabled={ sources.length >= MAX_SOURCES }
										onClick={ onAddSource }
									>
										{ __( 'Add image source', 'enable-responsive-image' ) }
									</Button>
								</>
							) }
						</>
					) : (
						<SourceEditor
							{ ...props }
							disableMoveUp={ true }
							disableMoveDown={ true }
							disableActions={ true }
							onChange={ ( newSource ) => onChange( newSource, 0 ) }
							onRemove={ () => onRemoveSource( 0 ) }
						/>
					) }
				</VStack>
			</MediaUploadCheck>
		</PanelBody>
	);
}
