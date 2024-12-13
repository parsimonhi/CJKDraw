cjkd={};
cjkd.copyright=
{
	en:"<a href='https://github.com/parsimonhi/CJKDraw'>CJKDraw</a> Copyright 2022-2024 FM&SH",
	fr:"<a href='https://github.com/parsimonhi/CJKDraw'>CJKDraw</a> Copyright 2022-2024 FM&SH"
};
cjkd.instructions={en:"Draw the character that has the meaning above in the rectangle below.",fr:"Dessinez le caractère qui a la signification ci-dessus dans le rectangle ci-dessous."};
cjkd.js=document.scripts[document.scripts.length-1]; // current js script
cjkd.i18n=
{
	": ":{fr:" : "},
	"Level: ":{fr:"Niveau : "},
	"Pred":{fr:"Précédent"},
	"Retry":{fr:"Réessayer"},
	"Next":{fr:"Suivant"},
	"Stroke too small":{"fr":"Trait trop petit"},
	"Stroke start too far":{"fr":"Départ du trait trop loin"},
	"Stroke direction too different":{"fr":"Direction du trait trop différente"},
	"Stroke too short":{"fr":"Trait trop court"},
	"Stroke too long":{"fr":"Trait trop long"},
	"Stroke shape too different":{"fr":"Forme du trait trop différente"},
	"Server unreachable!":{fr:"Serveur inaccessible !"},
	"Data not available!":{"fr":"Données non disponibles !"}
};
cjkd.getStore=function()
{
	return JSON.parse(localStorage.getItem('cjkd'));
};
cjkd.setStore=function(p)
{
	localStorage.setItem('cjkd',JSON.stringify(p));
};
cjkd.getParamFromStore=function(a)
{
	let p=JSON.parse(localStorage.getItem('cjkd'));
	return p[a];
};
cjkd.setParamToStore=function(a,v)
{
	let p=JSON.parse(localStorage.getItem('cjkd'));
	p[a]=v;
	localStorage.setItem('cjkd',JSON.stringify(p));
};
cjkd.getI18n=function(s)
{
	let m;
	if((cjkd.params.targetLang=="en")||!cjkd.i18n[s]||!cjkd.i18n[s][cjkd.params.targetLang]) m=s;
	else m=cjkd.i18n[s][cjkd.params.targetLang];
	return m;
};
cjkd.log=function(s,c="",cls="")
{
	let m=c?"<span lang='"+cjkd.params.sourceLang+"'>"+c+"</span> ":"";
	let e=document.querySelector(".cjkd .hint");
	e.innerHTML=m+cjkd.getI18n(s);
	if(cls=="good")
	{
		e.classList.remove("bad");
		e.classList.add("good");
	}
	else if(cls=="bad")
	{
		e.classList.remove("good");
		e.classList.add("bad");
	}
	else
	{
		e.classList.remove("bad");
		e.classList.remove("good");
	}
};
cjkd.alert=function(m,title="CJKDraw",cls="neutral")
{
	var e;
	e=document.querySelector(".cjkd .alertDialog");
	if(!e)
	{
		let s="",a,b,c;
		e=document.createElement('dialog');
		e.classList.add("alertDialog");
		e.classList.add(cls);
		s+="<h1>"+title+"</h1>";
		s+="<form method='dialog'>";
		s+="<div class='message'>"+m+"</div>";
		s+="<button value='OK'>OK</button>";
		s+="</form>";
		e.innerHTML=s;
		document.querySelector(".cjkd").appendChild(e);
	}
	e.querySelector('.message').innerHTML=m;
	e.showModal();
}
cjkd.distance=function(p1,p2)
{
	return Math.sqrt((p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y));
};
cjkd.incTry=function()
{
	if(!cjkd.params.results[cjkd.params.sourceLang])
		cjkd.params.results[cjkd.params.sourceLang]={};
	if(!cjkd.params.results[cjkd.params.sourceLang][cjkd.dicoName])
		cjkd.params.results[cjkd.params.sourceLang][cjkd.dicoName]={};
	let r=cjkd.params.results[cjkd.params.sourceLang][cjkd.dicoName][cjkd.currentChar];
	if(!r) r=[0,0];
	r[0]=r[0]+1;
	cjkd.params.results[cjkd.params.sourceLang][cjkd.dicoName][cjkd.currentChar]=r;
	cjkd.setStore(cjkd.params);
	// console.log(cjkd.params.results[cjkd.params.sourceLang]);
};
cjkd.incSuccess=function()
{
	if(!cjkd.params.results[cjkd.params.sourceLang])
		cjkd.params.results[cjkd.params.sourceLang]={};
	if(!cjkd.params.results[cjkd.params.sourceLang][cjkd.dicoName])
		cjkd.params.results[cjkd.params.sourceLang][cjkd.dicoName]={};
	let r=cjkd.params.results[cjkd.params.sourceLang][cjkd.dicoName][cjkd.currentChar];
	if(!r) r=[0,0];
	r[1]=r[1]+1;
	cjkd.params.results[cjkd.params.sourceLang][cjkd.dicoName][cjkd.currentChar]=r;
	// no need to save in local store since it will be done when incTry()
};
cjkd.finalCut=function()
{
	let e=document.querySelector(".cjkd .charNumList li:nth-of-type("+(cjkd.k+1)+") button");
	if(cjkd.n==0) cjkd.n=2;
	if(e)
	{
		if(cjkd.n==2)
		{
			document.querySelector(".cjkd .acjk").classList.add("drawnGood");
			e.classList.remove("notDrawn");
			e.classList.remove("drawnBad");
			e.classList.add("drawnGood");
			cjkd.incSuccess();
			cjkd.incTry();
		}
		else if(cjkd.n==1)
		{
			e.classList.remove("notDrawn");
			e.classList.remove("drawnGood");
			e.classList.add("drawnBad");
			cjkd.incTry();
		}
		else
		{
			e.classList.remove("drawnBad");
			e.classList.remove("drawnGood");
			e.classList.add("notDrawn");
		}
	}
	if(cjkd.n==2) cjkd.log("OK",cjkd.currentChar,"good");
	else if(cjkd.n==1) cjkd.log("NOK",cjkd.currentChar,"bad");
	else cjkd.log("");
};

