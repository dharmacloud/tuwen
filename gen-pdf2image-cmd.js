/* 
	imagemagick create huge temp file ,
	set TMP , TEMP to softPrefect ramdisk for better performance and reduce SSD write*/
	
import {nodefs,meta_cbeta, writeChanged } from 'ptk/nodebundle.cjs'; //ptk/pali
await nodefs;

const fileperbatch=10;  //number of file extract by imagemagick on each invoke
const volperbatch=10;  //each bat file has 10 volumns
const imageformat='png';
const outdir='d:/taisho-png/';

const opts='';//'-gaussian-blur 0.1 -resize 50% -quality 5'; //around 200KB per page

let pvol='';
const gen_cmd=()=>{
    const out=[];
    for (let v in meta_cbeta.MaxPage) {
        const batchcount=Math.floor( meta_cbeta.MaxPage[v]  / fileperbatch ) +1;
        v=v.toString().padStart(2,'0')
        if (pvol && pvol!==v.slice(0,1)) {
            writeChanged( 'taisho-'+pvol+'x.cmd',out.join('\n'),true)
            out.length=0;
        }

        for (let b=0;b<batchcount;b++) {
            const vol='T'+v.padStart(2,'0'), from=b*fileperbatch;
            let to=b*fileperbatch+fileperbatch-1;
            if (to>=meta_cbeta.MaxPage[v]) to=meta_cbeta.MaxPage[v]-1;
            out.push(`@echo ${vol} ${b+1}/${batchcount}`);
            //.cmd escape with double %
            out.push(`@magick convert ${opts} ${vol}.pdf[${from}-${to}] ${outdir}${vol}/%%04d.`+imageformat) 
        }

        pvol=v.slice(0,1);
    }
    writeChanged('taisho-'+pvol+'x.cmd',out.join('\n'),true)
}

gen_cmd();