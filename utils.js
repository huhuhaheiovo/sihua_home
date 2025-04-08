

/**
 * Given a time in seconds, return a string in the format MM:SS.
 */
export function formatTime(time) {
  if (time === -1) {
    return '00:00';
  }

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

/**
 * Get today's date and time, formatted as YYYY-MM-DD HH:MM:SS.
 */
export function getFormattedDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const hour = today.getHours();
  const minute = today.getMinutes();
  const seconds = today.getSeconds();
  return `${year}-${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day} ${hour < 10 ? "0" : ""}${hour}:${minute < 10 ? "0" : ""}${minute}:${seconds < 10 ? "0" : ""}${seconds}`;
}

/**
 * Get a somewhat unique ID.
 */
export function getUniqueId() {
  let id = '';
  id += 'abcdefghijklmnopqrstuvwxyz'.split('')[Math.floor(Math.random() * 26)];
  id += 'abcdefghijklmnopqrstuvwxyz'.split('')[Math.floor(Math.random() * 26)];
  id += '0123456789'.split('')[Math.floor(Math.random() * 10)];
  id += '0123456789'.split('')[Math.floor(Math.random() * 10)];
  return id += Date.now();
}



function legacyOpenFilesFromDisk() {
  // Create an input type file element.
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.accept = [...AUDIO_EXT, ...AUDIO_MIME].join(',');

  // Simulate a click on the input element.
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  input.dispatchEvent(event);

  // Wait for the file to be selected.
  return new Promise((resolve) => {
    input.onchange = (event) => {
      resolve(event.target.files);
    }
  });
}

/**
 * Given a string with at least one dot and some text after it, return the part between
 * the start of the string and the last dot.
 */
function getFileNameWithoutExtension(fileName) {
  return fileName.split('.').slice(0, -1).join('.');
}

export function getSongNameFromURL(url) {
  const parsed = new URL(url);
  let name = parsed.pathname.substring(parsed.pathname.lastIndexOf('/') + 1, parsed.pathname.lastIndexOf('.'));
  return decodeURI(name);
}

function guessSongInfoFromString(str) {
  // Test for the following pattern: 04 - artist - title
  const match = str.match(/[0-9]+\s*-\s*([^-]+)\s*-\s*(.+)/);
  if (match && match.length === 3) {
    return {
      artist: match[1],
      title: match[2]
    }
  }

  return { title: str };
}