cjkd.verify=function(p1)
{
	let s=".cjkd .box svg.acjk path[clip-path='url(#svg4cjkdBoxc"+(cjkd.s+1)+")']";
	let p2=document.querySelector(s);
	let len1,len2;
	let pts1=[],pts2=[];
	let v=true;
	let k,kmax;
	cjkd.log("");
	len1=p1.getTotalLength();
	if(len1<10)
	{
		v=false; // discard very small strokes (< 10 svg units)
		cjkd.log("Stroke too small","","bad");
	}
	len2=p2.getTotalLength();
	if(v)
	{
		// compute some intermediate points
		kmax=20;
		for(k=0;k<=kmax;k++)
		{
			pts1[k]=p1.getPointAtLength(len1*k/kmax);
			pts2[k]=p2.getPointAtLength(len2*k/kmax);
			// console.log(k+") "+Math.round(pts1[k].x)+","+Math.round(pts1[k].y)+" "+Math.round(pts2[k].x)+","+Math.round(pts2[k].y));
		}
	}
	if(v)
	{
		// discard strokes that have their start point too far
		let d;
		d=cjkd.distance(pts1[0],pts2[0]);
		if(d>256) v=false;
		// console.log("d: "+d);
		if(!v) cjkd.log("Stroke start too far","","bad");
	}
	if(v)
	{
		// discard strokes that have a too different direction
		let d1,d2,cos1,cos2,sin1,sin2,a1,a2,a3,a4,am;
		if(len2>256) am=Math.PI/6;
		else am=Math.PI/4;
		d1=cjkd.distance(pts1[0],pts1[kmax]);
		d2=cjkd.distance(pts2[0],pts2[kmax]);
		cos1=(pts1[kmax].x-pts1[0].x)/d1;
		cos2=(pts2[kmax].x-pts2[0].x)/d2;
		sin1=(pts1[kmax].y-pts1[0].y)/d1;
		sin2=(pts2[kmax].y-pts2[0].y)/d2;
		a1=Math.acos(cos1);
		if(sin1<0) a1=2*Math.PI-a1;
		a2=Math.acos(cos2);
		if(sin2<0) a2=2*Math.PI-a2;
		if((Math.abs(a1-a2)>am)
			&&(Math.abs(a1+2*Math.PI-a2)>am)
			&&(Math.abs(a1-2*Math.PI-a2)>am)) v=false;
		// console.log(180*am/Math.PI+" "+180*a1/Math.PI+" "+180*a2/Math.PI);
		if(!v) cjkd.log("Stroke direction too different","","bad");
	}
	if(v)
	{
		// discard strokes that are too smaller or too bigger
		if((len1>256)&&(len2>256))
		{
			if(len1<0.5*len2) {v=false;cjkd.log("Stroke too short","","bad");}
			else if(len1>2*len2) {v=false;cjkd.log("Stroke too long","","bad");}
		}
		else if((len1>256)||(len2>256))
		{
			if(len1<0.33*len2) {v=false;cjkd.log("Stroke too short","","bad");}
			else if(len1>3*len2) {v=false;cjkd.log("Stroke too long","","bad");}
		}
		// console.log("len1:"+len1+" "+"len2:"+len2);
	}
	if(v)
	{
		// resize user stroke to fit the bounding box of the original stroke
		let denx,deny,rx,ry;
		let x1min=1024,y1min=1024,x2min=1024,y2min=1024;
		let x1max=0,y1max=0,x2max=0,y2max=0;
		for(k=0;k<=kmax;k++)
		{
			x1min=Math.min(pts1[k].x,x1min);
			y1min=Math.min(pts1[k].y,y1min);
			x2min=Math.min(pts2[k].x,x2min);
			y2min=Math.min(pts2[k].y,y2min);
			x1max=Math.max(pts1[k].x,x1max);
			y1max=Math.max(pts1[k].y,y1max);
			x2max=Math.max(pts2[k].x,x2max);
			y2max=Math.max(pts2[k].y,y2max);
		}
		// console.log("minmax: "+Math.round(x1min)+","+Math.round(y1min)+" "+Math.round(x1max)+","+Math.round(y1max)+" "+Math.round(x2min)+","+Math.round(y2min)+" "+Math.round(x2max)+","+Math.round(y2max));
		denx=x1max-x1min;
		deny=y1max-y1min;
		if(Math.abs(denx)>=1) rx=(x2max-x2min)/denx; else rx=0;
		if(Math.abs(deny)>=1) ry=(y2max-y2min)/deny; else ry=0;
		for(k=0;k<=kmax;k++)
		{
			if(rx) pts1[k].x=x2min+(pts1[k].x-x1min)*rx; else pts1[k].x=x2min;
			if(ry) pts1[k].y=y2min+(pts1[k].y-y1min)*ry; else pts1[k].y=y2min;
		}
	}
	if(v)
	{
		// discard strokes that have at least one point too far
		let dmax=Math.max(128,len2/4);
		kmax=20;
		for(k=0;k<=kmax;k++)
		{
			let d=cjkd.distance(pts1[k],pts2[k]);
			// console.log(k+") "+"d:"+Math.round(d)+" "+Math.round(pts1[k].x)+","+Math.round(pts1[k].y)+" "+Math.round(pts2[k].x)+","+Math.round(pts2[k].y));
			if(d>dmax) {v=false;break;}
		}
		// console.log("d:"+d+"/"+dmax);
		if(!v) cjkd.log("Stroke shape too different","","bad");
	}
	if(v) p2.classList.add("drawnGood");
	else {p2.classList.add("drawnBad");cjkd.n=1;}
	p1.style.stroke="transparent";
	cjkd.s++;
	if(cjkd.s>=cjkd.numOfStrokes)
	{
		cjkd.finalCut();
	}
};

