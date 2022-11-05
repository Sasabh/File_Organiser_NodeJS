const {
  existsSync,
  mkdirSync,
  readdirSync,
  lstatSync,
  copyFileSync,
  unlinkSync,
} = require("fs");
const path = require("path");

const imageTypes = ["jpg", "jpeg", "png", "webp", "svg", "gif"];
const videoTypes = ["mp4", "mkv", "flv"];
const archiveTypes = ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"];
const documentTypes = [
  "docx",
  "doc",
  "pdf",
  "xlsx",
  "xls",
  "odt",
  "ods",
  "odp",
  "odg",
  "odf",
  "txt",
  "ps",
  "tex",
];
const appTypes = ["exe", "dmg", "pkg", "deb"];

(() => {
  console.log("Ran");
  Object.freeze(imageTypes);
  Object.freeze(videoTypes);
  Object.freeze(archiveTypes);
  Object.freeze(documentTypes);
  Object.freeze(appTypes);
})();

const showfileTreeFn = (pathVar = "") => {
  console.log("ShowfileTreeFn Funtion Called!", pathVar);

  // Path Validity
  let testPathValidity = /^(\w+\/?)+$/.test(pathVar);
  let testPathValidityWin =
    /[a-zA-Z]:[\\\/](?:[a-zA-Z0-9]+[\\\/])*([a-zA-Z0-9])+/gm.test(pathVar);
  let pathExist = existsSync(pathVar);
  if (pathVar && (testPathValidity || testPathValidityWin) && pathExist) {
    console.log("Path Exists");
  } else {
    console.log(`Please enter valid File Path.`);
    return;
  }
  printTree(pathVar, `\t`);
};

const printTree = (pathVar, indent) => {
  let isFile = lstatSync(pathVar).isFile();
  if (isFile) {
    let fileName = path.basename(pathVar);
    console.log(indent + `├──` + fileName);
  } else {
    let directoryName = path.basename(pathVar);
    console.log(indent + `└──` + directoryName);
    let children = readdirSync(pathVar);
    children.forEach((element) => {
      let childPath = path.join(pathVar, element);
      printTree(childPath, indent + `\t`);
    });
  }
};

const organiseFn = (pathVar = "", isCut) => {
  console.log("OrganiseFn Funtion Called!", pathVar);
  /* 
        1.  If organisedFiles Folder doesn't exist => Create Directory for the organsied File (Organised Files)
        2.  If organisedFiles Folder exists => Change name or filter in the available directory
    */
  let testPathValidity = /^(\w+\/?)+$/.test(pathVar);
  let testPathValidityWin =
    /[a-zA-Z]:[\\\/](?:[a-zA-Z0-9]+[\\\/])*([a-zA-Z0-9])+/gm.test(pathVar);
  let newfolderPath = path.join(pathVar, "Organised_Files");
  if (
    pathVar &&
    (testPathValidity || testPathValidityWin) &&
    existsSync(pathVar) &&
    !existsSync(newfolderPath)
  ) {
    mkdirSync(newfolderPath);
  } else if (existsSync(newfolderPath)) {
    console.log(
      `Organised_Files Folder already exists and thus organsing in the same folder`
    );
  } else {
    console.log(`Please enter valid File Path.`);
    return;
  }

  //3.  Identify all the files in the given path
  //4.  Match File types of available types and list them
  //5.  Create folder of various types in the main Directory (image) (video) (archive) (document) (app)
  let childFileFolder = readdirSync(pathVar);

  childFileFolder.forEach((element) => {
    let childAddr = path.join(pathVar, element);
    let isFile = lstatSync(childAddr).isFile();
    if (isFile) {
      sendFile(childAddr, newfolderPath, getFileCategory(element), isCut);
    }
  });
};

const getFileCategory = (fileName) => {
  let dotExtension = path.extname(fileName);
  dotExtension = dotExtension.slice(1);
  let type = "other";
  imageTypes.forEach((x) => {
    if (dotExtension === x) {
      type = "image";
    }
  });
  videoTypes.forEach((x) => {
    if (dotExtension === x) {
      type = "video";
    }
  });
  documentTypes.forEach((x) => {
    if (dotExtension === x) {
      type = "document";
    }
  });
  archiveTypes.forEach((x) => {
    if (dotExtension === x) {
      type = "archive";
    }
  });
  appTypes.forEach((x) => {
    if (dotExtension === x) {
      type = "app";
    }
  });
  return type;
};

const sendFile = (srcFilePath, destination, category, isCut) => {
  //Cut/Copy File to Destination
  let categoryPath = path.join(destination, category + "s");
  if (!existsSync(categoryPath)) {
    mkdirSync(categoryPath);
  }
  let fileName = path.basename(srcFilePath);
  let destinationPath = path.join(categoryPath, fileName);
  copyFileSync(srcFilePath, destinationPath);
  isCut ? unlinkSync(srcFilePath) : null;
  console.log(fileName, `: File ${isCut ? "Transferred" : "Copied"}`);
};

const helpFn = () => {
  console.log(`Available Commands:
    node organiseMyFiles show_file_tree <folder path>
    node organiseMyFiles organize_files <folder path> - For Copy/Paste
    node organiseMyFiles organize_files <folder path> cut - For Cut/Paste
    node organiseMyFiles help
    `);
};

module.exports = { showfileTreeFn, organiseFn, helpFn };
