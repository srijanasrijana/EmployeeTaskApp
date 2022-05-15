/* theme */
var gvKonamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
var gvKonamiCurrent = 0;
var gvDarkMode = parseInt(localStorage.getItem('dark-mode')) || 0;

var alert = function (title, content) {
    let theme = 'info';
    if (title && title.toLowerCase().indexOf('warning') > -1) theme = 'warning';
    if (title && title.toLowerCase().indexOf('error') > -1) theme = 'error';
    if (title && title.toLowerCase().indexOf('success') > -1) theme = 'success';
    toastr[theme](content);
};

ExportExcel = function (ExceltableName, ExcelFileName, Message, Column) {
    $(ExceltableName).DataTable({

        responsive: true,
        //fixedHeader: true,
        dom: 'Bfrtip',

        buttons: [
            //                                                                'copyHtml5',
            {
                extend: 'excel',
                message: Message,
                exclude: ".Preview",
                //message : "FUND COLLECTION DETAILS",
                //                                                                    customize: function ( xlsx ) {
                //                                                                        var sheet = xlsx.xl.worksheets['sheet1.xml'];
                //                                                                        $('c[r=A1] t', sheet).text( "Date From : "+ko.toJS(self.FromDate())+" To : "+ko.toJS(self.ToDate()) );
                //                                    
                //                                                                        $('row:first c', sheet).attr( 's', '2' ); // first row is bold
                //                                                                        $('c[r=A2]', sheet).attr('s', '2');
                //                                                                    },

                filename: function () {
                    var dateObj = new Date();
                    var month = dateObj.getUTCMonth() + 1; //months from 1-12
                    var day = dateObj.getUTCDate();
                    var year = dateObj.getUTCFullYear();
                    newdate = year + "/" + month + "/" + day;
                    return ExcelFileName + newdate;
                },
                exportOptions: {
                    orthogonal: 'sort',
                    columns: Column
                },
                customizeData: function (data) {
                    for (var i = 0; i < data.body.length; i++) {
                        data.body[i][1] = '\u200C' + data.body[i][1];

                    }
                },



            },
            //                                                                {
            //                                                                    extend: 'csvHtml5',
            //                                                                    message : Message ,
            //                                                                   
            //                                                                    //message : "FUND COLLECTION DETAILS",
            ////                                                                    customize: function ( data ) {
            ////                                                                         for (var i=0; i<data.body.length; i++){
            ////                                                                             data.body[i][1] = '\u200C' + data.body[i][1];
            ////                                                                             
            ////                                                                        }
            ////                                                                    },
            //                                    
            //                                                                     filename: function(){
            //                                                                        var dateObj = new Date();
            //                                                                        var month = dateObj.getUTCMonth() + 1; //months from 1-12
            //                                                                        var day = dateObj.getUTCDate();
            //                                                                        var year = dateObj.getUTCFullYear();
            //                                                                        newdate = year + "/" + month + "/" + day;
            //                                                                        return ExcelFileName + newdate;
            //                                                                    },
            //                                                                    exportOptions: {
            //                                                                        orthogonal: 'sort',
            //                                                                        columns: Column,
            //                                                                        
            //                                                                        charSet: "utf-8",
            //                                                                        format: {
            //                                                                        body: function ( data, row, column, node ) {                      
            //                                                                             if(column == 1 ) {
            //                                                                                data = '\u200C' + data +"\t";
            //                                                                            }
            //                                                                            return data;
            //                                                                        }
            //                                                                    },
            //                                                                    },
            //                                                                    customizeData: function ( data ) {
            //                                                                         for (var i=0; i<data.body.length; i++){
            //                                                                             data.body[i][1] = '\u200C' + data.body[i][1];
            //                                                                             
            //                                                                        }
            //                                                                    },       
            //                                                                    

            //                                   
            //                                                                 }
        ]
    });
}

var jAlert = function (title, content, cb) {
    let theme = 'blue';
    if (title && title.toLowerCase().indexOf('warning') > -1) theme = 'red';
    if (title && title.toLowerCase().indexOf('error') > -1) theme = 'dark_red';
    if (title && title.toLowerCase().indexOf('success') > -1) theme = 'green';
    $.jAlert({
        'title': title,
        'content': content,
        'theme': theme,
        'showAnimation': 'fadeIn',
        'hideAnimation': 'fadeOut',
        'animationTimeout': 100,
        'btns': { 'text': 'close', 'theme': theme },
        'onClose': cb,
        "positionClass": "toast-top-center",
    });
};


function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-')
}

function convertToFixTwo(data) {
    return data.toFixed(4)
}

function postReq(url, data, constr, arr, options) {
    debugger
    let fnClear = options?.fnClear || null,
        cb = options?.cb || null;
    redir = options?.redir || null;

    $.ajaxSetup({ async: false });
    return $.post(url, data, function (res, status, xhr) {
        res = JSON.parse(res);
        if (!res.IsSuccess)
            alert("Warning!", res.Message);
        else {
            if (!redir) {
                if (!arr) {
                    if (constr) {
                        constr(res.OutputParam);
                    }
                    alert("Success!", res.Message);
                }
                else {
                    if (res.Message) {
                        alert('Success!', res.Message);
                    }
                    arr(res.ResponseData);
                }
                try {
                    if (fnClear) fnClear();
                } catch (e) {
                    console.error('fnClear must be a function.');
                }
                try {
                    if (cb) cb();
                } catch (e) {
                    console.error('cb must be a function.');
                }
            } else {
                localStorage.setItem('initialMessage', res.Message);
                window.location = redir;
            }
        }
        //})        .done(() => {
        //$('#loader').hide();
    }).fail((xhr, status, message) => {
        jAlert(status, message);
        //$('#loader').hide();
    });
}

