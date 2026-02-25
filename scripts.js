//----------nestle_yep-----------
//link ggSheet: https://docs.google.com/spreadsheets/d/1V_umWPqOIT08zXD6eM4Na2Z0URz-ZAue80pb4W9bM1M/edit?gid=0#gid=0


//----------------------------- 2025 --------------------------------

var n = 0;
function submitform(data) {
    console.log("data from page ", data);
    let datatoSheet = new FormData();
    const name = data;
    datatoSheet.append("name", name);
    datatoSheet.append("bu", getCurrentDateTime());

    console.log("submitform ", datatoSheet);

    fetch(
        "https://script.google.com/macros/s/AKfycbxZOIVstKYWVUGCJRSh9jybwUqYi1VQH98fdcXmWVygOTY-Uqq8UExBRBpDUAh4LTM-/exec",
        {
            method: "POST",
            body: datatoSheet,
        }
    )
        .then((res) => res.text())
        .then((status) => {
            console.log(status);
            n++
            console.log("tme click",n)
            if(status=='Success')
                {thankyou(name)}
            else{
                alert("Hãy nhập lại thông tin để được check in");
                document.getElementById("btnRun").style.pointerEvents = "auto";
                document.getElementById("btnRun").style.opacity = "1";
            }
        });
}
function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString("vi-VN", {
        hour12: false
    });
}

console.log(getCurrentDateTime());
function postData(dataset) {


    const listPost = [
        {IDEMP:'NULL', NAME: dataset, BU: getCurrentDateTime() }
    ];
    const jsonData = JSON.stringify(listPost);
    fetch(urlRoot + "/EMPLOYEE/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
        body: jsonData,
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Success:", data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    console.log(jsonData);
}
//----------------------------- 2025 --------------------------------
// function submitform(data, time_draw, gift) {
//     const liststorage = JSON.parse(sessionStorage.getItem("employee"));
//     const id = liststorage[0].IDEMP;
//     console.log("submitform", data);
//     let datatoSheet = new FormData();

//     fetch(url_emp + id, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json; charset=UTF-8",
//         },
//     })
//         .then((res) => res.text())
//         .then((status) => {
//             console.log(status);
//         });
//     const name = liststorage[0].NAME;
//     const bu = liststorage[0].BU;
//     const status = data.CONTENTS;
//     const result = data.NUMB;
//     datatoSheet.append("id", id);
//     datatoSheet.append("lastname", name);
//     datatoSheet.append("bu", bu);
//     datatoSheet.append("timedraw", time_draw);
//     datatoSheet.append("gift", gift);
//     datatoSheet.append("result", result);
//     datatoSheet.append("status", status);
//     console.log("submitform", datatoSheet);

//     fetch(
//         "https://script.google.com/macros/s/AKfycbxZ1mDaicZIRS4bSeQ79wocLEswK7pqm0BZYLKuPXHTZsMcfzLhzwX-wTuqA8MeC85a1A/exec",
//         {
//             method: "POST",
//             body: datatoSheet,
//         }
//     )
//         .then((res) => res.text())
//         .then((status) => {
//             console.log(status);
//         });
// }
function fetchGetbyName(name) {
    fetch(url_findbyname + name, {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    }).then((res) => {
        if (res.status == 503) {
            let text = "Vui lòng tải lại trang !";
            if (confirm(text) == true) {
                find_MANVbyName()
            } else {
                find_MANVbyName()
            }
        }
        else {
            res.json()
                .then((result) => {
                    console.log("result", result)
                    if (result.length == 0) {
                        alert("Xin vui lòng kiểm tra lại Tên và ngày sinh");
                    }
                    if (result[0].RESULT == "x" || result[0].RESULT == "X") {
                        thankyou()
                    }
                    else {
                        id = result[0].IDEMP;
                        sessionStorage.idemp = id;
                        thankyou()
                        UpdateStatusCheckin(result[0].ID, name)
                    }

                })
        }
    })
}
function getUserData(name, date) {
    let id;
    sessionStorage.idemp = id;
    fetch(url_emp + name + "/" + date, {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
    }).then((res) => {
        res.json().then((data) => {
            console.log("data", data)

            if (data.length == 0) {
                fetchGetbyName(name)
            } else if (res.status == 503) {
                let text = "Vui lòng tải lại trang !";
                if (confirm(text) == true) {
                    find_MANVbyName()
                } else {
                    find_MANVbyName()
                }
            }
            else {
                id = data[0].IDEMP;
                sessionStorage.idemp = id;
                thankyou(name)
                UpdateStatusCheckin(data[0].IDEMP, name)
                // window.location.href = `./detail.html?id=${id}`;
            }
        });
        // console.log(res.status)
    });
    // window.location.href = `./detail.html?id=${id}`;
}
function tohome() {
    window.location.href = "./index.html";
}
const urlRoot = "http://localhost:3000"
var url_emp = urlRoot + "/employee/";
var url_numb = urlRoot + "/luckynumber/";
var url_findbyname = urlRoot + "/EMPLOYEENAME/";

function find_MANVbyName() {
        
    var datefromDOM = document.getElementById("dob").value;
    var NAME = document.getElementById("msnv").value;
    let dateValue = new Date(datefromDOM);
    let day = dateValue.getDate();
    let month = dateValue.getMonth() + 1;
    console.log(dateValue.getMonth().toString().length)
    if (day.toString().length == 1) {
        day = '0' + day;
    }
    if (month.toString().length == 1) {
        month = '0' + month;
    }
    let year = dateValue.getFullYear();
    var date = `${day}-${month}-${year}`;
    console.log(NAME, date);

    if (NAME == undefined || NAME == null || NAME == "" || NAME == " ") {
        alert("Hãy nhập thông tin để được check in");
    } else {
        document.getElementById("btnRun").style.pointerEvents = "none";
        document.getElementById("btnRun").style.opacity = "0.5";
        document.getElementById("loader").style.display = "flex";

        submitform(NAME);
        postData(NAME)
    }
}

function xoa_dau(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}

function find_MANV() {
    var MANV = document.getElementById("msnv").value;
    console.log(MANV);
    if (MANV == undefined || MANV == null || MANV == "") {
        alert("Chưa nhập mã nhân viên");
    } else {
        getUserData(MANV.toUpperCase());
    }
}
function thankyou(name) {
    // const timedraw = document.getElementById("numbdraw");
    // document.getElementById("timedraw").style.display = "none";
    // document.getElementById("step-bottle").style.display = "none";
    document.getElementById("YepNestle").style.display = "none";
    document.getElementById("step-thankyou").style.display = "flex";
    document.getElementById("loader").style.display = "none";

    const notice = document.getElementById("noticestep4-1");
    notice.innerHTML = "CHECK-IN SUCCESS <p style='padding-top: 2%;'>ENJOY THE PARTY</p>";
    console.log(name + "Check in done");
    // console.log("so luot rut cua ban: ", timedraw);
}

function UpdateStatusCheckin(id, name) {
    var data_temp = { RESULT: "x" };
    console.log("id function UpStatus: ", id)
    fetch(url_emp + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(data_temp),
    }).then((res) => {
        console.log("Update ", res)
        const notice = document.getElementById("noticestep4-1");
        notice.innerHTML = "Chúc " + name + " tận hưởng tiệc vui. Checkin thành công";
        console.log(name + "Check in done");
    });
}

