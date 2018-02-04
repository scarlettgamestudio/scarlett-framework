module.exports = addonsArg => {
  let addons = [].concat.apply([], [addonsArg]).filter(Boolean);

  return addons.map(addonName => require(`./webpack.${addonName}.js`));
};
