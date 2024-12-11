var sche = document.getElementById('sche'),
    add_course = document.getElementById('add_course'),
    del_course = document.getElementById('del_course'),
    inp_data = document.getElementById('inp_data'),
    submit = document.getElementById('submit');


// ======================================= Reload Cache  ======================================= //
window.onload = function () 
{
  // get cache
  var tmp = localStorage.getItem("cache").split("@");

  // recreate course text boxes and add cache
  for (let i = 0; i < tmp.length - 1; i++)
  {
    add_course.click();
    document.getElementsByTagName("textarea")[i].value = tmp[i];
  }
}

// ===================================== Add Course Button ===================================== //
add_course.onclick = function () 
{
  var new_course = document.createElement('textarea');
  new_course.placeholder = "Paste here";
  inp_data.appendChild(new_course);
}

// ===================================== Del Course Button ===================================== //
del_course.onclick = function () 
{
  var cur_course = inp_data.getElementsByTagName('textarea');
  if (cur_course.length > 0) inp_data.removeChild(cur_course[(cur_course.length) - 1]);
}

var full_data = [], data = [], class_code = [], class_info = [], field_list = [], q, has_lab = [];
var weekdays = ['x', 'x', 'Mon', 'Tue', 'Wed', 'Thu ', 'Fri', 'Sat', 'Sun'];

function data_fetch() 
{
  // add first field Schedule
  field_list.push("Schedule");

  // fetch through courses
  for (let u = 0; u < full_data.length; u++) 
  {
    // course fetched to lines
    data = full_data[u].split("\n");

    // find course code and course class in schedule
    var it, sche_class = "";
    for (it = 0; it < data.length; it++)
    {
      var tmp = data[it].split(' ');
      if (tmp[0] == 'Nhóm') break;  // data[it - 1] = course code
    }
    for (let i = data.length - 1; i > 0; i--) 
    {
      var tmp = data[i].split('	');
      if (tmp[0].search(data[it - 1].split(' ')[0]) != -1) 
      {
        let j = i + 1;
        while (data[j].split(' ')[0] != 'Nhóm') j++;
        sche_class = data[j + 1].split('	')[0]; break; // course class in schedule
      }
    }

    // unknown schedule condition
    if (data[it + 3].split(' ')[0] == "Chưa") continue; // 'Chưa biết'
    
    // store course to field
    field_list.push(data[it - 1]);

    // check if course has Lab, default is 1
    if (data[it + 3].split(' ')[0] != data[it + 4].split(' ')[0] && data[it + 4].split(' ')[0] != "Chủ") has_lab[u] = 0;

    // get all course classes
    for (var i = it + 1; i < data.length; i += 3 + has_lab[u]) 
    {
      var tmp = data[i].split('	'), tmp1, tmp2;

      // end when fetched all class
      if (tmp[0] == 'Phiếu đăng ký') break;

      // get class code and info
      var l = tmp[0].split("_"), l1, l2 = "", d1, d2 = "", p1, p2 = "", r1, r2 = "", w1, w2 = "";
      l1 = l[0];
      tmp1 = data[i + 2].split('	').join(' ').split(' ');
      d1 = tmp1[1]; 
      if (d1 == 'nhật') d1 = '8';
      let j1 = 2, j2 = 2;
      while (tmp1[j1] == '-') j1++;
      p1 = tmp1[j1];
      r1 = tmp1[tmp1.length - 4];
      w1 = tmp1[tmp1.length - 1]; w2 = w1;
      if (has_lab[u]) 
      {
        l2 = l[1];
        tmp2 = data[i + 3].split('	').join(' ').split(' ');
        d2 = tmp2[1]; 
        if (d2 == 'nhật') d2 = '8';
        while (tmp2[j2] == '-') j2++;
        p2 = tmp2[j2];
        r2 = tmp2[tmp2.length - 4];
        w2 = tmp2[tmp2.length - 1];
        if (w1 < w2) 
        { 
          [w1, w2] = [w2, w1]; 
          [d1, d2] = [d2, d1]; 
          [p1, p2] = [p2, p1]; 
          [r1, r2] = [r2, r1]; 
          [tmp1, tmp2] = [tmp2, tmp1]; 
          [j1, j2] = [j2, j1];
        }
      }
      if (r1 == 'HANGOUT_TUONGTAC') r1 = 'GGMEET';
      if (r2 == 'HANGOUT_TUONGTAC') r2 = 'GGMEET';
      while (l1.length < 4) l1 = ' ' + l1;
      while (has_lab[u] && l2.length < 4) l2 = l2 + ' ';
      if (!class_code[0][u][+p1][+d1].includes(l1)) 
      {
        class_code[0][u][+p1][+d1].push(l1);
        class_info[0][u][+p1][+d1].push(l1 + " " + r1 + " " + w1);
      }
      if (has_lab[u] && !class_code[1][u][+p2][+d2].includes(l1 + l2)) 
      {
        class_code[1][u][+p2][+d2].push(l1 + "-" + l2);
        class_info[1][u][+p2][+d2].push(l1 + " " + r1 + " " + w1 + "\n" + l2 + " " + r2 + " " + w2);
      }
      if (tmp[0] == sche_class)
      {
        var s = l1 + " " + r1 + " " + w1;
        if (has_lab[u]) s += "\n" + l2 + " " + r2 + " " + w2;
        class_code[2][0][+p1][+d1].push(data[it - 1].slice(0, 6) + "(Lec)");
        class_info[2][0][+p1][+d1].push(s);
        if (has_lab[u])
        {
          class_code[2][0][+p2][+d2].push(data[it - 1].slice(0, 6) + "(Lab)");
          class_info[2][0][+p2][+d2].push(s);
        }
      }
    }
  }
}

