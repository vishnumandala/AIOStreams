import { ParsedStream } from '@aiostreams/types';
import { formatDuration, formatSize, languageToEmoji } from './utils';
import { serviceDetails } from '@aiostreams/utils';

export function gdriveFormat(
  stream: ParsedStream,
  minimalistic: boolean = false
): {
  name: string;
  description: string;
} {
  let name: string = '';

  if (stream.provider) {
    const cacheStatus = stream.provider.cached
      ? '⚡'
      : stream.provider.cached === undefined
        ? '❓'
        : '⏳';
    const serviceShortName =
      serviceDetails.find((service) => service.id === stream.provider!.id)
        ?.shortName || stream.provider.id;
    name += `[${serviceShortName}${cacheStatus}]\n`;
  }

  if (stream.torrent?.infoHash) {
    name += `[P2P]\n`;
  }

  // Only include addon name if not in minimalistic mode.
  if (!minimalistic) {
    name += `${stream.addon.name} ${stream.personal ? '(Your Media) ' : ''}`;
  }
  // Always include the resolution if available.
  name += stream.resolution !== 'Unknown' ? stream.resolution : '';

  let description: string = '';
  if (stream.quality || stream.encode) {
    description += stream.quality !== 'Unknown' ? `🎥 ${stream.quality} ` : '';
    description += stream.encode !== 'Unknown' ? `🎞️ ${stream.encode} ` : '';
    description += '\n';
  }

  if (stream.visualTags.length > 0 || stream.audioTags.length > 0) {
    description +=
      stream.visualTags.length > 0
        ? `📺 ${stream.visualTags.join(' | ')}   `
        : '';
    description +=
      stream.audioTags.length > 0 ? `🎧 ${stream.audioTags.join(' | ')}` : '';
    description += '\n';
  }

  if (
    stream.size ||
    stream.usenet?.age ||
    stream.duration
  ) {
    description += `📦 ${formatSize(stream.size || 0)} `;
    description += stream.duration
      ? `⏱️ ${formatDuration(stream.duration)} `
      : '';
    // Only include seeders if not in minimalistic mode.
    if (!minimalistic && stream.torrent?.seeders !== undefined) {
      description += `👥 ${stream.torrent.seeders} `;
    }
    description += stream.usenet?.age ? `📅 ${stream.usenet.age} ` : '';
    // Only include indexers if not in minimalistic mode.
    if (!minimalistic && stream.indexers) {
      description += `🔍 ${stream.indexers}`;
    }
    description += '\n';
  }

  if (stream.languages.length !== 0) {
    // Display full language names with emoji beside each.
    const languages = stream.languages.map((language) => {
      const emoji = languageToEmoji(language);
      return emoji ? `${language} ${emoji}` : language;
    });
    description += `🔊 ${languages.join(' | ')}`;
    description += '\n';
  }

  // Only include filename if not in minimalistic mode.
  if (!minimalistic && stream.filename) {
    description += stream.filename ? `📄 ${stream.filename}` : '📄 Unknown';
    description += '\n';
  }
  if (stream.message) {
    description += `📢 ${stream.message}`;
  }
  description = description.trim();
  name = name.trim();
  return { name, description };
}
