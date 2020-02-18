/**
 * determineType - Internal utility function that determines a search type for video, channel, or playlist.
 *
 * @method determineType
 * @param  {string}      type - The user input for type
 * @return {string}             Result type used for web requests.
 */
exports.determineType = type => {
  switch (!0) {
    case type === 'all' : return 'video,channel,playlist';
    case typeof type === 'string' : return type;
  }
  return 'video';
};