cjkd.scale=function(z)
{
  let b=cjkd.svgCanvas.getBoundingClientRect();
  return z*1024/b.width;
};
cjkd.relPos=function(pt)
{
  let b=cjkd.svgCanvas.getBoundingClientRect();
  let pt2=[-window.pageXOffset+pt.pageX-b.left,-window.pageYOffset+pt.pageY-b.top];
  return pt2;
};
cjkd.createSvgElement=function(tagName)
{
  return document.createElementNS("http://www.w3.org/2000/svg",tagName);
};

cjkd.drawStart=function(pt)
{
  let x=cjkd.scale(pt[0]),y=cjkd.scale(pt[1]);
  cjkd.svgPath=cjkd.createSvgElement("path");
  cjkd.svgPath.setAttribute("fill","none");
  cjkd.svgPath.setAttribute("shape-rendering","geometricPrecision");
  cjkd.svgPath.setAttribute("stroke-linejoin","round");
  cjkd.svgPath.setAttribute("stroke-linecap","round");
  cjkd.svgPath.setAttribute("stroke","#000000");
  cjkd.arrayPath.push([x,y]);
  cjkd.svgPath.setAttribute("d","M"+x+","+y);
  cjkd.svgCanvas.appendChild(cjkd.svgPath);
};

cjkd.drawMove=function(pt)
{
  if (cjkd.svgPath)
  {
    let x=cjkd.scale(pt[0]),y=cjkd.scale(pt[1]);
    let pathData=cjkd.svgPath.getAttribute("d");
    cjkd.arrayPath.push([x,y]);
    pathData+="L"+x+","+y;
    cjkd.svgPath.setAttribute("d",pathData);
  }
};

