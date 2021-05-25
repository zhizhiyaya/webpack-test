module.exports = function(source) {
	var callback = this.async();
	setTimeout(function() {
		callback(null, source + "----- This is async simple ");
	}, 50);
};