var lop = document.getElementById('lop'),
  sche = document.getElementById('sche'),
  add_class = document.getElementById('add_class'),
  del_class = document.getElementById('del_class'),
  submit = document.getElementById('submit');

window.onload = function () {
  var tmp = localStorage.getItem("bruh"), data = [];
  data = tmp.split("@");
  var textBox = document.getElementsByTagName("textarea");
  for (let i = 0; i < data.length; i++) {
    add_class.click();
    textBox[i].value = data[i];
  }
  del_class.click();
}

add_class.onclick = function () {
  var newField = document.createElement('textarea');
  newField.placeholder = "Paste here";
  lop.appendChild(newField);
}

del_class.onclick = function () {
  var input_tags = lop.getElementsByTagName('textarea');
  if (input_tags.length > 0) {
    lop.removeChild(input_tags[(input_tags.length) - 1]);
  }
}

var data1, data = [], da = [], tex = "", sl = [], nd = [], li = [], id, isBt = [];
var thu = ['x', 'x', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function tao() {
  for (u = 0; u < data.length; u++) {
    da = data[u].split("\n");
    var it, ss;
    for (it = 0; it < da.length; it++) {
      var tmp = da[it].split(' ');
      if (tmp[0] == 'Nhóm') break;
    }
    for (let i = da.length - 1; i > 0; i--) {
      var tmp = da[i].split('	');
      if (tmp[0].search(da[it - 1]) != -1) {
        let j = i + 1;
        while (da[j].split(' ')[0] != 'Nhóm') j++;
        ss = da[j + 1].split('	')[0]; break;
      }
    }
    li.push(da[it - 1]);
    if (da[it + 3].split(' ')[0] != da[it + 4].split(' ')[0] && da[it + 4].split(' ')[0] != "Chủ") isBt[u] = 0;
    for (var i = it + 1; i < da.length; i += 3 + isBt[u]) {
      var tmp = da[i].split('	'), tmp1, tmp2;
      if (tmp[0] == 'Phiếu đăng ký' || (tmp[0][0] >= '0' && tmp[0][0] <= '9')) break;
      var l = tmp[0].split("_"), l1, l2 = "", d1, d2 = "", p1, p2 = "", r1, r2 = "", w1, w2 = "";
      l1 = l[0];
      tmp1 = da[i + 2].split('	').join(' ').split(' ');
      d1 = tmp1[1]; if (d1 == 'nhật') d1 = '8';
      let j = 2;
      while (tmp1[j] == '-') j++;
      p1 = tmp1[j];
      r1 = tmp1[tmp1.length - 4];
      w1 = tmp1[tmp1.length - 1]; w2 = w1;
      if (isBt[u]) {
        l2 = l[1];
        tmp2 = da[i + 3].split('	').join(' ').split(' ');
        d2 = tmp2[1]; if (d2 == 'nhật') d2 = '8';
        j = 2;
        while (tmp2[j] == '-') j++;
        p2 = tmp2[j];
        r2 = tmp2[tmp2.length - 4];
        w2 = tmp2[tmp2.length - 1];
        if (w1 < w2) { [w1, w2] = [w2, w1];[d1, d2] = [d2, d1];[p1, p2] = [p2, p1];[r1, r2] = [r2, r1]; }
      }
      if (r1 == 'HANGOUT_TUONGTAC') r1 = 'GGMEET';
      if (r2 == 'HANGOUT_TUONGTAC') r2 = 'GGMEET';
      while (l1.length < 4) l1 = ' ' + l1;
      while (isBt[u] && l2.length < 4) l2 = l2 + ' ';
      if (!sl[0][u][+p1][+d1].includes(l1)) {
        sl[0][u][+p1][+d1].push(l1);
        nd[0][u][+p1][+d1].push(l1 + " " + r1 + " " + w1);
      }
      if (isBt[u] && !sl[1][u][+p2][+d2].includes(l1 + l2)) {
        sl[1][u][+p2][+d2].push(l1 + "-" + l2);
        nd[1][u][+p2][+d2].push(l1 + " " + r1 + " " + w1 + "\n" + l2 + " " + r2 + " " + w2);
      }
      if (tmp[0] == ss) {
        var s = l1 + " " + r1 + " " + w1;
        if (isBt[u]) s += "\n" + l2 + " " + r2 + " " + w2;
        sl[2][0][+p1][+d1].push(da[it - 1].slice(0, 6) + "(Lec)");
        nd[2][0][+p1][+d1].push(s);
        if (isBt[u]) {
          sl[2][0][+p2][+d2].push(da[it - 1].slice(0, 6) + "(Lab)");
          nd[2][0][+p2][+d2].push(s);
        }
      }
    }
  }
}

function makecuc(id) {
  document.querySelectorAll('.cuc').forEach(e => e.remove());
  var newdiv = document.createElement("div");
  newdiv.className = "cuc";
  sche.appendChild(newdiv);
  let ks = 0, ke = isBt[id];
  if (!id) ks = ke = 2;
  for (k = ks; k <= ke; k++) {
    var tbl = document.createElement('table');
    tbl.className = 'mon';
    for (let i = 0; i <= 12; i++) {
      const tr = tbl.insertRow();
      for (let j = 1; j <= 8; j++) {
        const td = tr.insertCell();
        var celltext, celltextpop, tmp = '';
        if (!i && !(j - 1)) if (!k) tmp = 'Lec'; else tmp = 'Lab';
        if (!i && j - 1) tmp = thu[j];
        if (i && !(j - 1)) tmp = i;
        if (i && j - 1) for (let z = 0; z < sl[k][id][i][j].length; z++) tmp += sl[k][id][i][j][z] + "\n";
        celltext = document.createTextNode(tmp);
        td.style = "white-space: pre-line;"
        td.appendChild(celltext);
        if (!nd[k][id][i][j].length) continue;
        td.className = "haspopup";
        tmp = '';
        for (let z = 0; z < nd[k][id][i][j].length; z++) {
          if (z) tmp += "\n";
          tmp += nd[k][id][i][j][z] + "\n";
        }
        var x = document.createElement("span");
        celltextpop = document.createTextNode(tmp);
        x.className = "popup";
        x.appendChild(celltextpop);
        td.appendChild(x);
      }
    }
    newdiv.appendChild(tbl);
  }
}


submit.onclick = function () {
  data1 = lop.getElementsByTagName('textarea');
  if (data1.length == 0) return;
  for (var i = 0; i < data1.length; i++) {
    data.push(data1[i].value);
    tex += data1[i].value + "@";
  }
  localStorage.setItem("bruh", tex);
  document.querySelectorAll('.wrapper').forEach(e => e.remove());
  for (let z = 0; z < 3; z++) {
    sl[z] = []; nd[z] = [];
    for (let k = 0; k <= data.length; k++) {
      sl[z][k] = []; nd[z][k] = []; isBt.push(1);
      for (let i = 0; i < 15; i++) {
        sl[z][k][i] = []; nd[z][k][i] = [];
        for (let j = 0; j < 10; j++) {
          sl[z][k][i][j] = []; nd[z][k][i][j] = [];
        }
      }
    }
  }
  li.push("Schedule");
  tao();
  var newdiv = document.createElement("div");
  newdiv.id = "but";
  sche.appendChild(newdiv);
  for (let i = 0; i < li.length; i++) {
    var button = document.createElement('button');
    button.className = "tenmon";
    button.innerText = li[i];
    button.onclick = function () { makecuc(i); }
    document.getElementById("but").appendChild(button);
  }
  document.addEventListener('click', ({ target }) => {
    var popup = target.closest('.haspopup');
    document.getElementById('cover').style.visibility = 'hidden';
    document.querySelectorAll('.haspopup').forEach(p => p.classList.remove('show'));
    if (popup) {
      document.getElementById('cover').style.visibility = 'visible';
      popup.classList.add('show');
    }
  });
  let list = document.querySelectorAll(".tenmon");
  function activeLink() {
    list.forEach((item) => item.classList.remove('active'));
    this.classList.add('active');
  }
  list.forEach((item) => item.addEventListener('click', activeLink));
}
