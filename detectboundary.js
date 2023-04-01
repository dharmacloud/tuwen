import {nodefs, filesFromPattern, readTextLines, writeChanged, meta_cbeta} from 'ptk/nodebundle.cjs'; //ptk/pali
await nodefs;
import {getPNGBoundary} from './src/boundary.js'
const cor=parseInt(process.argv[2])||1 ;
const rootdir="/taisho-png/";
const pagecount=meta_cbeta.MaxPage[cor]
const pngdir=rootdir+'T'+cor.toString().padStart(2,'0')+'/';
console.log('find boundary',pngdir);
const files=filesFromPattern('*.png',pngdir);
const out=[];
for (let i=0;i<files.length;i++) {
    const boundary= await getPNGBoundary(pngdir+files[i]);
    process.stdout.write("\r"+ files[i]+"  "+JSON.stringify(boundary)+"      ");
    out.push(  files[i]+ '\t'+(boundary.left||0)+'\t'+( boundary.top||0 ) );
}

writeChanged('T'+cor.toString().padStart(2,'0')+'-boundary.tsv',out.join('\n'),true)
