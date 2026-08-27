const fileEl=document.getElementById('file');
const out=document.getElementById('output');
const statusEl=document.getElementById('status');
const widthEl=document.getElementById('width');
const customEl=document.getElementById('custom');
const charsetEl=document.getElementById('charset');
const contrastEl=document.getElementById('contrast');
const brightnessEl=document.getElementById('brightness');
const invertEl=document.getElementById('invert');
const denseBtn=document.getElementById('denseBtn');
const shadeBtn=document.getElementById('shadeBtn');
let mode='dense', image=null;

const sets={
  blocks:'█▓▒░ .',
  classic:'@%#*+=-:. ',
  minimal:'@#. ',
  custom:'@#8&o:*. '
};

function setMode(next){mode=next;denseBtn.classList.toggle('active',mode==='dense');shadeBtn.classList.toggle('active',mode==='shading');if(image)render();}
denseBtn.onclick=()=>setMode('dense');
shadeBtn.onclick=()=>setMode('shading');
charsetEl.onchange=()=>{customEl.disabled=charsetEl.value!=='custom';if(image)render()};
[fileEl,widthEl,customEl,contrastEl,brightnessEl,invertEl].forEach(el=>el.addEventListener('change',()=>{if(image)render()}));
document.getElementById('render').onclick=()=>{if(image)render();else statusEl.textContent='Choose an image first.'};

document.getElementById('copy').onclick=async()=>{if(!out.textContent)return;try{await navigator.clipboard.writeText(out.textContent);statusEl.textContent='Copied to clipboard.'}catch(e){statusEl.textContent='Copy failed; select the output and copy manually.'}};

fileEl.onchange=e=>{const f=e.target.files&&e.target.files[0];if(!f)return;const url=URL.createObjectURL(f);const img=new Image();img.onload=()=>{image=img;URL.revokeObjectURL(url);render()};img.onerror=()=>statusEl.textContent='Could not read this image.';img.src=url};

function ramp(){if(charsetEl.value==='custom')return customEl.value||'@#. ';return sets[charsetEl.value]}
function adjust(v){let x=v+Number(brightnessEl.value||0)*2.55;const c=Number(contrastEl.value||0);x=(x-128)*(1+c/100)+128;return Math.max(0,Math.min(255,x))}
function render(){
  const w=Math.max(20,Math.min(500,Number(widthEl.value)||120));
  const ratio=image.height/image.width;
  // Monospace characters are taller than wide; compensate with ~0.5 vertical scale.
  const h=Math.max(1,Math.round(w*ratio*0.52));
  const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d',{willReadFrequently:true});
  ctx.drawImage(image,0,0,w,h);const data=ctx.getImageData(0,0,w,h).data;
  let chars=ramp();
  if(mode==='dense')chars='█▓▒▒░░  '+chars;
  if(mode==='shading')chars='@%#*+=-:. '+chars;
  // Keep one copy of each character while preserving order.
  chars=[...chars].filter((c,i,a)=>a.indexOf(c)===i).join('');
  let result='';
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      const i=(y*w+x)*4;let r=data[i],g=data[i+1],b=data[i+2],a=data[i+3]/255;
      let lum=(0.2126*r+0.7152*g+0.0722*b)*a+255*(1-a);
      lum=adjust(lum);if(invertEl.checked)lum=255-lum;
      const idx=Math.min(chars.length-1,Math.floor((lum/255)*(chars.length-1)));
      result+=chars[idx];
    }
    result+='\n';
  }
  out.textContent=result;statusEl.textContent=`${mode==='dense'?'Dense':'Shading'} · ${w} × ${h} characters`;
}
customEl.disabled=false;
