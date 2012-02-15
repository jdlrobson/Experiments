<?php

if ( !defined( 'MEDIAWIKI' ) ) {
	die( -1 );
}

class ApplicationTemplate extends MobileFrontendTemplate {

	public function getHTML() {

		if ( $this->data['wgAppleTouchIcon'] !== false ) {
			$appleTouchIconTag = Html::element( 'link', array( 'rel' => 'apple-touch-icon', 'href' => $this->data['wgAppleTouchIcon'] ) );
		} else {
			$appleTouchIconTag = '';
		}

		$zeroRatedBanner = ( isset( $this->data['zeroRatedBanner'] ) ) ? str_replace( 'style="display:none;"', '', $this->data['zeroRatedBanner'] ) : '';

		if ( $zeroRatedBanner ) {
			if ( strstr( $zeroRatedBanner, 'id="zero-rated-banner"><span' ) ) {
				$dismissNotification = ( isset( $this->data['dismissNotification'] )) ? $this->data['dismissNotification'] : ''; 
				$zeroRatedBanner = str_replace( 'id="zero-rated-banner"><span', 'id="zero-rated-banner"><span class="notify-close"><a id="dismiss-notification" title="' . $dismissNotification . '">×</a></span><span', $zeroRatedBanner );
			}
		}

		$betaPrefix = ( $this->data['isBetaGroupMember'] ) ? 'beta_' : '';

		$noticeHtml = ( isset( $this->data['noticeHtml'] ) ) ? $this->data['noticeHtml'] : '';

		$cssFileName = ( isset( $this->data['device']['css_file_name'] ) ) ? $this->data['device']['css_file_name'] : 'default';

		$startScriptTag = '<script type="text/javascript" language="javascript" src="';
		$endScriptTag = '"></script>';
		$javaScriptPath =  $this->data['wgExtensionAssetsPath'] . '/Experiments/javascripts/';

		$openSearchScript = $startScriptTag . $javaScriptPath . $betaPrefix . 'opensearch.js?version=12142011129437' . $endScriptTag;
		$jQueryScript = ( $this->data['device']['supports_jquery'] ) ? $startScriptTag . $javaScriptPath . 'jquery-1.7.1.min.js' . $endScriptTag : '';
		$filePageScript = ( $this->data['isFilePage'] ) ? $startScriptTag . $javaScriptPath . 'filepage.js?version=122920111241' . $endScriptTag : '';

		$startLinkTag = "<link href='{$this->data['wgExtensionAssetsPath']}/Experiments/stylesheets/";
		$endLinkTag = "' media='all' rel='Stylesheet' type='text/css' />";
		$filePageStyle = ( $this->data['isFilePage'] ) ? $startLinkTag . 'filepage.css' . $endLinkTag : '';

		$applicationHtml = <<<HTML
		<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
		"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<html lang='{$this->data['code']}' dir='{$this->data['dir']}' xml:lang='{$this->data['code']}' xmlns='http://www.w3.org/1999/xhtml'>
		  <head>
			<title>{$this->data['htmlTitle']}</title>
			<meta http-equiv="content-type" content="application/xhtml+xml; charset=utf-8" />
			<link href='{$this->data['wgExtensionAssetsPath']}/Experiments/stylesheets/{$betaPrefix}common.css?version=01182012210728' media='all' rel='Stylesheet' type='text/css' />
			<link href='{$this->data['wgExtensionAssetsPath']}/Experiments/stylesheets/{$cssFileName}.css?version=01182012210728' media='all' rel='Stylesheet' type='text/css' />
			<link rel="stylesheet" href="{$this->data['wgExtensionAssetsPath']}/Experiments/leaflet/leaflet.css" /> 
			{$filePageStyle}
			<meta name="ROBOTS" content="NOINDEX, NOFOLLOW" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			{$appleTouchIconTag}
			{$jQueryScript}
			<script type='text/javascript'>
			  //<![CDATA[
				var title = "{$this->data['htmlTitle']}";
				var scriptPath = "{$this->data['wgScriptPath']}";
				var placeholder = "{$this->data['placeholder']}";
			  //]]>
			</script>
		  </head>
		  <body>
			{$zeroRatedBanner}
			{$this->data['searchWebkitHtml']}
			<div class='show' id='content_wrapper'>
				<div id='nearby-overlay' style="display:none">
					<div id="map"></div>
				</div>
			{$noticeHtml}
			{$this->data['contentHtml']}
			</div>
			{$this->data['footerHtml']}
			 {$startScriptTag}{$javaScriptPath}{$betaPrefix}application.js?version=01132011120915{$endScriptTag}
			 {$openSearchScript}
			{$filePageScript}
			<script type='text/javascript' src='{$this->data['wgExtensionAssetsPath']}/Experiments/javascripts/jquery.localize.js'></script>
			<script type='text/javascript' src='{$this->data['wgExtensionAssetsPath']}/Experiments/leaflet/leaflet.js'></script>
			<script type='text/javascript' src='{$this->data['wgExtensionAssetsPath']}/Experiments/javascripts/preferences.js'></script>
			<script type='text/javascript' src='{$this->data['wgExtensionAssetsPath']}/Experiments/javascripts/stub.js'></script>
			<script type='text/javascript' src='{$this->data['wgExtensionAssetsPath']}/Experiments/javascripts/geo.js'></script>
		  </body>
		</html>
HTML;
		return $applicationHtml;
	}
}
