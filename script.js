const baseURL = "https://iraqisurvey.github.io/iq/graduate.html";

// تحميل بيانات الخريجين عند فتح الصفحة
window.onload = function () {
    loadGraduatesFromStorage();
};

// دالة التشفير
function hashName(name) {
    return btoa(name); // تحويل النص إلى Base64
}

// دالة توليد رمز QR وحفظ بيانات الخريج
function generateAndSaveQRCode() {
    const studentName = document.getElementById("studentName").value.trim();

    if (!studentName) {
        alert("الرجاء إدخال اسم الطالب");
        return;
    }

    const hashedName = hashName(studentName);
    const qrLink = `${baseURL}?name=${encodeURIComponent(studentName)}&hash=${hashedName}`;

    // تخزين بيانات الطالب في localStorage
    saveGraduateToStorage(studentName, qrLink);

    // تحديث الشبكة
    addGraduateToGrid(studentName, qrLink);

    // إنشاء رمز QR
    const qrcodeContainer = document.getElementById("qrcode");
    qrcodeContainer.innerHTML = ""; // تنظيف الحاوية قبل إنشاء رمز جديد
    new QRCode(qrcodeContainer, {
        text: qrLink,
        width: 150,
        height: 150,
    });

    // إعداد رابط التحميل
    const qrCanvas = qrcodeContainer.querySelector("canvas");
    const downloadLink = document.getElementById("downloadLink");
    downloadLink.href = qrCanvas.toDataURL("image/png");
    downloadLink.style.display = "inline-block";

    alert("تم توليد رمز QR وحفظ البيانات بنجاح!");
}

// دالة حفظ بيانات الخريج في localStorage
function saveGraduateToStorage(name, link) {
    let graduates = JSON.parse(localStorage.getItem("graduates")) || [];
    
    // التحقق إذا كان الاسم مضافًا مسبقًا
    const exists = graduates.some((graduate) => graduate.name === name);
    if (exists) {
        alert("تمت إضافة هذا الطالب مسبقًا.");
        return;
    }

    // إضافة الخريج الجديد
    graduates.push({ name, link });
    localStorage.setItem("graduates", JSON.stringify(graduates));
}

// دالة تحميل بيانات الخريجين من localStorage
function loadGraduatesFromStorage() {
    const graduates = JSON.parse(localStorage.getItem("graduates")) || [];

    graduates.forEach((graduate) => {
        addGraduateToGrid(graduate.name, graduate.link);
    });
}

// دالة إضافة الخريج إلى الشبكة
function addGraduateToGrid(name, qrLink) {
    const graduatesGrid = document.getElementById("graduatesGrid");

    // التحقق إذا كان الطالب مضافاً بالفعل
    const existingGraduate = [...graduatesGrid.children].find((child) =>
        child.querySelector("h3")?.textContent === name
    );
    if (existingGraduate) return;

    // إنشاء عنصر جديد للخريج
    const qrDiv = document.createElement("div");
    qrDiv.className = "graduate";
    qrDiv.innerHTML = `
        <h3>${name}</h3>
        <div class="qr-container" id="qr-${name}"></div>
        <a href="${qrLink}" target="_blank" class="view-link">عرض الشهادة</a>
    `;

    // إنشاء رمز QR للخريج وإضافته
    new QRCode(qrDiv.querySelector(`#qr-${name}`), {
        text: qrLink,
        width: 150,
        height: 150,
    });

    // إدراج العنصر في الشبكة
    graduatesGrid.appendChild(qrDiv);
}
