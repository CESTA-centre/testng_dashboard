
var GLOBALTXT = "";

function getFileContents()
{
  var file;
  var lines;
  var fileContents;
  var disp_txt;
  let files = input.files;

  if (files.length == 0) return;

  file = files[0];
  let reader = new FileReader();
  reader.onload = (e) => {
    fileContents = e.target.result;
    GLOBALTXT = fileContents;
    document.getElementById("getFile").disabled = false;
  };

  reader.onerror = (e) => alert(e.target.error.name);  
  reader.readAsText(file);
}


function getData()
{
  var txt;
  var p = document.getElementById("selection");
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(GLOBALTXT,"text/xml");

/* ETS attributes */
  var name = xmlDoc.getElementsByTagName("suite")[0].getAttribute('name');
  txt = "> Nom de la suite : " + name;

/* Session date */
  var date = new Date((xmlDoc.getElementsByTagName("suite"))[0].getAttribute('finished-at'));
  txt += "\n> Session réalisée le " + date.toLocaleDateString() + " à " + date.toLocaleTimeString() + ".\n";

/* General results */
  var selected_field = xmlDoc.getElementsByTagName("testng-results");
  var total_tests = selected_field[0].getAttribute('total');
  var skipped_tests = selected_field[0].getAttribute('skipped');
  var failed_tests = selected_field[0].getAttribute('failed');
  var passed_tests = selected_field[0].getAttribute('passed');

  var percent_skipped = (skipped_tests / total_tests) * 100;
  var percent_failed = (failed_tests / total_tests) * 100;
  var percent_passed = (passed_tests / total_tests) * 100;

  txt += "Total de tests effectués : " + total_tests;
  txt += "\nTotal de tests ignorés : " + skipped_tests + " (" + percent_skipped.toFixed(2) + "%)";
  txt += "\nTotal de tests échoués : " + failed_tests + " (" + percent_failed.toFixed(2) + "%)";
  txt += "\nTotal de tests réussis : " + passed_tests + " (" + percent_passed.toFixed(2) + "%)";

  p.innerText = txt;

  drawPie(true, document.getElementById("chart-area"), passed_tests, skipped_tests, failed_tests);

//---------------------------------------
/* Results per test */
  var divResults = document.getElementById("results_details");
  gen_test = xmlDoc.getElementsByTagName("test");

  var divSuiteTitle = document.createElement("DIV");
  divSuiteTitle.setAttribute("class", "w3-grey");
  var suiteName = document.createElement("H4");
  suiteName.setAttribute("style", "color:white");
  suiteName.setAttribute("style", "text-align:center");
  var etsname = document.createTextNode(xmlDoc.getElementsByTagName("suite")[0].getAttribute("name"));    
  suiteName.appendChild(etsname);  
  divSuiteTitle.appendChild(suiteName);
  divResults.appendChild(divSuiteTitle);

  for(i=0; i< gen_test.length; i++){
    // Création de la boîte qui contiendra les résultats pour une classe
    var summaryTextNode = document.createTextNode("  " + gen_test[i].getAttribute('name'));    
    var icon = document.createElement("I");
    icon.setAttribute("class", "fas fa-cogs");
    var h = document.createElement("H4");
    var hresStat = document.createElement("H4");
    h.appendChild(summaryTextNode);   
    var divSummary = document.createElement("SUMMARY");
    divSummary.appendChild(icon);
    divSummary.appendChild(hresStat);
    divSummary.appendChild(h);
    var divDetails = document.createElement("DETAILS");
    divDetails.setAttribute("id", "details_box"+i.toString());
    divDetails.appendChild(divSummary);

    divResults.insertBefore(divDetails, null); // On ajoute la boîte contenant les résultats pour une classe dans la boîte divResults qui liste l'ensemble des résultats pour toutes les classes

    
    //--------------------
    /* Results for each test method of class */
    var pass_nb = 0;
    var skip_nb = 0;
    var fail_nb = 0;
    var total = 0;
    var passed_list = "";
    var passed_namesArray = [];
    var passed_description = [];
    var failed_list = "";
    var failed_namesArray = [];
    var failed_description = [];
    var failed_reasonsArray = [];
    var skip_list = "";
    var skip_namesArray = [];
    var skip_reasonsArray = [];
    var skip_description = [];
    var test_method = gen_test[i].getElementsByTagName("test-method"); // Récupération des résultats pour chaque méthode de test réalisée pour la classe

  //Recherche d'une description pour le test (=recherche de son groupe)    
  var requirementDescr = "";
    var methodsign = [];
    if(test_method.length>0){
      methodsign = (test_method[0].parentNode).getAttribute('name');
      var corr_meth = xmlDoc.querySelectorAll("[class=\""+methodsign+"\"]");
      if(corr_meth.length>0){
        requirementDescr = (corr_meth[0].parentNode).getAttribute('name');
      }
    }

    for(j=0; j< test_method.length; j++){

      status = test_method[j].getAttribute('status');

      if(status == "PASS"){
        pass_nb++;
        passedName = test_method[j].getAttribute('name');
        passed_list +=  passedName + "<br>";
        passed_namesArray.push(passedName);
        var desc = test_method[j].getAttribute('description');
        if(desc==null)
          desc = "No description";
        passed_description.push(desc);
      }

      if(status == "SKIP"){
        skip_nb++;
        skipName = test_method[j].getAttribute('name');
        skip_list += skipName + "<br>";
        skip_namesArray.push(skipName);

        var testMethodChilds = test_method[j].childNodes;
        var skiptestMethodException;
        for(e=0; e<testMethodChilds.length; e++){
          if(testMethodChilds[e].nodeName == "exception"){
            skiptestMethodException = testMethodChilds[e];
            break;
          }
        }
        var skipmessage = skiptestMethodException.getElementsByTagName("message")[0].innerHTML;
        skip_reasonsArray.push(skipmessage);
        var desc = test_method[j].getAttribute('description');
        if(desc==null)
          desc = "No description";
        skip_description.push(desc);
      }

      if(status == "FAIL"){
        fail_nb++;
        failedName = test_method[j].getAttribute('name');
        failed_list +=  failedName + "<br>";
        failed_namesArray.push(failedName);

        testMethodChilds = test_method[j].childNodes;
        var testMethodException;
        for(e=0; e<testMethodChilds.length; e++){
          if(testMethodChilds[e].nodeName == "exception"){
            testMethodException = testMethodChilds[e];
            break;
          }
        }
        var message = testMethodException.getElementsByTagName("message")[0].innerHTML;
        failed_reasonsArray.push(message);
        var desc = test_method[j].getAttribute('description');
        if(desc==null)
          desc = "No description";
        failed_description.push(desc);
      }
      total++;
    }
  
    var reqObjectBox = document.createElement("DIV");
    reqObjectBox.setAttribute("class", "w3-container");   
    divDetails.insertBefore(reqObjectBox, null);
    hr = document.createElement("HR");
    var pReqObj = document.createElement("P");
    pReqObj.innerHTML = requirementDescr;
    divDetails.insertBefore(pReqObj, null);


    var graphicsBox = document.createElement("DIV");
    graphicsBox.setAttribute("class", "w3-container");   
    divDetails.insertBefore(graphicsBox, null);
    hr = document.createElement("HR");
    divDetails.insertBefore(hr, null);

    // Dessin des pourcentages de réussite pour chaque classe de test
    var detailedBarsBox = document.createElement("DIV");  
    drawEachDetailBar(hresStat, icon, total, pass_nb, skip_nb, fail_nb, graphicsBox, detailedBarsBox);
    divResults.appendChild(document.createElement("HR"));

    if(pass_nb > 0){
      var summaryPassNode = document.createTextNode("  Voir les tests réussis (" + pass_nb + ")");    
      var h5 = document.createElement("H5");
      h5.appendChild(summaryPassNode);   
      var divSummaryPass = document.createElement("SUMMARY");
      divSummaryPass.appendChild(h5);
      var divPassDetails = document.createElement("DETAILS");
      divPassDetails.appendChild(divSummaryPass);
      divDetails.insertBefore(divPassDetails, null);
      
      var enteteValues = ["Nom de la méthode", "Description"];
      var table = createArray([enteteValues, passed_namesArray, passed_description]);
      divPassDetails.insertBefore(table, null);
      divPassDetails.insertBefore(document.createElement("HR"), null);     
    }

    if(fail_nb > 0){
      var summaryFailNode = document.createTextNode("  Voir les tests échoués (" + fail_nb + ")");    
      var h5 = document.createElement("H5");
      h5.appendChild(summaryFailNode);   
      var divSummaryFail = document.createElement("SUMMARY");
      divSummaryFail.appendChild(h5);
      var divFailDetails = document.createElement("DETAILS");
      divFailDetails.appendChild(divSummaryFail);
      divDetails.insertBefore(divFailDetails, null);
      
      var enteteValues = ["Nom de la méthode", "Description", "Raison de l'échec"];
      var table = createArray([enteteValues, failed_namesArray, failed_description, failed_reasonsArray]);
      divFailDetails.insertBefore(table, null);
      divFailDetails.insertBefore(document.createElement("HR"), null);     
    }

    if(skip_nb > 0){
      var summaryFailNode = document.createTextNode("  Voir les tests ignorés (" + skip_nb + ")");    
      var h5 = document.createElement("H5");
      h5.appendChild(summaryFailNode);   
      var divSummarySkip = document.createElement("SUMMARY");
      divSummarySkip.appendChild(h5);
      var divSkipDetails = document.createElement("DETAILS");
      divSkipDetails.appendChild(divSummarySkip);
      divDetails.insertBefore(divSkipDetails, null);

      var skipenteteValues = ["Nom de la méthode", "Description", "Raison du saut"];
      var skiptable = createArray([skipenteteValues, skip_namesArray, skip_description, skip_reasonsArray]);
      divSkipDetails.insertBefore(skiptable, null);

    }

  }

}


