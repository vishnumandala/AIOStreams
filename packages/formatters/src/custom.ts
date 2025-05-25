import { CustomFormatter } from '@aiostreams/types'; // Assuming this is where CustomFormatter is defined

export const revisedV2MinimalModifiedFormatter: CustomFormatter = {
  name:
    // Provider status (e.g., [RD⚡]) - conditional, with a trailing space if it exists.
    `{provider.id::exists["[{provider.shortName}{provider.cached::istrue["⚡"||(provider.cached::isfalse["⏳"||"❓"])]}] "||""}` +
    // P2P status - conditional, with a trailing space if it exists.
    `{stream.infoHash::exists["[P2P] "||""}` +
    // Resolution
    `{stream.resolution}`,

  description:
    // Line 1: Quality, Encode
    `{stream.quality::exists["🎥 {stream.quality} "||""]}{stream.encode::exists["🎞️ {stream.encode}"||""]}\\n` +
    // Line 2: Visual Tags, Audio Tags (3 spaces between groups if both visual and audio parts render)
    // The line.trim() in parseString will handle trailing spaces if only visual tags are present.
    `{stream.visualTags::exists["📺 {stream.visualTags::join(' | ')}   "]||""}{stream.audioTags::exists["🎧 {stream.audioTags::join(' | ')}"||""]}\\n` +
    // Line 3: Size, Duration, Age (No Seeders)
    // Note: {stream.size::bytes} unit display (GB vs GiB) still depends on your global 'formatSize' utility.
    `{stream.size::exists["📦 {stream.size::bytes} "||""]}{stream.duration::exists["⏱️ {stream.duration::time} "||""]}{stream.age::exists["📅 {stream.age}"||""]}\\n` +
    // Line 4: Languages (Raw text, 🌎 prefix, ' / ' separator)
    `{stream.languages::exists["🌎 {stream.languages::join(' / ')}"||""]}\\n` +
    // Line 5: Message (if present)
    `{stream.message::exists["📢 {stream.message}"||""]}`,
};

// HOW TO USE IT:
// const result = customFormat(stream, revisedV2MinimalModifiedFormatter);
// console.log('Name:', result.name.trim()); // Use .trim() on the final name
// console.log('Description:', result.description);
