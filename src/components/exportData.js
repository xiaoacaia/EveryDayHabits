export default function exportData(startvalue,tableData) {
    console.log(startvalue);
    let aDate = new Date(Date.parse(startvalue));
    exportRaw(
        `${aDate.getFullYear()}年${aDate.getMonth() + 1
        }月${aDate.getDate()}日习惯表.txt`,
        JSON.stringify(tableData)
    );

}

function exportRaw(name, data) {
    var urlObject = window.URL || window.webkitURL || window;
    var export_blob = new Blob([data]);
    var save_link = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "a"
    );
    save_link.href = urlObject.createObjectURL(export_blob);
    save_link.download = name;
    fakeClick(save_link);
}


function fakeClick(obj) {
    var ev = document.createEvent("MouseEvents");
    ev.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
    );
    obj.dispatchEvent(ev);
}