function getReq(url, data, constr, arr, options) {
    let fnClear = options?.fnClear || null,
        redir = options?.redir || null;
    $.ajax({
        dataType: 'json',
        async: false,
        url,
        data,
        contentType: 'application/json; charset= utf-8',
        success: function (result, status, xhr) {
            // console.log(xhr.status);
            //var res = JSON.parse(result);
            var res = result;
            if (!res.IsSuccess)
                alert("Warning!", res.Message);
            else {
                if (!redir) {
                    if (!arr && result.Message) {
                        alert("Success!", res.Message, redir);
                    } else if (constr) {
                        try {
                            arr(res.ResponseData.map(x => new constr(x)));
                        } catch (e) {
                            arr(new constr(res.ResponseData));
                        }
                    } else {
                        if (res.Message) {
                            alert(res.Message, 'Success!', redir);
                        }
                        arr(res.ResponseData);
                    }
                    if (fnClear) fnClear();
                } else {
                    localStorage.setItem('initialMessage', res.Message);
                    window.location = redir;
                }
            }

        }
    });
}




function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    gvDarkMode = 1 - gvDarkMode;
    localStorage.setItem('dark-mode', gvDarkMode);
}

function popupFeedbackModal() {
    $('#ModalFeedback').modal('show');
}

function saveFeedback() {
    postReq('/Common/Dashboard/SaveFeedback', { feedback: document.getElementById('txtFeedback').value });
    $('#ModalFeedback').modal('hide');
}

function dispChangeLog(log) {
    console.log(log);
}

function checkVersion() {
    let currVersion;
    try {
        currVersion = document.getElementById('version-no').innerText;
    } catch (e) {
        return;
    }
    let lastVersion = localStorage.getItem('versionNo');
    console.log(lastVersion, currVersion);
    if (lastVersion != currVersion) {
        // localStorage.setItem('versionNo', currVersion);
        getReq('/Common/Dashboard/GetChangeLog', { version: lastVersion }, null, dispChangeLog);
    }
}

function showInitialToast() {
    let initialMessage = localStorage.getItem('initialMessage');
    if (initialMessage) {
        alert('success', initialMessage);
        localStorage.setItem('initialMessage', '');
    }
}

keyHandler = e => {
    if (gvKonamiPattern.indexOf(e.key) < 0 || event.key != gvKonamiPattern[gvKonamiCurrent]) {
        gvKonamiCurrent = 0;
        return;
    }
    gvKonamiCurrent++;
    if (gvKonamiPattern.length === gvKonamiCurrent) {
        gvKonamiCurrent = 0;
        toggleTheme();
    }
};

function getMenu() {
  
    Openloader();
    $.ajax({
        url: '/Common/Menu',
        success: function (result) {
            if (result.isSuccess) {
                var html = "";
                i = 0;
                //result.ResponseData = JSON.parse(result)

                $.each(result.responseData, function (index, item) {


                    if (item.level == 1) {
                        html += '<hr class="sidebar-divider" style="margin:2px !important">' +
                            '<li class="nav-item">' +
                            '<a class="nav-link collapsed" href = "#" data-toggle="collapse" data-target="#' + item.collapseTarget + '" aria-expanded="true" aria-controls="collapseBootstrap"> ' +
                            '<i class="' + item.fontAwesome + '"></i>'
                            + '<span>' + item.menuText + '</span>'
                            + ' </a><div id="' + item.collapseTarget + '" class="collapse" aria-labelledby="headingBootstrap" data-parent="#accordionSidebar" style=""><div class="bg-white py-2 collapse-inner rounded">'

                    }

                    if (item.hasChild = true) {
                        var submenu = result.responseData.filter(x => x.parentId == item.menuId);
                        $.each(submenu, function (index1, item1) {

                            html += '<a class="collapse-item"  href="' + item1.mUrl + '"><i class="' + item1.fontAwesome + '"></i>  <span>' + item1.menuText + '</span></a>'

                        });
                        html += '</div></div > '
                        html += '</li>'

                    }

                });
                $(".menuList").html(html);
            } else {
                toastr.error(result.message)
            }
        },
        error: function (error) {
            toastr.error(error)
        },
        complete: () => {
            Closeloader();
        }
    });

}

getUrlParamVal = function (key) {

    var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
    return result && unescape(result[1]) || "";
};

function isNumberKey(evt) {

    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    } else {
        return true;
    }
};


//waitMsg = function (title) {

//    title = title == "" ? "Please Wait" : title;
//    title += " ...";

//    $("#loaderTitle").text(title);
//}

//waitMsg.show = function () {

//    $("#outerLoader").show();
//    $("#loader").show();
//}

//waitMsg.hide = function () {
//    $("#outerLoader").hide();
//    $("#loader").hide();
//}

$(document).ready(() => {


    showInitialToast();
    $('.fa-caret-down').click(function (event) {
        var stat = event.target.parentElement.nextElementSibling.style.display == 'block';
        if (stat) {
            event.target.parentElement.nextElementSibling.style.display = 'none';
        }
        else {
            event.target.parentElement.nextElementSibling.style.display = 'block';
        }
    });

});
