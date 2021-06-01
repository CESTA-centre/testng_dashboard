//===========================================================================================
// ~~ PIE CHART (with Chart.js) ~~ 
function drawPie(displayBool, where, passed_tests, skipped_tests, failed_tests) { 

  new Chart(where, {
    type: 'pie',
    data: {
      labels: ["Réussis", "Ignorés", "Echoués"],
      datasets: [{
        label: "Synthèse globale",
        backgroundColor: [window.chartColors.green, window.chartColors.orange, window.chartColors.red],
        data: [passed_tests, skipped_tests, failed_tests]
      }]
    },
    options: {
      title: {
        display: displayBool,
        text: 'Résultats des tests'
      }
    }
  });
}


//===========================================================================================
// ~~ PERCENTAGE BARS (w3 css) ~~

function drawBars(padding, height, fontsize, wherePass, whereSkip, whereFail, percent_passed, percent_skipped, percent_failed) {

  var pad = "";
  if(padding){
    pad = " w3-padding";
  }

  var passBar = document.createElement("div");
  passBar.setAttribute("class", "w3-container w3-center w3-green" + pad);
  passBar.setAttribute("style", "height:"+height+"px;width:"+percent_passed+"%;font-size:"+fontsize+"px");
  passBar.appendChild(document.createTextNode(Math.round(percent_passed) + "%"));
  var divPass = wherePass;
  divPass.appendChild(passBar);

  var skipBar = document.createElement("div");
  skipBar.setAttribute("class", "w3-container w3-center w3-orange" + pad);
  skipBar.setAttribute("style", "height:"+height+"px;width:"+percent_skipped+"%;font-size:"+fontsize+"px");
  skipBar.appendChild(document.createTextNode(Math.round(percent_skipped) + "%"));
  var divSkip = whereSkip;
  divSkip.appendChild(skipBar);

  var failBar = document.createElement("div");
  failBar.setAttribute("class", "w3-container w3-center w3-red" + pad);
  failBar.setAttribute("style", "height:"+height+"px;width:"+percent_failed+"%;font-size:"+fontsize+"px");
  failBar.appendChild(document.createTextNode(Math.round(percent_failed) + "%"));
  var divFail = whereFail;
  divFail.appendChild(failBar);

}



//===========================================================================================
// ~~ ARRAY ~~

function createArray(data){
/* Array for failed or skipped tests */
    
  var tableDiv = document.createElement("TABLE");
  //tableContainer.insertBefore(tableDiv, null);

  //Data est un tableau de tableaux : contient les valeurs de toutes les colonnes
  //i = numéro de la colonne, j = valeurs de la colonne

  //Entête
  var tr_head = document.createElement("TR");
  tableDiv.insertBefore(tr_head, null);

  for(e=0; e < data[0].length; e++){ //Parcours des colonnes
    var thd = document.createElement("TH");
    thd.appendChild(document.createTextNode(data[0][e]));  
    tr_head.insertBefore(thd, null);

  }

  for(j=0; j< data[1].length; j++){ //Parcours des colonnes  
    var tr = document.createElement("TR");
    for(k=1; k<data.length; k++){      
      var td = document.createElement("TD");
      var p = document.createElement("P");
      p.innerText = data[k][j].replace("<![CDATA[", "").replace("]]>", "");
      td.appendChild(p);
      tr.insertBefore(td, null);
    }
    tableDiv.insertBefore(tr, null);
  }

  return tableDiv;
}



