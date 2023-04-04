import pdfjsLib from 'pdfjs-dist'
import {createCanvas} from 'canvas'
import fs from 'fs'


const srcdir='e:/longzhang/'
const outdir='e:/longzhang-jpg/'

const renderPage=async (page,i,vol)=>{
  let scale=1;
  let t=new Date();
  let viewport = page.getViewport({ scale});
  scale=1024/viewport.width;
  if (scale!==1) viewport = page.getViewport({ scale});
  const canvas = createCanvas(viewport.width, viewport.height);
  let context = canvas.getContext('2d');
  canvas.width = Math.floor(viewport.width );
  canvas.height = Math.floor(viewport.height );
  let renderContext = {
    canvasContext: context,
    viewport: viewport
  };
  return new Promise((resolve)=>{
    let renderTask = page.render(renderContext);    
    renderTask.promise.then(function(){
      if (!fs. existsSync(outdir+vol)) fs. mkdirSync(outdir+vol);
      
      const outfn=outdir+vol+'/'+(i).toString().padStart(3,'0')+'.jpg';
      const out = fs.createWriteStream(outfn)
      const stream = canvas.createJPEGStream()
      stream.pipe(out)
      out.on('finish', () =>  {
        process.stdout.write('\r '+outfn+"   "+  ((new Date()-t)/1000).toFixed(2) +'   ');
        resolve();
      })
    });
  });
}

async function loadPdf(fn){
  const loadingTask = pdfjsLib.getDocument(fn);
  return await loadingTask.promise;
}
const vols=[]
for (let i=147;i<=166;i++) {
  vols.push(i.toString().padStart(3,'0'));
}
const dumpVol=async (vol)=>{
  const pdf=await loadPdf(srcdir+vol+'.pdf');
 
   for (let i=1;i<=pdf.numPages;i++) {
    const page = await pdf.getPage(i)
    await renderPage(page,i,vol)
  }
}
for (let i=0;i<vols.length;i++) {
  await dumpVol(vols[i])
}