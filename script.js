function generateAndSaveQRCode() {
    const studentName = document.getElementById("studentName").value.trim();
    const qrCodeContainer = document.getElementById("qrcode");
    const downloadLink = document.getElementById("downloadLink");
    qrCodeContainer.innerHTML = ""; // مسح المحتوى السابق
    downloadLink.style.display = "none";

    if (studentName === "") {
        alert("يرجى إدخال اسم الطالب!");
        return;
    }

    // توليد رابط صفحة التخرج
    const url = `graduate.html?name=${encodeURIComponent(studentName)}`;

    // توليد رمز QR
    const qrCode = new QRCode(qrCodeContainer, {
        text: url,
        width: 128,
        height: 128
    });

    // تحويل رمز QR إلى صورة وتحميله
    setTimeout(() => {
        qrCodeContainer.querySelector('canvas').toBlob(blob => {
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.style.display = "block";
        });
    }, 500); // الانتظار قليلاً حتى يتم توليد الرمز QR

    // حفظ بيانات الطالب في Local Storage
    saveGraduate(studentName, url);
    displayGraduates();
}

// حفظ اسم الطالب والرابط في Local Storage
function saveGraduate(name, url) {
    let graduates = JSON.parse(localStorage.getItem("graduates")) || [];
    graduates.push({ name: name, qrUrl: url });
    localStorage.setItem("graduates", JSON.stringify(graduates));
}

// عرض قائمة الخريجين المحفوظة
function displayGraduates() {
    const graduatesList = document.getElementById("graduatesList");
    graduatesList.innerHTML = "";

    const graduates = JSON.parse(localStorage.getItem("graduates")) || [];
    graduates.forEach(graduate => {
        const listItem = document.createElement("li");
        listItem.textContent = `الطالب: ${graduate.name}`;
        
        // رابط رمز QR عند النقر
        const qrLink = document.createElement("a");
        qrLink.href = graduate.qrUrl;
        qrLink.target = "_blank";
        qrLink.textContent = "عرض شهادة التخرج";
        
        listItem.appendChild(document.createTextNode(" "));
        listItem.appendChild(qrLink);
        graduatesList.appendChild(listItem);
    });
}

// تحميل قائمة الخريجين عند فتح الصفحة
document.addEventListener("DOMContentLoaded", displayGraduates);
