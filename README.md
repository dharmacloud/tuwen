# tuwen
圖文對照系統

# PDF to PNG

     node dumppdf

# 產生 imagemagick 批次檔
     node gen-pdf2image-cmd.js
 
 得 taisho-0x,cmd  ~ taisho-8x.cmd

# 產生每頁的圖
    taisho-0x.cmd 

# png 壓成影片  可處理非偶數寬高
    ffmpeg -r 1 -i %1/%%04d.png -vcodec libx264 -x264opts keyint=1 -crf 51 -pix_fmt yuv420p -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2" %1.mp4