cjkd.pointerDown=function(e)
{
	if(cjkd.error) return false;
	if(cjkd.s>=cjkd.numOfStrokes) return false;
	return cjkd.drawStart(cjkd.relPos(e.touches?e.touches[0]:e));
};

cjkd.pointerMove=function(e)
{
	if(cjkd.error) return false;
	if(cjkd.s>=cjkd.numOfStrokes) return false;
	return cjkd.drawMove(cjkd.relPos(e.touches?e.touches[0]:e));
};

cjkd.pointerUp=function(e)
{
	if(cjkd.error) return false;
	if(cjkd.s>=cjkd.numOfStrokes) return false;
	if (cjkd.svgPath)
	{
		cjkd.verify(cjkd.svgPath);
		cjkd.svgPath=null;
		cjkd.arrayPath=[];
		return true;
	}
	else return false;
};

cjkd.draw=(method,move,stop) => e =>
{
	if (method == "add") cjkd.pointerDown(e);
	else if (method == "remove") cjkd.pointerUp(e);
	cjkd.svgCanvas[method+"EventListener"](move,cjkd.pointerMove);
	cjkd.svgCanvas[method+"EventListener"](stop,cjkd.pointerUp);
};

cjkd.setCanvas=function()
{
	let list;
	cjkd.svgCanvas=document.querySelector(".cjkd .box svg.userDrawing");
	if(cjkd.canTouch)
	{
		cjkd.svgCanvas.addEventListener("touchstart",cjkd.draw("add","touchmove","touchend"));
		cjkd.svgCanvas.addEventListener("touchend",cjkd.draw("remove","touchmove","touchend"));
		// no need of a touchout event, touchend does the job
	}
	else
	{
		cjkd.svgCanvas.addEventListener("mousedown",cjkd.draw("add","mousemove","mouseup"));
		cjkd.svgCanvas.addEventListener("mouseup",cjkd.draw("remove","mousemove","mouseup"));
		cjkd.svgCanvas.addEventListener("mouseout",cjkd.draw("remove","mousemove","mouseup"));
	}
	cjkd.error=false;
	cjkd.svgPath=null;
	cjkd.arrayPath=[];
	cjkd.s=0; // stroke to draw
	cjkd.n=0; // 0: not drawn yet,1: drawn but bad,2: drawn but good
	list=document.querySelectorAll("#svg4cjkdBox path[id]");
	cjkd.numOfStrokes=list.length;
};

