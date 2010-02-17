require.paths.unshift("./spec/lib", "./lib");
require("jspec");

log4js = require("log4js-node");

var sys = require("sys"), fs = require("fs");

quit = process.exit
print = sys.puts

readFile = function(path) {
  var result;
  try {
    fs
      .cat(path)
      .addCallback(
        function(contents){ result = contents; }
      ).wait();
  } catch (e) {
    throw e;
  }
  return result;
}

var specsFound = false;

if (process.ARGV[2]) {
  specsFound = true;
  JSpec.exec('spec/spec.' + process.ARGV[2] + '.js');
} else {
  var files;
  fs
    .readdir('spec/')
    .addCallback(
      function(dirFiles) { files = dirFiles; }
    ).wait();
  
  files.filter(
    function (file) { 
      return file.indexOf('spec.') === 0; 
    }
  ).forEach(
    function(file) {
        specsFound = true;
        JSpec.exec('spec/'+file);
      }
  );
}
if (specsFound) {
  JSpec.run({ reporter: JSpec.reporters.Terminal });
  JSpec.report();
} else {
  print("No tests to run. This makes me sad.");
}

