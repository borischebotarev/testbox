let transcript_full = '';
// Initialize or retrieve the existing JSON data from a variable
var json_log_data = [];

function get_current_ts() {
  const now = new Date();
  return now.toISOString().replace(/:/g, '-'); // Returns the timestamp in ISO 8601 format with colons replaced by dashes
}

function log_to_transcript(text) {
  const timestamp = get_current_ts();
  const logEntry = `[${timestamp}] ${text}\n`;
  transcript_full += logEntry;
}

// Function to append new data to the JSON variable
function append_to_json(new_data) {
  // Append the new data to the existing JSON
  json_log_data.push(new_data);
}