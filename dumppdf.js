import pdfjsLib from 'pdfjs-dist'
import {createCanvas} from 'canvas'
import fs from 'fs'

const srcdir='e:/taisho-pdf/'
const outdir='e:/taisho-png/'

const renderPage=async (page,i,vol)=>{
  let viewport = page.getViewport({ scale: 1 });
  const canvas = createCanvas(viewport.width, viewport.height);
  let context = canvas.getContext('2d');
  canvas.width = Math.floor(viewport.width * outputScale);
  canvas.height = Math.floor(viewport.height * outputScale);
  let renderContext = {
    canvasContext: context,
    viewport: viewport
  };
  return new Promise((resolve)=>{
    let renderTask = page.render(renderContext);    
    renderTask.promise.then(function(){
      if (!fs. existsSync(vol)) fs. mkdirSync(vol);
      const outfn=outdir+vol+'/'+i.toString().padStart(4,'0')+'.png';
      const out = fs.createWriteStream(outfn)
      const stream = canvas.createPNGStream()
      stream.pipe(out)
      out.on('finish', () =>  {
        process.stdout.write('\r '+outfn+"   ");
        resolve();
      })
    });
  });
}

async function loadPdf(fn){
  const loadingTask = pdfjsLib.getDocument(fn);
  return await loadingTask.promise;
}
const vols=['T13','T14','T15','T16']
const dumpVol=async (vol)=>{
  const pdf=await loadPdf(srcdir+vol+'.pdf');
   for (let i=1;i<=pdf.numPages;i++) {
    const page = await pdf.getPage(i)
    await renderPage(page,i,vol)
  }
}

vols.forEach(dumpVol);