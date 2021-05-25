module.exports = function(source) {
	return source + "---- This is pitch simple ";
};

exports.pitch = function(remainingRequest, previousRequest, data) {
	return [
		remainingRequest,
		previousRequest
	].join(": ");
};