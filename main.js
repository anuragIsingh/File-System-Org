let input = process.argv.slice(2);
let fs = require("fs");
let path = require("path");
// console.log(input);
let command = input[0];
let types = {
    media: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"],
    images: ['jpg', 'png']
}
switch (command) {
    case "tree":
        treefx(input[1]);
        break;
    case "organize":
        organizefx(input[1]);
        break;
    case "help":
        helpfx();
        break;
    default:
        console.log("Bhai Kya kar raha hai tu");
        break;
}

function treefx(dirPath) {
    //let destpath;
    if (dirPath == undefined) {
        // console.log("Kindly enter the correct path");
        treehelper(process.cwd(), "");
        return;
    } else {
        let does = fs.existsSync(dirPath)
        if (does) {
            treehelper(dirPath, "")


        } else {
            console.log("Kindly enter the correct path");
            return;
        }
    }

    console.log("Implemented for tree", dirPath);
}

function treehelper(dirPath, indent) {
    // is file or folder
    let isFile = fs.lstatSync(dirPath).isFile();
    if (isFile == true) {
        let filename = path.basename(dirPath);
        console.log(indent + "├──" + filename)
    } else {
        let dirname = path.basename(dirPath);
        console.log(indent + "└──" + dirname)
        let baccha = fs.readdirSync(dirPath);
        for (let i = 0; i < baccha.length; i++) {
            let bacchapath = path.join(dirPath, baccha[i]);
            treehelper(bacchapath, indent + "\t")
        }
    }
}

function organizefx(dirPath) {
    let destpath;
    if (dirPath == undefined) {
        //console.log("Kindly enter the correct path");
        destpath = process.cwd();
        return;
    } else {
        let does = fs.existsSync(dirPath)
        if (does) {
            destpath = path.join(dirPath, "Organized-files")
            if (fs.existsSync(destpath) == false) {
                fs.mkdirSync(destpath)
            }


        } else {
            console.log("Kindly enter the correct path");
            return;
        }
    }

    organizerhelper(dirPath, destpath)

}

function organizerhelper(src, dest) {
    let childnames = fs.readdirSync(src);
    // console.log(childnames);
    for (let i = 0; i < childnames.length; i++) {
        let childaddress = path.join(src, childnames[i]);
        let isfile = fs.lstatSync(childaddress).isFile();
        if (isfile) {
            let category = getCategory(childnames[i]);
            //console.log(childnames[i], "belongs to -->", category)
            sendFiles(childaddress, dest, category)
        }

    }
}

function getCategory(name) {;;
    let ext = path.extname(name)
    ext = ext.slice(1)
        //console.log(ext)
    for (let type in types) {
        let typear = types[type];
        for (let i = 0; i < typear.length; i++) {
            if (ext == typear[i]) {
                return type;
            }
        }
    }

    return "other types"

}

function sendFiles(srcFilePath, dest, category) {

    let categoryPath = path.join(dest, category);
    if (fs.existsSync(categoryPath) == false) {
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath, fileName);
    fs.copyFileSync(srcFilePath, destFilePath);
    fs.unlinkSync(srcFilePath);
    console.log(fileName, "copied to ", category);

}

function helpfx() {

    console.log(`
    list of all the commands : 
    node main.js tree "directorypath" 
    node main.js organize "directorypath"
    node main.js help "directorypath"`);
}
