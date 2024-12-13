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

// ======================================= Paste Button  ======================================= //
document.getElementById('paste_btn').addEventListener('click', function() 
{
  add_course.click();
  navigator.clipboard.readText().then(function(text) 
  {
    // Paste the clipboard text into the textarea
    var cur_course = inp_data.getElementsByTagName('textarea');
    if (cur_course.length > 0) cur_course[(cur_course.length) - 1].value = text;
  })
});

// ===================================== Del Course Button ===================================== //
del_course.onclick = function () 
{
  var cur_course = inp_data.getElementsByTagName('textarea');
  if (cur_course.length > 0) inp_data.removeChild(cur_course[(cur_course.length) - 1]);
}

// ======================================== Fetch Data  ======================================== //
var full_data = [], data = [], class_code = [], class_info = [], field_list = [], has_lab = [];

function data_fetch() 
{
  // add first field Schedule
  field_list.push("Schedule");

  // fetch through courses
  for (let u = 1; u <= full_data.length; u++) // course id starts at 1, let sche is 0
  {
    // course fetched to lines
    data = full_data[u - 1].split("\n"); // full_data index starts at 0

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
    
    // store course code to field
    field_list.push(data[it - 1]);

    // check if course has Lab
    if (data[it + 4].split(' ').length > 1) has_lab[u] = 1;

    // get all course classes
    for (var i = it + 1; i < data.length; i += 3 + has_lab[u]) 
    {
      var tmp = data[i].split('	');

      // end when fetched all class
      if (tmp[0] == 'Phiếu đăng ký') break;

      // get info
      var tmp1, tmp2, l1, l2 = "", d1, d2 = "", p1, p2 = "", r1, r2 = "", w1, w2 = "", j1 = 2, j2 = 2;
      tmp1 = data[i + 2].split('	').join(' ').split(' ');
      l1 = tmp[0].split("_")[0];                  // class code of lec
      d1 = (tmp1[1] == 'nhật') ? '8' : tmp1[1];   // weekday of lec
      while (tmp1[j1] == '-') j1++;
      p1 = tmp1[j1];                              // start period of lec
      r1 = tmp1[tmp1.length - 4];                 // room of lec
      w1 = tmp1[tmp1.length - 1]; w2 = w1;        // week of lec
      if (has_lab[u]) 
      {
        tmp2 = data[i + 3].split('	').join(' ').split(' ');
        l2 = tmp[0].split("_")[1];                // class code of lab
        d2 = (tmp2[1] == 'nhật') ? '8' : tmp2[1]; // weekday of lec
        while (tmp2[j2] == '-') j2++;
        p2 = tmp2[j2];                            // start period of lab
        r2 = tmp2[tmp2.length - 4];               // room of lec
        w2 = tmp2[tmp2.length - 1];               // week of lec
        if (w1 < w2) // swap lec and lab if need
        {
          [tmp1, tmp2] = [tmp2, tmp1];
          [d1, d2] = [d2, d1];
          [p1, p2] = [p2, p1];
          [r1, r2] = [r2, r1];
          [w1, w2] = [w2, w1];
          [j1, j2] = [j2, j1];
        }
      }

      // fix info
      if (r1 == 'HANGOUT_TUONGTAC') r1 = 'GGMEET';
      if (r2 == 'HANGOUT_TUONGTAC') r2 = 'GGMEET';
      while (l1.length < 4) l1 = ' ' + l1;
      while (has_lab[u] && l2.length < 4) l2 = l2 + ' ';

      // store class code and info to arrays
      if (!class_code[0][u][+p1][+d1].includes(l1)) // Lec
      {
        class_code[0][u][+p1][+d1].push(l1);
        class_info[0][u][+p1][+d1].push(l1 + " " + r1 + " " + w1);
      }
      if (has_lab[u] && !class_code[1][u][+p2][+d2].includes(l1 + l2)) // Lab
      {
        class_code[1][u][+p2][+d2].push(l1 + "-" + l2);
        class_info[1][u][+p2][+d2].push(l1 + " " + r1 + " " + w1 + "\n" + l2 + " " + r2 + " " + w2);
      }
      if (tmp[0] == sche_class) // sche
      {
        var s = l1 + " " + r1 + " " + w1; // lec info
        if (has_lab[u]) s += "\n" + l2 + " " + r2 + " " + w2; // lab info if has
        class_code[0][0][+p1][+d1].push(data[it - 1].slice(0, 6) + "(Lec)");
        class_info[0][0][+p1][+d1].push(s);
        if (has_lab[u])
        {
          class_code[0][0][+p2][+d2].push(data[it - 1].slice(0, 6) + "(Lab)");
          class_info[0][0][+p2][+d2].push(s);
        }
      }
    }
  }
}

// ======================================= Create Tables ======================================= //
var weekdays = ['x', 'x', 'Mon', 'Tue', 'Wed', 'Thu ', 'Fri', 'Sat', 'Sun'];

function create_table(id) 
{
  // remove all existing tables
  document.querySelectorAll('.tbl_field').forEach(e => e.remove());

  // create a new div for tables
  var newdiv = document.createElement("div");
  newdiv.className = "tbl_field";
  sche.appendChild(newdiv);

  // create corresponding table
  for (k = 0; k <= has_lab[id]; k++) 
  {
    let tbl = document.createElement('table');
    tbl.className = 'data_tbl';
    for (let i = 0; i <= 17; i++) // rows
    {
      const tr = tbl.insertRow();
      for (let j = 1; j <= 8; j++) // columns 
      {
        const td = tr.insertCell();
        var celltext, celltextpop, tmp = '';
        if (!i && !(j - 1)) if (!id) tmp = 'Sche'; else if (!k) tmp = 'Lec'; else tmp = 'Lab';
        if (!i &&   j - 1)  tmp = weekdays[j];
        if ( i && !(j - 1)) tmp = i;
        if ( i &&   j - 1)  
          for (let z = 0; z < class_code[k][id][i][j].length; z++) 
            tmp += class_code[k][id][i][j][z] + "\n";
        celltext = document.createTextNode(tmp);
        td.style = "white-space: pre-line;"
        td.appendChild(celltext);
        if (!class_info[k][id][i][j].length) continue;
        td.className = "haspopup";
        tmp = '';
        for (let z = 0; z < class_info[k][id][i][j].length; z++) 
          tmp += class_info[k][id][i][j][z] + "\n";
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
      has_lab.push(0);
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

  // add a little note: ICT = BKPT + 5.
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
