window.onload = function () {
    {
        document.getElementById("button1").onclick = function () {
            addRow("mainpatbl")
        }
        document.getElementById("numPerCaseMain")
            .addEventListener("keyup", function (event) {
                event.preventDefault();
                if (event.keyCode === 13) {
                    document.getElementById("button10").click();
                }
            });    
        document.getElementById("button10").onclick = function () {
            addMultiRows1("mainpatbl")
        }
        document.getElementById("numPerCaseSide")
            .addEventListener("keyup", function (event) {
                event.preventDefault();
                if (event.keyCode === 13) {
                    document.getElementById("button12").click();
                }
            });
        document.getElementById("button12").onclick = function () {
            addMultiRows2("sidepatbl")
        }
        document.getElementById("button2").onclick = function () {
            addRow("sidepatbl")
        }
        document.getElementById("button3").onclick = function () {
            addSplit("mainpatbl")
        }
        document.getElementById("button4").onclick = function () {
            addSplit("sidepatbl")
        }
        document.getElementById("button5").onclick = function () {
            deleteRow("mainpatbl")
        }
        document.getElementById("button6").onclick = function () {
            deleteRow("sidepatbl")
        }
        document.getElementById("button7").onclick = function () {
            window.print()
        }
        document.getElementById("button8").onclick = function () {
            addRig("mainrigtbl")
        }
        document.getElementById("button9").onclick = function () {
            addRig("siderigtbl")
        }
        document.getElementById("button15").onclick = function () {
            deleteRow("mainrigtbl")
        }
        document.getElementById("button16").onclick = function () {
            deleteRow("siderigtbl")
        }
        document.getElementById("button40").onclick = function () {
            removeElement("logo")
        }
        document.getElementById("sysTxt")
            .addEventListener("keyup", function (event) {
                event.preventDefault();
                if (event.keyCode === 13) {
                    document.getElementById("button21").click();
                }
            });
        {
            document.getElementById("button21").onclick = function () {
                addFooter()
            }
        }

    }
}