cjkd.setRefSvg=function(c)
{
	let s="",e,d,lang,u=c.codePointAt(0);
	e=document.querySelector(".cjkd .box");
	lang=cjkd.params.sourceLang;
	lang=lang.charAt(0).toUpperCase()+lang.slice(1);
	if(!cjkd[lang]) cjkd[lang]={};
	if(cjkd[lang]["u"+u])
	{
		e.innerHTML=cjkd[lang]["u"+u]+e.innerHTML;
		cjkd.setCanvas();
	}
	else
	{
		fetch(cjkd.params.animCJKDir+"svgs"+lang+"/"+u+".svg")
		.then(r=>
			{
				if(!r.ok) throw r.statusText;
				return r.text();
			})
		.then(r=>
			{
				if(r)
				{
					let z;
					z=r.replaceAll("z"+u,"svg4cjkdBox").replaceAll("zk","zk4cjkdBox");
					z=z.replace(/<!--[^£]*-->\s?/g,"");
					z=z.replace(/<style>[^£]*<\/style>\s?/g,"");
					z=z.replace(/ pathLength="3333"/g,"");
					cjkd[lang]["u"+u]=z;
					e.innerHTML=z+e.innerHTML;
					cjkd.setCanvas();
					return true;
				}
				else
				{
					cjkd.error=true;
					cjkd.alert(cjkd.getI18n("Data not available!"));
					return false;
				}
			})
		.catch(e=>
			{
				cjkd.error=true;
				cjkd.alert(cjkd.getI18n("Server unreachable!"));
				return false;
			});
	}
};

cjkd.setChar=function(k)
{
	let e,n,dds,btnoa;
	btnoa=document.querySelector(".onAir");
	if(btnoa) btnoa.classList.remove("onAir");
	btnoa=document.querySelector(".cjkd .charNumList li:nth-of-type("+(k+1)+") button");
	if(btnoa) btnoa.classList.add("onAir");
	cjkd.currentChar=cjkd.dico[k][0];
	cjkd.log("");
	n=(cjkd.params.targetLang=="en")?2:3;
	if(k<0) k=0;
	if(k>=cjkd.dico.length) k=cjkd.dico.length-1;
	cjkd.k=k;
	e=document.getElementById("svg4cjkdBox");
	if(e) e.parentNode.removeChild(e);
	e=document.querySelector(".cjkd .box .userDrawing");
	if(e) e.innerHTML="";
	e=document.querySelector(".cjkd .charToGuest");
	dds=(cjkd.params.targetLang=="en")?": ":" : ";
	e.innerHTML=(cjkd.k+1)+dds+cjkd.dico[k][1].replace("<br>",", ")+", "+cjkd.dico[k][n];
	cjkd.setRefSvg(cjkd.currentChar);
	let b0=document.querySelector(".cjkd .navBtnList li:first-of-type button");
	let bN=document.querySelector(".cjkd .navBtnList li:last-of-type button");
	if(k==0)
	{
		b0.disabled=true;
		bN.disabled=false;
	}
	else if(k==(cjkd.dico.length-1))
	{
		b0.disabled=false;
		bN.disabled=true;
	}
	else
	{
		b0.disabled=false;
		bN.disabled=false;
	}
};

cjkd.setPredChar=function()
{
	cjkd.setChar(cjkd.k-1);
};

cjkd.setCurrentChar=function()
{
	cjkd.setChar(cjkd.k);
};

cjkd.setNextChar=function()
{
	cjkd.setChar(cjkd.k+1);
};

cjkd.make=function(dico)
{
	let s="",k,kmax=dico.length;
	cjkd.dico=dico;
	s+="<div class='charToGuest'></div>";
	s+="<div class='instructions'>"+cjkd.instructions[cjkd.params.targetLang]+"</div>";
	s+="<div class='level'>";
	s+=cjkd.getI18n("Level: ")+cjkd.dicoName;
	s+="</div>";
	s+="<div class='box'>";
	s+="<svg class='userDrawing' width='100%' height='100%' viewBox='0 0 1024 1024'>";
	s+="<rect width='100%' height='100%' fill='transparent'/>";
	s+="</svg>";
	s+="</div>";
	s+="<ul class='selector navBtnList'>";
	s+="<li><button onclick='cjkd.setPredChar()'>"+cjkd.getI18n("Pred")+"</button></li>";
	s+="<li><button onclick='cjkd.setCurrentChar()'>"+cjkd.getI18n("Retry")+"</button></li>";
	s+="<li><button onclick='cjkd.setNextChar()'>"+cjkd.getI18n("Next")+"</button></li>";
	s+="</ul>";
	s+="<div class='hint'></div>";
	s+="<ul class='selector charNumList'>";
	for(k=0;k<kmax;k++)
	{
		s+="<li><button class='notDrawn' type='button' onclick='cjkd.setChar("+k+")'>"+(k+1)+"</button></li>";
	}
	s+="</ul>";
	s+="<em>"+cjkd.copyright[cjkd.params.targetLang]+"</em>";
	return s;
};

