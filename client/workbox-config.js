module.exports = {
	globDirectory: 'build/',
	globPatterns: [
		'**/*.{png,json,ico,html,txt,css,js,svg}'
	],
	swDest: 'build/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};