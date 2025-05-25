import { CustomFormatter } from '@aiostreams/types'; // Assuming this is where CustomFormatter is defined

// This is the CustomFormatter object you would pass to the customFormat function.
export const v2StyleModifiedFormatter: CustomFormatter = {
  name:
    // Provider status (e.g., [RD⚡], [AD❓]) - conditional on provider existing
    `{provider.id::exists["[{provider.shortName}{provider.cached::istrue["⚡"||(provider.cached::isfalse["⏳"||"❓"])]}] "||""}` +
    // P2P status - conditional on infoHash existing
    `{stream.infoHash::exists["[P2P] "||""}` +
    // Resolution - stream.resolution is null if unknown via convertStreamToParseValue
    `{stream.resolution}` +
    // Personal media tag - conditional
    `{stream.personal::istrue[" (Your Media)"]||""}`,

  description:
    // Line 1: Quality, Encode, Release Group
    `{stream.quality::exists["🎥 {stream.quality} "||""]}{stream.encode::exists["🎞️ {stream.encode} "||""]}{stream.releaseGroup::exists["🏷️ {stream.releaseGroup}"||""]}\\n` +
    // Line 2: Visual Tags, Audio Tags
    `{stream.visualTags::exists["📺 {stream.visualTags::join(' | ')}  "]||""}{stream.audioTags::exists["🎧 {stream.audioTags::join(' | ')}"||""]}\\n` +
    // Line 3: Size, Duration, Age, Indexer (No Seeders)
    // Note: The {stream.size::bytes} modifier's output (GiB vs. GB) depends on your global 'formatSize' function.
    // If you need GB/MB specifically and formatSize provides GiB/MiB, this template alone cannot change that.
    // You would need to adjust the 'formatSize' function itself or add a new modifier.
    `{stream.size::exists["📦 {stream.size::bytes} "||""]}{stream.duration::exists["⏱️ {stream.duration::time} "||""]}{stream.age::exists["📅 {stream.age} "||""]}{stream.indexer::exists["🔍 {stream.indexer}"||""]}\\n` +
    // Line 4: Languages (Raw text, 🌎 prefix from V2 style)
    `{stream.languages::exists["🌎 {stream.languages::join(' | ')}"||""]}\\n` +
    // Line 5: Folder Name
    `{stream.folderName::exists["📁 {stream.folderName}"||""]}\\n` +
    // Line 6: File Name
    `{stream.filename::exists["📄 {stream.filename}"||""]}\\n` +
    // Line 7: Message
    `{stream.message::exists["📢 {stream.message}"||""]}`,
};

// HOW TO USE IT:
// Assuming `stream` is your ParsedStream object and `customFormat` is your function:
//
// import { customFormat } from './your-formatter-file'; // Path to your file with customFormat
//
// const result = customFormat(stream, v2StyleModifiedFormatter);
// console.log('Name:', result.name);
// console.log('Description:', result.description);
