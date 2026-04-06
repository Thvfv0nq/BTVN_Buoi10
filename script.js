// ================= CLASS =================
class SinhVien {
    constructor(name, msv) {
        this.name = name || "";
        this.msv = msv || "";
        this.khoa = this.layKhoa(); 
        this.khoaHoc = this.layKhoaHoc(); 
        this.email = this.taoEmail();
    }

    layKhoa() {
        if (!this.msv) return "Không xác định";

        let ma = this.msv.substring(3, 6);

        const map = {
            "404": "CNTT & KTS",
            "405": "Kinh doanh quốc tế",
            "406": "Luật",
            "407": "Kinh tế",
            "408": "Khoa học dữ liệu",
            "401": "Tài chính & Ngân hàng",
            "402": "Kế toán - kiểm toán",
            "403": "Quản trị kinh doanh",
            "751": "Ngoại ngữ"
        };

        return map[ma] || "Không xác định";
    }

    layKhoaHoc() {
        if (!this.msv) return "Không xác định";

        let year = this.msv.substring(0, 2);
        return "K" + year;
    }

    removeVietnameseTones(str) {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D")
            .replace(/[^a-zA-Z0-9\s]/g, "")
            .trim();
    }

    taoEmail() {
        if (!this.name || !this.msv) return "";

        let clean = this.removeVietnameseTones(this.name).toLowerCase();
        let parts = clean.split(/\s+/);

        let lastName = parts[parts.length - 1];
        let initials = "";

        for (let i = 0; i < parts.length - 1; i++) {
            initials += parts[i][0];
        }

        return lastName + initials + "." + this.msv.toLowerCase() + "@hvnh.edu.vn";
    }
}

// ================= LOAD FILE EXCEL =================
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("fileInput");
    if (input) {
        input.addEventListener("change", handleFile);
    }
});

function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        hienThi(json);
    };

    reader.readAsArrayBuffer(file);
}

// ================= HIỂN THỊ =================
function hienThi(data) {
    let tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    data.forEach(row => {
        let sv = new SinhVien(
            row["Họ tên"] || row["Ho ten"],
            row["Mã SV"] || row["Ma SV"]
        );

        let tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${sv.name}</td>
            <td>${sv.msv}</td>
            <td>${sv.khoa}</td>
            <td>${sv.khoaHoc}</td>
            <td>${sv.email}</td>
        `;

        tbody.appendChild(tr);
    });
}