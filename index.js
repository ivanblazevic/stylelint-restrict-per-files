// Abbreviated example
var stylelint = require("stylelint");
var isColor = require("is-color");

var ruleName = "restrict/color-variables-per-files";
var messages = stylelint.utils.ruleMessages(ruleName, {
  expected: "Expected ..."
});

module.exports = stylelint.createPlugin(ruleName, function(
  primaryOption,
  secondaryOptionObject
) {
  return function(postcssRoot, postcssResult) {
    var validOptions = stylelint.utils.validateOptions(
      postcssResult,
      ruleName,
      primaryOption
    );

    if (!validOptions) {
      return;
    }

    const fileName = postcssRoot.source.input.file;
    const css = postcssRoot.source.input.css;

    // Find variables only inside the files that are not allowed to have them
    if (!primaryOption.files.some(f => fileName.indexOf(f) > -1)) {
      const regex = /\$.*:.*;/gm;
      let m;
      let counter = 0;
      while ((m = regex.exec(css)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
          let onlyValue = match.replace(/\$.*: /gm, "").replace(";", "");
          if (isColor(onlyValue)) {
            counter++;
          }
        });
      }

      if (counter > 0) {
        stylelint.utils.report({
          message:
            "Variables can only be defined in " +
            primaryOption.files +
            ", found " +
            counter +
            " variables.",
          ruleName: ruleName,
          result: postcssResult,
          node: postcssRoot
        });
      }
    }
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
