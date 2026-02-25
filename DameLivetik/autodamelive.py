import tkinter as tk
from tkinter import messagebox
import yt_dlp
import cv2
from PIL import Image, ImageTk
import threading
import os
import re
import time
from ffpyplayer.player import MediaPlayer

class GeminiUltimatePlayer(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Gemini Pro Player - Sync & High Quality")
        self.geometry("900x800")
        self.configure(bg="#1a1a1a")

        # --- Biến điều khiển ---
        self.cap = None
        self.audio_player = None
        self.lyrics = []
        self.is_playing = False
        self.is_paused = False
        self.video_path = ""

        # --- Giao diện ---
        self.header = tk.Frame(self, bg="#1a1a1a", pady=10)
        self.header.pack(fill="x")
        
        self.url_entry = tk.Entry(self.header, width=50, font=("Arial", 12))
        self.url_entry.pack(side=tk.LEFT, padx=20)
        self.url_entry.insert(0, "Dán link vào đây...")

        self.btn_run = tk.Button(self.header, text="TẢI & PHÁT", bg="#27ae60", fg="white", 
                                 width=12, font=("Arial", 10, "bold"), command=self.start_thread)
        self.btn_run.pack(side=tk.LEFT, padx=5)

        self.btn_pause = tk.Button(self.header, text="DỪNG/PHÁT", bg="#e67e22", fg="white", 
                                   width=12, font=("Arial", 10, "bold"), command=self.toggle_pause)
        self.btn_pause.pack(side=tk.LEFT, padx=5)

        # Canvas hiển thị video
        self.canvas = tk.Canvas(self, bg="black", width=800, height=450, highlightthickness=0)
        self.canvas.pack(pady=10)

        # Lời bài hát
        self.lyric_label = tk.Label(self, text="🎵 Sẵn sàng", 
                                    font=("Arial", 20, "bold"), fg="yellow", bg="#1a1a1a", wraplength=800)
        self.lyric_label.pack(pady=20)

    def start_thread(self):
        url = self.url_entry.get().strip()
        if not url or "Dán link" in url:
            messagebox.showwarning("Lỗi", "Vui lòng nhập link video!")
            return
        
        self.stop_current_video() # Dừng video cũ nếu đang chạy
        self.btn_run.config(state="disabled", text="ĐANG TẢI...")
        threading.Thread(target=self.download_and_prepare, args=(url,), daemon=True).start()

    def download_and_prepare(self, url):
        self.video_path = "temp_video.mp4"
        ydl_opts = {
            'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]', 
            'outtmpl': self.video_path,
            'writesubtitles': True,
            'writeautomaticsub': True,
            'subtitleslangs': ['vi'],
            'overwrites': True,
            'quiet': True,
        }
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])
            
            self.lyrics = []
            sub_file = "temp_video.vi.srt"
            if os.path.exists(sub_file):
                self.lyrics = self.parse_srt(sub_file)
            
            self.after(0, self.play_media)
        except Exception as e:
            self.after(0, lambda: messagebox.showerror("Lỗi", f"Không tải được: {e}"))
            self.after(0, lambda: self.btn_run.config(state="normal", text="TẢI & PHÁT"))

    def parse_srt(self, path):
        try:
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            matches = re.findall(r'(\d{2}:\d{2}:\d{2},\d{3}) --> .*?\n(.*?)(?=\n\n|\n$|$)', content, re.DOTALL)
            return [[self.time_to_ms(m[0]), m[1].replace('\n', ' ')] for m in matches]
        except: return []

    def time_to_ms(self, t_str):
        h, m, s, ms = map(int, re.split('[: ,]', t_str))
        return (h*3600 + m*60 + s) * 1000 + ms

    def play_media(self):
        self.cap = cv2.VideoCapture(self.video_path)
        self.fps = self.cap.get(cv2.CAP_PROP_FPS)
        # Khởi tạo audio player với âm lượng mặc định
        self.audio_player = MediaPlayer(self.video_path)
        
        self.is_playing = True
        self.is_paused = False
        self.btn_run.config(state="normal", text="TẢI & PHÁT")
        self.update_frame()

    def toggle_pause(self):
        if not self.audio_player: return
        self.is_paused = not self.is_paused
        self.audio_player.set_pause(self.is_paused)

    def stop_current_video(self):
        self.is_playing = False
        if self.cap: self.cap.release()
        if self.audio_player: self.audio_player = None
        self.canvas.delete("all")

    def update_frame(self):
        if not self.is_playing or self.is_paused:
            if self.is_paused and self.is_playing:
                self.after(100, self.update_frame) # Đợi khi đang tạm dừng
            return

        # Lấy thời gian thực từ Audio (tính bằng giây)
        audio_pts = self.audio_player.get_pts()
        elapsed_ms = audio_pts * 1000

        # Tính toán khung hình cần hiển thị để đuổi kịp nhạc
        target_frame = int(audio_pts * self.fps)
        current_frame = self.cap.get(cv2.CAP_PROP_POS_FRAMES)

        # Nếu video chậm hơn nhạc > 1 frame, ép nhảy tới frame đó
        if target_frame > current_frame:
            self.cap.set(cv2.CAP_PROP_POS_FRAMES, target_frame)

        ret, frame = self.cap.read()
        if ret:
            # Resize chất lượng cao
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame = cv2.resize(frame, (800, 450), interpolation=cv2.INTER_AREA)
            
            img = Image.fromarray(frame)
            self.img_tk = ImageTk.PhotoImage(image=img)
            self.canvas.create_image(0, 0, anchor=tk.NW, image=self.img_tk)
            
            # Đồng bộ Lyric
            current_text = ""
            for start_ms, text in self.lyrics:
                if elapsed_ms >= start_ms:
                    current_text = text
                else: break
            self.lyric_label.config(text=current_text)

            # Kiểm tra lại sau 10ms (tăng tần suất để mượt hơn)
            self.after(10, self.update_frame)
        else:
            self.stop_current_video()
            self.lyric_label.config(text="🎵 Đã phát xong!")

if __name__ == "__main__":
    app = GeminiUltimatePlayer()
    app.mainloop()