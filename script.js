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

            let code = decodedText;

            // استخراج رقم الدعوة من الرابط
            if(decodedText.includes("code=")){
                code = decodedText.split("code=")[1];
            }

            document.getElementById("code").value = code;

            scanner.stop();

            checkCode(code);
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
        "اكتب رقم الدعوة أولاً";

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


            fetch(
                SCRIPT_URL +
                "?action=checkIn&code=" +
                encodeURIComponent(code)
            );


            document.getElementById("result").innerHTML =
            "✅ تم الدخول<br><br>" +
            "الاسم: " + data.name +
            "<br>الحالة: تم الدخول";


        }else{


            document.getElementById("result").innerHTML =
            "❌ الدعوة غير موجودة";


        }


    })

    .catch(error=>{


        document.getElementById("result").innerHTML =
        "حدث خطأ في الاتصال";


    });

}