cjkd.addGrid=function()
{
	let b,g,p,xmlns="http://www.w3.org/2000/svg";
	b=document.querySelector(".cjkd .box");
    g=document.createElementNS(xmlns,"svg");
    g.setAttributeNS(null,"width","100%");
    g.setAttributeNS(null,"height","100%");
    g.setAttributeNS(null,"viewBox","0 0 100 100");
    g.classList.add("grid");
	b.appendChild(g);
    p=document.createElementNS(xmlns,"path");
    p.setAttributeNS(null,"d","M27.5 5V95M50 5V95M72.5 5V95M5 27.5H95M5 50H95M5 72.5H95M5 5V95H95V5Z");
    g.appendChild(p);
};

cjkd.add=function(s)
{
	let e;
	e=document.querySelector(".cjkd");
	e.innerHTML=s;
	cjkd.addGrid();
	if(cjkd.params.gridOn=="0") document.querySelector(".cjkd .grid").style.display="none";
	if(cjkd.params.hintOn=="0") document.querySelector(".cjkd .hint").style.display="none";
	cjkd.js.parentNode.scrollIntoView();
	cjkd.setChar(0);
};
cjkd.init=function(dicoName)
{
	cjkd.params=cjkd.getStore();
	if(dicoName)
	{
		cjkd.params[cjkd.params.sourceLang+"DicoName"]=dicoName;
		cjkd.setStore(cjkd.params);
	}
	cjkd.dicoName=cjkd.params[cjkd.params.sourceLang+"DicoName"];
	e=document.querySelector(".cjkd");
	if(e) e.innerHTML="";
	else
	{
		e=document.createElement("div");
		cjkd.js.parentNode.insertBefore(e,cjkd.js.nextSibling);
	}
	e.classList.remove(...e.classList);
	e.classList.add("cjkd");
}
cjkd.start=function(dicoName)
{
	cjkd.init(dicoName);
	fetch("_json/"+cjkd.dicoName+".json")
	.then(r=>r.json())
	.then(r=>
	{
		if(r)
		{
			cjkd.add(cjkd.make(r));
			return true;
		}
		else
		{
			cjkd.error=true;
			cjkd.alert(cjkd.getI18n("Data not available!"));
			return false;
		}
	})
	.catch(e=>
	{
		cjkd.error=true;
		cjkd.alert(cjkd.getI18n("Server unreachable!"));
		console.log("failed to get "+cjkd.dicoName+" json file!");
		return false;
	});
};
cjkd.checkStore=function()
{
	let p=cjkd.getStore();
	if(!p) p={};
	if(!p.animCJKDir) p.animCJKDir="/animCJK/";
	if(!p.sourceLang) p.sourceLang="ja";
	if(!p.targetLang) p.targetLang="en";
	if(!p.jaDicoName) p.jaDicoName="G1";
	if(!p.zhHansDicoName) p.zhHansDicoName="NHSK1";
	if(!p.gridOn) p.gridOn="0";
	if(!p.hintOn) p.hintOn="0";
	if(!p.results) p.results={};
	cjkd.setStore(p);
};
cjkd.checkStore();
cjkd.onFirstTouch=function()
{
	cjkd.canTouch=true;
	window.removeEventListener('touchstart',cjkd.onFirstTouch,false);
}
window.addEventListener('touchstart',cjkd.onFirstTouch,false);