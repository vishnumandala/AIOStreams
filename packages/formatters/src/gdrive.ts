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

  if (!minimalistic && stream.provider) {
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

  if (!minimalistic && stream.torrent?.infoHash) {
    name += `[P2P]\n`;
  }

  if (!minimalistic) {
    name += `${stream.addon.name} `;
  }

  name += `${stream.personal ? '(Your Media) ' : ''}${stream.resolution}`;

  let description: string = '';

  if (stream.quality || stream.encode) {
    description += stream.quality !== 'Unknown' ? `🎥 ${stream.quality} ` : '';
    description += stream.encode !== 'Unknown' ? `🎞️ ${stream.encode} ` : '';
    description += '\n';
  }

  if (stream.visualTags.length > 0 || stream.audioTags.length > 0) {
    description += stream.visualTags.length > 0
      ? `📺 ${stream.visualTags.join(' | ')}   `
      : '';
    description += stream.audioTags.length > 0
      ? `🎧 ${stream.audioTags.join(' | ')}`
      : '';
    description += '\n';
  }

  if (stream.size || (!minimalistic && stream.torrent?.seeders) || stream.duration) {
    description += `📦 ${formatSize(stream.size || 0)} `;
    description += stream.duration ? `⏱️ ${formatDuration(stream.duration)} ` : '';
    description += !minimalistic && stream.torrent?.seeders ? `👥 ${stream.torrent.seeders} ` : '';
    description += '\n';
  }

  if (stream.languages.length !== 0) {
    description += `🔊 ` + stream.languages.map(lang => {
      const emoji = languageToEmoji(lang);
      return `${lang} ${emoji ? emoji : ''}`;
    }).join(' | ');
    description += '\n';
  }

  if (!minimalistic && stream.filename) {
    description += `📄 ${stream.filename}\n`;
  }

  if (!minimalistic && stream.indexers) {
    description += `🔍 ${stream.indexers}\n`;
  }

  if (stream.message) {
    description += `📢 ${stream.message}`;
  }

  description = description.trim();
  name = name.trim();
  return { name, description };
}
