/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9613778705636743, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7608695652173914, 500, 1500, ""], "isController": true}, {"data": [1.0, 500, 1500, "-1"], "isController": false}, {"data": [1.0, 500, 1500, "-2"], "isController": false}, {"data": [1.0, 500, 1500, "-3"], "isController": false}, {"data": [1.0, 500, 1500, "-4"], "isController": false}, {"data": [1.0, 500, 1500, "-5"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "-6"], "isController": false}, {"data": [1.0, 500, 1500, "-7"], "isController": false}, {"data": [1.0, 500, 1500, "-8"], "isController": false}, {"data": [1.0, 500, 1500, "-9"], "isController": false}, {"data": [1.0, 500, 1500, "-10"], "isController": false}, {"data": [1.0, 500, 1500, "-11"], "isController": false}, {"data": [1.0, 500, 1500, "-12"], "isController": false}, {"data": [1.0, 500, 1500, "-13"], "isController": false}, {"data": [1.0, 500, 1500, "-17"], "isController": false}, {"data": [0.9347826086956522, 500, 1500, "-18"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 410, 0, 0.0, 111.90243902439022, 39, 735, 104.5, 223.1000000000003, 255.79999999999995, 541.2199999999987, 82.49496981891348, 27.963680520623743, 38.470274773641854], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["", 69, 0, 0.0, 577.4637681159419, 39, 1903, 239.0, 1512.0, 1639.0, 1903.0, 13.548007068525427, 23.1011774739839, 31.572325066267425], "isController": true}, {"data": ["-1", 30, 0, 0.0, 69.39999999999999, 43, 169, 49.5, 128.0, 168.45, 169.0, 6.753714542998649, 1.5235430267897343, 3.185589965105808], "isController": false}, {"data": ["-2", 27, 0, 0.0, 139.44444444444443, 117, 246, 123.0, 228.2, 245.6, 246.0, 7.137192704203013, 3.41190234271742, 3.303739591593973], "isController": false}, {"data": ["-3", 30, 0, 0.0, 150.26666666666665, 117, 284, 132.5, 261.10000000000014, 278.5, 284.0, 6.683002895967922, 3.193570394297171, 3.100025757406995], "isController": false}, {"data": ["-4", 30, 0, 0.0, 82.13333333333333, 39, 425, 44.0, 235.70000000000033, 365.5999999999999, 425.0, 6.963788300835654, 1.9488179694753947, 3.2438740424791086], "isController": false}, {"data": ["-5", 27, 0, 0.0, 136.5555555555556, 119, 215, 123.0, 209.0, 212.6, 215.0, 7.142857142857142, 3.4742890211640214, 3.2854352678571432], "isController": false}, {"data": ["-6", 30, 0, 0.0, 172.49999999999997, 71, 730, 106.5, 302.30000000000007, 546.2999999999997, 730.0, 6.715916722632639, 1.8363834788448625, 3.11529340161182], "isController": false}, {"data": ["-7", 30, 0, 0.0, 49.633333333333326, 44, 68, 48.0, 57.800000000000004, 63.599999999999994, 68.0, 6.947660954145437, 1.5672946097730431, 3.304209848309403], "isController": false}, {"data": ["-8", 28, 0, 0.0, 143.1785714285714, 118, 319, 124.5, 170.4000000000001, 278.0499999999997, 319.0, 6.690561529271207, 3.2547416367980886, 3.0773969534050183], "isController": false}, {"data": ["-9", 30, 0, 0.0, 48.900000000000006, 44, 94, 46.5, 53.800000000000004, 73.64999999999998, 94.0, 6.952491309385863, 1.5683842699884123, 3.3065070973348782], "isController": false}, {"data": ["-10", 26, 0, 0.0, 132.34615384615384, 118, 212, 121.0, 209.3, 211.3, 212.0, 7.1330589849108375, 3.4759730795610424, 3.2809284979423867], "isController": false}, {"data": ["-11", 27, 0, 0.0, 48.88888888888889, 44, 58, 47.0, 55.599999999999994, 58.0, 58.0, 7.269789983844912, 1.6399623889337642, 3.4503104806138936], "isController": false}, {"data": ["-12", 26, 0, 0.0, 46.8076923076923, 44, 51, 47.0, 49.3, 50.65, 51.0, 7.276798208788134, 1.6415433459277917, 3.4323179051217463], "isController": false}, {"data": ["-13", 23, 0, 0.0, 149.82608695652175, 118, 330, 122.0, 237.0, 311.7999999999997, 330.0, 6.786662732369431, 3.21697956624373, 3.181248155798171], "isController": false}, {"data": ["-17", 23, 0, 0.0, 90.04347826086955, 39, 347, 43.0, 203.0, 318.1999999999996, 347.0, 6.944444444444444, 1.891205276268116, 3.2212999131944446], "isController": false}, {"data": ["-18", 23, 0, 0.0, 249.52173913043478, 78, 735, 238.0, 556.2, 699.7999999999995, 735.0, 6.851355376824546, 1.8734174858504615, 3.104520405123622], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 410, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
