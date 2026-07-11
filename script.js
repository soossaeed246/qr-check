let scanner;

document.getElementById("scanBtn").onclick = function(){

    if(scanner) return;

    scanner = new Html5Qrcode("reader");

    scanner.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: 250
        },
        (decodedText)=>{

            document.getElementById("code").value = decodedText;

            scanner.stop();

            checkCode(decodedText);
        }
    )
    .catch(err=>{
        document.getElementById("result").innerHTML =
        "تعذر تشغيل الكاميرا";
    });
};



document.getElementById("checkBtn").onclick=function(){

    let code =
    document.getElementById("code").value.trim();

    if(code===""){
        document.getElementById("result").innerHTML =
        "اكتب الكود أولاً";
        return;
    }

    checkCode(code);
};



function checkCode(code){

    document.getElementById("result").innerHTML =
    "جاري التحقق...";


    fetch(
        SCRIPT_URL +
        "?code=" +
        encodeURIComponent(code)
    )
    .then(res=>res.json())
    .then(data=>{


        if(data.status==="ok"){

            document.getElementById("result").innerHTML =
            "✅ تم التحقق<br><br>" +
            "الاسم: " + data.name +
            "<br>المرافقين: " + data.guests;

        }else{

            document.getElementById("result").innerHTML =
            "❌ الدعوة غير موجودة";

        }


    })
    .catch(()=>{

        document.getElementById("result").innerHTML =
        "حدث خطأ في الاتصال";

    });

}
