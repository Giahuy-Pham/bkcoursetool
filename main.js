var lop = document.getElementById('lop');
var sche = document.getElementById('sche');
var add_class = document.getElementById('add_class');
var del_class = document.getElementById('del_class');
var submit = document.getElementById('submit');
var but = document.getElementById('but');

window.onload = function() {
  var tmp = localStorage.getItem("bruh"),data=[];
  data=tmp.split("@");
  //document.write(data.length);
  for(let i=0;i<data.length-1;i++) add_class.click();
  var textBox = document.getElementsByTagName("textarea");
  for(let i=0;i<data.length;i++) textBox[i].value = data[i];
}

add_class.onclick = function(){
    var newField = document.createElement('textarea');
    newField.placeholder="Paste here";
    lop.appendChild(newField);
}

del_class.onclick = function(){
  var input_tags = lop.getElementsByTagName('textarea');
  if(input_tags.length > 0) {
    lop.removeChild(input_tags[(input_tags.length) - 1]);
  }
}

var data1,data=[],da=[],tex="",sl,nd,li=[],tkb=[],ndtkb=[],kt=0;
var thu=['x','x','Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function tao(kt) {
  document.querySelectorAll('.cuc').forEach(e => e.remove());
  for (let i = 0; i < 15; i++) {
    tkb[i] = []; ndtkb[i] = [];
    for (let j = 0; j < 10; j++) {
      tkb[i][j] = []; ndtkb[i][j] = [];
    }
  }
  var e=data.length,u=0;
  if (kt) {e=kt; u=e-1;}
  for(u;u<e;u++) {  
    var newdiv=document.createElement("div"),lum;
    newdiv.className="cuc";
    sche.appendChild(newdiv);
    sl = []; nd = [];
    for(let k=0; k<2; k++) {
      sl[k]=[]; nd[k]=[];
      for (let i = 0; i < 15; i++) {
        sl[k][i] = []; nd[k][i] = [];
        for (let j = 0; j < 10; j++) {
            sl[k][i][j] = []; nd[k][i][j] = [];
        }
      }
    }
    da=data[u].split("\n");
    var it,ss;
    for(it=0; it<da.length; it++) {
      var tmp=da[it].split(' ');
      if (tmp[0]=='Nhóm') break;
    }
    for(let i=da.length-1; i>0; i--) {
      var tmp=da[i].split('	');
      if (tmp[0].search(da[it-1])!=-1) 
      {
        let j=i+1;
        while (da[j].split(' ')[0]!='Nhóm') j++;
        ss=da[j+1].split('	')[0]; break;
      }
    }
    li.push(da[it-1]);
    isBt=1;
    if (da[it+3].split(' ')[0]!=da[it+4].split(' ')[0]&&da[it+4].split(' ')[0]!="Chủ") isBt=0;
    //document.write(isBt);
    for(var i=it+1; i<da.length; i+=3+isBt) {
      var tmp=da[i].split('	'),tmp1,tmp2;
      if (tmp[0]=='Phiếu đăng ký'||(tmp[0][0]>='0'&&tmp[0][0]<='9')) break;
      var l=tmp[0].split("_"),l1,l2="",d1,d2="",p1,p2="",r1,r2="",w1,w2="";
      //if (l[0][0]!='L') continue;
      l1=l[0];
      tmp1=da[i+2].split('	').join(' ').split(' ');  
      d1=tmp1[1];      if (d1=='nhật') d1='8';
      let j=2;
      while(tmp1[j]=='-') j++;
      p1=tmp1[j];
      r1=tmp1[tmp1.length-4];   
      w1=tmp1[tmp1.length-1];   w2=w1;
      if (isBt) {
        l2=l[1];
        tmp2=da[i+3].split('	').join(' ').split(' ');
        d2=tmp2[1];      if (d2=='nhật') d2='8';
        j=2;
        while(tmp2[j]=='-') j++;
        p2=tmp2[j];
        r2=tmp2[tmp2.length-4];
        w2=tmp2[tmp2.length-1];
        if (w1<w2) {[w1, w2]=[w2, w1]; [d1, d2]=[d2, d1]; [p1, p2]=[p2, p1]; [r1, r2]=[r2, r1];}
      }
      if (r1=='HANGOUT_TUONGTAC') r1='GGMEET';
      if (r2=='HANGOUT_TUONGTAC') r2='GGMEET';
      if (!sl[0][+p1][+d1].includes(l1)) {sl[0][+p1][+d1].push(l1);}
      if (isBt&&!sl[1][+p2][+d2].includes(l1+l2)) {sl[1][+p2][+d2].push(l1+"-"+l2);}
      while(l1.length<4) l1=l1+' ';
      while(isBt&&l2.length<4) l2=l2+' ';
      if (!nd[0][+p1][+d1].includes(l1+" "+r1+" "+w1)) {nd[0][+p1][+d1].push(l1+" "+r1+" "+w1);}
      if (isBt&&!nd[1][+p2][+d2].includes(l1+" "+r1+" "+w1+"\n"+l2+" "+r2+" "+w2)) {nd[1][+p2][+d2].push(l1+" "+r1+" "+w1+"\n"+l2+" "+r2+" "+w2);}
      //document.write(l1+" "+l2+" "+p2+"-"+d2+"|"+"<br>");
      if (tmp[0]==ss) {
        tkb[+p1][+d1].push(da[it-1].slice(0,6)+"(Lec)"); 
        ndtkb[+p1][+d1].push(l1+" "+r1+" "+w1+"\n"+l2+" "+r2+" "+w2);
        if (isBt) {tkb[+p2][+d2].push(da[it-1].slice(0,6)+"(Lab)"); ndtkb[+p2][+d2].push(l1+" "+r1+" "+w1+"\n"+l2+" "+r2+" "+w2);}
      }
    }
    for (let k=0; k<=isBt&&kt; k++) {
      var tbl = document.createElement('table');
      tbl.className='mon';
      for (let i = 0; i <= 12; i++) {
        const tr = tbl.insertRow();
        for (let j = 1; j <= 8; j++) {
          const td = tr.insertCell();
          var celltext,celltextpop; 
          if (j==1&&i==0) {
            if (k==0) celltext=document.createTextNode("Lec"); else celltext=document.createTextNode("Lab");
            td.appendChild(celltext);
          } else
          if (j==1&&i>0) {
            celltext=document.createTextNode(i);
            td.appendChild(celltext);
          } else
          if (i==0&&j>1) {
            celltext=document.createTextNode(thu[j]);
            td.appendChild(celltext);
          } else {
            var tmp='';
            for(let z=0;z<sl[k][i][j].length;z++) tmp+= sl[k][i][j][z] + "\n";
            celltext=document.createTextNode(tmp);
            td.style = "white-space: pre;"
            td.appendChild(celltext);
            if (!sl[k][i][j].length) continue;
            td.className = "haspopup";
            tmp='';
            for(let z=0;z<nd[k][i][j].length;z++) {if (z) tmp+="\n"; tmp+= nd[k][i][j][z] + "\n";}
            var x=document.createElement("span");
            celltextpop=document.createTextNode(tmp);
            x.className="popup";
            x.appendChild(celltextpop);
            td.appendChild(x);
          }
        }
      }
      lum=document.getElementsByClassName("cuc");
      lum[lum.length-1].appendChild(tbl);
    }
  }
  if (!kt) {
    var newdiv=document.createElement("div"),lum;
    newdiv.className="cuc";
    sche.appendChild(newdiv);
    var tbl = document.createElement('table');
    tbl.className='mon';
    for (let i = 0; i <= 12; i++) {
      const tr = tbl.insertRow();
      for (let j = 1; j <= 8; j++) {
        const td = tr.insertCell();
        var celltext,celltextpop; 
        if (j==1&&i==0) {
          celltext=document.createTextNode("Skd");
          td.appendChild(celltext);
        } else
        if (j==1&&i>0) {
          celltext=document.createTextNode(i);
          td.appendChild(celltext);
        } else
        if (i==0&&j>1)  {
          celltext=document.createTextNode(thu[j]);
          td.appendChild(celltext);
        } else {
          var tmp='';
          for(let z=0;z<tkb[i][j].length;z++) tmp+= tkb[i][j][z] + "\n";
          celltext=document.createTextNode(tmp);
          td.style = "white-space: pre;"
          td.appendChild(celltext);
          if (!ndtkb[i][j].length) continue;
          td.className = "haspopup";
          tmp='';
          for(let z=0;z<ndtkb[i][j].length;z++) {if (z) tmp+="\n"; tmp+= ndtkb[i][j][z] + "\n";}
          var x=document.createElement("span");
          celltextpop=document.createTextNode(tmp);
          x.className="popup";
          x.appendChild(celltextpop);
          td.appendChild(x);
        }
      }
    }
    lum=document.getElementsByClassName("cuc");
    lum[lum.length-1].appendChild(tbl);
  }
}

