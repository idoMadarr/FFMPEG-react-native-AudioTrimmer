type ExtractUrlConfig = {
  trimExt?: boolean;
  seperatedValues?: boolean;
};

const defaultExtractUrlConfig = {
  trimExt: false,
  seperatedValues: false,
};

export const extractUrlString = (
  path: string,
  config: ExtractUrlConfig = defaultExtractUrlConfig,
) => {
  const splittedPath = path.split('/');
  const filePath = splittedPath[splittedPath.length - 1];
  const [fileName, fileExtension] = filePath.split('.');
  const formattedFileName = fileName.replace(/[^a-zA-Z0-9]/g, '_');

  const file = `${formattedFileName}.${fileExtension}`;

  if (config.seperatedValues)
    return {name: formattedFileName, extension: fileExtension};
  if (config.trimExt) return formattedFileName;
  return file;
};
