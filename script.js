// مكتبة لتشفير النصوص
function hashName(name) {
    return btoa(name); // تشفير Base64
}

function validateName(hashedName, originalName) {
    return hashName(originalName) === hashedName;
}

function generateAndSaveQRCode() {
    const studentName = document.getElementById("studentName").value.trim();
    if (studentName === "") {
        alert("الرجاء إدخال اسم الطالب");
        return;
    }

    const hashedName = hashName(studentName);
    const qrLink = `https://iraqisurvey.github.io/iq/graduate.html?name=${encodeURIComponent(studentName)}&hash=${hashedName}`;

    // توليد رمز QR
    const qrcodeContainer = document.getElementById("qrcode");
    qrcodeContainer.innerHTML = "";
    new QRCode(qrcodeContainer, {
        text: qrLink,
        width: 128,
        height: 128
    });

    // إظهار رابط التحميل
    const downloadLink = document.getElementById("downloadLink");
    downloadLink.href = qrLink;
    downloadLink.style.display = "block";

    // إضافة الطالب إلى قائمة الخريجين
    addGraduateToList(studentName, qrLink);
}

function addGraduateToList(name, qrLink) {
    const graduatesList = document.getElementById("graduatesList");
    const listItem = document.createElement("li");
    listItem.innerHTML = `${name} - <a href="${qrLink}" target="_blank">عرض الشهادة</a>`;
    graduatesList.appendChild(listItem);
}
