/* Print It!*/

function printDiv(divName) {
    var divEl = document.getElementById(divName);
    var allInputs = divEl.querySelectorAll("input,select,textarea");
    for (var counter = 0; counter < allInputs.length; counter++) {
        var input = allInputs.item(counter);
        input.setAttribute("value", input.value);
    }

    var printContents = document.getElementById(divName).innerHTML;
    var inpText = document.getElementsByTagName("input")[0].value;
    var originalContents = document.body.innerHTML;
    printContents += inpText;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;

}