function create_table(q) {
  let id = q ? q - 1 : 0;
  document.querySelectorAll('.cuc').forEach(e => e.remove());
  var newdiv = document.createElement("div");
  newdiv.className = "cuc";
  sche.appendChild(newdiv);
  let ks = 0, ke = has_lab[id];
  if (!q) ks = ke = 2;
  for (k = ks; k <= ke; k++) 
  {
    var tbl = document.createElement('table');
    tbl.className = 'mon';
    for (let i = 0; i <= 17; i++) 
    {
      const tr = tbl.insertRow();
      for (let j = 1; j <= 8; j++) 
      {
        const td = tr.insertCell();
        var celltext, celltextpop, tmp = '';
        if (!i && !(j - 1)) if (!k) tmp = 'Lec'; else if (k == 1) tmp = 'Lab'; else tmp = 'Sche'
        if (!i && j - 1) tmp = weekdays[j];
        if (i && !(j - 1)) tmp = i;
        if (i && j - 1) for (let z = 0; z < class_code[k][id][i][j].length; z++) tmp += class_code[k][id][i][j][z] + "\n";
        celltext = document.createTextNode(tmp);
        td.style = "white-space: pre-line;"
        td.appendChild(celltext);
        if (!class_info[k][id][i][j].length) continue;
        td.className = "haspopup";
        tmp = '';
        for (let z = 0; z < class_info[k][id][i][j].length; z++) {
          if (z) tmp += "\n";
          tmp += class_info[k][id][i][j][z] + "\n";
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

// ======================================= Submit Button ======================================= //
submit.onclick = function () 
{
  var cache_string = "", tmp = inp_data.getElementsByTagName('textarea');

  // no courses
  if (tmp.length == 0) return;    

  // decode cache & get input course information
  for (var i = 0; i < tmp.length; i++) 
  {
    full_data.push(tmp[i].value);
    cache_string += tmp[i].value + "@";
  }
  
  // store cache
  localStorage.setItem("cache", cache_string);

  // remove input form field
  document.querySelectorAll('.wrapper').forEach(e => e.remove());

  // initialize arrays
  for (let z = 0; z < 3; z++) // 0: lec, 1: lab, 2: schedule
  {
    class_code[z] = []; class_info[z] = [];
    for (let k = 0; k <= full_data.length; k++) // data.length = number of courses
    {
      class_code[z][k] = []; class_info[z][k] = [];
      has_lab.push(1);
      for (let i = 0; i < 20; i++) // periods
      {
        class_code[z][k][i] = []; class_info[z][k][i] = [];
        for (let j = 0; j < 10; j++) // weekdays
        {
          class_code[z][k][i][j] = []; class_info[z][k][i][j] = [];
        }
      }
    }
  }

  // fetch data
  data_fetch();

  // create field buttons
  var newdiv = document.createElement("div");
  newdiv.id = "field";
  sche.appendChild(newdiv);
  for (let i = 0; i < field_list.length; i++) 
  {
    var button = document.createElement('button');
    button.className = "field_btn";
    button.innerText = field_list[i];
    button.onclick = function () {create_table(i);}
    document.getElementById("field").appendChild(button);
  }
  newdiv = document.createElement("div");

  // set field button selection
  let list = document.querySelectorAll(".field_btn");
  function activeLink() 
  {
    list.forEach((item) => item.classList.remove('active'));
    this.classList.add('active');
  }
  list.forEach((item) => item.addEventListener('click', activeLink));

  // add a little note: ICT = BKPT + 5
  newdiv.id = "note";
  sche.appendChild(newdiv);
  newdiv.appendChild(document.createTextNode("*ICT = BKPT +5."));

  // create popup
  document.addEventListener('click', ({ target }) => 
  {
    var popup = target.closest('.haspopup');
    document.getElementById('cover').style.visibility = 'hidden';
    document.querySelectorAll('.haspopup').forEach(p => p.classList.remove('show'));
    if (popup) 
    {
      document.getElementById('cover').style.visibility = 'visible';
      popup.classList.add('show');
    }
  });
}
