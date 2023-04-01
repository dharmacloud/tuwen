import fs from 'fs';
import {PNG} from 'pngjs';

const vLineDensity=(data,x,W,H)=>{
    let density=0
    for (let y=0;y<H;y++) {
        let  idx = (W * y + x) << 2;
        const d= 765 - (data[idx]+data[idx+1]+data[idx+2]);
        if (d>100) density++
    }
    return density / H;

}
const hLineDensity=(data,y,W,H)=>{
    let density=0
    for (let x=0;x<W;x++) {
        let  idx = (W * y + x) << 2;
        const d= 765 - (data[idx]+data[idx+1]+data[idx+2]);
        if (d>100) density++
    }
    return density / W;
}
const findTopBound=(data,W,H)=>{
    for (let y=0;y<H/4;y++) {
        const d1=hLineDensity( data,y*8,W ,H);
        const d2=hLineDensity( data,y*8+1,W ,H);
        const d3=hLineDensity( data,y*8+2,W ,H);
        const d4=hLineDensity( data,y*8+3,W ,H);
        if (d1+d2+d3+d4>1) {
            return y*4+2;
        }
    }
}
const findLeftBound=(data,W,H)=>{
    for (let x=0;x<H/4;x++) {
        const d1=vLineDensity( data,x*4,W,H );
        const d2=vLineDensity( data,x*4+1,W,H );
        const d3=vLineDensity( data,x*4+2,W,H );
        const d4=vLineDensity( data,x*4+3,W,H );
        const d=d1+d2+d3+d4;
        if (d>0.8) {
            return x*4+2;
        }
    }
}
export const getPNGBoundary=async fn=>{
    return new Promise( (resolve, reject)=>{
        fs.createReadStream(fn)
        .pipe(
          new PNG({
            filterType: 4,
          })
        )
        .on("parsed", function () {
            resolve({left:findLeftBound(this.data,this.width,this.height),
                top:findTopBound(this.data,this.width,this.height) } ) 
        });
    });
}

  /*
      // for (var y = 0; y < this.height; y++) {
    //   for (var x = 0; x < this.width; x++) {
    //     var idx = (this.width * y + x) << 2;

    //     // invert color
    //     this.data[idx] = 255 - this.data[idx];
    //     this.data[idx + 1] = 255 - this.data[idx + 1];
    //     this.data[idx + 2] = 255 - this.data[idx + 2];

    //     // and reduce opacity
    //     this.data[idx + 3] = this.data[idx + 3] >> 1;
    //   }
    // }

    // this.pack().pipe(fs.createWriteStream("out.png"));

    */