module.exports = str => {
  const regex = /github.com(:|\/)([^/:.]+)\/([^/:.]+)(.git)?$/;
  const results = regex.exec(str);

  if (!results || !results[2] || !results[3]) {
    throw new Error(`Can't extract owner and repo from ${str}`);
  }

  const owner = results[2];
  const repo = results[3];

  return { owner, repo };
};