submit.onclick = function(){
  data1 = lop.getElementsByTagName('textarea');
  if (data1.length==0) return;
  for(var i=0;i<data1.length;i++) {
      data.push(data1[i].value);
      tex+=data1[i].value+"@";
  }
  localStorage.setItem("bruh", tex);
  li.push("Schedule");
  tao();
  document.querySelectorAll('.wrapper').forEach(e => e.remove());
  document.querySelectorAll('.cuc').forEach(e => e.remove());
  var newdiv=document.createElement("div"),lum;
  newdiv.id="but";
  sche.appendChild(newdiv);
  for(let i=0; i<li.length;i++) {
    var button=document.createElement('button');
    button.className="tenmon";
    button.innerText=li[i]; 
    button.onclick= function() { 
      tao(i);
    }
    document.getElementById("but").appendChild(button);
  }
  document.addEventListener('click', ({ target }) => {
    var popup = target.closest('.haspopup');
    var clickedOnClosedPopup = popup && !popup.classList.contains('show');
    document.querySelectorAll('.haspopup').forEach(p => p.classList.remove('show'));
    document.getElementById('cover').style.visibility='hidden';  
  
    if (clickedOnClosedPopup) {
      document.getElementById('cover').style.visibility='visible';
      popup.classList.add('show');
    }
  });
  let list = document.querySelectorAll(".tenmon");
  function activeLink(){
    list.forEach((item) => item.classList.remove('active'));
    this.classList.add('active');
  }
  list.forEach((item) => item.addEventListener('click',activeLink));
}

// function print() {
// 	var element = document.getElementById('sche'), tmp=document.getElementsByClassName('cuc'),w=0,h=0;
//   for(let i=0;i<tmp.length;i++)
//   {
//     var {width,height} = tmp[i].getBoundingClientRect();
//     if (width>w||(width==w&&height>h)) {[width,w]=[w,width]; [height,h]=[h,height];}
//   }
//   h+=20;
//   var opt = {
//     margin:       5,
//     filename:     'bkcourses.pdf',
//     image:        { type: 'jpeg', quality: 1 },
//     html2canvas:  { scale: 4 , scrollY: 0, scrollX: 0},
//     pagebreak:    { before: ".cuc" },
//     jsPDF:        { format: [w, h], unit: 'px', orientation: 'l' }
//   };
// 	html2pdf().set(opt).from(element).save();
// }
