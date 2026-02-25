import subprocess
import os
import customtkinter as ctk
from tkinter import filedialog, messagebox

# Cấu hình giao diện
ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

class AuroraEliteEncoder(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("Aurora Elite System - High-End JS Obfuscator")
        self.geometry("700x500")

        # Tiêu đề
        label = ctk.CTkLabel(self, text="HỆ THỐNG MÃ HÓA JS SIÊU CẤP", font=("Roboto", 22, "bold"), text_color="#2ecc71")
        label.pack(pady=20)

        # Chọn file
        self.entry_path = ctk.CTkEntry(self, placeholder_text="Chọn file JS cần bảo mật...", width=500)
        self.entry_path.pack(pady=10)

        btn_select = ctk.CTkButton(self, text="📁 Chọn File", command=self.browse)
        btn_select.pack(pady=5)

        # Khung cài đặt mã hóa mạnh
        self.frame_opt = ctk.CTkFrame(self)
        self.frame_opt.pack(pady=20, padx=20, fill="x")

        self.check_dead_code = ctk.CTkCheckBox(self.frame_opt, text="Thêm mã giả (Dead Code Injection) - Làm AI bối rối")
        self.check_dead_code.select()
        self.check_dead_code.pack(pady=5, padx=20, anchor="w")

        self.check_rotate = ctk.CTkCheckBox(self.frame_opt, text="Xáo trộn mảng chuỗi (String Array Rotate) - Giống file mẫu")
        self.check_rotate.select()
        self.check_rotate.pack(pady=5, padx=20, anchor="w")

        self.check_self_defend = ctk.CTkCheckBox(self.frame_opt, text="Tự bảo vệ (Self Defending) - Chống làm đẹp code")
        self.check_self_defend.select()
        self.check_self_defend.pack(pady=5, padx=20, anchor="w")

        # Nút chạy
        btn_run = ctk.CTkButton(self, text="⚡ BẮT ĐẦU MÃ HÓA ELITE", fg_color="#27ae60", hover_color="#1e8449",
                                font=("Roboto", 18, "bold"), height=60, command=self.run_elite_obfuscate)
        btn_run.pack(pady=20, fill="x", padx=100)

    def browse(self):
        path = filedialog.askopenfilename(filetypes=[("JS files", "*.js")])
        if path:
            self.entry_path.delete(0, "end")
            self.entry_path.insert(0, path)

    def run_elite_obfuscate(self):
        input_file = self.entry_path.get()
        if not input_file:
            messagebox.showwarning("Chú ý", "Vui lòng chọn file!")
            return

        output_file = input_file.replace(".js", "_ELITE.js")
        
        # Cấu hình các tham số cực mạnh để giống file content.js của bạn
        cmd = [
            "javascript-obfuscator", input_file,
            "--output", output_file,
            "--compact", "true",                               # Nén 1 dòng
            "--self-defending", "true",                        # Chống bị format lại
            "--dead-code-injection", "true",                   # Bơm mã rác
            "--string-array", "true",                          # Gom chuỗi vào mảng
            "--string-array-rotate", "true",                   # Xáo trộn mảng (Quan trọng)
            "--string-array-encoding", "base64",               # Mã hóa base64 trong mảng
            "--string-array-threshold", "1",                   # Áp dụng cho 100% chuỗi
            "--control-flow-flattening", "true",               # Băm nhỏ luồng chạy (Switch-case)
            "--control-flow-flattening-threshold", "1",        # Áp dụng 100%
            "--identifier-names-generator", "hexadecimal",     # Đặt tên biến kiểu _0xabc123
            "--rename-globals", "false"                        # Giữ nguyên tên hàm chính để Extension nhận diện
        ]
        
        try:
            subprocess.run(cmd, check=True, shell=True)
            messagebox.showinfo("Thành công", f"File Elite đã được tạo!\n{output_file}")
        except:
            messagebox.showerror("Lỗi", "Hãy cài đặt bằng lệnh: npm install -g javascript-obfuscator")

if __name__ == "__main__":
    app = AuroraEliteEncoder()
    app.mainloop()