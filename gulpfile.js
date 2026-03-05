import path from 'path';
import fs from 'fs';
import { glob } from 'glob';
import sharp from 'sharp';

export async function Images(done) {
    const srcDir = './static/img';
    const buildDir = './build/img';
    const images =  await glob('./static/img/**/*{jpg,png,svg,gif}')

    images.forEach(file => {
        const relativePath = path.relative(srcDir, path.dirname(file));
        const outputSubDir = path.join(buildDir, relativePath);
        processImage(file, outputSubDir);
    });
    done();
}

function processImage(file, outputSubDir){

    if (!fs.existsSync(outputSubDir)){
        fs.mkdirSync(outputSubDir, {recursive: true})
    }

    const baseName = path.basename(file, path.extname(file))
    const extName = path.extname(file)
    console.log(extName)
    const outputFile = path.join(outputSubDir, `${baseName}${extName}`)
    const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`)
    const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`)
    const outputFileGif = path.join(outputSubDir, `${baseName}.gif`)


    const options = { quality: 50}
    if (extName === ".png"){
        sharp(file).png(options).toFile(outputFile)
    } else if (extName === ".svg"){
        fs.copyFileSync(file, outputFile);
    } else if (extName === ".gif") {
        sharp(file, { animated: true }).gif(options).toFile(outputFileGif);

    }
    else {
        sharp(file).jpeg(options).toFile(outputFile)
    } 

    if (extName !== ".svg" && extName !== ".gif") {
        sharp(file).webp(options).toFile(outputFileWebp)
        sharp(file).avif().toFile(outputFileAvif)
    }
}