function drawEachDetailBar(title, icon, total, pass_nb, skip_nb, fail_nb, container, detailContainer)
{

  var barsContainer = document.createElement("DIV");
  barsContainer.setAttribute("class", "w3-center");

  var barsContainerLeft = document.createElement("DIV");
  barsContainerLeft.setAttribute("class", "w3-third");
  var barsContainerCenter = document.createElement("DIV");
  barsContainerCenter.setAttribute("class", "w3-third");
  barsContainerCenter.setAttribute("style", "padding: 0px 10px 0px 10px");
  var barsContainerRight = document.createElement("DIV");
  barsContainerRight.setAttribute("class", "w3-third");


  var divPassContainer = document.createElement("DIV");
  //divPassContainer.setAttribute("style", "padding:0px 0px 10px 0px");
  var divPass = document.createElement("DIV");
  divPass.setAttribute("class", "w3-grey");
  divPassContainer.appendChild(divPass);
  barsContainerLeft.appendChild(divPassContainer);

  var divSkipContainer = document.createElement("DIV");
  //divSkipContainer.setAttribute("style", "padding:0px 0px 10px 0px");
  var divSkip = document.createElement("DIV");
  divSkip.setAttribute("class", "w3-grey");
  divSkipContainer.appendChild(divSkip);
  barsContainerCenter.appendChild(divSkipContainer);

  var divFailContainer = document.createElement("DIV");
  //divFailContainer.setAttribute("style", "padding:0px 0px 10px 0px");
  var divFail = document.createElement("DIV");
  divFail.setAttribute("class", "w3-grey");
  divFailContainer.appendChild(divFail);
  barsContainerRight.appendChild(divFailContainer);

  barsContainer.appendChild(barsContainerLeft);
  barsContainer.appendChild(barsContainerCenter);
  barsContainer.appendChild(barsContainerRight);

  var res = "  [PASS]";
  icon.setAttribute("style", "color:green");
  if(skip_nb > 0){
    icon.setAttribute("style", "color:orange");
    res = "  [SKIP]";
  }
  if(fail_nb > 0){
    icon.setAttribute("style", "color:red");
    res = "  [FAIL]";
  }
  title.appendChild(document.createTextNode(res));

  detailContainer.appendChild(barsContainer);
  drawBars(false, 18, 14, divPass, divSkip, divFail, (pass_nb/total)*100, (skip_nb/total)*100, (fail_nb/total)*100);

  container.appendChild(detailContainer);

}


let input = document.querySelector('input');
input.addEventListener("change", function(){getFileContents()}, false);




