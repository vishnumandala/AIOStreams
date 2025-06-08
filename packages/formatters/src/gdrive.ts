import { ParsedStream } from '@aiostreams/types';
import { formatDuration, formatSize, languageToEmoji } from './utils'; // Assuming these are in './utils'
import { serviceDetails, Settings } from '@aiostreams/utils'; // Assuming these are in '@aiostreams/utils'

/**
 *
 * The custom formatter code in this file was adapted from https://github.com/diced/zipline/blob/trunk/src/lib/parser/index.ts
 *
 * The original code is licensed under the MIT License.
 *
 * MIT License
 *
 * Copyright (c) 2023 dicedtomato
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export function gdriveFormat(
  stream: ParsedStream,
  minimalistic: boolean = false
): {
  name: string;
  description: string;
} {
  let name: string = '';

  // --- NAME CONSTRUCTION ---

  if (stream.provider) {
    const cacheStatus = stream.provider.cached
      ? '⚡'
      : stream.provider.cached === undefined
        ? '❓'
        : '⏳';
    const serviceShortName =
      serviceDetails.find((service) => service.id === stream.provider!.id)
        ?.shortName || stream.provider.id;
    name += `[${serviceShortName}${cacheStatus}] `;
  }

  if (stream.torrent?.infoHash) {
    name += `[P2P] `;
  }

  if (!minimalistic) {
    // Non-minimalistic: Addon name and then resolution
    name += `${stream.addon.name} ${stream.personal ? '(Your Media) ' : ''}`;
    name += stream.resolution !== 'Unknown' ? stream.resolution : ''; // Add resolution if known
  } else {
    // Minimalistic: Addon name is OMITTED. Add resolution directly if known.
    name += stream.resolution !== 'Unknown' ? stream.resolution : '';
  }

  let description: string = '';

  // --- DESCRIPTION CONSTRUCTION ---

  // Quality, Encode, Release Group (Release group only if not minimalistic)
  if (
    stream.quality ||
    stream.encode ||
    (stream.releaseGroup && !minimalistic)
  ) {
    description += stream.quality !== 'Unknown' ? `🎥 ${stream.quality} ` : '';
    description += stream.encode !== 'Unknown' ? `🎞️ ${stream.encode} ` : '';
    description +=
      stream.releaseGroup !== 'Unknown' && !minimalistic
        ? `🏷️ ${stream.releaseGroup}`
        : '';
    description += '\n';
  }

  // Visual and Audio Tags
  if (stream.visualTags.length > 0 || stream.audioTags.length > 0) {
    description +=
      stream.visualTags.length > 0
        ? `📺 ${stream.visualTags.join(' | ')}  ` // Two spaces for V2 style
        : '';
    description +=
      stream.audioTags.length > 0 ? `🎧 ${stream.audioTags.join(' | ')}` : '';
    description += '\n';
  }

  // Size, Duration, Seeders (conditional), Age, Indexers (conditional)
  if (
    stream.size ||
    (stream.torrent?.seeders && !minimalistic) || // Seeders only if NOT minimalistic
    stream.usenet?.age ||
    stream.duration
  ) {
    // MODIFIED: Convert GiB/MiB to GB/MB for size
    const formattedSize = formatSize(stream.size || 0)
      .replace('GiB', 'GB')
      .replace('MiB', 'MB');
    description += `📦 ${formattedSize} `;

    description += stream.duration
      ? `⏱️ ${formatDuration(stream.duration)} `
      : '';

    // MODIFIED: Seeders are only shown if NOT minimalistic
    if (stream.torrent?.seeders !== undefined && !minimalistic) {
      description += `👥 ${stream.torrent.seeders} `;
    }

    description += stream.usenet?.age ? `📅 ${stream.usenet.age} ` : '';
    
    if (stream.indexers && !minimalistic) { // Indexers only if NOT minimalistic
        description += `🔍 ${stream.indexers}`;
    }
    description += '\n';
  }

  // Languages
  if (stream.languages.length !== 0) {
    let languagesOutput = stream.languages;
    if (minimalistic) {
      // MODIFIED: For minimalistic, use raw language text, not emojis
      // `languagesOutput` is already the raw text array.
    } else {
      // Non-minimalistic: use emojis
      languagesOutput = stream.languages.map(
        (language) => languageToEmoji(language) || language
      );
    }
    // Use 🌎 prefix. Separator changes based on minimalistic flag.
    description += `🌎 ${languagesOutput.join(minimalistic ? ' / ' : ' | ')}`;
    description += '\n';
  }

  // Filename and FolderName (only if not minimalistic)
  if (!minimalistic && (stream.filename || stream.folderName)) {
    description += stream.folderName ? `📁 ${stream.folderName}\n` : '';
    description += stream.filename ? `📄 ${stream.filename}\n` : '📄 Unknown\n';
  }

  // Message
  if (stream.message) {
    description += `📢 ${stream.message}`;
  }

  // MODIFIED: Leading emoji for name only if NOT minimalistic
  if (stream.proxied) {
    name = `🕵️‍♂️ ${name}`;
  } else if (Settings.SHOW_DIE) {
    name = `🎲 ${name}`;
  }

  description = description.trim();
  name = name.trim(); // Trim name at the end to handle potential leading/trailing spaces
  return { name, description };
}
