import {nodefs,writeChanged,parseXMLAttribute,peelXML,
    patchBuf,meta_cbeta,
    readTextContent, readTextLines,entity2unicode } from 'ptk/nodebundle.cjs'; //ptk/pali
await nodefs;

const volperbatch=10;

let pvol='';
const show=()=>{
    const out=[];
    for (let v in meta_cbeta.MaxPage) {
        const batchcount=Math.floor( meta_cbeta.MaxPage[v]  / 100) +1;
        v=v.toString().padStart(2,'0')
        if (pvol && pvol!==v.slice(0,1)) {
            writeChanged( 'taisho-'+pvol+'x.cmd',out.join('\n'),true)
            out.length=0;
        }

        for (let b=0;b<batchcount;b++) {
            const vol='T'+v.padStart(2,'0'), from=b*100;
            let to=b*100+99;
            if (to>=meta_cbeta.MaxPage[v]) to=meta_cbeta.MaxPage[v]-1;
            const opts='-gaussian-blur 0.1 -resize 50% -quality 5';
            out.push(`@echo ${vol} ${b+1}/${batchcount}`);
            out.push(`@magick convert  ${opts} ${vol}.pdf[${from}-${to}] ${vol}/%04d.jpg`) 
        }

        pvol=v.slice(0,1);
    }
    writeChanged('taisho-'+pvol+'x.cmd',out.join('\n'),true)
}

show()